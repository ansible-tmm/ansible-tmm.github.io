(function () {
  'use strict';

  function initEventBanner() {
    if (document.getElementById('reinvent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'reinvent-banner';
    banner.className = 'reinvent-banner hidden';
    banner.innerHTML =
      '<div class="reinvent-banner-content">' +
        '<div class="reinvent-banner-text"><strong id="event-banner-text"></strong></div>' +
        '<button id="close-reinvent-banner" class="reinvent-banner-close" aria-label="Close banner">&times;</button>' +
      '</div>';

    var skip = document.querySelector('.skip-link');
    if (skip && skip.parentNode === document.body) {
      skip.insertAdjacentElement('afterend', banner);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    var bannerText = document.getElementById('event-banner-text');
    var closeButton = document.getElementById('close-reinvent-banner');
    var now = new Date();

    // AWS event Nov 30–Dec 4, 2026; show signup through end of Dec 4 ET
    var events = [
      {
        id: 'aws-2026-11-30',
        href: 'https://forms.gle/H8WZ73vvDEbwXZtt8',
        label: 'Meet Red Hat Ansible at AWS',
        detail: 'Nov 30 – Dec 4, 2026 · Sign up',
        start: new Date('2026-11-20T00:00:00-05:00'),
        end: new Date('2026-12-04T23:59:59-05:00')
      }
    ];

    var activeEvent = events.find(function (event) {
      return now >= event.start && now <= event.end;
    });

    if (!activeEvent) {
      banner.classList.add('hidden');
      return;
    }

    var dismissKey = 'reinvent-banner-dismissed-' + activeEvent.id;
    if (localStorage.getItem(dismissKey) === 'true') {
      banner.classList.add('hidden');
      return;
    }

    bannerText.innerHTML =
      '<a href="' + activeEvent.href + '" target="_blank" rel="noopener" style="color: white; text-decoration: underline;">' +
      activeEvent.label +
      '</a> — ' + activeEvent.detail;
    banner.classList.remove('hidden');

    if (closeButton) {
      closeButton.addEventListener('click', function () {
        banner.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        banner.style.transform = 'translateY(-100%)';
        banner.style.opacity = '0';
        setTimeout(function () {
          banner.classList.add('hidden');
          localStorage.setItem(dismissKey, 'true');
        }, 300);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventBanner);
  } else {
    initEventBanner();
  }
})();
