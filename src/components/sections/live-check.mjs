/** VOCÊ JÁ FAZ LIVE? — chamada para quem já faz LIVE (e para quem quer começar). */
import { html } from '../../lib/html.mjs';
import { button } from '../ui/button.mjs';
import { icon } from '../ui/icons.mjs';

export function liveCheckSection(c) {
  return html`
  <section class="section section--stage live-check" id="streamers" aria-labelledby="live-title">
    <div class="container live-check__inner">
      <h2 class="live-check__title" id="live-title">
        <span class="live-check__badge" aria-hidden="true"><span class="live-badge"><span class="live-badge__dot"></span>LIVE</span></span>
        ${c.title}
      </h2>
      <div class="live-check__body">
        <p class="live-check__text">${c.text}</p>
        <p class="live-check__list-title">${c.listTitle}</p>
        <ul class="check-list" role="list">
          ${c.list.map((item) => html`<li>${icon('check', { size: 20 })}<span>${item}</span></li>`)}
        </ul>
        ${button({ label: c.cta.label, href: c.cta.href, whatsapp: c.cta.whatsapp, variant: 'cream', size: 'lg' })}
      </div>
      <p class="live-check__beginner">${c.beginner}</p>
    </div>
  </section>`;
}
