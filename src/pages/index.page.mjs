/**
 * PÁGINA INICIAL — ordem das seções.
 * Para reordenar, esconder ou duplicar uma seção, edite a lista `sections` abaixo.
 */
import { html } from '../lib/html.mjs';
import { site } from '../config/site.config.mjs';
import { home } from '../content/home.content.mjs';
import { head } from '../components/layout/head.mjs';
import { header } from '../components/layout/header.mjs';
import { footer } from '../components/layout/footer.mjs';
import { documentShell } from '../components/layout/document.mjs';
import { button } from '../components/ui/button.mjs';
import { heroSection } from '../components/sections/hero.mjs';
import { journeysSection } from '../components/sections/journeys.mjs';
import { aboutSection } from '../components/sections/about.mjs';
import { benefitsSection } from '../components/sections/benefits.mjs';
import { howItWorksSection } from '../components/sections/how-it-works.mjs';
import { liveCheckSection } from '../components/sections/live-check.mjs';
import { eggSection } from '../components/sections/egg/egg.mjs';
import { applySection } from '../components/sections/apply.mjs';
import { recruitSection } from '../components/sections/recruit.mjs';
import { supportSection } from '../components/sections/support.mjs';
import { finalCtaSection } from '../components/sections/final-cta.mjs';

export function render({ mode, cssHref, jsSrc }) {
  const sections = [
    heroSection(home.hero),
    journeysSection(home.journeys),
    aboutSection(home.about),
    benefitsSection(home.benefits),
    howItWorksSection(home.howItWorks),
    liveCheckSection(home.liveCheck),
    eggSection(home.egg),
    applySection(home.apply),
    recruitSection(home.recruit),
    supportSection(home.support),
    finalCtaSection(home.finalCta),
  ];

  const body = html`
  <a class="skip-link" href="#conteudo">${home.skipLink}</a>
  ${header({ menu: home.menu, cta: home.hero.primary })}
  <main id="conteudo" tabindex="-1">
    ${sections}
  </main>
  ${footer(home.footer)}
  <div class="mobile-cta" data-mobile-cta hidden>
    ${button({ label: home.mobileBar.label, href: home.mobileBar.href, whatsapp: home.mobileBar.whatsapp, variant: 'primary', size: 'lg', block: true })}
  </div>`;

  return documentShell({
    mode,
    headHtml: head({
      title: mode === 'embed' ? site.name : site.seo.title,
      description: site.seo.description,
      path: '',
      cssHref,
      embed: mode === 'embed',
    }),
    bodyHtml: body,
    bodyClass: 'page--home',
    scripts: [jsSrc],
  }).toString();
}
