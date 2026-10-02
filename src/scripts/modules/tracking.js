/* Métricas de conversão:
   - clique num botão do WhatsApp → evento `patox:whatsapp`
   - clique num "Quero me agenciar" (rola até a seção de agenciamento) → evento `patox:cta_agenciar`
   Os mesmos eventos vão para o dataLayer como `patox_*`, se o Google Tag Manager estiver instalado. */
import { track } from './utils.js';

function context(link) {
  const section = link.closest('section[id], header, footer, [data-mobile-cta]');
  return {
    botao: (link.querySelector('.btn__label, .choice-card__action') || link).textContent.trim(),
    secao: section ? section.id || section.tagName.toLowerCase() : '',
  };
}

export function initTracking() {
  document.addEventListener('click', (e) => {
    const wa = e.target.closest('a[data-whatsapp]');
    if (wa) {
      track('whatsapp', { assunto: wa.dataset.whatsapp, ...context(wa) });
      return;
    }
    const cta = e.target.closest('a.btn[href$="#agenciamento"], a.choice-card[href$="#agenciamento"], a.who-group__link[href$="#agenciamento"]');
    if (cta) track('cta_agenciar', context(cta));
  });
}
