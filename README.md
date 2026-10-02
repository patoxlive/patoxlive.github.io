# PATOX LIVE — site

Site institucional da PATOX LIVE, agência de TikTok LIVE.
HTML, CSS e JavaScript puros: nenhum framework pesando no navegador e nenhuma dependência para instalar.

## Como usar

Requisito: [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm run dev           # abre em http://localhost:5173 e atualiza sozinho ao salvar
npm run build         # gera o site final na pasta dist/
npm run placeholders  # lista o que ainda falta preencher
```

**Publicar:** envie o conteúdo da pasta `dist/` para qualquer hospedagem de site estático (Hostinger, Netlify, Vercel, Cloudflare Pages, GitHub Pages…).
A pasta `dist/` deste pacote já está pronta.
Depois de mudar qualquer arquivo em `src/`, rode `npm run build` de novo.

## HTTPS (cadeado no navegador)

O site já vem preparado para funcionar só em HTTPS:

- Todos os links e recursos usam `https://`. O build avisa se algum endereço configurado usar `http://`.
- `site.url` é sempre convertido para `https://` no link canônico, no sitemap e nas prévias de compartilhamento.
- A pasta `dist/` inclui os arquivos de servidor que redirecionam `http://` para `https://` e ativam os cabeçalhos de segurança. Eles são gerados a partir de `src/public/`.

| Hospedagem | O que fazer |
|---|---|
| Hostinger, HostGator, Locaweb, KingHost e outras com cPanel (Apache/LiteSpeed) | 1. Ative o **SSL gratuito** no painel da hospedagem. 2. Envie todo o conteúdo de `dist/` para a pasta `public_html`. O arquivo `.htaccess` faz o redirecionamento para `https://` e ativa a segurança. |
| Netlify ou Cloudflare Pages | O HTTPS já é automático. Envie a pasta `dist/` (na Netlify, basta arrastar a pasta em app.netlify.com/drop). O arquivo `_headers` aplica a segurança. |
| Vercel | O HTTPS já é automático. O arquivo `vercel.json` aplica a segurança. |
| GitHub Pages | Endereços `*.github.io` já abrem só em HTTPS. Com domínio próprio, marque **Enforce HTTPS** em *Settings → Pages*. |

> O `.htaccess` começa com ponto, então alguns computadores escondem o arquivo. Ao enviar por FTP ou pelo gerenciador de arquivos, confira se ele foi junto.
> Só envie o `.htaccess` com o SSL já ativo: sem certificado, o redirecionamento para `https://` não abre.

## Onde editar cada coisa

| O que | Arquivo |
|---|---|
| Textos de todas as seções | `src/content/home.content.mjs` |
| Equipe (nomes e funções) | `team`, no começo de `src/content/home.content.mjs` |
| Termos de uso, privacidade e página 404 | `src/content/legal.content.mjs` |
| Nome, domínio, SEO, WhatsApp, e-mail, horário, tempo de resposta, redes sociais, menu | `src/config/site.config.mjs` |
| Mensagens prontas do WhatsApp | `whatsappMessages`, em `src/config/site.config.mjs` |
| Cores, fontes, espaçamentos | `src/styles/tokens.css` |
| Ordem das seções da página | `src/pages/index.page.mjs` |
| Imagens | `src/assets/images/` |

### Placeholders (informação real que falta)

Tudo o que não foi informado aparece no site **em amarelo, entre colchetes**, por exemplo `[Razão social e CNPJ]`.
Nos arquivos de conteúdo eles estão escritos assim:

```js
companyMissing: ph('Razão social e CNPJ'),
```

Para preencher, troque por um texto normal:

```js
companyMissing: 'Nome da Empresa Ltda. | CNPJ 00.000.000/0001-00',
```

A razão social e o CNPJ também podem ser preenchidos uma vez só em `site.legal` (`src/config/site.config.mjs`): aí eles aparecem no rodapé e nas páginas legais.
`npm run placeholders` mostra a lista do que ainda falta, incluindo configurações pendentes.

> Regra da marca: não publique números, resultados, prêmios, parceiros, depoimentos ou promessas de ganhos que não sejam reais.

## WhatsApp

O site não tem formulários: o contato é pelo WhatsApp da agência, com uma mensagem pronta (a pessoa pode editar antes de enviar).

| Botões | O que acontece |
|---|---|
| "Quero me agenciar" (topo, menu do celular, hero, caminhos, "Você já faz LIVE?", ovo, recrutamento, CTA final, barra do celular) | A página rola até a seção "Agenciamento pelo WhatsApp" |
| "Entrar em contato pelo WhatsApp" (seção de agenciamento) | Abre o WhatsApp com a mensagem `agenciamento` |
| "Quero fazer parte da ninhada" e "Quero fazer parte" (hero, caminhos, recrutamento, CTA final) | Abre o WhatsApp com a mensagem `ninhada` |
| "Falar com o suporte" | Abre o WhatsApp com a mensagem `suporte` |
| Número do WhatsApp no rodapé | Abre o WhatsApp com a mensagem `contato` |

Para um botão rolar até uma seção, use `href: '#id-da-secao'` no conteúdo. Para abrir o WhatsApp, use `whatsapp: 'assunto'`.

O número, o horário, o tempo de resposta e as mensagens ficam em `src/config/site.config.mjs` (`contact` e `whatsappMessages`).
O número usa o formato internacional, só com dígitos: `55` + DDD + número (ex.: `5575983383718`).

## O ovo (microinteração principal)

| Estado | O que acontece |
|---|---|
| Fechado | O ovo dá um "tuc-tuc" de vez em quando, só enquanto está na tela. |
| Mouse em cima ou foco pelo teclado | O ovo balança, brilha e aparece a primeira rachadura. |
| Clique, toque, Enter ou espaço | A rachadura corre, a casca estoura e nasce o pato (imagem oficial do ovo aberto). |
| Aberto | Aparece "Pronto para começar?" e o botão "Quero me agenciar", que abre o WhatsApp. |

- **Celular:** não depende de hover. O ovo chama atenção quando aparece na tela e o toque abre.
- **Reduzir movimento:** se a pessoa ativou essa opção no aparelho, o ovo abre sem a animação.

O ovo fechado é desenhado em SVG com a forma e as cores do ovo da arte. A rachadura segue a borda real da casca aberta, então a troca para a imagem acontece sem pulo.
Arquivos: `src/components/sections/egg/` (desenho e marcação), `src/styles/sections/egg.css` (estados) e `src/scripts/modules/egg.js` (animação).
Se trocar a imagem do ovo aberto, ajuste as medidas em `egg/geometry.mjs`.

## Imagens

As imagens oficiais ficam em `src/assets/images/originals/`.
As versões otimizadas (WebP em vários tamanhos, recortes sem fundo, favicons e imagem de compartilhamento) já estão prontas em `src/assets/images/`.
Se trocar uma arte original, gere tudo de novo:

```bash
pip install pillow numpy scipy opencv-python
python3 tools/prepare-images.py
```

## Publicação (GitHub Pages, grátis)

O site está publicado em **https://patoxlive.github.io**, pelo repositório `patoxlive/patoxlive.github.io` da organização PATOX LIVE no GitHub.

- Branch `main`: o site pronto (conteúdo da pasta `dist/`). É o que o GitHub Pages mostra.
- Branch `codigo-fonte`: este projeto completo, para editar.

Para atualizar o site: edite os arquivos em `src/`, rode `npm run build` e envie o conteúdo de `dist/` para o branch `main` (sem os arquivos `.htaccess`, `_headers` e `vercel.json`, que o GitHub Pages não usa). Em um ou dois minutos o site atualiza.

Outras hospedagens grátis também funcionam com a pasta `dist/`, como a Cloudflare Pages ou a Netlify. Nesse caso, troque `site.url` em `src/config/site.config.mjs` pelo novo endereço e rode `npm run build`.

## Domínio próprio

1. Registre o domínio. Para `.com.br`, o registro é no [Registro.br](https://registro.br), com CPF ou CNPJ, e é renovado todo ano.
2. Publique a pasta `dist/` numa hospedagem (veja a tabela de HTTPS acima) e conecte o domínio a ela, seguindo as instruções da hospedagem.
3. Preencha `site.url` em `src/config/site.config.mjs` com o endereço completo, por exemplo `https://www.seudominio.com.br`, e rode `npm run build`.

## Antes de publicar

- [ ] Razão social e CNPJ em `site.legal` (aparecem no rodapé e nas páginas legais)
- [ ] Vínculo com o programa de agências do TikTok LIVE (`footer.disclaimer` em `home.content.mjs`)
- [ ] Certificado SSL ativo na hospedagem
- [ ] `site.url` com o domínio final em `https://` (ativa o link canônico e o sitemap)
- [ ] Testar os botões do WhatsApp no celular e no computador
- [ ] Termos de uso e Política de privacidade revisados por assessoria jurídica

> Se um dia instalar ferramentas de análise ou de anúncios (Google Analytics, Meta Pixel etc.), atualize a seção "Cookies" da Política de privacidade.

## Medir conversões

O site dispara eventos que podem ser ligados ao Google Analytics ou ao Meta Pixel:

| Evento | Quando acontece |
|---|---|
| `patox:cta_agenciar` | Clique em qualquer "Quero me agenciar". Informa o texto do botão e a seção da página. |
| `patox:whatsapp` | Clique em qualquer botão do WhatsApp. Informa o assunto (`agenciamento`, `ninhada`, `suporte`, `contato`), o texto do botão e a seção da página. |
| `patox:ovo_aberto` | O ovo foi aberto |

Se o Google Tag Manager estiver instalado, os mesmos eventos vão para o `dataLayer` como `patox_*`.

## Estrutura

```
src/
  config/        configurações (empresa, SEO, contatos, WhatsApp)
  content/       textos editáveis
  components/
    layout/      head, topo, rodapé, documento
    sections/    uma seção por arquivo (hero, jornadas, sobre, ovo…)
    ui/          botões, ícones, imagens, ovinhos, avatares da equipe
  pages/         montagem das páginas
  styles/        tokens, base, componentes, seções, animações
  scripts/       JavaScript (um módulo por comportamento)
  assets/images/ imagens otimizadas (+ originals/)
  public/        arquivos de servidor copiados para dist/ (.htaccess, _headers, vercel.json)
scripts/         build e servidor de desenvolvimento
tools/           preparação das imagens
dist/            site pronto para publicar
```

O build junta os CSS num arquivo só, junta os módulos JS num arquivo só (funciona até abrindo o HTML direto, sem servidor) e monta as páginas a partir dos componentes.
Os módulos JS são juntados num único escopo, então os nomes no topo de cada arquivo precisam ser únicos. O build avisa se houver nome repetido.

## Acessibilidade e desempenho

- HTML semântico, títulos em ordem e textos alternativos em todas as imagens
- Navegação completa por teclado, com foco visível e link "Pular para o conteúdo"
- Contraste conferido em todas as combinações de cor
- Respeita a opção "reduzir movimento" do aparelho
- Imagens em WebP, em vários tamanhos e com carregamento sob demanda
- CSS com cerca de 41 KB e JS com cerca de 21 KB, ambos sem compressão, e nenhuma biblioteca externa além das fontes do Google Fonts (Unbounded e Figtree)
