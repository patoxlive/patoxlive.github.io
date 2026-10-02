/** BENEFÍCIOS — cards com o responsável de cada benefício (alguém da equipe ou a equipe toda). */
import { html, attrs } from '../../lib/html.mjs';
import { site } from '../../config/site.config.mjs';
import { icon } from '../ui/icons.mjs';
import { eggAvatar } from '../ui/avatar.mjs';
import { IMG_DIR } from '../ui/image.mjs';

function owner(c, name) {
  if (name === 'equipe') {
    const av = site.images.avatar;
    return html`<p class="benefit__owner"><img${attrs({
      class: 'benefit__team-avatar',
      src: `${IMG_DIR}${av.src}`,
      srcset: `${IMG_DIR}${av.src} 1x, ${IMG_DIR}${av.src2x} 2x`,
      width: 28,
      height: 28,
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    })}><span>${c.teamOwnerLabel}</span></p>`;
  }
  return html`<p class="benefit__owner">${eggAvatar(name)}<span>${c.ownerPrefix} ${name}</span></p>`;
}

export function benefitsSection(c) {
  return html`
  <section class="section benefits" id="beneficios" aria-labelledby="benefits-title">
    <div class="container">
      <header class="section-head">
        <h2 class="section-title" id="benefits-title">${c.title}</h2>
        <p class="section-lead">${c.lead}</p>
      </header>
      <ul class="benefits__grid" role="list">
        ${c.items.map(
          (item, i) => html`<li class="benefit" style="--tone: var(--nest-${(i % 5) + 1}); --i: ${i}" data-reveal>
            <span class="benefit__icon">${icon(item.icon, { size: 26 })}</span>
            <h3 class="benefit__title">${item.title}</h3>
            <p class="benefit__text">${item.text}</p>
            ${item.owner ? owner(c, item.owner) : ''}
          </li>`,
        )}
      </ul>
    </div>
  </section>`;
}
