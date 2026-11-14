/* PATOX LIVE — Área do Streamer: aulas e player sem avanço */
(async function () {
  const { sb, ICONES, esc, tempo, duracaoTexto, toast, exigirLogin, montarMenu } = window.PATOX;
  const app = document.getElementById("app");

  const auth = await exigirLogin();
  if (!auth) return;
  const { perfil } = auth;
  const isAdmin = perfil.papel === "admin";
  montarMenu(perfil);

  // ---------- Dados ----------
  let modulos = [], aulas = [], progresso = new Map();

  async function carregar() {
    const [m, a, p] = await Promise.all([
      sb.from("modulos").select("id, titulo, descricao, ordem, publicado").order("ordem").order("id"),
      sb.from("aulas").select("id, modulo_id, titulo, descricao, video_path, duracao_seg, ordem, publicado").order("ordem").order("id"),
      sb.from("progresso").select("aula_id, assistido_ate, concluida_em").eq("user_id", perfil.id),
    ]);
    if (m.error || a.error || p.error) throw m.error || a.error || p.error;
    modulos = m.data.filter((x) => x.publicado);
    const ordemMod = new Map(modulos.map((x, i) => [x.id, i]));
    aulas = a.data
      .filter((x) => x.publicado && ordemMod.has(x.modulo_id))
      .sort((x, y) => ordemMod.get(x.modulo_id) - ordemMod.get(y.modulo_id) || x.ordem - y.ordem || x.id - y.id);
    progresso = new Map(p.data.map((r) => [r.aula_id, r]));
  }

  const feita = (aula) => !!progresso.get(aula.id)?.concluida_em;
  function liberada(aula) {
    if (isAdmin) return true;
    const i = aulas.indexOf(aula);
    return aulas.slice(0, i).every(feita);
  }
  const proxima = (aula) => aulas[aulas.indexOf(aula) + 1] || null;
  const anterior = (aula) => aulas[aulas.indexOf(aula) - 1] || null;
  const numeroNoModulo = (aula) => aulas.filter((x) => x.modulo_id === aula.modulo_id).indexOf(aula) + 1;
  const moduloDe = (aula) => modulos.find((m) => m.id === aula.modulo_id);

  try { await carregar(); }
  catch (e) {
    app.innerHTML = `<div class="curso"><div class="vazio" style="grid-column:1/-1"><h2>Não foi possível carregar as aulas</h2><p>Verifique sua internet e atualize a página.</p><button class="btn btn--primary" onclick="location.reload()">Tentar de novo</button></div></div>`;
    return;
  }

  const primeiroNome = esc(perfil.nome.split(" ")[0]);

  // Selo da liga ao lado do "Olá" (leva para Ligas & Ranking)
  async function mostrarLiga() {
    if (isAdmin) return;
    const { mesISO, situacao, seloLiga, nomeMes } = window.PATOX;
    const M1 = mesISO(-1), M2 = mesISO(-2);
    const [l, d] = await Promise.all([
      sb.from("ligas").select("*"),
      sb.from("diamantes").select("mes, quantidade, sem_premio").eq("user_id", perfil.id).in("mes", [M1, M2]),
    ]);
    if (l.error || !l.data?.length) return;
    const q = (m) => (d.data || []).find((r) => r.mes === m);
    const sit = situacao(l.data, q(M1)?.quantidade, q(M2)?.quantidade, q(M1)?.sem_premio);
    const alvo = app.querySelector(".boas-vindas");
    if (!alvo) return;
    const a = document.createElement("a");
    a.className = "liga-chip";
    a.href = "ranking.html";
    a.innerHTML = `${seloLiga(sit.liga, 36)}<span><small>Sua liga em ${nomeMes(mesISO(0))}</small>${esc(sit.liga.nome)} →</span>`;
    alvo.appendChild(a);
  }

  if (!aulas.length) {
    app.innerHTML = `
      <div class="curso">
        <div class="boas-vindas"><div><span class="boas-vindas__eyebrow">Olá, ${primeiroNome}!</span><h1>Sua trilha na PATOX</h1></div></div>
        <div class="vazio" style="grid-column:1/-1">
          <img src="../assets/images/pato-ninhada-recorte-600.webp" width="600" height="582" alt="">
          <h2>As aulas estão chocando</h2>
          <p>O ${esc(modulos[0]?.titulo || "Módulo 1")} está sendo preparado com carinho pela equipe PATOX. Assim que a primeira aula sair da casca, ela aparece aqui.</p>
          ${isAdmin ? '<a class="btn btn--primary" href="admin.html">Adicionar aulas no painel</a>' : ""}
        </div>
      </div>`;
    mostrarLiga();
    return;
  }

  // ---------- Layout ----------
  app.innerHTML = `
    <div class="curso">
      <div class="boas-vindas">
        <div>
          <span class="boas-vindas__eyebrow">Olá, ${primeiroNome}!</span>
          <h1>Sua trilha na PATOX</h1>
        </div>
        ${isAdmin ? '<span class="chip chip--live">Modo equipe PATOX: tudo liberado, progresso não é salvo</span>' : ""}
      </div>

      <section aria-label="Aula">
        <div class="player" id="player" tabindex="0">
          <video id="video" playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture></video>
          <div class="player__click" data-click></div>
          <button class="player__big" type="button" data-big aria-label="Reproduzir">${ICONES.play}</button>
          <div class="player__loading" data-loading hidden><span class="spinner"></span></div>
          <div class="player__toast" data-ptoast role="status"></div>
          <div class="player__bar">
            <div class="player__track" data-track title="">
              <div class="player__watched" data-watched></div>
              <div class="player__fill" data-fill></div>
              <div class="player__knob" data-knob></div>
            </div>
            <div class="player__controls">
              <button class="pbtn" type="button" data-play aria-label="Reproduzir">${ICONES.play}</button>
              <button class="pbtn pbtn--back" type="button" data-back aria-label="Voltar 10 segundos">${ICONES.back10}<span>Voltar 10s</span></button>
              <span class="player__time" data-time>0:00 / 0:00</span>
              <span class="player__grow"></span>
              <span class="player__lock" data-lockinfo>${ICONES.lock}<span>Sem avançar</span></span>
              <button class="pbtn" type="button" data-mute aria-label="Tirar o som">${ICONES.vol}</button>
              <input class="player__vol" type="range" min="0" max="1" step="0.05" value="1" data-vol aria-label="Volume">
              <button class="pbtn" type="button" data-full aria-label="Tela cheia">${ICONES.full}</button>
            </div>
          </div>
        </div>

        <div class="aula-info" id="aula-info"></div>
      </section>

      <aside class="trilha" aria-label="Aulas">
        <div class="trilha__head">
          <h2>Seu progresso</h2>
          <p data-resumo></p>
          <div class="meter"><div class="meter__fill" data-meter style="width:0"></div></div>
          <div class="meter__label"><span data-meter-txt></span><span data-meter-pct></span></div>
        </div>
        <div data-lista></div>
      </aside>
    </div>`;

  mostrarLiga();
  const $ = (s) => app.querySelector(s);
  const player = $("#player"), video = $("#video");
  const ui = {
    big: $("[data-big]"), play: $("[data-play]"), back: $("[data-back]"), time: $("[data-time]"),
    track: $("[data-track]"), fill: $("[data-fill]"), watched: $("[data-watched]"), knob: $("[data-knob]"),
    mute: $("[data-mute]"), vol: $("[data-vol]"), full: $("[data-full]"), click: $("[data-click]"),
    loading: $("[data-loading]"), ptoast: $("[data-ptoast]"), lockinfo: $("[data-lockinfo]"),
    info: $("#aula-info"), lista: $("[data-lista]"),
  };

  // ---------- Trilha ----------
  function renderTrilha() {
    const total = aulas.length, ok = aulas.filter(feita).length;
    const pct = Math.round((ok / total) * 100);
    $("[data-resumo]").textContent = ok === total ? "Você concluiu todas as aulas. Orgulho da ninhada!" : `Assista até o fim para liberar a próxima aula.`;
    $("[data-meter]").style.width = pct + "%";
    $("[data-meter-txt]").textContent = `${ok} de ${total} aula${total > 1 ? "s" : ""}`;
    $("[data-meter-pct]").textContent = pct + "%";

    ui.lista.innerHTML = modulos.map((m) => {
      const doModulo = aulas.filter((a) => a.modulo_id === m.id);
      if (!doModulo.length) return "";
      return `
        <div class="trilha__modulo">
          <div class="trilha__modulo-title">${esc(m.titulo)}</div>
          <ul class="trilha__list" role="list">
            ${doModulo.map((a, i) => {
              const f = feita(a), lib = liberada(a), atual = atualAula && a.id === atualAula.id;
              const cls = f ? "licao--feita" : !lib ? "licao--bloq" : "licao--atual";
              const icone = f ? ICONES.check : !lib ? ICONES.lock : ICONES.play;
              const estado = f ? "Concluída" : !lib ? "Bloqueada" : "Liberada";
              return `<li><button class="licao ${cls}" type="button" data-aula="${a.id}" ${lib ? "" : "disabled"} ${atual ? 'aria-current="true"' : ""} aria-label="Aula ${i + 1}: ${esc(a.titulo)} — ${estado}">
                <span class="licao__icon">${icone}</span>
                <span><span class="licao__num">Aula ${i + 1}${a.duracao_seg ? " · " + duracaoTexto(a.duracao_seg) : ""}</span><span class="licao__title">${esc(a.titulo)}</span></span>
              </button></li>`;
            }).join("")}
          </ul>
        </div>`;
    }).join("");
  }

  ui.lista.addEventListener("click", (e) => {
    const b = e.target.closest("[data-aula]");
    if (!b || b.disabled) return;
    const aula = aulas.find((a) => a.id === Number(b.dataset.aula));
    if (aula) abrirAula(aula, true);
  });

  // ---------- Player ----------
  let atualAula = null;
  let maxVisto = 0;       // até onde a pessoa já assistiu (segundos)
  let livre = false;      // aula concluída ou equipe PATOX: pode avançar
  let ultimoSalvo = 0;
  let salvando = false;
  let tickSalvar = null;
  let urlRenovada = false;

  function toastPlayer(msg) {
    ui.ptoast.textContent = msg;
    ui.ptoast.classList.add("is-on");
    clearTimeout(toastPlayer.t);
    toastPlayer.t = setTimeout(() => ui.ptoast.classList.remove("is-on"), 2600);
  }

  function atualizarBarra() {
    const d = video.duration || atualAula?.duracao_seg || 0;
    const c = video.currentTime || 0;
    const p = d ? (c / d) * 100 : 0;
    const w = d ? (Math.min(maxVisto, d) / d) * 100 : 0;
    ui.fill.style.width = p + "%";
    ui.knob.style.left = p + "%";
    ui.watched.style.width = (livre ? 100 : w) + "%";
    ui.time.textContent = `${tempo(c)} / ${tempo(d)}`;
  }

  function atualizarBotoes() {
    const tocando = !video.paused && !video.ended;
    player.classList.toggle("is-playing", tocando);
    ui.play.innerHTML = tocando ? ICONES.pause : ICONES.play;
    ui.play.setAttribute("aria-label", tocando ? "Pausar" : "Reproduzir");
    ui.big.hidden = tocando || !video.src;
  }

  async function salvarProgresso(concluir) {
    if (isAdmin || !atualAula || livre && !concluir) return;
    if (salvando && !concluir) return;
    const valor = Math.floor(maxVisto * 10) / 10;
    if (!concluir && valor <= ultimoSalvo + 0.5) return;
    salvando = true;
    const dados = { assistido_ate: valor };
    if (concluir) dados.concluida_em = new Date().toISOString();
    const { data, error } = await sb.from("progresso").update(dados)
      .eq("user_id", perfil.id).eq("aula_id", atualAula.id)
      .select("aula_id, assistido_ate, concluida_em").maybeSingle();
    salvando = false;
    if (!error && data) {
      ultimoSalvo = Number(data.assistido_ate);
      progresso.set(data.aula_id, data);
    }
    return data;
  }

  function salvarAoSair() {
    if (isAdmin || !atualAula || livre) return;
    // envio rápido quando a pessoa fecha/troca de aba
    salvarProgresso(false);
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) salvarAoSair(); });
  window.addEventListener("pagehide", salvarAoSair);

  async function abrirAula(aula, rolar) {
    if (!liberada(aula)) { toast("Conclua a aula anterior para liberar esta.", true); return; }
    if (atualAula && atualAula.id !== aula.id) await salvarProgresso(false);
    atualAula = aula;
    history.replaceState(null, "", "#aula-" + aula.id);
    fecharConcluida();
    video.pause();
    video.removeAttribute("src");
    video.load();
    urlRenovada = false;

    const prog = progresso.get(aula.id);
    livre = isAdmin || !!prog?.concluida_em;
    maxVisto = Number(prog?.assistido_ate || 0);
    ultimoSalvo = maxVisto;
    player.classList.toggle("is-free", livre);
    ui.lockinfo.hidden = livre;
    ui.track.title = livre ? "Clique para ir a qualquer parte" : "Avançar não é permitido. Use “Voltar 10s” para rever.";

    renderInfo();
    renderTrilha();
    atualizarBarra();

    if (rolar && window.innerWidth < 980) player.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!aula.video_path) {
      mostrarSemVideo();
      return;
    }
    removerSemVideo();

    if (!isAdmin && !prog) {
      const { data } = await sb.from("progresso")
        .upsert({ aula_id: aula.id }, { onConflict: "user_id,aula_id", ignoreDuplicates: true })
        .select("aula_id, assistido_ate, concluida_em");
      if (data && data[0]) progresso.set(aula.id, data[0]);
    }
    await carregarVideo(maxVisto);
  }

  async function carregarVideo(posicao) {
    ui.loading.hidden = false;
    const { data, error } = await sb.storage.from("aulas").createSignedUrl(atualAula.video_path, 60 * 60 * 3);
    if (error || !data) {
      ui.loading.hidden = true;
      toastPlayer("Não foi possível carregar o vídeo. Atualize a página.");
      return;
    }
    video.src = data.signedUrl;
    video.addEventListener("loadedmetadata", function inicio() {
      video.removeEventListener("loadedmetadata", inicio);
      ui.loading.hidden = true;
      const d = video.duration || 0;
      if (posicao > 3 && (!d || posicao < d - 3) && !livre) {
        video.currentTime = posicao;
        toastPlayer("Continuando de onde você parou");
      }
      atualizarBarra();
      atualizarBotoes();
    });
  }

  function renderInfo() {
    const a = atualAula, m = moduloDe(a), n = numeroNoModulo(a);
    const ant = anterior(a), prox = proxima(a);
    const f = feita(a);
    ui.info.innerHTML = `
      <div class="aula-info__meta">
        <span>${esc(m?.titulo || "")} · Aula ${n}</span>
        ${a.duracao_seg ? `<span>· ${duracaoTexto(a.duracao_seg)}</span>` : ""}
        ${f ? `<span class="chip chip--ok">${ICONES.check.replace("<svg", '<svg width="14" height="14"')} Concluída</span>` : ""}
      </div>
      <h2>${esc(a.titulo)}</h2>
      ${a.descricao ? `<p class="aula-info__desc">${esc(a.descricao)}</p>` : ""}
      <div class="aula-info__nav">
        ${ant ? `<button class="btn btn--outline btn--sm" type="button" data-ir="${ant.id}">← Aula anterior</button>` : ""}
        ${prox ? `<button class="btn btn--primary btn--sm" type="button" data-ir="${prox.id}" ${liberada(prox) ? "" : "disabled title='Conclua esta aula para liberar'"}>${liberada(prox) ? "Próxima aula" : ICONES.lock.replace("<svg", '<svg width="16" height="16"') + " Próxima aula"} →</button>` : ""}
      </div>`;
  }
  ui.info.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ir]");
    if (!b || b.disabled) return;
    abrirAula(aulas.find((x) => x.id === Number(b.dataset.ir)), true);
  });

  let semVideoEl = null;
  function mostrarSemVideo() {
    ui.loading.hidden = true;
    if (!semVideoEl) {
      semVideoEl = document.createElement("div");
      semVideoEl.className = "concluida";
      semVideoEl.innerHTML = `<div class="concluida__card"><img class="concluida__duck" src="../assets/images/pato-ovo-aberto-600.webp" width="150" height="182" alt=""><h2>Vídeo chocando</h2><p>O vídeo desta aula ainda está sendo preparado. Volte em breve!</p></div>`;
    }
    player.appendChild(semVideoEl);
    ui.big.hidden = true;
  }
  function removerSemVideo() { semVideoEl?.remove(); }

  // ---------- Controles ----------
  function alternar() {
    if (!video.src) return;
    if (video.paused || video.ended) video.play().catch(() => {});
    else video.pause();
  }
  function voltar10() {
    if (!video.src) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
    toastPlayer("−10 segundos");
  }
  function tentarAvancar() {
    if (livre) { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); return; }
    toastPlayer("Avançar não é permitido. Assista até o fim para liberar a próxima aula.");
  }

  ui.big.addEventListener("click", alternar);
  ui.play.addEventListener("click", alternar);
  ui.click.addEventListener("click", alternar);
  ui.click.addEventListener("dblclick", () => telaCheia());
  ui.back.addEventListener("click", voltar10);

  ui.track.addEventListener("click", (e) => {
    const d = video.duration;
    if (!d) return;
    if (!livre) { toastPlayer("Para rever, use o botão “Voltar 10s”. Avançar não é permitido."); return; }
    const r = ui.track.getBoundingClientRect();
    video.currentTime = Math.max(0, Math.min(d, ((e.clientX - r.left) / r.width) * d));
  });

  ui.mute.addEventListener("click", () => { video.muted = !video.muted; });
  ui.vol.addEventListener("input", () => { video.volume = Number(ui.vol.value); video.muted = video.volume === 0; });
  video.addEventListener("volumechange", () => {
    const mudo = video.muted || video.volume === 0;
    ui.mute.innerHTML = mudo ? ICONES.mute : ICONES.vol;
    ui.mute.setAttribute("aria-label", mudo ? "Ligar o som" : "Tirar o som");
    ui.vol.value = video.muted ? 0 : video.volume;
  });

  function telaCheia() {
    const doc = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      return;
    }
    if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    else if (player.webkitRequestFullscreen) player.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
  }
  ui.full.addEventListener("click", telaCheia);

  player.addEventListener("keydown", (e) => {
    if (e.target.closest("input, .concluida")) return;
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") { e.preventDefault(); alternar(); }
    else if (k === "arrowleft" || k === "j") { e.preventDefault(); voltar10(); }
    else if (k === "arrowright" || k === "l") { e.preventDefault(); tentarAvancar(); }
    else if (k === "f") { e.preventDefault(); telaCheia(); }
    else if (k === "m") { e.preventDefault(); video.muted = !video.muted; }
  });

  video.addEventListener("contextmenu", (e) => e.preventDefault());
  player.addEventListener("contextmenu", (e) => e.preventDefault());

  // Esconde a barra quando o mouse fica parado
  let idleT;
  function acordar() {
    player.classList.remove("is-idle");
    clearTimeout(idleT);
    idleT = setTimeout(() => player.classList.add("is-idle"), 2600);
  }
  player.addEventListener("mousemove", acordar);
  player.addEventListener("touchstart", acordar, { passive: true });

  // ---------- Regra principal: não deixa avançar ----------
  video.addEventListener("timeupdate", () => {
    const c = video.currentTime;
    if (!livre && c > maxVisto + 1.5) {
      // pulo detectado (tela cheia nativa do celular, atalhos do navegador etc.)
      video.currentTime = maxVisto;
      toastPlayer("Avançar não é permitido.");
      return;
    }
    if (c > maxVisto) maxVisto = c;
    atualizarBarra();
  });
  video.addEventListener("seeking", () => {
    if (!livre && video.currentTime > maxVisto + 1) {
      video.currentTime = maxVisto;
      toastPlayer("Avançar não é permitido.");
    }
  });
  video.addEventListener("ratechange", () => {
    if (!livre && video.playbackRate !== 1) video.playbackRate = 1;
  });

  video.addEventListener("play", () => {
    atualizarBotoes();
    acordar();
    clearInterval(tickSalvar);
    tickSalvar = setInterval(() => salvarProgresso(false), 8000);
  });
  video.addEventListener("pause", () => {
    atualizarBotoes();
    clearInterval(tickSalvar);
    salvarProgresso(false);
  });
  video.addEventListener("waiting", () => { ui.loading.hidden = false; });
  video.addEventListener("playing", () => { ui.loading.hidden = true; });
  video.addEventListener("canplay", () => { ui.loading.hidden = true; });

  video.addEventListener("error", async () => {
    if (!atualAula?.video_path || urlRenovada || !video.getAttribute("src")) return;
    urlRenovada = true; // o link do vídeo expirou: pega um novo e continua
    const pos = video.currentTime;
    await carregarVideo(pos);
  });

  video.addEventListener("ended", async () => {
    clearInterval(tickSalvar);
    atualizarBotoes();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    const aula = atualAula;
    if (isAdmin || feita(aula)) { mostrarConcluida(aula, true); return; }
    maxVisto = Math.max(maxVisto, video.duration || 0);
    ui.loading.hidden = false;
    let r = await salvarProgresso(true);
    if (!r?.concluida_em) { await new Promise((ok) => setTimeout(ok, 1500)); r = await salvarProgresso(true); }
    ui.loading.hidden = true;
    if (r?.concluida_em) {
      livre = true;
      player.classList.add("is-free");
      ui.lockinfo.hidden = true;
      mostrarConcluida(aula, true);
      renderTrilha();
      renderInfo();
    } else {
      toastPlayer("Não conseguimos registrar a conclusão. Verifique a internet e assista o finalzinho de novo.");
    }
  });

  // ---------- Tela de aula concluída ----------
  let concluidaEl = null;
  function fecharConcluida() { concluidaEl?.remove(); concluidaEl = null; }
  function mostrarConcluida(aula) {
    fecharConcluida();
    const prox = proxima(aula);
    const fimModulo = !prox || prox.modulo_id !== aula.modulo_id;
    const m = moduloDe(aula);
    concluidaEl = document.createElement("div");
    concluidaEl.className = "concluida";
    concluidaEl.innerHTML = `
      <div class="concluida__card" role="dialog" aria-label="Aula concluída">
        <img class="concluida__duck" src="../assets/images/pato-ovo-aberto-600.webp" width="150" height="182" alt="">
        <span class="concluida__badge">${ICONES.check.replace("<svg", '<svg width="14" height="14"')} Aula concluída</span>
        <h2>${fimModulo ? `Você concluiu o ${esc(m?.titulo || "módulo")}!` : `Mandou bem, ${primeiroNome}!`}</h2>
        <p>${prox ? (fimModulo ? "Mais um passo fora da casca. O próximo módulo já está liberado." : "A próxima aula já está liberada para você.") : "Você concluiu todas as aulas disponíveis. Novas aulas aparecem aqui assim que saírem da casca."}</p>
        <div class="concluida__acoes">
          ${prox ? `<button class="btn btn--live" type="button" data-prox>Assistir a próxima aula ${ICONES.next}</button>` : ""}
          <button class="btn btn--outline" type="button" data-rever>Assistir de novo</button>
        </div>
      </div>`;
    player.appendChild(concluidaEl);
    ui.big.hidden = true;
    concluidaEl.querySelector("[data-prox]")?.addEventListener("click", () => abrirAula(prox, true));
    concluidaEl.querySelector("[data-rever]").addEventListener("click", () => {
      fecharConcluida();
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    (concluidaEl.querySelector("[data-prox]") || concluidaEl.querySelector("[data-rever]")).focus();
  }

  // ---------- Início ----------
  const hash = Number((location.hash.match(/^#aula-(\d+)$/) || [])[1]);
  const pedida = aulas.find((a) => a.id === hash && liberada(a));
  const inicial = pedida || aulas.find((a) => liberada(a) && !feita(a)) || aulas[aulas.length - 1];
  atualAula = inicial;
  renderTrilha();
  abrirAula(inicial, false);
})();
