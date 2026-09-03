#!/usr/bin/env node
/**
 * Render content/blog/*.md into static blog/{slug}/index.html with Shiki highlighting.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUTPUT_DIR = path.join(ROOT, 'blog');

const LANG_ALIASES = {
  yml: 'yaml',
  ansible: 'yaml',
  jinja2: 'html',
  jinja: 'html',
  j2: 'html',
  sh: 'bash',
  shell: 'bash',
  console: 'bash',
  ps1: 'powershell',
};

const LANG_LABELS = {
  yaml: 'YAML',
  bash: 'Bash',
  shell: 'Shell',
  python: 'Python',
  json: 'JSON',
  text: 'Text',
  xml: 'XML',
  html: 'HTML',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  rego: 'Rego',
  powershell: 'PowerShell',
};

function reflowNestedKeys(text) {
  const lines = [];
  for (const line of text.split('\n')) {
    if (/ {2,}\S[\w-]*\s*:/.test(line)) {
      const parts = line.split(/ {2,}(?=\S[\w-]*\s*:)/);
      if (parts.length > 1) {
        const baseIndent = line.length - line.trimStart().length;
        const subIndent = baseIndent + 2;
        lines.push(parts[0].trimEnd());
        for (const part of parts.slice(1)) {
          lines.push(`${' '.repeat(subIndent)}${part.trimStart()}`);
        }
        continue;
      }
    }
    lines.push(line.replace(/\s+$/, ''));
  }
  return lines.join('\n');
}

function normalizeCodeText(text) {
  let normalized = String(text).replace(/\u00a0/g, ' ').replace(/^[\s—–-]+/, '').trim();
  if (!normalized.includes('\n')) {
    const splitBefore = [
      /---\s+collections:/,
      /---\s+name:/,
      /\bhosts:/,
      /\bsources:/,
      /\brules:/,
      /\bcondition:/,
      /\baction:/,
      /\bpackage\s+/,
      /\bimport\s+rego/,
      /\bpatching_teams\s*:=/,
      /\bnetwork_teams\s*:=/,
      /\bapp_teams\s*:=/,
      /\buser_teams\s*:=/,
      /\}\s+if\s+\{/,
      /##\s+/,
      /\$[A-Za-z_]\w*\s*=/,
      /\bEnable-[A-Za-z]+/,
      /\bNew-[A-Za-z]+/,
    ];
    for (const pattern of splitBefore) {
      normalized = normalized.replace(new RegExp(`\\s+(?=${pattern.source})`, 'g'), '\n');
    }
    normalized = normalized.replace(/\s+(- )/g, '\n$1');
    normalized = reflowNestedKeys(normalized);
  } else {
    normalized = reflowNestedKeys(normalized);
  }
  return normalized
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .trim();
}

function detectLang(text, explicitLang) {
  if (explicitLang) return normalizeLang(explicitLang);
  const sample = String(text).trim().slice(0, 500);
  if (/\bpackage\s+\w+/.test(sample) || sample.includes('rego.v1')) return 'rego';
  if (/\b(Enable-|New-|Get-|Set-)\w+/.test(sample) || sample.includes('$')) return 'powershell';
  if (/^(---|\s*-\s+name:|\s*hosts:|\s*tasks:|\s*sources:|\s*rules:)/m.test(sample)) return 'yaml';
  if (/^\s*[{[]/.test(sample)) return 'json';
  if (/^#!|^\s*(sudo |apt |yum |dnf )/m.test(sample)) return 'bash';
  return 'text';
}

function normalizeMarkdownCodeBlocks(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  let index = 0;

  const tableToFences = (tableBlock) => {
    const matches = [...tableBlock.matchAll(/```\s*([\s\S]*?)```/g)];
    if (!matches.length) return tableBlock;
    return matches
      .map((match) => {
        const text = normalizeCodeText(match[1]);
        const lang = detectLang(text);
        return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
      })
      .join('\n');
  };

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().startsWith('|') && line.includes('```')) {
      const tableLines = [line];
      index += 1;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index]);
        index += 1;
      }
      output.push(tableToFences(tableLines.join('\n')).trim());
      output.push('');
      continue;
    }
    if (
      line.trim() === '|  |' &&
      index + 2 < lines.length &&
      lines[index + 1].trim().startsWith('| ---')
    ) {
      const tableLines = [line, lines[index + 1]];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index]);
        index += 1;
      }
      output.push(tableToFences(tableLines.join('\n')).trim());
      output.push('');
      continue;
    }
    output.push(line);
    index += 1;
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function wrapCodeBlock(html, lang) {
  const label = LANG_LABELS[lang] || lang.toUpperCase();
  return `<div class="blog-code-block">
  <div class="blog-code-block__toolbar">
    <span class="blog-code-block__lang">${escapeHtml(label)}</span>
    <button type="button" class="blog-code-block__copy" data-copy-code aria-label="Copy code to clipboard">Copy</button>
  </div>
  ${html}
</div>`;
}

const SOURCE_LABELS = {
  redhat: 'Red Hat Blog',
  developers: 'Red Hat Developer Blog',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function normalizeLang(lang) {
  if (!lang) return 'text';
  const normalized = lang.toLowerCase().trim();
  return LANG_ALIASES[normalized] || normalized;
}

function authorLinks(authors) {
  if (!authors?.length) return '';
  return authors
    .map((author) => {
      if (author.slug) {
        return `<a href="/team/#${escapeHtml(author.slug)}">${escapeHtml(author.name)}</a>`;
      }
      return escapeHtml(author.name);
    })
    .join(', ');
}

function pageShell({ title, description, canonical, bodyHtml, attributionHtml, metaLine }) {
  const metaDescription = escapeHtml(description || title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Ansible TMM Blog</title>
  <meta name="description" content="${metaDescription}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <link rel="stylesheet" href="../../css/styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header" role="banner">
    <nav class="nav" aria-label="Main navigation">
      <a href="../../" class="nav__brand" aria-label="Ansible TMM — Home">Ansible TMM</a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation menu">
        <span class="nav__toggle-bar" aria-hidden="true"></span>
        <span class="nav__toggle-bar" aria-hidden="true"></span>
        <span class="nav__toggle-bar" aria-hidden="true"></span>
      </button>
      <ul class="nav__menu" id="nav-menu">
        <li><a href="../../#learn-and-present">Learn &amp; Present</a></li>
        <li><a href="../../#product-demos">Product Demos</a></li>
        <li><a href="../../#tools-and-utilities">Tools</a></li>
        <li><a href="../../#games">Games</a></li>
        <li><a href="../../#youtube">YouTube</a></li>
        <li><a href="/blog/" aria-current="page">Blog</a></li>
        <li><a href="/team/">Team</a></li>
        <li>
          <a href="https://github.com/ansible-tmm" class="nav__github" target="_blank" rel="noopener noreferrer" aria-label="Ansible TMM on GitHub (opens in new tab)">
            <svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-github"></use></svg>
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  </header>

  <main id="main-content" class="blog-post-page">
    <article class="blog-post-container">
      <a href="/blog/" class="blog-post-back">← Back to blog</a>
      ${attributionHtml}
      <header class="blog-post-header">
        <h1 class="blog-post-title">${escapeHtml(title)}</h1>
        <p class="blog-post-meta">${metaLine}</p>
      </header>
      <div class="blog-post-content">
        ${bodyHtml}
      </div>
    </article>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="site-footer__inner">
      <div class="site-footer__content">
        <p class="site-footer__title">Ansible TMM Project Hub</p>
        <p class="site-footer__note">Community and technical marketing resources for Ansible automation.</p>
        <p class="site-footer__links">
          <a href="../../">Project hub</a>
          <span class="site-footer__sep" aria-hidden="true">·</span>
          <a href="/blog/">Blog</a>
          <span class="site-footer__sep" aria-hidden="true">·</span>
          <a href="/team/">Team</a>
          <span class="site-footer__sep" aria-hidden="true">·</span>
          <a href="https://github.com/ansible-tmm" target="_blank" rel="noopener noreferrer">github.com/ansible-tmm</a>
          <span class="site-footer__sep" aria-hidden="true">·</span>
          <span id="footer-year"></span>
        </p>
      </div>
    </div>
  </footer>

  <svg xmlns="http://www.w3.org/2000/svg" class="svg-defs" aria-hidden="true">
    <symbol id="icon-github" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.021C22 6.484 17.522 2 12 2z"/>
    </symbol>
  </svg>

  <script>
    (function () {
      const navToggle = document.querySelector('.nav__toggle');
      const navMenu = document.getElementById('nav-menu');
      if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
          const expanded = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', String(!expanded));
          navMenu.classList.toggle('nav__menu--open', !expanded);
        });
      }
      const yearEl = document.getElementById('footer-year');
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());

      document.querySelectorAll('[data-copy-code]').forEach((button) => {
        button.addEventListener('click', async function () {
          const block = button.closest('.blog-code-block');
          const codeEl = block ? block.querySelector('code') : null;
          if (!codeEl) return;
          const text = codeEl.textContent || '';
          try {
            await navigator.clipboard.writeText(text);
            const original = button.textContent;
            button.textContent = 'Copied';
            button.setAttribute('aria-label', 'Code copied to clipboard');
            window.setTimeout(function () {
              button.textContent = original;
              button.setAttribute('aria-label', 'Copy code to clipboard');
            }, 1600);
          } catch (error) {
            button.textContent = 'Failed';
            window.setTimeout(function () {
              button.textContent = 'Copy';
            }, 1600);
          }
        });
      });
    })();
  </script>
  <noscript>
    <p>This post is also available at <a href="${escapeHtml(canonical)}">the original publisher</a>.</p>
  </noscript>
</body>
</html>`;
}

async function renderMarkdown(markdown, highlighter) {
  const normalizedMarkdown = normalizeMarkdownCodeBlocks(markdown);
  const renderer = new marked.Renderer();

  renderer.code = function ({ text, lang }) {
    const normalizedText = normalizeCodeText(text);
    const displayLang = detectLang(normalizedText, lang);
    const loaded = highlighter.getLoadedLanguages();
    const highlightLang = loaded.includes(displayLang) ? displayLang : 'text';
    const html = highlighter.codeToHtml(normalizedText, {
      lang: highlightLang,
      theme: 'github-dark',
    }).replace('<pre class="shiki', '<pre class="shiki blog-code');
    return wrapCodeBlock(html, displayLang);
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer,
  });

  return marked.parse(normalizedMarkdown);
}

async function main() {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: [
      'yaml',
      'bash',
      'python',
      'json',
      'text',
      'xml',
      'html',
      'javascript',
      'typescript',
      'shell',
      'powershell',
    ],
  });

  let files;
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    console.log('No content/blog directory yet. Nothing to render.');
    return;
  }

  const markdownFiles = files.filter((file) => file.endsWith('.md'));
  const renderedSlugs = new Set();

  for (const file of markdownFiles) {
    const sourcePath = path.join(CONTENT_DIR, file);
    const raw = await fs.readFile(sourcePath, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || path.basename(file, '.md');
    const sourceLabel = SOURCE_LABELS[data.source] || 'the original publisher';
    const publishedLabel = formatDate(data.published);
    const readTime = data.read_time_minutes ? ` · ${data.read_time_minutes}-minute read` : '';
    const metaLine =
      `${authorLinks(data.authors)} · <time datetime="${escapeHtml(data.published || '')}">${escapeHtml(publishedLabel)}</time>${readTime}`;
    const attributionHtml =
      `<aside class="blog-attribution">Originally published on <a href="${escapeHtml(data.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceLabel)}</a>${publishedLabel ? ` on ${escapeHtml(publishedLabel)}` : ''}.</aside>`;
    const bodyHtml = await renderMarkdown(content, highlighter);
    const html = pageShell({
      title: data.title,
      description: data.description,
      canonical: data.source_url,
      bodyHtml,
      attributionHtml,
      metaLine,
    });

    const outputDir = path.join(OUTPUT_DIR, slug);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
    renderedSlugs.add(slug);
    console.log(`Rendered /blog/${slug}/`);
  }

  const outputEntries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true });
  for (const entry of outputEntries) {
    if (!entry.isDirectory() || entry.name === 'index.html') continue;
    if (!renderedSlugs.has(entry.name)) {
      await fs.rm(path.join(OUTPUT_DIR, entry.name), { recursive: true, force: true });
      console.log(`Removed stale /blog/${entry.name}/`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
