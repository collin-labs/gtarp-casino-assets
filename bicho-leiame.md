# ANIMAL GAME / JOGO DO BICHO (#9) — Blackout Casino GTARP
# PACOTE COMPLETO — 6 arquivos, 3.341 linhas

## COMO INSTALAR

### Passo 1 — Copiar arquivos
```
components/games/bicho/AnimalGame.tsx  -> projeto/components/games/bicho/
components/games/bicho/index.ts        -> projeto/components/games/bicho/
components/casino/BlackoutCasino.tsx    -> SUBSTITUIR o existente
server/handlers/bicho.js               -> projeto/server/handlers/
client/bicho_client.lua                -> projeto/client/
sql/casino_bicho_schema.sql            -> executar no MySQL
```

### Passo 2 — SQL (rodar no MySQL/MariaDB)
```sql
-- Rodar DEPOIS de panel.sql
source sql/casino_bicho_schema.sql;
```
Cria 3 tabelas: casino_bicho_config, casino_bicho_rounds, casino_bicho_audit.

### Passo 3 — Testar no browser (mock)
O jogo funciona no browser com dados fake automaticamente.
Abrir o painel -> aba Arcade -> card Jogo do Bicho -> JOGAR AGORA.

### Passo 4 — FiveM (producao)
No FiveM, o handler bicho.js e bicho_client.lua conectam via NUI.
O AnimalGame.tsx detecta FiveM automaticamente (mesmo padrao do useGameAPI).

## INVENTARIO DE ARQUIVOS

| Arquivo | Linhas | Funcao |
|---------|:------:|--------|
| AnimalGame.tsx | 2.208 | Jogo completo com 6 telas, 16 sons, useAnimate, capsulas 3D |
| index.ts | 1 | Export |
| BlackoutCasino.tsx | 581 | Painel com import + case "anima-game" |
| casino_bicho_schema.sql | 84 | 3 tabelas MySQL (config, rounds, audit) |
| bicho.js | 365 | 5 endpoints server com Provably Fair HMAC_SHA256 |
| bicho_client.lua | 102 | 5 NUI callbacks Lua (ponte React<>Server) |
| **TOTAL** | **3.341** | |

## ENDPOINTS DO SERVIDOR

| Endpoint | Funcao |
|----------|--------|
| casino:bicho:play | Validar aposta + gerar HMAC + sortear + debitar/creditar |
| casino:bicho:getHistory | Ultimas 50 rodadas do jogador |
| casino:bicho:verify | Recalcular HMAC para verificacao Provably Fair |
| casino:bicho:getConfig | Config publica (multiplicadores, limites) |
| casino:bicho:admin:stats | Metricas agregadas (lucro casa, win rate) |

## MULTIPLICADORES

| Modo | Animais | Acerto 1as posicoes | Acerto outras |
|------|:-------:|:-------------------:|:-------------:|
| Simple | 1 | 12x | 3x |
| Dupla | 2 | 90x | 10x |
| Tripla | 3 | 650x | 40x |
| Quadra | 4 | 3.500x | 180x |
| Quina | 5 | 15.000x | 1.200x |

## ASSETS NECESSARIOS (JA EXISTEM NO PROJETO)
- public/assets/games/bicho/1.png a 25.png (25 cards de animais)
- public/assets/shared/ui/bg-casino.png, btn-jogar-ativo.png, btn-jogar-desativo.png
- public/assets/shared/icons/ (gcoin, history, provably-fair, sound-on/off, copy, random)

## PARA VENDER O SCRIPT
Comprador roda: panel.sql (contas) + casino_bicho_schema.sql (jogo).
Cada jogo tem SQL proprio. Se comprar so Crash + Bicho = 3 SQLs no total.
