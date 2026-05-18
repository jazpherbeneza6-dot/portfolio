/* ============================================
   JAZZ DEV PORTFOLIO — INTERACTIVE SCRIPTS
   ============================================ */

(function () {
  'use strict';

  // ─── LOADING SCREEN HANDLER (THREE.JS + LOTTIE) ───
  window.addEventListener('load', () => {
    const loader = document.getElementById('loadingScreen');
    const lottieContainer = document.getElementById('lottieLoader');
    const threeCanvas = document.getElementById('loaderThreeCanvas');

    // 1. TECH SCANNER REMOVED (per user request)
    const scannerContainer = document.getElementById('lottieLoader');
    if (scannerContainer) {
      scannerContainer.style.display = 'none';
    }

    // 3. DOCTOR STRANGE PORTAL FIRE (Circular)
    const fireContainer = document.getElementById('fireRingCanvas');
    let fireParticles;
    let fadeTriggered = false;

    if (fireContainer) {
      const fireScene = new THREE.Scene();
      const fireCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      const fireRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      fireRenderer.setSize(400, 400);
      fireContainer.appendChild(fireRenderer.domElement);

      const particleCount = 1800; // Even denser for portal look
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const initialAngles = new Float32Array(particleCount);
      const radii = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 62 + (Math.random() - 0.5) * 15;
        initialAngles[i] = angle;
        radii[i] = radius;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        const r = 1;
        const g = 0.2 + Math.random() * 0.4;
        const b = 0.05;
        colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.95
      });

      fireParticles = new THREE.Points(geometry, particleMat);
      fireScene.add(fireParticles);
      fireCamera.position.z = 200;

      let time = 0;
      const animateFire = () => {
        if (!fadeTriggered || loader.style.display !== 'none') {
          requestAnimationFrame(animateFire);
          time += 0.025;
          const pos = geometry.attributes.position.array;
          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const currentAngle = initialAngles[i] + time;
            const r = radii[i] + Math.sin(time * 3 + i) * 1.5;
            pos[idx] = Math.cos(currentAngle) * r;
            pos[idx + 1] = Math.sin(currentAngle) * r;
          }
          geometry.attributes.position.needsUpdate = true;
          fireParticles.rotation.z += 0.005;
          fireRenderer.render(fireScene, fireCamera);
        }
      };
      animateFire();

      // Netflix-style Portal Reveal Logic
      window.addEventListener('revealHeroStart', () => {
        fadeTriggered = true;

        // 1. Extreme zoom-through of the fire ring
        gsap.to(fireParticles.scale, {
          x: 60, y: 60, z: 2,
          duration: 0.8, // Faster for immediate cover
          ease: "power2.in",
          onComplete: () => {
            revealHero(); // ONLY reveal home page AFTER ring is huge
          }
        });
        gsap.to(fireParticles.position, {
          z: 900,
          duration: 0.8,
          ease: "power2.in"
        });

        // 2. Logo Zoom & Fade
        const logoWrapper = document.querySelector('.logo-wrapper');
        if (logoWrapper) {
          gsap.to(logoWrapper, {
            scale: 15,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in"
          });
        }

        // 3. Overall Fade
        gsap.to(particleMat, { opacity: 0, duration: 0.4, delay: 0.4 });
        gsap.to(fireContainer, { opacity: 0, duration: 0.8 });
      });
    }

    function triggerReveal() {
      window.dispatchEvent(new Event('revealHeroStart'));
      // revealHero() call removed from here
    }

    // 2. TIMED TRANSITION (3 Seconds)
    setTimeout(() => {
      if (loader) loader.classList.add('loader-loaded');
      if (scannerContainer) gsap.to(scannerContainer, { opacity: 0, duration: 0.5 });
      triggerReveal();
      setTimeout(() => {
        if (loader) loader.style.display = 'none';
      }, 1500);
    }, 3000);

    window.addEventListener('resize', () => {
      // Background resize logic removed
    });
  });

  // ─── 3D SMOKE BACKGROUND (Three.js) ───
  (function initSmoke() {
    const container = document.getElementById('smoke-container');
    if (!container) return;

    let camera, scene, renderer, clock, delta;
    let smokeParticles = [];
    const loader = new THREE.TextureLoader();

    function init() {
      clock = new THREE.Clock();
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      scene.add(camera);

      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(-1, 0, 1);
      scene.add(light);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      // --- EMBER PARTICLES ---
      const emberCount = 100;
      const emberGeo = new THREE.BufferGeometry();
      const emberPos = new Float32Array(emberCount * 3);
      for (let i = 0; i < emberCount * 3; i++) {
        emberPos[i] = (Math.random() - 0.5) * 2000;
      }
      emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
      const emberMaterial = new THREE.PointsMaterial({
        color: 0xff4d4d,
        size: 3,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      const embers = new THREE.Points(emberGeo, emberMaterial);
      scene.add(embers);

      loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png', (texture) => {
        const smokeGeo = new THREE.PlaneGeometry(300, 300);
        const smokeMaterial = new THREE.MeshLambertMaterial({
          color: 0xff0000,
          map: texture,
          transparent: true,
          opacity: 0.25,
          blending: THREE.NormalBlending
        });
        for (let p = 0; p < 25; p++) {
          const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
          particle.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 100);
          particle.rotation.z = Math.random() * 360;
          scene.add(particle);
          smokeParticles.push(particle);
        }
      });
      window.addEventListener('resize', onWindowResize, false);
      animate();
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate() {
      delta = clock.getDelta();
      requestAnimationFrame(animate);
      evolveSmoke();
      render();
    }
    function evolveSmoke() {
      let sp = smokeParticles.length;
      while (sp--) { smokeParticles[sp].rotation.z += (delta * 0.15); }
    }
    function render() { renderer.render(scene, camera); }
    init();
  })();

  // ─── REVEAL HERO LOGIC ───
  const heroTitleGroup = document.querySelector('.hero-title-group');

  function revealHero() {
    if (heroTitleGroup) {
      const header = document.querySelector('.site-header');
      if (header) header.classList.add('header-reveal');

      heroTitleGroup.classList.add('title-fade-in');

      // --- IMMEDIATE BLACK HOLE PORTRAIT EMERGENCE ---
      const portraitWrapper = document.querySelector('.hero-portrait-wrapper');
      if (portraitWrapper) {
        gsap.fromTo(portraitWrapper,
          { scale: 0, rotation: 720, filter: 'blur(30px)', opacity: 0, y: 50 },
          { scale: 1, rotation: 0, filter: 'blur(0px)', opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
        );
      }

      const jazzText = document.querySelector('.hero-text-left');
      const devText = document.querySelector('.hero-text-right');

      setTimeout(() => burstSparks(jazzText, 25), 50);
      setTimeout(() => burstSparks(devText, 25), 100);

      setTimeout(() => {
        heroTitleGroup.classList.remove('title-fade-in');
        heroTitleGroup.classList.add('glitch-active');
      }, 1000);
    }
  }

  // ─── SPARK SYSTEM ───
  const sparkCanvas = document.createElement('canvas');
  sparkCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(sparkCanvas);
  const sparkCtx = sparkCanvas.getContext('2d');
  let sparkParticles = [];
  let sparkAnimating = false;
  function resizeSparkCanvas() { sparkCanvas.width = window.innerWidth; sparkCanvas.height = window.innerHeight; }
  resizeSparkCanvas();
  window.addEventListener('resize', resizeSparkCanvas);

  class Spark {
    constructor(x, y) {
      this.x = x; this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (2 + Math.random() * 4);
      this.gravity = 0.15; this.friction = 0.98; this.life = 1.0;
      this.decay = 0.01 + Math.random() * 0.02; this.size = 1 + Math.random() * 2;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      this.vy += this.gravity; this.vx *= this.friction; this.vy *= this.friction;
      this.x += this.vx; this.y += this.vy; this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,100,20,${this.life})`; ctx.fill();
    }
  }

  function burstSparks(targetEl, count) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      sparkParticles.push(new Spark(rect.left + Math.random() * rect.width, rect.top + Math.random() * rect.height));
    }
    if (!sparkAnimating) { sparkAnimating = true; animateSparks(); }
  }

  function animateSparks() {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    sparkParticles.forEach(p => p.update());
    sparkParticles.forEach(p => p.draw(sparkCtx));
    sparkParticles = sparkParticles.filter(p => p.life > 0);
    if (sparkParticles.length > 0) requestAnimationFrame(animateSparks);
    else sparkAnimating = false;
  }

  // ─── TILT EFFECT ───
  const heroImageWrapper = document.querySelector('.hero-portrait-wrapper');
  const hudRings = document.querySelectorAll('.hud-ring, .hud-orbit, .hud-crosshair, .hud-corner, .hud-data');
  if (heroImageWrapper) {
    heroImageWrapper.addEventListener('mousemove', e => {
      const rect = heroImageWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImageWrapper.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      hudRings.forEach((ring, i) => {
        const depth = (i % 3 + 1) * 15;
        ring.style.transform = ring.classList.contains('hud-ring') ? `translate(calc(-50% + ${x * depth}px), calc(-50% + ${y * depth}px))` : `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
    heroImageWrapper.addEventListener('mouseenter', () => heroImageWrapper.classList.add('hud-active'));
    heroImageWrapper.addEventListener('mouseleave', () => {
      heroImageWrapper.style.transform = '';
      hudRings.forEach(ring => ring.style.transform = '');
      heroImageWrapper.classList.remove('hud-active');
    });
  }

  // ─── SKILLS MOUSE EFFECT ───
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ─── HEADER SCROLL EFFECT ───
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;
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
      { threshold: 0.15 }
    );
    revealElements.forEach(el => observer.observe(el));
  }

  // ─── SKILL BARS ───
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

  // ─── PROJECT DETAIL MODAL ───
  const modal = document.getElementById('projectModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalLink = document.getElementById('modalLink');
  const modalClose = document.getElementById('modalClose');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const sliderDots = document.getElementById('sliderDots');

  let currentImages = [];
  let currentImgIndex = 0;

  function updateSlider() {
    if (currentImages.length > 0) {
      modalImage.src = currentImages[currentImgIndex];
      const dots = sliderDots.querySelectorAll('.dot');
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentImgIndex));
    }
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const description = card.getAttribute('data-description');
      const mainImage = card.getAttribute('data-image');
      const extraImages = card.getAttribute('data-images');
      const link = card.getAttribute('data-link');

      currentImages = [];
      if (mainImage) currentImages.push(mainImage);
      if (extraImages) currentImages.push(...extraImages.split(',').map(s => s.trim()));

      currentImgIndex = 0;
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalLink.href = link;

      sliderDots.innerHTML = '';
      currentImages.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { currentImgIndex = idx; updateSlider(); });
        sliderDots.appendChild(dot);
      });

      updateSlider();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
    updateSlider();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex + 1) % currentImages.length;
    updateSlider();
  });

  // ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.id === 'modalLink') return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
