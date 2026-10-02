/* PATOX LIVE — ponto de entrada do JavaScript.
   Os módulos ficam em ./modules e são juntados em um arquivo só pelo build. */
import { initDisclosures } from './modules/disclosure.js';
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initEgg } from './modules/egg.js';
import { initMobileCta } from './modules/mobile-cta.js';
import { initTracking } from './modules/tracking.js';

initDisclosures();
initNav();
initReveal();
initEgg();
initMobileCta();
initTracking();
