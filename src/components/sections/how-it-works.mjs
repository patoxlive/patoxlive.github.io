/** COMO FUNCIONA — 4 passos, cada um com um estágio do ovo (inteiro → aberto). */
import { html } from '../../lib/html.mjs';
import { eggStage } from '../ui/egg-icons.mjs';

export function howItWorksSection(c) {
  return html`
  <section class="section steps-section" id="como-funciona" aria-labelledby="steps-title">
    <div class="container">
      <header class="section-head">
        <h2 class="section-title" id="steps-title">${c.title}</h2>
        <p class="section-lead">${c.lead}</p>
      </header>
      <ol class="steps" role="list" data-steps>
        ${c.steps.map(
          (step, i) => html`<li class="step" style="--i: ${i}" data-reveal>
            <div class="step__marker">
              <span class="step__egg">${eggStage(i + 1)}</span>
              <span class="step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            </div>
            <div class="step__body">
              <h3 class="step__title">${step.title}</h3>
              <p class="step__text">${step.text}</p>
              ${step.note ? html`<p class="step__note">${step.note}</p>` : ''}
            </div>
          </li>`,
        )}
      </ol>
    </div>
  </section>`;
}
