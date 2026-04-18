-- DIAGNOSTICO — Testar chain NUI -> Lua -> Server -> Lua -> NUI
-- Colocar em: bc_casino/client/diagnostico.lua
-- Adicionar ao fxmanifest.lua em client_scripts
-- No jogo: /casinotest no chat

local pendingDiag = {}
local diagId = 0

-- TESTE 1: Lua client recebe do NUI?
RegisterNUICallback("casino:diag:ping", function(data, cb)
  print("[DIAG-CLIENT] Teste 1 OK — NUI callback recebido. data=" .. json.encode(data or {}))
  
  -- TESTE 2: Server recebe do client?
  diagId = diagId + 1
  local id = diagId
  pendingDiag[id] = cb
  print("[DIAG-CLIENT] Teste 2 — Enviando pro server com id=" .. id)
  TriggerServerEvent("casino:diag:ping", id, { teste = "hello" })
end)

-- TESTE 4: Client recebe resposta do server?
RegisterNetEvent("casino:diag:pong")
AddEventHandler("casino:diag:pong", function(id, resultado)
  print("[DIAG-CLIENT] Teste 4 OK — Server respondeu! id=" .. tostring(id) .. " resultado=" .. json.encode(resultado or {}))
  local cb = pendingDiag[id]
  if cb then
    print("[DIAG-CLIENT] Teste 5 — Chamando cb() pro NUI...")
    cb(resultado)
    pendingDiag[id] = nil
    print("[DIAG-CLIENT] Teste 5 OK — cb() executado, React deve receber")
  else
    print("[DIAG-CLIENT] ERRO — pendingDiag[" .. tostring(id) .. "] nao existe!")
  end
end)

-- Comando de teste manual (sem NUI)
RegisterCommand("casinotest", function()
  print("[DIAG-CLIENT] Comando /casinotest executado")
  print("[DIAG-CLIENT] isFiveM check: GetParentResourceName=" .. tostring(GetParentResourceName ~= nil))
  print("[DIAG-CLIENT] Resource name=" .. tostring(GetCurrentResourceName()))
  
  -- Testar server direto (sem NUI)
  diagId = diagId + 1
  local id = diagId
  pendingDiag[id] = function(res)
    print("[DIAG-CLIENT] Resposta do server via command: " .. json.encode(res or {}))
  end
  TriggerServerEvent("casino:diag:ping", id, { via = "command" })
end, false)
