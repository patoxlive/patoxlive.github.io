/**
 * SUPORTE — o pato de fone "atende" numa janela de chamada,
 * e o título da seção é a fala dele (balão).
 */
import { html } from '../../lib/html.mjs';
import { responsiveImage } from '../ui/image.mjs';
import { button } from '../ui/button.mjs';
import { icon } from '../ui/icons.mjs';
import { site, cap } from '../../config/site.config.mjs';

export function supportSection(c) {
  const contact = site.contact;
  const channels = [
    { icon: 'chat', label: c.channels.whatsapp, value: contact.whatsappLabel },
    { icon: 'mail', label: c.channels.email, value: html`<a href="mailto:${contact.email}">${contact.email}</a>` },
    { icon: 'clock', label: c.channels.hours, value: cap(contact.hours) },
  ];

  return html`
  <section class="section support" id="suporte" aria-labelledby="support-title" tabindex="-1">
    <div class="container support__inner">
      <div class="support-call" data-reveal>
        <div class="support-call__bar">
          <span class="support-call__who">${icon('headset', { size: 18 })}${c.windowTitle}</span>
          <span class="support-call__status"><span class="support-call__dot" aria-hidden="true"></span>${c.windowStatus}</span>
        </div>
        <div class="support-call__video">
          ${responsiveImage('support', {
            alt: c.imageAlt,
            className: 'support-call__image',
            sizes: '(min-width: 1024px) 480px, 90vw',
          })}
        </div>
        <div class="support-call__controls" aria-hidden="true">
          <span>${icon('mic', { size: 20 })}</span>
          <span>${icon('camera', { size: 20 })}</span>
          <span>${icon('chat', { size: 20 })}</span>
        </div>
      </div>

      <div class="support__copy">
        <h2 class="support__bubble" id="support-title">${c.title}</h2>
        <p class="support__text">${c.text}</p>
        <ul class="support__channels" role="list">
          ${channels.map(
            (ch) => html`<li class="support__channel">
              <span class="support__channel-icon">${icon(ch.icon, { size: 20 })}</span>
              <span class="support__channel-label">${ch.label}</span>
              <span class="support__channel-value">${ch.value}</span>
            </li>`,
          )}
        </ul>
        ${button({ label: c.cta.label, whatsapp: c.cta.whatsapp, withIcon: true, variant: 'primary', size: 'lg' })}
      </div>
    </div>
  </section>`;
}
