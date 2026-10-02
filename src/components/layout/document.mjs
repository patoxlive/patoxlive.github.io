/**
 * Documento HTML completo.
 * mode 'site'  → documento normal (<!doctype html> … </html>) para hospedar em qualquer servidor.
 * mode 'embed' → só o conteúdo (sem <html>/<head>/<body>), usado na prévia publicada.
 */
import { html } from '../../lib/html.mjs';
import { site } from '../../config/site.config.mjs';

export function documentShell({ mode = 'site', headHtml, bodyHtml, bodyClass = '', scripts = [] }) {
  const scriptTags = scripts.map((src) => html`<script src="${src}" defer></script>`);
  if (mode === 'embed') {
    return html`${headHtml}
<div class="page ${bodyClass}">
${bodyHtml}
</div>
${scriptTags}`;
  }
  return html`<!doctype html>
<html lang="${site.lang}">
<head>
${headHtml}
</head>
<body class="${bodyClass}">
${bodyHtml}
${scriptTags}
</body>
</html>`;
}
