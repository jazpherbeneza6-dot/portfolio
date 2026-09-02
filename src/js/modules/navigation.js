/**
 * ============================================================================
 * MODULE: NAVIGATION, FLOATING DOCK & SCROLL SPY
 * Handles smooth anchor scrolling, floating nav dock synchronization,
 * and back to top button.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initNavigation() {
  // ─── 11. ACTIVE NAV SPY (FLOATING DOCK & LINKS via IntersectionObserver) ───
  const sections = document.querySelectorAll('section[id]');
  const dockIconLinks = document.querySelectorAll('.dock-icon-link');

  if (sections.length > 0 && typeof IntersectionObserver !== 'undefined') {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Trigger when section occupies center focus
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id === 'about') {
            const pSkills = document.getElementById('panelSkills');
            const isSkillsActive = pSkills && pSkills.classList.contains('active');
            dockIconLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (isSkillsActive) {
                link.classList.toggle('active', href === '#skills');
              } else {
                link.classList.toggle('active', href === '#about');
              }
            });
          } else {
            dockIconLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => spyObserver.observe(section));
  }

  // Back to top button visibility (Throttled scroll updates to eliminate main thread lag)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (backToTopBtn) {
          backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
        scrollTimeout = null;
      }, 120);
    }
  }, { passive: true });

  // ─── 12. FLOATING BACK TO TOP ───
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  // ─── 13. NATURAL SMOOTH ANCHOR NAVIGATION & DOCK SYNC ───
  function initSmoothNav() {
    const dockLinks = document.querySelectorAll('.floating-nav-dock a');
    const sections = ['home', 'about', 'projects', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    // Smooth scroll for floating nav dock links
    dockLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const id = href.substring(1);
          if (id === 'skills') {
            const aboutEl = document.getElementById('about');
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: 'smooth' });
              if (typeof switchBentoTab === 'function') switchBentoTab('skills');
            }
          } else {
            const target = document.getElementById(id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });

    // Monogram brand logo click
    const brandLogo = document.querySelector('.nav-brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Synchronize active nav dock link on natural scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          dockLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else if (currentId === 'about' && href === '#skills') {
              // skills belongs to about section
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    });

    sections.forEach(sec => observer.observe(sec));
  }

  initSmoothNav();
  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initNavigation = initNavigation;
})(window);
