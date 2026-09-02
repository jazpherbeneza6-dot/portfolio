/**
 * ============================================================================
 * MODULE: THREE.JS 3D ANIME THUNDER & LIGHTNING ENGINE
 * Renders 3D procedural thunder, volumetric ember particles, and hologram tilts.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initThreeHero() {
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

  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initThreeHero = initThreeHero;
})(window);
