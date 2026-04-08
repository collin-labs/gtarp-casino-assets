-- Blackout Casino — Slot Machine Client Lua
-- Ponte NUI (React) -> Server (handler)
-- Cada callback repassa ao server e retorna resposta ao NUI
-- Timeout de 10s para evitar hang se server nao responder

local pendente = {}
local TIMEOUT_MS = 10000

-- Helper: disparar evento server e esperar resposta via promise
function PedirAoServidor(eventoEnvio, eventoResposta, payload, cb)
    local p = promise.new()

    pendente[eventoResposta] = function(dados)
        p:resolve(dados)
    end

    if payload then
        TriggerServerEvent(eventoEnvio, payload)
    else
        TriggerServerEvent(eventoEnvio)
    end

    -- Timeout
    SetTimeout(TIMEOUT_MS, function()
        if pendente[eventoResposta] then
            pendente[eventoResposta] = nil
            p:resolve({ error = "timeout" })
        end
    end)

    local resultado = Citizen.Await(p)
    pendente[eventoResposta] = nil
    cb(resultado)
end

-- Respostas do server
RegisterNetEvent("casino:slot:spinResult", function(dados)
    if pendente["casino:slot:spinResult"] then
        pendente["casino:slot:spinResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:classicResult", function(dados)
    if pendente["casino:slot:classicResult"] then
        pendente["casino:slot:classicResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:buyBonusResult", function(dados)
    if pendente["casino:slot:buyBonusResult"] then
        pendente["casino:slot:buyBonusResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:balanceResult", function(dados)
    if pendente["casino:slot:balanceResult"] then
        pendente["casino:slot:balanceResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:historyResult", function(dados)
    if pendente["casino:slot:historyResult"] then
        pendente["casino:slot:historyResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:configResult", function(dados)
    if pendente["casino:slot:configResult"] then
        pendente["casino:slot:configResult"](dados)
    end
end)

RegisterNetEvent("casino:slot:revealSeedResult", function(dados)
    if pendente["casino:slot:revealSeedResult"] then
        pendente["casino:slot:revealSeedResult"](dados)
    end
end)

-- NUI Callbacks (NUI React -> Lua Client -> Server -> Lua Client -> NUI React)

RegisterNUICallback("casino:slot:spin", function(payload, cb)
    PedirAoServidor("casino:slot:spin", "casino:slot:spinResult", payload, cb)
end)

RegisterNUICallback("casino:slot:classic-spin", function(payload, cb)
    PedirAoServidor("casino:slot:classic-spin", "casino:slot:classicResult", payload, cb)
end)

RegisterNUICallback("casino:slot:buy-bonus", function(payload, cb)
    PedirAoServidor("casino:slot:buy-bonus", "casino:slot:buyBonusResult", payload, cb)
end)

RegisterNUICallback("casino:slot:get-balance", function(_, cb)
    PedirAoServidor("casino:slot:get-balance", "casino:slot:balanceResult", nil, cb)
end)

RegisterNUICallback("casino:slot:get-history", function(_, cb)
    PedirAoServidor("casino:slot:get-history", "casino:slot:historyResult", nil, cb)
end)

RegisterNUICallback("casino:slot:get-config", function(_, cb)
    PedirAoServidor("casino:slot:get-config", "casino:slot:configResult", nil, cb)
end)

RegisterNUICallback("casino:slot:reveal-seed", function(_, cb)
    PedirAoServidor("casino:slot:reveal-seed", "casino:slot:revealSeedResult", nil, cb)
end)
