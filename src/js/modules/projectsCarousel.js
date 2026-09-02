/**
 * ============================================================================
 * MODULE: 3D SPATIAL PROJECTS CAROUSEL
 * Handles spatial carousel 3D positioning, card parallax tilt, and view-all link.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initProjectsCarousel() {
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
      if (e.target.closest('.btn-spatial-demo')) {
        return; // Allow direct navigation to live demo
      }
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

  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initProjectsCarousel = initProjectsCarousel;
})(window);
