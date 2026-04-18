-- Blackout Casino — Slots Client (padrao smartphone — sem Citizen.Await)

local pendingCallbacks = {}
local callbackId = 0

local endpoints = {
  "casino:slot:spin",
  "casino:slot:classic-spin",
  "casino:slot:buy-bonus",
  "casino:slot:get-balance",
  "casino:slot:get-history",
  "casino:slot:get-config",
  "casino:slot:reveal-seed",
}

for _, endpoint in ipairs(endpoints) do
  RegisterNUICallback(endpoint, function(data, cb)
    callbackId = callbackId + 1
    local id = callbackId
    pendingCallbacks[id] = cb
    TriggerServerEvent(endpoint, id, data or {})
  end)
end

RegisterNetEvent("casino:slot:response")
AddEventHandler("casino:slot:response", function(id, resultado)
  local cb = pendingCallbacks[id]
  if cb then
    cb(resultado)
    pendingCallbacks[id] = nil
  end
end)
