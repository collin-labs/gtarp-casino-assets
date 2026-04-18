# REFORCO VISUAL — BINGO (#21) — REVISADO v2
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: aspect-ratio grid (web.dev, michellebarker), cell state combinations (Doc7-P3), Canvas ball physics (Doc6A gravity 0.05/0.15), scroll-snap mobile (Doc6B)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] CARTELA 5x5: width clamp(120px,16vw,180px), grid repeat(5,1fr) gap 1-3px
- [ ] CELULAS com 7+ ESTADOS CSS exatos (empty, called, dabbed, lucky, winning, free-space, one_to_go)
- [ ] Centro FREE: bg rgba(212,168,67,0.15), border gold 0.4, cor #D4A843, texto "FREE"
- [ ] Ball machine: Canvas 2D oval clamp(140px,18vw,200px)×clamp(100px,14vw,160px), borderRadius 50%/40%
- [ ] 15 bolas quicando: gravity 0.05 idle / 0.15 active, turbulence 0.08/0.3
- [ ] Lucky Numbers: circulos 24px border 2px #FFD700 + badges multiplicador x2/x3/x5
- [ ] Card Selector: 4 slots (vazio dashed + preenchido verde mini-grid dots)
- [ ] Pattern display: mini-grid 5x5 (alvo dourado, inativo escuro, FREE estrela)
- [ ] Resultado WIN: "BINGO!" VERDE #00E676 spring 400 + card com rolling counter + confetti 30 particles
- [ ] Resultado MEGA WIN: "MEGA BINGO!" gradient metalico WebkitBackgroundClip text + 50 particles + screenShake
- [ ] Resultado LOSE: discreto #D4A843 opacity 0.7 + shake sutil + SEM confetti
- [ ] Wild Ball: pausa 1.5s + trail verde + "+N BOLAS EXTRAS" badge
- [ ] "1 To Go": oneToGoPulse 0.8s urgencia + barra flash "FALTA 1!"
- [ ] History: entries expandiveis com mini-circles + mini-cartela + scroll mask gradient
- [ ] Mobile 375px: swipe cartelas scroll-snap + botao JOGAR fixed bottom
- [ ] 10 telas: CardSelector, Sorteio, LuckyHit, WildBall, 1ToGo, Win, Lose, MegaWin, History+PF, Mobile
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  display: 'flex', flexDirection: 'column', padding: 'clamp(8px,1.5vw,20px)',
}}
```

Titulo "BINGO": Cinzel 900 clamp(14px,2vw,24px) #D4A843 letterSpacing 3px textShadow `0 0 12px rgba(255,215,0,0.6), 0 2px 6px rgba(0,0,0,1)`.
Saldo: JetBrains 700 clamp(11px,1.3vw,16px) #00E676 textShadow verde.

---

## 2. CARTELA 5x5 — 7+ ESTADOS CELULA

CARD: bg rgba(5,5,5,0.95), border 1.5px rgba(212,168,67,0.3), borderRadius clamp(8px,1vw,14px), width **clamp(120px,16vw,180px)**, boxShadow 3 camadas.
GRID: `repeat(5,1fr)`, gap clamp(1px,0.2vw,3px).
CELULA BASE: aspectRatio 1, JetBrains 700 clamp(7px,0.9vw,12px), borderRadius clamp(2px,0.3vw,4px).

**7+ ESTADOS (CSS EXATOS combinando Doc7-P1 + P3):**

| Estado | background | border | color | animation |
|--------|-----------|--------|-------|-----------|
| **empty** | rgba(17,17,17,0.8) | 1.5px rgba(255,255,255,0.1) | rgba(255,255,255,0.6) | — |
| **called** (sorteado, nao marcado) | rgba(212,168,67,0.1) | rgba(212,168,67,0.5) | #FFD700 | pulse 1.5s |
| **dabbed** (marcado) | linear-gradient(135deg, rgba(0,230,118,0.2), rgba(0,200,83,0.15)) | #00E676 | #00E676 | — |
| **lucky** (Lucky Number) | rgba(212,168,67,0.08) | 2px rgba(255,215,0,0.6) | #FFD700 | luckyPulse 1.5s + glow 12px |
| **lucky_dabbed** | rgba(255,215,0,0.2) | 2px #FFD700 | #FFD700 | glow 16px+30px DUPLO |
| **winning** (padrao vencedor) | linear-gradient(135deg, rgba(0,230,118,0.3), rgba(255,215,0,0.2)) | #00E676 | #00E676 | winning-flash 0.6s |
| **free-space** (centro [2,2]) | rgba(212,168,67,0.15) | rgba(212,168,67,0.4) | #D4A843 | — |
| **one_to_go** | rgba(255,215,0,0.12) | 2px rgba(255,215,0,0.8) | #FFD700 | oneToGoPulse 0.8s |
| **wild** (centro FREE metalico) | gradient 5-stop (#462523→#CB9B51→#F6E27A→#CB9B51→#462523) | 2px rgba(255,215,0,0.7) | #FFFFFF | glow 12px |

Auto-dab: Framer scale [1, 1.15, 1] + flashGreen 0.3s.
Lucky hit: Framer scale [1, 1.3, 1] + flashGold 0.8s + screenShake.

---

## 3. BALL MACHINE — Canvas 2D oval

WRAPPER: width clamp(140px,18vw,200px), height clamp(100px,14vw,160px), borderRadius `50% / 40%`, border 2px rgba(212,168,67,0.25).
15 bolas quicando: radialGradient branco→cor→preto, raio 6px, numero Inter bold 5px.
**Physics:** gravity 0.05 + turbulence 0.08 (idle) / gravity 0.15 + turbulence 0.3 (active).
Bola sorteada: escala 0.5→1.5 em 500ms bezier, voa pra cima e sai.
Ativo: boxShadow `0 0 30px rgba(212,168,67,0.15), 0 0 60px rgba(212,168,67,0.06)`.
Wild: borderColor rgba(0,230,118,0.4), boxShadow verde.

BALL DISPLAY: flex row, gap clamp(2px,0.3vw,4px), overflowX auto.
Bola normal: 28px circle, bg #1A1A1A, border 1px rgba(212,168,67,0.2), JetBrains bold 10px.
Bola Lucky: bg rgba(255,215,0,0.15), border 2px #FFD700, glow 8px.
Bola Wild: bg rgba(0,230,118,0.2), border 2px #00E676, glow 12px.
Framer: spring stiffness 500 por bola.

---

## 4. CARD SELECTOR + PATTERN + LUCKY NUMBERS

4 SLOTS: flex row gap clamp(6px,1vw,12px), scrollSnap em mobile.
Vazio: dashed 1.5px rgba(212,168,67,0.25), "+" clamp(16px,2.5vw,28px), "COMPRAR" Cinzel, preco JetBrains #00E676.
Preenchido: border 1.5px rgba(0,230,118,0.3), bg rgba(0,230,118,0.05), mini-grid 5×5 dots 2px verdes.

Pattern mini-grid 5×5: alvo bg rgba(212,168,67,0.3) border rgba(255,215,0,0.5), inativo bg rgba(15,15,15,0.6). Label Cinzel #D4A843. Payout JetBrains #00E676 "Paga: 15x".
8 padroes: X-SHAPE, FOUR_CORNERS, HORIZONTAL, VERTICAL, DIAGONAL, L-SHAPE, T-SHAPE, FULL_CARD.

Lucky Numbers: circulo 24px border 2px #FFD700, badge "×2"/"×3"/"×5" JetBrains 9px #FFD700.

Btn JOGAR: `background:'linear-gradient(180deg, #00C853, #00E676 30%, #004D25)', border:'1px solid rgba(0,230,118,0.4)', borderRadius:10, fontFamily:"'Cinzel',serif", fontWeight:800, fontSize:'clamp(12px,1.5vw,18px)', letterSpacing:2, color:'#FFFFFF', boxShadow:'0 4px 15px rgba(0,200,83,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'`.

3 tipos cartela: Basica G$100 (max 2500, x1), Premium G$200 (7500, x3), VIP G$500 (25000, x10).

---

## 5. TELAS ESPECIAIS — Wild Ball + 1 To Go + Lucky Hit

**LUCKY HIT (Tela 3):** flash dourado tela inteira rgba(255,215,0,0.08) 300ms. Bola Lucky escala 1→1.3→1 + glow 20px. Multiplicador rolling "×2"→"×6" JetBrains 700 clamp(14px,2vw,20px) #FFD700.

**WILD BALL (Tela 4):** ball machine PAUSA. Bola #15 sai com trail VERDE. Flash verde 500ms. "WILD BALL!" Cinzel 900 clamp(18px,3vw,30px) #00E676 textShadow 3 camadas + spring stiffness 300. Badge "+N BOLAS EXTRAS" JetBrains #00E676. **PAUSA 1.5s** dramatica antes de retomar.

**1 TO GO (Tela 5):** barra "FALTA 1!" Cinzel #FFD700 pulsante opacity [0.5,1,0.5] repeat infinity. Celula faltante: oneToGoPulse 0.8s (urgencia maxima). Cartela afetada: borda rgba(255,215,0,0.5) + glow 15px.

---

## 6. RESULTADOS — 3 NIVEIS

**BINGO! (Tela 6):** overlay rgba(0,0,0,0.75) blur(6px). "BINGO!" Cinzel 900 clamp(28px,5vw,52px) **#00E676** (VERDE!) textShadow 3 camadas verdes, spring stiffness 400 damping 20. Card: bg gradient escuro, border 1.5px rgba(0,230,118,0.3), glow verde. Rolling counter JetBrains clamp(24px,4vw,44px) #00E676. Detalhes: "Base: ×15 | Lucky: ×6 | Final: ×90". Confetti 30 particulas [#FFD700, #D4A843, #00E676, #FFFFFF]. Auto-dismiss 8s.

**MEGA BINGO! (Tela 8):** flash branco 200ms + screenShake 500ms. Titulo com **gradient metalico clip-text**:
```
background: 'linear-gradient(to bottom, #CFC09F 22%, #634F2C 24%, #CFC09F 26%, #FFECB3 40%, #3A2C0F 78%)',
WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
filter: 'drop-shadow(0 2px 8px rgba(212,168,67,0.6))',
fontSize: 'clamp(32px, 6vw, 60px)',
```
Confetti **50** particulas (vs 30 normal). Valor #FFD700 dourado. Card border #D4A843 + glow 30px dourado.

**DERROTA (Tela 7):** "NAO FOI DESTA VEZ" Cinzel 700 clamp(16px,2.5vw,28px) rgba(212,168,67,0.7). Screen shake sutil x[-3,3,-2,2,0] 0.4s. Card border rgba(212,168,67,0.15). SEM confetti. SEM glow.

---

## 7. HISTORICO + PF (Tela 9)

Entry card: bg gradient #1A1A1A→#141414, border 1px rgba(212,168,67,0.15), borderRadius 10px, stagger 0.05s.
Expandido (AnimatePresence): mini-circles 20 bolas (verde=match, cinza=miss, dourado=lucky, verde neon=wild) + mini-cartela 5×5.
Scroll: maskImage `linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)`, scrollbarWidth thin, scrollbarColor rgba(212,168,67,0.2).

PF Modal: glassmorphism blur(12px) saturate(1.2). 4 campos JetBrains mono wordBreak break-all. Copiar→"Copiado!" 2s verde. Verificar→badge "#00E676 VERIFICADO" ou "#FF1744 FALHA".

---

## 8. MOBILE 375px (Tela 10)

Cartelas: UMA ativa grande ~280px + demais como mini dots 10px. **scroll-snap-type: x mandatory**, scroll-snap-align: center. Swipe horizontal pra navegar. Counter "Cartela 2/4".
Ball machine: 140×100px menor.
Btn JOGAR: position fixed bottom 0, width 100%, bg gradient escuro atras, z-30.
Ball display: max 10 visiveis + "..." + counter, overflow scroll-x.

```css
/* Mobile <640px */
.bingo-cards-container { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 8px; padding: 0 calc(50% - 140px); }
.bingo-card-wrapper { scroll-snap-align: center; flex-shrink: 0; width: 280px; }
.bingo-play-btn-mobile { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(to top, #0A0A0A 60%, transparent); z-index: 30; }
```

---

## 9. KEYFRAMES (8)

```css
@keyframes luckyPulse { 0%,100% { box-shadow: 0 0 8px rgba(255,215,0,0.2); } 50% { box-shadow: 0 0 16px rgba(255,215,0,0.5); } }
@keyframes oneToGoPulse { 0%,100% { box-shadow: 0 0 12px rgba(255,215,0,0.3); border-color: rgba(255,215,0,0.5); } 50% { box-shadow: 0 0 24px rgba(255,215,0,0.6); border-color: rgba(255,215,0,0.9); } }
@keyframes bingo-cell-pulse { 0%,100% { box-shadow: 0 0 6px rgba(212,168,67,0.2); } 50% { box-shadow: 0 0 14px rgba(212,168,67,0.5); } }
@keyframes bingo-winning-flash { 0%,100% { box-shadow: 0 0 10px rgba(0,230,118,0.2); } 50% { box-shadow: 0 0 25px rgba(0,230,118,0.5); } }
@keyframes flashGold { 0% { background-color: transparent; } 15% { background-color: rgba(255,215,0,0.08); } 100% { background-color: transparent; } }
@keyframes flashGreen { 0% { background-color: transparent; } 15% { background-color: rgba(0,230,118,0.15); } 100% { background-color: transparent; } }
@keyframes screenShake { 0%,100% { transform: translate(0,0); } 10% { transform: translate(-4px,-2px); } 20% { transform: translate(4px,3px); } 30% { transform: translate(-3px,-1px); } 40% { transform: translate(3px,2px); } }
@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(300px) rotate(720deg); opacity: 0; } }
```

---

## 10. O QUE NAO FAZER (PROIBIDO — 16 regras)

```
1.  NUNCA ball machine em DOM — Canvas 2D obrigatorio com physics (gravity 0.05/0.15)
2.  NUNCA grid sem celula FREE central
3.  NUNCA cartela > clamp(120px,16vw,180px) — compacta, 4 lado a lado
4.  NUNCA "BINGO!" em dourado — eh VERDE #00E676
5.  NUNCA "MEGA BINGO!" sem gradient metalico WebkitBackgroundClip text
6.  NUNCA Wild Ball sem pausa dramatica 1.5s antes de retomar
7.  NUNCA "1 to go" sem pulse RAPIDO 0.8s
8.  NUNCA resultado sem rolling counter animado
9.  NUNCA Lucky Number sem badge multiplicador (x2/x3/x5)
10. NUNCA celula "called" sem pulse (o V0 precisa diferenciar "sorteado mas nao marcado")
11. NUNCA celula "winning" sem flash 0.6s (celebra padrao completado)
12. NUNCA mobile sem scroll-snap cartelas + fixed bottom JOGAR
13. NUNCA fundo claro — #0A0A0A
14. NUNCA sans-serif em titulos — Cinzel
15. NUNCA px fixo — SEMPRE clamp()
16. NUNCA botao < 44px
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Cartela | ~240-340px gigante | clamp(120px,16vw,180px) compacta — 4 lado a lado |
| Celula empty | #14141F branco | rgba(17,17,17,0.8) border white 0.1 |
| Celula called | Nao existe no VR | bg gold 0.1 + pulse 1.5s (sorteado NAO marcado) |
| Celula winning | Nao existe no VR | bg green+gold gradient + winning-flash 0.6s |
| BINGO! | Texto dourado | VERDE #00E676 spring 400 + confetti 30 |
| MEGA BINGO! | Nao existe no VR | Gradient metalico clip-text + 50 particulas + screenShake |
| Wild Ball | Conceito vago | Pausa 1.5s + trail verde + badge extras + glow verde |
| Ball physics | Nao mencionado | gravity 0.05 idle / 0.15 active, turbulence 0.08/0.3 |
| Mobile | Nao mencionado | scroll-snap cartelas + dots + fixed bottom JOGAR |
| History | Nao mencionado | Entries expandiveis + mini-circles + scroll mask gradient |

---

`[REVISADO v2: 01B-V0-VISUAL-REFORCE-BINGO-REVISADO.md — Abril 2026 — 106L → ~340L]`
`[X0: 15+ refs — grid (web.dev animated grid, codepen michellebarker aspect-ratio, css-tricks), bingo (github ericbastarache/TheCountOfPeru, reactjsexample ×2, codepen oliviale/jacobmo92), animation (prismic 39 examples, animate.style, gpatuwo css-casino, codesandbox animate-css-grid), previous (motion.dev, MDN rAF, logrocket)]`
