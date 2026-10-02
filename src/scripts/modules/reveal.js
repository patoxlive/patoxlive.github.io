/* Entrada suave dos blocos marcados com [data-reveal].
   Em repouso tudo fica visível; a animação só é disparada um pouco antes
   do bloco entrar na tela (e nunca para o que já aparece ao abrir a página). */
import { qsa, prefersReducedMotion } from './utils.js';

export function initReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        // só anima se o bloco ainda está abaixo da tela (chegando pela rolagem)
        if (entry.boundingClientRect.top > window.innerHeight * 0.92) entry.target.classList.add('is-revealing');
      });
    },
    { rootMargin: '0px 0px 12% 0px' },
  );
  const fold = window.innerHeight * 1.05;
  items.forEach((el) => {
    if (el.getBoundingClientRect().top > fold) io.observe(el);
  });
}
