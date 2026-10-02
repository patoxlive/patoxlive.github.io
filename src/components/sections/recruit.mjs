/** RECRUTAMENTO — "Faça parte da ninhada": quem pode participar (streamers e recrutadores),
 *  como funciona o recrutamento e o que a PATOX oferece. O botão principal abre o WhatsApp. */
import { html } from '../../lib/html.mjs';
import { responsiveImage } from '../ui/image.mjs';
import { button } from '../ui/button.mjs';
import { icon } from '../ui/icons.mjs';

export function recruitSection(c) {
  return html`
  <section class="section section--purple recruit" id="recrutamento" aria-labelledby="recruit-title">
    <div class="container recruit__inner">
      <figure class="recruit__art" data-reveal>
        ${responsiveImage('nest', {
          alt: c.imageAlt,
          className: 'recruit__image',
          sizes: '(min-width: 1024px) 520px, (min-width: 640px) 70vw, 92vw',
        })}
      </figure>
      <div class="recruit__copy">
        <h2 class="section-title" id="recruit-title">${c.title}</h2>
        <p class="section-lead">${c.text}</p>
        <dl class="recruit__facts">
          <div class="recruit__fact">
            <dt>${c.whoTitle}</dt>
            <dd>
              <div class="who-groups">
                ${c.groups.map(
                  (g) => html`<div class="who-group">
                    <h3 class="who-group__title">${g.title}</h3>
                    <p class="who-group__text">${g.text}</p>
                    ${g.cta
                      ? html`<a class="who-group__link" href="${g.cta.href}">${g.cta.label}</a>`
                      : ''}
                  </div>`,
                )}
              </div>
            </dd>
          </div>
          ${c.items.map(
            (item) => html`<div class="recruit__fact">
              <dt>${item.title}</dt>
              <dd>
                ${item.text ? html`<p>${item.text}</p>` : ''}
                ${item.list
                  ? html`<ul class="check-list" role="list">
                      ${item.list.map((li) => html`<li>${icon('check', { size: 20 })}<span>${li}</span></li>`)}
                    </ul>`
                  : ''}
              </dd>
            </div>`,
          )}
        </dl>
        ${button({ label: c.cta.label, href: c.cta.href, whatsapp: c.cta.whatsapp, variant: 'cream', size: 'lg', className: 'recruit__cta' })}
      </div>
    </div>
  </section>`;
}
