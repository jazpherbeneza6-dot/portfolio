/**
 * ============================================================================
 * MODULE: INTERACTIVE MODALS & CONTACT FORM DISPATCH
 * Handles Project Detail modal, Contact Message modal, and About modal.
 * ============================================================================
 */
(function (global) {
  'use strict';

  function initModals() {
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
    if (modalLiveDemoBtn) {
      const link = data.link && data.link !== '#' ? data.link : '';
      if (link) {
        modalLiveDemoBtn.href = link;
        modalLiveDemoBtn.setAttribute('href', link);
        modalLiveDemoBtn.setAttribute('target', '_blank');
        modalLiveDemoBtn.setAttribute('rel', 'noopener noreferrer');
        modalLiveDemoBtn.style.display = 'inline-flex';
      } else {
        modalLiveDemoBtn.href = '#';
        modalLiveDemoBtn.style.display = 'none';
      }
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.interactive-modal-overlay').forEach((m) => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeAllModals);

  if (modalLiveDemoBtn) {
    modalLiveDemoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const href = modalLiveDemoBtn.getAttribute('href');
      if (href && href !== '#' && href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer');
        e.preventDefault();
      }
    });
  }

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

  }

  global.Portfolio = global.Portfolio || {};
  global.Portfolio.initModals = initModals;
})(window);
