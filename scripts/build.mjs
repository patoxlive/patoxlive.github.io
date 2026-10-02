#!/usr/bin/env node
/**
 * PATOX LIVE — build (sem dependências externas)
 *
 *   npm run build                → gera o site em dist/
 *   npm run build -- --preview   → gera também dist-preview/ (prévia autocontida: CSS e JS embutidos no HTML)
 *   npm run placeholders         → só lista os placeholders que faltam preencher
 *
 * O que ele faz:
 *   1. junta todos os CSS de src/styles/main.css em um arquivo só
 *   2. junta os módulos JS de src/scripts/main.js em um arquivo só (funciona até sem servidor)
 *   3. monta as páginas HTML a partir dos componentes e do conteúdo
 *   4. copia imagens, favicons, arquivos de servidor (src/public: HTTPS e cabeçalhos) e gera robots.txt / sitemap.xml
 *   5. mostra um relatório do que ainda é placeholder
 */
import { readFile, writeFile, mkdir, rm, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const args = new Set(process.argv.slice(2));
const REPORT_ONLY = args.has('--report-only');
const PREVIEW = args.has('--preview');

const c = { dim: (s) => `\x1b[2m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m` };
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 8);

// ------------------------------------------------------------------ CSS
async function bundleCss(entry) {
  const seen = new Set();
  async function load(file) {
    if (seen.has(file)) return '';
    seen.add(file);
    let css = await readFile(file, 'utf8');
    const importRe = /@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/g;
    const parts = [];
    let last = 0;
    for (const m of css.matchAll(importRe)) {
      parts.push(css.slice(last, m.index));
      parts.push(await load(path.resolve(path.dirname(file), m[1])));
      last = m.index + m[0].length;
    }
    parts.push(css.slice(last));
    return parts.join('');
  }
  const css = await load(entry);
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*\n+/g, '\n')
    .replace(/^\s+/gm, '')
    .trim() + '\n';
}

// ------------------------------------------------------------------ JS
async function bundleJs(entry) {
  const order = [];
  const seen = new Set();
  async function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    const code = await readFile(file, 'utf8');
    const deps = [...code.matchAll(/^import\s+[^;]*?from\s+['"](\.[^'"]+)['"];?\s*$/gm)].map((m) => path.resolve(path.dirname(file), m[1]));
    for (const dep of deps) await visit(dep);
    order.push({ file, code });
  }
  await visit(entry);

  // os módulos são juntados num escopo só: nomes no topo de cada arquivo precisam ser únicos
  const owners = new Map();
  for (const { file, code } of order) {
    for (const m of code.matchAll(/^(?:export\s+)?(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
      const name = m[1];
      if (owners.has(name)) {
        throw new Error(`Nome repetido no JavaScript: "${name}" em ${path.relative(SRC, owners.get(name))} e ${path.relative(SRC, file)}. Renomeie um deles.`);
      }
      owners.set(name, file);
    }
  }

  const body = order
    .map(({ file, code }) => {
      const cleaned = code
        .replace(/^import\s+[^;]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
        .replace(/^export\s+(?=(async\s+)?(function|const|let|class)\b)/gm, '')
        .replace(/^export\s*\{[^}]*\};?\s*$/gm, '');
      return `// --- ${path.relative(SRC, file)}\n${cleaned.trim()}\n`;
    })
    .join('\n');
  return `/*! PATOX LIVE — gerado por scripts/build.mjs a partir de src/scripts/ */\n(() => {\n'use strict';\n${body}\n})();\n`;
}

// ------------------------------------------------------------------ helpers
async function copyDir(from, to, filter = () => true) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) continue; // originais ficam fora do build
    if (filter(entry.name)) await copyFile(src, dst);
  }
}

function extractPlaceholders(htmlText) {
  const found = [];
  const re = /<span class="ph" data-placeholder>\[([^\]]*)\]<\/span>/g;
  for (const m of htmlText.matchAll(re)) found.push(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
  return found;
}

async function importFresh(rel) {
  return import(pathToFileURL(path.join(SRC, rel)).href);
}

// ------------------------------------------------------------------ build
async function build() {
  const t0 = Date.now();
  const { site, siteUrl } = await importFresh('config/site.config.mjs');
  const indexPage = await importFresh('pages/index.page.mjs');
  const secondary = await importFresh('pages/secondary.pages.mjs');

  const css = await bundleCss(path.join(SRC, 'styles/main.css'));
  const js = await bundleJs(path.join(SRC, 'scripts/main.js'));
  const cssHref = `assets/css/styles.css?v=${hash(css)}`;
  const jsSrc = `assets/js/app.js?v=${hash(js)}`;

  const pages = {
    'index.html': indexPage.render({ mode: 'site', cssHref, jsSrc }),
    'termos.html': secondary.renderTerms({ cssHref, jsSrc }),
    'privacidade.html': secondary.renderPrivacy({ cssHref, jsSrc }),
    '404.html': secondary.renderNotFound({ cssHref, jsSrc }),
  };

  // relatório de placeholders
  const report = [];
  const listed = new Set();
  for (const [name, htmlText] of Object.entries(pages)) {
    if (name === '404.html') continue;
    const list = [...new Set(extractPlaceholders(htmlText))].filter((t) => !listed.has(t));
    list.forEach((t) => listed.add(t));
    if (list.length) report.push({ name, list });
  }
  const warnings = [];
  if (!site.url) warnings.push('site.url vazio → sem link canônico e sem sitemap.xml (src/config/site.config.mjs)');
  else if (/^http:\/\//i.test(site.url.trim())) warnings.push(`site.url começa com http:// → usei ${siteUrl()} nas páginas. Corrija em src/config/site.config.mjs`);
  const waDigits = String(site.contact.whatsapp || '').replace(/\D+/g, '');
  if (!waDigits) warnings.push('WhatsApp vazio → os botões "Quero me agenciar", "Quero fazer parte" e "Falar com o suporte" ficam sem destino (contact.whatsapp)');
  else if (!/^55\d{10,11}$/.test(waDigits)) warnings.push(`WhatsApp "${site.contact.whatsapp}" fora do formato 55 + DDD + número (ex.: 5575999999999)`);

  const total = report.reduce((n, r) => n + r.list.length, 0);
  console.log(c.bold('\nPATOX LIVE'));
  if (total || warnings.length) {
    console.log(c.yellow(`\n⚠  ${total} placeholder(s) ainda sem informação real:`));
    for (const r of report) {
      console.log(c.dim(`   ${r.name}`));
      for (const item of r.list) console.log(`     • ${item}`);
    }
    if (warnings.length) {
      console.log(c.yellow('\n⚠  Configurações pendentes:'));
      for (const w of warnings) console.log(`   • ${w}`);
    }
  }
  if (REPORT_ONLY) return;

  async function writeSite(outDir) {
    await rm(outDir, { recursive: true, force: true });
    await mkdir(path.join(outDir, 'assets/css'), { recursive: true });
    await mkdir(path.join(outDir, 'assets/js'), { recursive: true });
    await writeFile(path.join(outDir, 'assets/css/styles.css'), css);
    await writeFile(path.join(outDir, 'assets/js/app.js'), js);
    await copyDir(path.join(SRC, 'assets/images'), path.join(outDir, 'assets/images'));
    await copyDir(path.join(SRC, 'public'), outDir); // .htaccess, _headers, vercel.json, .nojekyll
    for (const [name, htmlText] of Object.entries(pages)) {
      await writeFile(path.join(outDir, name), htmlText);
    }
    const base = siteUrl();
    const robots = base ? `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n';
    await writeFile(path.join(outDir, 'robots.txt'), robots);
    if (base) {
      const urls = ['', 'termos.html', 'privacidade.html']
        .map((p) => `  <url><loc>${base}/${p}</loc></url>`)
        .join('\n');
      await writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    }
  }

  await writeSite(path.join(ROOT, 'dist'));
  if (PREVIEW) await writePreview(path.join(ROOT, 'dist-preview'));

  /** Prévia autocontida (usada na página publicada): CSS e JS dentro de cada HTML, imagens ao lado. */
  async function writePreview(outDir) {
    const MARK_CSS = '__PATOX_CSS__';
    const MARK_JS = '__PATOX_JS__';
    const inline = (htmlText) => {
      const withCss = htmlText.replace(`<link rel="stylesheet" href="${MARK_CSS}">`, () => `<style>\n${css}</style>`);
      return withCss.replace(`<script src="${MARK_JS}" defer></script>`, () => `<script>\n${js.replace(/<\/script/gi, '<\\/script')}</script>`);
    };
    const opts = { cssHref: MARK_CSS, jsSrc: MARK_JS };
    const previewPages = {
      'index.html': indexPage.render({ mode: 'embed', ...opts }),
      'termos.html': secondary.renderTerms(opts),
      'privacidade.html': secondary.renderPrivacy(opts),
    };
    await rm(outDir, { recursive: true, force: true });
    await copyDir(path.join(SRC, 'assets/images'), path.join(outDir, 'assets/images'));
    for (const [name, htmlText] of Object.entries(previewPages)) {
      const out = inline(htmlText);
      if (out.includes(MARK_CSS) || out.includes(MARK_JS)) throw new Error(`Prévia: não consegui embutir CSS/JS em ${name}`);
      await writeFile(path.join(outDir, name), out);
    }
    console.log(c.dim('   prévia autocontida em dist-preview/'));
  }

  const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB';
  console.log(c.green(`\n✓ Site gerado em dist/ (${Date.now() - t0} ms)`));
  console.log(c.dim(`   CSS ${kb(css)} · JS ${kb(js)} · HTML ${kb(pages['index.html'])}`));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
