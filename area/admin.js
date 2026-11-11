/* PATOX LIVE — Painel da equipe */
(async function () {
  const { sb, ICONES, SUPABASE_URL, SUPABASE_KEY, esc, duracaoTexto, toast, exigirLogin, montarMenu } = window.PATOX;
  const auth = await exigirLogin({ admin: true });
  if (!auth) return;
  const { perfil } = auth;
  montarMenu(perfil);
  document.getElementById("app").hidden = false;

  const $ = (id) => document.getElementById(id);
  const LIMITE_MB = 50;
  const AREA_URL = new URL("./", location.href).href;

  // ---------- Abas ----------
  const abas = { streamers: $("t-streamers"), aulas: $("t-aulas") };
  function abrirAba(nome) {
    for (const [k, b] of Object.entries(abas)) {
      const on = k === nome;
      b.setAttribute("aria-selected", String(on));
      $("tab-" + k).hidden = !on;
    }
    try { localStorage.setItem("patox-admin-aba", nome); } catch (_) {}
  }
  abas.streamers.addEventListener("click", () => abrirAba("streamers"));
  abas.aulas.addEventListener("click", () => abrirAba("aulas"));
  try { const a = localStorage.getItem("patox-admin-aba"); if (a && abas[a]) abrirAba(a); } catch (_) {}

  // ---------- Confirmação ----------
  function confirmar({ titulo, texto, botao = "Confirmar", perigo = false, campo = null }) {
    const dlg = $("dlg-confirma");
    $("c-titulo").textContent = titulo;
    $("c-texto").textContent = texto || "";
    const ok = $("c-ok");
    ok.textContent = botao;
    ok.className = "btn btn--sm " + (perigo ? "btn--danger" : "btn--primary");
    $("c-campo").hidden = !campo;
    if (campo) { $("c-label").textContent = campo.label; $("c-input").value = campo.valor || ""; }
    dlg.returnValue = "";
    dlg.showModal();
    if (campo) setTimeout(() => $("c-input").select(), 30);
    return new Promise((res) => {
      dlg.addEventListener("close", function f() {
        dlg.removeEventListener("close", f);
        if (dlg.returnValue !== "sim") return res(null);
        res(campo ? $("c-input").value : true);
      });
    });
  }

  async function chamar(corpo) {
    const { data, error } = await sb.functions.invoke("admin-usuarios", { body: corpo });
    if (error) {
      let msg = "Algo deu errado. Tente de novo.";
      try { const j = await error.context.json(); if (j?.erro) msg = j.erro; } catch (_) {}
      throw new Error(msg);
    }
    if (data?.erro) throw new Error(data.erro);
    return data;
  }

  function gerarSenha() {
    const a = "abcdefghjkmnpqrstuvwxyz23456789";
    const r = crypto.getRandomValues(new Uint32Array(6));
    return "pato" + Array.from(r, (n) => a[n % a.length]).join("");
  }

  // ---------- Streamers ----------
  $("n-senha").value = gerarSenha();
  $("n-gerar").addEventListener("click", () => { $("n-senha").value = gerarSenha(); });

  $("form-novo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const erro = $("n-erro"), btn = $("n-btn");
    erro.hidden = true;
    const nome = $("n-nome").value.trim();
    const login = $("n-login").value.trim().toLowerCase().replace(/^@/, "");
    const senha = $("n-senha").value;
    const papel = $("n-papel").value;
    if (!nome || !login || senha.length < 6) {
      erro.textContent = "Preencha nome, usuário e uma senha com pelo menos 6 caracteres.";
      erro.hidden = false; return;
    }
    btn.disabled = true; btn.textContent = "Cadastrando…";
    try {
      await chamar({ acao: "criar", nome, login, senha, papel });
      mostrarMensagem(nome, login, senha);
      $("form-novo").reset();
      $("n-senha").value = gerarSenha();
      toast(`${nome.split(" ")[0]} foi cadastrado(a)!`);
      carregarStreamers();
    } catch (err) {
      erro.textContent = err.message; erro.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = "Cadastrar";
    }
  });

  function mostrarMensagem(nome, login, senha) {
    const pn = nome.split(" ")[0];
    $("msg-texto").value =
`Oi, ${pn}! Tudo bem? 💜

Seu acesso à Área do Streamer da PATOX LIVE está liberado! Lá você vai encontrar as aulas que preparamos para você evoluir nas suas lives.

🔗 Acesse: ${AREA_URL}
👤 Usuário: ${login}
🔑 Senha: ${senha}

Dica: depois de entrar, você pode trocar a senha clicando no seu nome, lá no topo.

As aulas vão liberando uma por uma: é só assistir até o final para destravar a próxima. Qualquer dúvida, chama a gente aqui! 🐣`;
    $("msg-pronta").hidden = false;
    $("msg-pronta").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  $("msg-copiar").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("msg-texto").value); }
    catch (_) { $("msg-texto").select(); document.execCommand("copy"); }
    toast("Mensagem copiada! É só colar no WhatsApp.");
  });

  let totalAulasPublicadas = 0;
  async function carregarStreamers() {
    const [p, pr, au] = await Promise.all([
      sb.from("profiles").select("id, nome, login, papel, ativo, criado_em").order("criado_em", { ascending: false }),
      sb.from("progresso").select("user_id, aula_id, concluida_em").not("concluida_em", "is", null),
      sb.from("aulas").select("id, publicado, modulos!inner(publicado)").eq("publicado", true).eq("modulos.publicado", true),
    ]);
    const alvo = $("lista-streamers");
    if (p.error) { alvo.innerHTML = '<div class="card__body"><div class="alert alert--erro">Não foi possível carregar a lista.</div></div>'; return; }
    const validas = new Set((au.data || []).map((a) => a.id));
    totalAulasPublicadas = validas.size;
    const feitas = new Map();
    for (const r of pr.data || []) if (validas.has(r.aula_id)) feitas.set(r.user_id, (feitas.get(r.user_id) || 0) + 1);

    const streamers = p.data.filter((x) => x.papel === "streamer").length;
    $("contagem").textContent = `${streamers} streamer${streamers === 1 ? "" : "s"}`;

    if (!p.data.length) { alvo.innerHTML = '<div class="card__body muted">Ninguém cadastrado ainda.</div>'; return; }
    alvo.innerHTML = `
      <table class="tabela">
        <thead><tr><th>Nome</th><th>Usuário</th><th>Progresso</th><th>Situação</th><th><span class="visually-hidden">Ações</span></th></tr></thead>
        <tbody>
          ${p.data.map((u) => {
            const eu = u.id === perfil.id;
            const n = feitas.get(u.id) || 0;
            const pct = totalAulasPublicadas ? Math.round((n / totalAulasPublicadas) * 100) : 0;
            return `<tr>
              <td><strong>${esc(u.nome)}</strong>${u.papel === "admin" ? ' <span class="chip">Equipe</span>' : ""}</td>
              <td class="muted">${esc(u.login)}</td>
              <td>${u.papel === "admin" ? '<span class="muted">—</span>' : `<span class="mini-meter"><span class="mini-meter__bar"><span style="width:${pct}%"></span></span>${n}/${totalAulasPublicadas}</span>`}</td>
              <td>${u.ativo ? '<span class="chip chip--ok">Ativo</span>' : '<span class="chip chip--live">Pausado</span>'}</td>
              <td><div class="tabela__acoes">
                <button class="btn btn--outline btn--sm" data-acao="senha" data-id="${u.id}" data-nome="${esc(u.nome)}" data-login="${esc(u.login)}">Nova senha</button>
                ${eu ? "" : `<button class="btn btn--outline btn--sm" data-acao="status" data-id="${u.id}" data-nome="${esc(u.nome)}" data-ativo="${u.ativo}">${u.ativo ? "Pausar" : "Reativar"}</button>
                <button class="btn btn--danger btn--sm" data-acao="excluir" data-id="${u.id}" data-nome="${esc(u.nome)}">Excluir</button>`}
              </div></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>`;
  }

  $("lista-streamers").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    const { acao, id, nome } = b.dataset;
    try {
      if (acao === "senha") {
        const nova = await confirmar({ titulo: `Nova senha para ${nome}`, texto: "Envie a nova senha para a pessoa depois de salvar.", botao: "Salvar senha", campo: { label: "Nova senha", valor: gerarSenha() } });
        if (nova == null) return;
        if (nova.length < 6) { toast("A senha precisa ter pelo menos 6 caracteres.", true); return; }
        await chamar({ acao: "senha", id, senha: nova });
        if (id === perfil.id) toast("Sua senha foi trocada.");
        else { mostrarMensagem(nome, b.dataset.login, nova); toast("Senha trocada! A mensagem pronta está logo acima."); }
      }
      if (acao === "status") {
        const ativo = b.dataset.ativo !== "true";
        const ok = await confirmar({
          titulo: ativo ? `Reativar ${nome}?` : `Pausar o acesso de ${nome}?`,
          texto: ativo ? "A pessoa volta a entrar e continua de onde parou." : "A pessoa não consegue mais entrar até você reativar. O progresso fica guardado.",
          botao: ativo ? "Reativar" : "Pausar acesso", perigo: !ativo,
        });
        if (!ok) return;
        await chamar({ acao: "status", id, ativo });
        toast(ativo ? "Acesso reativado." : "Acesso pausado.");
      }
      if (acao === "excluir") {
        const ok = await confirmar({ titulo: `Excluir ${nome}?`, texto: "A conta e todo o progresso nas aulas serão apagados. Não dá para desfazer.", botao: "Excluir de vez", perigo: true });
        if (!ok) return;
        await chamar({ acao: "excluir", id });
        toast("Conta excluída.");
      }
      carregarStreamers();
    } catch (err) { toast(err.message, true); }
  });

  // ---------- Aulas ----------
  let modulos = [], aulas = [];
  async function carregarAulas() {
    const [m, a] = await Promise.all([
      sb.from("modulos").select("*").order("ordem").order("id"),
      sb.from("aulas").select("*").order("ordem").order("id"),
    ]);
    modulos = m.data || []; aulas = a.data || [];
    renderModulos();
  }

  function renderModulos() {
    const alvo = $("lista-modulos");
    if (!modulos.length) { alvo.innerHTML = '<div class="vazio"><h2>Nenhum módulo ainda</h2><p>Crie o primeiro módulo para começar a adicionar aulas.</p></div>'; return; }
    alvo.innerHTML = modulos.map((m, mi) => {
      const lista = aulas.filter((a) => a.modulo_id === m.id);
      return `
      <div class="card" style="margin-bottom:1.25rem">
        <div class="card__head">
          <div>
            <h2>${esc(m.titulo)} ${m.publicado ? "" : '<span class="chip chip--live">Oculto</span>'}</h2>
            <span class="muted">${lista.length} aula${lista.length === 1 ? "" : "s"}${m.descricao ? " · " + esc(m.descricao) : ""}</span>
          </div>
          <div class="tabela__acoes">
            <button class="btn btn--outline btn--sm" data-m="editar" data-id="${m.id}">Editar módulo</button>
            ${modulos.length > 1 && !lista.length ? `<button class="btn btn--danger btn--sm" data-m="excluir" data-id="${m.id}">Excluir</button>` : ""}
            <button class="btn btn--primary btn--sm" data-m="nova" data-id="${m.id}">+ Adicionar aula</button>
          </div>
        </div>
        ${lista.length ? lista.map((a, i) => `
          <div class="aula-row">
            <div class="aula-row__ord">
              <button type="button" data-a="subir" data-id="${a.id}" aria-label="Subir" ${i === 0 ? "disabled" : ""}>${ICONES.up}</button>
              <button type="button" data-a="descer" data-id="${a.id}" aria-label="Descer" ${i === lista.length - 1 ? "disabled" : ""}>${ICONES.down}</button>
            </div>
            <div>
              <div class="aula-row__title">Aula ${i + 1} · ${esc(a.titulo)}</div>
              <div class="aula-row__meta">
                ${a.video_path ? `<span class="chip chip--ok">Vídeo enviado${a.duracao_seg ? " · " + duracaoTexto(a.duracao_seg) : ""}</span>` : '<span class="chip chip--live">Sem vídeo</span>'}
                ${a.publicado ? "" : '<span class="chip">Oculta</span>'}
              </div>
            </div>
            <div class="tabela__acoes">
              <button class="btn btn--outline btn--sm" data-a="editar" data-id="${a.id}">Editar</button>
              <button class="btn btn--danger btn--sm" data-a="excluir" data-id="${a.id}">Excluir</button>
            </div>
          </div>`).join("") : '<div class="card__body muted">Nenhuma aula neste módulo ainda. Clique em “Adicionar aula”.</div>'}
      </div>`;
    }).join("");
  }

  $("lista-modulos").addEventListener("click", async (e) => {
    const bm = e.target.closest("[data-m]"), ba = e.target.closest("[data-a]");
    try {
      if (bm) {
        const m = modulos.find((x) => x.id === Number(bm.dataset.id));
        if (bm.dataset.m === "nova") abrirAula(null, m);
        if (bm.dataset.m === "editar") abrirModulo(m);
        if (bm.dataset.m === "excluir") {
          if (!(await confirmar({ titulo: `Excluir ${m.titulo}?`, botao: "Excluir", perigo: true }))) return;
          const { error } = await sb.from("modulos").delete().eq("id", m.id);
          if (error) throw error;
          carregarAulas();
        }
      }
      if (ba) {
        const a = aulas.find((x) => x.id === Number(ba.dataset.id));
        const irmas = aulas.filter((x) => x.modulo_id === a.modulo_id);
        if (ba.dataset.a === "editar") abrirAula(a, modulos.find((m) => m.id === a.modulo_id));
        if (ba.dataset.a === "subir" || ba.dataset.a === "descer") {
          const i = irmas.indexOf(a), j = ba.dataset.a === "subir" ? i - 1 : i + 1;
          if (j < 0 || j >= irmas.length) return;
          [irmas[i], irmas[j]] = [irmas[j], irmas[i]];
          await Promise.all(irmas.map((x, k) => sb.from("aulas").update({ ordem: k + 1 }).eq("id", x.id)));
          await carregarAulas();
          carregarStreamers();
        }
        if (ba.dataset.a === "excluir") {
          const ok = await confirmar({ titulo: `Excluir “${a.titulo}”?`, texto: "O vídeo e o progresso dos streamers nesta aula serão apagados. Não dá para desfazer.", botao: "Excluir aula", perigo: true });
          if (!ok) return;
          const { error } = await sb.from("aulas").delete().eq("id", a.id);
          if (error) throw error;
          if (a.video_path) await sb.storage.from("aulas").remove([a.video_path]);
          toast("Aula excluída.");
          await carregarAulas();
          carregarStreamers();
        }
      }
    } catch (err) { toast(err.message || "Algo deu errado.", true); }
  });

  // Módulo
  let moduloEditando = null;
  function abrirModulo(m) {
    moduloEditando = m;
    $("m-dlg-titulo").textContent = m ? "Editar módulo" : "Novo módulo";
    $("m-titulo").value = m ? m.titulo : `Módulo ${modulos.length + 1}`;
    $("m-desc").value = m?.descricao || "";
    $("m-pub").checked = m ? m.publicado : true;
    $("dlg-modulo").showModal();
  }
  $("novo-modulo").addEventListener("click", () => abrirModulo(null));
  $("m-cancelar").addEventListener("click", () => $("dlg-modulo").close());
  $("form-modulo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = { titulo: $("m-titulo").value.trim(), descricao: $("m-desc").value.trim(), publicado: $("m-pub").checked };
    if (!dados.titulo) return;
    const q = moduloEditando
      ? sb.from("modulos").update(dados).eq("id", moduloEditando.id)
      : sb.from("modulos").insert({ ...dados, ordem: (modulos.at(-1)?.ordem || 0) + 1 });
    const { error } = await q;
    if (error) { toast("Não foi possível salvar o módulo.", true); return; }
    $("dlg-modulo").close();
    toast("Módulo salvo.");
    carregarAulas();
    carregarStreamers();
  });

  // Aula
  let aulaEditando = null, moduloDaAula = null, arquivo = null, duracaoArquivo = null, enviando = false;
  function abrirAula(a, m) {
    aulaEditando = a; moduloDaAula = m; arquivo = null; duracaoArquivo = null;
    $("aula-dlg-titulo").textContent = a ? "Editar aula" : `Nova aula · ${m.titulo}`;
    $("a-titulo").value = a?.titulo || "";
    $("a-desc").value = a?.descricao || "";
    $("a-pub").checked = a ? a.publicado : true;
    $("a-video").value = "";
    $("a-drop-txt").textContent = a?.video_path ? "Trocar o vídeo (opcional)" : "Escolher vídeo (MP4)";
    $("a-drop-sub").textContent = `Até ${LIMITE_MB} MB. Dica: exporte em 720p para ficar leve.`;
    $("a-upload").hidden = true;
    $("a-erro").hidden = true;
    $("a-salvar").disabled = false;
    $("dlg-aula").showModal();
  }
  $("a-cancelar").addEventListener("click", () => { if (!enviando) $("dlg-aula").close(); });
  $("dlg-aula").addEventListener("cancel", (e) => { if (enviando) e.preventDefault(); });

  function lerDuracao(file) {
    return new Promise((res) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      const url = URL.createObjectURL(file);
      v.onloadedmetadata = () => { URL.revokeObjectURL(url); res(isFinite(v.duration) ? Math.round(v.duration) : null); };
      v.onerror = () => { URL.revokeObjectURL(url); res(null); };
      v.src = url;
    });
  }

  async function escolherArquivo(file) {
    const erro = $("a-erro");
    erro.hidden = true;
    if (!file) return;
    const mb = file.size / 1024 / 1024;
    if (mb > LIMITE_MB) {
      arquivo = null;
      erro.textContent = `Esse vídeo tem ${mb.toFixed(0)} MB e o limite é ${LIMITE_MB} MB. Exporte de novo em 720p (no CapCut, por exemplo) para deixar mais leve.`;
      erro.hidden = false;
      $("a-video").value = "";
      return;
    }
    arquivo = file;
    duracaoArquivo = await lerDuracao(file);
    $("a-drop-txt").textContent = file.name;
    $("a-drop-sub").textContent = `${mb.toFixed(1)} MB${duracaoArquivo ? " · " + duracaoTexto(duracaoArquivo) : ""} · clique para trocar`;
  }
  $("a-video").addEventListener("change", (e) => escolherArquivo(e.target.files[0]));
  const drop = $("a-drop");
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
  drop.addEventListener("drop", (e) => escolherArquivo(e.dataTransfer.files[0]));

  function enviarVideo(path, file) {
    return new Promise(async (res, rej) => {
      const { data } = await sb.auth.getSession();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/aulas/${path}`);
      xhr.setRequestHeader("Authorization", "Bearer " + data.session.access_token);
      xhr.setRequestHeader("apikey", SUPABASE_KEY);
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("cache-control", "3600");
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const p = Math.round((e.loaded / e.total) * 100);
        $("a-upbar").style.width = p + "%";
        $("a-uptxt").textContent = `Enviando vídeo… ${p}%`;
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? res() : rej(new Error(xhr.status === 413 ? `O vídeo passou de ${LIMITE_MB} MB.` : "Falha ao enviar o vídeo. Tente de novo.")));
      xhr.onerror = () => rej(new Error("A conexão caiu durante o envio. Tente de novo."));
      xhr.send(file);
    });
  }

  $("form-aula").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (enviando) return;
    const erro = $("a-erro");
    erro.hidden = true;
    const titulo = $("a-titulo").value.trim();
    if (!titulo) { erro.textContent = "Dê um título para a aula."; erro.hidden = false; return; }
    enviando = true;
    $("a-salvar").disabled = true;
    $("a-cancelar").disabled = true;
    try {
      const dados = { titulo, descricao: $("a-desc").value.trim(), publicado: $("a-pub").checked };
      let antigo = null;
      if (arquivo) {
        const ext = (arquivo.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
        const path = `modulo-${moduloDaAula.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        $("a-upload").hidden = false;
        $("a-upbar").style.width = "0%";
        await enviarVideo(path, arquivo);
        $("a-uptxt").textContent = "Vídeo enviado! Salvando aula…";
        antigo = aulaEditando?.video_path || null;
        dados.video_path = path;
        dados.duracao_seg = duracaoArquivo;
      }
      if (aulaEditando) {
        const { error } = await sb.from("aulas").update(dados).eq("id", aulaEditando.id);
        if (error) throw error;
        if (antigo) await sb.storage.from("aulas").remove([antigo]);
      } else {
        const irmas = aulas.filter((x) => x.modulo_id === moduloDaAula.id);
        const { error } = await sb.from("aulas").insert({ ...dados, modulo_id: moduloDaAula.id, ordem: (irmas.at(-1)?.ordem || 0) + 1 });
        if (error) throw error;
      }
      enviando = false;
      $("dlg-aula").close();
      toast("Aula salva!");
      await carregarAulas();
      carregarStreamers();
    } catch (err) {
      erro.textContent = err.message || "Não foi possível salvar a aula.";
      erro.hidden = false;
    } finally {
      enviando = false;
      $("a-salvar").disabled = false;
      $("a-cancelar").disabled = false;
    }
  });

  carregarStreamers();
  carregarAulas();
})();
