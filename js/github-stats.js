(function () {
  'use strict';

  const container = document.getElementById('github-stats');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatCount(value) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (value >= 10000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    if (value >= 1000) {
      return value.toLocaleString();
    }
    return String(value);
  }

  function formatUpdatedAt(isoString) {
    const updated = new Date(isoString);
    if (Number.isNaN(updated.getTime())) return '';

    const diffMs = Date.now() - updated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return 'Updated ' + diffHours + 'h ago';

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return 'Updated ' + diffDays + ' days ago';

    return 'Updated ' + updated.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function animateValue(element, target) {
    element.textContent = '0';

    if (prefersReducedMotion || target <= 20) {
      element.textContent = formatCount(target);
      return;
    }

    const duration = 900;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCount(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.textContent = formatCount(target);
      }
    }

    requestAnimationFrame(frame);
  }

  function renderStats(stats) {
    const orgUrl = 'https://github.com/' + stats.org;
    const metrics = [
      { key: 'repositories', label: 'Repositories', value: stats.repositories },
      { key: 'stars', label: 'Stars', value: stats.stars },
      { key: 'commits', label: 'Commits', value: stats.commits },
      { key: 'pull_requests', label: 'Pull requests', value: stats.pull_requests },
    ];

    let metricsHtml = '';
    metrics.forEach((metric) => {
      metricsHtml +=
        '<div class="hero-stat">' +
          '<dt class="hero-stat__label">' + escapeHtml(metric.label) + '</dt>' +
          '<dd class="hero-stat__value" data-value="' + metric.value + '">—</dd>' +
        '</div>';
    });

    let activityHtml = '';
    if (Array.isArray(stats.recent_repos) && stats.recent_repos.length > 0) {
      const repoLinks = stats.recent_repos.map((repo) => {
        return '<a href="' + escapeAttr(repo.url) + '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(repo.name) +
        '</a>';
      }).join('<span class="hero-stats__sep" aria-hidden="true">·</span>');

      activityHtml =
        '<p class="hero-stats__activity">' +
          '<span class="hero-stats__activity-label">Recently updated:</span> ' +
          repoLinks +
        '</p>';
    }

    container.innerHTML =
      '<div class="hero-stats">' +
        '<div class="hero-stats__header">' +
          '<a href="' + escapeAttr(orgUrl) + '" class="hero-stats__org" target="_blank" rel="noopener noreferrer">' +
            '<span class="hero-stats__live" aria-hidden="true"></span>' +
            '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-github"></use></svg>' +
            '<span>github.com/' + escapeHtml(stats.org) + '</span>' +
          '</a>' +
          '<span class="hero-stats__updated">' + escapeHtml(formatUpdatedAt(stats.updated_at)) + '</span>' +
        '</div>' +
        '<dl class="hero-stats__grid">' + metricsHtml + '</dl>' +
        activityHtml +
      '</div>';

    container.hidden = false;
    container.querySelectorAll('.hero-stat__value').forEach((element) => {
      const value = Number(element.getAttribute('data-value'));
      if (!Number.isFinite(value)) return;
      animateValue(element, value);
    });
  }

  fetch('data/github-stats.json', { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load GitHub stats');
      return response.json();
    })
    .then(renderStats)
    .catch(() => {
      container.remove();
    });
})();
