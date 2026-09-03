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


def _clean_blog_title(title: str) -> str:
    """Red Hat pageTitle/headline sometimes includes a 'blog post |' breadcrumb prefix."""
    return re.sub(r"^blog\s+post\s*\|\s*", "", title.strip(), flags=re.IGNORECASE).strip()


def extract_metadata(html: str, source_url: str) -> BlogMetadata:
    soup = BeautifulSoup(html, "html.parser")
    json_ld = _parse_json_ld(soup) or {}
    page_data = _parse_page_data(soup)

    title = _clean_blog_title(json_ld.get("headline") or page_data.get("pageTitle") or "")
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
        title=_clean_blog_title(title.strip()),
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


def _detect_code_language(text: str) -> str:
    sample = text.strip()[:500]
    if re.search(r"\bpackage\s+\w+", sample) or "rego.v1" in sample:
        return "rego"
    if re.search(r"\b(Enable-|New-|Get-|Set-)\w+", sample) or "$" in sample[:80]:
        return "powershell"
    if re.search(r"^(---|\s*-\s+name:|\s*hosts:|\s*tasks:|\s*sources:|\s*rules:)", sample, re.M):
        return "yaml"
    if re.search(r"^[\w][\w-]*:\s*$", sample, re.M) or re.search(r"^\s+[\w][\w-]*:", sample, re.M):
        return "yaml"
    if re.search(r"^\s*-\s+[\w\"'-]+", sample, re.M) and ":" in sample:
        return "yaml"
    if sample.lstrip().startswith(("{", "[")):
        return "json"
    if re.search(r"^#!|^\s*(sudo |apt |yum |dnf )", sample, re.M):
        return "bash"
    return ""


def _normalize_code_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"^[\s\u2014\u2013]+", "", text.strip())
    if "\n" not in text.strip():
        text = _reflow_flat_code(text)
    lines = [line.rstrip() for line in text.splitlines()]
    return "\n".join(lines).strip()


def _reflow_flat_code(text: str) -> str:
    split_before = [
        r"---\s+collections:",
        r"---\s+name:",
        r"\bhosts:",
        r"\bsources:",
        r"\brules:",
        r"\bcondition:",
        r"\baction:",
        r"\bpackage\s+",
        r"\bimport\s+rego",
        r"\bpatching_teams\s*:=",
        r"\bnetwork_teams\s*:=",
        r"\bapp_teams\s*:=",
        r"\buser_teams\s*:=",
        r"\}\s+if\s+\{",
        r"##\s+",
        r"\$[A-Za-z_]\w*\s*=",
        r"\bEnable-[A-Za-z]+",
        r"\bNew-[A-Za-z]+",
    ]
    for pattern in split_before:
        text = re.sub(rf"\s+(?={pattern})", "\n", text)
    text = re.sub(r"\s+(- )", r"\n\1", text)
    return _reflow_nested_keys(text)


def _reflow_nested_keys(text: str) -> str:
    lines: list[str] = []
    for line in text.splitlines():
        trimmed = line.lstrip()
        leading_spaces = len(line) - len(trimmed)
        if leading_spaces == 0 and re.search(r" {2,}\S[\w-]*\s*:", line):
            parts = re.split(r" {2,}(?=\S[\w-]*\s*:)", line)
            if len(parts) > 1:
                lines.append(parts[0].rstrip())
                for part in parts[1:]:
                    lines.append(f"  {part.lstrip()}")
                continue
        lines.append(line.rstrip())
    return "\n".join(lines)


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
            elif cls in {"hljs", "yaml", "bash", "python", "json", "rego", "powershell"}:
                lang = lang or cls
        if not lang:
            lang = _detect_code_language(code.get_text())
        if lang:
            pre["data-language"] = lang


def _unwrap_code_tables(element: Tag) -> None:
    """Red Hat often wraps syntax-highlighted snippets in layout tables."""
    for table in list(element.find_all("table")):
        if table.find("img") or table.find("a", href=True):
            continue
        pres = table.find_all("pre")
        if not pres:
            continue
        non_code_text = ""
        for node in table.descendants:
            if isinstance(node, NavigableString) and not isinstance(node, Comment):
                parent = node.parent
                if parent and parent.name not in {"pre", "code", "span"} and str(node).strip():
                    non_code_text += str(node).strip()
        if non_code_text:
            continue
        if len(pres) == 1:
            table.replace_with(pres[0])
            continue
        for pre in pres:
            table.insert_before(pre.extract())
        table.decompose()


def _code_fence(lang: str, text: str) -> str:
    fence_lang = lang or "text"
    return f"\n\n```{fence_lang}\n{text}\n```\n\n"


def _extract_pre_blocks_to_placeholders(html: str) -> tuple[str, dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    placeholders: dict[str, str] = {}
    counter = 0
    for pre in list(soup.find_all("pre")):
        code = pre.find("code")
        if not code:
            continue
        text = _normalize_code_text(code.get_text("\n"))
        lang = pre.get("data-language") or _detect_code_language(text)
        key = f"BLOGCODEBLOCK{counter}"
        placeholders[key] = _code_fence(lang, text)
        counter += 1
        pre.replace_with(NavigableString(f"\n\n{key}\n\n"))
    return str(soup), placeholders


def _strip_redhat_nav(element: Tag) -> None:
    for link in list(element.find_all("a")):
        if link.get_text(strip=True).lower() != "back to all posts":
            continue
        parent = link.parent
        if parent and parent.name == "li":
            list_parent = parent.parent
            parent.decompose()
            if list_parent and list_parent.name in {"ul", "ol"} and not list_parent.get_text(strip=True):
                list_parent.decompose()
        else:
            link.decompose()


def _strip_redhat_footer_html(element: Tag) -> None:
    footer_pattern = re.compile(r"^(about the authors?|more like this|keep exploring)$", re.IGNORECASE)
    for heading in list(element.find_all(["h2", "h3", "h4"])):
        if not footer_pattern.match(heading.get_text(strip=True)):
            continue
        prev = heading.find_previous_sibling()
        if prev and prev.name == "hr":
            prev.decompose()
        node = heading
        while node:
            nxt = node.find_next_sibling()
            node.decompose()
            node = nxt
        return


def strip_redhat_footer(markdown: str) -> str:
    """Remove Red Hat author bios, related posts, and promo blocks."""
    markdown = re.sub(
        r"\n---\s*\n+(?=#{2,3}\s+About the authors?\b)",
        "\n",
        markdown,
        flags=re.IGNORECASE,
    )
    markdown = re.sub(
        r"\n+#{2,3}\s+About the authors?\b[\s\S]*$",
        "",
        markdown,
        flags=re.IGNORECASE,
    )
    markdown = re.sub(
        r"\n+#{2,3}\s+More like this\b[\s\S]*$",
        "",
        markdown,
        flags=re.IGNORECASE,
    )
    markdown = re.sub(
        r"\n+#{2,3}\s+Keep exploring\b[\s\S]*$",
        "",
        markdown,
        flags=re.IGNORECASE,
    )
    return markdown.rstrip() + "\n"


def normalize_synced_markdown(markdown: str) -> str:
    """Remove Red Hat blog navigation we replace with our own back link."""
    markdown = re.sub(
        r"^- \[Back to all posts\]\([^)]+\)\s*\n+(?:---\s*\n+)?",
        "",
        markdown,
        flags=re.IGNORECASE | re.MULTILINE,
    )
    markdown = strip_redhat_footer(markdown)
    return markdown


def normalize_markdown_code_blocks(markdown: str) -> str:
    """Repair table-wrapped inline code fences produced by markdownify."""

    def table_to_fences(table_block: str) -> str:
        matches = list(re.finditer(r"```\s*([\s\S]*?)```", table_block))
        if not matches:
            return table_block
        fences = []
        for match in matches:
            text = _normalize_code_text(match.group(1))
            lang = _detect_code_language(text)
            fences.append(_code_fence(lang, text).strip())
        return "\n\n".join(fences) + "\n\n"

    lines = markdown.splitlines()
    output: list[str] = []
    index = 0
    while index < len(lines):
        line = lines[index]
        if line.strip().startswith("|") and "```" in line:
            table_lines = [line]
            index += 1
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index])
                index += 1
            output.append(table_to_fences("\n".join(table_lines)).rstrip())
            output.append("")
            continue
        if (
            line.strip() == "|  |"
            and index + 2 < len(lines)
            and lines[index + 1].strip().startswith("| ---")
        ):
            table_lines = [line, lines[index + 1]]
            index += 2
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index])
                index += 1
            output.append(table_to_fences("\n".join(table_lines)).rstrip())
            output.append("")
            continue
        output.append(line)
        index += 1
    normalized = "\n".join(output)
    return re.sub(r"\n{3,}", "\n\n", normalized).strip() + "\n"


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

    _unwrap_code_tables(body)
    _strip_redhat_nav(body)
    _strip_redhat_footer_html(body)

    for tag in body.find_all(["pre"]):
        _preserve_code_blocks(tag)

    for tag in body.find_all(True):
        _absolutize_urls(tag, source_url)

    return body.decode_contents().strip()


def html_to_markdown(html: str) -> str:
    from markdownify import markdownify as md

    html, placeholders = _extract_pre_blocks_to_placeholders(html)
    markdown = md(
        html,
        heading_style="ATX",
        bullets="-",
        strip=["script", "style"],
    )
    for key, fence in placeholders.items():
        markdown = markdown.replace(key, fence.strip())
    markdown = normalize_markdown_code_blocks(markdown)
    markdown = normalize_synced_markdown(markdown)
    return re.sub(r"\n{3,}", "\n\n", markdown).strip() + "\n"
