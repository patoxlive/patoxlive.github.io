/**
 * ============================================================
 *  PATOX LIVE — TEXTOS DA PÁGINA INICIAL
 * ============================================================
 *  Cada bloco corresponde a uma seção do site, na ordem em que
 *  aparecem. Edite os textos livremente.
 *
 *  Contatos, horário, tempo de resposta e mensagens do WhatsApp
 *  ficam em src/config/site.config.mjs (são usados aqui).
 *
 *  Botões com `whatsapp: '...'` abrem o WhatsApp com a mensagem
 *  pronta daquele assunto (agenciamento, ninhada, suporte).
 *  Botões com `href: '#agenciamento'` rolam a página até a seção
 *  "Agenciamento pelo WhatsApp" (é lá que fica o botão do WhatsApp).
 *
 *  ph('...') = PLACEHOLDER: informação real que ainda falta.
 *  Troque por um texto normal entre aspas quando tiver o dado.
 *
 *  REGRA DA MARCA: não publique números, resultados, prêmios,
 *  parceiros, depoimentos ou promessas de ganhos que não sejam reais.
 * ============================================================
 */
import { ph } from '../lib/placeholder.mjs';
import { site, cap } from '../config/site.config.mjs';

const { contact } = site;

/** Equipe (aparece no "Sobre" e como responsável de cada benefício).
 *  tone: cor do ovinho (1 a 5, tons da ninhada). */
export const team = [
  { name: 'Fabrício', role: 'Diretor', tone: 5 },
  { name: 'Gabriel', role: 'Recrutamento e streamers', tone: 1 },
  { name: 'Afonso', role: 'Mídias sociais e comunidade', tone: 2 },
];

export const home = {
  hero: {
    kicker: 'Agência de TikTok LIVE',
    title: 'Hora de sair da casca',
    tagline: 'Seu LIVE. Seu público. Sua evolução.',
    lead: 'A PATOX LIVE é uma agência especializada em TikTok LIVE para streamers e criadores que querem começar ou evoluir no ao vivo.',
    primary: { label: 'Quero me agenciar', note: 'Para streamers e criadores', href: '#agenciamento' },
    secondary: { label: 'Quero fazer parte da ninhada', note: 'Para quem quer recrutar talentos', whatsapp: 'ninhada' },
    contactLine: `Atendimento pelo WhatsApp ${contact.hours}. Tempo médio de resposta: ${contact.responseTime}.`,
    imageAlt: 'Pato da PATOX LIVE, de moletom roxo, saindo de um ovo',
    liveBadge: 'LIVE',
  },

  journeys: {
    title: 'Dois caminhos. Uma ninhada.',
    lead: 'Escolha o caminho que combina com o seu objetivo.',
    streamer: {
      tag: 'Para streamers e criadores',
      title: 'Quero entrar para a agência',
      text: 'Você já faz LIVE no TikTok, ou quer começar, e quer fazer parte da PATOX LIVE.',
      next: 'Você chama a equipe no WhatsApp e ela conhece o seu perfil.',
      cta: { label: 'Quero me agenciar', href: '#agenciamento' },
    },
    recruiter: {
      tag: 'Para recrutadores e parceiros',
      title: 'Quero recrutar novos talentos',
      text: 'Você quer participar do processo de recrutamento e das parcerias da PATOX LIVE.',
      next: 'Você chama a equipe no WhatsApp e conversa sobre o recrutamento.',
      cta: { label: 'Quero fazer parte da ninhada', whatsapp: 'ninhada' },
    },
  },

  about: {
    title: 'Sobre a PATOX LIVE',
    proposalLabel: 'Nossa proposta',
    proposal: [
      'Existe um potencial dentro de cada ovo.',
      'A PATOX ajuda esse talento a começar sua jornada.',
      'Ao entrar, você passa a fazer parte da ninhada.',
    ],
    items: [
      {
        title: 'Quem somos',
        text: `A PATOX LIVE é uma agência especializada em TikTok LIVE. A ideia nasceu em 1º de setembro de 2026 e hoje atuamos do nosso escritório em ${contact.city}, na ${contact.state}.`,
      },
      {
        title: 'O que fazemos',
        text: 'Trabalhamos com criadores de TikTok LIVE e com o recrutamento de novos talentos.',
      },
      {
        title: 'Para quem trabalhamos',
        text: 'Para streamers e criadores que já fazem LIVE ou querem começar, e para quem quer atuar no recrutamento de novos talentos.',
      },
    ],
    teamTitle: 'Quem faz a PATOX LIVE',
  },

  benefits: {
    title: 'O que você encontra na PATOX LIVE',
    lead: 'Cada benefício tem alguém da equipe por trás, do primeiro treinamento ao dia a dia das suas LIVEs.',
    ownerPrefix: 'Com',
    teamOwnerLabel: 'Com a equipe PATOX LIVE',
    /** icon: headset | chart | cap | nest | spark
     *  owner: nome de alguém da equipe (lista `team` acima) ou 'equipe' (a equipe PATOX LIVE toda) */
    items: [
      {
        icon: 'headset',
        title: 'Suporte',
        text: 'Teve algum problema nas suas LIVEs? O suporte resolve com você. Recrutadores também tiram suas dúvidas por aqui.',
        owner: 'equipe',
      },
      {
        icon: 'chart',
        title: 'Acompanhamento',
        text: 'Sua trajetória como streamer é acompanhada de perto, com reuniões para melhorar suas LIVEs sempre que surgir uma dúvida.',
        owner: 'Fabrício',
      },
      {
        icon: 'cap',
        title: 'Treinamento',
        text: 'Um treinamento rápido para você começar com o pé direito, seja como streamer ou como recrutador.',
        owner: 'Gabriel',
      },
      {
        icon: 'nest',
        title: 'Comunidade',
        text: 'Comunidades no Instagram e no WhatsApp para streamers e recrutadores. É lá que saem os avisos e os eventos.',
        owner: 'Afonso',
      },
    ],
  },

  howItWorks: {
    title: 'Como funciona',
    lead: 'Quatro passos entre o primeiro contato e o começo da sua jornada.',
    steps: [
      { title: 'Você entra em contato', text: 'Use o botão “Quero me agenciar” e chame a PATOX LIVE no WhatsApp.' },
      {
        title: 'Conhecemos seu perfil',
        text: 'A equipe conversa com você e conhece seu perfil e suas LIVEs.',
        note: `Tempo médio de resposta: ${contact.responseTime}. Atendimento ${contact.hours}.`,
      },
      { title: 'Você entra para a PATOX LIVE', text: 'Com tudo alinhado, você passa a fazer parte da ninhada.' },
      { title: 'Começa sua jornada', text: 'Você faz um treinamento rápido para começar e conta com o acompanhamento da equipe.' },
    ],
  },

  liveCheck: {
    title: 'Você já faz LIVE?',
    text: 'Então você já conhece a energia do ao vivo. Agora você pode levar esse talento para a PATOX LIVE e fazer parte da ninhada.',
    listTitle: 'Na conversa pelo WhatsApp, conte:',
    list: [
      'Seu @ no TikTok',
      'Com que frequência você faz LIVE',
      'A média de espectadores das suas LIVEs',
      'Seu número de seguidores',
    ],
    beginner: 'Ainda não faz LIVE? Pode chamar também. É só contar isso na conversa.',
    cta: { label: 'Quero me agenciar', href: '#agenciamento' },
  },

  egg: {
    closed: {
      title: 'Tem um talento aí dentro.',
      text: 'Todo criador começa assim. Abra o ovo para ver o próximo passo.',
    },
    open: {
      title: 'Pronto para começar?',
      text: 'O próximo passo é chamar a PATOX LIVE no WhatsApp.',
    },
    hint: { word: 'Descubra.', pointer: 'Clique no ovo', touch: 'Toque no ovo' },
    eggLabel: 'Abrir o ovo e descobrir o próximo passo',
    cta: { label: 'Quero me agenciar', href: '#agenciamento' },
    replay: 'Ver de novo',
    status: 'O ovo abriu. Pronto para começar? Use o botão Quero me agenciar para ir ao agenciamento pelo WhatsApp.',
    imageAlt: 'Pato da PATOX LIVE saindo do ovo',
  },

  /** Seção de agenciamento: contato direto pelo WhatsApp */
  apply: {
    title: 'Agenciamento pelo WhatsApp',
    text: 'Quer entrar para a PATOX LIVE? Chame a equipe no WhatsApp e conte um pouco sobre você e suas LIVEs.',
    facts: [
      { icon: 'bolt', label: 'Tempo médio de resposta', value: cap(contact.responseTime) },
      { icon: 'clock', label: 'Horário de atendimento', value: cap(contact.hours) },
    ],
    chat: {
      status: `Costuma responder em ${contact.responseTime}`,
      label: 'Sua mensagem já vai pronta:',
      note: 'Abre o WhatsApp no celular ou no computador.',
    },
    cta: { label: 'Entrar em contato pelo WhatsApp', whatsapp: 'agenciamento' },
    helpText: 'Ficou com alguma dúvida?',
    helpLink: { label: 'Fale com o suporte', href: '#suporte' },
  },

  recruit: {
    title: 'Faça parte da ninhada',
    text: 'A PATOX LIVE também abre espaço para quem quer atuar no recrutamento de novos talentos e em parcerias com a agência.',
    whoTitle: 'Quem pode participar',
    groups: [
      {
        title: 'Streamers',
        text: 'Quem já tem 2 horas ou mais de LIVE feitas e 1.000 seguidores pode entrar para a equipe da PATOX LIVE. Você não perde nada do que ganha nas LIVEs: continua recebendo a sua porcentagem normalmente. A agência está aqui apenas para ajudar você a crescer.',
        cta: { label: 'Quero me agenciar', href: '#agenciamento' },
      },
      {
        title: 'Recrutadores',
        text: 'Quer fazer uma renda extra e está cansado de só ficar vendo vídeos no TikTok? Que tal usar o app para ganhar dinheiro? Recrutando streamers para a PATOX LIVE, você ganha uma bonificação a cada streamer recrutado.',
      },
    ],
    items: [
      {
        title: 'Como funciona o recrutamento',
        text: 'Quando você encontra alguém com potencial fazendo LIVE no TikTok, interage com a pessoa e, depois, apresenta a PATOX LIVE e faz o convite para a equipe.',
      },
      {
        title: 'O que a PATOX oferece',
        list: [
          'Suporte para recrutadores',
          'Suporte para streamers',
          'Ranking diário da agência, todos os dias às 19h, para recrutadores e streamers',
          'Comunidade no Instagram e no WhatsApp para criadores de conteúdo, onde saem os avisos',
          'Treinamento para streamers e recrutadores, para você aprender a ganhar dinheiro fazendo LIVE ou recrutando para a agência',
        ],
      },
    ],
    cta: { label: 'Quero fazer parte', whatsapp: 'ninhada' },
    imageAlt: 'Pato da PATOX LIVE sentado no topo de um ninho cheio de ovos',
  },

  support: {
    title: 'Precisou de ajuda?',
    text: 'Dúvidas sobre suas LIVEs, a agência ou o recrutamento? Quem cuida do suporte é a nossa equipe PATOX LIVE, e ela está na escuta.',
    windowTitle: 'Suporte PATOX LIVE',
    windowStatus: 'Todos os dias, 8h às 19h',
    channels: {
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      hours: 'Horário de atendimento',
    },
    cta: { label: 'Falar com o suporte', whatsapp: 'suporte' },
    imageAlt: 'Pato da PATOX LIVE usando fone com microfone, pronto para atender',
  },

  finalCta: {
    title: 'Venha fazer parte da ninhada.',
    text: 'O próximo ovo a abrir pode ser o seu.',
    cta: 'Quero fazer parte',
    choicesTitle: 'Como você quer fazer parte?',
    choices: [
      { who: 'Sou streamer ou criador(a)', label: 'Quero me agenciar', href: '#agenciamento' },
      { who: 'Quero atuar no recrutamento', label: 'Quero fazer parte da ninhada', whatsapp: 'ninhada' },
    ],
    imageAlt: 'Pato da PATOX LIVE no topo de uma pilha de ovos',
  },

  footer: {
    tagline: 'Agência de TikTok LIVE.',
    location: `${contact.city}, ${contact.state}, ${contact.country}`,
    navTitle: 'Navegação',
    nav: [
      { label: 'Início', href: '#inicio' },
      { label: 'Sobre', href: '#sobre' },
      { label: 'Como funciona', href: '#como-funciona' },
      { label: 'Agenciamento', href: '#agenciamento' },
      { label: 'Recrutamento', href: '#recrutamento' },
      { label: 'Suporte', href: '#suporte' },
    ],
    contactTitle: 'Contato',
    socialTitle: 'Redes sociais',
    terms: 'Termos de uso',
    privacy: 'Política de privacidade',
    rights: 'Todos os direitos reservados.',
    companyMissing: ph('Razão social e CNPJ'),
    disclaimer: ph('Se aplicável: informe o vínculo da PATOX LIVE com o programa de agências do TikTok LIVE'),
  },

  mobileBar: { label: 'Quero me agenciar', href: '#agenciamento' },
  skipLink: 'Pular para o conteúdo',
  menu: { open: 'Abrir menu', close: 'Fechar menu', cta: 'Quero me agenciar' },
};
