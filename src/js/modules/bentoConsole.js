/**
 * ============================================================================
 * MODULE: BENTO CONSOLE, SKILLS PAGER & SKEUOMORPHIC CONTROLS
 * Handles Who I Am <-> Skills tab switching, animated progress bars,
 * skeuomorphic rotary knob, and toggle switch.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initBentoConsole() {
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


  // ─── 17. BENTO CONSOLE TAB SWITCHER (WHO I AM <-> SKILLS) ───
  const tabBtnWho = document.getElementById('tabBtnWho');
  const tabBtnSkills = document.getElementById('tabBtnSkills');
  const btnSwitchToSkills = document.getElementById('btnSwitchToSkills');
  const btnSwitchToWho = document.getElementById('btnSwitchToWho');
  const panelWho = document.getElementById('panelWho');
  const panelSkills = document.getElementById('panelSkills');
  const modeLabel = document.getElementById('consoleModeLabel');

  // Skills Skeuomorphic Paging Elements
  const skillsPages = document.querySelectorAll('.skills-hud-page');
  const skillsPrevBtn = document.getElementById('skillsPrevBtn');
  const skillsNextBtn = document.getElementById('skillsNextBtn');
  const skillsPageCounter = document.getElementById('skillsPageCounter');
  const skillsCategoryBadge = document.getElementById('skillsCategoryBadge');
  const skillsHeadlineTitle = document.getElementById('skillsHeadlineTitle');
  const skillsPips = document.querySelectorAll('.skeuo-led-pip');
  let currentSkillsPage = 1;
  const totalSkillsPages = skillsPages.length || 2;

  function animateActiveSkillBars() {
    const activePage = document.querySelector('.skills-hud-page.active');
    if (!activePage) return;
    const bars = activePage.querySelectorAll('.skill-bar-fill');
    bars.forEach((bar) => {
      const prog = bar.getAttribute('data-progress') || '80';
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = prog + '%';
      }, 50);
    });
  }

  function setSkillsPage(page) {
    if (page < 1) page = totalSkillsPages;
    if (page > totalSkillsPages) page = 1;
    currentSkillsPage = page;

    skillsPages.forEach((pg) => {
      if (parseInt(pg.getAttribute('data-page'), 10) === currentSkillsPage) {
        pg.classList.add('active');
      } else {
        pg.classList.remove('active');
      }
    });

    if (skillsPageCounter) {
      skillsPageCounter.textContent = `0${currentSkillsPage} / 0${totalSkillsPages}`;
    }

    if (skillsPips) {
      skillsPips.forEach((pip) => {
        if (parseInt(pip.getAttribute('data-page'), 10) === currentSkillsPage) {
          pip.classList.add('active');
        } else {
          pip.classList.remove('active');
        }
      });
    }

    if (currentSkillsPage === 1) {
      if (skillsCategoryBadge) skillsCategoryBadge.textContent = '01 / 02 • PROGRAMMING';
      if (skillsHeadlineTitle) skillsHeadlineTitle.textContent = 'PROGRAMMING & DEV';
    } else {
      if (skillsCategoryBadge) skillsCategoryBadge.textContent = '02 / 02 • HARDWARE & IT';
      if (skillsHeadlineTitle) skillsHeadlineTitle.textContent = 'HARDWARE, IT & NETWORK';
    }

    animateActiveSkillBars();
  }

  if (skillsPrevBtn) {
    skillsPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setSkillsPage(currentSkillsPage - 1);
    });
  }

  if (skillsNextBtn) {
    skillsNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setSkillsPage(currentSkillsPage + 1);
    });
  }

  function switchBentoTab(mode) {
    const dockSkillsLink = document.querySelector('.floating-nav-dock a[href="#skills"]');
    const dockAboutLink = document.querySelector('.floating-nav-dock a[href="#about"]');

    if (mode === 'skills') {
      if (tabBtnWho) tabBtnWho.classList.remove('active');
      if (tabBtnSkills) tabBtnSkills.classList.add('active');
      if (panelWho) panelWho.classList.remove('active');
      if (panelSkills) panelSkills.classList.add('active');
      if (modeLabel) modeLabel.textContent = 'SKILLS ACTIVE';

      if (dockSkillsLink) {
        if (dockAboutLink) dockAboutLink.classList.remove('active');
        dockSkillsLink.classList.add('active');
      }

      // Re-trigger animated skill bar widths for active page
      animateActiveSkillBars();
    } else {
      if (tabBtnSkills) tabBtnSkills.classList.remove('active');
      if (tabBtnWho) tabBtnWho.classList.add('active');
      if (panelSkills) panelSkills.classList.remove('active');
      if (panelWho) panelWho.classList.add('active');
      if (modeLabel) modeLabel.textContent = 'BIO ACTIVE';

      if (dockAboutLink) {
        if (dockSkillsLink) dockSkillsLink.classList.remove('active');
        dockAboutLink.classList.add('active');
      }
    }
  }

  if (tabBtnWho) tabBtnWho.addEventListener('click', () => switchBentoTab('who'));
  if (tabBtnSkills) tabBtnSkills.addEventListener('click', () => switchBentoTab('skills'));
  if (btnSwitchToSkills) btnSwitchToSkills.addEventListener('click', () => switchBentoTab('skills'));
  if (btnSwitchToWho) btnSwitchToWho.addEventListener('click', () => switchBentoTab('who'));

  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initBentoConsole = initBentoConsole;
})(window);
