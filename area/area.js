/* PATOX LIVE — Área do Streamer: configuração e utilidades compartilhadas */
(function () {
  const SUPABASE_URL = "https://sojlcwkexexiqbmfzdab.supabase.co";
  const SUPABASE_KEY = "sb_publishable_15lzVe-gSg1JlRFKxd4keA_m3Kjo-RW";
  const DOMINIO_LOGIN = "streamer.patoxlive.github.io";
  const WHATSAPP = "https://wa.me/5575983383718?text=" + encodeURIComponent("Olá, PATOX LIVE! Preciso de ajuda com o acesso à Área do Streamer.");

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "patox-area" },
  });

  const ICONES = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"/></svg>',
    back10: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4.5h4.5"/><text x="12" y="15.6" text-anchor="middle" font-size="8.5" font-weight="800" fill="currentColor" stroke="none" font-family="Arial, sans-serif">10</text></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    egg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c-3.9 0-7 6.2-7 11 0 4.3 3.1 8 7 8s7-3.7 7-8c0-4.8-3.1-11-7-11Z" opacity=".9"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  function loginParaEmail(valor) {
    const v = String(valor || "").trim().toLowerCase().replace(/^@/, "");
    return v.includes("@") ? v : `${v}@${DOMINIO_LOGIN}`;
  }

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function tempo(seg) {
    seg = Math.max(0, Math.floor(seg || 0));
    const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    const mm = h ? String(m).padStart(2, "0") : String(m);
    return (h ? h + ":" : "") + mm + ":" + String(s).padStart(2, "0");
  }

  function duracaoTexto(seg) {
    if (!seg) return "";
    const m = Math.round(seg / 60);
    return m < 1 ? "menos de 1 min" : m + " min";
  }

  function iniciais(nome) {
    const p = String(nome || "?").trim().split(/\s+/);
    return ((p[0] || "?")[0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  }

  let toastTimer;
  function toast(msg, erro) {
    let el = document.querySelector(".toast-global");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast-global";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.toggle("is-erro", !!erro);
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 3800);
  }

  // Garante sessão + perfil ativo. Redireciona para o login se não houver.
  async function exigirLogin(opcoes = {}) {
    const { data } = await sb.auth.getSession();
    const sessao = data.session;
    if (!sessao) { location.replace("./?voltar=" + encodeURIComponent(location.pathname.split("/").pop())); return null; }
    const { data: perfil } = await sb.from("profiles").select("id, nome, login, papel, ativo").eq("id", sessao.user.id).maybeSingle();
    if (!perfil || !perfil.ativo) {
      await sb.auth.signOut();
      location.replace("./?motivo=bloqueado");
      return null;
    }
    if (opcoes.admin && perfil.papel !== "admin") { location.replace("curso.html"); return null; }
    return { sessao, perfil };
  }

  function montarMenu(perfil) {
    const alvo = document.querySelector("[data-user-menu]");
    if (!alvo) return;
    const admin = perfil.papel === "admin";
    const naAdmin = location.pathname.endsWith("admin.html");
    alvo.innerHTML = `
      <div class="user-menu">
        <button class="user-menu__btn" type="button" aria-haspopup="true" aria-expanded="false">
          <span class="user-menu__avatar" aria-hidden="true">${esc(iniciais(perfil.nome))}</span>
          <span class="user-menu__name">${esc(perfil.nome.split(" ")[0])}</span>
        </button>
        <div class="user-menu__list" hidden>
          ${admin ? (naAdmin ? '<a href="curso.html">Ver as aulas</a>' : '<a href="admin.html">Painel da PATOX</a>') : ""}
          <button type="button" data-acao="senha">Trocar minha senha</button>
          <a href="../">Voltar ao site</a>
          <hr>
          <button type="button" data-acao="sair">Sair</button>
        </div>
      </div>`;
    const btn = alvo.querySelector(".user-menu__btn");
    const lista = alvo.querySelector(".user-menu__list");
    const fechar = () => { lista.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      lista.hidden = !lista.hidden;
      btn.setAttribute("aria-expanded", String(!lista.hidden));
    });
    document.addEventListener("click", fechar);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
    alvo.querySelector('[data-acao="sair"]').addEventListener("click", async () => {
      await sb.auth.signOut();
      location.replace("./");
    });
    alvo.querySelector('[data-acao="senha"]').addEventListener("click", () => { fechar(); abrirTrocaSenha(); });
  }

  function abrirTrocaSenha() {
    let dlg = document.getElementById("dlg-senha");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "dlg-senha";
      dlg.className = "modal";
      dlg.innerHTML = `
        <form class="modal__body" method="dialog">
          <h2>Trocar minha senha</h2>
          <div class="field">
            <label for="nova-senha">Nova senha</label>
            <input class="input" id="nova-senha" type="password" minlength="6" autocomplete="new-password" required>
            <span class="field__hint">Mínimo de 6 caracteres.</span>
          </div>
          <div class="field">
            <label for="nova-senha2">Repita a nova senha</label>
            <input class="input" id="nova-senha2" type="password" minlength="6" autocomplete="new-password" required>
          </div>
          <div class="alert alert--erro" data-erro hidden></div>
          <div class="modal__acoes">
            <button class="btn btn--ghost btn--sm" type="button" data-cancelar>Cancelar</button>
            <button class="btn btn--primary btn--sm" type="submit">Salvar senha</button>
          </div>
        </form>`;
      document.body.appendChild(dlg);
      const form = dlg.querySelector("form");
      const erro = dlg.querySelector("[data-erro]");
      dlg.querySelector("[data-cancelar]").addEventListener("click", () => dlg.close());
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const s1 = form.querySelector("#nova-senha").value;
        const s2 = form.querySelector("#nova-senha2").value;
        erro.hidden = true;
        if (s1.length < 6) { erro.textContent = "A senha precisa ter pelo menos 6 caracteres."; erro.hidden = false; return; }
        if (s1 !== s2) { erro.textContent = "As duas senhas não são iguais."; erro.hidden = false; return; }
        const { error } = await sb.auth.updateUser({ password: s1 });
        if (error) {
          erro.textContent = error.message.includes("different") ? "A nova senha precisa ser diferente da atual." : "Não foi possível trocar a senha. Tente de novo.";
          erro.hidden = false;
          return;
        }
        form.reset();
        dlg.close();
        toast("Senha trocada com sucesso!");
      });
    }
    dlg.showModal();
  }

  window.PATOX = { sb, ICONES, WHATSAPP, SUPABASE_URL, SUPABASE_KEY, loginParaEmail, esc, tempo, duracaoTexto, iniciais, toast, exigirLogin, montarMenu };
})();
