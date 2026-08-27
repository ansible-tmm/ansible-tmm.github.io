(function () {
  'use strict';

  const listView = document.getElementById('team-list');
  const profileView = document.getElementById('team-profile');
  const ASSET_BASE = '../assets/team/';

  const SOCIAL_ICONS = {
    linkedin:
      '<svg class="icon icon--sm" viewBox="0 0 16 16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.4-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>' +
      '</svg>',
    x:
      '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.15-6.73L4.74 22H1.48l8.02-9.16L1.5 2h6.74l4.66 6.16L18.244 2zm-2.31 18h1.77L7.08 4H5.23l10.704 16z"/>' +
      '</svg>',
    bluesky:
      '<svg class="icon icon--sm" viewBox="0 0 600 530" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-54.453-52.561-34.086-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.956-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"/>' +
      '</svg>',
  };

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

  function socialLinks(member, { compact = false } = {}) {
    const links = [];
    const linkClass = compact ? 'team-social team-social--compact' : 'team-social';

    if (member.linkedin) {
      links.push(
        '<a href="' + escapeAttr(member.linkedin) + '" class="' + linkClass + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on LinkedIn (opens in new tab)') + '">' +
        SOCIAL_ICONS.linkedin +
        (compact ? '' : '<span>LinkedIn</span>') +
        '</a>'
      );
    }
    if (member.twitter) {
      links.push(
        '<a href="' + escapeAttr(member.twitter) + '" class="' + linkClass + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on X (opens in new tab)') + '">' +
        SOCIAL_ICONS.x +
        (compact ? '' : '<span>X</span>') +
        '</a>'
      );
    }
    if (member.bluesky) {
      links.push(
        '<a href="' + escapeAttr(member.bluesky) + '" class="' + linkClass + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on Bluesky (opens in new tab)') + '">' +
        SOCIAL_ICONS.bluesky +
        (compact ? '' : '<span>Bluesky</span>') +
        '</a>'
      );
    }
    return links.join('');
  }

  function renderCard(member) {
    const social = socialLinks(member, { compact: true });
    return (
      '<article class="team-card">' +
        '<a href="#' + escapeAttr(member.slug) + '" class="team-card__link" aria-label="' + escapeAttr('View profile for ' + member.name) + '">' +
          '<div class="team-card__photo-wrap">' +
            '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="team-card__photo" width="240" height="240" loading="lazy" decoding="async">' +
          '</div>' +
          '<div class="team-card__body">' +
            '<h3 class="team-card__name">' + escapeHtml(member.name) + '</h3>' +
            '<p class="team-card__title">' + escapeHtml(member.title) + '</p>' +
            '<p class="team-card__location">' + escapeHtml(member.location) + '</p>' +
            '<span class="team-card__cta">View profile <span aria-hidden="true">→</span></span>' +
          '</div>' +
        '</a>' +
        (social
          ? '<div class="team-card__footer">' + social + '</div>'
          : '') +
      '</article>'
    );
  }

  function renderList() {
    if (!listView || typeof TEAM === 'undefined') return;

    const members = TEAM.slice().sort((a, b) => a.name.localeCompare(b.name));
    let html = '<div class="team-grid">';
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
          '<div class="team-profile__photo-wrap">' +
            '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="team-profile__photo" width="160" height="160" loading="lazy" decoding="async">' +
          '</div>' +
          '<div class="team-profile__meta">' +
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
            ? '<details class="team-fun-fact">' +
                '<summary class="team-fun-fact__summary">Behind the scenes</summary>' +
                '<div class="team-fun-fact__body">' +
                  '<p>' + escapeHtml(member.funFact) + '</p>' +
                  '<a href="https://ansible-tmm.github.io/ansible-f1/" class="team-fun-fact__link" target="_blank" rel="noopener noreferrer">Play Ansible F1</a>' +
                '</div>' +
              '</details>'
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
