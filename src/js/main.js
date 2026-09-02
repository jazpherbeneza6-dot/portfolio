/**
 * ============================================================================
 * JAZPHER BENEZA PORTFOLIO — MAIN ENTRYPOINT
 * Senior Modular Architecture Application Bootstrap
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const P = window.Portfolio || {};

  // 1. Cinematic Spark Entrance & Audio (starts immediately)
  if (typeof P.initSparkEntrance === 'function') {
    P.initSparkEntrance();
  }

  // 2. Ambient Cosmic Canvas & Resource Suspension
  if (typeof P.initAmbientCanvas === 'function') {
    P.initAmbientCanvas();
  }

  // 3. Three.js 3D Anime Thunder & Lightning Hero Canvas
  if (typeof P.initThreeHero === 'function') {
    P.initThreeHero();
  }

  // 4. Bento Console Deck & Skills Progress Bars
  if (typeof P.initBentoConsole === 'function') {
    P.initBentoConsole();
  }

  // 5. 3D Spatial Projects Carousel
  if (typeof P.initProjectsCarousel === 'function') {
    P.initProjectsCarousel();
  }

  // 6. Interactive Modals & Contact Dispatch
  if (typeof P.initModals === 'function') {
    P.initModals();
  }

  // 7. Navigation, Floating Dock & Scroll Spy
  if (typeof P.initNavigation === 'function') {
    P.initNavigation();
  }
});
