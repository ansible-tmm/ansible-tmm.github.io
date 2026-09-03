(function () {
  'use strict';

  const listEl = document.getElementById('blog-list');
  const filterEl = document.getElementById('blog-filter');
  const filterAuthorEl = document.getElementById('blog-filter-author');
  const INDEX_URL = '../data/blog-index.json';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return isoDate;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function getAuthorFilter() {
    return new URLSearchParams(window.location.search).get('author') || '';
  }

  function authorLinks(authors) {
    if (!authors || !authors.length) return '';
    return authors
      .map(function (author) {
        if (author.slug) {
          return '<a href="/team/#' + escapeAttr(author.slug) + '">' + escapeHtml(author.name) + '</a>';
        }
        return escapeHtml(author.name);
      })
      .join(', ');
  }

  function renderPosts(posts, authorFilter) {
    if (!listEl) return;

    if (!posts.length) {
      listEl.innerHTML =
        '<p class="blog-empty">No blog posts yet. Check back soon — new posts sync daily from Red Hat.</p>';
      return;
    }

    listEl.innerHTML = posts
      .map(function (post) {
        const topics =
          post.topics && post.topics.length
            ? '<div class="blog-card__topics">' +
              post.topics
                .slice(0, 3)
                .map(function (topic) {
                  return '<span class="blog-card__topic">' + escapeHtml(topic) + '</span>';
                })
                .join('') +
              '</div>'
            : '';

        const readTime = post.read_time_minutes
          ? '<span class="blog-card__read-time">' + post.read_time_minutes + '-min read</span>'
          : '';

        return (
          '<article class="blog-card">' +
          '<a href="/blog/' + escapeAttr(post.slug) + '/" class="blog-card__link">' +
          '<div class="blog-card__body">' +
          '<h2 class="blog-card__title">' + escapeHtml(post.title) + '</h2>' +
          '<p class="blog-card__meta">' +
          '<span class="blog-card__authors">' + authorLinks(post.authors) + '</span>' +
          '<span class="blog-card__sep" aria-hidden="true">·</span>' +
          '<time datetime="' + escapeAttr(post.published || '') + '">' + escapeHtml(formatDate(post.published)) + '</time>' +
          (readTime ? '<span class="blog-card__sep" aria-hidden="true">·</span>' + readTime : '') +
          '</p>' +
          (post.description ? '<p class="blog-card__excerpt">' + escapeHtml(post.description) + '</p>' : '') +
          topics +
          '</div>' +
          '<span class="blog-card__cta" aria-hidden="true">Read post →</span>' +
          '</a>' +
          '</article>'
        );
      })
      .join('');
  }

  function applyFilter(posts, authorFilter) {
    if (!authorFilter) return posts;
    return posts.filter(function (post) {
      return (post.authors || []).some(function (author) {
        return author.slug === authorFilter;
      });
    });
  }

  function updateFilterBanner(authorFilter) {
    if (!filterEl || !filterAuthorEl) return;

    if (!authorFilter || typeof TEAM === 'undefined') {
      filterEl.hidden = true;
      return;
    }

    const member = TEAM.find(function (m) {
      return m.slug === authorFilter;
    });
    if (!member) {
      filterEl.hidden = true;
      return;
    }

    filterAuthorEl.textContent = member.name;
    filterEl.hidden = false;
    document.title = member.name + ' — Blog — Ansible TMM';
  }

  function loadPosts() {
    const authorFilter = getAuthorFilter();
    updateFilterBanner(authorFilter);

    fetch(INDEX_URL)
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load blog index');
        return response.json();
      })
      .then(function (data) {
        const posts = applyFilter(data.posts || [], authorFilter);
        renderPosts(posts, authorFilter);
      })
      .catch(function () {
        if (listEl) {
          listEl.innerHTML =
            '<p class="blog-empty">Could not load blog posts. <a href="/blog/">Try again</a>.</p>';
        }
      });
  }

  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav__menu--open', !expanded);
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__menu--open');
      });
    });
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  loadPosts();
})();
