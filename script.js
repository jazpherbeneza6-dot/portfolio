/* ==========================================================================
   JAZPHER BENEZA — FUTURISTIC CYBER / SCI-FI HUD PORTFOLIO
   Interactive Engine: Background Stars, 3D Tilt, UI Paradigm Playground & Modals
   ========================================================================== */

(function () {
  'use strict';

  // ─── 0. LAZY LOADING & OFFSCREEN SUSPENSION ENGINE ───
  // Pause heavy resources (video, CSS animations) when they leave the viewport
  if (typeof IntersectionObserver !== 'undefined') {

    // 0A. Hero Background Video: pause when offscreen, resume when visible
    const heroVideo = document.querySelector('.editorial-bg-video');
    if (heroVideo) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {}); // resume playback
          } else {
            heroVideo.pause(); // stop decoding frames when hidden
          }
        });
      }, { threshold: 0.05 });
      videoObserver.observe(heroVideo);
    }

    // 0B. Pause CSS animations on offscreen elements via .anim-paused class
    const animatedEls = document.querySelectorAll(
      '.dock-radar-ring, .anime-lightning-aura, .portrait-electric-aura, .indicator-led'
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

  // ─── 2. 3D SCI-FI TILT ON HERO HOLOGRAM CARD ───
  const heroCard = document.getElementById('heroPortraitWrapper');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroCard.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
      heroCard.style.transition = 'transform 0.5s ease';
    });

    heroCard.addEventListener('mouseenter', () => {
      heroCard.style.transition = 'none';
    });
  }

  // ─── 2B. ANIMATED LIGHTNING SPARK BORDER ENGINE ───
  const lightningCanvas = document.getElementById('lightningSparkCanvas');
  if (lightningCanvas) {
    const lCtx = lightningCanvas.getContext('2d');
    let lWidth = (lightningCanvas.width = lightningCanvas.parentElement?.offsetWidth || 400);
    let lHeight = (lightningCanvas.height = lightningCanvas.parentElement?.offsetHeight || 480);

    // Visibility-gate: suspend when offscreen
    let isLightningVisible = true;
    if (typeof IntersectionObserver !== 'undefined') {
      const lParent = lightningCanvas.closest('section') || lightningCanvas.parentElement;
      if (lParent) {
        const lObs = new IntersectionObserver((entries) => {
          entries.forEach(e => { isLightningVisible = e.isIntersecting; });
        }, { threshold: 0.01 });
        lObs.observe(lParent);
      }
    }

    const sparks = [];
    const MAX_SPARKS = 60; // cap spark count
    let perimeterProgress = 0; // 0 to 1 along rectangle perimeter

    function getPerimeterPoint(t, w, h, radius) {
      const perim = 2 * (w + h);
      const d = t * perim;

      if (d < w) return { x: d, y: 0 };
      if (d < w + h) return { x: w, y: d - w };
      if (d < 2 * w + h) return { x: w - (d - (w + h)), y: h };
      return { x: 0, y: h - (d - (2 * w + h)) };
    }

    function drawLightningSegment(p1, p2) {
      // Pass 1: Outer ionized plasma corona (diffuse glow)
      lCtx.beginPath();
      lCtx.moveTo(p1.x, p1.y);
      lCtx.lineTo(p2.x, p2.y);
      lCtx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      lCtx.lineWidth = 5;
      lCtx.shadowColor = '#38bdf8';
      lCtx.shadowBlur = 14;
      lCtx.stroke();

      // Pass 2: Electric cyan sheath
      lCtx.beginPath();
      lCtx.moveTo(p1.x, p1.y);
      lCtx.lineTo(p2.x, p2.y);
      lCtx.strokeStyle = '#22d3ee';
      lCtx.lineWidth = 2.2;
      lCtx.shadowColor = '#c084fc';
      lCtx.shadowBlur = 6;
      lCtx.stroke();

      // Pass 3: Ultra-bright white hot core filament
      lCtx.beginPath();
      lCtx.moveTo(p1.x, p1.y);
      lCtx.lineTo(p2.x, p2.y);
      lCtx.strokeStyle = '#ffffff';
      lCtx.lineWidth = 0.9;
      lCtx.shadowBlur = 0;
      lCtx.stroke();
    }

    function createLightningBolt(p1, p2, depth, maxOffset) {
      if (depth === 0) {
        drawLightningSegment(p1, p2);
        return;
      }

      const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * maxOffset;
      const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * maxOffset;
      const mid = { x: midX, y: midY };

      createLightningBolt(p1, mid, depth - 1, maxOffset / 1.8);
      createLightningBolt(mid, p2, depth - 1, maxOffset / 1.8);

      // Micro branch discharge
      if (Math.random() < 0.3) {
        const branchEnd = {
          x: mid.x + (Math.random() - 0.5) * maxOffset * 1.6,
          y: mid.y + (Math.random() - 0.5) * maxOffset * 1.6
        };
        createLightningBolt(mid, branchEnd, depth - 1, maxOffset / 2.2);
      }
    }

    function spawnSparks(x, y, count) {
      for (let i = 0; i < count; i++) {
        if (sparks.length >= MAX_SPARKS) break; // prevent unbounded growth
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        sparks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          size: Math.random() * 2.2 + 0.8,
          color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#ffffff' : '#c084fc')
        });
      }
    }

    function animateLightning() {
      requestAnimationFrame(animateLightning);
      if (!isLightningVisible) return; // skip work when offscreen

      lCtx.clearRect(0, 0, lWidth, lHeight);

      // 1. Advance perimeter spark head
      perimeterProgress = (perimeterProgress + 0.006) % 1;
      const head = getPerimeterPoint(perimeterProgress, lWidth, lHeight, 16);
      const tail = getPerimeterPoint((perimeterProgress - 0.06 + 1) % 1, lWidth, lHeight, 16);

      // 2. Draw intense traveling lightning bolt arc
      createLightningBolt(tail, head, 3, 14);

      // 3. Spawn spark particles at the lightning head
      if (Math.random() < 0.7) {
        spawnSparks(head.x, head.y, 2);
      }

      // 4. Random crackle arc jumps across corners
      if (Math.random() < 0.15) {
        const cornerIdx = Math.floor(Math.random() * 4);
        const corners = [
          { x: 4, y: 4 },
          { x: lWidth - 4, y: 4 },
          { x: lWidth - 4, y: lHeight - 4 },
          { x: 4, y: lHeight - 4 }
        ];
        const c1 = corners[cornerIdx];
        const c2 = {
          x: c1.x + (Math.random() - 0.5) * 40,
          y: c1.y + (Math.random() - 0.5) * 40
        };
        createLightningBolt(c1, c2, 2, 8);
        spawnSparks(c1.x, c1.y, 3);
      }

      // 5. Update and render spark particles (swap-and-pop for O(1) removal)
      let writeIdx = 0;
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0) continue; // skip dead sparks

        lCtx.beginPath();
        lCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        lCtx.fillStyle = s.color;
        lCtx.globalAlpha = s.life;
        lCtx.shadowColor = s.color;
        lCtx.shadowBlur = 6;
        lCtx.fill();
        lCtx.globalAlpha = 1;

        if (writeIdx !== i) sparks[writeIdx] = s;
        writeIdx++;
      }
      sparks.length = writeIdx;
    }

    animateLightning();

    let lightningResizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(lightningResizeTimeout);
      lightningResizeTimeout = setTimeout(() => {
        lWidth = lightningCanvas.width = lightningCanvas.parentElement?.offsetWidth || 400;
        lHeight = lightningCanvas.height = lightningCanvas.parentElement?.offsetHeight || 480;
      }, 150);
    });
  }

  // ─── 3. SPATIAL UI PARALLAX WIDGET TILT ───
  const spatialWidget = document.getElementById('spatialWidget');
  if (spatialWidget) {
    spatialWidget.addEventListener('mousemove', (e) => {
      const rect = spatialWidget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const midLayer = spatialWidget.querySelector('.layer-mid');
      const frontLayer = spatialWidget.querySelector('.layer-front');

      if (midLayer) midLayer.style.transform = `translateZ(30px) translate(${x * 15}px, ${y * 15}px)`;
      if (frontLayer) frontLayer.style.transform = `translateZ(60px) translate(${x * 25}px, ${y * 25}px)`;
    });

    spatialWidget.addEventListener('mouseleave', () => {
      const midLayer = spatialWidget.querySelector('.layer-mid');
      const frontLayer = spatialWidget.querySelector('.layer-front');
      if (midLayer) midLayer.style.transform = 'translateZ(25px) translate(0,0)';
      if (frontLayer) frontLayer.style.transform = 'translateZ(50px) translate(0,0)';
    });
  }

  // ─── 4. UI PARADIGMS TABS SWITCHER ───
  const paradigmPills = document.querySelectorAll('.paradigm-pill');
  const demoCards = document.querySelectorAll('.paradigm-demo-card');

  paradigmPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      paradigmPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const styleKey = pill.getAttribute('data-style');
      demoCards.forEach((card) => {
        card.classList.remove('active');
        if (card.id === `demo-${styleKey}`) {
          card.classList.add('active');
        }
      });
    });
  });

  // ─── 5. NEOMORPHISM TOGGLE SWITCH ───
  const neoToggleBtn = document.getElementById('neoToggleBtn');
  if (neoToggleBtn) {
    let isNeoActive = true;
    neoToggleBtn.addEventListener('click', () => {
      isNeoActive = !isNeoActive;
      const thumb = neoToggleBtn.querySelector('.neo-toggle-thumb');
      if (thumb) {
        thumb.style.transform = isNeoActive ? 'translateX(26px)' : 'translateX(0px)';
        thumb.style.background = isNeoActive ? '#38bdf8' : '#64748b';
      }
    });
  }

  // ─── 6. SKEUOMORPHISM ROTARY KNOB & SWITCH ───
  const skeuoKnob = document.querySelector('.skeuo-rotary-knob');
  if (skeuoKnob) {
    let angle = 0;
    skeuoKnob.addEventListener('click', () => {
      angle = (angle + 45) % 360;
      skeuoKnob.style.transform = `rotate(${angle}deg)`;
      skeuoKnob.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  }

  // ─── 7. PROJECT DETAIL MODAL HANDLER ───
  const projectModal = document.getElementById('projectDetailModal');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalLiveDemoBtn = document.getElementById('modalLiveDemoBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');

  function openProjectModal(data) {
    if (!projectModal) return;
    if (modalHeroImg) modalHeroImg.src = data.image || 'public/image/d.png';
    if (modalBadge) modalBadge.textContent = data.badge || 'PROJECT';
    if (modalTitle) modalTitle.textContent = data.title || 'Project Showcase';
    if (modalDescription) modalDescription.textContent = data.description || '';
    if (modalLiveDemoBtn) modalLiveDemoBtn.href = data.link || '#';

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.interactive-modal-overlay').forEach((m) => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeAllModals);

  // Attach to project showcase cards
  document.querySelectorAll('.project-showcase-card').forEach((card) => {
    card.addEventListener('click', () => {
      openProjectModal({
        title: card.getAttribute('data-title'),
        badge: card.getAttribute('data-badge'),
        description: card.getAttribute('data-description'),
        image: card.getAttribute('data-image'),
        link: card.getAttribute('data-link')
      });
    });
  });

  // Attach to more projects items
  document.querySelectorAll('.more-project-item').forEach((item) => {
    item.addEventListener('click', () => {
      openProjectModal({
        title: item.getAttribute('data-title'),
        badge: 'PRODUCTION SYSTEM',
        description: item.getAttribute('data-description'),
        image: item.getAttribute('data-image'),
        link: item.getAttribute('data-link')
      });
    });
  });

  // ─── 8. CONTACT MODAL & FORM DISPATCH ───
  const contactModal = document.getElementById('contactFormModal');
  const openContactBtn = document.getElementById('openContactModalBtn');
  const contactModalCloseBtn = document.getElementById('contactModalCloseBtn');
  const contactQuickForm = document.getElementById('contactQuickForm');
  const formSuccessToast = document.getElementById('formSuccessToast');

  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener('click', () => {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (contactModalCloseBtn) {
    contactModalCloseBtn.addEventListener('click', closeAllModals);
  }

  if (contactQuickForm) {
    contactQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('senderName')?.value;
      if (formSuccessToast) {
        formSuccessToast.style.display = 'block';
        formSuccessToast.textContent = `Thank you ${senderName || ''}! Your message has been dispatched.`;
      }
      setTimeout(() => {
        closeAllModals();
        contactQuickForm.reset();
        if (formSuccessToast) formSuccessToast.style.display = 'none';
      }, 2000);
    });
  }

  // ─── 9. ABOUT EXPANDED MODAL ───
  const aboutModal = document.getElementById('aboutExpandedModal');
  const openAboutBtn = document.getElementById('openAboutModalBtn');
  const aboutModalCloseBtn = document.getElementById('aboutModalCloseBtn');

  if (openAboutBtn && aboutModal) {
    openAboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      aboutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (aboutModalCloseBtn) {
    aboutModalCloseBtn.addEventListener('click', closeAllModals);
  }

  // Close modals on overlay background click
  document.querySelectorAll('.interactive-modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // ─── 10. DOWNLOAD CV NOTIFICATION / TRIGGER ───
  const downloadCvBtn = document.getElementById('downloadCvBtn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      // If contact modal exists, offer quick contact or download
      if (contactModal) {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

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
          dockIconLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
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

  // ─── 13. 3D SPATIAL UI PROJECT CAROUSEL ENGINE ───
  const carouselCards = document.querySelectorAll('.spatial-project-card');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselCounter = document.getElementById('spatialCarouselCounter');
  let currentCarouselIndex = 0;
  const totalSlides = carouselCards.length;

  function updateCarouselPositions() {
    carouselCards.forEach((card, i) => {
      card.classList.remove('active', 'next', 'prev', 'hidden-right', 'hidden-left');

      const diff = (i - currentCarouselIndex + totalSlides) % totalSlides;

      if (diff === 0) {
        card.classList.add('active');
      } else if (diff === 1) {
        card.classList.add('next');
      } else if (diff === totalSlides - 1) {
        card.classList.add('prev');
      } else if (diff > 1 && diff <= totalSlides / 2) {
        card.classList.add('hidden-right');
      } else {
        card.classList.add('hidden-left');
      }
    });

    if (carouselCounter) {
      carouselCounter.textContent = `0${currentCarouselIndex + 1} / 0${totalSlides}`;
    }
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      currentCarouselIndex = (currentCarouselIndex - 1 + totalSlides) % totalSlides;
      updateCarouselPositions();
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      currentCarouselIndex = (currentCarouselIndex + 1) % totalSlides;
      updateCarouselPositions();
    });
  }

  // Click on cards to bring to focus or open modal
  carouselCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (!card.classList.contains('active')) {
        currentCarouselIndex = index;
        updateCarouselPositions();
      } else if (e.target.closest('.btn-spatial-inspect') || e.target.closest('.spatial-card-inner')) {
        openProjectModal({
          title: card.getAttribute('data-title'),
          badge: card.getAttribute('data-badge'),
          description: card.getAttribute('data-description'),
          image: card.getAttribute('data-image'),
          link: card.getAttribute('data-link')
        });
      }
    });

    // 3D Spatial Parallax Tilt on active card
    card.addEventListener('mousemove', (e) => {
      if (!card.classList.contains('active')) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const inner = card.querySelector('.spatial-card-inner');
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.spatial-card-inner');
      if (inner) {
        inner.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      }
    });
  });

  updateCarouselPositions();

  // ─── 14. VIEW ALL PROJECTS SMOOTH SCROLL ───
  const viewAllProjectsBtn = document.getElementById('viewAllProjectsBtn');
  const allProjectsFilter = document.getElementById('allProjectsFilter');
  if (viewAllProjectsBtn && allProjectsFilter) {
    viewAllProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(allProjectsFilter, {
          offset: -24,
          duration: 1.3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        allProjectsFilter.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ─── 15. THREE.JS 3D ANIME THUNDER & SPATIAL LIGHTNING ENGINE ───
  const threeCanvas = document.getElementById('threeHeroCanvas');
  if (threeCanvas && window.THREE) {
    const THREE = window.THREE;
    const parentContainer = threeCanvas.parentElement;

    // Intersection Observer to suspend WebGL rendering when Hero is out of view
    let isHeroVisible = true;
    const heroSection = document.getElementById('home');
    if (heroSection && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
        });
      }, { threshold: 0.02 });
      observer.observe(heroSection);
    }

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 100);

    // Responsive Viewport Resize
    function resizeThree() {
      if (!parentContainer) return;
      const width = parentContainer.clientWidth;
      const height = parentContainer.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    resizeThree();
    window.addEventListener('resize', resizeThree);

    // 1. Procedural Golden Glow Ember Texture
    function createEmberTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');

      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
      grad.addColorStop(1, 'rgba(217, 119, 6, 0)');

      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    }

    const emberTexture = createEmberTexture();

    // 2. Volumetric 3D Floating Embers Cloud
    const emberCount = 220; // reduced from 380 for better scroll perf
    const emberGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(emberCount * 3);
    const scales = new Float32Array(emberCount);
    const speeds = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 100 - 10;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      speeds[i3] = (Math.random() - 0.5) * 0.08;
      speeds[i3 + 1] = Math.random() * 0.25 + 0.12;
      speeds[i3 + 2] = (Math.random() - 0.5) * 0.06;

      scales[i] = Math.random() * 3.5 + 1.2;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    emberGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const emberMat = new THREE.PointsMaterial({
      size: 4.8,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(0xfbbf24)
    });

    const emberCloud = new THREE.Points(emberGeo, emberMat);
    scene.add(emberCloud);

    // 3. 3D Procedural Branching Lightning System
    const activeBolts = [];
    const MAX_BOLTS = 30; // cap bolt objects to prevent unbounded GPU memory growth

    function trigger3DLightning(startVec, endVec, isSubBranch = false) {
      // Hard cap: skip if too many bolts are alive
      if (activeBolts.length >= MAX_BOLTS) return;

      const points = [startVec.clone()];
      const dist = startVec.distanceTo(endVec);
      const segments = Math.max(6, Math.floor(dist / 6));

      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const interp = new THREE.Vector3().lerpVectors(startVec, endVec, t);
        const jitter = 5.5 * (1 - Math.abs(t - 0.5));
        interp.x += (Math.random() - 0.5) * jitter;
        interp.y += (Math.random() - 0.5) * jitter;
        interp.z += (Math.random() - 0.5) * (jitter * 0.8);
        points.push(interp);

        if (!isSubBranch && Math.random() < 0.25) {
          const branchEnd = interp.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15
          ));
          trigger3DLightning(interp, branchEnd, true);
        }
      }
      points.push(endVec.clone());

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      // Glowing Amber Halo Line
      const glowMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        linewidth: 3
      });
      const glowLine = new THREE.Line(lineGeo, glowMat);

      // Core Hot White Line
      const coreMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5
      });
      const coreLine = new THREE.Line(lineGeo, coreMat);

      scene.add(glowLine);
      scene.add(coreLine);

      activeBolts.push({
        glow: glowLine,
        core: coreLine,
        geo: lineGeo,
        glowMat,
        coreMat,
        life: 1.0,
        decay: Math.random() * 0.08 + 0.06
      });
    }

    // 4. 3D Expanding Electric Shockwave Rings
    const shockwaves = [];
    const ringGeo = new THREE.RingGeometry(1, 1.8, 32);

    function createShockwave(pos) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.copy(pos);
      mesh.rotation.x = Math.PI * 0.5 + (Math.random() - 0.5) * 0.4;
      mesh.rotation.y = (Math.random() - 0.5) * 0.4;
      scene.add(mesh);

      shockwaves.push({
        mesh,
        mat: ringMat,
        scale: 1,
        speed: Math.random() * 0.9 + 0.6,
        life: 1.0,
        decay: 0.035
      });
    }

    // Interactive 3D Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    if (parentContainer) {
      // Throttled mousemove: limit lightning spawn to max 10fps to avoid jank during scroll
      let lastMouseLightning = 0;
      parentContainer.addEventListener('mousemove', (e) => {
        const rect = parentContainer.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetMouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;

        const now = performance.now();
        if (now - lastMouseLightning > 100 && Math.random() < 0.2) {
          lastMouseLightning = now;
          const target3D = new THREE.Vector3(targetMouseX * 50, targetMouseY * 35, 10);
          const start3D = new THREE.Vector3(
            target3D.x + (Math.random() - 0.5) * 45,
            target3D.y + Math.random() * 40 + 10,
            target3D.z + (Math.random() - 0.5) * 25
          );
          trigger3DLightning(start3D, target3D);
        }
      });

      parentContainer.addEventListener('click', (e) => {
        const rect = parentContainer.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const clickY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        const clickPos = new THREE.Vector3(clickX * 55, clickY * 40, 10);

        const strikeOrigin = new THREE.Vector3(clickPos.x + (Math.random() - 0.5) * 30, 60, 0);
        trigger3DLightning(strikeOrigin, clickPos);
        createShockwave(clickPos);
      });
    }

    // Animation Loop
    let lastLightningStrike = 0;
    let clock = new THREE.Clock();

    function animateThree(timestamp) {
      requestAnimationFrame(animateThree);
      if (!isHeroVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth 3D Camera Parallax Lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      camera.position.x = currentMouseX * 12;
      camera.position.y = currentMouseY * 10;
      camera.lookAt(0, 0, 0);

      // Animate 3D Embers Particle Cloud
      const posAttr = emberGeo.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < emberCount; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += speeds[i3 + 1];
        arr[i3] += Math.sin(elapsedTime * 1.5 + i) * 0.08 + speeds[i3];
        arr[i3 + 2] += Math.cos(elapsedTime * 1.2 + i) * 0.06 + speeds[i3 + 2];

        if (arr[i3 + 1] > 65) {
          arr[i3 + 1] = -65;
          arr[i3] = (Math.random() - 0.5) * 160;
          arr[i3 + 2] = (Math.random() - 0.5) * 100 - 10;
        }
      }
      posAttr.needsUpdate = true;
      emberCloud.rotation.y = elapsedTime * 0.04;

      // Random Procedural 3D Lightning Strikes
      if (timestamp > lastLightningStrike) {
        const start = new THREE.Vector3((Math.random() - 0.5) * 90, 55 + Math.random() * 15, (Math.random() - 0.5) * 40);
        const end = new THREE.Vector3(start.x + (Math.random() - 0.5) * 60, -35 - Math.random() * 20, start.z + (Math.random() - 0.5) * 30);
        trigger3DLightning(start, end);

        if (Math.random() < 0.45) {
          createShockwave(end);
        }

        lastLightningStrike = timestamp + Math.random() * 800 + 400;
      }

      // Animate active 3D lightning bolts
      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const b = activeBolts[i];
        b.life -= b.decay;
        b.glowMat.opacity = b.life * 0.9;
        b.coreMat.opacity = b.life;

        if (b.life <= 0) {
          scene.remove(b.glow);
          scene.remove(b.core);
          b.geo.dispose();
          b.glowMat.dispose();
          b.coreMat.dispose();
          activeBolts.splice(i, 1);
        }
      }

      // Animate 3D Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const s = shockwaves[i];
        s.scale += s.speed;
        s.mesh.scale.set(s.scale, s.scale, s.scale);
        s.life -= s.decay;
        s.mat.opacity = s.life * 0.7;

        if (s.life <= 0) {
          scene.remove(s.mesh);
          s.mat.dispose();
          shockwaves.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animateThree);
  }

  // ─── 16. MOTION ONE & LENIS SMOOTH INERTIA SCROLL ───
  // ─── 16. MOTION & LENIS SMOOTH INERTIA SCROLL ENGINE ───
  let lenis = null;
  let isAutoScrolling = false;

  function scrollToTarget(target, offset = -20) {
    isAutoScrolling = true;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: offset,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => { isAutoScrolling = false; }, 300);
        }
      });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setTimeout(() => { isAutoScrolling = false; }, 800);
    }
  }

  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── SECTION SNAP: One scroll from Hero → auto-jump to About ──
    const aboutEl = document.querySelector('#about');
    const heroEl = document.querySelector('#home');
    const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;

    // 1. WHEEL EVENT: Catch the very first scroll-down while in the hero zone
    window.addEventListener('wheel', (e) => {
      if (isAutoScrolling) return;
      const scrollY = window.scrollY;

      // Scrolling DOWN while still inside the hero section → snap to About
      if (e.deltaY > 0 && scrollY < heroHeight * 0.45) {
        scrollToTarget(aboutEl || '#about', -24);
      }

      // Scrolling UP while near the top of About → snap back to Hero
      if (e.deltaY < 0 && scrollY > 10 && scrollY < heroHeight * 1.15) {
        scrollToTarget(heroEl || '#home', 0);
      }
    }, { passive: true });

    // 2. TOUCH: Snap on touch-swipe for mobile
    let lastScrollY = window.scrollY;
    let snapRafPending = false;
    window.addEventListener('scroll', () => {
      if (snapRafPending || isAutoScrolling) return;
      snapRafPending = true;
      requestAnimationFrame(() => {
        snapRafPending = false;
        const currentScrollY = window.scrollY;
        const goingDown = currentScrollY > lastScrollY;

        if (goingDown && currentScrollY > 10 && currentScrollY < heroHeight * 0.45 && !isAutoScrolling) {
          scrollToTarget(aboutEl || '#about', -24);
        }

        if (!goingDown && currentScrollY > 10 && currentScrollY < heroHeight * 1.15 && !isAutoScrolling) {
          scrollToTarget(heroEl || '#home', 0);
        }

        lastScrollY = currentScrollY;
      });
    }, { passive: true });
  }

  // ─── SMOOTH SCROLL FOR FLOATING NAV DOCK & ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && !targetId.includes('Modal')) {
        e.preventDefault();

        // Immediate active state feedback on floating dock buttons
        if (this.classList.contains('dock-icon-link')) {
          document.querySelectorAll('.dock-icon-link').forEach((l) => l.classList.remove('active'));
          this.classList.add('active');
        }

        // Close mobile nav menu if open
        const floatingDock = document.getElementById('floatingNavDock');
        if (floatingDock && floatingDock.classList.contains('mobile-open')) {
          floatingDock.classList.remove('mobile-open');
        }

        if (targetId === '#skills') {
          const aboutEl = document.querySelector('#about');
          if (aboutEl) {
            if (typeof switchBentoTab === 'function') switchBentoTab('skills');
            scrollToTarget(aboutEl, -24);
          }
          return;
        }

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          scrollToTarget(targetEl, targetId === '#home' ? 0 : -24);
        }
      }
    });
  });



  // ─── 17. BENTO CONSOLE TAB SWITCHER (WHO I AM <-> SKILLS) ───
  const tabBtnWho = document.getElementById('tabBtnWho');
  const tabBtnSkills = document.getElementById('tabBtnSkills');
  const btnSwitchToSkills = document.getElementById('btnSwitchToSkills');
  const btnSwitchToWho = document.getElementById('btnSwitchToWho');
  const panelWho = document.getElementById('panelWho');
  const panelSkills = document.getElementById('panelSkills');
  const modeLabel = document.getElementById('consoleModeLabel');

  function switchBentoTab(mode) {
    if (mode === 'skills') {
      if (tabBtnWho) tabBtnWho.classList.remove('active');
      if (tabBtnSkills) tabBtnSkills.classList.add('active');
      if (panelWho) panelWho.classList.remove('active');
      if (panelSkills) panelSkills.classList.add('active');
      if (modeLabel) modeLabel.textContent = 'SKILLS ACTIVE';

      // Re-trigger animated skill bar widths
      document.querySelectorAll('#panelSkills .skill-bar-fill').forEach((bar) => {
        const prog = bar.getAttribute('data-progress') || '80';
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = prog + '%';
        }, 60);
      });
    } else {
      if (tabBtnSkills) tabBtnSkills.classList.remove('active');
      if (tabBtnWho) tabBtnWho.classList.add('active');
      if (panelSkills) panelSkills.classList.remove('active');
      if (panelWho) panelWho.classList.add('active');
      if (modeLabel) modeLabel.textContent = 'BIO ACTIVE';
    }
  }

  if (tabBtnWho) tabBtnWho.addEventListener('click', () => switchBentoTab('who'));
  if (tabBtnSkills) tabBtnSkills.addEventListener('click', () => switchBentoTab('skills'));
  if (btnSwitchToSkills) btnSwitchToSkills.addEventListener('click', () => switchBentoTab('skills'));
  if (btnSwitchToWho) btnSwitchToWho.addEventListener('click', () => switchBentoTab('who'));

})();
