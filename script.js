/* ============================================
   JAZZ DEV PORTFOLIO — INTERACTIVE SCRIPTS
   ============================================ */

(function () {
  'use strict';

  // ─── PARTICLE CANVAS BACKGROUND ───
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 77, 77, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((w * h) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 77, 77, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 77, 77, ${0.12 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    resize();
    initParticles();
    animate();
  }

  // ─── CURSOR GLOW ───
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ─── HEADER SCROLL EFFECT ───
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── BACK TO TOP ───
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── HAMBURGER MENU ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── SCROLL REVEAL (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ─── SKILL BARS ANIMATION ───
  const skillFills = document.querySelectorAll('.skill-fill');

  if ('IntersectionObserver' in window && skillFills.length > 0) {
    const skillObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillFills.forEach(el => skillObserver.observe(el));
  }

  // ─── ANIMATED COUNTERS ───
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── TILT EFFECT ON HERO IMAGE ───
  const heroImageWrapper = document.querySelector('.hero-image-wrapper');
  if (heroImageWrapper && window.matchMedia('(hover: hover)').matches) {
    heroImageWrapper.addEventListener('mousemove', e => {
      const rect = heroImageWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroImageWrapper.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    heroImageWrapper.addEventListener('mouseleave', () => {
      heroImageWrapper.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      heroImageWrapper.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        heroImageWrapper.style.transition = '';
      }, 500);
    });
  }
})();
