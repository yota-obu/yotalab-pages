(() => {
  const script = document.currentScript;
  if (!script) return;

  const root = new URL('../', script.src);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('assets/global-header.css', root).href;
  document.head.append(stylesheet);

  const path = window.location.pathname;
  const active = path.includes('/apps/') || path.endsWith('/apps/')
    ? 'apps'
    : path.includes('/articles/') || path.endsWith('/articles/')
      ? 'articles'
      : '';

  const links = [
    ['apps', 'Apps', new URL('apps/', root).href],
    ['articles', 'Articles', new URL('articles/', root).href],
    ['profile', 'Profile', new URL('#about', root).href],
    ['contact', 'Contact', 'mailto:yotalab.tech@gmail.com']
  ];

  document.querySelectorAll('[data-site-header]').forEach(mount => {
    const header = document.createElement('header');
    header.className = 'global-header';

    const inner = document.createElement('div');
    inner.className = 'global-header-inner';

    const brand = document.createElement('a');
    brand.className = 'global-brand';
    brand.href = root.href;
    brand.textContent = 'yotalab';

    const nav = document.createElement('div');
    nav.className = 'global-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    links.forEach(([key, label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if (key === active) link.setAttribute('aria-current', 'page');
      nav.append(link);
    });

    inner.append(brand, nav);
    header.append(inner);
    mount.replaceWith(header);
  });
})();
