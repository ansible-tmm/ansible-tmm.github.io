#!/usr/bin/env python3
"""Sync team blog posts from Red Hat upstream sources into content/blog/."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
import yaml

from blog_extractors import (
    USER_AGENT,
    extract_body_html,
    extract_metadata,
    html_to_markdown,
)

ROOT = Path(__file__).resolve().parent.parent
TEAM_JS = ROOT / "js" / "team.js"
CONTENT_DIR = ROOT / "content" / "blog"
DATA_DIR = ROOT / "data"
INDEX_PATH = DATA_DIR / "blog-index.json"
STATE_PATH = DATA_DIR / "blog-sync-state.json"
SOURCES_PATH = DATA_DIR / "blog-sources.json"

MIN_DATE = "2018-01-01"
SOLR_URL = "https://www.redhat.com/rhdc/jsonapi/solr_search/blog_author_list"
DEV_ATOM_URL = "https://developers.redhat.com/blog/feed/atom/"
SKIP_URL_PATTERNS = ("/interactive-demo/",)

ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}


@dataclass
class TeamMember:
    slug: str
    name: str
    redhat: str | None = None
    redhat_author_nid: str | None = None


@dataclass
class DiscoveredPost:
    title: str
    url: str
    published: str
    updated: str
    description: str
    source: str
    author_slugs: list[str]
    author_names: list[str]


def log(message: str) -> None:
    print(message, flush=True)


def load_team_members() -> list[TeamMember]:
    text = TEAM_JS.read_text(encoding="utf-8")
    team_match = re.search(r"const TEAM = \[(.*)\];\s*$", text, re.DOTALL)
    if not team_match:
        raise ValueError("Could not parse TEAM array from js/team.js")

    members: list[TeamMember] = []
    blocks = re.split(r"\n  \{", team_match.group(1))
    for block in blocks:
        slug_match = re.search(r"slug:\s*'([^']+)'", block)
        name_match = re.search(r"name:\s*'((?:\\'|[^'])*)'", block)
        redhat_match = re.search(r"redhat:\s*'([^']+)'", block)
        nid_match = re.search(r"redhatAuthorNid:\s*'([^']+)'", block)
        if not slug_match or not name_match:
            continue
        name = name_match.group(1).replace("\\'", "'")
        members.append(
            TeamMember(
                slug=slug_match.group(1),
                name=name,
                redhat=redhat_match.group(1) if redhat_match else None,
                redhat_author_nid=nid_match.group(1) if nid_match else None,
            )
        )
    return members


def session() -> requests.Session:
    sess = requests.Session()
    sess.headers.update({"User-Agent": USER_AGENT})
    return sess


def fetch_author_nid(sess: requests.Session, member: TeamMember) -> str | None:
    if member.redhat_author_nid:
        return member.redhat_author_nid
    if not member.redhat:
        return None
    response = sess.get(member.redhat, timeout=60)
    response.raise_for_status()
    match = re.search(r'"blogAuthorNid":"(\d+)"', response.text)
    return match.group(1) if match else None


def discover_redhat_posts(sess: requests.Session, member: TeamMember, author_nid: str) -> list[DiscoveredPost]:
    posts: list[DiscoveredPost] = []
    page = 0
    while True:
        params = {
            "fq": f'post_author_nids:"{author_nid}"',
            "page": page,
            "rows": 10,
        }
        response = sess.get(SOLR_URL, params=params, timeout=60)
        response.raise_for_status()
        body = response.json().get("body", {})
        docs = body.get("docs", [])
        if not docs:
            break

        for doc in docs:
            post_date = (doc.get("post_date") or "")[:10]
            if post_date and post_date < MIN_DATE:
                continue
            url = doc.get("url", "")
            if should_skip_url(url):
                continue
            posts.append(
                DiscoveredPost(
                    title=doc.get("title", ""),
                    url=doc.get("url", ""),
                    published=post_date,
                    updated=(doc.get("updated") or doc.get("post_date") or "")[:10],
                    description=doc.get("description", ""),
                    source="redhat",
                    author_slugs=[member.slug],
                    author_names=doc.get("post_authors", []) or [member.name],
                )
            )

        page += 1
        if page * 10 >= body.get("numFound", 0):
            break

    return posts


def discover_developer_posts(sess: requests.Session, members: list[TeamMember]) -> list[DiscoveredPost]:
    posts: list[DiscoveredPost] = []
    try:
        response = sess.get(DEV_ATOM_URL, timeout=60)
        response.raise_for_status()
    except requests.RequestException as exc:
        log(f"Warning: could not fetch developers.redhat.com Atom feed: {exc}")
        return posts

    try:
        root = ET.fromstring(response.content)
    except ET.ParseError as exc:
        log(f"Warning: could not parse developers.redhat.com Atom feed: {exc}")
        return posts

    names_by_lower = {member.name.lower(): member for member in members}
    slugs_by_lower = {member.slug.lower(): member for member in members}

    for entry in root.findall("atom:entry", ATOM_NS):
        title = (entry.findtext("atom:title", default="", namespaces=ATOM_NS) or "").strip()
        link_el = entry.find("atom:link[@rel='alternate']", ATOM_NS) or entry.find("atom:link", ATOM_NS)
        url = link_el.get("href") if link_el is not None else ""
        if not url:
            continue
        if should_skip_url(url):
            continue

        published = (entry.findtext("atom:published", default="", namespaces=ATOM_NS) or "")[:10]
        updated = (entry.findtext("atom:updated", default="", namespaces=ATOM_NS) or published)[:10]
        if published and published < MIN_DATE:
            continue

        description = (entry.findtext("atom:summary", default="", namespaces=ATOM_NS) or "").strip()
        matched_members: list[TeamMember] = []
        for author in entry.findall("atom:author", ATOM_NS):
            author_name = (author.findtext("atom:name", default="", namespaces=ATOM_NS) or "").strip()
            if author_name.lower() in names_by_lower:
                matched_members.append(names_by_lower[author_name.lower()])

        if not matched_members:
            continue

        posts.append(
            DiscoveredPost(
                title=title,
                url=url,
                published=published,
                updated=updated,
                description=description,
                source="developers",
                author_slugs=[member.slug for member in matched_members],
                author_names=[member.name for member in matched_members],
            )
        )

    return posts


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/")
    return path.split("/")[-1]


def should_skip_url(url: str) -> bool:
    return any(pattern in url for pattern in SKIP_URL_PATTERNS)


def dedupe_posts(posts: list[DiscoveredPost]) -> list[DiscoveredPost]:
    by_url: dict[str, DiscoveredPost] = {}
    for post in posts:
        key = post.url.rstrip("/")
        existing = by_url.get(key)
        if not existing:
            by_url[key] = post
            continue
        merged_slugs = sorted(set(existing.author_slugs + post.author_slugs))
        merged_names = sorted(set(existing.author_names + post.author_names))
        by_url[key] = DiscoveredPost(
            title=existing.title or post.title,
            url=existing.url,
            published=existing.published or post.published,
            updated=max(existing.updated, post.updated),
            description=existing.description or post.description,
            source=existing.source,
            author_slugs=merged_slugs,
            author_names=merged_names,
        )
    return list(by_url.values())


def load_state() -> dict[str, Any]:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {"posts": {}}


def save_state(state: dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def content_hash(markdown_body: str, frontmatter: dict[str, Any]) -> str:
    payload = yaml.safe_dump(frontmatter, sort_keys=True) + "\n" + markdown_body
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def match_team_authors(metadata_authors: list[dict[str, str]], members: list[TeamMember]) -> list[dict[str, str]]:
    by_slug = {member.slug: member for member in members}
    by_name = {member.name.lower(): member for member in members}
    matched: list[dict[str, str]] = []
    seen: set[str] = set()

    for author in metadata_authors:
        slug = author.get("slug", "")
        name = author.get("name", "")
        member = by_slug.get(slug) or by_name.get(name.lower())
        if member and member.slug not in seen:
            matched.append({"slug": member.slug, "name": member.name})
            seen.add(member.slug)

    return matched


def sync_post(
    sess: requests.Session,
    post: DiscoveredPost,
    members: list[TeamMember],
    state: dict[str, Any],
    full_backfill: bool,
) -> dict[str, Any] | None:
    slug = slug_from_url(post.url)
    state_entry = state["posts"].get(slug, {})
    if (
        not full_backfill
        and state_entry.get("source_url") == post.url
        and state_entry.get("updated") == post.updated
    ):
        return None

    response = sess.get(post.url, timeout=60)
    response.raise_for_status()
    metadata = extract_metadata(response.text, post.url)
    body_html = extract_body_html(response.text, post.url)
    markdown_body = html_to_markdown(body_html)

    authors = match_team_authors(
        [{"name": name, "slug": slug_name} for name, slug_name in zip(post.author_names, post.author_slugs)],
        members,
    )
    if metadata.authors:
        metadata_authors = match_team_authors(metadata.authors, members)
        if metadata_authors:
            authors = metadata_authors
    if not authors:
        authors = [
            {"slug": member.slug, "name": member.name}
            for member in members
            if member.slug in post.author_slugs
        ]

    if not authors:
        log(f"Skipping {post.url}: no matching team authors")
        return None

    frontmatter = {
        "title": metadata.title or post.title,
        "slug": slug,
        "authors": authors,
        "published": metadata.published or post.published,
        "updated": metadata.updated or post.updated,
        "source": post.source,
        "source_url": post.url,
        "description": metadata.description or post.description,
        "topics": metadata.topics,
        "read_time_minutes": metadata.read_time_minutes,
        "synced_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    }

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    md_path = CONTENT_DIR / f"{slug}.md"
    md_content = "---\n" + yaml.safe_dump(frontmatter, sort_keys=False, allow_unicode=True) + "---\n\n" + markdown_body
    md_path.write_text(md_content, encoding="utf-8")

    digest = content_hash(markdown_body, frontmatter)
    state["posts"][slug] = {
        "source_url": post.url,
        "updated": frontmatter["updated"],
        "content_hash": digest,
        "synced_at": frontmatter["synced_at"],
    }

    return {
        "slug": slug,
        "title": frontmatter["title"],
        "description": frontmatter["description"],
        "published": frontmatter["published"],
        "updated": frontmatter["updated"],
        "authors": authors,
        "topics": frontmatter["topics"],
        "read_time_minutes": frontmatter["read_time_minutes"],
        "source": frontmatter["source"],
        "source_url": frontmatter["source_url"],
        "url": f"/blog/{slug}/",
    }


def build_index_from_markdown() -> list[dict[str, Any]]:
    posts: list[dict[str, Any]] = []
    if not CONTENT_DIR.exists():
        return posts

    for md_path in sorted(CONTENT_DIR.glob("*.md")):
        text = md_path.read_text(encoding="utf-8")
        if not text.startswith("---"):
            continue
        _, frontmatter_raw, _ = text.split("---", 2)
        frontmatter = yaml.safe_load(frontmatter_raw) or {}
        posts.append(
            {
                "slug": frontmatter.get("slug", md_path.stem),
                "title": frontmatter.get("title", ""),
                "description": frontmatter.get("description", ""),
                "published": frontmatter.get("published", ""),
                "updated": frontmatter.get("updated", ""),
                "authors": frontmatter.get("authors", []),
                "topics": frontmatter.get("topics", []),
                "read_time_minutes": frontmatter.get("read_time_minutes"),
                "source": frontmatter.get("source", ""),
                "source_url": frontmatter.get("source_url", ""),
                "url": f"/blog/{frontmatter.get('slug', md_path.stem)}/",
            }
        )

    posts.sort(key=lambda item: item.get("published", ""), reverse=True)
    return posts


def save_index(posts: list[dict[str, Any]]) -> None:
    payload = {
        "updated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "posts": posts,
    }
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def update_team_js_nids(member_nids: dict[str, str]) -> None:
    if not member_nids:
        return

    text = TEAM_JS.read_text(encoding="utf-8")
    for slug, nid in member_nids.items():
        pattern = rf"(slug:\s*'{re.escape(slug)}'[\s\S]*?)(redhat:\s*'[^']+',)"
        replacement = rf"\1redhatAuthorNid: '{nid}',\n    \2"
        if f"redhatAuthorNid: '{nid}'" in text:
            continue
        if re.search(rf"slug:\s*'{re.escape(slug)}'[\s\S]*?redhatAuthorNid:", text):
            text = re.sub(
                rf"(slug:\s*'{re.escape(slug)}'[\s\S]*?redhatAuthorNid:\s*)'[^']+'",
                rf"\1'{nid}'",
                text,
                count=1,
            )
        else:
            text, count = re.subn(pattern, replacement, text, count=1)
            if count == 0:
                log(f"Warning: could not update redhatAuthorNid for {slug}")

    TEAM_JS.write_text(text, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync team blog posts from Red Hat upstream sources.")
    parser.add_argument(
        "--full-backfill",
        action="store_true",
        help="Re-fetch all discovered posts regardless of sync state.",
    )
    args = parser.parse_args()
    full_backfill = args.full_backfill or os.environ.get("BLOG_FULL_BACKFILL", "").lower() in {"1", "true", "yes"}

    members = load_team_members()
    sync_members = [member for member in members if member.redhat]
    sess = session()
    state = load_state()
    discovered: list[DiscoveredPost] = []
    member_nids: dict[str, str] = {}

    for member in sync_members:
        try:
            author_nid = fetch_author_nid(sess, member)
        except requests.RequestException as exc:
            log(f"Warning: could not fetch author page for {member.name}: {exc}")
            continue
        if not author_nid:
            log(f"Warning: no blogAuthorNid found for {member.name}")
            continue
        member_nids[member.slug] = author_nid
        try:
            posts = discover_redhat_posts(sess, member, author_nid)
            discovered.extend(posts)
            log(f"Discovered {len(posts)} redhat.com posts for {member.name}")
        except requests.RequestException as exc:
            log(f"Warning: Solr discovery failed for {member.name}: {exc}")

    try:
        dev_posts = discover_developer_posts(sess, sync_members)
        discovered.extend(dev_posts)
        log(f"Discovered {len(dev_posts)} developers.redhat.com posts")
    except requests.RequestException as exc:
        log(f"Warning: developers.redhat.com discovery failed: {exc}")

    discovered = dedupe_posts(discovered)
    log(f"Total unique posts to sync: {len(discovered)}")

    synced_count = 0
    for post in discovered:
        try:
            result = sync_post(sess, post, members, state, full_backfill)
            if result:
                synced_count += 1
                log(f"Synced: {result['title']}")
        except Exception as exc:  # noqa: BLE001 - keep syncing remaining posts
            log(f"Error syncing {post.url}: {exc}")

    save_state(state)
    save_index(build_index_from_markdown())
    update_team_js_nids(member_nids)

    log(f"Done. Synced {synced_count} post(s). Index has {len(build_index_from_markdown())} post(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
