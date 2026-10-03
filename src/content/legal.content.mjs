/**
 * ============================================================
 *  PATOX LIVE — TERMOS DE USO E POLÍTICA DE PRIVACIDADE
 * ============================================================
 *  Textos das páginas legais. Contatos, cidade e dados da empresa
 *  vêm de src/config/site.config.mjs.
 *
 *  Cada seção tem `title` e `body` (lista de blocos):
 *    'texto'                 → parágrafo
 *    ['texto ', ph('...')]   → parágrafo com partes (texto + placeholder ou link)
 *    { list: [...] }         → lista com marcadores
 *
 *  Ao mudar estas regras, atualize também `updatedAt`.
 *  Recomendação: peça para um(a) advogado(a) revisar antes de publicar.
 * ============================================================
 */
import { ph } from '../lib/placeholder.mjs';
import { html } from '../lib/html.mjs';
import { site } from '../config/site.config.mjs';

const { contact, legal: company } = site;

const cnpj = company.cnpj || ph('CNPJ');
const place = `${contact.city}, ${contact.state}, ${contact.country}`;
/** Sede registrada (endereço do contador). A equipe trabalha no escritório de `place`. */
const seat = company.registeredCity ? `${company.registeredCity} (${company.registeredStateCode})` : ph('cidade da sede registrada');
const email = html`<a href="mailto:${contact.email}">${contact.email}</a>`;
const privacyLink = html`<a href="${site.pages.privacy}">Política de privacidade</a>`;
const termsLink = html`<a href="${site.pages.terms}">Termos de uso</a>`;

const contactList = {
  list: [
    ['E-mail: ', email],
    `WhatsApp: ${contact.whatsappLabel}`,
    `Horário de atendimento: ${contact.hours}`,
  ],
};

export const legal = {
  updatedLabel: 'Última atualização:',
  updatedAt: '3 de outubro de 2026',
  back: 'Voltar para o início',
  tocTitle: 'Nesta página',
  summaryTitle: 'Em resumo',

  terms: {
    slug: 'termos',
    title: 'Termos de uso',
    description: 'Regras de uso do site da PATOX LIVE, agência de TikTok LIVE.',
    intro: [
      'Estes Termos de uso explicam as regras para usar o site da PATOX LIVE. Ao navegar pelo site ou falar com a gente pelos canais indicados aqui, você concorda com estas regras. Leia também a nossa ',
      privacyLink,
      '.',
    ],
    sections: [
      {
        id: 'quem-somos',
        title: 'Quem somos',
        body: [
          ['A PATOX LIVE é uma agência especializada em TikTok LIVE, inscrita no CNPJ sob o nº ', cnpj, '. A empresa tem sede registrada em ', seat, ', e a equipe trabalha no nosso escritório em ', place, '.'],
          'TikTok, Instagram e WhatsApp são marcas de seus respectivos titulares. A PATOX LIVE é uma empresa independente e não fala em nome dessas plataformas.',
        ],
      },
      {
        id: 'o-site',
        title: 'Para que serve o site',
        body: [
          'O site apresenta a PATOX LIVE e as duas formas de fazer parte da agência: como streamer (agenciamento) ou como recrutador(a) (ninhada).',
          'O site não tem área de login nem formulários. O contato acontece pelo WhatsApp, pelo e-mail ou pelas redes sociais da agência.',
        ],
      },
      {
        id: 'contato',
        title: 'Contato pelo WhatsApp e por outros canais',
        body: [
          'Os botões do site abrem uma conversa com a PATOX LIVE no WhatsApp, já com uma mensagem pronta, que você pode editar antes de enviar.',
          `O atendimento funciona ${contact.hours}. Nesse horário, o tempo médio de resposta é de ${contact.responseTime}, podendo variar conforme a demanda.`,
          'WhatsApp, Instagram e TikTok são serviços de outras empresas, com termos e políticas de privacidade próprios.',
        ],
      },
      {
        id: 'agenciamento-e-recrutamento',
        title: 'Agenciamento e recrutamento',
        body: [
          {
            list: [
              'Entrar em contato não garante a entrada na agência. A equipe conversa com você, conhece seu perfil e informa os próximos passos.',
              'As condições de cada parceria, como regras, responsabilidades e forma de participação, são combinadas diretamente com a equipe da PATOX LIVE antes de você começar.',
              'Os ganhos de streamers e recrutadores dependem do desempenho de cada pessoa e das regras do TikTok. A PATOX LIVE não garante valores nem resultados.',
              'Para fazer LIVE, é preciso cumprir os requisitos do TikTok, incluindo a idade mínima exigida pela plataforma.',
            ],
          },
        ],
      },
      {
        id: 'regras-do-tiktok',
        title: 'Regras do TikTok',
        body: [
          'Streamers e recrutadores devem seguir os Termos de Serviço e as Diretrizes da Comunidade do TikTok. A PATOX LIVE não controla as decisões da plataforma, como mudanças de regras e de recursos, restrições ou suspensões de contas.',
        ],
      },
      {
        id: 'comunidades-e-ranking',
        title: 'Comunidades e ranking',
        body: [
          'Streamers e recrutadores podem participar das comunidades da PATOX LIVE no Instagram e no WhatsApp, onde são divulgados os avisos, os eventos e o ranking diário da agência (todos os dias às 19h).',
          'Nas comunidades, trate todos com respeito. A PATOX LIVE pode remover quem publicar conteúdo ofensivo, discriminatório, enganoso ou que desrespeite estas regras.',
        ],
      },
      {
        id: 'uso-do-site',
        title: 'Uso do site',
        body: [
          'Ao usar o site, você se compromete a não:',
          {
            list: [
              'usar o site para fins ilegais ou para enganar outras pessoas;',
              'se passar pela PATOX LIVE ou por alguém da equipe;',
              'tentar acessar, alterar ou prejudicar o funcionamento do site;',
              'copiar o conteúdo do site para fins comerciais sem autorização.',
            ],
          },
        ],
      },
      {
        id: 'marca-e-conteudo',
        title: 'Marca e conteúdo',
        body: [
          'A marca PATOX LIVE, o personagem do pato, as ilustrações, os textos e o visual do site pertencem à PATOX LIVE e são protegidos pela legislação brasileira de direitos autorais e de propriedade intelectual. Não é permitido usar esse material sem autorização por escrito.',
        ],
      },
      {
        id: 'links-externos',
        title: 'Links para outros sites',
        body: [
          'O site tem links para serviços de outras empresas, como WhatsApp, Instagram e TikTok. A PATOX LIVE não é responsável pelo conteúdo, pela disponibilidade nem pelas práticas de privacidade desses serviços.',
        ],
      },
      {
        id: 'responsabilidade',
        title: 'Disponibilidade e responsabilidade',
        body: [
          'Trabalhamos para manter o site no ar e as informações atualizadas, mas ele pode ficar indisponível por manutenção ou por problemas técnicos.',
          'As informações do site são gerais e não substituem as condições combinadas diretamente com a equipe da PATOX LIVE.',
        ],
      },
      {
        id: 'privacidade',
        title: 'Privacidade',
        body: [['O tratamento dos seus dados pessoais é explicado na nossa ', privacyLink, '.']],
      },
      {
        id: 'alteracoes',
        title: 'Alterações destes Termos',
        body: [
          'Podemos atualizar estes Termos a qualquer momento. A versão em vigor é sempre a publicada nesta página, com a data da última atualização.',
        ],
      },
      {
        id: 'lei-e-foro',
        title: 'Lei aplicável e foro',
        body: [
          'Estes Termos seguem as leis do Brasil. Eventuais conflitos serão resolvidos no foro do domicílio do usuário, conforme a legislação de defesa do consumidor.',
        ],
      },
      {
        id: 'fale-conosco',
        title: 'Fale com a gente',
        body: ['Dúvidas sobre estes Termos? Fale com a PATOX LIVE:', contactList],
      },
    ],
  },

  privacy: {
    slug: 'privacidade',
    title: 'Política de privacidade',
    description: 'Como a PATOX LIVE trata os dados pessoais de quem visita o site e de quem entra em contato com a agência.',
    intro: [
      'Esta Política explica como a PATOX LIVE trata os dados pessoais de quem visita o site e de quem fala com a agência, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD) e o Marco Civil da Internet (Lei nº 12.965/2014). Veja também os nossos ',
      termsLink,
      '.',
    ],
    summary: [
      'O site não tem formulários e não usa cookies próprios nem ferramentas de rastreamento ou de anúncios.',
      'Seus dados chegam até nós quando você fala com a PATOX LIVE pelo WhatsApp, por e-mail ou pelas redes sociais.',
      'Usamos esses dados para responder, conhecer seu perfil e, se houver parceria, acompanhar seu trabalho na agência.',
      'Não vendemos seus dados.',
      'Você pode pedir acesso, correção ou exclusão dos seus dados quando quiser.',
    ],
    sections: [
      {
        id: 'responsavel',
        title: 'Quem é responsável pelos seus dados',
        body: [
          ['A responsável pelo tratamento dos dados (controladora) é a PATOX LIVE, agência de TikTok LIVE inscrita no CNPJ sob o nº ', cnpj, ', com sede registrada em ', seat, ' e escritório em ', place, '.'],
          ['Contato para assuntos de privacidade: ', email, '.'],
        ],
      },
      {
        id: 'dados',
        title: 'Quais dados tratamos',
        body: [
          {
            list: [
              'Quando você visita o site: dados técnicos de acesso, como endereço IP, data e hora, páginas acessadas e tipo de navegador e de aparelho. Esses dados são registrados automaticamente pelo servidor de hospedagem.',
              'Quando você fala com a PATOX LIVE (WhatsApp, e-mail ou redes sociais): nome, número de telefone, e-mail, seu @ no TikTok e em outras redes, cidade, informações sobre suas LIVEs (como frequência, número de seguidores e média de espectadores) e qualquer outra informação que você decidir compartilhar.',
              'Se você entrar para a agência ou para a ninhada: os dados necessários para a parceria, como informações sobre seu desempenho nas LIVEs ou no recrutamento e sua participação no ranking diário e nas comunidades da agência.',
            ],
          },
          'Não pedimos dados pessoais sensíveis, como origem racial ou étnica, religião, opinião política, saúde ou vida sexual. Por favor, não envie esse tipo de informação.',
        ],
      },
      {
        id: 'finalidades',
        title: 'Para que usamos os dados',
        body: [
          'Cada uso tem uma base legal prevista no art. 7º da LGPD:',
          {
            list: [
              'Responder às suas mensagens e tirar dúvidas: legítimo interesse (inciso IX).',
              'Conhecer seu perfil e avaliar uma possível parceria como streamer ou recrutador(a), a seu pedido: procedimentos preliminares a um contrato (inciso V).',
              'Treinar, acompanhar e dar suporte a quem faz parte da agência: execução de contrato (inciso V).',
              'Divulgar avisos, eventos e o ranking diário nas comunidades da agência: execução do contrato de parceria ou, quando for o caso, o seu consentimento (incisos V e I).',
              'Guardar os registros de acesso ao site: cumprimento de obrigação legal (inciso II e art. 15 do Marco Civil da Internet).',
              'Defender os direitos da PATOX LIVE em processos ou reclamações: exercício regular de direitos (inciso VI).',
            ],
          },
        ],
      },
      {
        id: 'compartilhamento',
        title: 'Com quem compartilhamos',
        body: [
          'A PATOX LIVE não vende nem aluga dados pessoais. Os dados podem ser compartilhados apenas com:',
          {
            list: [
              'plataformas usadas no contato e na parceria, como WhatsApp e Instagram (Meta) e TikTok, que tratam os dados de acordo com as próprias políticas de privacidade;',
              'a empresa de hospedagem do site, que registra os dados técnicos de acesso;',
              'o Google, que entrega as fontes (tipos de letra) usadas no site e, para isso, recebe o endereço IP de quem visita;',
              'autoridades públicas, quando houver obrigação legal ou ordem judicial.',
            ],
          },
        ],
      },
      {
        id: 'transferencia-internacional',
        title: 'Transferência internacional',
        body: [
          'Alguns desses serviços, como WhatsApp, Instagram, TikTok e Google, podem armazenar ou tratar dados fora do Brasil. Nesses casos, a transferência acontece nas hipóteses permitidas pelo art. 33 da LGPD.',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies',
        body: [
          'O site não usa cookies próprios nem ferramentas de análise de audiência ou de publicidade. Se isso mudar, esta Política será atualizada para informar quais ferramentas são usadas e para quê.',
        ],
      },
      {
        id: 'retencao',
        title: 'Por quanto tempo guardamos os dados',
        body: [
          {
            list: [
              'Registros de acesso ao site: 6 meses, como exige o Marco Civil da Internet.',
              'Conversas e dados de contato: pelo tempo necessário para atender ao seu pedido ou, se houver parceria, enquanto ela durar.',
            ],
          },
          'Depois disso, os dados são excluídos ou anonimizados, exceto quando a lei exigir ou permitir guardá-los por mais tempo, por exemplo, para cumprir obrigações legais ou exercer direitos.',
        ],
      },
      {
        id: 'seguranca',
        title: 'Como protegemos os dados',
        body: [
          'O site usa conexão segura (HTTPS), e o acesso aos dados de contato fica restrito às pessoas da equipe que precisam deles para atender você.',
          'Nenhum sistema é totalmente imune a falhas. Se acontecer um incidente de segurança que possa trazer risco ou dano relevante a você, vamos avisar você e a Autoridade Nacional de Proteção de Dados (ANPD), como determina a LGPD.',
        ],
      },
      {
        id: 'direitos',
        title: 'Seus direitos',
        body: [
          'Pela LGPD (art. 18), você pode pedir a qualquer momento:',
          {
            list: [
              'a confirmação de que tratamos seus dados e o acesso a eles;',
              'a correção de dados incompletos, inexatos ou desatualizados;',
              'a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;',
              'a portabilidade dos dados para outro fornecedor de serviço;',
              'a eliminação dos dados tratados com o seu consentimento;',
              'a informação sobre com quem compartilhamos seus dados;',
              'a informação sobre a possibilidade de não dar consentimento e o que acontece nesse caso;',
              'a revogação do consentimento.',
            ],
          },
          ['Para exercer seus direitos, escreva para ', email, ` ou chame no WhatsApp ${contact.whatsappLabel}. Podemos pedir informações para confirmar sua identidade. Respondemos em até 15 dias.`],
          ['Você também pode apresentar reclamação à ANPD, em ', html`<a href="https://www.gov.br/anpd" target="_blank" rel="noopener">gov.br/anpd</a>`, '.'],
        ],
      },
      {
        id: 'menores',
        title: 'Menores de idade',
        body: [
          'Os serviços da PATOX LIVE são voltados a maiores de 18 anos. Se você tem menos de 18 anos, não envie dados pessoais sem a autorização dos seus pais ou responsáveis. Se percebermos que recebemos dados de um menor sem essa autorização, vamos excluí-los.',
        ],
      },
      {
        id: 'alteracoes',
        title: 'Alterações desta Política',
        body: [
          'Podemos atualizar esta Política para refletir mudanças no site, nos nossos serviços ou na lei. A versão em vigor é sempre a publicada nesta página, com a data da última atualização.',
        ],
      },
      {
        id: 'fale-conosco',
        title: 'Fale com a gente',
        body: ['Dúvidas sobre esta Política ou sobre seus dados? Fale com a PATOX LIVE:', contactList],
      },
    ],
  },

  notFound: {
    title: 'Esse ovo está vazio',
    text: 'A página que você procurou não existe ou mudou de endereço.',
    cta: 'Voltar para o início',
  },
};

