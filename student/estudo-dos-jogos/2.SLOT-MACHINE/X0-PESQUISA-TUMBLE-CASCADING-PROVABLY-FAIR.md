# X0 — PESQUISA: VIDEO SLOT TUMBLE/CASCADE + PROVABLY FAIR
## Data: 08/04/2026 | Rodadas: 3 | Refs: 20

---

## 1. MECANICA TUMBLE/CASCADE — COMO FUNCIONA

### Fluxo Principal (todas as refs concordam)
1. Jogador aposta e clica SPIN
2. Grid preenche com simbolos aleatorios (caem de cima ou aparecem)
3. Sistema avalia combinacoes vencedoras (cluster de 8+ simbolos iguais em qualquer posicao)
4. Se houver win: simbolos vencedores DESAPARECEM (animacao de explosao/desintegracao)
5. Simbolos restantes CAEM (gravidade) para preencher espacos vazios
6. Novos simbolos caem DO TOPO para preencher o resto
7. Sistema re-avalia o grid — se novo win, repete do passo 4
8. Ciclo continua ate nao haver mais wins (fim da rodada)
9. Jogador paga UMA VEZ (no spin inicial), todos tumbles sao gratis

### Scatter Pays (sem paylines)
- NAO usa paylines tradicionais (linhas horizontais/diagonais)
- Win = 8+ simbolos iguais em QUALQUER posicao no grid
- Quanto mais simbolos, maior o payout (ex: 8 OAK = 1x, 10 OAK = 5x, 12+ OAK = 50x)
- Modelo popularizado por Pragmatic Play (Sweet Bonanza, Gates of Olympus)

### Multiplicadores
- **Base game:** Multiplicadores aparecem aleatoriamente, aplicam ao tumble atual e resetam
- **Free Spins:** Multiplicadores sao CUMULATIVOS — somam a cada tumble e aplicam ao win total
- Valores tipicos: x2, x3, x5, x10, x25, x50, x100 (Sweet Bonanza ate x100, GoO ate x500)
- Multiplicador aparece como simbolo especial (bomba de doce no SB, orbe dourado no GoO)

### Free Spins
- Trigger: 4+ scatter symbols = 10-15 free spins
- Retrigger: 3+ scatters durante FS = +5 spins (sem limite de retrigger)
- Diferencial: multiplicadores cumulativos durante toda a rodada de FS
- Buy Bonus: pagar 100x bet para entrar direto em FS

### Ante Bet
- Aumenta aposta em 25% para dobrar chance de scatter
- RTP nao muda, so frequencia de trigger do bonus

---

## 2. JOGOS DE REFERENCIA (nosso modelo)

### Sweet Bonanza (Pragmatic Play, 2019)
- Grid: 6x5, Scatter Pays, 8+ OAK
- RTP: 96.48-96.51%, Volatilidade Alta
- Tumble + Multiplier Bombs (x2-x100, so em FS)
- Max win: 21,175x
- Trigger FS: 4+ lollipop scatters = 10 spins
- Buy Bonus: 100x bet

### Gates of Olympus (Pragmatic Play, 2021)
- Grid: 6x5, Scatter Pays, 8+ OAK
- RTP: 96.50%, Volatilidade Alta
- Tumble + Multiplier Orbs (x2-x500, base game E FS)
- Max win: 5,000x
- Trigger FS: 4+ Zeus scatters = 15 spins
- Buy Bonus: 100x bet, Ante Bet 25%
- Diferencial: multiplicadores no base game tambem

### NOSSO JOGO (Blackout Casino)
- Grid: **8x4** (32 celulas) — maior que SB/GoO (6x5 = 30)
- Scatter Pays: 8+ OAK (alinhado com padrao da industria)
- RTP: 96.50% (alinhado com GoO)
- Tumble com max 20 cascades (generoso, padrao e ~10-15)
- Multiplier Orb (multiplier_orb.png) durante FS
- Buy Bonus: 100x bet (padrao da industria)
- Ante Bet: +25% aposta, dobra chance scatter
- Provably Fair HMAC-SHA256 (diferencial cripto)

---

## 3. PROVABLY FAIR — IMPLEMENTACAO STAKE.COM

### Algoritmo
```
result = HMAC_SHA256(server_seed, client_seed + ":" + nonce + ":" + cursor)
```
- server_seed: gerado pelo cassino, hash SHA256 publicado ANTES do bet
- client_seed: definido pelo jogador (pode mudar a qualquer momento)
- nonce: incrementa a cada bet (comeca em 0)
- cursor: incrementa quando precisa de mais de 8 numeros aleatorios (32 bytes / 4 bytes = 8)

### Conversao para Grid de Slot
1. Gerar hash HMAC-SHA256 com os parametros
2. Pegar 4 bytes de cada vez do hash (cursor incrementa se precisar de mais)
3. Converter cada 4 bytes em unsigned int (0 a 4.294.967.295)
4. Mapear para indice de simbolo: `symbolIndex = uint % totalSymbols`
5. Para grid 8x4 = 32 celulas, precisa de 32 numeros → cursor incrementa 4x (32/8)

### Verificacao pelo Jogador
1. Antes de jogar: cassino mostra hash do server_seed
2. Jogador define client_seed customizado
3. Joga normalmente (nonce incrementa a cada spin)
4. Ao rotacionar seed: server_seed real eh revelado
5. Jogador verifica: SHA256(server_seed_revelado) == hash_mostrado_antes
6. Jogador recalcula: HMAC_SHA256(server_seed, client_seed:nonce:cursor) e confere resultado

### Nosso SlotsEngine.ts (520L) ja implementa:
- generateGrid() com HMAC-SHA256
- detectWins() para scatter pays 8+ OAK
- processTumble() com max 20 cascades
- executeVideoSpin(), executeClassicSpin(), executeBuyBonus()

---

## 4. ANIMACOES VISUAIS (padrao da industria)

### Spin Inicial
- Simbolos caem do topo com stagger por coluna (coluna 0 primeiro, delay ~100-150ms entre colunas)
- Efeito de "bounce" ao parar (spring animation)
- Duracao total: ~1-2s

### Win Highlight
- Simbolos vencedores brilham (glow na cor do simbolo)
- Simbolos NAO vencedores escurecem (opacity 0.3-0.4)
- Duracao: ~400-600ms

### Tumble/Cascade
- Fase 1: HIGHLIGHT — simbolos vencedores pulsam/brilham (~400ms)
- Fase 2: EXPLOSAO — simbolos vencedores desaparecem (scale 0→0.3, opacity 0, ~200ms)
- Fase 3: GRAVIDADE — simbolos restantes caem para posicoes vazias (spring, ~300ms)
- Fase 4: PREENCHIMENTO — novos simbolos caem do topo (y: -60→0, spring, ~300ms)
- Fase 5: RE-AVALIACAO — grid estabiliza, sistema checa novos wins
- Se novo win: volta para Fase 1

### Scatter Especial
- Destaque visual proprio: borda dourada, radial-gradient, pulse animation
- Aparece com efeito especial (flash/glow) quando cai no grid

### Win Overlay (4 tiers)
- Normal (< 5x): inline no grid, texto simples
- Big (5-49x): overlay semi-transparente, texto grande, countup animado 2s
- Mega (50-499x): overlay escuro, texto maior, particulas, countup 3s
- Jackpot (500x+): overlay total, screen shake, particulas intensas, countup 4s

---

## 5. CONCLUSOES PARA O NOSSO PROJETO

### Problema Principal Identificado
O Video Slot MOSTRA o grid mas NAO ANIMA o spin. A manivela roda mas os simbolos ficam imoveis.
Isso indica que o fluxo handleSpin → animacao de tumble nao esta conectado no renderVideoSlot.

### Correcoes Necessarias
1. **Spin animation**: ao clicar spin/manivela, simbolos devem girar (fade out e novos caem de cima)
2. **Win detection visual**: apos parar, destacar simbolos vencedores com glow
3. **Tumble cascade**: simbolos vencedores explodem, restantes caem, novos preenchem
4. **Loop de re-avaliacao**: repetir highlight→explosao→cascade ate nao ter mais wins
5. **LED painel fixo**: largura fixa para CREDITO/APOSTA/GANHO/JACKPOT
6. **Mode Select hover**: overlay escuro + texto com contraste

### Prioridade
1. Fix spin animation (bloqueante — jogo nao funciona sem isso)
2. Fix LED painel oscilando
3. Fix Mode Select hover
4. Sistema de ajuda "?"
5. Auditoria das telas restantes

---

## REFERENCIAS (20)

| # | Fonte | URL |
|---|-------|-----|
| 1 | McLuck Blog — Cascading Reels Explained | https://blog.mcluck.com/guides/slots/game-mechanics/cascading-reels/ |
| 2 | Slingo — What Are Cascading Reels | https://www.slingo.com/blog/guides/what-are-cascading-reels-and-how-do-they-work/ |
| 3 | BetMGM — How Cascading Slot Reels Work | https://casino.betmgm.com/en/blog/how-cascading-slot-reels-work/ |
| 4 | CasinoBloke — Slot Cascade Feature Explained | https://www.casinobloke.com/articles/slot-cascade-feature-explained-how-tumbling-reels-work-in-online-slots/ |
| 5 | Flip The Switch — Cascading Reels | https://fliptheswitch.com/cascading-or-tumbling-reels-your-chance-for-multiple-wins/ |
| 6 | Casino-HowTo — Cascading Reels Full List | https://casino-howto.com/blog/cascading-reels-in-online-slots-the-feature-explained/ |
| 7 | SpinBlitz — Cascading Slots | https://www.spinblitz.com/slots/cascading-n-tumble |
| 8 | TecMinds — Understanding Cascading Reels | https://tecminds.org/understanding-cascading-reels-in-slot-games/ |
| 9 | Mia's Gaming Journey — Cascading Slots Explained | https://www.miasgamingjourney.com/guides/slots/cascading-slots-explained/ |
| 10 | Bojoko — Top 10 Cascading Slots 2026 | https://bojoko.com/casino/slots/cascading/ |
| 11 | Book of Slots — Sweet Bonanza Super Scatter | https://bookofslots.com/free-slots/sweet-bonanza-super-scatter |
| 12 | Sweet Bonanza Official — Slot Game Review | https://sweetbonanzaslot.us/ |
| 13 | SlotCatalog — Sweet Bonanza Super Scatter Review | https://slotcatalog.com/en/slots/sweet-bonanza-super-scatter |
| 14 | Stake.com — Sweet Bonanza on Stake | https://stake.com/casino/games/pragmatic-play-sweet-bonanza |
| 15 | 32Ten — Sweet Bonanza Guide Rules Features | https://www.32ten.com/sweet-bonanza-slot-guide-rules-features-tricks/ |
| 16 | Stake.com — Provably Fair Implementation | https://stake.com/provably-fair/implementation |
| 17 | StakeSim — Provably Fair Explained 2026 | https://stakesim.com/blog/what-is-provably-fair |
| 18 | GitHub — DeepSearch HashGames | https://github.com/nucleare/DeepSearch_HashGames |
| 19 | PokerNews — Gates of Olympus Guide | https://www.pokernews.com/casino/slots/gates-of-olympus-slot-review.htm |
| 20 | BigWinBoard — Gates of Olympus Super Scatter | https://www.bigwinboard.com/gates-of-olympus-super-scatter-pragmatic-play-slot-review/ |
