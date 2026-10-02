/* Barra com "Quero me agenciar" fixa no rodapé do celular.
   Aparece depois do hero e some quando o próprio formulário, o ovo, a escolha de caminhos,
   o recrutamento (para não misturar as jornadas) ou o rodapé estão na tela. */
import { qs } from './utils.js';

export function initMobileCta() {
  const bar = qs('[data-mobile-cta]');
  if (!bar || !('IntersectionObserver' in window)) return;
  bar.hidden = false;
  const watch = ['#inicio', '#caminhos', '#descubra', '#agenciamento', '#recrutamento', '.site-footer']
    .map((sel) => qs(sel))
    .filter(Boolean);
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    bar.classList.toggle('is-visible', visible.size === 0);
  }, { threshold: 0.05 });
  watch.forEach((el) => io.observe(el));
}
