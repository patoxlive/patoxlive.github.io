# Decoral Pedras · site

Site institucional da **Decoral Pedras**: pedras naturais para revestimento de parede, piso e jardim.
É um site estático (HTML, CSS e JavaScript em um único `index.html`), pronto para o GitHub Pages.

## O que tem no site

- Barra de contatos, menu e botão de orçamento pelo WhatsApp
- Linhas de produtos: parede, piso e jardim
- Sobre a empresa e diferenciais (6x sem juros, consultoria gratuita, frota própria)
- Catálogo com 12 pedras, filtro por aplicação e lista de orçamento
- Calculadora de metragem (m²) com desconto de portas e janelas e margem de perda
- Como funciona, avaliações do Google e dúvidas frequentes
- Pedido de orçamento que abre o WhatsApp com a mensagem pronta
- Mapa de localização e botão flutuante do WhatsApp

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | O site inteiro: textos, visual e funcionamento |
| `img/` | Imagens do site |
| `img/og.jpg` | Imagem que aparece quando o link é compartilhado no WhatsApp e nas redes |
| `favicon.svg` | Ícone da aba do navegador |
| `.nojekyll` | Faz o GitHub Pages publicar os arquivos como estão |

## Alterar telefone, WhatsApp e endereço

Abra o `index.html`, procure por `const CONFIG` (perto do fim do arquivo) e edite os valores:

```js
const CONFIG = {
  whatsapp: "5518999999999",        // só números: 55 + DDD + número
  whatsappTexto: "(18) 99999-9999", // como o número aparece na tela
  telefone: "(18) 3333-3333",
  telefoneLink: "+551833333333",
  endereco: "Rua Exemplo, 100 · Bairro",
  cidade: "Presidente Prudente - SP",
  maps: "link do Google Maps",
  mapaEmbed: "link do mapa incorporado",
  instagram: "https://www.instagram.com/decoral.pedras/",
  facebook: "https://www.facebook.com/profile.php?id=100054592352983"
};
```

Todos os botões, o rodapé e o formulário usam esses dados automaticamente.

> **Atenção:** os números de WhatsApp e telefone que estão no arquivo vieram do site antigo e parecem ser de exemplo. Troque pelos números reais antes de divulgar o site.

## Trocar as imagens

As imagens atuais são **ilustrativas**. Para usar fotos reais das pedras e das obras, substitua o arquivo dentro de `img/` mantendo o mesmo nome. Se a foto nova for `.jpg`, troque também o nome do arquivo dentro do `index.html`.

| Imagem | Onde aparece | Tamanho recomendado |
| --- | --- | --- |
| `hero.webp` | Topo do site e faixa de chamada | 2200 × 1240 px (horizontal) |
| `parede.webp`, `piso.webp`, `jardim.webp` | Linhas de produtos | 1200 × 900 px |
| `mostruario.webp` | Sobre a empresa | 1200 × 1500 px (vertical) |
| `p-*.webp` | Catálogo de pedras | 800 × 600 px |
| `og.jpg` | Compartilhamento do link | 1200 × 630 px |

## Publicar no GitHub Pages

1. No repositório, clique em **Settings** e depois em **Pages**.
2. Em **Build and deployment**, escolha **Source: Deploy from a branch**.
3. Selecione a branch **main** e a pasta **/ (root)**. Clique em **Save**.
4. Em alguns minutos o endereço do site aparece no topo da página **Pages**.

## Usar o domínio decoralpedras.com.br

1. Em **Settings → Pages → Custom domain**, digite `www.decoralpedras.com.br` e clique em **Save**.
2. No painel onde o domínio foi registrado (por exemplo, Registro.br), configure o DNS:
   - Registro **CNAME** para `www` apontando para `SEU-USUARIO.github.io` (sem o nome do repositório).
   - Quatro registros **A** no domínio principal: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`.
3. Quando o domínio estiver funcionando, marque **Enforce HTTPS**. Essa opção pode levar até 24 horas para ficar disponível.

Ao mudar o DNS, o domínio deixa de abrir o site antigo e passa a abrir este.

Referência: [documentação do GitHub Pages sobre domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
