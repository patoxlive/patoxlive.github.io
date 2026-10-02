/**
 * Ovinhos em SVG (mesmo estilo do ovo principal).
 * Usados nos passos do "Como funciona" (estágios 1 a 4) e nos cards de jornada.
 */
import { raw } from '../../lib/html.mjs';
import { eggPolygon, clipToConvex, polygonPath } from '../../lib/geometry.mjs';

let uid = 0;
const EGG = 'M7 33A17 24 0 0 1 41 33A17 21 0 0 1 7 33Z';
const EGG_SHAPE = { cx: 24, cy: 33, rx: 17, ryTop: 24, ryBottom: 21 };
const LIT = polygonPath(clipToConvex(eggPolygon({ cx: 25, cy: 31.5, rx: 15.5, ryTop: 25, ryBottom: 18.5 }, 96), eggPolygon(EGG_SHAPE, 96)));
const CRACK_LINE = 'M5 31 9.5 27.2 13.4 31 18 26.2 23.2 31.2 27.8 26.4 32.8 31 37.6 27 43 30.6';
const CUP_CLIP = '0,60 0,31 5,31 9.5,27.2 13.4,31 18,26.2 23.2,31.2 27.8,26.4 32.8,31 37.6,27 43,30.6 48,30.6 48,60';
const CAP_CLIP = '0,0 48,0 48,30.6 43,30.6 37.6,27 32.8,31 27.8,26.4 23.2,31.2 18,26.2 13.4,31 9.5,27.2 5,31 0,31';

function body() {
  return `<path class="egg-mini__shade" d="${EGG}"/><path class="egg-mini__lit" d="${LIT}"/><ellipse class="egg-mini__shine" cx="17" cy="20" rx="2.5" ry="5" transform="rotate(-22 17 20)"/><path class="egg-mini__line" d="${EGG}"/>`;
}

/** stage: 1 inteiro · 2 primeira rachadura · 3 rachando · 4 aberto */
export function eggStage(stage = 1, { className = 'egg-mini', live = false } = {}) {
  const id = `egg-mini-${++uid}`;
  let inner = '';
  if (stage === 1 || stage === 2) {
    inner = body();
    if (stage === 2) inner += '<path class="egg-mini__crack" d="M29 12.5l-2 3.8 2.8 1.7-2 3.8"/>';
  } else if (stage === 3) {
    inner = `<defs><clipPath id="${id}-cup"><polygon points="${CUP_CLIP}"/></clipPath><clipPath id="${id}-cap"><polygon points="${CAP_CLIP}"/></clipPath></defs>
      <g clip-path="url(#${id}-cup)">${body()}</g>
      <g transform="translate(1.2 -3.2) rotate(-7 24 26)"><g clip-path="url(#${id}-cap)">${body()}</g></g>
      <path class="egg-mini__crack" d="${CRACK_LINE}" clip-path="url(#${id}-cup)"/>`;
  } else {
    inner = `<defs><clipPath id="${id}-cup"><polygon points="${CUP_CLIP}"/></clipPath><clipPath id="${id}-cap"><polygon points="${CAP_CLIP}"/></clipPath></defs>
      <g clip-path="url(#${id}-cup)">${body()}<path class="egg-mini__inner" d="M8 30.5 13.4 32.6 18 28.4 23.2 33 27.8 28.6 32.8 32.6 37.6 28.8 42 31.2 C38 36 31 37.5 24 37.5 S10 36 8 30.5Z"/></g>
      <g transform="translate(6 -9) rotate(-24 24 26)"><g clip-path="url(#${id}-cap)">${body()}</g></g>
      <path class="egg-mini__spark" d="M40 6.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z"/>`;
  }
  if (live) inner += '<circle class="egg-mini__live" cx="39" cy="14" r="4.2"/>';
  return raw(`<svg class="${className}" viewBox="0 0 48 60" width="48" height="60" aria-hidden="true" focusable="false">${inner}</svg>`);
}

/** Ninho com três ovos (ícone da jornada de recrutamento). */
export function nestIcon({ className = 'egg-mini egg-mini--nest' } = {}) {
  const egg = (cx, cy, rx, ry, tone) =>
    `<ellipse class="nest-egg nest-egg--${tone}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><ellipse class="egg-mini__shine" cx="${cx - rx * 0.35}" cy="${cy - ry * 0.35}" rx="${rx * 0.16}" ry="${ry * 0.3}" transform="rotate(-20 ${cx - rx * 0.35} ${cy - ry * 0.35})"/>`;
  return raw(`<svg class="${className}" viewBox="0 0 64 60" width="64" height="60" aria-hidden="true" focusable="false">
    ${egg(21, 32, 9.5, 12.5, 'a')}${egg(43, 32, 9.5, 12.5, 'b')}${egg(32, 27, 10, 13.5, 'c')}
    <path class="nest-bowl" d="M5 34c2 12 12.5 19 27 19s25-7 27-19c-8 4.5-17 6.5-27 6.5S13 38.5 5 34Z"/>
    <path class="nest-straw" d="M10 42c6 3 14 4.4 22 4.4S48 45 54 42M16 48c5 1.6 10 2.3 16 2.3s11-.7 16-2.3"/>
  </svg>`);
}
