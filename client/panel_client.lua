-- Blackout Casino — Cliente Lua do Painel Flutuante
-- Ponte NUI↔Server usando Citizen.Await + promise (padrao oxmysql)
-- fetchNui do React recebe resposta sincrona via cb()

local painelAberto = false

-- Tabela de promessas pendentes (1 por endpoint)
local pendente = {}

-- Abrir painel
function AbrirPainelCassino()
  if painelAberto then return end
  painelAberto = true
  SetNuiFocus(true, true)
  SendNUIMessage({ action = "show" })
end

-- Fechar painel (fechar focus ANTES de qualquer evento — fonte #8 devhideout)
function FecharPainelCassino()
  if not painelAberto then return end
  painelAberto = false
  SetNuiFocus(false, false)
  SendNUIMessage({ action = "hide" })
end

-- Comando de teste (trocar por keybind ou trigger em producao)
RegisterCommand("cassino", function()
  AbrirPainelCassino()
end, false)

-- ESC fecha o painel
RegisterNUICallback("casino:panel:close", function(_, cb)
  FecharPainelCassino()
  cb({})
end)

-- Helper: dispara evento server e espera resposta com timeout
function PedirAoServidor(eventoEnvio, eventoResposta, payload, timeoutMs)
  local p = promise.new()

  pendente[eventoResposta] = function(dados)
    p:resolve(dados)
  end

  if payload then
    TriggerServerEvent(eventoEnvio, payload)
  else
    TriggerServerEvent(eventoEnvio)
  end

  -- Timeout de 5s evita NUI travado se server nao responder
  SetTimeout(timeoutMs or 5000, function()
    if pendente[eventoResposta] then
      pendente[eventoResposta] = nil
      p:resolve({ erro = "Timeout — servidor nao respondeu" })
    end
  end)

  return Citizen.Await(p)
end

-- Registrar listeners de resposta do server (1 vez)
local respostas = {
  "casino:panel:getSaldo:response",
  "casino:panel:buyGCoin:response",
  "casino:panel:cashoutGCoin:response",
  "casino:panel:getHistory:response",
  "casino:panel:getConfig:response",
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
-- cb() retorna o resultado direto pro React (sincrono)

RegisterNUICallback("casino:panel:getSaldo", function(_, cb)
  local resultado = PedirAoServidor("casino:panel:getSaldo", "casino:panel:getSaldo:response")
  cb(resultado)
end)

RegisterNUICallback("casino:panel:buyGCoin", function(data, cb)
  if not data or not data.amount then
    cb({ sucesso = false, mensagem = "Valor nao informado" })
    return
  end
  local resultado = PedirAoServidor("casino:panel:buyGCoin", "casino:panel:buyGCoin:response", tonumber(data.amount))
  cb(resultado)
end)

RegisterNUICallback("casino:panel:cashoutGCoin", function(data, cb)
  if not data or not data.amount then
    cb({ sucesso = false, mensagem = "Valor nao informado" })
    return
  end
  local resultado = PedirAoServidor("casino:panel:cashoutGCoin", "casino:panel:cashoutGCoin:response", tonumber(data.amount))
  cb(resultado)
end)

RegisterNUICallback("casino:panel:getHistory", function(data, cb)
  local limite = (data and data.limite) or 50
  local resultado = PedirAoServidor("casino:panel:getHistory", "casino:panel:getHistory:response", limite)
  cb(resultado)
end)

RegisterNUICallback("casino:panel:getConfig", function(_, cb)
  local resultado = PedirAoServidor("casino:panel:getConfig", "casino:panel:getConfig:response")
  cb(resultado)
end)
