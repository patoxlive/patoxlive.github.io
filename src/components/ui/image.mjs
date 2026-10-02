/**
 * Imagens responsivas (WebP em vários tamanhos).
 * As definições ficam em site.config.mjs → images.
 */
import { html, attrs, plain } from '../../lib/html.mjs';
import { site } from '../../config/site.config.mjs';

export const IMG_DIR = 'assets/images/';

export function responsiveImage(key, { alt = '', sizes = '100vw', loading = 'lazy', fetchpriority, className, extra = {} } = {}) {
  const def = site.images[key];
  if (!def) throw new Error(`Imagem não configurada: ${key}`);
  const srcset = def.widths.map((w) => `${IMG_DIR}${def.base}-${w}.webp ${w}w`).join(', ');
  const largest = def.widths[def.widths.length - 1];
  return html`<img${attrs({
    class: className,
    src: `${IMG_DIR}${def.base}-${largest}.webp`,
    srcset,
    sizes,
    width: def.width,
    height: def.height,
    alt: plain(alt),
    loading,
    decoding: 'async',
    fetchpriority,
    ...extra,
  })}>`;
}

/** Marca "Patox" (imagem oficial). variant: 'color' | 'light' */
export function wordmark({ variant = 'color', height = 32, className = 'wordmark', alt = 'PATOX LIVE' } = {}) {
  const def = variant === 'light' ? site.images.wordmarkLight : site.images.wordmark;
  const width = Math.round((def.width / def.height) * height);
  return html`<img${attrs({
    class: className,
    src: `${IMG_DIR}${def.src}`,
    srcset: `${IMG_DIR}${def.src} 1x, ${IMG_DIR}${def.src2x} 2x`,
    width,
    height,
    alt,
    decoding: 'async',
  })}>`;
}
