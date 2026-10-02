/**
 * Placeholders — textos que ainda precisam de informação REAL da PATOX LIVE.
 *
 * Uso nos arquivos de conteúdo/configuração:
 *   ph('Conte a história da agência')
 *
 * No site, aparecem destacados em amarelo, entre colchetes.
 * Para publicar a versão final, troque cada ph('...') por um texto normal:
 *   'A PATOX LIVE nasceu em ...'
 *
 * Rode `npm run placeholders` para listar todos os que ainda faltam.
 */
export function ph(text) {
  return { __placeholder: true, text: String(text) };
}

export function isPlaceholder(value) {
  return Boolean(value && typeof value === 'object' && value.__placeholder === true);
}

/** Percorre um objeto e devolve [{ path, text }] de todos os placeholders. */
export function collectPlaceholders(value, path = '', out = []) {
  if (isPlaceholder(value)) {
    out.push({ path, text: value.text });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectPlaceholders(item, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collectPlaceholders(item, path ? `${path}.${key}` : key, out);
    }
  }
  return out;
}
