/* Topo: estado ao rolar, menu do celular, link ativo e âncoras internas. */
import { qs, qsa, focusElement, scrollToElement } from './utils.js';
import { openDisclosureFor } from './disclosure.js';

export function initNav() {
  const header = qs('[data-header]');
  const toggle = qs('[data-menu-toggle]');
  const menu = qs('[data-mobile-menu]');
  const label = qs('[data-menu-label]');

  // sombra/borda do topo depois de rolar
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // menu do celular
  function setMenu(open, { returnFocus = false } = {}) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      const first = menu.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, { returnFocus: true });
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  // âncoras internas: rolagem suave, abre painéis fechados e move o foco
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(link.getAttribute('href'), location.href);
    if (!url.hash || url.pathname !== location.pathname) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    openDisclosureFor(target);
    // espera o menu fechar / o painel abrir antes de rolar
    requestAnimationFrame(() => {
      scrollToElement(target);
      focusElement(target);
      try { history.pushState(null, '', url.hash); } catch (err) { /* ambiente sem histórico */ }
    });
  });

  // item do menu correspondente à seção visível
  const links = qsa('[data-nav-link]');
  const sections = qsa('main > section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => {
            const active = a.getAttribute('href').endsWith(`#${entry.target.id}`);
            if (active) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }
}
