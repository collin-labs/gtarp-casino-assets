-- ═══════════════════════════════════════════════════════════════
-- BLACKOUT CASINO — SLOTS CLIENT (FiveM Lua)
-- Registra NUI callbacks para comunicação React ↔ Server
-- Data: 04/03/2026
-- ═══════════════════════════════════════════════════════════════

-- ── NUI → Server: Spin ─────────────────────────────────────
RegisterNUICallback('casino:slots:spin', function(data, cb)
    TriggerServerEvent('casino:slots:spin', data)
    cb({ waiting = true })
end)

-- ── NUI → Server: Free Spin ────────────────────────────────
RegisterNUICallback('casino:slots:free_spin', function(data, cb)
    TriggerServerEvent('casino:slots:free_spin', data)
    cb({ waiting = true })
end)

-- ── NUI → Server: Bonus Buy ────────────────────────────────
RegisterNUICallback('casino:slots:bonus_buy', function(data, cb)
    TriggerServerEvent('casino:slots:bonus_buy', data)
    cb({ waiting = true })
end)

-- ── NUI → Server: History ──────────────────────────────────
RegisterNUICallback('casino:slots:history', function(data, cb)
    TriggerServerEvent('casino:slots:history')
    cb({ waiting = true })
end)

-- ── NUI → Server: Paytable ────────────────────────────────
RegisterNUICallback('casino:slots:paytable', function(data, cb)
    TriggerServerEvent('casino:slots:paytable', data)
    cb({ waiting = true })
end)

-- ── NUI → Server: Jackpot Info ─────────────────────────────
RegisterNUICallback('casino:slots:jackpot_info', function(data, cb)
    TriggerServerEvent('casino:slots:jackpot_info', data)
    cb({ waiting = true })
end)

-- ── NUI → Server: Admin Config ─────────────────────────────
RegisterNUICallback('casino:slots:admin_config', function(data, cb)
    TriggerServerEvent('casino:slots:admin_config', data)
    cb({ waiting = true })
end)

-- ═══════════════════════════════════════════════════════════════
-- Server → NUI: Resultados
-- ═══════════════════════════════════════════════════════════════

-- ── Resultado do spin ──────────────────────────────────────
RegisterNetEvent('casino:slots:result')
AddEventHandler('casino:slots:result', function(result)
    SendNUIMessage({
        type = 'casino:slots:result',
        data = result
    })
end)

-- ── Resultado do free spin ─────────────────────────────────
RegisterNetEvent('casino:slots:free_spin_result')
AddEventHandler('casino:slots:free_spin_result', function(result)
    SendNUIMessage({
        type = 'casino:slots:free_spin_result',
        data = result
    })
end)

-- ── Resultado do bonus buy ─────────────────────────────────
RegisterNetEvent('casino:slots:bonus_buy_result')
AddEventHandler('casino:slots:bonus_buy_result', function(result)
    SendNUIMessage({
        type = 'casino:slots:bonus_buy_result',
        data = result
    })
end)

-- ── History response ───────────────────────────────────────
RegisterNetEvent('casino:slots:history_result')
AddEventHandler('casino:slots:history_result', function(result)
    SendNUIMessage({
        type = 'casino:slots:history_result',
        data = result
    })
end)

-- ── Paytable response ──────────────────────────────────────
RegisterNetEvent('casino:slots:paytable_result')
AddEventHandler('casino:slots:paytable_result', function(result)
    SendNUIMessage({
        type = 'casino:slots:paytable_result',
        data = result
    })
end)

-- ── Jackpot info response ──────────────────────────────────
RegisterNetEvent('casino:slots:jackpot_info_result')
AddEventHandler('casino:slots:jackpot_info_result', function(result)
    SendNUIMessage({
        type = 'casino:slots:jackpot_info_result',
        data = result
    })
end)

-- ── Jackpot broadcast (para todos jogadores) ───────────────
RegisterNetEvent('casino:slots:jackpot_broadcast')
AddEventHandler('casino:slots:jackpot_broadcast', function(data)
    SendNUIMessage({
        type = 'casino:slots:jackpot_broadcast',
        data = data
    })
end)

-- ── Jackpot pool update (ticker) ───────────────────────────
RegisterNetEvent('casino:slots:jackpot_update')
AddEventHandler('casino:slots:jackpot_update', function(pools)
    SendNUIMessage({
        type = 'casino:slots:jackpot_update',
        data = { pools = pools }
    })
end)

print('[SLOTS] ^2Client loaded — NUI callbacks registered^0')
