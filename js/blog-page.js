(function () {
  'use strict';

  const PAGE_SIZE = 12;
  const ASSET_BASE = '../assets/team/';
  const INDEX_URL = '../data/blog-index.json';

  const SOURCE_LABELS = {
    redhat: 'Red Hat Blog',
    developers: 'Red Hat Developer Blog',
  };

  const listEl = document.getElementById('blog-list');
  const featuredEl = document.getElementById('blog-featured');
  const filterEl = document.getElementById('blog-filter');
  const filterAuthorEl = document.getElementById('blog-filter-author');
  const statsEl = document.getElementById('blog-stats');
  const authorsSection = document.getElementById('blog-authors');
  const authorChipsEl = document.getElementById('blog-author-chips');
  const searchInput = document.getElementById('blog-search');
  const paginationEl = document.getElementById('blog-pagination');
  const paginationStatusEl = document.getElementById('blog-pagination-status');
  const loadMoreBtn = document.getElementById('blog-load-more');

  let allPosts = [];
  let indexMeta = { updated_at: null };
  let visibleCount = PAGE_SIZE;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function parseLocalDate(isoDate) {
    if (!isoDate) return null;
    const parts = String(isoDate).split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    const date = new Date(isoDate);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(isoDate) {
    const date = parseLocalDate(isoDate);
    if (!date) return isoDate || '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatSyncDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function getAuthorFilter() {
    return new URLSearchParams(window.location.search).get('author') || '';
  }

  function getTeamMember(slug) {
    if (typeof TEAM === 'undefined' || !slug) return null;
    return TEAM.find(function (member) {
      return member.slug === slug;
    }) || null;
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

  function sourceLabel(source) {
    return SOURCE_LABELS[source] || 'Original publisher';
  }

  function sourceBadge(post) {
    const label = sourceLabel(post.source);
    return (
      '<span class="blog-card__source">' +
      '<svg class="icon icon--sm blog-card__source-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-external"></use></svg>' +
      escapeHtml(label) +
      '</span>'
    );
  }

  function authorAvatar(authors, extraClass) {
    const primary = (authors || []).find(function (author) {
      return author.slug;
    });
    if (!primary) {
      return '<div class="blog-card__avatar blog-card__avatar--placeholder' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true"></div>';
    }
    const member = getTeamMember(primary.slug);
    if (!member || !member.photo) {
      return (
        '<div class="blog-card__avatar blog-card__avatar--placeholder' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true">' +
        '<span>' + escapeHtml(primary.name.charAt(0)) + '</span></div>'
      );
    }
    return (
      '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="blog-card__avatar' + (extraClass ? ' ' + extraClass : '') + '" width="56" height="56" loading="lazy" decoding="async">'
    );
  }

  function topicsHtml(post) {
    const topics = (post.topics || []).slice(0, 3);
    if (!topics.length) {
      return '<span class="blog-card__topic blog-card__topic--muted">General</span>';
    }
    return topics
      .map(function (topic) {
        return '<span class="blog-card__topic">' + escapeHtml(topic) + '</span>';
      })
      .join('');
  }

  function postMetaLine(post) {
    const readTime = post.read_time_minutes
      ? '<span class="blog-card__sep" aria-hidden="true">·</span><span>' + post.read_time_minutes + '-min read</span>'
      : '';
    return (
      '<p class="blog-card__meta">' +
      '<span class="blog-card__authors">' + authorLinks(post.authors) + '</span>' +
      '<span class="blog-card__sep" aria-hidden="true">·</span>' +
      '<time datetime="' + escapeAttr(post.published || '') + '">' + escapeHtml(formatDate(post.published)) + '</time>' +
      readTime +
      '</p>'
    );
  }

  function renderCard(post, options) {
    const opts = options || {};
    const featuredClass = opts.featured ? ' blog-card--featured' : '';

    return (
      '<article class="blog-card' + featuredClass + '">' +
      '<a href="/blog/' + escapeAttr(post.slug) + '/" class="blog-card__link">' +
      authorAvatar(post.authors, opts.featured ? 'blog-card__avatar--featured' : '') +
      '<div class="blog-card__body">' +
      '<div class="blog-card__header">' +
      '<h2 class="blog-card__title">' + escapeHtml(post.title) + '</h2>' +
      '</div>' +
      postMetaLine(post) +
      (post.description ? '<p class="blog-card__excerpt">' + escapeHtml(post.description) + '</p>' : '') +
      '<div class="blog-card__footer">' +
      sourceBadge(post) +
      '<div class="blog-card__topics">' + topicsHtml(post) + '</div>' +
      '</div>' +
      '</div>' +
      '</a>' +
      '</article>'
    );
  }

  function countPostsByAuthor(posts) {
    const counts = {};
    posts.forEach(function (post) {
      (post.authors || []).forEach(function (author) {
        if (!author.slug) return;
        counts[author.slug] = (counts[author.slug] || 0) + 1;
      });
    });
    return counts;
  }

  function renderAuthorChips(posts, activeFilter) {
    if (!authorsSection || !authorChipsEl || typeof TEAM === 'undefined') return;

    const counts = countPostsByAuthor(posts);
    const authorsWithPosts = TEAM.filter(function (member) {
      return member.redhat && counts[member.slug];
    });

    if (!authorsWithPosts.length) {
      authorsSection.hidden = true;
      return;
    }

    const allActive = !activeFilter ? ' blog-author-chip--active' : '';
    let html =
      '<a href="/blog/" class="blog-author-chip' + allActive + '">All authors <span class="blog-author-chip__count">' + posts.length + '</span></a>';

    authorsWithPosts.forEach(function (member) {
      const active = activeFilter === member.slug ? ' blog-author-chip--active' : '';
      html +=
        '<a href="/blog/?author=' + escapeAttr(member.slug) + '" class="blog-author-chip' + active + '">' +
        '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="blog-author-chip__photo" width="24" height="24" loading="lazy">' +
        '<span>' + escapeHtml(member.name) + '</span>' +
        '<span class="blog-author-chip__count">' + counts[member.slug] + '</span>' +
        '</a>';
    });

    authorChipsEl.innerHTML = html;
    authorsSection.hidden = false;
  }

  function updateStats(totalPosts, filteredCount) {
    if (!statsEl) return;
    const synced = indexMeta.updated_at ? formatSyncDate(indexMeta.updated_at) : '';
    const syncLine = synced ? ' · Last synced ' + synced : ' · Updated daily';
    if (filteredCount !== totalPosts) {
      statsEl.textContent = filteredCount + ' of ' + totalPosts + ' posts' + syncLine;
      return;
    }
    statsEl.textContent = totalPosts + ' posts' + syncLine;
  }

  function applySearch(posts, query) {
    if (!query) return posts;
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter(function (post) {
      const haystack = [
        post.title,
        post.description,
        (post.topics || []).join(' '),
        (post.authors || []).map(function (author) {
          return author.name;
        }).join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.indexOf(needle) !== -1;
    });
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

    const member = getTeamMember(authorFilter);
    if (!member) {
      filterEl.hidden = true;
      return;
    }

    filterAuthorEl.textContent = member.name;
    filterEl.hidden = false;
    document.title = member.name + ' — Blog — Ansible TMM';
  }

  function renderView() {
    const authorFilter = getAuthorFilter();
    const searchQuery = searchInput ? searchInput.value : '';
    let posts = applyFilter(allPosts, authorFilter);
    posts = applySearch(posts, searchQuery);

    updateFilterBanner(authorFilter);
    renderAuthorChips(allPosts, authorFilter);
    updateStats(allPosts.length, posts.length);

    const showFeatured = !authorFilter && !searchQuery.trim() && posts.length > 0;
    const listPosts = showFeatured ? posts.slice(1, 1 + visibleCount) : posts.slice(0, visibleCount);
    const featuredPost = showFeatured ? posts[0] : null;

    if (featuredEl) {
      if (featuredPost) {
        featuredEl.innerHTML =
          '<h2 class="blog-featured__label">Latest post</h2>' + renderCard(featuredPost, { featured: true });
        featuredEl.hidden = false;
      } else {
        featuredEl.innerHTML = '';
        featuredEl.hidden = true;
      }
    }

    if (!listEl) return;

    if (!posts.length) {
      listEl.innerHTML =
        '<p class="blog-empty">No posts match your search. <a href="/blog/">Clear filters</a>.</p>';
      if (paginationEl) paginationEl.hidden = true;
      return;
    }

    listEl.innerHTML = listPosts.map(function (post) {
      return renderCard(post);
    }).join('');

    if (paginationEl && paginationStatusEl && loadMoreBtn) {
      const shown = (featuredPost ? 1 : 0) + listPosts.length;
      const total = posts.length;
      if (shown < total) {
        paginationStatusEl.textContent = 'Showing ' + shown + ' of ' + total + ' posts';
        paginationEl.hidden = false;
        loadMoreBtn.hidden = false;
      } else {
        paginationStatusEl.textContent = total === 1 ? 'Showing 1 post' : 'Showing all ' + total + ' posts';
        paginationEl.hidden = total <= PAGE_SIZE && !featuredPost;
        loadMoreBtn.hidden = true;
      }
    }
  }

  function loadPosts() {
    fetch(INDEX_URL)
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load blog index');
        return response.json();
      })
      .then(function (data) {
        allPosts = data.posts || [];
        indexMeta.updated_at = data.updated_at || null;
        visibleCount = PAGE_SIZE;
        renderView();
      })
      .catch(function () {
        if (listEl) {
          listEl.innerHTML =
            '<p class="blog-empty">Could not load blog posts. <a href="/blog/">Try again</a>.</p>';
        }
      });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      visibleCount = PAGE_SIZE;
      renderView();
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      visibleCount += PAGE_SIZE;
      renderView();
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
