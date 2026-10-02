/**
 * Seção "O OVO" — principal microinteração do site.
 * Estados (atributo data-egg-state na seção, controlado por src/scripts/modules/egg.js):
 *   idle → anticipating (hover/foco/visível no celular) → cracking → hatched
 */
import { html, raw } from '../../../lib/html.mjs';
import { responsiveImage } from '../../ui/image.mjs';
import { button } from '../../ui/button.mjs';
import { icon } from '../../ui/icons.mjs';
import { VIEW, PATHS, PIECES, COLORS, BURST_CENTER } from './geometry.mjs';

function eggSvg() {
  const piece = (name) => `
      <g class="egg__piece egg__piece--${name}" data-piece="${name}">
        <g clip-path="url(#egg-piece-${name})"><use href="#egg-art"/></g>
        <path class="egg__edge" d="${PIECES[name]}"/>
      </g>`;
  const clip = (name) => `<clipPath id="egg-piece-${name}"><path d="${PIECES[name]}"/></clipPath>`;
  return raw(`<svg class="egg__svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" aria-hidden="true" focusable="false">
    <defs>
      <g id="egg-art">
        <path d="${PATHS.egg}" fill="${COLORS.shade}"/>
        <path d="${PATHS.lit}" fill="${COLORS.lit}"/>
        <ellipse cx="428" cy="470" rx="42" ry="104" transform="rotate(-24 428 470)" fill="#FFFFFF" opacity=".75"/>
        <ellipse cx="470" cy="352" rx="14" ry="20" transform="rotate(-24 470 352)" fill="#FFFFFF" opacity=".6"/>
        <path d="${PATHS.egg}" fill="none" stroke="${COLORS.line}" stroke-width="12"/>
      </g>
      ${['bottom', 'left', 'right', 'cap'].map(clip).join('')}
      <clipPath id="egg-shape"><path d="${PATHS.egg}"/></clipPath>
      <radialGradient id="egg-flash-grad">
        <stop offset="0" stop-color="#FFFBEF" stop-opacity="1"/>
        <stop offset=".35" stop-color="#F6EFD3" stop-opacity=".75"/>
        <stop offset="1" stop-color="#B08CE8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path class="egg__ring" d="${PATHS.ring}"/>
    <g class="egg__pieces">${['bottom', 'left', 'right', 'cap'].map(piece).join('')}
    </g>
    <g class="egg__whole"><use href="#egg-art"/></g>
    <g class="egg__cracks" clip-path="url(#egg-shape)" stroke="${COLORS.crack}">
      <path class="egg__crack egg__crack--pip" d="${PATHS.pip}" pathLength="1"/>
      <path class="egg__crack egg__crack--left" d="${PATHS.crackLeft}" pathLength="1"/>
      <path class="egg__crack egg__crack--right" d="${PATHS.crackRight}" pathLength="1"/>
      <path class="egg__crack egg__crack--split" d="${PATHS.crackSplit}" pathLength="1"/>
      <path class="egg__crack egg__crack--cap" d="${PATHS.crackCap}" pathLength="1"/>
    </g>
    <circle class="egg__flash" cx="${BURST_CENTER[0]}" cy="${BURST_CENTER[1]}" r="520" fill="url(#egg-flash-grad)"/>
    <g class="egg__particles" data-egg-particles></g>
  </svg>`);
}

export function eggSection(c) {
  return html`
  <section class="section section--stage egg-section" id="descubra" aria-labelledby="egg-title" data-egg-root>
    <div class="container egg-section__inner">
      <div class="egg-copy">
        <h2 class="egg-copy__title" id="egg-title">
          <span class="egg-copy__line" data-egg-when="closed">${c.closed.title}</span>
          <span class="egg-copy__line" data-egg-when="open">${c.open.title}</span>
        </h2>
        <div class="egg-copy__texts">
          <p class="egg-copy__text" data-egg-when="closed">${c.closed.text}</p>
          <p class="egg-copy__text" data-egg-when="open">${c.open.text}</p>
        </div>
      </div>

      <div class="egg-stage">
        <div class="egg-stage__glow" aria-hidden="true"></div>
        <div class="egg-stage__floor" aria-hidden="true"></div>
        <button class="egg" type="button" data-egg aria-label="${c.eggLabel}" aria-describedby="egg-hint">
          <span class="egg__body" data-egg-body>
            ${responsiveImage('eggOpen', {
              alt: c.imageAlt,
              className: 'egg__hatched',
              sizes: '(min-width: 1024px) 420px, 76vw',
              extra: { 'data-egg-image': '' },
            })}
            ${eggSvg()}
          </span>
        </button>
      </div>

      <div class="egg-actions">
        <p class="egg-hint" id="egg-hint" data-egg-when="closed">
          <span class="egg-hint__word">${c.hint.word}</span>
          <span class="egg-hint__how egg-hint__how--pointer">${c.hint.pointer}</span>
          <span class="egg-hint__how egg-hint__how--touch">${c.hint.touch}</span>
        </p>
        <div class="egg-actions__open" data-egg-when="open" data-egg-nojs>
          ${button({ label: c.cta.label, href: c.cta.href, whatsapp: c.cta.whatsapp, variant: 'cream', size: 'lg', extra: { 'data-egg-cta': '' } })}
          <button class="link-button egg-actions__replay" type="button" data-egg-reset>${icon('replay', { size: 18 })}<span>${c.replay}</span></button>
        </div>
      </div>
      <p class="visually-hidden" role="status" data-egg-status data-message="${c.status}"></p>
    </div>
    <div class="crack-edge" aria-hidden="true"></div>
  </section>`;
}
