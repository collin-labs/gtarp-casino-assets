// DIAGNOSTICO — Server handler pra testar chain
// Colocar em: bc_casino/server/handlers/diagnostico.js
// Adicionar ao fxmanifest.lua em server_scripts

RegisterNetEvent("casino:diag:ping");
on("casino:diag:ping", (cbId, payload) => {
  const src = source;
  console.log(`[DIAG-SERVER] Teste 3 OK — Recebido do client! src=${src} cbId=${cbId} payload=${JSON.stringify(payload)}`);
  
  // Testar se oxmysql funciona
  let dbOk = false;
  try {
    const result = exports.oxmysql.query_async("SELECT 1 as test");
    dbOk = true;
    console.log("[DIAG-SERVER] DB OK — oxmysql respondeu");
  } catch (e) {
    console.log("[DIAG-SERVER] DB ERRO — " + e.message);
  }
  
  // Testar se identifier funciona
  let identifier = null;
  const numIds = GetNumPlayerIdentifiers(src);
  for (let i = 0; i < numIds; i++) {
    const id = GetPlayerIdentifier(src, i);
    if (id && id.startsWith("license:")) {
      identifier = id;
      break;
    }
  }
  console.log(`[DIAG-SERVER] Identifier: ${identifier || "NAO ENCONTRADO"} (total ids: ${numIds})`);
  
  // Responder pro client
  console.log(`[DIAG-SERVER] Respondendo pro client src=${src} cbId=${cbId}`);
  emitNet("casino:diag:pong", src, cbId, {
    ok: true,
    server: "funcionando",
    dbOk: dbOk,
    identifier: identifier ? "encontrado" : "nao_encontrado",
    timestamp: Date.now()
  });
  console.log("[DIAG-SERVER] Resposta enviada!");
});

console.log("[DIAG-SERVER] Handler de diagnostico carregado");
