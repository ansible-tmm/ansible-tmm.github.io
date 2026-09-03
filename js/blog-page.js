(function () {
  'use strict';

  const PAGE_SIZE = 12;
  const ASSET_BASE = '../assets/team/';
  const INDEX_URL = '../data/blog-index.json';

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
    if (!topics.length) return '';
    return (
      '<div class="blog-card__topics">' +
      topics
        .map(function (topic) {
          return '<span class="blog-card__topic">' + escapeHtml(topic) + '</span>';
        })
        .join('') +
      '</div>'
    );
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

  function primaryTopicHtml(post) {
    const topic = (post.topics || []).find(function (item) {
      return item && item !== 'General';
    });
    if (!topic) return '';
    return '<span class="blog-card__topic">' + escapeHtml(topic) + '</span>';
  }

  function postUrl(post) {
    return '/blog/' + escapeAttr(post.slug) + '/';
  }

  function cardFooter(post) {
    const topic = primaryTopicHtml(post);
    return (
      '<div class="blog-card__footer">' +
      (topic ? '<div class="blog-card__footer-topics">' + topic + '</div>' : '<span class="blog-card__footer-spacer" aria-hidden="true"></span>') +
      '<span class="blog-card__read-more" aria-hidden="true">Read post →</span>' +
      '</div>'
    );
  }

  function renderCard(post) {
    const url = postUrl(post);
    return (
      '<article class="blog-card">' +
      '<div class="blog-card__body">' +
      '<div class="blog-card__author-row">' +
      authorAvatar(post.authors, 'blog-card__avatar--inline') +
      postMetaLine(post) +
      '</div>' +
      '<a href="' + url + '" class="blog-card__content-link">' +
      '<h2 class="blog-card__title">' + escapeHtml(post.title) + '</h2>' +
      (post.description ? '<p class="blog-card__excerpt">' + escapeHtml(post.description) + '</p>' : '') +
      '</a>' +
      cardFooter(post) +
      '</div>' +
      '</article>'
    );
  }

  function renderFeaturedCard(post) {
    const topics = topicsHtml(post);
    const url = postUrl(post);
    return (
      '<article class="blog-featured-card">' +
      '<div class="blog-featured-card__layout">' +
      authorAvatar(post.authors, 'blog-card__avatar--featured') +
      '<div class="blog-featured-card__content">' +
      '<p class="blog-featured__label">Latest post</p>' +
      postMetaLine(post) +
      '<a href="' + url + '" class="blog-featured-card__content-link">' +
      '<h2 class="blog-featured-card__title">' + escapeHtml(post.title) + '</h2>' +
      (post.description ? '<p class="blog-featured-card__excerpt">' + escapeHtml(post.description) + '</p>' : '') +
      '</a>' +
      (topics ? '<div class="blog-featured-card__topics">' + topics + '</div>' : '') +
      '<div class="blog-featured-card__actions">' +
      '<a href="' + url + '" class="btn">Read post</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
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
      '<a href="/blog/" class="blog-author-chip' + allActive + '">All <span class="blog-author-chip__count">' + posts.length + '</span></a>';

    authorsWithPosts.forEach(function (member) {
      const active = activeFilter === member.slug ? ' blog-author-chip--active' : '';
      const shortName = member.name.split(' ')[0];
      html +=
        '<a href="/blog/?author=' + escapeAttr(member.slug) + '" class="blog-author-chip' + active + '" title="' + escapeAttr(member.name) + '">' +
        '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="blog-author-chip__photo" width="24" height="24" loading="lazy">' +
        '<span>' + escapeHtml(shortName) + '</span>' +
        '<span class="blog-author-chip__count">' + counts[member.slug] + '</span>' +
        '</a>';
    });

    authorChipsEl.innerHTML = html;
    authorsSection.hidden = false;
  }

  function updateStats(totalPosts, filteredCount) {
    if (!statsEl) return;

    if (filteredCount !== totalPosts) {
      statsEl.textContent =
        filteredCount + ' of ' + totalPosts + ' posts from the Ansible TMM team · Mirrored from Red Hat with attribution';
      return;
    }

    const postLabel = totalPosts === 1 ? 'post' : 'posts';
    statsEl.textContent =
      totalPosts + ' ' + postLabel + ' from the Ansible TMM team · Mirrored from Red Hat with attribution';
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
    filterEl.hidden = true;

    if (authorFilter && typeof TEAM !== 'undefined') {
      const member = getTeamMember(authorFilter);
      if (member) {
        document.title = member.name + ' — Blog — Ansible TMM';
      }
    }
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
        featuredEl.innerHTML = renderFeaturedCard(featuredPost);
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
