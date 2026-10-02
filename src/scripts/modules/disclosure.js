/* Abre/fecha: escolha de caminho no CTA final ("Quero fazer parte"). */
import { qsa, prefersReducedMotion } from './utils.js';

function setDisclosure(button, panel, open, { instant = false } = {}) {
  if (!button || !panel) return;
  if (instant || prefersReducedMotion()) {
    panel.classList.add('no-transition');
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('no-transition')));
  }
  button.setAttribute('aria-expanded', String(open));
  panel.classList.remove('is-open');
  if (open) {
    panel.removeAttribute('data-collapsed');
    panel.inert = false;
    const done = () => panel.classList.add('is-open');
    if (instant || prefersReducedMotion()) done();
    else setTimeout(done, 520);
  } else {
    panel.setAttribute('data-collapsed', '');
    panel.inert = true;
  }
}

/** Abre o painel que contém `target` (usado quando um link aponta para dentro dele). */
export function openDisclosureFor(target) {
  const panel = target && target.closest('[data-disclosure-panel]');
  if (!panel) return false;
  const button = document.querySelector(`[aria-controls="${panel.id}"][data-disclosure]`);
  if (button && button.getAttribute('aria-expanded') !== 'true') {
    setDisclosure(button, panel, true, { instant: true });
  }
  return true;
}

export function initDisclosures() {
  const hashTarget = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  qsa('[data-disclosure]').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    const startOpen = hashTarget && (hashTarget === panel || panel.contains(hashTarget));
    setDisclosure(button, panel, Boolean(startOpen), { instant: true });

    button.addEventListener('click', () => {
      setDisclosure(button, panel, button.getAttribute('aria-expanded') !== 'true');
    });
  });
}
