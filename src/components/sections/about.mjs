/** SOBRE A PATOX LIVE — proposta (manifesto), quem somos / o que fazemos / para quem e a equipe. */
import { html } from '../../lib/html.mjs';
import { team } from '../../content/home.content.mjs';
import { eggAvatar } from '../ui/avatar.mjs';

export function aboutSection(c) {
  return html`
  <section class="section about" id="sobre" aria-labelledby="about-title">
    <div class="container about__inner">
      <div class="about__proposal">
        <h2 class="section-title" id="about-title">${c.title}</h2>
        <p class="about__label">${c.proposalLabel}</p>
        <p class="about__manifesto">
          ${c.proposal.map((line) => html`<span class="about__line">${line}</span> `)}
        </p>
      </div>
      <dl class="about__facts">
        ${c.items.map(
          (item) => html`<div class="about__fact">
            <dt class="about__fact-title">${item.title}</dt>
            <dd class="about__fact-text">${item.text}</dd>
          </div>`,
        )}
        <div class="about__fact">
          <dt class="about__fact-title">${c.teamTitle}</dt>
          <dd class="about__fact-text">
            <ul class="team" role="list">
              ${team.map(
                (m) => html`<li class="team__member">
                  ${eggAvatar(m.name, { size: 'lg' })}
                  <span class="team__text"><span class="team__name">${m.name}</span><span class="team__role">${m.role}</span></span>
                </li>`,
              )}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </section>`;
}
