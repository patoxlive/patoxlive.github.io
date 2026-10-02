/*! PATOX LIVE — gerado por scripts/build.mjs a partir de src/scripts/ */
(() => {
'use strict';
// --- scripts/modules/utils.js
/* Utilitários compartilhados pelos módulos. */

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Move o foco para um elemento sem rolar a página (acessibilidade após âncoras). */
function focusElement(el) {
  if (!el) return;
  const focusable = /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
  if (!focusable && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function scrollToElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/** Eventos de conversão: escute `patox:*` no window ou use o dataLayer (Google Tag Manager). */
function track(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`patox:${name}`, { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: `patox_${name}`, ...detail });
}

// --- scripts/modules/disclosure.js
/* Abre/fecha: escolha de caminho no CTA final ("Quero fazer parte"). */

function setDisclosure(button, panel, open, { instant = false } = {}) {
  if (!button || !panel) return;
  if (instant || prefersReducedMotion()) {
    panel.classList.add('no-transition');
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('no-transition')));
  }
  button.setAttribute('aria-expanded', String(open));
  panel.classList.remove('is-open');
  if (open) {
    panel.removeAttribute('data-collapsed');
    panel.inert = false;
    const done = () => panel.classList.add('is-open');
    if (instant || prefersReducedMotion()) done();
    else setTimeout(done, 520);
  } else {
    panel.setAttribute('data-collapsed', '');
    panel.inert = true;
  }
}

/** Abre o painel que contém `target` (usado quando um link aponta para dentro dele). */
function openDisclosureFor(target) {
  const panel = target && target.closest('[data-disclosure-panel]');
  if (!panel) return false;
  const button = document.querySelector(`[aria-controls="${panel.id}"][data-disclosure]`);
  if (button && button.getAttribute('aria-expanded') !== 'true') {
    setDisclosure(button, panel, true, { instant: true });
  }
  return true;
}

function initDisclosures() {
  const hashTarget = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  qsa('[data-disclosure]').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    const startOpen = hashTarget && (hashTarget === panel || panel.contains(hashTarget));
    setDisclosure(button, panel, Boolean(startOpen), { instant: true });

    button.addEventListener('click', () => {
      setDisclosure(button, panel, button.getAttribute('aria-expanded') !== 'true');
    });
  });
}

// --- scripts/modules/nav.js
/* Topo: estado ao rolar, menu do celular, link ativo e âncoras internas. */


function initNav() {
  const header = qs('[data-header]');
  const toggle = qs('[data-menu-toggle]');
  const menu = qs('[data-mobile-menu]');
  const label = qs('[data-menu-label]');

  // sombra/borda do topo depois de rolar
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // menu do celular
  function setMenu(open, { returnFocus = false } = {}) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      const first = menu.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, { returnFocus: true });
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  // âncoras internas: rolagem suave, abre painéis fechados e move o foco
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(link.getAttribute('href'), location.href);
    if (!url.hash || url.pathname !== location.pathname) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    openDisclosureFor(target);
    // espera o menu fechar / o painel abrir antes de rolar
    requestAnimationFrame(() => {
      scrollToElement(target);
      focusElement(target);
      try { history.pushState(null, '', url.hash); } catch (err) { /* ambiente sem histórico */ }
    });
  });

  // item do menu correspondente à seção visível
  const links = qsa('[data-nav-link]');
  const sections = qsa('main > section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => {
            const active = a.getAttribute('href').endsWith(`#${entry.target.id}`);
            if (active) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }
}

// --- scripts/modules/reveal.js
/* Entrada suave dos blocos marcados com [data-reveal].
   Em repouso tudo fica visível; a animação só é disparada um pouco antes
   do bloco entrar na tela (e nunca para o que já aparece ao abrir a página). */

function initReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        // só anima se o bloco ainda está abaixo da tela (chegando pela rolagem)
        if (entry.boundingClientRect.top > window.innerHeight * 0.92) entry.target.classList.add('is-revealing');
      });
    },
    { rootMargin: '0px 0px 12% 0px' },
  );
  const fold = window.innerHeight * 1.05;
  items.forEach((el) => {
    if (el.getBoundingClientRect().top > fold) io.observe(el);
  });
}

// --- scripts/modules/egg.js
/* O OVO — principal microinteração do site.
 *
 * Estados (atributo data-egg-state na seção #descubra):
 *   idle          ovo fechado; de vez em quando dá um "tuc-tuc"
 *   anticipating  mouse em cima / foco pelo teclado: balança, brilha e aparece a primeira rachadura
 *   cracking      clique/toque/Enter: a rachadura corre pelo ovo, a casca estoura e o pato nasce
 *   hatched       "Pronto para começar?" + botão "Quero me agenciar" (leva ao formulário)
 *
 * No celular não há hover: o convite aparece quando o ovo entra na tela e o toque abre o ovo.
 * Com "reduzir movimento" ativado, o ovo abre com uma transição simples.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const SHELL = '#F6EFD3';
const SHELL_LINE = '#A4917A';

/* trajetórias das lascas (unidades do desenho: 1179 x 1428) — sobem e caem */
const FLIGHT = {
  cap: [[0, 0, 0], [-40, -330, -22], [-120, -60, -58]],
  left: [[0, 0, 0], [-280, -190, -32], [-560, 320, -84]],
  right: [[0, 0, 0], [270, -170, 28], [560, 340, 76]],
};

function initEgg() {
  const root = qs('[data-egg-root]');
  if (!root) return;
  const egg = qs('[data-egg]', root);
  const body = qs('[data-egg-body]', root);
  const image = qs('[data-egg-image]', root);
  const svg = qs('.egg__svg', root);
  const glow = qs('.egg-stage__glow', root);
  const flash = qs('.egg__flash', root);
  const particles = qs('[data-egg-particles]', root);
  const status = qs('[data-egg-status]', root);
  const cta = qs('[data-egg-cta]', root);
  const replay = qs('[data-egg-reset]', root);
  const pieces = Object.fromEntries(qsa('[data-piece]', root).map((p) => [p.dataset.piece, p]));
  const crack = {
    left: qs('.egg__crack--left', root),
    right: qs('.egg__crack--right', root),
    split: qs('.egg__crack--split', root),
    cap: qs('.egg__crack--cap', root),
  };
  const edges = qsa('.egg__edge', root);
  const cracks = qsa('.egg__crack', root);
  const eggLabel = egg.getAttribute('aria-label');

  let state = 'idle';
  let busy = false;
  let anims = [];
  const play = (el, frames, opts) => {
    const a = el.animate(frames, opts);
    anims.push(a);
    return a;
  };
  const setState = (next) => {
    state = next;
    root.dataset.eggState = next;
  };
  setState('idle');

  // só anima o "tuc-tuc" quando a seção está visível
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => root.classList.toggle('is-inview', entry.isIntersecting)).observe(root);
  } else {
    root.classList.add('is-inview');
  }

  // ---------- expectativa (desktop: hover · teclado: foco) ----------
  const anticipate = (on) => {
    if (busy || (state !== 'idle' && state !== 'anticipating')) return;
    setState(on ? 'anticipating' : 'idle');
    if (on) root.dataset.eggPip = '';
  };
  egg.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') anticipate(true); });
  egg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') anticipate(false); });
  egg.addEventListener('focus', () => { if (egg.matches(':focus-visible')) anticipate(true); });
  egg.addEventListener('blur', () => anticipate(false));

  // celular: sem hover, o ovo "chama" quando aparece na tela
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && state === 'idle') {
        root.dataset.eggPip = '';
        root.classList.add('egg-section--nudge');
        if (!prefersReducedMotion()) {
          body.animate(
            [{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(2.5deg)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(0)' }],
            { duration: 700, easing: 'ease-in-out' },
          );
        }
        io.disconnect();
      }
    }, { threshold: 0.65 });
    io.observe(egg);
  }

  // ---------- clique / toque / Enter ----------
  egg.addEventListener('click', (e) => {
    if (busy) return;
    if (state === 'hatched') return hop();
    hatch(e.detail === 0);
  });
  replay.addEventListener('click', () => resetEgg());

  const drawCrack = (el, duration, delay = 0) =>
    play(el, [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }], {
      duration, delay, easing: 'cubic-bezier(.55,0,.75,.45)', fill: 'forwards',
    });

  async function hatch(fromKeyboard) {
    busy = true;
    setState('cracking');
    root.dataset.eggPip = '';
    track('ovo_aberto');
    const imageReady = Promise.race([image.decode ? image.decode().catch(() => {}) : Promise.resolve(), wait(1600)]);

    if (prefersReducedMotion()) {
      await imageReady;
      return finish(fromKeyboard);
    }

    // 1. a rachadura corre a partir do primeiro "tuc" e o ovo treme cada vez mais
    drawCrack(crack.left, 620);
    drawCrack(crack.right, 470, 90);
    const shake = play(body, [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-1.6deg)', offset: 0.14 },
      { transform: 'rotate(1.8deg)', offset: 0.28 },
      { transform: 'rotate(-2.8deg)', offset: 0.44 },
      { transform: 'rotate(3deg)', offset: 0.6 },
      { transform: 'rotate(-3.8deg)', offset: 0.76 },
      { transform: 'rotate(2.4deg)', offset: 0.9 },
      { transform: 'rotate(0deg)' },
    ], { duration: 680, easing: 'linear' });
    play(glow, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }], { duration: 680, fill: 'forwards', easing: 'ease-in' });
    await shake.finished;

    // 2. últimas rachaduras + o ovo "prende a respiração"
    drawCrack(crack.split, 150);
    drawCrack(crack.cap, 150, 50);
    const squash = play(body, [{ transform: 'scale(1, 1)' }, { transform: 'scale(1.05, 0.93)' }], {
      duration: 190, easing: 'ease-in', fill: 'forwards',
    });
    await Promise.all([squash.finished, imageReady]);

    // 3. estouro: a casca voa, o pato nasce
    burst();
    await wait(880);
    finish(fromKeyboard);
  }

  function burst() {
    root.dataset.eggBurst = '';
    edges.forEach((el) => { el.style.opacity = '1'; });
    cracks.forEach((el) => { el.style.opacity = '0'; });

    Object.entries(FLIGHT).forEach(([name, path]) => {
      const [p0, p1, p2] = path.map(([x, y, r]) => `translate(${x}px, ${y}px) rotate(${r}deg)`);
      play(pieces[name], [
        { transform: p0, opacity: 1, easing: 'cubic-bezier(.15,.75,.35,1)' },
        { transform: p1, opacity: 1, offset: 0.38, easing: 'cubic-bezier(.55,0,.9,.55)' },
        { transform: p2, opacity: 0 },
      ], { duration: 1050, fill: 'forwards' });
    });
    play(pieces.bottom, [{ opacity: 1 }, { opacity: 0 }], { duration: 170, delay: 40, fill: 'forwards' });
    play(image, [{ opacity: 0 }, { opacity: 1 }], { duration: 170, fill: 'forwards' });
    play(body, [
      { transform: 'translateY(0) scale(1.05, 0.93)' },
      { transform: 'translateY(-5%) scale(0.96, 1.07)', offset: 0.3 },
      { transform: 'translateY(0.8%) scale(1.02, 0.98)', offset: 0.62 },
      { transform: 'translateY(0) scale(1, 1)' },
    ], { duration: 760, easing: 'cubic-bezier(.25,.9,.35,1)' });
    play(flash, [
      { opacity: 0, transform: 'scale(0.3)' },
      { opacity: 0.95, transform: 'scale(0.85)', offset: 0.22 },
      { opacity: 0, transform: 'scale(1.35)' },
    ], { duration: 720, easing: 'ease-out' });
    play(glow, [{ transform: 'scale(1.12)' }, { transform: 'scale(1.32)', offset: 0.3 }, { transform: 'scale(1)' }], {
      duration: 1100, easing: 'ease-out',
    });
    spawnParticles();
  }

  function spawnParticles() {
    const make = (tag, attrs) => {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };
    const drop = (el, frames, opts) => {
      particles.appendChild(el);
      const a = el.animate(frames, { fill: 'forwards', ...opts });
      a.onfinish = () => el.remove();
    };

    // lasquinhas ao longo da rachadura
    [crack.left, crack.right].forEach((path) => {
      const length = path.getTotalLength();
      for (let i = 0; i <= 6; i++) {
        const { x, y } = path.getPointAtLength((length * i) / 6);
        const s = 12 + Math.random() * 20;
        const shard = make('polygon', {
          points: `0,${-s} ${s * 0.95},${s * 0.35} ${-s * 0.7},${s * 0.85}`,
          fill: SHELL, stroke: SHELL_LINE, 'stroke-width': 3, 'stroke-linejoin': 'round',
        });
        const dir = x < 600 ? -1 : 1;
        const dx = dir * (70 + Math.random() * 280);
        const up = 110 + Math.random() * 280;
        const spin = (Math.random() * 2 - 1) * 560;
        drop(shard, [
          { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 1, easing: 'cubic-bezier(.2,.8,.4,1)' },
          { transform: `translate(${x + dx * 0.55}px, ${y - up}px) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.4, easing: 'cubic-bezier(.5,0,.9,.6)' },
          { transform: `translate(${x + dx}px, ${y + 420}px) rotate(${spin}deg)`, opacity: 0 },
        ], { duration: 900 + Math.random() * 450 });
      }
    });

    // brilhos
    for (let i = 0; i < 9; i++) {
      const star = make('path', {
        d: 'M0 -24L5 -5L24 0L5 5L0 24L-5 5L-24 0L-5 -5Z',
        fill: i % 3 === 0 ? '#B08CE8' : SHELL,
      });
      const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 360 + Math.random() * 180;
      drop(star, [
        { transform: 'translate(600px, 600px) scale(0.2)', opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { transform: `translate(${600 + Math.cos(angle) * dist}px, ${600 + Math.sin(angle) * dist * 0.8}px) scale(1.1) rotate(90deg)`, opacity: 0 },
      ], { duration: 760 + Math.random() * 240, easing: 'cubic-bezier(.2,.8,.3,1)' });
    }

    // duas peninhas caindo devagar
    [[470, 330, 1], [760, 300, -1]].forEach(([x, y, side], i) => {
      const feather = make('g', {});
      feather.appendChild(make('path', { d: 'M0 -38C18 -22 17 16 0 38C-17 16 -18 -22 0 -38Z', fill: '#FFFFFF', stroke: '#DCCBF1', 'stroke-width': 3 }));
      feather.appendChild(make('path', { d: 'M0 -34V52', stroke: '#CDB9E8', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }));
      drop(feather, [
        { transform: `translate(${x}px, ${y}px) rotate(${-24 * side}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: `translate(${x + 70 * side}px, ${y - 60}px) rotate(${18 * side}deg)`, offset: 0.3 },
        { transform: `translate(${x - 20 * side}px, ${y + 200}px) rotate(${-16 * side}deg)`, opacity: 1, offset: 0.66 },
        { transform: `translate(${x + 50 * side}px, ${y + 460}px) rotate(${10 * side}deg)`, opacity: 0 },
      ], { duration: 2400 + i * 300, delay: 120 + i * 90, easing: 'ease-in-out' });
    });
  }

  function finish(fromKeyboard) {
    setState('hatched');
    busy = false;
    egg.setAttribute('aria-label', image.getAttribute('alt') || eggLabel);
    egg.setAttribute('tabindex', '-1');
    status.textContent = status.dataset.message || '';
    if (fromKeyboard) setTimeout(() => cta.focus(), 120);
  }

  function hop() {
    if (prefersReducedMotion()) return;
    body.animate([
      { transform: 'translateY(0) scale(1, 1)' },
      { transform: 'translateY(0) scale(1.04, 0.95)', offset: 0.2 },
      { transform: 'translateY(-3.5%) scale(0.97, 1.04)', offset: 0.5 },
      { transform: 'translateY(0) scale(1, 1)' },
    ], { duration: 560, easing: 'ease-out' });
  }

  async function resetEgg() {
    if (busy) return;
    busy = true;
    if (!prefersReducedMotion()) {
      await image.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }).finished;
    }
    anims.forEach((a) => a.cancel());
    anims = [];
    image.getAnimations().forEach((a) => a.cancel());
    edges.forEach((el) => { el.style.opacity = ''; });
    cracks.forEach((el) => { el.style.opacity = ''; });
    particles.replaceChildren();
    delete root.dataset.eggPip;
    delete root.dataset.eggBurst;
    root.classList.remove('egg-section--nudge');
    egg.setAttribute('aria-label', eggLabel);
    egg.removeAttribute('tabindex');
    status.textContent = '';
    setState('idle');
    if (!prefersReducedMotion()) {
      body.animate(
        [{ transform: 'translateY(-7%) scale(0.92)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }],
        { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' },
      );
    }
    egg.focus({ preventScroll: true });
    busy = false;
  }
}

// --- scripts/modules/mobile-cta.js
/* Barra com "Quero me agenciar" fixa no rodapé do celular.
   Aparece depois do hero e some quando o próprio formulário, o ovo, a escolha de caminhos,
   o recrutamento (para não misturar as jornadas) ou o rodapé estão na tela. */

function initMobileCta() {
  const bar = qs('[data-mobile-cta]');
  if (!bar || !('IntersectionObserver' in window)) return;
  bar.hidden = false;
  const watch = ['#inicio', '#caminhos', '#descubra', '#agenciamento', '#recrutamento', '.site-footer']
    .map((sel) => qs(sel))
    .filter(Boolean);
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    bar.classList.toggle('is-visible', visible.size === 0);
  }, { threshold: 0.05 });
  watch.forEach((el) => io.observe(el));
}

// --- scripts/modules/tracking.js
/* Métricas de conversão:
   - clique num botão do WhatsApp → evento `patox:whatsapp`
   - clique num "Quero me agenciar" (rola até a seção de agenciamento) → evento `patox:cta_agenciar`
   Os mesmos eventos vão para o dataLayer como `patox_*`, se o Google Tag Manager estiver instalado. */

function context(link) {
  const section = link.closest('section[id], header, footer, [data-mobile-cta]');
  return {
    botao: (link.querySelector('.btn__label, .choice-card__action') || link).textContent.trim(),
    secao: section ? section.id || section.tagName.toLowerCase() : '',
  };
}

function initTracking() {
  document.addEventListener('click', (e) => {
    const wa = e.target.closest('a[data-whatsapp]');
    if (wa) {
      track('whatsapp', { assunto: wa.dataset.whatsapp, ...context(wa) });
      return;
    }
    const cta = e.target.closest('a.btn[href$="#agenciamento"], a.choice-card[href$="#agenciamento"], a.who-group__link[href$="#agenciamento"]');
    if (cta) track('cta_agenciar', context(cta));
  });
}

// --- scripts/main.js
/* PATOX LIVE — ponto de entrada do JavaScript.
   Os módulos ficam em ./modules e são juntados em um arquivo só pelo build. */






initDisclosures();
initNav();
initReveal();
initEgg();
initMobileCta();
initTracking();

})();
