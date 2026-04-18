-- Blackout Casino - Bridge vRP
-- Conecta os handlers JS (panel.js) com o sistema de dinheiro do vRP
-- Os handlers JS chamam exports.bc_casino.funcao(src, valor)

local Proxy = module("vrp", "lib/Proxy")
local vRP = Proxy.getInterface("vRP")

-- Debitar dinheiro da carteira do jogador (comprar GCoin)
-- Retorna true se conseguiu, false se nao tinha saldo
exports("debitarDinheiro", function(src, valor)
    local user_id = vRP.getUserId(src)
    if not user_id then return false end

    local sucesso = vRP.tryPayment(user_id, math.floor(valor))
    return sucesso
end)

-- Creditar dinheiro na carteira do jogador (sacar GCoin)
exports("creditarDinheiro", function(src, valor)
    local user_id = vRP.getUserId(src)
    if not user_id then return false end

    vRP.giveMoney(user_id, math.floor(valor))
    return true
end)

-- Consultar saldo da carteira vRP do jogador
exports("consultarSaldo", function(src)
    local user_id = vRP.getUserId(src)
    if not user_id then return 0 end

    return vRP.getMoney(user_id) or 0
end)

-- Consultar saldo do banco vRP do jogador
exports("consultarBanco", function(src)
    local user_id = vRP.getUserId(src)
    if not user_id then return 0 end

    return vRP.getBankMoney(user_id) or 0
end)
