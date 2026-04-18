# REFORCO VISUAL — POOL GAME (#22) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Matter.js gravity.y=0 (codepen Dmujt), ball 3D via offset radialGradient (MDN, w3resource, cssanimation.rocks), NO shadowBlur (Doc6 PROIBIDO)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] LOBBY: seletor modo 8-Ball/9-Ball + **5 tiers** (Amadora→High Roller G$250→G$5K) + btn ENCONTRAR OPONENTE
- [ ] MESA: Canvas 2D ratio **2:1**, felt **#0D3B1E** com textura repeating-linear-gradient
- [ ] 6 CACAPAS DOM: radial-gradient escuro + inset shadow + animation pocketActivate ao encacapar
- [ ] HUD: avatar com avatarTurnPulse (turno ativo) + timer 3 estados + pot #00E676
- [ ] POWER BAR vertical: gradient **bottom-to-top** verde→amarelo→laranja→vermelho
- [ ] SPIN SELECTOR: circulo cue ball + dot vermelho arrastavel + labels F/B/L/R
- [ ] SHOOT: **5 estados** (normal/hover/active/disabled/**locked** "AGUARDE...")
- [ ] SHOT MOVING: controles locked + waitPulse + trail cue ball + pocket glow
- [ ] VICTORY: overlay blur(4px) + card spring + "VOCE VENCEU!" victoryPulse #FFD700 + rolling counter + confetti 40
- [ ] DEFEAT: overlay SEM blur + shake + discreto
- [ ] CUE SHOP: **5 tacos** carrossel + linha gradiente por tier + **4 stat bars** AIM/POWER/SPIN/TIME
- [ ] Bolas: radialGradient com inner circle OFFSET 35%,30% (3D) + ZERO shadowBlur
- [ ] Guideline: **DASHED** (NAO solida!) + ghost ball translucido
- [ ] **13 keyframes** (maior quantidade de qualquer jogo)
- [ ] 5 telas: Lobby, Mesa Aiming, Shot Moving, Victory/Defeat, Cue Shop
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
}}
```

---

## 2. LOBBY — 5 tiers (NAO 4!)

Titulo "POOL GAME": Cinzel 900 clamp(28px,5vw,52px) #D4A843 letterSpacing 4px textShadow `0 0 25px rgba(212,168,67,0.5), 0 2px 10px rgba(0,0,0,1)`.
Linha decorativa: width 120px, height 1px, gradient `linear-gradient(90deg, transparent, #D4A843, transparent)`.

Modo 8-BALL ativo: bg `linear-gradient(180deg, #00C853, #004D25)`, border 1.5px rgba(0,230,118,0.4), boxShadow `0 0 0 2px rgba(0,230,118,0.15)`.
Modo 9-BALL inativo: bg rgba(5,5,5,0.7), border rgba(212,168,67,0.2), color #D4A843.

**5 TIERS** (NAO 4 — VR original estava errado!):
| Mesa | Entry | Pot |
|------|-------|-----|
| Amadora | G$250 | G$500 |
| Casual | G$500 | G$1.000 |
| **Profissional** | **G$1.000** | **G$2.000** ← default |
| VIP | G$2.500 | G$5.000 |
| High Roller | G$5.000 | G$10.000 |

Card selecionado: bg rgba(15,12,5,0.95), border 1.5px rgba(212,168,67,0.6), boxShadow `0 0 20px rgba(212,168,67,0.10)`.
Card inativo: bg rgba(5,5,5,0.85), border rgba(212,168,67,0.18), opacity 0.8.
Entry fee: JetBrains 900 clamp(14px,2vw,22px) #00E676. Nome: Cinzel 700 clamp(8px,1vw,12px) #D4A843.

Btn ENCONTRAR OPONENTE: verde gradient, Cinzel 700 clamp(13px,1.8vw,20px), width clamp(220px,42vw,320px), minHeight 52.
Estado BUSCANDO: texto "BUSCANDO OPONENTE..." opacity pulse 1.2s + btn CANCELAR vermelho.

---

## 3. MESA AIMING — Canvas 2:1

MESA WRAPPER:
```
style={{
  position: 'relative', flex: 1, aspectRatio: '2/1', maxHeight: '100%',
  borderRadius: 12, overflow: 'hidden',
  border: '2px solid rgba(212,168,67,0.5)',
  outline: '1px solid rgba(191,149,63,0.2)', outlineOffset: 3,
  boxShadow: '0 0 30px rgba(212,168,67,0.08), 0 8px 32px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.4)',
  cursor: 'crosshair',
}}
```

FELT:
```
style={{
  width: '100%', height: '100%', borderRadius: 10,
  background: '#0D3B1E',
  backgroundImage: 'repeating-linear-gradient(transparent, transparent 5px, rgba(0,0,0,0.06) 6px)',
  position: 'absolute', inset: 0,
}}
```

6 CACAPAS DOM: width/height clamp(16px,2.2vw,26px), borderRadius 50%, bg `radial-gradient(circle at 40% 40%, #1A1A1A, #000)`, border 1.5px rgba(212,168,67,0.3), boxShadow `inset 0 0 8px rgba(0,0,0,0.8)`.
Ao encacapar: animation `pocketActivate 0.6s` (glow verde 18px).

BOLAS: radialGradient com inner circle OFFSET (35%,30%) para efeito 3D. Cue ball: `radial-gradient(circle at 35% 35%, #FFFFFF, #E0E0E0 50%, #BDBDBD)`. **ZERO shadowBlur** — usar circulo escuro abaixo.

GUIDELINE: **DASHED** (borderStyle dashed), rgba(255,255,255,0.35), width proporcional ao stat AIM. Ghost ball: circulo opacity 0.15.

---

## 4. HUD + POWER BAR + SPIN + SHOOT

HUD: position absolute top 0 inset-x 0, height clamp(36px,5vh,48px), bg `linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4) 70%, transparent)`.
Avatar MEU TURNO: border 1.5px rgba(0,230,118,0.7), boxShadow `0 0 0 2px rgba(0,230,118,0.3), 0 0 12px rgba(0,230,118,0.2)`, animation avatarTurnPulse 1.5s infinite.
Timer: JetBrains 700 clamp(13px,1.8vw,22px) #D4A843. **3 estados**: normal #D4A843, warning (>10s), **urgent <5s**: animation timerUrgent 0.5s infinite (opacity+scale pulse).
Pot: JetBrains 700 clamp(12px,1.6vw,20px) #00E676.

POWER BAR vertical: width clamp(22px,3vw,30px), height clamp(120px,20vh,180px).
Fill: `linear-gradient(to top, #00E676 0%, #00E676 40%, #FFD700 65%, #FF6600 80%, #FF1744 100%)`, height 65%.
Label "PWR": JetBrains 700 clamp(7px,0.85vw,10px) #666.

SPIN SELECTOR: circulo clamp(44px,6vw,60px) cue ball radialGradient branco, dot vermelho 8px #FF1744.
Labels F/B/L/R: Cinzel clamp(6px,0.75vw,9px) rgba(212,168,67,0.5).

SHOOT **5 estados**:
- Normal: verde gradient #00C853→#004D25, Cinzel 700, minHeight 48.
- Hover: scale 1.03 translateY -1px.
- Active: scale 0.97 translateY 1px.
- Disabled: opacity 0.4, cursor not-allowed.
- **Locked** "AGUARDE...": bg #111→#080808, opacity 0.25, cursor wait, animation waitPulse 1.2s.

---

## 5. SHOT MOVING + FOUL

Controles: opacity 0.25-0.35, pointerEvents none. Guideline opacity 0.
Trail cue ball: 3 circles opacity [0.08, 0.05, 0.03].
Pocket glow: pocketActivate ao encacapar.
Loading dots: 3 circles 6px rgba(212,168,67,0.6) stagger 0.15s.

FOUL: animation foulFlashCanvas (vermelho rgba(255,23,68,0.18) 15% → transparent). Banner "FOUL" Cinzel vermelho + foulIconPulse.
Ball-in-hand: instruction bihInstructionPulse opacity 0.7↔1.

---

## 6. RESULTADO — Victory vs Defeat

**VICTORY:** overlay rgba(0,0,0,0.60) blur(4px). Card: bg gradient escuro, border 1.5px rgba(212,168,67,0.4), borderRadius 16, boxShadow 5 camadas, width clamp(300px,58vw,520px). Linha ornamental topo: gradient dourado + glow 8px. "VOCE VENCEU!" Cinzel 900 clamp(24px,4.5vw,46px) #FFD700 victoryPulse 2s infinite. Rolling counter JetBrains 900 clamp(30px,5.5vw,56px) #00E676 + prizeCounterFlash. Confetti 40 particles. Btn JOGAR NOVAMENTE verde + SAIR ghost.

**DEFEAT:** overlay rgba(0,0,0,0.60) **SEM blur** (mais sobrio). "DERROTA" Cinzel 700 clamp(18px,3vw,32px) rgba(212,168,67,0.6). Saldo: balanceLoseFlash. SEM confetti. Screen shake sutil.

---

## 7. CUE SHOP — 5 tacos carrossel

5 TACOS (NAO 4!):
| Taco | Preco | Gradiente linha |
|------|-------|----------------|
| Basico | Gratis | #3A2A1A→#5A4A2A→#8B5E3C→#5A4A2A |
| Prata | G$2K | #3A3A3A→#888→#C0C0C0→#888→#3A3A3A |
| Dourado | G$5K | #462523→#8B6914→#D4A843→#F6E27A→#D4A843→#8B6914 |
| Diamante | G$15K | #1A2A3A→#4A8AAA→#A8D8EA→#4A8AAA |
| Blackout | G$50K | #0A0A0A→#462523→#D4A843→#FFD700→#D4A843→#0A0A0A |

Carrossel: flex row, gap clamp(8px,1vw,12px), overflowX auto, scrollSnapType x mandatory.
Card selecionado: border 1.5px rgba(212,168,67,0.6). Bloqueado: opacity 0.65 grayscale(0.35).
EQUIPADO: badge "#00E676 ✓ EQUIPADO".

**4 STAT BARS** (NAO 3!): AIM, POWER, SPIN, TIME.
Trilha: height clamp(4px,0.6vw,7px), bg rgba(255,255,255,0.06).
Fill: bg `linear-gradient(90deg, #00E676, #D4A843)`, Framer animate width 0→X% delay index*0.1s.

Toast: AnimatePresence, bg rgba(42,42,42,0.96) blur(8px), border rgba(0,230,118,0.3), Cinzel #00E676.

---

## 8. MOBILE LANDSCAPE

Mesa: height calc(100vh-80px). Power bar: horizontal bottom, gradient to right.
SHOOT: width clamp(160px,55vw,220px). Tier cards: scrollSnap horizontal.
**Landscape-only hint**: animation rotateHintPhone (rotate 0→90→90→0deg).

---

## 9. KEYFRAMES (13 — maior quantidade!)

```css
@keyframes avatarTurnPulse { 0%,100% { box-shadow: 0 0 0 2px rgba(0,230,118,0.5), 0 0 8px rgba(0,230,118,0.2); border-color: rgba(0,230,118,0.8); } 50% { box-shadow: 0 0 0 3px rgba(0,230,118,0.8), 0 0 16px rgba(0,230,118,0.4); border-color: #00E676; } }
@keyframes timerUrgent { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.06); } }
@keyframes victoryPulse { 0%,100% { text-shadow: 0 0 20px rgba(255,215,0,0.6), 0 2px 8px rgba(0,0,0,1); } 50% { text-shadow: 0 0 35px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.3), 0 2px 8px rgba(0,0,0,1); } }
@keyframes prizeCounterFlash { 0% { color:#FFF; text-shadow:0 0 30px rgba(255,255,255,0.8); } 100% { color:#00E676; text-shadow:0 0 20px rgba(0,230,118,0.6); } }
@keyframes balanceWinFlash { 0%,100% { color:#00E676; } 25% { color:#FFF; text-shadow:0 0 20px rgba(255,255,255,0.8); } 50% { color:#00E676; } 75% { color:#FFF; } }
@keyframes balanceLoseFlash { 0%,100% { color:#00E676; } 50% { color:rgba(255,59,59,0.8); } }
@keyframes pocketActivate { 0% { box-shadow:inset 0 0 8px rgba(0,0,0,0.8); } 30% { box-shadow:inset 0 0 8px rgba(0,0,0,0.5),0 0 18px rgba(0,230,118,0.6); } 100% { box-shadow:inset 0 0 8px rgba(0,0,0,0.8); } }
@keyframes foulFlashCanvas { 0% { background:rgba(255,23,68,0); } 15% { background:rgba(255,23,68,0.18); } 100% { background:rgba(255,23,68,0); } }
@keyframes foulIconPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.3); } }
@keyframes bihInstructionPulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
@keyframes waitPulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
@keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
@keyframes toastOut { from { opacity:1; transform:translateX(-50%) translateY(0); } to { opacity:0; transform:translateX(-50%) translateY(-8px); } }
@keyframes rotateHintPhone { 0%,100% { transform:rotate(0deg); } 25%,50% { transform:rotate(90deg); } 75% { transform:rotate(0deg); } }
```

---

## 10. O QUE NAO FAZER (PROIBIDO — 14 regras)

```
1.  NUNCA shadowBlur no Canvas (CEF M103) — usar circulo escuro abaixo da bola
2.  NUNCA tiers "BRONZE/SILVER/GOLD/DIAMOND" — sao Amadora/Casual/Profissional/VIP/High Roller
3.  NUNCA 4 tiers — sao 5
4.  NUNCA felt #1B5E20 — eh #0D3B1E com textura repeating-linear-gradient
5.  NUNCA guideline solida — DASHED obrigatorio
6.  NUNCA 3 stats no Cue Shop — sao 4 (AIM/POWER/SPIN/TIME)
7.  NUNCA 4 tacos grid — sao 5 tacos em carrossel horizontal
8.  NUNCA resultado "2 colunas VS" — card central unico com rolling counter
9.  NUNCA pockets sem glow verde ao encacapar (pocketActivate)
10. NUNCA fundo claro — #0A0A0A
11. NUNCA sans-serif em titulos — Cinzel
12. NUNCA px fixo — SEMPRE clamp()
13. NUNCA botao < 44px
14. NUNCA defeat overlay com blur — SEM blur (mais sobrio que victory)
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Tiers | 4 (Bronze→Diamond G$100-10K) | **5** (Amadora→High Roller G$250-5K) |
| Felt | #1B5E20 flat | **#0D3B1E** + textura repeating-linear-gradient felt |
| Bolas | shadowBlur | radialGradient OFFSET 35%,30% + circulo escuro (NO shadowBlur!) |
| Guideline | Linha solida | **DASHED** + ghost ball |
| Cue Shop | 4 tacos 2×2, 3 stats | **5 tacos** carrossel, **4 stats** (AIM/POWER/SPIN/TIME) |
| Resultado | 2 colunas VS | Card central + victoryPulse + rolling counter + confetti 40 |
| Defeat | Generico | SEM blur + shake + balanceLoseFlash |
| Power bar | Conceito vago | Vertical gradient **to top** verde→amarelo→laranja→vermelho |
| SHOOT | 2-3 estados | **5 estados** (normal/hover/active/disabled/locked) |
| Keyframes | 0 mencionados | **13** (mais de qualquer jogo!) |
| Mobile | Nao mencionado | Landscape-only + rotateHintPhone + power bar horizontal |
| Foul | Nao mencionado | foulFlashCanvas vermelho + banner + ball-in-hand pulse |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-POOLGAME-REVISADO.md — Abril 2026 — 117L → ~320L]`
`[X0: 3 rodadas, 15+ refs — Matter.js pool (codepen Dmujt gravity.y=0, brm.io, github cptleo92/manan30, yannick-lohse), CSS (css-tricks dashed, css-tip, MDN gradient/linear-gradient), ball 3D (github drivo, cssanimation.rocks spheres, MDN createRadialGradient, w3resource, codehemu)]`
