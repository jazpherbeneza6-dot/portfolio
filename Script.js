function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const headerOffset = 10;
  const startPosition = window.scrollY;
  const targetPosition = target.offsetTop - headerOffset;
  const distance = targetPosition - startPosition;

  const duration = 800;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const t = Math.min(timeElapsed / duration, 1);

    const ease = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// SELECT BOTH NAV LINKS + GHOST BUTTONS
const scrollLinks = [
  ...document.querySelectorAll('.nav-links a'),
  ...document.querySelectorAll('.ghost-btn'),
  ...document.querySelectorAll('.hero-actions button'),
];

scrollLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href') || this.dataset.target;

    if (href && href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  });
});
