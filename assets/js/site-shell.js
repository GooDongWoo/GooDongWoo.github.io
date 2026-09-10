(() => {
  const toggle = document.getElementById('siteNavToggle');
  const nav = document.getElementById('siteNav');

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('[data-nav-path]').forEach((link) => {
    const target = new URL(link.href, window.location.origin);
    const path = target.pathname.replace(/\/+$/, '') || '/';
    const hashMatches = target.hash ? target.hash === window.location.hash : !window.location.hash;
    if (path === currentPath && hashMatches) link.setAttribute('aria-current', 'page');
  });
})();
