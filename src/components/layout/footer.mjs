/** Rodapé: marca, navegação, contato, redes sociais e links legais. */
import { html, attrs } from '../../lib/html.mjs';
import { ph } from '../../lib/placeholder.mjs';
import { site } from '../../config/site.config.mjs';
import { anchor, whatsappAttrs, opensWhatsapp } from '../ui/button.mjs';
import { brand } from './header.mjs';

export function footer(c, { base = '' } = {}) {
  const contact = site.contact;
  const year = new Date().getFullYear();
  const whatsapp = contact.whatsapp
    ? html`<a${attrs(whatsappAttrs('contato'))}>${contact.whatsappLabel}${opensWhatsapp}</a>`
    : ph('número do WhatsApp');
  const email = contact.email ? html`<a href="mailto:${contact.email}">${contact.email}</a>` : ph('e-mail de contato');
  const { companyName, cnpj } = site.legal;
  const company =
    companyName || cnpj
      ? html`${companyName || c.companyNameMissing} | CNPJ ${cnpj || c.cnpjMissing}`
      : c.companyMissing;

  return html`
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        ${brand({ base, variant: 'light', className: 'brand--light' })}
        <p class="site-footer__tagline">${c.tagline}<br>${c.location}</p>
      </div>
      <nav class="site-footer__col" aria-labelledby="footer-nav-title">
        <h2 class="site-footer__title" id="footer-nav-title">${c.navTitle}</h2>
        <ul role="list">
          ${c.nav.map((item) => html`<li><a href="${anchor(item.href, base)}">${item.label}</a></li>`)}
        </ul>
      </nav>
      <div class="site-footer__col">
        <h2 class="site-footer__title">${c.contactTitle}</h2>
        <ul role="list">
          <li><span class="site-footer__meta">WhatsApp</span> ${whatsapp}</li>
          <li><span class="site-footer__meta">E-mail</span> ${email}</li>
        </ul>
      </div>
      <div class="site-footer__col">
        <h2 class="site-footer__title">${c.socialTitle}</h2>
        <ul role="list">
          ${site.social.map((s) =>
            s.url
              ? html`<li><span class="site-footer__meta">${s.label}</span> <a href="${s.url}" target="_blank" rel="noopener">${s.handle || s.label}</a></li>`
              : html`<li>${s.label} ${ph(`link do ${s.label}`)}</li>`,
          )}
        </ul>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <div class="site-footer__legal-text">
        <p>© ${year} ${site.name}. ${c.rights}</p>
        <p>${company}</p>
        <p>${c.disclaimer}</p>
      </div>
      <ul class="site-footer__legal" role="list">
        <li><a href="${site.pages.terms}">${c.terms}</a></li>
        <li><a href="${site.pages.privacy}">${c.privacy}</a></li>
      </ul>
    </div>
  </footer>`;
}
