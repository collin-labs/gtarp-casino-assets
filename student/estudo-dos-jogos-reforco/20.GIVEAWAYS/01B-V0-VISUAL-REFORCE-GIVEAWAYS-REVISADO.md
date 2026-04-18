# REFORCO VISUAL — GIVEAWAYS (#20) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Drum reel pattern (flixrp, kirkjerk "easeOutElastic"), 3-phase useAnimate (Doc6), fade gradients (freefrontend scroll-driven)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] CARD ATIVO grande: 5-shadow + borda verde pulse (gwActivePulse) + titulo + premio + progress bar + countdown + botoes
- [ ] GRID MINI: proximos sorteios em auto-fill minmax(clamp(160px,20vw,240px),1fr)
- [ ] Progress bar: animate width 0→N% + gradient verde + glow
- [ ] Btn COMPRAR TICKET: verde gradient (#00C853→#004D25)
- [ ] Btn TICKET GRATIS: **AZUL** #2196F3 (NAO verde, NAO dourado!)
- [ ] DRUM REVEAL: 3 fases useAnimate (rapido 2s linear → decelera 3s ease → settle 0.3s spring)
- [ ] DRUM: container clamp(260px,40vw,400px) × clamp(200px,30vh,320px) + fade gradients top/bottom + frame dourado central
- [ ] Resultado: VENCEDOR (crown + gold particles + payout spring) vs PERDEDOR (cinza discreto)
- [ ] 6 telas: Lista, Modal Compra, Drum Reveal, Resultado, Historico, PF
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
  display: 'flex', flexDirection: 'column',
}}
```

---

## 2. CARD SORTEIO ATIVO + GRID MINI

CARD ATIVO:
```
style={{
  background: 'linear-gradient(135deg, #141414, #1A1A1A)',
  border: '1.5px solid rgba(212,168,67,0.25)',
  borderRadius: 'clamp(10px, 1.5vw, 16px)',
  padding: 'clamp(16px, 2.5vw, 28px)', position: 'relative', overflow: 'hidden',
  boxShadow: '0 2px 0 0 rgba(0,230,118,0.4), 0 4px 20px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
  animation: 'gwActivePulse 3s ease-in-out infinite',
}}
```
Titulo: Cinzel 700, clamp(14px,2vw,22px), #D4A843, uppercase.
Premio: JetBrains 700, clamp(18px,3vw,32px), #00E676, textShadow verde.

PROGRESS BAR:
```
style container={{
  width: '100%', height: 'clamp(6px, 1vw, 10px)',
  background: '#1A1A1A', borderRadius: '999px', overflow: 'hidden',
}}
style fill={{  // motion.div animate={{ width: '68%' }}
  height: '100%', borderRadius: '999px',
  background: 'linear-gradient(90deg, #004D25, #00E676)',
  boxShadow: '0 0 8px rgba(0,230,118,0.3)',
}}
```
>90% preenchida: animation gwProgressUrgent 1.5s infinite.

Btn COMPRAR TICKET:
```
style={{
  background: 'linear-gradient(180deg, #00C853, #004D25)',
  border: '1px solid rgba(0,230,118,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontFamily: "'Inter', sans-serif", fontWeight: 600,
  fontSize: 'clamp(12px, 1.5vw, 16px)',
  padding: 'clamp(10px,1.5vw,14px) clamp(16px,3vw,32px)', minHeight: 44,
  boxShadow: '0 0 12px rgba(0,230,118,0.2), 0 4px 12px rgba(0,0,0,0.3)',
}}
```

Btn TICKET GRATIS (**AZUL** — NAO verde, NAO dourado!):
```
style={{
  background: 'rgba(33,150,243,0.1)',
  border: '1px solid rgba(33,150,243,0.3)', borderRadius: 10,
  color: '#2196F3', fontFamily: "'Inter', sans-serif", fontWeight: 500,
  fontSize: 'clamp(12px, 1.5vw, 16px)',
  padding: 'clamp(10px,1.5vw,14px) clamp(16px,3vw,32px)', minHeight: 44,
}}
```
Cooldown: opacity 0.4, cursor not-allowed.

GRID MINI:
```
style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px,20vw,240px),1fr))', gap: 'clamp(8px,1.5vw,16px)' }}
```
Card mini: bg #141414, border rgba(212,168,67,0.15), borderRadius clamp(8px,1vw,12px). Stagger 0.05s.

---

## 3. DRUM REVEAL — 3 FASES (useAnimate)

OVERLAY: position fixed inset 0 z-80, bg rgba(5,5,5,0.92).

CONTAINER DRUM:
```
style={{
  width: 'clamp(260px, 40vw, 400px)', height: 'clamp(200px, 30vh, 320px)',
  background: 'rgba(10,10,10,0.95)',
  border: '2px solid rgba(212,168,67,0.3)',
  borderRadius: 'clamp(12px, 2vw, 20px)', overflow: 'hidden', position: 'relative',
  boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)',
}}
```

FADE GRADIENTS (top e bottom — criam ilusao de profundidade):
```
style top={{
  position: 'absolute', top: 0, left: 0, right: 0, height: 40,
  background: 'linear-gradient(180deg, rgba(10,10,10,0.95), transparent)',
  pointerEvents: 'none', zIndex: 2,
}}
// Bottom: mesma coisa, bottom:0, gradient invertido
```

FRAME DOURADO (indicador central — mostra winner):
```
style={{
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
  width: 'calc(100% - 16px)', height: 48,
  border: '3px solid #FFD700', borderRadius: 10,
  boxShadow: '0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.15)',
  pointerEvents: 'none', zIndex: 3,
  animation: 'gwDrumGlow 2s ease-in-out infinite',
}}
```

CADA ITEM DRUM: height 48px, flex, padding, JetBrains #D4A843 + Inter #A8A8A8.
Item vencedor: bg rgba(212,168,67,0.15), borderLeft 3px #FFD700.

**ANIMACAO 3 FASES (useAnimate):**
```jsx
const [scope, animate] = useAnimate();
// Target: -(winnerIndex * 48) - (totalTickets * 3 * 48)
// Fase 1 RAPIDO: 2s linear
await animate(scope.current, { y: phase1Target }, { duration: 2, ease: 'linear' });
// Fase 2 DECELERA: 3s custom ease
await animate(scope.current, { y: phase2Target }, { duration: 3, ease: [0.2, 0, 0, 1] });
// Fase 3 SETTLE: 0.3s spring
await animate(scope.current, { y: finalTarget }, { type: 'spring', stiffness: 200, damping: 20 });
// Pausa 500ms → callback onComplete
```

---

## 4. RESULTADO — Win vs Lose

**VENCEDOR:**
Crown: crown-winner.png, clamp(28px,4vw,40px), rotate(15deg), drop-shadow.
Titulo: Cinzel 700 clamp(18px,3.5vw,36px) #FFD700, textShadow `0 0 20px rgba(255,215,0,0.5)`, animation gwWinnerGlow.
Payout: JetBrains 700 clamp(24px,5vw,56px) #00E676, spring scale 0.5→1 delay 0.3.
GoldParticles 4000ms + confetti.

**PERDEDOR:** discreto — titulo #A8A8A8, payout #D4A843, Inter italic #666 "Boa sorte na proxima!". Sem crown, sem particulas.

---

## 5. HISTORICO + PF

Historico: tabs TODOS/MEUS (ativo: bg rgba gold 0.15, color #D4A843; inativo: #666).
Grid 5 colunas (titulo/vencedor/premio/data/PF). Stagger 0.03s.
Win: premio verde #00E676. Loss: premio #A8A8A8.

PF Modal: glassmorphism, 5 campos seed JetBrains Mono truncated, COPIAR→COPIADO! verde 1.5s.
Badge JUSTO: bg rgba(0,230,118,0.08), border rgba(0,230,118,0.3), color #00E676, Cinzel.

---

## 6. KEYFRAMES OBRIGATORIOS (6)

```css
@keyframes gwShimmer { 0% { left: -100%; } 100% { left: 100%; } }
@keyframes gwActivePulse {
  0%, 100% { box-shadow: 0 2px 0 0 rgba(0,230,118,0.3); }
  50% { box-shadow: 0 2px 0 0 rgba(0,230,118,0.6); }
}
@keyframes gwDrumGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
  50% { box-shadow: 0 0 35px rgba(255,215,0,0.5); }
}
@keyframes gwWinnerGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.4); }
  50% { text-shadow: 0 0 35px rgba(255,215,0,0.6); }
}
@keyframes gwProgressUrgent {
  0%, 100% { box-shadow: 0 0 8px rgba(0,230,118,0.3); }
  50% { box-shadow: 0 0 16px rgba(0,230,118,0.6); }
}
@keyframes gwCountdownUrgent {
  0%, 100% { color: #D4A843; }
  50% { color: #FF3B3B; }
}
```

---

## 7. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA drum sem 3 fases de animacao (rapido→decelera→settle spring)
2.  NUNCA drum container horizontal — eh VERTICAL (scroll de baixo pra cima)
3.  NUNCA botao ticket gratis em verde ou dourado — eh AZUL #2196F3
4.  NUNCA resultado sem diferenciacao vencedor (gold crown particles) vs perdedor (cinza discreto)
5.  NUNCA progress bar sem animate width 0→N%
6.  NUNCA modal sem backdrop-filter blur + click-outside-to-close
7.  NUNCA campo copiavel sem feedback "COPIADO!" verde por 1.5s
8.  NUNCA fundo claro — #0A0A0A
9.  NUNCA sans-serif em titulos — Cinzel
10. NUNCA px fixo — SEMPRE clamp()
11. NUNCA botao < 44px
12. NUNCA GCoin diferente de #00E676
13. NUNCA icones Lucide — PNGs dourados (X21)
14. NUNCA countdown sem flip cards animados (perspective 400px, backfaceVisibility hidden)
15. NUNCA drum sem fade gradients top/bottom + frame dourado central com glow
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Layout | Cards horizontais lista | Card ativo GRANDE + grid mini "proximos" |
| Drum | Animacao unica linear | 3 fases: rapido 2s → decelera 3s → settle spring 0.3s |
| Drum size | 300×80px | clamp(260px,40vw,400px) × clamp(200px,30vh,320px) |
| Drum visual | Retangulo simples | Container + fade gradients top/bottom + frame dourado + glow pulse |
| Ticket gratis | Nao mencionado | Botao AZUL #2196F3 (daily free ticket) |
| Resultado | Generico | Win: crown + gold particles + spring | Lose: cinza discreto |
| Progress bar | Barra estatica | animate width + gradient verde + glow + pulse >90% |
| Countdown | Conceito sem CSS | Flip cards perspective 400px + rotateX + backfaceVisibility hidden |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-GIVEAWAYS-REVISADO.md — Abril 2026 — 96L → ~285L]`
`[X0: 3 rodadas, 15+ refs — drum (flixrp, kirkjerk, MrFirthy, tangxuguo, cnbkts, victortoschi, cssscript, odoo), scroll (freefrontend scroll-driven, sliderrevolution, motion.dev scroll), layout (motion.dev animate-presence/layout, freefrontend cards, react-awesome-reveal)]`
