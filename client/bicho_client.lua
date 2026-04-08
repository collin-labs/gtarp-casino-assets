-- Blackout Casino - Jogo do Bicho (#9) - Cliente Lua
-- Ponte NUI > Server usando Citizen.Await + promise (padrao oxmysql)
-- Mesmo padrao de client/panel_client.lua

local pendente = {}

-- Helper: dispara evento server e espera resposta com timeout
function PedirAoServidorBicho(eventoEnvio, eventoResposta, payload, timeoutMs)
  local p = promise.new()

  pendente[eventoResposta] = function(dados)
    p:resolve(dados)
  end

  if payload then
    TriggerServerEvent(eventoEnvio, payload)
  else
    TriggerServerEvent(eventoEnvio)
  end

  SetTimeout(timeoutMs or 5000, function()
    if pendente[eventoResposta] then
      pendente[eventoResposta] = nil
      p:resolve({ erro = "Timeout - servidor nao respondeu" })
    end
  end)

  return Citizen.Await(p)
end

-- Registrar listeners de resposta do server (1 vez)
local respostas = {
  "casino:bicho:play:response",
  "casino:bicho:getHistory:response",
  "casino:bicho:verify:response",
  "casino:bicho:getConfig:response",
  "casino:bicho:admin:stats:response",
}

for _, evento in ipairs(respostas) do
  RegisterNetEvent(evento)
  AddEventHandler(evento, function(dados)
    if pendente[evento] then
      pendente[evento](dados)
      pendente[evento] = nil
    end
  end)
end

-- NUI Callbacks — fetchNui do React chama esses endpoints

RegisterNUICallback("casino:bicho:play", function(data, cb)
  if not data or not data.mode or not data.animals or not data.bet then
    cb({ erro = "Dados incompletos" })
    return
  end
  local resultado = PedirAoServidorBicho(
    "casino:bicho:play",
    "casino:bicho:play:response",
    { mode = data.mode, animals = data.animals, bet = tonumber(data.bet), clientSeed = data.clientSeed }
  )
  cb(resultado)
end)

RegisterNUICallback("casino:bicho:getHistory", function(data, cb)
  local limite = (data and data.limite) or 20
  local resultado = PedirAoServidorBicho(
    "casino:bicho:getHistory",
    "casino:bicho:getHistory:response",
    limite
  )
  cb(resultado)
end)

RegisterNUICallback("casino:bicho:verify", function(data, cb)
  if not data or not data.roundId then
    cb({ erro = "roundId obrigatorio" })
    return
  end
  local resultado = PedirAoServidorBicho(
    "casino:bicho:verify",
    "casino:bicho:verify:response",
    tonumber(data.roundId)
  )
  cb(resultado)
end)

RegisterNUICallback("casino:bicho:getConfig", function(_, cb)
  local resultado = PedirAoServidorBicho(
    "casino:bicho:getConfig",
    "casino:bicho:getConfig:response"
  )
  cb(resultado)
end)

RegisterNUICallback("casino:bicho:admin:stats", function(_, cb)
  local resultado = PedirAoServidorBicho(
    "casino:bicho:admin:stats",
    "casino:bicho:admin:stats:response"
  )
  cb(resultado)
end)
