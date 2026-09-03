#!/usr/bin/env python3
"""Extract blog metadata and body HTML from Red Hat blog pages."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

STRIP_SELECTORS = [
    ".rhdc-blog-post--author-large",
    ".rhdc-blog-post--author-avatar",
    ".rhdc-blog-post--social-container",
    ".rhdc-blog-post--social-share",
    ".rhdc-blog-post--deluxe-promo",
    ".rhdc--deluxe-promo-blog",
    ".rhdc-blog-post--browse-by-channel",
    ".rh-article-teaser--component",
    "script",
    "style",
    "noscript",
]


@dataclass
class BlogMetadata:
    title: str
    description: str
    published: str
    updated: str
    authors: list[dict[str, str]]
    topics: list[str]
    read_time_minutes: int | None
    source_url: str


def _normalize_date(value: str | None) -> str:
    if not value:
        return ""
    return value[:10]


def _slug_from_author_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/")
    return path.split("/")[-1] if path else ""


def _parse_json_ld(soup: BeautifulSoup) -> dict[str, Any] | None:
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
        except json.JSONDecodeError:
            continue
        graph = data.get("@graph", [data])
        for item in graph:
            if item.get("@type") == "BlogPosting":
                return item
    return None


def _parse_page_data(soup: BeautifulSoup) -> dict[str, Any]:
    for script in soup.find_all("script"):
        text = script.string or ""
        match = re.search(r"var pageData = (\{.*?\});", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                return {}
    return {}


def _extract_topics(soup: BeautifulSoup) -> list[str]:
    topics: list[str] = []
    for link in soup.select(".rh-article-teaser-taxonomy-link a"):
        text = link.get_text(strip=True)
        if text:
            topics.append(text)
    return topics


def _extract_read_time(soup: BeautifulSoup) -> int | None:
    el = soup.select_one(".rh-article-teaser-hero-readtime")
    if not el:
        return None
    match = re.search(r"(\d+)", el.get_text())
    return int(match.group(1)) if match else None


def extract_metadata(html: str, source_url: str) -> BlogMetadata:
    soup = BeautifulSoup(html, "html.parser")
    json_ld = _parse_json_ld(soup) or {}
    page_data = _parse_page_data(soup)

    title = json_ld.get("headline") or page_data.get("pageTitle") or ""
    description = json_ld.get("description") or ""

    published = _normalize_date(json_ld.get("datePublished"))
    updated = _normalize_date(json_ld.get("dateModified") or json_ld.get("datePublished"))

    authors: list[dict[str, str]] = []
    for author in json_ld.get("author", []):
        if isinstance(author, dict):
            name = author.get("name", "")
            slug = _slug_from_author_url(author.get("url", ""))
            if name:
                authors.append({"name": name, "slug": slug})

    if not authors and page_data.get("blogAuthor"):
        authors.append({"name": page_data["blogAuthor"], "slug": ""})

    topics = _extract_topics(soup)
    read_time = _extract_read_time(soup)

    return BlogMetadata(
        title=title.strip(),
        description=description.strip(),
        published=published,
        updated=updated,
        authors=authors,
        topics=topics,
        read_time_minutes=read_time,
        source_url=source_url,
    )


def _absolutize_urls(element: Tag, base_url: str) -> None:
    for attr in ("href", "src"):
        value = element.get(attr)
        if value and not value.startswith(("http://", "https://", "mailto:", "#")):
            element[attr] = urljoin(base_url, value)


def _preserve_code_blocks(element: Tag) -> None:
    for pre in element.find_all("pre"):
        code = pre.find("code")
        if not code:
            continue
        classes = code.get("class", [])
        lang = ""
        for cls in classes:
            if cls.startswith("language-"):
                lang = cls.replace("language-", "")
            elif cls in {"hljs", "yaml", "bash", "python", "json"}:
                lang = lang or cls
        if lang:
            pre["data-language"] = lang


def extract_body_html(html: str, source_url: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    body = soup.select_one(".blog-body") or soup.select_one("article.rhdc-blog-post--body")
    if not body:
        raise ValueError("Could not find blog body content")

    for selector in STRIP_SELECTORS:
        for node in body.select(selector):
            node.decompose()

    for comment in body.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    for tag in body.find_all(["pre"]):
        _preserve_code_blocks(tag)

    for tag in body.find_all(True):
        _absolutize_urls(tag, source_url)

    return body.decode_contents().strip()


def html_to_markdown(html: str) -> str:
    from markdownify import markdownify as md

    markdown = md(
        html,
        heading_style="ATX",
        bullets="-",
        strip=["script", "style"],
    )
    return re.sub(r"\n{3,}", "\n\n", markdown).strip() + "\n"
