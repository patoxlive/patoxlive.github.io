/** <head>: SEO, compartilhamento, favicons, fontes e CSS. */
import { html, raw } from '../../lib/html.mjs';
import { site, siteUrl } from '../../config/site.config.mjs';

export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400..800&family=Unbounded:wght@500..800&display=swap';

function absolute(path) {
  const base = siteUrl();
  if (!base) return null;
  return `${base}/${path.replace(/^\//, '')}`;
}

export function head({ title, description, path = '', cssHref, jsonLd = true, noindex = false, embed = false, baseHref }) {
  const canonical = absolute(path);
  const ogImage = absolute(site.seo.ogImage) || site.seo.ogImage;
  const ld = jsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: site.name,
        description: site.description,
        ...(site.legal.cnpj ? { taxID: site.legal.cnpj } : {}),
        ...(siteUrl() ? { url: siteUrl(), logo: absolute('assets/images/icon-512.png') } : {}),
        ...(site.social.some((s) => s.url) ? { sameAs: site.social.filter((s) => s.url).map((s) => s.url) } : {}),
        ...(site.contact.city
          ? {
              address: {
                '@type': 'PostalAddress',
                addressLocality: site.contact.city,
                addressRegion: site.contact.stateCode,
                addressCountry: 'BR',
              },
            }
          : {}),
        ...(site.contact.whatsapp
          ? {
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: `+${site.contact.whatsapp}`,
                ...(site.contact.email ? { email: site.contact.email } : {}),
                availableLanguage: 'Portuguese',
              },
            }
          : {}),
      }
    : null;

  return html`
    ${embed ? '' : raw('<meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')}
    ${baseHref ? html`<base href="${baseHref}">` : ''}
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${noindex ? raw('<meta name="robots" content="noindex">') : ''}
    ${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
    <meta name="theme-color" content="${site.themeColor}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${site.locale}">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${site.seo.ogImageAlt}">
    ${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="assets/images/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="assets/images/favicon-32.png" sizes="32x32">
    <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${FONTS_URL}">
    <link rel="stylesheet" href="${cssHref}">
    ${ld ? raw(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`) : ''}
    <script>document.documentElement.classList.add('js')</script>`;
}
