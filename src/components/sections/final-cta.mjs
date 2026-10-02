/** CTA FINAL — "Venha fazer parte da ninhada" com o pato no topo dos ovos.
 *  "Quero fazer parte" abre a escolha entre as duas jornadas:
 *  streamer → seção Agenciamento pelo WhatsApp · recrutador → WhatsApp. */
import { html, attrs } from '../../lib/html.mjs';
import { responsiveImage } from '../ui/image.mjs';
import { button, whatsappAttrs, opensWhatsapp } from '../ui/button.mjs';

export function finalCtaSection(c) {
  return html`
  <section class="section section--stage final-cta" id="ninhada" aria-labelledby="final-title">
    <div class="container final-cta__inner">
      <h2 class="final-cta__title" id="final-title">${c.title}</h2>
      <p class="final-cta__text">${c.text}</p>
      ${button({
        label: c.cta,
        variant: 'cream',
        size: 'lg',
        className: 'final-cta__button',
        extra: { 'aria-expanded': 'true', 'aria-controls': 'ninhada-escolha', 'data-disclosure': '' },
      })}
      <div class="disclosure final-cta__choices" id="ninhada-escolha" data-disclosure-panel>
        <div class="disclosure__inner">
          <p class="final-cta__choices-title">${c.choicesTitle}</p>
          <div class="choice-cards">
            ${c.choices.map(
              (ch) => html`<a${attrs({ class: 'choice-card', ...(ch.whatsapp ? whatsappAttrs(ch.whatsapp) : { href: ch.href }) })}>
                <span class="choice-card__who">${ch.who}</span>
                <span class="choice-card__action">${ch.label}</span>${ch.whatsapp ? opensWhatsapp : ''}
              </a>`,
            )}
          </div>
        </div>
      </div>
    </div>
    <div class="final-cta__art">
      ${responsiveImage('nestCutout', {
        alt: c.imageAlt,
        className: 'final-cta__image',
        sizes: '(min-width: 1024px) 760px, 110vw',
      })}
    </div>
  </section>`;
}
