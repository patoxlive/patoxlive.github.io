/** Páginas legais (Termos e Privacidade) e página 404 — mesmo topo e rodapé do site. */
import { html, text } from '../lib/html.mjs';
import { site } from '../config/site.config.mjs';
import { home } from '../content/home.content.mjs';
import { legal } from '../content/legal.content.mjs';
import { head } from '../components/layout/head.mjs';
import { header } from '../components/layout/header.mjs';
import { footer } from '../components/layout/footer.mjs';
import { documentShell } from '../components/layout/document.mjs';
import { button } from '../components/ui/button.mjs';
import { eggStage } from '../components/ui/egg-icons.mjs';

const BASE = 'index.html';

/** Bloco de texto legal: parágrafo (texto/partes) ou { list: [...] }. */
function block(b) {
  if (b && typeof b === 'object' && Array.isArray(b.list)) {
    return html`<ul class="legal__list">${b.list.map((item) => html`<li>${text(item)}</li>`)}</ul>`;
  }
  return html`<p>${text(b)}</p>`;
}

function legalPage(page, { cssHref, jsSrc }) {
  const body = html`
  <a class="skip-link" href="#conteudo">${home.skipLink}</a>
  ${header({ base: BASE, menu: home.menu, cta: home.hero.primary })}
  <main id="conteudo" class="legal" tabindex="-1">
    <div class="container legal__inner">
      <p class="legal__back"><a href="${BASE}">${legal.back}</a></p>
      <h1 class="legal__title">${page.title}</h1>
      <p class="legal__updated">${legal.updatedLabel} ${legal.updatedAt}</p>
      <p class="legal__intro">${text(page.intro)}</p>
      ${page.summary
        ? html`<aside class="legal__summary" aria-labelledby="${page.slug}-resumo">
            <h2 class="legal__summary-title" id="${page.slug}-resumo">${legal.summaryTitle}</h2>
            <ul class="legal__list">${page.summary.map((item) => html`<li>${text(item)}</li>`)}</ul>
          </aside>`
        : ''}
      <nav class="legal__toc" aria-labelledby="${page.slug}-indice">
        <h2 class="legal__toc-title" id="${page.slug}-indice">${legal.tocTitle}</h2>
        <ol class="legal__toc-list">
          ${page.sections.map((s) => html`<li><a href="#${s.id}">${s.title}</a></li>`)}
        </ol>
      </nav>
      <ol class="legal__sections" role="list">
        ${page.sections.map(
          (s, i) => html`<li class="legal__section" id="${s.id}">
            <h2><span class="legal__num" aria-hidden="true">${i + 1}.</span> ${s.title}</h2>
            ${s.body.map(block)}
          </li>`,
        )}
      </ol>
    </div>
  </main>
  ${footer(home.footer, { base: BASE })}`;

  return documentShell({
    mode: 'site',
    headHtml: head({
      title: `${page.title} | ${site.name}`,
      description: page.description,
      path: `${page.slug}.html`,
      cssHref,
      jsonLd: false,
    }),
    bodyHtml: body,
    bodyClass: 'page--legal',
    scripts: [jsSrc],
  }).toString();
}

export const renderTerms = (opts) => legalPage(legal.terms, opts);
export const renderPrivacy = (opts) => legalPage(legal.privacy, opts);

export function renderNotFound({ cssHref, jsSrc }) {
  const nf = legal.notFound;
  const body = html`
  ${header({ base: BASE, menu: home.menu, cta: home.hero.primary })}
  <main id="conteudo" class="not-found" tabindex="-1">
    <div class="container not-found__inner">
      <span class="not-found__egg">${eggStage(4)}</span>
      <h1 class="not-found__title">${nf.title}</h1>
      <p class="not-found__text">${nf.text}</p>
      ${button({ label: nf.cta, href: BASE, variant: 'primary', size: 'lg' })}
    </div>
  </main>
  ${footer(home.footer, { base: BASE })}`;
  return documentShell({
    mode: 'site',
    headHtml: head({ title: `${nf.title} | ${site.name}`, description: nf.text, path: '404.html', cssHref, jsonLd: false, noindex: true, baseHref: site.basePath }),
    bodyHtml: body,
    bodyClass: 'page--404',
    scripts: [jsSrc],
  }).toString();
}
