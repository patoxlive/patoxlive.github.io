/**
 * HERO — primeira dobra.
 * Visual: o pato da marca empurrando a "tampa" de um ovo escuro (um palco de LIVE).
 */
import { html, raw } from '../../lib/html.mjs';
import { eggPolygon, clipToConvex, polygonPath, polylinePath } from '../../lib/geometry.mjs';
import { responsiveImage } from '../ui/image.mjs';
import { button } from '../ui/button.mjs';
import { icon } from '../ui/icons.mjs';

// Ovo escuro do hero (viewBox 0 80 600 700)
const EGG = { cx: 300, cy: 470, rx: 262, ryTop: 320, ryBottom: 270 };
const CUT = [
  [0, 250], [100, 250], [140, 228], [176, 262], [214, 224], [252, 258], [292, 222],
  [332, 258], [372, 226], [410, 260], [448, 230], [500, 250], [600, 250],
];
const poly = eggPolygon(EGG);
const BODY = polygonPath(clipToConvex([...CUT, [600, 820], [0, 820]], poly));
const CAP = polygonPath(clipToConvex([...CUT, [600, 0], [0, 0]], poly));
const CUT_LINE = polylinePath(CUT);

function heroEgg() {
  return raw(`<svg class="hero-egg" viewBox="0 80 600 700" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="hero-egg-fill" cx=".34" cy=".3" r=".78">
        <stop offset="0" stop-color="#4A2382"/>
        <stop offset=".5" stop-color="#2A1245"/>
        <stop offset="1" stop-color="#1D0C30"/>
      </radialGradient>
      <radialGradient id="hero-egg-spot" cx=".5" cy=".62" r=".5">
        <stop offset="0" stop-color="#B08CE8" stop-opacity=".42"/>
        <stop offset="1" stop-color="#B08CE8" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="hero-egg-body"><path d="${BODY}"/></clipPath>
      <clipPath id="hero-egg-cap"><path d="${CAP}"/></clipPath>
    </defs>
    <g class="hero-egg__body">
      <path d="${BODY}" fill="url(#hero-egg-fill)"/>
      <ellipse cx="300" cy="520" rx="230" ry="200" fill="url(#hero-egg-spot)" clip-path="url(#hero-egg-body)"/>
      <ellipse cx="128" cy="420" rx="20" ry="74" transform="rotate(-16 128 420)" fill="#FFFFFF" opacity=".09"/>
      <path d="${CUT_LINE}" class="hero-egg__edge" clip-path="url(#hero-egg-body)"/>
    </g>
    <g class="hero-egg__cap">
      <path d="${CAP}" fill="url(#hero-egg-fill)"/>
      <ellipse cx="190" cy="215" rx="34" ry="12" transform="rotate(-20 190 215)" fill="#FFFFFF" opacity=".1"/>
      <path d="${CUT_LINE}" class="hero-egg__edge" clip-path="url(#hero-egg-cap)"/>
    </g>
  </svg>`);
}

export function heroSection(c) {
  return html`
  <section class="hero" id="inicio" aria-labelledby="hero-title">
    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="hero__kicker"><span class="live-dot" aria-hidden="true"></span>${c.kicker}</p>
        <h1 class="hero__title" id="hero-title">
          <span class="visually-hidden">PATOX LIVE: </span>${c.title}<span class="egg-dot" aria-hidden="true"><svg viewBox="0 0 20 26" focusable="false"><path d="M1 14.5A9 13.5 0 0 1 19 14.5A9 11 0 0 1 1 14.5Z"/></svg></span>
        </h1>
        <p class="hero__tagline">${c.tagline}</p>
        <p class="hero__lead">${c.lead}</p>
        <div class="hero__ctas">
          <div class="cta-choice">
            ${button({ label: c.primary.label, href: c.primary.href, whatsapp: c.primary.whatsapp, variant: 'primary', size: 'lg' })}
            <p class="cta-choice__note">${c.primary.note}</p>
          </div>
          <div class="cta-choice">
            ${button({ label: c.secondary.label, href: c.secondary.href, whatsapp: c.secondary.whatsapp, variant: 'outline', size: 'lg' })}
            <p class="cta-choice__note">${c.secondary.note}</p>
          </div>
        </div>
        <p class="hero__contact">${icon('chat', { size: 18 })}<span>${c.contactLine}</span></p>
      </div>

      <div class="hero__visual">
        ${heroEgg()}
        ${responsiveImage('hero', {
          alt: c.imageAlt,
          className: 'hero__duck',
          sizes: '(min-width: 1024px) 460px, (min-width: 640px) 56vw, 78vw',
          loading: 'eager',
          fetchpriority: 'high',
        })}
        <span class="live-badge hero__live" aria-hidden="true"><span class="live-badge__dot"></span>${c.liveBadge}</span>
        <span class="hero__hearts" aria-hidden="true">
          ${icon('heart', { className: 'hero__heart hero__heart--1', size: 22 })}
          ${icon('heart', { className: 'hero__heart hero__heart--2', size: 16 })}
          ${icon('heart', { className: 'hero__heart hero__heart--3', size: 19 })}
        </span>
      </div>
    </div>
  </section>`;
}
