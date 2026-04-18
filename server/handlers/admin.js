// Blackout Casino — Admin Handler (server-side JS)
// Autenticacao, config CRUD, troca de senha
// SHA256 via MySQL SHA2() — FiveM JS nao tem crypto nativo
// IIFE: escopo isolado pra evitar conflito de const com panel.js

(function() {

const RESPONSE_EVENT = "casino:panel:response";

function dbQuery(sql, params) {
  return new Promise((resolve) => {
    exports.oxmysql.query(sql, params || [], (result) => {
      resolve(result);
    });
  });
}
function dbExecute(sql, params) {
  return new Promise((resolve) => {
    exports.oxmysql.execute(sql, params || [], (result) => {
      resolve(result);
    });
  });
}

function respond(src, cbId, data) {
  emitNet(RESPONSE_EVENT, src, cbId, data);
}

// Sessoes ativas: Map<source, { token, expiresAt }>
const sessions = new Map();
const LOCKOUT_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 15 * 60 * 1000;

function generateToken() {
  const chars = "abcdef0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function isValidSession(src, token) {
  const session = sessions.get(src);
  if (!session) return false;
  if (session.token !== token) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(src);
    return false;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

// ============================================================
// casino:admin:auth — Autenticar com senha
// ============================================================
RegisterNetEvent("casino:admin:auth");
on("casino:admin:auth", async (cbId, payload) => {
  const src = source;
  console.log(`[CASINO-ADMIN] auth src=${src} cbId=${cbId}`);
  console.log(`[CASINO-ADMIN] DEBUG payload=${JSON.stringify(payload)}`);
  try {
    const password = payload?.password;
    console.log(`[CASINO-ADMIN] DEBUG password="${password}" len=${password ? password.length : 0} type=${typeof password}`);
    if (!password || typeof password !== "string" || password.length < 1) {
      return respond(src, cbId, { autenticado: false, mensagem: "Senha vazia" });
    }

    const rows = await dbQuery("SELECT * FROM casino_admin_auth WHERE id = 1", []);
    console.log(`[CASINO-ADMIN] DEBUG rows=${JSON.stringify(rows?.[0] ? { setup: rows[0].setup_complete, hasmaster: !!rows[0].master_password, hasadmin: !!rows[0].admin_password } : 'NULL')}`);
    if (!rows || rows.length === 0) {
      return respond(src, cbId, { autenticado: false, mensagem: "Tabela admin nao configurada" });
    }

    const auth = rows[0];

    // Lockout check
    if (auth.locked_until) {
      const lockUntil = new Date(auth.locked_until).getTime();
      if (Date.now() < lockUntil) {
        const remainSec = Math.ceil((lockUntil - Date.now()) / 1000);
        return respond(src, cbId, {
          autenticado: false,
          bloqueado: true,
          mensagem: `Bloqueado por ${remainSec}s`,
        });
      }
      await dbExecute(
        "UPDATE casino_admin_auth SET failed_attempts = 0, locked_until = NULL WHERE id = 1",
        []
      );
      auth.failed_attempts = 0;
    }

    // Determine which password to check
    // oxmysql retorna TINYINT(1) como boolean (false/true), nao como 0/1
    const isSetup = !auth.setup_complete;
    const checkColumn = isSetup ? "master_password" : "admin_password";
    console.log(`[CASINO-ADMIN] DEBUG setup_complete=${auth.setup_complete} (type=${typeof auth.setup_complete}) isSetup=${isSetup} checkColumn=${checkColumn}`);

    const match = await dbQuery(
      `SELECT 1 AS ok FROM casino_admin_auth WHERE id = 1 AND ${checkColumn} = SHA2(?, 256)`,
      [password]
    );
    console.log(`[CASINO-ADMIN] DEBUG match=${JSON.stringify(match)}`);

    if (!match || match.length === 0) {
      const newAttempts = (auth.failed_attempts || 0) + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        await dbExecute(
          "UPDATE casino_admin_auth SET failed_attempts = ?, locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE id = 1",
          [newAttempts, LOCKOUT_MINUTES]
        );
        return respond(src, cbId, {
          autenticado: false,
          bloqueado: true,
          mensagem: `Bloqueado por ${LOCKOUT_MINUTES} minutos`,
        });
      }
      await dbExecute(
        "UPDATE casino_admin_auth SET failed_attempts = ? WHERE id = 1",
        [newAttempts]
      );
      return respond(src, cbId, {
        autenticado: false,
        mensagem: `Senha incorreta (${newAttempts}/${MAX_ATTEMPTS})`,
      });
    }

    // Sucesso — gerar token
    const token = generateToken();
    sessions.set(src, { token, expiresAt: Date.now() + SESSION_TTL_MS });

    await dbExecute(
      "UPDATE casino_admin_auth SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = ? WHERE id = 1",
      [GetPlayerEndpoint(src) || "unknown"]
    );

    console.log(`[CASINO-ADMIN] auth OK src=${src} setupComplete=${auth.setup_complete}`);
    respond(src, cbId, {
      autenticado: true,
      token,
      setupComplete: !!auth.setup_complete,
    });
  } catch (err) {
    console.log(`[CASINO-ADMIN] auth ERRO: ${err.message}`);
    respond(src, cbId, { autenticado: false, mensagem: err.message });
  }
});

// ============================================================
// casino:admin:setup — Criar senha pessoal (primeira vez)
// ============================================================
RegisterNetEvent("casino:admin:setup");
on("casino:admin:setup", async (cbId, payload) => {
  const src = source;
  console.log(`[CASINO-ADMIN] setup src=${src} cbId=${cbId}`);
  try {
    if (!isValidSession(src, payload?.token)) {
      return respond(src, cbId, { sucesso: false, mensagem: "Sessao invalida" });
    }

    const newPassword = payload?.newPassword;
    if (!newPassword || newPassword.length < 6) {
      return respond(src, cbId, { sucesso: false, mensagem: "Senha deve ter no minimo 6 caracteres" });
    }

    const rows = await dbQuery("SELECT setup_complete FROM casino_admin_auth WHERE id = 1", []);
    if (rows?.[0]?.setup_complete) {
      return respond(src, cbId, { sucesso: false, mensagem: "Setup ja foi concluido" });
    }

    await dbExecute(
      "UPDATE casino_admin_auth SET admin_password = SHA2(?, 256), master_password = NULL, setup_complete = 1 WHERE id = 1",
      [newPassword]
    );

    console.log(`[CASINO-ADMIN] setup OK — senha mestre removida, admin_password criada`);
    respond(src, cbId, { sucesso: true, mensagem: "Senha criada com sucesso!" });
  } catch (err) {
    console.log(`[CASINO-ADMIN] setup ERRO: ${err.message}`);
    respond(src, cbId, { sucesso: false, mensagem: err.message });
  }
});

// ============================================================
// casino:admin:getConfig — Todas as configs com descricao
// ============================================================
RegisterNetEvent("casino:admin:getConfig");
on("casino:admin:getConfig", async (cbId, payload) => {
  const src = source;
  console.log(`[CASINO-ADMIN] getConfig src=${src} cbId=${cbId}`);
  try {
    if (!isValidSession(src, payload?.token)) {
      return respond(src, cbId, { sucesso: false, mensagem: "Sessao invalida" });
    }

    const rows = await dbQuery("SELECT chave, valor, descricao FROM casino_config ORDER BY chave", []);
    console.log(`[CASINO-ADMIN] getConfig OK rows=${(rows || []).length}`);
    respond(src, cbId, { sucesso: true, configs: rows || [] });
  } catch (err) {
    console.log(`[CASINO-ADMIN] getConfig ERRO: ${err.message}`);
    respond(src, cbId, { sucesso: false, mensagem: err.message });
  }
});

// ============================================================
// casino:admin:setConfig — Editar configs (batch)
// ============================================================
RegisterNetEvent("casino:admin:setConfig");
on("casino:admin:setConfig", async (cbId, payload) => {
  const src = source;
  console.log(`[CASINO-ADMIN] setConfig src=${src} cbId=${cbId}`);
  try {
    if (!isValidSession(src, payload?.token)) {
      return respond(src, cbId, { sucesso: false, mensagem: "Sessao invalida" });
    }

    const changes = payload?.changes;
    if (!changes || typeof changes !== "object") {
      return respond(src, cbId, { sucesso: false, mensagem: "Nenhuma alteracao enviada" });
    }

    let count = 0;
    const entries = Object.entries(changes);
    for (const [chave, valor] of entries) {
      if (typeof chave !== "string" || chave.length === 0) continue;
      await dbExecute(
        "UPDATE casino_config SET valor = ? WHERE chave = ?",
        [String(valor), chave]
      );
      count++;
    }

    console.log(`[CASINO-ADMIN] setConfig OK — ${count} configs atualizadas`);
    respond(src, cbId, { sucesso: true, mensagem: `${count} configuracoes salvas`, count });
  } catch (err) {
    console.log(`[CASINO-ADMIN] setConfig ERRO: ${err.message}`);
    respond(src, cbId, { sucesso: false, mensagem: err.message });
  }
});

// ============================================================
// casino:admin:changePassword — Trocar senha admin
// ============================================================
RegisterNetEvent("casino:admin:changePassword");
on("casino:admin:changePassword", async (cbId, payload) => {
  const src = source;
  console.log(`[CASINO-ADMIN] changePassword src=${src} cbId=${cbId}`);
  try {
    if (!isValidSession(src, payload?.token)) {
      return respond(src, cbId, { sucesso: false, mensagem: "Sessao invalida" });
    }

    const currentPassword = payload?.currentPassword;
    const newPassword = payload?.newPassword;

    if (!currentPassword || !newPassword) {
      return respond(src, cbId, { sucesso: false, mensagem: "Senhas nao informadas" });
    }
    if (newPassword.length < 6) {
      return respond(src, cbId, { sucesso: false, mensagem: "Nova senha deve ter no minimo 6 caracteres" });
    }

    const check = await dbQuery(
      "SELECT 1 AS ok FROM casino_admin_auth WHERE id = 1 AND admin_password = SHA2(?, 256)",
      [currentPassword]
    );

    if (!check || check.length === 0) {
      return respond(src, cbId, { sucesso: false, mensagem: "Senha atual incorreta" });
    }

    await dbExecute(
      "UPDATE casino_admin_auth SET admin_password = SHA2(?, 256) WHERE id = 1",
      [newPassword]
    );

    console.log(`[CASINO-ADMIN] changePassword OK`);
    respond(src, cbId, { sucesso: true, mensagem: "Senha alterada com sucesso!" });
  } catch (err) {
    console.log(`[CASINO-ADMIN] changePassword ERRO: ${err.message}`);
    respond(src, cbId, { sucesso: false, mensagem: err.message });
  }
});

// Cleanup de sessoes expiradas a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [src, session] of sessions) {
    if (now > session.expiresAt) sessions.delete(src);
  }
}, 5 * 60 * 1000);

console.log("[Blackout Casino] Admin handlers carregados — 5 endpoints (auth, setup, getConfig, setConfig, changePassword)");

})();