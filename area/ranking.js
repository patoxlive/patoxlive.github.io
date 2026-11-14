/* PATOX LIVE — Ligas da Ninhada e ranking (dados da planilha do TikTok, só leitura) */
(async function () {
  const P = window.PATOX;
  const { sb, esc, exigirLogin, montarMenu, mesISO, nomeMes, numero, moeda, ligaPara, faixa, situacao, seloLiga } = P;
  const app = document.getElementById("app");

  const auth = await exigirLogin();
  if (!auth) return;
  const { perfil } = auth;
  const isAdmin = perfil.papel === "admin";
  montarMenu(perfil);

  const M0 = mesISO(0), M1 = mesISO(-1), M2 = mesISO(-2);

  const [rl, rc, rcr, rdm, rpen, rult] = await Promise.all([
    sb.from("ligas").select("*").order("min_diamantes"),
    sb.from("config").select("chave, valor"),
    sb.from("criadores").select("id, usuario, user_id, ativo, ultima_live, seguidores"),
    sb.from("diamantes_mes").select("criador_id, mes, quantidade").in("mes", [M0, M1, M2]),
    sb.from("penalidades").select("criador_id, mes, motivo"),
    sb.from("desempenho").select("data, exportado_em").order("data", { ascending: false }).limit(1),
  ]);
  if (rl.error || !rl.data?.length) {
    app.innerHTML = `<div class="ranking"><div class="vazio"><h2>Não foi possível carregar as ligas</h2><p>Verifique sua internet e atualize a página.</p><button class="btn btn--primary" onclick="location.reload()">Tentar de novo</button></div></div>`;
    return;
  }
  const ligas = rl.data;
  const ord = [...ligas].sort((a, b) => a.min_diamantes - b.min_diamantes);
  const cfg = Object.fromEntries((rc.data || []).map((r) => [r.chave, r.valor]));
  const criadores = new Map((rcr.data || []).map((c) => [c.id, c]));
  const dm = new Map((rdm.data || []).map((r) => [r.criador_id + "|" + r.mes, r.quantidade]));
  const pen = new Map((rpen.data || []).map((r) => [r.criador_id + "|" + r.mes, r]));
  const eu = [...criadores.values()].find((c) => c.user_id === perfil.id) || null;
  const ultimaData = rult.data?.[0]?.data || null;
  const ultimaExport = rult.data?.[0]?.exportado_em || null;

  // Números da última planilha
  let fotos = [];
  if (ultimaData) {
    const { data } = await sb.from("desempenho").select("*").eq("data", ultimaData);
    fotos = (data || []).filter((f) => criadores.get(f.criador_id)?.ativo);
  }
  const minhaFoto = eu ? fotos.find((f) => f.criador_id === eu.id) : null;

  const primeiroNome = esc(perfil.nome.split(" ")[0]);
  const quando = ultimaExport
    ? new Date(ultimaExport).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Bahia" }).replace(",", " às")
    : null;
  const horas = (h) => Number(h || 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " h";

  const ICO_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const ICO_ALERTA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>';
  const ICO_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>';
  const SETA = { avancou: "↑ Avançou de liga", manteve: "= Manteve a liga", caiu: "↓ Caiu de liga" };

  // ---------- Minha liga ----------
  let blocoMinha = "", blocoProxima = "", blocoNumeros = "", blocoEvolucao = "";
  let ligaAtual = null;
  if (eu) {
    const p1 = pen.get(eu.id + "|" + M1);
    const sit = situacao(ligas, dm.get(eu.id + "|" + M1) || 0, dm.get(eu.id + "|" + M2) || 0, !!p1);
    ligaAtual = sit.liga;
    const obs = p1
      ? `Sem premiação neste mês${p1.motivo ? ": " + esc(p1.motivo) : "."}`
      : sit.tipo === "caiu" ? "Quem cai de liga fica sem premiação no mês. Bora recuperar!"
      : sit.premio > 0 ? `Por ter ${sit.tipo === "avancou" ? "avançado para" : "se mantido na liga"} ${esc(sit.liga.nome)}.`
      : "Suba de liga para começar a ganhar premiações.";
    blocoMinha = `
      <section class="minha-liga" style="--liga-cor:${sit.liga.cor}" aria-label="Sua liga">
        <div class="minha-liga__selo">${seloLiga(sit.liga, 112)}</div>
        <div>
          <div class="minha-liga__eyebrow">Sua liga em ${nomeMes(M0)} · @${esc(eu.usuario)}</div>
          <h2 class="minha-liga__nome">${esc(sit.liga.nome)}</h2>
          <div class="minha-liga__info">
            <span class="status status--${sit.tipo}">${SETA[sit.tipo]}</span>
            <span>${numero(dm.get(eu.id + "|" + M1) || 0)} diamantes em ${nomeMes(M1)}</span>
          </div>
        </div>
        <div class="premio">
          <div class="premio__label">Premiação do mês</div>
          <div class="premio__valor">${moeda(sit.premio)}</div>
          <div class="premio__obs">${obs}</div>
        </div>
      </section>`;

    const f = minhaFoto || {};
    blocoNumeros = `
      <div class="numeros" aria-label="Seus números nos últimos 30 dias">
        <div class="numero-card"><span class="valor-label">Diamantes</span><strong>${numero(f.diamantes)}</strong><small>últimos 30 dias</small></div>
        <div class="numero-card"><span class="valor-label">Horas de LIVE</span><strong>${horas(f.horas_live)}</strong><small>últimos 30 dias</small></div>
        <div class="numero-card"><span class="valor-label">Dias válidos de LIVE</span><strong>${numero(f.dias_validos)}</strong><small>últimos 30 dias</small></div>
        <div class="numero-card"><span class="valor-label">Fãs ativos no Fã-clube</span><strong>${numero(f.fas_ativos)}</strong><small>${numero(f.seguidores ?? eu.seguidores)} seguidores</small></div>
      </div>`;

    const qtd = f.diamantes || 0;
    const ligaProx = ligaPara(ligas, qtd);
    const seguinte = ord[ord.indexOf(ligaProx) + 1];
    const pct = seguinte ? Math.min(100, Math.round(((qtd - ligaProx.min_diamantes) / (seguinte.min_diamantes - ligaProx.min_diamantes)) * 100)) : 100;
    blocoProxima = `
      <div class="card">
        <div class="card__head"><h2>Rumo à próxima liga</h2><span class="muted">${quando ? "Atualizado em " + quando : "Aguardando a primeira atualização"}</span></div>
        <div class="card__body proxima">
          <div class="proxima__linha">
            ${seloLiga(ligaProx, 44)}
            <div><span class="valor-label">Se o mês fechasse hoje, em ${nomeMes(mesISO(1))} você seria</span><strong>${esc(ligaProx.nome)}</strong></div>
          </div>
          ${seguinte ? `
            <div class="barra" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso até ${esc(seguinte.nome)}"><span style="width:${pct}%"></span></div>
            <div class="barra-legenda"><span>${esc(ligaProx.nome)}</span><span>${esc(seguinte.nome)}</span></div>
            <p>Faltam <strong>${numero(seguinte.min_diamantes - qtd)} diamantes</strong> para chegar em <strong>${esc(seguinte.nome)}</strong>. Bora pra LIVE, ${primeiroNome}!</p>`
          : `<p><strong>Você está no topo da lagoa!</strong> Mantenha o ritmo para continuar como ${esc(ligaProx.nome)}.</p>`}
          <span class="field__hint">Conta o total de diamantes dos últimos 30 dias, como o TikTok mostra. A liga do mês seguinte usa o número do último dia do mês.</span>
        </div>
      </div>`;

    blocoEvolucao = `
      <div class="card">
        <div class="card__head"><h2>Sua evolução</h2><span class="muted">Diamantes dos últimos 30 dias, dia a dia</span></div>
        <div class="card__body" data-evolucao><span class="muted">Carregando…</span></div>
      </div>`;
  } else if (!isAdmin) {
    blocoMinha = `<div class="nota">${ICO_LINK}<div><strong>Seu acesso ainda não está ligado ao seu TikTok</strong>Fale com a PATOX para conectar sua conta. Enquanto isso, você já pode acompanhar o ranking da ninhada.</div></div>`;
  }

  // ---------- Layout ----------
  app.innerHTML = `
    <div class="ranking">
      <div class="ranking__head">
        <h1>Ligas da Ninhada</h1>
        <p>${isAdmin ? "É assim que os streamers veem as ligas e o ranking. Os números vêm da planilha do TikTok importada no Painel da PATOX." : `Olá, ${primeiroNome}! Cada diamante conta: quanto mais alto você voa, maior a premiação.`}</p>
      </div>
      ${blocoMinha}
      ${blocoNumeros}
      ${eu ? `<div class="duas-col">${blocoProxima}${blocoEvolucao}</div>` : ""}

      <div class="card">
        <div class="card__head">
          <div>
            <h2>Ranking da ninhada</h2>
            <span class="muted">Últimos 30 dias${quando ? " · atualizado em " + quando : ""}</span>
          </div>
          <div class="meses" role="group" aria-label="Ordenar ranking por">
            <button type="button" data-met="diamantes" aria-pressed="true">Diamantes</button>
            <button type="button" data-met="horas_live" aria-pressed="false">Horas de LIVE</button>
            <button type="button" data-met="dias_validos" aria-pressed="false">Dias de LIVE</button>
          </div>
        </div>
        <div data-ranking></div>
      </div>

      <div class="card">
        <div class="card__head">
          <h2>Ligas e premiações</h2>
          <span class="muted">Diamantes no mês anterior</span>
        </div>
        <ul class="ligas-lista" role="list">
          ${[...ord].reverse().map((l) => {
            const aqui = ligaAtual && l.id === ligaAtual.id;
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

      <div class="nota">${ICO_CAL}<div><strong>Como funciona</strong>Os números vêm do painel da agência no TikTok e são atualizados todos os dias pela equipe PATOX. Sua liga muda no início de cada mês, com base nos diamantes do mês anterior. Subiu de liga? Você recebe o valor de “Avançou”. Ficou na mesma? Recebe o valor de “Manteve”.</div></div>
      ${cfg.aviso_ranking ? `<div class="nota nota--alerta">${ICO_ALERTA}<div><strong>Aviso importante</strong>${esc(cfg.aviso_ranking)}</div></div>` : ""}
    </div>`;

  // ---------- Ranking ----------
  const alvoRank = app.querySelector("[data-ranking]");
  const FMT = { diamantes: numero, horas_live: horas, dias_validos: (n) => numero(n) + (Number(n) === 1 ? " dia" : " dias") };
  function renderRanking(met) {
    app.querySelectorAll("[data-met]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.met === met)));
    if (!fotos.length) { alvoRank.innerHTML = '<div class="card__body muted">O ranking aparece assim que a PATOX importar a primeira planilha.</div>'; return; }
    const lista = fotos
      .filter((f) => Number(f[met]) > 0)
      .sort((a, b) => Number(b[met]) - Number(a[met]) || b.diamantes - a.diamantes);
    const semNada = fotos.length - lista.length;
    if (!lista.length) { alvoRank.innerHTML = '<div class="card__body muted">Ninguém pontuou aqui ainda.</div>'; return; }
    let pos = 0, ant = null;
    lista.forEach((f, i) => { if (Number(f[met]) !== ant) { pos = i + 1; ant = Number(f[met]); } f._pos = pos; });
    const max = Number(lista[0][met]) || 1;
    const nome = (f) => "@" + esc(criadores.get(f.criador_id)?.usuario || "?");
    const souEu = (f) => eu && f.criador_id === eu.id;
    const top = lista.slice(0, 3);
    alvoRank.innerHTML = `
      <div class="podio">
        ${top.map((f, i) => `<div class="podio__item podio__item--${i + 1} ${souEu(f) ? "is-eu" : ""}">
            ${seloLiga(ligaPara(ligas, f.diamantes), i === 0 ? 56 : 44)}
            <div class="podio__nome" title="${nome(f)}">${nome(f)}</div>
            <div class="podio__qtd">${FMT[met](f[met])}${souEu(f) ? ' <span class="voce">Você</span>' : ""}</div>
            <div class="podio__base">${f._pos}º</div>
          </div>`).join("")}
      </div>
      ${lista.length > 3 ? `<ol class="rank-lista" role="list">
        ${lista.slice(3).map((f) => {
          const l = ligaPara(ligas, f.diamantes);
          return `<li class="rank-item ${souEu(f) ? "is-eu" : ""}">
            <span class="rank-item__pos">${f._pos}º</span>
            ${seloLiga(l, 32)}
            <span style="min-width:0">
              <span class="rank-item__nome">${nome(f)}${souEu(f) ? ' <span class="voce">Você</span>' : ""}</span>
              <span class="rank-bar"><span style="width:${Math.max(2, (Number(f[met]) / max) * 100)}%"></span></span>
            </span>
            <span class="rank-item__qtd">${FMT[met](f[met])}</span>
          </li>`;
        }).join("")}
      </ol>` : '<div style="height:.75rem"></div>'}
      <div class="card__body muted" style="border-top:1px solid var(--lilac-100);font-size:.85rem">
        O selo mostra a liga que cada um teria se o mês fechasse hoje.${semNada ? ` ${semNada} ${semNada === 1 ? "pessoa ainda não pontuou" : "pessoas ainda não pontuaram"} aqui.` : ""}
      </div>`;
  }
  app.querySelectorAll("[data-met]").forEach((b) => b.addEventListener("click", () => renderRanking(b.dataset.met)));
  renderRanking("diamantes");

  // ---------- Evolução (gráfico) ----------
  if (eu) {
    const alvo = app.querySelector("[data-evolucao]");
    const { data } = await sb.from("desempenho").select("data, diamantes").eq("criador_id", eu.id).order("data").limit(400);
    const pts = (data || []).slice(-45);
    if (pts.length < 2) {
      alvo.innerHTML = `<p class="muted">O gráfico aparece a partir da segunda atualização da planilha. Volte amanhã para ver sua linha subindo!</p>`;
    } else {
      const W = 560, H = 200, pl = 8, pr = 8, pt = 16, pb = 26;
      const vmax = Math.max(...pts.map((p) => p.diamantes), 1);
      const x = (i) => pl + (i / (pts.length - 1)) * (W - pl - pr);
      const y = (v) => pt + (1 - v / vmax) * (H - pt - pb);
      const linha = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.diamantes).toFixed(1)}`).join(" ");
      const area = `${linha} L${x(pts.length - 1).toFixed(1)},${H - pb} L${x(0).toFixed(1)},${H - pb} Z`;
      const d = (s) => s.slice(8, 10) + "/" + s.slice(5, 7);
      const ult = pts[pts.length - 1], pri = pts[0];
      const dif = ult.diamantes - pts[pts.length - 2].diamantes;
      alvo.innerHTML = `
        <div class="evolucao__topo"><strong>${numero(ult.diamantes)}</strong> <span class="${dif >= 0 ? "valor-avancou" : "muted"}">${dif >= 0 ? "▲" : "▼"} ${numero(Math.abs(dif))} desde a atualização anterior</span></div>
        <svg class="evolucao" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico dos seus diamantes, de ${d(pri.data)} a ${d(ult.data)}">
          <defs><linearGradient id="evoArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E91E56" stop-opacity=".28"/><stop offset="1" stop-color="#E91E56" stop-opacity="0"/></linearGradient></defs>
          <line x1="${pl}" x2="${W - pr}" y1="${H - pb}" y2="${H - pb}" stroke="currentColor" stroke-opacity=".15"/>
          <path d="${area}" fill="url(#evoArea)"/>
          <path d="${linha}" fill="none" stroke="#E91E56" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
          <circle cx="${x(pts.length - 1)}" cy="${y(ult.diamantes)}" r="5" fill="#E91E56" stroke="#fff" stroke-width="2"/>
          <text x="${pl}" y="${H - 6}" font-size="12" fill="currentColor" opacity=".6">${d(pri.data)}</text>
          <text x="${W - pr}" y="${H - 6}" font-size="12" fill="currentColor" opacity=".6" text-anchor="end">${d(ult.data)}</text>
        </svg>`;
    }
  }
})();
