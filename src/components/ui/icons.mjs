/**
 * Ícones em SVG (traço, 24x24). Herdam a cor do texto (currentColor).
 * Para usar: icon('headset')
 */
import { raw } from '../../lib/html.mjs';

const PATHS = {
  headset:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h2.2a1.3 1.3 0 0 1 1.3 1.3v3.4A1.3 1.3 0 0 1 6.2 20H5.3A1.3 1.3 0 0 1 4 18.7z"/><path d="M20 14h-2.2a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 0 0 1.3 1.3h.9a1.3 1.3 0 0 0 1.3-1.3z"/><path d="M20 18.5v.5a3 3 0 0 1-3 3h-3"/>',
  chart: '<path d="M4 20h16"/><path d="M5 15.5l4.2-4.2 3.3 3.2 6.5-7"/><path d="M15 7.5h4v4"/>',
  cap: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.8v3.7c0 1.6 2.5 3.2 5.5 3.2s5.5-1.6 5.5-3.2v-3.7"/><path d="M21.5 9.5v5"/>',
  nest:
    '<path d="M3 13.5c1.2 4.2 4.6 6.5 9 6.5s7.8-2.3 9-6.5"/><path d="M5.5 15.5c2 1.2 4.1 1.7 6.5 1.7s4.5-.5 6.5-1.7"/><ellipse cx="8.2" cy="10.8" rx="2.4" ry="3.1"/><ellipse cx="15.8" cy="10.8" rx="2.4" ry="3.1"/><ellipse cx="12" cy="8.6" rx="2.5" ry="3.3"/>',
  spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  check: '<path d="M5 12.5l4.3 4.3L19 7"/>',
  chat: '<path d="M4 20l1.4-4.1A8 8 0 1 1 8.6 19z"/><path d="M9 10.5h6M9 13.5h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  bolt: '<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4.5M16 6h3a3 3 0 0 1-3 4.5"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
  camera: '<rect x="3" y="6.5" width="13" height="11" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4.5v4h4"/>',
};

const FILLED = {
  heart:
    '<path d="M12 20.5s-7.5-4.6-9.4-9.3C1.4 8.2 3.1 4.8 6.4 4.5c2.3-.2 4 .9 5.6 3 1.6-2.1 3.3-3.2 5.6-3 3.3.3 5 3.7 3.8 6.7-1.9 4.7-9.4 9.3-9.4 9.3z"/>',
  dot: '<circle cx="12" cy="12" r="6"/>',
};

export function icon(name, { size = 24, className = 'icon', label } = {}) {
  const isFilled = name in FILLED;
  const body = isFilled ? FILLED[name] : PATHS[name];
  if (!body) throw new Error(`Ícone desconhecido: ${name}`);
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  const paint = isFilled
    ? 'fill="currentColor"'
    : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  return raw(`<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" ${paint} ${a11y}>${body}</svg>`);
}
