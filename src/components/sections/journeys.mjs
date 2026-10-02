/** DUAS JORNADAS — streamer (agenciamento) × recrutador (ninhada). */
import { html } from '../../lib/html.mjs';
import { button } from '../ui/button.mjs';
import { eggStage, nestIcon } from '../ui/egg-icons.mjs';

function journey(kind, j, art, variant) {
  return html`
  <article class="journey journey--${kind}" aria-labelledby="journey-${kind}-title" data-reveal style="--i: ${kind === 'streamer' ? 0 : 1}">
    <div class="journey__top">
      <span class="journey__art">${art}</span>
      <p class="journey__tag">${j.tag}</p>
    </div>
    <h3 class="journey__title" id="journey-${kind}-title">${j.title}</h3>
    <p class="journey__text">${j.text}</p>
    <p class="journey__next">${j.next}</p>
    ${button({ label: j.cta.label, href: j.cta.href, whatsapp: j.cta.whatsapp, variant, size: 'lg', className: 'journey__cta' })}
  </article>`;
}

export function journeysSection(c) {
  return html`
  <section class="section journeys" id="caminhos" aria-labelledby="journeys-title">
    <div class="container">
      <header class="section-head">
        <h2 class="section-title" id="journeys-title">${c.title}</h2>
        <p class="section-lead">${c.lead}</p>
      </header>
      <div class="journeys__grid">
        ${journey('streamer', c.streamer, eggStage(1, { live: true }), 'primary')}
        ${journey('recruiter', c.recruiter, nestIcon(), 'cream')}
      </div>
    </div>
  </section>`;
}
