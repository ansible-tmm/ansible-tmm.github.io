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

  /* ── Footer sticker easter egg ── */
  const stickerBtn = document.querySelector('.site-footer__sticker-btn');
  if (stickerBtn) {
    const stickerSound = new Audio('assets/huh-cat.mp3');
    let popupTimeout;
    let popupRemoveTimeout;

    function showMehPopup() {
      const existing = document.querySelector('.sticker-popup');
      if (existing) existing.remove();
      clearTimeout(popupTimeout);
      clearTimeout(popupRemoveTimeout);

      const popup = document.createElement('div');
      popup.className = 'sticker-popup';
      popup.setAttribute('role', 'img');
      popup.setAttribute('aria-label', 'Meh');
      popup.innerHTML = '<img src="assets/andrius-meh.jpg" alt="" aria-hidden="true">';
      document.body.appendChild(popup);

      requestAnimationFrame(() => popup.classList.add('sticker-popup--visible'));

      popupTimeout = setTimeout(() => {
        popup.classList.remove('sticker-popup--visible');
        popupRemoveTimeout = setTimeout(() => popup.remove(), prefersReducedMotion ? 0 : 250);
      }, 2000);
    }

    stickerBtn.addEventListener('click', () => {
      stickerSound.currentTime = 0;
      stickerSound.play().catch(() => {});
      showMehPopup();
    });
  }

  /* ── Entrance animation ── */
  if (!prefersReducedMotion) {
    document.body.classList.add('has-entrance');
  }

  /* ── Project rendering ── */
  if (typeof PROJECTS === 'undefined' || typeof CATEGORIES === 'undefined') return;

  const sectionsContainer = document.getElementById('project-sections');

  function createCard(project) {
    const card = document.createElement('article');
    card.className = 'card';

    const iconId = 'icon-' + project.icon;
    const linkLabel = project.name + ' — open project (opens in new tab)';

    card.innerHTML =
      '<a href="' + escapeAttr(project.url) + '" class="card__surface" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(linkLabel) + '">' +
        '<div class="card__icon" aria-hidden="true">' +
          '<svg class="icon" viewBox="0 0 24 24"><use href="#' + iconId + '"></use></svg>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__category">' + escapeHtml(project.category) + '</span>' +
          '<h3 class="card__title">' + escapeHtml(project.name) + '</h3>' +
          '<p class="card__desc">' + escapeHtml(project.description) + '</p>' +
        '</div>' +
        '<div class="card__actions">' +
          '<span class="card__cta btn btn--card">' +
            'Visit' +
            '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-external"></use></svg>' +
          '</span>' +
        '</div>' +
      '</a>' +
      (project.github
        ? '<a href="' + escapeAttr(project.github) + '" class="card__github" target="_blank" rel="noopener noreferrer"' +
            ' aria-label="' + escapeAttr(project.name + ' — view source on GitHub (opens in new tab)') + '">' +
            '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-github"></use></svg>' +
            'Source' +
          '</a>'
        : '');

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
