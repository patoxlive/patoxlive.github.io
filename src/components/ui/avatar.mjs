/** Ovinho com a inicial de alguém da equipe (avatar). */
import { html, attrs } from '../../lib/html.mjs';
import { team } from '../../content/home.content.mjs';

export function findMember(name) {
  return team.find((m) => m.name === name);
}

export function eggAvatar(name, { size = 'sm' } = {}) {
  const member = findMember(name);
  const tone = member ? member.tone : 1;
  return html`<span${attrs({
    class: `egg-avatar egg-avatar--${size}`,
    style: `--tone: var(--nest-${tone})`,
    'aria-hidden': 'true',
  })}>${name.charAt(0)}</span>`;
}
