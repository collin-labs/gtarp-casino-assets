-- Blackout Casino — Bicho Client (padrao smartphone — sem Citizen.Await)

local pendingCallbacks = {}
local callbackId = 0

local endpoints = {
  "casino:bicho:play",
  "casino:bicho:getHistory",
  "casino:bicho:verify",
  "casino:bicho:getConfig",
  "casino:bicho:rotateSeed",
}

for _, endpoint in ipairs(endpoints) do
  RegisterNUICallback(endpoint, function(data, cb)
    callbackId = callbackId + 1
    local id = callbackId
    pendingCallbacks[id] = cb
    TriggerServerEvent(endpoint, id, data or {})
  end)
end

RegisterNetEvent("casino:bicho:response")
AddEventHandler("casino:bicho:response", function(id, resultado)
  local cb = pendingCallbacks[id]
  if cb then
    cb(resultado)
    pendingCallbacks[id] = nil
  end
end)
