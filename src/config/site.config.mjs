/**
 * ============================================================
 *  PATOX LIVE — CONFIGURAÇÕES GERAIS
 * ============================================================
 *  Aqui ficam as informações da empresa, contatos, WhatsApp,
 *  redes sociais, SEO e imagens. Textos das seções ficam em
 *  src/content/home.content.mjs. Cores e fontes ficam em
 *  src/styles/tokens.css.
 *
 *  Campos vazios ('') aparecem no site como [PLACEHOLDER] ou
 *  são omitidos com segurança. Rode `npm run placeholders` para
 *  ver o que ainda falta preencher.
 * ============================================================
 */

export const site = {
  name: 'PATOX LIVE',
  description: 'Agência de TikTok LIVE',

  /** Domínio final, COM https:// e sem barra no fim. Ex.: 'https://www.seudominio.com.br'
   *  Usado no link canônico, no sitemap e nas prévias de compartilhamento.
   *  (Se escrever http://, o build troca por https:// e avisa.) */
  url: 'https://patoxlive.github.io',

  lang: 'pt-BR',
  locale: 'pt_BR',
  themeColor: '#1D0C30',

  /** Caminho onde o site fica no servidor. Use '/' na raiz do domínio
   *  ou '/pasta/' se o site ficar numa subpasta. (Usado pela página 404.) */
  basePath: '/',

  seo: {
    title: 'PATOX LIVE | Agência de TikTok LIVE para streamers e criadores',
    description:
      'A PATOX LIVE é uma agência especializada em TikTok LIVE para streamers e criadores. Fale com a equipe no WhatsApp para se agenciar ou para entrar no recrutamento de novos talentos.',
    ogImage: 'assets/images/og-image.jpg',
    ogImageAlt: 'Pato da PATOX LIVE, de moletom roxo, ao lado da marca Patox LIVE',
  },

  /** Contatos exibidos no site (suporte, rodapé, páginas legais). */
  contact: {
    /** WhatsApp: só números, com DDI 55 + DDD + número. */
    whatsapp: '5575983383718',
    /** Como o número aparece escrito no site */
    whatsappLabel: '(75) 98338-3718',
    email: 'patoxlive7@gmail.com',
    /** Horário de atendimento (em minúsculas: é usado no meio de frases) */
    hours: 'todos os dias, das 8h às 19h',
    /** Tempo médio de resposta no WhatsApp */
    responseTime: '5 a 10 minutos',
    /** Onde a empresa atua */
    city: 'Mutuípe',
    state: 'Bahia',
    stateCode: 'BA',
    country: 'Brasil',
  },

  /**
   * MENSAGENS PRONTAS DO WHATSAPP
   * Cada botão abre o WhatsApp com uma destas mensagens já escrita
   * (a pessoa pode editar antes de enviar).
   *   agenciamento → "Entrar em contato pelo WhatsApp" (seção Agenciamento pelo WhatsApp;
   *                  os botões "Quero me agenciar" rolam a página até essa seção)
   *   ninhada      → "Quero fazer parte da ninhada" / "Quero fazer parte" (recrutamento)
   *   suporte      → "Falar com o suporte"
   *   contato      → link do WhatsApp no rodapé
   */
  whatsappMessages: {
    agenciamento: 'Olá, PATOX LIVE! Vim pelo site e quero me agenciar. Meu @ no TikTok é: ',
    ninhada: 'Olá, PATOX LIVE! Vim pelo site e quero fazer parte da ninhada como recrutador(a).',
    suporte: 'Olá, PATOX LIVE! Preciso de ajuda com: ',
    contato: 'Olá, PATOX LIVE! Vim pelo site e gostaria de falar com a equipe.',
  },

  /** Redes sociais. Itens sem url aparecem como placeholder. */
  social: [
    { label: 'Instagram', handle: '@patoxlive', url: 'https://www.instagram.com/patoxlive/' },
    { label: 'TikTok', handle: '@patoxlivebr', url: 'https://www.tiktok.com/@patoxlivebr' },
  ],

  /** Dados legais exibidos no rodapé e nas páginas de termos/privacidade. */
  legal: {
    companyName: '', // Razão social
    cnpj: '69.454.438/0001-46',
  },

  /** Imagens oficiais da marca. Para trocar, substitua os arquivos em
   *  src/assets/images/ mantendo os nomes (ou ajuste os caminhos aqui). */
  images: {
    wordmark: { src: 'patox-marca-240.webp', src2x: 'patox-marca-462.webp', width: 462, height: 138 },
    wordmarkLight: { src: 'patox-marca-clara-240.webp', src2x: 'patox-marca-clara-462.webp', width: 462, height: 138 },
    avatar: { src: 'pato-avatar-96.webp', src2x: 'pato-avatar-192.webp', width: 96, height: 96 },
    hero: { base: 'pato-hero', widths: [400, 561], width: 561, height: 606 },
    eggOpen: { base: 'pato-ovo-aberto', widths: [600, 900, 1179], width: 1179, height: 1428 },
    support: { base: 'pato-suporte', widths: [520, 800, 1051], width: 1051, height: 1008 },
    nest: { base: 'pato-ninhada', widths: [520, 800, 1179], width: 1179, height: 1143 },
    nestCutout: { base: 'pato-ninhada-recorte', widths: [600, 900, 1179], width: 1179, height: 1143 },
  },

  /** Menu do topo (âncoras das seções da página inicial) */
  nav: [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Recrutamento', href: '#recrutamento' },
    { label: 'Suporte', href: '#suporte' },
  ],

  /** Páginas legais */
  pages: {
    terms: 'termos.html',
    privacy: 'privacidade.html',
  },
};

/** Endereço do site sempre em https://, sem barra no fim ('' se ainda não configurado). */
export function siteUrl() {
  if (!site.url) return '';
  return site.url.trim().replace(/^http:\/\//i, 'https://').replace(/\/+$/, '');
}

/** Link do WhatsApp com a mensagem pronta do assunto (agenciamento, ninhada, suporte, contato). */
export function whatsappLink(topic = 'contato') {
  const number = String(site.contact.whatsapp || '').replace(/\D+/g, '');
  if (!number) return null;
  const message = site.whatsappMessages[topic];
  if (message === undefined) throw new Error(`Mensagem de WhatsApp desconhecida: "${topic}" (veja site.whatsappMessages)`);
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** Primeira letra maiúscula (para usar textos como "das 8h às 19h" no começo de frase). */
export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
