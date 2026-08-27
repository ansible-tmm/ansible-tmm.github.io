(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Navigation ── */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav__menu--open', !expanded);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__menu--open');
      });
    });
  }

  /* ── Footer year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ── Entrance animation ── */
  if (!prefersReducedMotion) {
    document.body.classList.add('has-entrance');
  }

  /* ── Project rendering ── */
  if (typeof PROJECTS === 'undefined' || typeof CATEGORIES === 'undefined') return;

  const featuredContainer = document.getElementById('featured-projects');
  const sectionsContainer = document.getElementById('project-sections');

  function isExternal(url) {
    try {
      const parsed = new URL(url);
      return parsed.origin !== window.location.origin;
    } catch {
      return true;
    }
  }

  function createCard(project, { featured = false } = {}) {
    const external = isExternal(project.url);
    const card = document.createElement('article');
    card.className = 'card' + (featured ? ' card--featured' : '');

    const iconId = 'icon-' + project.icon;

    card.innerHTML =
      '<div class="card__icon" aria-hidden="true">' +
        '<svg class="icon" viewBox="0 0 24 24"><use href="#' + iconId + '"></use></svg>' +
      '</div>' +
      '<div class="card__body">' +
        '<span class="card__category">' + escapeHtml(project.category) + '</span>' +
        '<h3 class="card__title">' + escapeHtml(project.name) + '</h3>' +
        '<p class="card__desc">' + escapeHtml(project.description) + '</p>' +
      '</div>' +
      '<div class="card__actions">' +
        '<a href="' + escapeAttr(project.url) + '" class="card__link btn btn--card"' +
          (external ? ' target="_blank" rel="noopener noreferrer"' : '') +
          ' aria-label="' + escapeAttr(project.name + ' — open project' + (external ? ' (opens in new tab)' : '')) + '">' +
          'Visit' +
          (external ? '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-external"></use></svg>' : '') +
        '</a>' +
        (project.github
          ? '<a href="' + escapeAttr(project.github) + '" class="card__github" target="_blank" rel="noopener noreferrer"' +
              ' aria-label="' + escapeAttr(project.name + ' — view source on GitHub (opens in new tab)') + '">' +
              '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-github"></use></svg>' +
              'Source' +
            '</a>'
          : '') +
      '</div>';

    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Featured projects */
  const featured = PROJECTS.filter((p) => p.featured);
  if (featuredContainer && featured.length > 0) {
    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.id = 'featured-heading';
    heading.textContent = 'Featured resources';

    const grid = document.createElement('div');
    grid.className = 'card-grid card-grid--featured';
    grid.setAttribute('aria-labelledby', 'featured-heading');

    featured.forEach((project) => {
      grid.appendChild(createCard(project, { featured: true }));
    });

    featuredContainer.appendChild(heading);
    featuredContainer.appendChild(grid);
  }

  /* Category sections */
  if (sectionsContainer) {
    CATEGORIES.forEach((cat) => {
      const projects = PROJECTS.filter((p) => p.category === cat.name);
      if (projects.length === 0) return;

      const section = document.createElement('section');
      section.className = 'category-section';
      section.id = cat.id;
      section.setAttribute('aria-labelledby', cat.id + '-heading');

      const heading = document.createElement('h2');
      heading.className = 'section-heading';
      heading.id = cat.id + '-heading';
      heading.textContent = cat.name;

      const grid = document.createElement('div');
      grid.className = 'card-grid';

      projects.forEach((project) => {
        grid.appendChild(createCard(project));
      });

      section.appendChild(heading);
      section.appendChild(grid);
      sectionsContainer.appendChild(section);
    });
  }
})();
