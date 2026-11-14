/* PATOX LIVE — Ligas da Ninhada e ranking */
(async function () {
  const P = window.PATOX;
  const { sb, esc, toast, exigirLogin, montarMenu, mesISO, nomeMes, numero, moeda, ligaPara, faixa, situacao, seloLiga } = P;
  const app = document.getElementById("app");

  const auth = await exigirLogin();
  if (!auth) return;
  const { perfil } = auth;
  const isAdmin = perfil.papel === "admin";
  montarMenu(perfil);

  const M0 = mesISO(0), M1 = mesISO(-1), M2 = mesISO(-2);

  const [rl, rd, rc] = await Promise.all([
    sb.from("ligas").select("*").order("min_diamantes"),
    sb.from("diamantes").select("mes, quantidade, sem_premio, motivo, atualizado_em").eq("user_id", perfil.id).in("mes", [M0, M1, M2]),
    sb.from("config").select("chave, valor"),
  ]);
  if (rl.error || !rl.data?.length) {
    app.innerHTML = `<div class="ranking"><div class="vazio"><h2>Não foi possível carregar as ligas</h2><p>Verifique sua internet e atualize a página.</p><button class="btn btn--primary" onclick="location.reload()">Tentar de novo</button></div></div>`;
    return;
  }
  const ligas = rl.data;
  const meus = new Map((rd.data || []).map((r) => [r.mes, r]));
  const cfg = Object.fromEntries((rc.data || []).map((r) => [r.chave, r.valor]));
  const q = (mes) => meus.get(mes)?.quantidade || 0;

  const sit = situacao(ligas, q(M1), q(M2), meus.get(M1)?.sem_premio);
  const ord = [...ligas].sort((a, b) => a.min_diamantes - b.min_diamantes);
  const primeiroNome = esc(perfil.nome.split(" ")[0]);

  const ICO_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const ICO_ALERTA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>';
  const SETA = { avancou: "↑ Avançou de liga", manteve: "= Manteve a liga", caiu: "↓ Caiu de liga" };

  // ---------- Minha liga ----------
  let blocoMinha = "";
  if (!isAdmin) {
    const semPremio = meus.get(M1)?.sem_premio;
    const obs = semPremio
      ? `Sem premiação neste mês${meus.get(M1)?.motivo ? ": " + esc(meus.get(M1).motivo) : "."}`
      : sit.tipo === "caiu" ? "Quem cai de liga fica sem premiação no mês. Bora recuperar!"
      : sit.premio > 0 ? `Por ter ${sit.tipo === "avancou" ? "avançado para" : "se mantido na liga"} ${esc(sit.liga.nome)}.`
      : "Suba de liga para começar a ganhar premiações.";
    blocoMinha = `
      <section class="minha-liga" style="--liga-cor:${sit.liga.cor}" aria-label="Sua liga">
        <div class="minha-liga__selo">${seloLiga(sit.liga, 112)}</div>
        <div>
          <div class="minha-liga__eyebrow">Sua liga em ${nomeMes(M0)}</div>
          <h2 class="minha-liga__nome">${esc(sit.liga.nome)}</h2>
          <div class="minha-liga__info">
            <span class="status status--${sit.tipo}">${SETA[sit.tipo]}</span>
            <span>${numero(q(M1))} diamantes em ${nomeMes(M1)}</span>
          </div>
        </div>
        <div class="premio">
          <div class="premio__label">Premiação do mês</div>
          <div class="premio__valor">${moeda(sit.premio)}</div>
          <div class="premio__obs">${obs}</div>
        </div>
      </section>`;
  }

  // ---------- Rumo à próxima liga ----------
  let blocoProxima = "";
  if (!isAdmin) {
    const qtd = q(M0);
    const ligaProx = ligaPara(ligas, qtd);
    const seguinte = ord[ord.indexOf(ligaProx) + 1];
    const atualizado = meus.get(M0)?.atualizado_em
      ? new Date(meus.get(M0).atualizado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Bahia" })
      : null;
    const pct = seguinte ? Math.min(100, Math.round(((qtd - ligaProx.min_diamantes) / (seguinte.min_diamantes - ligaProx.min_diamantes)) * 100)) : 100;
    blocoProxima = `
      <div class="card">
        <div class="card__head"><h2>Rumo à próxima liga</h2><span class="muted">${atualizado ? "Atualizado em " + atualizado : "Ainda sem lançamento"}</span></div>
        <div class="card__body proxima">
          <div>
            <span class="valor-label">Seus diamantes em ${nomeMes(M0)}</span>
            <div class="proxima__qtd">${numero(qtd)}</div>
          </div>
          <div class="proxima__linha">
            ${seloLiga(ligaProx, 44)}
            <div><span class="valor-label">Se o mês fechasse hoje, em ${nomeMes(mesISO(1))} você seria</span><strong>${esc(ligaProx.nome)}</strong></div>
          </div>
          ${seguinte ? `
            <div class="barra" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso até ${esc(seguinte.nome)}"><span style="width:${pct}%"></span></div>
            <div class="barra-legenda"><span>${esc(ligaProx.nome)}</span><span>${esc(seguinte.nome)}</span></div>
            <p>Faltam <strong>${numero(seguinte.min_diamantes - qtd)} diamantes</strong> para chegar em <strong>${esc(seguinte.nome)}</strong>. Bora pra LIVE, ${primeiroNome}!</p>`
          : `<p><strong>Você está no topo da lagoa!</strong> Mantenha o ritmo para continuar como ${esc(ligaProx.nome)}.</p>`}
          <span class="field__hint">Os diamantes são lançados pela equipe PATOX ao longo do mês.</span>
        </div>
      </div>`;
  }

  // ---------- Layout ----------
  app.innerHTML = `
    <div class="ranking">
      <div class="ranking__head">
        <h1>Ligas da Ninhada</h1>
        <p>${isAdmin ? "Assim os streamers veem as ligas e o ranking. Lance os diamantes no Painel da PATOX." : `Olá, ${primeiroNome}! Cada diamante conta: quanto mais alto você voa, maior a premiação.`}</p>
      </div>
      ${blocoMinha}
      <div class="duas-col">
        ${blocoProxima}
        <div class="card" ${isAdmin ? 'style="grid-column:1/-1"' : ""}>
          <div class="card__head">
            <h2>Ranking da ninhada</h2>
            <div class="meses" role="group" aria-label="Mês do ranking">
              <button type="button" data-mes="${M0}" aria-pressed="true">${nomeMes(M0)}</button>
              <button type="button" data-mes="${M1}" aria-pressed="false">${nomeMes(M1)}</button>
            </div>
          </div>
          <div data-ranking><div class="card__body muted">Carregando…</div></div>
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <h2>Ligas e premiações</h2>
          <span class="muted">Diamantes no mês anterior</span>
        </div>
        <ul class="ligas-lista" role="list">
          ${[...ord].reverse().map((l) => {
            const aqui = !isAdmin && l.id === sit.liga.id;
            const v = (n, cls) => `<span class="${Number(n) > 0 ? cls : "valor-zero"}">${moeda(n)}</span>`;
            return `<li class="liga-linha ${aqui ? "is-atual" : ""}">
              ${seloLiga(l, 44)}
              <div><div class="liga-linha__nome">${esc(l.nome)}${aqui ? '<span class="liga-linha__aqui">Você</span>' : ""}</div><div class="liga-linha__faixa">${faixa(ligas, l)} diamantes</div></div>
              <div><span class="valor-label">Avançou</span>${v(l.valor_avancou, "valor-avancou")}</div>
              <div><span class="valor-label">Manteve</span>${v(l.valor_manteve, "valor-manteve")}</div>
            </li>`;
          }).join("")}
        </ul>
      </div>

      <div class="nota">${ICO_CAL}<div><strong>Como funciona</strong>Sua liga é atualizada automaticamente no início de cada mês, com base nos diamantes que você conquistou no mês anterior. Subiu de liga? Você recebe o valor de “Avançou”. Ficou na mesma? Recebe o valor de “Manteve”.</div></div>
      ${cfg.aviso_ranking ? `<div class="nota nota--alerta">${ICO_ALERTA}<div><strong>Aviso importante</strong>${esc(cfg.aviso_ranking)}</div></div>` : ""}
    </div>`;

  // ---------- Ranking ----------
  const alvoRank = app.querySelector("[data-ranking]");
  async function carregarRanking(mes, cair) {
    app.querySelectorAll("[data-mes]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mes === mes)));
    alvoRank.innerHTML = '<div class="card__body muted">Carregando…</div>';
    const { data, error } = await sb.rpc("ranking_mes", { p_mes: mes });
    if (error) { alvoRank.innerHTML = '<div class="card__body"><div class="alert alert--erro">Não foi possível carregar o ranking.</div></div>'; return; }
    if (!data.length && cair) return carregarRanking(M1, false);
    if (!data.length) {
      alvoRank.innerHTML = `<div class="card__body muted">O ranking de ${nomeMes(mes)} ainda não tem diamantes lançados.</div>`;
      return;
    }
    const top = data.slice(0, 3);
    const eu = (r) => (r.sou_eu ? ' <span class="voce">Você</span>' : "");
    alvoRank.innerHTML = `
      <div class="podio">
        ${top.map((r, i) => {
          const l = ligaPara(ligas, r.quantidade);
          return `<div class="podio__item podio__item--${i + 1} ${r.sou_eu ? "is-eu" : ""}">
            ${seloLiga(l, i === 0 ? 56 : 44)}
            <div class="podio__nome">${esc(r.nome)}</div>
            <div class="podio__qtd">${numero(r.quantidade)}${r.sou_eu ? ' <span class="voce">Você</span>' : ""}</div>
            <div class="podio__base">${r.posicao}º</div>
          </div>`;
        }).join("")}
      </div>
      ${data.length > 3 ? `<ol class="rank-lista" role="list">
        ${data.slice(3).map((r) => {
          const l = ligaPara(ligas, r.quantidade);
          return `<li class="rank-item ${r.sou_eu ? "is-eu" : ""}">
            <span class="rank-item__pos">${r.posicao}º</span>
            ${seloLiga(l, 32)}
            <span style="min-width:0"><span class="rank-item__nome">${esc(r.nome)}${eu(r)}</span><span class="rank-item__liga">${esc(l.nome)}</span></span>
            <span class="rank-item__qtd">${numero(r.quantidade)}</span>
          </li>`;
        }).join("")}
      </ol>` : '<div style="height:.75rem"></div>'}`;
  }
  app.querySelectorAll("[data-mes]").forEach((b) => b.addEventListener("click", () => carregarRanking(b.dataset.mes)));
  carregarRanking(M0, true);
})();
