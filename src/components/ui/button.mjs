/**
 * Botões e links com aparência de botão.
 *   button({ label, href })                      → <a> (quando há href)
 *   button({ label, whatsapp: 'agenciamento' })  → <a> que abre o WhatsApp com a mensagem pronta
 *   button({ label, type: 'submit' })            → <button>
 * Variantes: primary | cream | outline
 * Tamanhos: sm | md (padrão) | lg — e block: true para ocupar a largura toda.
 */
import { html, attrs, cls } from '../../lib/html.mjs';
import { whatsappLink } from '../../config/site.config.mjs';
import { icon } from './icons.mjs';

/** Atributos de um link que abre o WhatsApp (nova aba + marcação para métricas). */
export function whatsappAttrs(topic) {
  return {
    href: whatsappLink(topic) || '#suporte',
    target: '_blank',
    rel: 'noopener',
    'data-whatsapp': topic,
  };
}

/** Aviso para leitores de tela de que o link sai do site. */
export const opensWhatsapp = html`<span class="visually-hidden"> (abre o WhatsApp)</span>`;

export function button({ label, href, whatsapp, withIcon = false, variant = 'primary', size = 'md', block = false, type = 'button', className, extra = {} }) {
  const classes = cls('btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', className);
  const inner = html`${withIcon ? icon('chat', { size: 20 }) : ''}<span class="btn__label">${label}</span>${whatsapp ? opensWhatsapp : ''}`;
  if (whatsapp) {
    return html`<a${attrs({ class: classes, ...whatsappAttrs(whatsapp), ...extra })}>${inner}</a>`;
  }
  if (href) {
    return html`<a${attrs({ class: classes, href, ...extra })}>${inner}</a>`;
  }
  return html`<button${attrs({ class: classes, type, ...extra })}>${inner}</button>`;
}

/** Monta hrefs de âncora que funcionam também fora da página inicial. */
export function anchor(href, base = '') {
  if (!base || !href || !href.startsWith('#')) return href;
  return `${base}${href}`;
}
