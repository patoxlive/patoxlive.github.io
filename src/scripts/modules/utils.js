/* Utilitários compartilhados pelos módulos. */

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Move o foco para um elemento sem rolar a página (acessibilidade após âncoras). */
export function focusElement(el) {
  if (!el) return;
  const focusable = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
  if (!focusable && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export function scrollToElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/** Eventos de conversão: escute `patox:*` no window ou use o dataLayer (Google Tag Manager). */
export function track(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`patox:${name}`, { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: `patox_${name}`, ...detail });
}
