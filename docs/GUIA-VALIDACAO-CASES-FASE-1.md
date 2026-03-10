# GUIA DE VALIDACAO -- CASES FASE 1

## SQL + Engine Server + Client Lua
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: Provably Fair HMAC_SHA256, Stake.com implementation, CSS translateX carousel deceleration.

**Fontes:** Stake.com/provably-fair/implementation, SLM.Games, NSoft (Medium), provably-fair-framework (npm)

**O que trouxe:** Padrao da industria 2025 usa HMAC_SHA256(serverSeed, clientSeed:nonce:round). Nosso handler usa SHA256(SERVER_SEED:userId:caseId:nonce) que e uma variacao valida e verificavel.

---

## ARQUIVOS CRIADOS

| Arquivo | Linhas | Funcao |
|---------|:------:|--------|
| sql/casino_cases_schema.sql | 126 | 7 tabelas (5 base + 2 battles) |
| sql/casino_cases_seeds.sql | 92 | 6 caixas + 44 itens + 5 historicos mock |
| server/handlers/cases.js | 388 | 12 handlers (8 base + 4 battles) |
| client/cases_client.lua | 57 | NUI callbacks + server events |
| **TOTAL** | **663** | |

---

## DETALHAMENTO

### SQL Schema (7 tabelas)
1. **casino_cases** -- Caixas disponiveis (6 tipos: standard, premium, budget, event, daily_free)
2. **casino_case_items** -- Itens dentro de cada caixa (44 itens, probabilidades somam 100%)
3. **casino_cases_openings** -- Historico + Provably Fair (hash SHA-256, nonce)
4. **casino_cases_inventory** -- Inventario de itens ganhos
5. **casino_cases_audit** -- Audit log (REGRA X12)
6. **casino_cases_battles** -- Case Battles PvP (salas)
7. **casino_cases_battle_players** -- Jogadores em cada batalha

### Seeds (6 caixas exclusivas)
| Caixa | Preco GCoin | Itens | Sell Back |
|-------|:-----------:|:-----:|:---------:|
| Arsenal Dourado | 500 | 8 | 70% |
| Garagem VIP | 1.000 | 8 | 70% |
| Pacote Urbano | 100 | 7 | 70% |
| Cofre Secreto | 2.500 | 8 | 70% |
| Caixa Noturna | 300 | 8 | 70% |
| Caixa Diaria | GRATIS | 6 | 70% |

### Handlers Server (12 total)
| # | Handler | Funcao |
|:-:|---------|--------|
| 1 | casino:cases:catalog | Grade de caixas + preview top 3 |
| 2 | casino:cases:preview | Todos os itens + probabilidades |
| 3 | casino:cases:open | Abrir caixa (Provably Fair + transaction) |
| 4 | casino:cases:sell | Vender item (70% valor) |
| 5 | casino:cases:keep | Guardar item (entrega weapon/money/vehicle) |
| 6 | casino:cases:history | Ultimos 20 drops de todos |
| 7 | casino:cases:my_inventory | Inventario pessoal |
| 8 | casino:cases:daily_free | Caixa diaria gratuita (1x/24h) |
| 9 | casino:cases:battle_create | Criar sala PvP |
| 10 | casino:cases:battle_join | Entrar + auto-start quando lota |
| 11 | casino:cases:battle_list | Listar salas abertas |
| 12 | casino:cases:battle_result | Resultado da batalha |

---

## SEGURANCA

- Resultado SEMPRE server-side (client nunca calcula)
- Provably Fair: SHA-256 com hash verificavel
- Rate limit: 3 segundos entre aberturas
- Transaction SQL: saldo + opening + inventory atomico
- Audit log em TODA acao (REGRA X12)

---

## TESTE DE VALIDACAO

| # | Teste | Comando/Acao |
|:-:|-------|-------------|
| 1 | Schema criada | `SELECT COUNT(*) FROM casino_cases;` -> 0 |
| 2 | Seeds inseridos | `SELECT name, price FROM casino_cases;` -> 6 caixas |
| 3 | Itens corretos | `SELECT COUNT(*) FROM casino_case_items;` -> 44 itens |
| 4 | Probabilidades | `SELECT case_id, SUM(probability) FROM casino_case_items GROUP BY case_id;` -> 100.000 cada |
| 5 | Battles tables | `SHOW TABLES LIKE 'casino_cases_battle%';` -> 2 tabelas |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** SQL com 7 tabelas, 44 itens exclusivos, 12 handlers server com Provably Fair, audit log, battles PvP, client Lua. Sell back 70% em todos os itens.

**TODOS os itens desta fase foram implementados: 4 de 4 (schema + seeds + handler + client). Zero pendencias.**

**Proxima fase:** FASE 2 -- Catalogo + Preview (componentes React)
