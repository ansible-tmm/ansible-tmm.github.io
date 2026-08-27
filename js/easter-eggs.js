(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dismissHandlers = new Set();

  let fireworksCanvas;
  let fireworksFrameId;
  let fireworksTimeout;
  let fireworksParticles = [];
  let fireworksRockets = [];
  let fireworksLastTime = 0;

  let discoOverlay;
  let discoTimeout;
  let discoAudio;

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function registerDismiss(handler) {
    dismissHandlers.add(handler);
    return () => dismissHandlers.delete(handler);
  }

  function dismissAll() {
    [...dismissHandlers].forEach((handler) => {
      try {
        handler();
      } catch (_err) {
        /* ignore */
      }
    });
  }

  function dismissPopup(popup, timeouts) {
    if (!popup || !popup.isConnected) return;
    if (timeouts) {
      clearTimeout(timeouts.hide);
      clearTimeout(timeouts.remove);
    }
    popup.classList.remove('sticker-popup--visible');
    const removeDelay = prefersReducedMotion ? 0 : 250;
    setTimeout(() => popup.remove(), removeDelay);
  }

  function showDismissiblePopup({
    imageSrc,
    ariaLabel,
    durationMs = 2000,
    extraClass = '',
  }) {
    dismissAll();

    const existing = document.querySelector('.sticker-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'sticker-popup sticker-popup--dismissible' + (extraClass ? ' ' + extraClass : '');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', ariaLabel);
    popup.innerHTML =
      '<div class="sticker-popup__content">' +
        '<button type="button" class="sticker-popup__close" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '<img src="' + escapeAttr(imageSrc) + '" alt="" aria-hidden="true">' +
      '</div>';
    document.body.appendChild(popup);

    const timeouts = { hide: null, remove: null };

    function dismiss() {
      unregister();
      dismissPopup(popup, timeouts);
    }

    const unregister = registerDismiss(dismiss);

    const closeBtn = popup.querySelector('.sticker-popup__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
      });
    }

    popup.addEventListener('click', (e) => {
      if (e.target === popup) dismiss();
    });

    requestAnimationFrame(() => popup.classList.add('sticker-popup--visible'));

    if (durationMs > 0) {
      timeouts.hide = setTimeout(dismiss, durationMs);
    }

    return { popup, dismiss };
  }

  function randomFireworkColor() {
    const colors = ['#ee0000', '#ff6600', '#ffcc00', '#ffffff', '#ff3366', '#66ccff', '#cc66ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createRocket() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: -(6 + Math.random() * 4),
      color: randomFireworkColor(),
      trail: [],
    };
  }

  function explodeFirework(x, y, color) {
    const count = 24 + Math.floor(Math.random() * 16);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 2 + Math.random() * 4;
      fireworksParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        color: color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  function resizeFireworksCanvas() {
    if (!fireworksCanvas) return;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }

  function stopFireworks() {
    if (fireworksFrameId) {
      cancelAnimationFrame(fireworksFrameId);
      fireworksFrameId = null;
    }
    clearTimeout(fireworksTimeout);
    fireworksTimeout = null;
    fireworksParticles = [];
    fireworksRockets = [];
    fireworksLastTime = 0;
    if (fireworksCanvas) {
      fireworksCanvas.remove();
      fireworksCanvas = null;
    }
  }

  function animateFireworks(timestamp) {
    if (!fireworksCanvas) return;

    const ctx = fireworksCanvas.getContext('2d');
    const dt = fireworksLastTime ? Math.min((timestamp - fireworksLastTime) / 16.67, 2) : 1;
    fireworksLastTime = timestamp;

    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    if (Math.random() < 0.08 * dt) {
      fireworksRockets.push(createRocket());
    }

    fireworksRockets = fireworksRockets.filter((rocket) => {
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 8) rocket.trail.shift();

      rocket.x += rocket.vx * dt;
      rocket.y += rocket.vy * dt;
      rocket.vy += 0.12 * dt;

      ctx.strokeStyle = rocket.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      rocket.trail.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      if (rocket.vy >= -1) {
        explodeFirework(rocket.x, rocket.y, rocket.color);
        return false;
      }
      return true;
    });

    fireworksParticles = fireworksParticles.filter((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 0.08 * dt;
      particle.vx *= 0.99;
      particle.life -= particle.decay * dt;

      if (particle.life <= 0) return false;

      ctx.globalAlpha = Math.max(particle.life, 0);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return true;
    });

    fireworksFrameId = requestAnimationFrame(animateFireworks);
  }

  function startFireworks(durationMs) {
    if (prefersReducedMotion) return { dismiss: function () {} };

    stopFireworks();

    fireworksCanvas = document.createElement('canvas');
    fireworksCanvas.className = 'fireworks-canvas';
    fireworksCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fireworksCanvas);
    resizeFireworksCanvas();

    const onResize = () => resizeFireworksCanvas();
    window.addEventListener('resize', onResize);

    function dismiss() {
      window.removeEventListener('resize', onResize);
      unregister();
      stopFireworks();
    }

    const unregister = registerDismiss(dismiss);

    fireworksFrameId = requestAnimationFrame(animateFireworks);
    fireworksTimeout = setTimeout(dismiss, durationMs);

    return { dismiss: dismiss };
  }

  function stopDiscoParty() {
    clearTimeout(discoTimeout);
    discoTimeout = null;
    if (discoAudio) {
      discoAudio.pause();
      discoAudio.currentTime = 0;
      discoAudio = null;
    }
    if (discoOverlay) {
      discoOverlay.remove();
      discoOverlay = null;
    }
  }

  function startDiscoParty(audioSrc, durationMs) {
    if (prefersReducedMotion) return { dismiss: function () {} };

    stopDiscoParty();
    dismissAll();

    discoOverlay = document.createElement('div');
    discoOverlay.className = 'disco-overlay';
    discoOverlay.setAttribute('aria-hidden', 'true');

    const lights = document.createElement('div');
    lights.className = 'disco-overlay__lights';
    lights.innerHTML =
      '<span class="disco-light disco-light--1"></span>' +
      '<span class="disco-light disco-light--2"></span>' +
      '<span class="disco-light disco-light--3"></span>' +
      '<span class="disco-light disco-light--4"></span>';

    const balls = document.createElement('div');
    balls.className = 'disco-overlay__balls';

    const positions = [
      { top: '8%', left: '12%', size: 72, delay: 0 },
      { top: '14%', left: '78%', size: 96, delay: 0.3 },
      { top: '42%', left: '6%', size: 84, delay: 0.6 },
      { top: '38%', left: '88%', size: 68, delay: 0.15 },
      { top: '72%', left: '18%', size: 90, delay: 0.45 },
      { top: '68%', left: '72%', size: 104, delay: 0.75 },
      { top: '24%', left: '46%', size: 56, delay: 0.9 },
      { top: '58%', left: '48%', size: 80, delay: 0.2 },
    ];

    positions.forEach((pos, index) => {
      const ball = document.createElement('div');
      ball.className = 'disco-ball';
      ball.style.top = pos.top;
      ball.style.left = pos.left;
      ball.style.width = pos.size + 'px';
      ball.style.height = pos.size + 'px';
      ball.style.animationDelay = pos.delay + 's';
      ball.innerHTML = '<span class="disco-ball__shine"></span>';
      balls.appendChild(ball);
    });

    discoOverlay.appendChild(lights);
    discoOverlay.appendChild(balls);
    document.body.appendChild(discoOverlay);

    discoAudio = new Audio(audioSrc);
    discoAudio.currentTime = 0;
    discoAudio.play().catch(() => {});

    function dismiss() {
      unregister();
      stopDiscoParty();
    }

    const unregister = registerDismiss(dismiss);

    requestAnimationFrame(() => discoOverlay.classList.add('disco-overlay--visible'));
    discoTimeout = setTimeout(dismiss, durationMs);

    return { dismiss: dismiss };
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (dismissHandlers.size === 0) return;
    e.preventDefault();
    dismissAll();
  });

  window.EasterEggs = {
    showDismissiblePopup: showDismissiblePopup,
    dismissPopup: dismissPopup,
    dismissAll: dismissAll,
    registerDismiss: registerDismiss,
    startFireworks: startFireworks,
    stopFireworks: stopFireworks,
    startDiscoParty: startDiscoParty,
    stopDiscoParty: stopDiscoParty,
    prefersReducedMotion: prefersReducedMotion,
  };
})();
