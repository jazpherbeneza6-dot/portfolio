/**
 * ============================================================================
 * MODULE: AMBIENT CANVAS & RESOURCE SUSPENSION
 * Renders the ambient cosmic particle mesh and suspends offscreen elements.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initAmbientCanvas() {
  // ─── 0. LAZY LOADING & OFFSCREEN SUSPENSION ENGINE ───
  // Pause heavy resources (video, CSS animations) when they leave the viewport
  if (typeof IntersectionObserver !== 'undefined') {

    // 0A. Background Videos: pause when offscreen, resume when visible
    const bgVideos = document.querySelectorAll('.editorial-bg-video, .dock-bg-video');
    if (bgVideos.length > 0) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.play().catch(() => { }); // resume playback
          } else {
            entry.target.pause(); // stop decoding frames when hidden
          }
        });
      }, { threshold: 0.05 });
      bgVideos.forEach(vid => videoObserver.observe(vid));
    }

    // 0B. Pause CSS animations on offscreen elements via .anim-paused class
    const animatedEls = document.querySelectorAll(
      '.dock-radar-ring, .anime-lightning-aura, .portrait-electric-aura'
    );
    if (animatedEls.length > 0) {
      const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
        });
      }, { threshold: 0.01 });
      animatedEls.forEach(el => animObserver.observe(el));
    }
  }
  // ─── 1. AMBIENT COSMIC BACKGROUND CANVAS ───
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(45, Math.floor(width / 40));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(192, 132, 252, ',
        alpha: Math.random() * 0.7 + 0.2
      });
    }

    // Suspend rendering when page is scrolled down past the first fold (completely hidden behind solid layers)
    let isCanvasVisible = true;
    window.addEventListener('scroll', () => {
      isCanvasVisible = window.scrollY < window.innerHeight + 100;
    }, { passive: true });

    function renderCanvas() {
      if (isCanvasVisible) {
        ctx.clearRect(0, 0, width, height);

        // Draw subtle connective cyber mesh (O(N^2) optimized by reduced count)
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0) p1.x = width;
          if (p1.x > width) p1.x = 0;
          if (p1.y < 0) p1.y = height;
          if (p1.y > height) p1.y = 0;

          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fillStyle = p1.color + p1.alpha + ')';
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 90)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });
  }

  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initAmbientCanvas = initAmbientCanvas;
})(window);
