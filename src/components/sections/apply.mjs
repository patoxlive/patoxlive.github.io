/**
 * AGENCIAMENTO — contato direto pelo WhatsApp.
 * Destino de todos os botões "Quero me agenciar" (rolagem até aqui).
 * À direita (no celular, logo abaixo do título), uma prévia da conversa mostra
 * a mensagem que já vai pronta e o botão que abre o WhatsApp.
 */
import { html, attrs } from '../../lib/html.mjs';
import { site } from '../../config/site.config.mjs';
import { button } from '../ui/button.mjs';
import { icon } from '../ui/icons.mjs';
import { IMG_DIR } from '../ui/image.mjs';

export function applySection(c) {
  const avatar = site.images.avatar;
  const message = site.whatsappMessages[c.cta.whatsapp] || '';
  return html`
  <section class="section apply" id="agenciamento" aria-labelledby="apply-title" tabindex="-1">
    <div class="container apply__inner">
      <div class="apply__intro">
        <h2 class="section-title" id="apply-title">${c.title}</h2>
        <p class="section-lead">${c.text}</p>
      </div>

      <div class="chat-card" data-reveal>
        <div class="chat-card__head">
          <img${attrs({
            class: 'chat-card__avatar',
            src: `${IMG_DIR}${avatar.src}`,
            srcset: `${IMG_DIR}${avatar.src} 1x, ${IMG_DIR}${avatar.src2x} 2x`,
            width: 48,
            height: 48,
            alt: '',
            loading: 'lazy',
            decoding: 'async',
          })}>
          <div class="chat-card__who">
            <p class="chat-card__name">${site.name}</p>
            <p class="chat-card__status">${c.chat.status}</p>
          </div>
        </div>
        <div class="chat-card__body">
          <p class="chat-card__label">${c.chat.label}</p>
          <p class="chat-card__bubble">${message.trim()}<span class="chat-card__caret" aria-hidden="true"></span></p>
        </div>
        <div class="chat-card__foot">
          ${button({ label: c.cta.label, whatsapp: c.cta.whatsapp, withIcon: true, variant: 'primary', size: 'lg', block: true })}
          <p class="chat-card__note">${c.chat.note}</p>
          <p class="chat-card__number">${site.contact.whatsappLabel}</p>
        </div>
      </div>

      <div class="apply__details">
        <dl class="contact-facts">
          ${c.facts.map(
            (f) => html`<div class="contact-fact">
              <span class="contact-fact__icon" aria-hidden="true">${icon(f.icon, { size: 20 })}</span>
              <dt class="contact-fact__label">${f.label}</dt>
              <dd class="contact-fact__value">${f.value}</dd>
            </div>`,
          )}
        </dl>
        <p class="apply__help">${c.helpText} <a href="${c.helpLink.href}">${c.helpLink.label}</a></p>
      </div>
    </div>
  </section>`;
}
