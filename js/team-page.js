(function () {
  'use strict';

  const listView = document.getElementById('team-list');
  const profileView = document.getElementById('team-profile');
  const ASSET_BASE = '../assets/team/';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let anshulDemoSound;
  let gifPopupTimeout;
  let gifPopupRemoveTimeout;

  const PROFILE_GIFS = {
    'leonardo-gallego': {
      src: '../assets/leonardo-laugh.gif',
      durationMs: 6280,
      label: 'Leo laughs',
    },
    'nuno-martins': {
      src: '../assets/nuno-matrix.gif',
      durationMs: 9540,
      label: 'Nuno stops bullets',
    },
    'hicham-mourad': {
      src: '../assets/hicham-nimbus.gif',
      durationMs: 1000,
      label: 'Hicham on the Flying Nimbus',
    },
  };

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
    redhat:
      '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="M16.009 13.386c1.577 0 3.86-.326 3.86-2.202a1.765 1.765 0 0 0-.04-.431l-.94-4.08c-.216-.898-.406-1.305-1.982-2.093-1.223-.625-3.888-1.658-4.676-1.658-.733 0-.947.946-1.822.946-.842 0-1.467-.706-2.255-.706-.757 0-1.25.515-1.63 1.576 0 0-1.06 2.99-1.197 3.424a.81.81 0 0 0-.028.245c0 1.162 4.577 4.974 10.71 4.974m4.101-1.435c.218 1.032.218 1.14.218 1.277 0 1.765-1.984 2.745-4.593 2.745-5.895.004-11.06-3.451-11.06-5.734a2.326 2.326 0 0 1 .19-.925C2.746 9.415 0 9.794 0 12.217c0 3.969 9.405 8.861 16.851 8.861 5.71 0 7.149-2.582 7.149-4.62 0-1.605-1.387-3.425-3.887-4.512"/>' +
      '</svg>',
    github:
      '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.021C22 6.484 17.522 2 12 2z"/>' +
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

  function formatBio(bio) {
    return bio
      .split(/\n\n+/)
      .map(function (paragraph) {
        return '<p class="team-profile__bio">' + escapeHtml(paragraph.trim()) + '</p>';
      })
      .join('');
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
    if (member.redhat) {
      links.push(
        '<a href="' + escapeAttr(member.redhat) + '" class="' + linkClass + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on Red Hat (opens in new tab)') + '">' +
        SOCIAL_ICONS.redhat +
        (compact ? '' : '<span>Red Hat</span>') +
        '</a>'
      );
    }
    if (member.github) {
      links.push(
        '<a href="' + escapeAttr(member.github) + '" class="' + linkClass + '" target="_blank" rel="noopener noreferrer"' +
        ' aria-label="' + escapeAttr(member.name + ' on GitHub (opens in new tab)') + '">' +
        SOCIAL_ICONS.github +
        (compact ? '' : '<span>GitHub</span>') +
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
            '<img src="' + escapeAttr(ASSET_BASE + member.photo) + '" alt="" class="team-card__photo" width="120" height="120" loading="lazy" decoding="async">' +
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

  function goToTeamList() {
    if (getMemberFromHash()) {
      window.location.hash = '';
    }
  }

  function isTypingTarget(target) {
    if (!target || !(target instanceof Element)) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  function attachInteractivePhoto(photoWrap, onActivate) {
    photoWrap.classList.add('team-profile__photo-wrap--interactive');
    photoWrap.setAttribute('role', 'button');
    photoWrap.setAttribute('tabindex', '0');

    photoWrap.addEventListener('click', onActivate);
    photoWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    });
  }

  function showGifPopup(gifSrc, durationMs, ariaLabel) {
    const existing = document.querySelector('.team-gif-popup');
    if (existing) existing.remove();
    clearTimeout(gifPopupTimeout);
    clearTimeout(gifPopupRemoveTimeout);

    const popup = document.createElement('div');
    popup.className = 'sticker-popup team-gif-popup';
    popup.setAttribute('role', 'img');
    popup.setAttribute('aria-label', ariaLabel);
    popup.innerHTML = '<img src="' + escapeAttr(gifSrc) + '" alt="" aria-hidden="true">';
    document.body.appendChild(popup);

    requestAnimationFrame(() => popup.classList.add('sticker-popup--visible'));

    gifPopupTimeout = setTimeout(() => {
      popup.classList.remove('sticker-popup--visible');
      gifPopupRemoveTimeout = setTimeout(
        () => popup.remove(),
        prefersReducedMotion ? 0 : 250
      );
    }, durationMs);
  }

  function attachGifEasterEgg(photoWrap, gifConfig) {
    attachInteractivePhoto(photoWrap, () => {
      showGifPopup(gifConfig.src, gifConfig.durationMs, gifConfig.label);
    });
    photoWrap.setAttribute('aria-label', gifConfig.label);
    photoWrap.setAttribute('title', gifConfig.label);
  }

  function renderProfile(member) {
    if (!profileView) return;

    profileView.innerHTML =
      '<a href="#" class="team-back" id="team-back" aria-label="Back to team list. Keyboard shortcut: left arrow key.">' +
        '<span class="team-back__arrow" aria-hidden="true">←</span>' +
        '<span>Back to team</span>' +
        '<kbd class="team-back__key" aria-hidden="true">←</kbd>' +
      '</a>' +
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
          formatBio(member.bio) +
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
        goToTeamList();
      });
    }

    if (member.slug === 'anshul-behl') {
      const photoWrap = profileView.querySelector('.team-profile__photo-wrap');
      if (photoWrap) {
        const playDemoSound = () => {
          if (!anshulDemoSound) {
            anshulDemoSound = new Audio('../assets/demo-demo-demo.mp3');
          }
          anshulDemoSound.currentTime = 0;
          anshulDemoSound.play().catch(() => {});
        };

        attachInteractivePhoto(photoWrap, playDemoSound);
        photoWrap.setAttribute('aria-label', 'Play demo demo demo sound');
        photoWrap.setAttribute('title', 'Demo demo demo');
      }
    }

    const gifConfig = PROFILE_GIFS[member.slug];
    if (gifConfig) {
      const photoWrap = profileView.querySelector('.team-profile__photo-wrap');
      if (photoWrap) {
        attachGifEasterEgg(photoWrap, gifConfig);
      }
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

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__menu--open');
      });
    });
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  window.addEventListener('hashchange', route);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!profileView || profileView.hidden) return;
    if (isTypingTarget(e.target)) return;
    e.preventDefault();
    goToTeamList();
  });

  route();
})();
