/**
 * Mini sistema de templates (sem dependências).
 *
 *   html`<p>${texto}</p>`  → escapa automaticamente o conteúdo interpolado
 *   raw('<b>ok</b>')      → insere HTML sem escapar (use só com conteúdo confiável)
 *
 * Valores aceitos na interpolação: string, número, array, html``, raw(), ph() e
 * null/undefined/false (ignorados).
 */
import { isPlaceholder } from './placeholder.mjs';

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

export function raw(value) {
  return new SafeHtml(String(value));
}

/** Placeholder visível: amarelo, entre colchetes, fácil de achar. */
export function renderPlaceholder(p) {
  return `<span class="ph" data-placeholder>[${escapeHtml(p.text)}]</span>`;
}

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  if (isPlaceholder(value)) return renderPlaceholder(value);
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = '';
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < values.length) out += render(values[i]);
  });
  return new SafeHtml(out);
}

/** Texto de conteúdo: string, ph() ou lista misturando os dois. */
export function text(value) {
  return new SafeHtml(render(value));
}

/** Monta atributos a partir de um objeto: { href: '#', hidden: true, 'data-x': 1 } */
export function attrs(obj = {}) {
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === false || value === null || value === undefined) continue;
    if (value === true) parts.push(key);
    else parts.push(`${key}="${escapeHtml(value)}"`);
  }
  return new SafeHtml(parts.length ? ' ' + parts.join(' ') : '');
}

/** Junta classes ignorando valores vazios. */
export function cls(...names) {
  return names.flat().filter(Boolean).join(' ');
}

/** Texto simples (sem HTML) — útil para atributos alt/aria-label/meta. */
export function plain(value) {
  if (value === null || value === undefined || value === false) return '';
  if (Array.isArray(value)) return value.map(plain).join('');
  if (isPlaceholder(value)) return `[${value.text}]`;
  return String(value);
}
