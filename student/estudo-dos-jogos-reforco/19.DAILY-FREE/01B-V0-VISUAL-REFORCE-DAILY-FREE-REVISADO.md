# REFORCO VISUAL — DAILY-FREE (#19) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Offscreen pre-render (spinthewheel.cc), useRef NOT useState for angle/velocity (atomicobject, ruse.marshall), velocity*=0.985 friction (konvajs Wheel)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Layout flex row: RODA (55%) + CALENDARIO (45%)
- [ ] RODA: Canvas 2D com offscreen pre-render (NAO redesenhar segmentos a cada frame!)
- [ ] SPIN: velocity *= 0.985 por frame via rAF (deceleration CONTINUA, NAO fases discretas)
- [ ] useRef para angle/velocity (NAO useState — re-render 60fps mata performance)
- [ ] Moldura: arc lineWidth 12px gradient metalico dourado + 4 pins cardinais (NAO 16-24 LEDs)
- [ ] Idle sway: CSS rotate -2deg a +2deg em 8s infinite (dfIdleSway)
- [ ] Ponteiro: PNG fixo topo, bounce 0.5s ao parar (dfPointerBounce)
- [ ] CALENDARIO: grid 7 colunas, 30 dias, 4 estados (claimed/available/future/missed)
- [ ] Streak + milestones 7d(azul #4B69FF)/14d(roxo #8847FF)/30d(dourado #FFD700)
- [ ] Botao GIRAR: verde gradient pulsante (dfSpinPulse) + 3 estados (idle/spinning/claimed)
- [ ] 7 telas: Idle, Spinning, Claimed, Resultado, Milestone, PF, Historico
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER + LAYOUT

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  display: 'flex', flexDirection: 'column',
}}
```

Layout: flex row — roda 55% esquerda + calendario 45% direita.

---

## 2. RODA DA FORTUNA — Canvas 2D offscreen pre-render

Container: position relative, width clamp(200px,28vw,340px), borderRadius 50%.
Canvas offscreen 600x600: segmentos com radialGradient alternado (#2A2A2A/#141414 e #1F1F1F/#0F0F0F).
Moldura: arc lineWidth 12px, strokeStyle gradient metalico #8B6914→#D4A843→#F6E27A→#D4A843→#8B6914.
4 PINS dourados nos pontos cardinais (arc fillStyle #FFD700).
Hub central: r=22, radialGradient #1A1A1A→#0A0A0A, stroke #D4A843.
Ponteiro: img PNG absolute top, translateX(-50%), 3 drop-shadows dourados.

**IDLE:** animation dfIdleSway 8s infinite (rotate -2deg a +2deg).
**SPINNING:** idle sway desativado, JS rAF controla rotacao:
```js
// useRef para angle e velocity (NUNCA useState)
const angleRef = useRef(0);
const velocityRef = useRef(0);
// Cada frame:
velocityRef.current *= 0.985; // friction continua
angleRef.current += velocityRef.current;
ctx.clearRect(0,0,w,h);
ctx.save(); ctx.translate(cx,cy); ctx.rotate(angleRef.current);
ctx.drawImage(offscreenCanvas, -cx, -cy); // 1 operacao por frame
ctx.restore();
if (velocityRef.current < 0.001) { /* parou → resultado */ }
```
**CLAIMED:** opacity 0.4, filter saturate(0.5) brightness(0.6), animation none.

---

## 3. CALENDARIO — Grid 30 dias + Streak

Grid: `repeat(7, 1fr)`, gap clamp(3px,0.4vw,6px).

DIA FUTURO: bg #1A1A1A, border 1px rgba(212,168,67,0.08), color rgba(212,168,67,0.3).
DIA DISPONIVEL (hoje): border 1.5px #00E676, boxShadow `0 0 8px rgba(0,230,118,0.3)`, animation dfDayBreathe 3s infinite.
DIA CLAIMADO: bg rgba(0,230,118,0.05), border 1px #D4A843, check SVG #00E676 centralizado.
DIA PERDIDO: opacity 0.3, bg rgba(235,75,75,0.05), X sutil pseudo.

Milestones: 7d azul #4B69FF, 14d roxo #8847FF, 30d dourado #FFD700.
Streak: Cinzel #D4A843 + icon-flame.png + dfStreakPulse se >7d.

---

## 4. BOTAO GIRAR — 3 estados

**IDLE (pulsante):**
```
style={{
  width: 'clamp(160px,20vw,240px)', height: 'clamp(44px,5.5vw,56px)',
  background: 'linear-gradient(180deg, #00E676, #00C853, #004D25)',
  border: '1.5px solid rgba(0,230,118,0.4)', borderRadius: 12,
  fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(12px,1.5vw,16px)', color: '#FFFFFF', textTransform: 'uppercase',
  letterSpacing: 2, animation: 'dfSpinPulse 2s infinite',
}}
```

**SPINNING:** bg gradient cinza #333→#444→#222, color rgba(255,255,255,0.4), opacity 0.7, cursor not-allowed. Texto "GIRANDO...".

**CLAIMED:** bg #1A1A1A, border rgba(212,168,67,0.15). Linha 1: "VOLTE AMANHA" Cinzel #D4A843 opacity 0.6. Linha 2: timer JetBrains #D4A843. <1h: color #FF6B6B + dfTimerPulse.

---

## 5. RESULTADO — Overlay glassmorphism

Backdrop: rgba(10,10,10,0.7), backdrop-filter blur(12px), z-70.
Card: bg rgba(20,20,20,0.8), border 1.5px rgba(212,168,67,0.3), borderRadius 18px.
Icone premio: scale elastica [0,1.3,0.95,1.05,1] 600ms.
Texto premio: JetBrains #00E676 (small clamp(22px,3.5vw,36px), big clamp(36px,6vw,60px)).
Confetti: 10-28 spans DOM (#FFD700, #D4A843, #F6E27A, #00E676) via dfConfettiFall.
Btn COLETAR: mesmo estilo GIRAR.

---

## 6. KEYFRAMES (9)

```css
@keyframes dfIdleSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@keyframes dfDayBreathe { 0%,100% { transform: scale(1); box-shadow: 0 0 8px rgba(0,230,118,0.3); } 50% { transform: scale(1.04); box-shadow: 0 0 16px rgba(0,230,118,0.5); } }
@keyframes dfSpinPulse { 0%,100% { box-shadow: 0 0 15px rgba(0,230,118,0.3); } 50% { box-shadow: 0 0 30px rgba(0,230,118,0.5), 0 0 60px rgba(0,230,118,0.15); } }
@keyframes dfPointerBounce { 0% { transform: translateX(-50%) translateY(0); } 30% { transform: translateX(-50%) translateY(-4px); } 60% { transform: translateX(-50%) translateY(2px); } 100% { transform: translateX(-50%) translateY(0); } }
@keyframes dfTimerPulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; text-shadow: 0 0 8px rgba(255,107,107,0.5); } }
@keyframes dfStreakPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes dfConfettiFall { 0% { transform: translate(0,-20px) rotate(0); opacity: 1; } 100% { transform: translate(var(--df-x-drift),120vh) rotate(var(--df-rotation,720deg)); opacity: 0; } }
@keyframes dfBurstRadial { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--df-burst-x),var(--df-burst-y)) scale(0); opacity: 0; } }
@keyframes dfShimmer { 0% { left: -100%; } 50%,100% { left: 100%; } }
```

---

## 7. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA spin em fases discretas — deceleration CONTINUA velocity *= 0.985
2.  NUNCA useState para angle/velocity — useRef OBRIGATORIO (60fps re-renders destroem performance)
3.  NUNCA redesenhar segmentos a cada frame — offscreen pre-render, 1 drawImage rotacionado
4.  NUNCA shadowBlur no Canvas (custo GPU proibitivo no FiveM CEF)
5.  NUNCA PixiJS/Konva/Three.js — Canvas 2D nativo
6.  NUNCA conic-gradient na roda (CEF M103 pode falhar)
7.  NUNCA confetti via Canvas — spans DOM com Framer ou keyframes
8.  NUNCA LEDs decorativos 16-24 — sao 4 PINS dourados nos pontos cardinais
9.  NUNCA segmentos com cores inventadas — alternando #2A2A2A/#141414 e #1F1F1F/#0F0F0F
10. NUNCA fundo claro — #0A0A0A
11. NUNCA sans-serif em titulos — Cinzel Decorative
12. NUNCA px fixo — SEMPRE clamp()
13. NUNCA botao < 44px
14. NUNCA GCoin diferente de #00E676
15. NUNCA Lucide — PNGs dourados (X21), Lucide SO para [X] de modais
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Roda | CSS circle ou SVG animado | Canvas 2D offscreen pre-render + drawImage rotacionado |
| Spin | 4 fases discretas | velocity *= 0.985 rAF continuo com useRef |
| Moldura | 16-24 LEDs giratorios | 4 pins dourados nos cardinais + arc gradient metalico |
| Segmentos | Cores inventadas (#1A1A2E) | Alternando #2A2A2A/#141414 e #1F1F1F/#0F0F0F |
| Calendario | Conceito vago | Grid 7×5, 4 estados (claimed/available/future/missed) + milestones 3 tiers |
| Botao | "GIRAR" simples | 3 estados visuais (idle pulsante / spinning cinza / claimed timer) |
| Timer urgente | Nao mencionado | <1h: cor #FF6B6B + dfTimerPulse + texto "QUASE LA!" |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-DAILY-FREE-REVISADO.md — Abril 2026 — 105L → ~240L]`
`[X0: 3 rodadas, 15+ refs — offscreen Canvas (spinthewheel.cc, MDN rAF), React Canvas (dev.to ptifur, medium ignatovich, medium ruse.marshall, atomicobject, codepen vasilly, openreplay, konvajs animations), wheel physics (konvajs WheelOfFortune angularFriction), SVG (noelcserepy, motion.dev), previous (freefrontend cards, dmitripavlutin)]`
