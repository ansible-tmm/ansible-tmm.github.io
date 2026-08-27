(function () {
  'use strict';

  const listView = document.getElementById('team-list');
  const profileView = document.getElementById('team-profile');
  const ASSET_BASE = '../assets/team/';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getMemberFromHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash || typeof TEAM === 'undefined') return null;
    return TEAM.find((m) => m.slug === hash) || null;
  }

  function socialLinks(member) {
    const links = [];
    if (member.linkedin) {
      links.push(
        '<a href="' + escapeAttr(member.linkedin) + '" class="team-social" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on LinkedIn (opens in new tab)') + '">' +
        '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-linkedin"></use></svg>' +
        '<span>LinkedIn</span></a>'
      );
    }
    if (member.twitter) {
      links.push(
        '<a href="' + escapeAttr(member.twitter) + '" class="team-social" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on X (opens in new tab)') + '">' +
        '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-x"></use></svg>' +
        '<span>X</span></a>'
      );
    }
    if (member.bluesky) {
      links.push(
        '<a href="' + escapeAttr(member.bluesky) + '" class="team-social" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on Bluesky (opens in new tab)') + '">' +
        '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-bluesky"></use></svg>' +
        '<span>Bluesky</span></a>'
      );
    }
    return links.join('');
  }

  function renderList() {
    if (!listView || typeof TEAM === 'undefined') return;

    const managers = TEAM.filter((m) => m.manager);
    const members = TEAM.filter((m) => !m.manager);

    function renderCard(member) {
      return (
        '<article class="team-card">' +
          '<a href="#' + escapeAttr(member.slug) + '" class="team-card__link">' +
            '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="team-card__photo" width="160" height="160" loading="lazy" decoding="async">' +
            '<div class="team-card__body">' +
              (member.manager ? '<span class="team-card__badge">Manager</span>' : '') +
              '<h3 class="team-card__name">' + escapeHtml(member.name) + '</h3>' +
              '<p class="team-card__title">' + escapeHtml(member.title) + '</p>' +
              '<p class="team-card__location">' + escapeHtml(member.location) + '</p>' +
            '</div>' +
          '</a>' +
        '</article>'
      );
    }

    let html = '<div class="team-grid">';
    managers.forEach((m) => { html += renderCard(m); });
    members.forEach((m) => { html += renderCard(m); });
    html += '</div>';

    listView.innerHTML = html;
    listView.hidden = false;
    if (profileView) profileView.hidden = true;
    document.title = 'Meet the Team — Ansible TMM';
  }

  function renderProfile(member) {
    if (!profileView) return;

    profileView.innerHTML =
      '<a href="#" class="team-back" id="team-back">← Back to team</a>' +
      '<article class="team-profile">' +
        '<div class="team-profile__header">' +
          '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="team-profile__photo" width="220" height="220" loading="lazy" decoding="async">' +
          '<div class="team-profile__meta">' +
            (member.manager ? '<span class="team-card__badge">Manager</span>' : '') +
            '<h2 class="team-profile__name">' + escapeHtml(member.name) + '</h2>' +
            '<p class="team-profile__title">' + escapeHtml(member.title) + '</p>' +
            '<p class="team-profile__location">' + escapeHtml(member.location) + '</p>' +
            (member.username ? '<p class="team-profile__username">@' + escapeHtml(member.username) + '</p>' : '') +
            '<div class="team-profile__social">' + socialLinks(member) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="team-profile__content">' +
          '<h3 class="team-profile__section-title">About</h3>' +
          '<p class="team-profile__bio">' + escapeHtml(member.bio) + '</p>' +
          (member.funFact
            ? '<aside class="team-fun-fact">' +
                '<h3 class="team-fun-fact__title">Ansible F1 says…</h3>' +
                '<p>' + escapeHtml(member.funFact) + '</p>' +
                '<a href="https://ansible-tmm.github.io/ansible-f1/" class="team-fun-fact__link" target="_blank" rel="noopener noreferrer">Play Ansible F1</a>' +
              '</aside>'
            : '') +
        '</div>' +
      '</article>';

    profileView.hidden = false;
    if (listView) listView.hidden = true;
    document.title = member.name + ' — Ansible TMM Team';

    const backBtn = document.getElementById('team-back');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
      });
    }
  }

  function route() {
    const member = getMemberFromHash();
    if (member) {
      renderProfile(member);
    } else {
      renderList();
    }
  }

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav__menu--open', !expanded);
    });
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.addEventListener('hashchange', route);
  route();
})();
