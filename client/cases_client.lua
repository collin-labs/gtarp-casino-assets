-- =====================================================
-- BLACKOUT CASINO -- CASES -- Client
-- NUI callbacks + server events
-- =====================================================

-- Abrir NUI do Cases
RegisterNetEvent('casino:cases:openNUI')
AddEventHandler('casino:cases:openNUI', function()
  SetNuiFocus(true, true)
  SendNUIMessage({ type = 'CASES_OPEN' })
end)

-- Fechar NUI
RegisterNuiCallback('casino:cases:close', function(data, cb)
  SetNuiFocus(false, false)
  cb({ ok = true })
end)

-- Proxy dos handlers para server
local handlers = {
  'casino:cases:catalog',
  'casino:cases:preview',
  'casino:cases:open',
  'casino:cases:sell',
  'casino:cases:keep',
  'casino:cases:history',
  'casino:cases:my_inventory',
  'casino:cases:daily_free',
  'casino:cases:battle_create',
  'casino:cases:battle_join',
  'casino:cases:battle_list',
  'casino:cases:battle_result',
}

for _, handler in ipairs(handlers) do
  RegisterNuiCallback(handler, function(data, cb)
    TriggerServerCallback(handler, function(result)
      cb(result)
    end, data)
  end)
end

-- Listener: novo drop (broadcast de todos os jogadores)
RegisterNetEvent('casino:cases:drop')
AddEventHandler('casino:cases:drop', function(dropData)
  SendNUIMessage({
    type = 'CASES_DROP',
    data = dropData
  })
end)

-- Listener: batalha finalizada
RegisterNetEvent('casino:cases:battle_finished')
AddEventHandler('casino:cases:battle_finished', function(battleData)
  SendNUIMessage({
    type = 'CASES_BATTLE_FINISHED',
    data = battleData
  })
end)
