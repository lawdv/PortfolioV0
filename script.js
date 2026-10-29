(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const menuButton = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const progress = document.getElementById('scroll-progress');
  const year = document.getElementById('year');

  // Theme: save preference when localStorage is available.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('lawdv-theme'); } catch (_) {}
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.dataset.theme = savedTheme || (prefersLight ? 'light' : 'dark');
  const syncThemeButton = () => {
    const light = root.dataset.theme === 'light';
    if (themeIcon) themeIcon.textContent = light ? '☾' : '☼';
    if (themeButton) themeButton.setAttribute('aria-label', light ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
  };
  syncThemeButton();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('lawdv-theme', root.dataset.theme); } catch (_) {}
    syncThemeButton();
  });

  // Mobile navigation.
  const closeMenu = () => {
    navLinks?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
  };
  menuButton?.addEventListener('click', () => {
    const open = !navLinks.classList.contains('is-open');
    navLinks.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  // Reading progress bar.
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Subtle reveal on scroll; content stays visible if observer is not supported.
  const revealItems = document.querySelectorAll('[data-reveal]');
  revealItems.forEach(item => {
    if (item.dataset.revealDelay) item.style.setProperty('--reveal-delay', `${item.dataset.revealDelay}ms`);
  });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  if (year) year.textContent = new Date().getFullYear();
})();
