#!/usr/bin/env python3
"""Deterministic markdown enrichment for mirrored blog posts."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content" / "blog"
INDEX_PATH = ROOT / "data" / "blog-index.json"
RULES_PATH = ROOT / "data" / "blog-insert-rules.json"

ENRICHMENT_START = "<!-- blog-enrichment:start -->"
ENRICHMENT_END = "<!-- blog-enrichment:end -->"
RELATED_START = "<!-- blog-enrichment:related -->"
RELATED_END = "<!-- blog-enrichment:related-end -->"

CALLOUT_RE = re.compile(r"^> \[!callout\b", re.MULTILINE)
TOC_RE = re.compile(r"^> \[!toc\]", re.MULTILINE)
RELATED_RE = re.compile(r"^> \[!related\]", re.MULTILINE)
CHARS_THRESHOLD = 1200
MAX_TMM_CALLOUTS = 2
MAX_REDHAT_CALLOUTS = 1
MAX_PROMO_CALLOUTS = 2


@dataclass
class Block:
    kind: str
    text: str
    level: int = 0


def slugify_heading(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    return slug or "section"


def load_rules() -> list[dict[str, Any]]:
    if not RULES_PATH.exists():
        return []
    data = json.loads(RULES_PATH.read_text(encoding="utf-8"))
    return sorted(data.get("rules", []), key=lambda rule: rule.get("priority", 100))


def load_index_posts() -> list[dict[str, Any]]:
    if INDEX_PATH.exists():
        data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
        return data.get("posts", [])
    return []


def strip_enrichment(markdown: str) -> str:
    markdown = re.sub(
        re.escape(ENRICHMENT_START) + r"[\s\S]*?" + re.escape(ENRICHMENT_END) + r"\n*",
        "",
        markdown,
    )
    markdown = re.sub(
        re.escape(RELATED_START) + r"[\s\S]*?" + re.escape(RELATED_END) + r"\n*",
        "",
        markdown,
    )
    markdown = re.sub(r"^> \[!callout[^\n]*\n(?:>.*\n?)*", "", markdown, flags=re.MULTILINE)
    markdown = re.sub(r"^> \[!toc\][^\n]*\n(?:>.*\n?)*", "", markdown, flags=re.MULTILINE)
    markdown = re.sub(r"^> \[!related\][^\n]*\n(?:>.*\n?)*", "", markdown, flags=re.MULTILINE)
    return re.sub(r"\n{3,}", "\n\n", markdown).strip()


def parse_blocks(markdown: str) -> list[Block]:
    blocks: list[Block] = []
    lines = markdown.splitlines()
    index = 0

    while index < len(lines):
        line = lines[index]

        if not line.strip():
            index += 1
            continue

        if line.startswith("```"):
            fence_lines = [line]
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                fence_lines.append(lines[index])
                index += 1
            if index < len(lines):
                fence_lines.append(lines[index])
                index += 1
            blocks.append(Block("code", "\n".join(fence_lines)))
            continue

        if line.startswith("> [!"):
            quote_lines = [line]
            index += 1
            while index < len(lines) and (lines[index].startswith(">") or not lines[index].strip()):
                if lines[index].strip():
                    quote_lines.append(lines[index])
                index += 1
            blocks.append(Block("callout", "\n".join(quote_lines)))
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            blocks.append(Block("heading", heading_match.group(2).strip(), level))
            index += 1
            continue

        if re.match(r"^[-*]\s+", line) or re.match(r"^\d+\.\s+", line):
            list_lines = [line]
            index += 1
            while index < len(lines) and lines[index].strip() and (
                re.match(r"^[-*]\s+", lines[index])
                or re.match(r"^\d+\.\s+", lines[index])
                or re.match(r"^\s{2,}[-*]\s+", lines[index])
            ):
                list_lines.append(lines[index])
                index += 1
            blocks.append(Block("list", "\n".join(list_lines)))
            continue

        if line.strip().startswith("!["):
            blocks.append(Block("image", line.strip()))
            index += 1
            continue

        para_lines = [line]
        index += 1
        while index < len(lines) and lines[index].strip() and not lines[index].startswith(
            ("#", ">", "!", "-", "*")
        ) and not re.match(r"^\d+\.\s+", lines[index]):
            if lines[index].startswith("```"):
                break
            para_lines.append(lines[index])
            index += 1
        blocks.append(Block("paragraph", "\n".join(para_lines)))

    return blocks


def blocks_to_markdown(blocks: list[Block]) -> str:
    parts: list[str] = []
    for block in blocks:
        if not block.text:
            continue
        if block.kind == "heading":
            parts.append(f"{'#' * block.level} {block.text}")
        else:
            parts.append(block.text)
    return "\n\n".join(parts).strip()


def _normalize_plain_text(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\\([\\`*_\[\]])", r"\1", text)
    text = re.sub(r"[`*_]", "", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text.rstrip(".,;:!?")


def _first_paragraph_text(blocks: list[Block]) -> str:
    for block in blocks:
        if block.kind == "paragraph":
            return block.text
    return ""


def summary_duplicates_opening(description: str, blocks: list[Block]) -> bool:
    normalized_description = _normalize_plain_text(description)
    normalized_opening = _normalize_plain_text(_first_paragraph_text(blocks))
    if not normalized_description or not normalized_opening:
        return False
    if normalized_description == normalized_opening:
        return True
    shorter, longer = (
        (normalized_description, normalized_opening)
        if len(normalized_description) <= len(normalized_opening)
        else (normalized_opening, normalized_description)
    )
    return len(shorter) >= 40 and shorter in longer


def summary_callout(description: str, blocks: list[Block] | None = None) -> str:
    cleaned = description.strip()
    if not cleaned:
        return ""
    if blocks is not None and summary_duplicates_opening(cleaned, blocks):
        return ""
    return "\n".join(
        [
            "> [!callout type=summary]",
            f"> **Summary:** {cleaned}",
        ]
    )


NUMBERED_H2_RE = re.compile(r"^\d+\.\s+")


def toc_callout(h2_headings: list[str]) -> str:
    if len(h2_headings) < 4:
        return ""
    seen: dict[str, int] = {}

    def anchor_for(heading: str) -> str:
        base = slugify_heading(heading)
        count = seen.get(base, 0)
        seen[base] = count + 1
        return base if count == 0 else f"{base}-{count + 1}"

    lines = ["> [!toc]", "> **On this page**", ">"]
    index = 0
    while index < len(h2_headings):
        heading = h2_headings[index]
        if NUMBERED_H2_RE.match(heading):
            lines.append(f"> - [{heading}](#{anchor_for(heading)})")
            index += 1
            continue

        lines.append(f"> - [{heading}](#{anchor_for(heading)})")
        child_index = index + 1
        while child_index < len(h2_headings) and NUMBERED_H2_RE.match(h2_headings[child_index]):
            child = h2_headings[child_index]
            lines.append(f">   - [{child}](#{anchor_for(child)})")
            child_index += 1
        index = child_index

    return "\n".join(lines)


def promo_callout(rule: dict[str, Any]) -> str:
    callout = rule["callout"]
    kind = rule.get("kind", "tmm")
    label = callout.get("label", "TMM resource")
    title = callout.get("title", "")
    body = callout.get("body", "")
    url = callout.get("url", "")
    cta = callout.get("cta", "Learn more")
    return "\n".join(
        [
            f'> [!callout type={kind} label="{label}" title="{title}" url="{url}" cta="{cta}"]',
            f"> {body}",
        ]
    )


def related_callout(posts: list[dict[str, Any]]) -> str:
    if not posts:
        return ""
    lines = ["> [!related]", "> **More from the team**", ">"]
    for post in posts:
        title = post.get("title", "").replace("[", "").replace("]", "")
        url = post.get("url", f"/blog/{post.get('slug', '')}/")
        lines.append(f"> - [{title}]({url})")
    return "\n".join(lines)


def post_search_text(frontmatter: dict[str, Any], body: str) -> str:
    parts = [
        frontmatter.get("title", ""),
        frontmatter.get("description", ""),
        body,
        " ".join(frontmatter.get("topics", []) or []),
    ]
    return " ".join(parts).lower()


def rule_matches(rule: dict[str, Any], search_text: str, topics: list[str]) -> bool:
    match = rule.get("match", {})
    keywords = [keyword.lower() for keyword in match.get("keywords", [])]
    rule_topics = [topic.lower() for topic in match.get("topics", [])]
    topic_set = {topic.lower() for topic in topics}

    if any(keyword in search_text for keyword in keywords):
        return True
    if any(topic in topic_set for topic in rule_topics):
        return True
    return False


def stable_rule_order(slug: str, rules: list[dict[str, Any]]) -> list[dict[str, Any]]:
    def sort_key(rule: dict[str, Any]) -> tuple[int, int]:
        digest = hashlib.sha256(f"{slug}:{rule['id']}".encode()).hexdigest()
        return (rule.get("priority", 100), int(digest[:8], 16))

    return sorted(rules, key=sort_key)


def find_related_posts(
    slug: str,
    frontmatter: dict[str, Any],
    index_posts: list[dict[str, Any]],
    limit: int = 3,
) -> list[dict[str, Any]]:
    topics = {topic.lower() for topic in frontmatter.get("topics", []) or [] if topic}
    author_slugs = {author.get("slug") for author in frontmatter.get("authors", []) if author.get("slug")}

    candidates: list[dict[str, Any]] = []
    for post in index_posts:
        if post.get("slug") == slug:
            continue
        post_topics = {topic.lower() for topic in post.get("topics", []) or [] if topic}
        post_authors = {author.get("slug") for author in post.get("authors", []) if author.get("slug")}
        topic_overlap = len(topics & post_topics) if topics else 0
        author_overlap = len(author_slugs & post_authors) if author_slugs else 0
        if topic_overlap == 0 and author_overlap == 0:
            continue
        score = topic_overlap * 10 + author_overlap
        candidates.append({**post, "_score": score})

    candidates.sort(
        key=lambda post: (post["_score"], post.get("published", "")),
        reverse=True,
    )
    return [{key: value for key, value in post.items() if not key.startswith("_")} for post in candidates[:limit]]


def is_visual_break(block: Block) -> bool:
    return block.kind in {"heading", "image", "code", "callout"} or (
        block.kind == "heading" and block.level == 2
    )


def insert_promo_callouts(
    blocks: list[Block],
    slug: str,
    frontmatter: dict[str, Any],
    rules: list[dict[str, Any]],
) -> list[Block]:
    search_text = post_search_text(frontmatter, blocks_to_markdown(blocks))
    topics = frontmatter.get("topics", []) or []
    matching_rules = [rule for rule in stable_rule_order(slug, rules) if rule_matches(rule, search_text, topics)]
    if not matching_rules:
        return blocks

    promo_count = 0
    redhat_count = 0
    tmm_count = 0
    used_rule_ids: set[str] = set()
    chars_since_break = 0
    recent_visual: list[bool] = []
    output: list[Block] = []
    rule_index = 0

    def pick_rule() -> dict[str, Any] | None:
        nonlocal rule_index
        while rule_index < len(matching_rules):
            rule = matching_rules[rule_index]
            rule_index += 1
            if rule["id"] in used_rule_ids:
                continue
            kind = rule.get("kind", "tmm")
            if kind == "redhat" and redhat_count >= MAX_REDHAT_CALLOUTS:
                continue
            if kind == "tmm" and tmm_count >= MAX_TMM_CALLOUTS:
                continue
            return rule
        return None

    def insert_promo_before_block() -> None:
        nonlocal promo_count, redhat_count, tmm_count, chars_since_break, recent_visual
        if promo_count >= MAX_PROMO_CALLOUTS:
            return
        if chars_since_break < CHARS_THRESHOLD:
            return
        if any(recent_visual[-3:]):
            return
        rule = pick_rule()
        if not rule:
            return
        output.append(Block("callout", promo_callout(rule)))
        used_rule_ids.add(rule["id"])
        promo_count += 1
        if rule.get("kind") == "redhat":
            redhat_count += 1
        else:
            tmm_count += 1
        chars_since_break = 0
        recent_visual = []

    index = 0
    while index < len(blocks):
        block = blocks[index]
        upcoming_h2 = any(
            upcoming.kind == "heading" and upcoming.level == 2
            for upcoming in blocks[index + 1 :]
        )

        if promo_count < MAX_PROMO_CALLOUTS and block.kind == "heading" and block.level == 2:
            insert_promo_before_block()

        output.append(block)

        if block.kind == "heading" and block.level == 2:
            chars_since_break = 0
            recent_visual = []
        elif block.kind in {"image", "code", "callout"}:
            chars_since_break = 0
            recent_visual.append(True)
        elif block.kind == "paragraph":
            chars_since_break += len(block.text)
            recent_visual.append(False)
            if (
                promo_count < MAX_PROMO_CALLOUTS
                and chars_since_break >= CHARS_THRESHOLD
                and not upcoming_h2
                and not any(recent_visual[-3:])
            ):
                insert_promo_before_block()
        elif block.kind == "list":
            chars_since_break += len(block.text)
            recent_visual.append(False)

        if len(recent_visual) > 3:
            recent_visual = recent_visual[-3:]

        index += 1

    return output


def enrich_markdown_body(
    body: str,
    frontmatter: dict[str, Any],
    index_posts: list[dict[str, Any]] | None = None,
    rules: list[dict[str, Any]] | None = None,
) -> str:
    index_posts = index_posts if index_posts is not None else load_index_posts()
    rules = rules if rules is not None else load_rules()
    slug = frontmatter.get("slug", "")

    body = strip_enrichment(body)
    blocks = parse_blocks(body)

    h2_headings = [block.text for block in blocks if block.kind == "heading" and block.level == 2]
    description = frontmatter.get("description", "")
    summary = summary_callout(description, blocks)
    blocks = insert_promo_callouts(blocks, slug, frontmatter, rules)
    body = blocks_to_markdown(blocks)

    prefix_parts: list[str] = []
    if summary:
        prefix_parts.append(summary)
    toc = toc_callout(h2_headings)
    if toc:
        prefix_parts.append(toc)

    prefix = ""
    if prefix_parts:
        prefix = ENRICHMENT_START + "\n\n" + "\n\n".join(prefix_parts) + "\n\n" + ENRICHMENT_END + "\n\n"

    related_posts = find_related_posts(slug, frontmatter, index_posts)
    suffix = ""
    related = related_callout(related_posts)
    if related:
        suffix = "\n\n" + RELATED_START + "\n\n" + related + "\n\n" + RELATED_END

    return (prefix + body + suffix).strip() + "\n"


def enrich_markdown_file(path: Path, index_posts: list[dict[str, Any]], rules: list[dict[str, Any]]) -> bool:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return False
    _, frontmatter_raw, body = text.split("---", 2)
    frontmatter = yaml.safe_load(frontmatter_raw) or {}
    enriched = enrich_markdown_body(body.lstrip("\n"), frontmatter, index_posts, rules)
    new_text = "---\n" + yaml.safe_dump(frontmatter, sort_keys=False, allow_unicode=True) + "---\n\n" + enriched
    if new_text == text:
        return False
    path.write_text(new_text, encoding="utf-8")
    return True


def enrich_all_posts() -> int:
    index_posts = load_index_posts()
    rules = load_rules()
    changed = 0
    for path in sorted(CONTENT_DIR.glob("*.md")):
        if enrich_markdown_file(path, index_posts, rules):
            changed += 1
    return changed


def main() -> None:
    parser = argparse.ArgumentParser(description="Enrich mirrored blog markdown deterministically.")
    parser.add_argument("--all", action="store_true", help="Enrich every post in content/blog/")
    args = parser.parse_args()
    if args.all:
        count = enrich_all_posts()
        print(f"Enriched {count} markdown files.")
        return
    parser.print_help()


if __name__ == "__main__":
    main()
