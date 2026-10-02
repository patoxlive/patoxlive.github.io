/** Topo fixo: marca, menu, CTA principal e menu do celular. */
import { html } from '../../lib/html.mjs';
import { site } from '../../config/site.config.mjs';
import { wordmark } from '../ui/image.mjs';
import { button, anchor } from '../ui/button.mjs';

export function brand({ base = '', variant = 'color', className = '' } = {}) {
  return html`<a class="brand ${className}" href="${anchor('#inicio', base) || '#inicio'}" aria-label="PATOX LIVE, ir para o início">
    ${wordmark({ variant, height: 30, className: 'brand__wordmark', alt: '' })}
    <span class="brand__live" aria-hidden="true">LIVE</span>
  </a>`;
}

export function header({ base = '', menu, cta }) {
  const links = site.nav.map((item) => ({ ...item, href: anchor(item.href, base) }));
  const ctaHref = cta.href ? anchor(cta.href, base) : undefined;
  return html`
  <header class="site-header" data-header>
    <div class="container site-header__inner">
      ${brand({ base })}
      <nav class="site-nav" aria-label="Principal">
        <ul class="site-nav__list" role="list">
          ${links.map((l) => html`<li><a class="site-nav__link" href="${l.href}" data-nav-link>${l.label}</a></li>`)}
        </ul>
      </nav>
      ${button({ label: cta.label, href: ctaHref, whatsapp: cta.whatsapp, variant: 'primary', size: 'sm', className: 'site-header__cta' })}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-celular" data-menu-toggle data-label-open="${menu.open}" data-label-close="${menu.close}">
        <span class="visually-hidden" data-menu-label>${menu.open}</span>
        <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
    <div class="mobile-menu" id="menu-celular" data-mobile-menu hidden>
      <nav class="container mobile-menu__inner" aria-label="Principal (celular)">
        <ul class="mobile-menu__list" role="list">
          ${links.map((l) => html`<li><a class="mobile-menu__link" href="${l.href}">${l.label}</a></li>`)}
        </ul>
        ${button({ label: menu.cta, href: ctaHref, whatsapp: menu.whatsapp || cta.whatsapp, variant: 'primary', size: 'lg', block: true })}
      </nav>
    </div>
  </header>`;
}
