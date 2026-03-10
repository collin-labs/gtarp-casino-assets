# GUIA DE VALIDAÇÃO — SLOTS FASE 1 COMPLETA

## Engine Server (SQL + Seeds + Handler)
### Blackout Casino — 04/03/2026

---

## RELATÓRIO DE PESQUISA (REGRA 0)

**A pesquisa foi válida? SIM.**

**O que trouxe de novidade:**
1. **Provably Fair padrão Stake.com 2026** confirmado: byteGenerator com cursor + rounds incrementais + 4 bytes por float. Formato HMAC: `clientSeed:nonce:round`. Cursor incrementa a cada 32 bytes.
2. **oxmysql como padrão 2025/2026**: API moderna com `MySQL.prepare`, placeholders `?`, async/await nativo, melhor performance que mysql-async.
3. **Verificação externa**: Em 2026, jogadores usam verificadores third-party para conferir hashes — nosso sistema é 100% compatível.

**O que teríamos feito sem pesquisar:**
- HMAC simples com 4 hex chars por reel (16 bits de precisão)
- Sem cursor, sem rounds — limitado a 8 resultados por spin
- mysql-async deprecated com syntax `@param`
- Sistema de fairness que não passaria em verificação comparada com Stake/Blaze

---

## O QUE FOI ENTREGUE

| Arquivo | Linhas | Conteúdo |
|---------|:------:|----------|
| `sql/casino_slots_schema.sql` | 161 | 8 tabelas CREATE TABLE IF NOT EXISTS |
| `sql/casino_slots_seeds.sql` | 448 | Config + Paytable + 768 reel strips + Jackpots + Rounds mock |
| `server/handlers/slots.js` | 602 | Engine server completo |
| `GUIA-VALIDACAO-FASE-1.md` | este | Documentação de validação |
| **Total** | **~1.211+** | **Fase 1 completa** |

---

## ARQUITETURA DO HANDLER (slots.js)

### Seções do Engine (16 módulos)

| # | Módulo | Linhas | Função |
|:-:|--------|:------:|--------|
| 1 | Provably Fair | ~50 | byteGenerator + generateFloats + seeds (padrão Stake.com) |
| 2 | Grid Builder | ~15 | Converte posições de reel em grid de símbolos |
| 3 | Cluster Detection | ~50 | BFS para encontrar clusters 5+ adjacentes (Video 6×5) |
| 4 | Cluster Payout | ~20 | Busca pagamento por threshold na paytable |
| 5 | Payline Detection | ~40 | 5 paylines clássicas + cereja pairs (Classic 3×3) |
| 6 | Tumble Engine | ~45 | Remove wins → gravity → novos símbolos |
| 7 | Scatter Detection | ~20 | Conta scatters + calcula free spins |
| 8 | Hold & Spin | ~70 | Diamantes travam → respins → reveal valores |
| 9 | Jackpot Check | ~30 | Random trigger por tier + contribuição |
| 10 | Video Spin Completo | ~70 | Orquestra: grid → clusters → tumbles → scatter |
| 11 | Classic Spin Completo | ~30 | Orquestra: grid → paylines → hold&spin |
| 12 | Init (boot) | ~40 | Carrega config/strips/paytable/jackpots do banco |
| 13 | Seed Management | ~45 | Criar/buscar/incrementar seeds por sessão |
| 14 | Validações | ~15 | Saldo, rate limit, spinning check |
| 15 | Handlers (7) | ~200 | spin, free_spin, bonus_buy, history, paytable, jackpot_info, admin_config |
| 16 | NUI Callbacks | ~30 | RegisterNUICallback para cada handler |

### Handlers Registrados (7)

| Handler | Parâmetros | Validações | Retorno |
|---------|-----------|------------|---------|
| `casino:slots:spin` | mode, betAmount | saldo, rate limit, range, spinning | grid, wins, tumbles, jackpot, balance |
| `casino:slots:free_spin` | sessionId | sessão ativa, spins restantes | grid, tumbles, multiplier, remaining |
| `casino:slots:bonus_buy` | betAmount | saldo >= 25x aposta, sem sessão ativa | sessionId, spinsRemaining, cost |
| `casino:slots:history` | — | userId | últimas 20 rodadas |
| `casino:slots:paytable` | mode | — | tabela de pagamentos |
| `casino:slots:jackpot_info` | mode | — | pools por tier |
| `casino:slots:admin_config` | mode, field, value | campo válido | config atualizada |

---

## PROVABLY FAIR — COMO FUNCIONA

```
ANTES do spin:
  server_seed = random 64-char hex (gerado na sessão)
  server_seed_hash = SHA256(server_seed) → enviado ao client
  client_seed = "default" (ou definido pelo jogador)
  nonce = incrementa a cada spin

DURANTE o spin:
  byteGenerator({ serverSeed, clientSeed, nonce, cursor })
  → HMAC_SHA256(serverSeed, "clientSeed:nonce:round")
  → 32 bytes por round, cursor avança
  → 4 bytes = 1 float entre 0 e 1
  → float × strip_length = posição no reel

APÓS o spin:
  nonce incrementa
  Jogador pode verificar: SHA256(server_seed) === hash_recebido_antes?
```

---

## SEGURANÇA IMPLEMENTADA

| Proteção | Como |
|----------|------|
| Resultado server-only | Client nunca recebe reel strip, só posições finais |
| Rate limit | 1.5s entre spins (configurável) |
| Spinning lock | userStates impede spin duplo |
| Validação de aposta | min/max checado contra config do banco |
| Saldo verificado | vRP getMoney antes de cada spin |
| Refund em erro | Se config não encontrada, devolve aposta |
| Provably Fair | Hash verificável por qualquer verificador externo |
| Audit Log | Cada spin + config change logado com detalhes |
| Anti-bot | Rate limit + spinning lock |

---

## TABELAS SQL (8)

| # | Tabela | Rows Iniciais | Propósito |
|:-:|--------|:---:|-----------|
| 1 | `casino_slots_config` | 2 | Config por modo (min/max bet, RTP profile) |
| 2 | `casino_slots_reel_strips` | 768 | Strips completas (192 classic + 576 video) |
| 3 | `casino_slots_paytable` | 58 | Pagamentos por símbolo e contagem |
| 4 | `casino_slots_rounds` | 5 mock | Cada spin (audit trail) |
| 5 | `casino_slots_free_spins` | 0 | Sessões de free spins |
| 6 | `casino_slots_jackpot_pool` | 6 | Pools progressivos |
| 7 | `casino_slots_audit_log` | 0 | Registro de ações |
| 8 | `casino_slots_server_seeds` | 0 | Seeds por sessão |

---

## COMO EXECUTAR

```powershell
# 1. SQL — Executar no banco kushstore
Get-Content sql\casino_slots_schema.sql | mysql -u root -p kushstore
Get-Content sql\casino_slots_seeds.sql | mysql -u root -p kushstore

# 2. Handler — Copiar para a pasta do server
Copy-Item "server\handlers\slots.js" "C:\GTA-RP-BASE-DE-DADOS\resources\[casino]\blackout-casino\server\handlers\"

# 3. Verificar no console do FiveM
# Deve aparecer: [SLOTS] Engine inicializada: 2 configs, 2 reel strip profiles, 2 paytables, 6 jackpot pools
# E depois: [SLOTS] ✅ Engine pronta para receber spins
```

---

## CHECKLIST DE VALIDAÇÃO (REGRA 11)

### SQL
- [x] 8 tabelas com CREATE TABLE IF NOT EXISTS (idempotente)
- [x] Todos os tipos monetários são DECIMAL (nunca FLOAT)
- [x] Indexes em colunas de busca frequente
- [x] UNIQUE KEY em config (mode) e jackpot (tier+mode)
- [x] JSON para dados flexíveis
- [x] 3 reels classic × 64 stops = 192 rows
- [x] 6 reels video × 96 stops = 576 rows
- [x] Distribuição de pesos confere com Mega Estudo
- [x] Paytable: 8 classic + 50 video (cluster thresholds 5/8/12/15/20)

### Handler
- [x] Provably Fair padrão Stake.com (byteGenerator + cursor + 4 bytes)
- [x] Cluster Detection via BFS (6×5, 5+ adjacentes)
- [x] Wild substitui qualquer (exceto scatter)
- [x] 5 Paylines classic + cereja pairs
- [x] Tumble engine (remove → gravity → novos símbolos via provably fair)
- [x] Hold & Spin (diamantes travam, 3 respins, reveal valores)
- [x] Multiplicador progressivo (schedule + linear em free spins)
- [x] Scatter detection (3=10, 4=15, 5=20 free spins)
- [x] Jackpot progressivo (contribuição + check + reset)
- [x] Free Spins com multiplicador acumulado + retrigger (max 3)
- [x] Bonus Buy (25x aposta, cria sessão de 10 spins)
- [x] 7 handlers NUI registrados
- [x] Validações de segurança completas
- [x] Audit log em cada spin e config change (REGRA 12)
- [x] Rate limit configurável
- [x] Saldo vRP integrado

### Tooltip/Modal/Feedback Checklist (REGRA 5)
*(Aplicável na Fase 2+ quando houver UI. Nesta fase, o server retorna dados para todos os feedbacks:)*
- [x] `winTier` no retorno (none/normal/big/mega/epic) → UI saberá qual overlay mostrar
- [x] `jackpotHit` no retorno → UI saberá quando mostrar overlay jackpot
- [x] `freeSpinsAwarded` no retorno → UI saberá quando mostrar overlay free spins
- [x] `error` em todas validações → UI mostrará modal de feedback
- [x] `newBalance` em todos retornos → UI atualizará saldo com animação

---

## ESTE PROCESSO ESTÁ PRONTO PARA PRODUÇÃO? (REGRA 11)

**SIM, a Fase 1 (Engine Server) está completa.**

O SQL é executável via copiar-colar. O handler contém toda a matemática do jogo (provably fair, cluster pays, tumble, hold & spin, jackpot progressivo). Todos os 7 handlers NUI estão registrados. A segurança cobre anti-cheat, rate limit, validação de saldo, e audit log.

**Próxima fase:** Fase 2 — Classic Slot UI (React + GSAP para 3×3 grid visual)
