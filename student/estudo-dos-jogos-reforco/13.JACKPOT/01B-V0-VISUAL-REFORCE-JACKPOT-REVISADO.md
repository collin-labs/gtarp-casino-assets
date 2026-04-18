# REFORCO VISUAL — JACKPOT (#13) PvP Pot Multi-Player — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: conic-gradient NAO animavel (frontend-hero, dockyard), rotacionar ELEMENTO (GPU). Overshoot cubic-bezier y>1 (curveeditor). FiveM CEF sem @property (MDN).

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Layout 3 colunas: DEPOSITO | DONUT | JOGADORES
- [ ] DONUT: conic-gradient DINAMICO (fatias por jogador), borderRadius 50%, border 3px + glow pulse
- [ ] CENTRO DONUT: div 50% radial-gradient escuro com pot total JetBrains #00E676
- [ ] POINTER DOURADO: triangulo CSS fixo no topo (NAO gira), filter drop-shadow
- [ ] SPIN: rotacionar o ELEMENTO donut (transform rotate) — NAO animar o gradient
- [ ] SPIN: 8s cubic-bezier(0.2, 0.8, 0.3, 1) — rapido→desacelera dramaticamente
- [ ] Input deposito + shortcuts MIN/x2/÷2/MAX + botao DEPOSITAR verde
- [ ] Player cards: border-left 4px cor do jogador + avatar + nome + % + barra proporcional
- [ ] 10 CORES de jogadores definidas (--player-1 a --player-10)
- [ ] Resultado: overlay 88% + blur + titulo gradiente metalico WebkitBackgroundClip text
- [ ] History slide-in + PF modal glassmorphism
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

GRID LOBBY 3 colunas:
```
style={{
  display: 'grid',
  gridTemplateColumns: 'clamp(200px, 25vw, 300px) 1fr clamp(200px, 25vw, 300px)',
  gap: 'clamp(8px, 1vw, 14px)', flex: 1, padding: 'clamp(8px, 1vw, 14px)',
}}
```

---

## 2. DONUT SPINNER — Elemento central (CSS conic-gradient)

ATENCAO V0: conic-gradient NAO PODE ser animado via CSS transition. O spin funciona girando o ELEMENTO inteiro com transform rotate.

DONUT:
```
style={{
  width: 'clamp(200px, 30vw, 380px)', aspectRatio: '1',
  borderRadius: '50%',
  border: '3px solid rgba(212,168,67,0.3)',
  boxShadow: '0 0 30px rgba(212,168,67,0.1), 0 0 60px rgba(212,168,67,0.04)',
  position: 'relative',
  // background: conic-gradient DINAMICO gerado por JS
  // Ex: conic-gradient(#D4A843 0deg 114deg, #00E676 114deg 205deg, #FF1744 205deg 285deg, #00E5FF 285deg 360deg)
  transition: 'transform 8s cubic-bezier(0.2, 0.8, 0.3, 1)',
}}
```
O conic-gradient eh setado inline via JS baseado nos depositos dos jogadores. Cada jogador tem graus = (deposito/pot_total) * 360.

CENTRO DONUT (buraco):
```
style={{
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%', height: '50%', borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(15,15,15,0.95) 0%, rgba(5,5,5,0.98) 100%)',
  border: '2px solid rgba(212,168,67,0.3)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  zIndex: 2,
}}
```
Pot total: JetBrains 700, clamp(14px,2vw,24px), #00E676, textShadow verde.
Estado spinning: texto muda pra "GIRANDO..." pulsante.

POINTER DOURADO (triangulo FIXO no topo — NAO gira com donut):
```
style={{
  position: 'absolute', top: -2, left: '50%',
  transform: 'translateX(-50%)',
  width: 0, height: 0,
  borderLeft: 'clamp(10px, 1.5vw, 14px) solid transparent',
  borderRight: 'clamp(10px, 1.5vw, 14px) solid transparent',
  borderTop: 'clamp(16px, 2.5vw, 22px) solid #D4A843',
  filter: 'drop-shadow(0 2px 6px rgba(212,168,67,0.5))',
  zIndex: 5, pointerEvents: 'none',
}}
```

MOLDURA: usar donut-frame-gold.png overlay, ou fallback border 3px com gradient metalico.

---

## 3. PAINEL DEPOSITO (coluna esquerda)

INPUT:
```
style={{
  width: '100%', background: 'rgba(10,10,10,0.8)',
  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 'clamp(6px,0.8vw,10px)',
  padding: 'clamp(10px,1.2vw,16px)',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(16px,2vw,24px)',
  fontWeight: 700, color: '#00E676', textAlign: 'center',
  textShadow: '0 0 8px rgba(0,230,118,0.3)',
}}
```
Focus: borderColor rgba(0,230,118,0.4), boxShadow `0 0 12px rgba(0,230,118,0.15)`.

SHORTCUTS (MIN/x2/÷2/MAX — NAO x5/x10/ALL IN):
```
style={{
  padding: 'clamp(6px,0.8vw,10px) clamp(12px,1.5vw,18px)',
  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 6,
  background: 'transparent', color: '#D4A843', fontWeight: 600, minHeight: 44,
}}
```

BOTAO DEPOSITAR:
```
style={{
  background: 'linear-gradient(180deg, #00E676 0%, #00C853 50%, #004D25 100%)',
  border: '1px solid rgba(0,230,118,0.5)', borderRadius: 'clamp(8px,1vw,12px)',
  fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 'clamp(12px,1.5vw,18px)',
  color: '#FFFFFF', minHeight: 44,
  boxShadow: '0 4px 12px rgba(0,200,83,0.3)',
}}
```

---

## 4. PLAYER CARDS (coluna direita) — 10 cores definidas

CORES (usar ESTAS exatas, nao inventar):
```
--player-1:  #D4A843  (dourado)
--player-2:  #00E676  (verde neon)
--player-3:  #FF1744  (vermelho)
--player-4:  #00E5FF  (ciano)
--player-5:  #FF6B00  (laranja)
--player-6:  #D32CE6  (roxo)
--player-7:  #FFD700  (ouro brilhante)
--player-8:  #4B69FF  (azul)
--player-9:  #8B6914  (bronze)
--player-10: #FFFFFF  (branco)
```

PLAYER CARD:
```
style={{
  borderRadius: 10, borderLeft: '4px solid var(--player-color)',
  background: 'rgba(10,10,10,0.6)',
  padding: 'clamp(6px,0.8vw,10px)',
  display: 'flex', alignItems: 'center', gap: 'clamp(6px,0.8vw,10px)',
}}
```
Avatar: clamp(24px,3vw,36px), borderRadius 50%, border 2px cor.
Nome: Inter 500, clamp(10px,1.2vw,14px), #FFFFFF.
Valor: JetBrains 700, clamp(10px,1.2vw,14px), cor do jogador.
Percentual: badge pill bg rgba(cor,0.15), border 1px rgba(cor,0.3), color cor.

BARRA PERCENTUAL:
```
style track={{
  width: '100%', height: 'clamp(4px,0.5vw,6px)',
  background: 'rgba(255,255,255,0.05)', borderRadius: 3,
}}
style fill={{
  height: '100%', width: '{percent}%', borderRadius: 3,
  background: 'var(--player-color)',
  boxShadow: '0 0 6px rgba(var(--color-rgb), 0.4)',
  transition: 'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
}}
```

---

## 5. SPIN — 8 segundos dramaticos

```
// Aplicar no donut
style.transform = `rotate(${targetAngle}deg)`;
// transition: transform 8s cubic-bezier(0.2, 0.8, 0.3, 1)
```
targetAngle = 2880 + angulo da fatia vencedora (8+ voltas).

Mesa travada durante spin: opacity 0.5, pointerEvents none, filter brightness(0.7).
Banner "APOSTAS ENCERRADAS": Cinzel 900, clamp(14px,2vw,24px), #FFD700, textShadow glow, spring entrance.
Ponteiro: glow intensifica durante spin com `pulseGoldWheel 1s infinite`.
Centro: "GIRANDO..." Inter 500, #A8A8A8, animation opacity pulse.

---

## 6. RESULTADO — Win vs Lose

OVERLAY:
```
style={{
  position: 'absolute', inset: 0, zIndex: 50,
  background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
}}
```

TITULO WIN (gradiente metalico):
```
style={{
  fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(24px, 4vw, 48px)', textTransform: 'uppercase', letterSpacing: 4,
  background: 'linear-gradient(180deg, #F6F2C0 0%, #FFD700 30%, #D4A843 60%, #8B6914 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
}}
```
Framer: initial{{ opacity:0, y:20 }}, animate{{ opacity:1, y:0 }}, delay 0.5, spring.

Valor: JetBrains 700, clamp(20px,3vw,40px), #00E676, textShadow `0 0 20px rgba(0,230,118,0.8)`.
Counter: rAF countup 2s.

LOSE: Cinzel 700, clamp(14px,2vw,22px), rgba(255,255,255,0.5). Perda: #FF4444.

Confetti: 80 spans douradas com `confettiFall` stagger.
Screen shake no win: `screenShake 0.5s`.

---

## 7. HISTORY + PF

HISTORY: slide-in direita, spring stiffness 300 damping 30.
Filtros: [TODAS][GANHAS][PERDIDAS], minHeight 44.
Linhas: grid 6 colunas, stagger 0.04s. Win: border-left 3px #00E676. Loss: border-left 3px rgba(255,68,68,0.4).

PF MODAL: glassmorphism blur(10px), width clamp(320px,50vw,540px).
Campos hash: JetBrains Mono clamp(9px,1vw,12px), wordBreak break-all.
Badge VERIFICADO: bg rgba(0,200,83,0.08), border 1.5px rgba(0,200,83,0.4), color #00E676.

---

## 8. KEYFRAMES OBRIGATORIOS (10)

```css
@keyframes pulseGoldWheel {
  0%,100% { box-shadow: 0 0 20px rgba(212,168,67,0.3), 0 0 40px rgba(212,168,67,0.1); }
  50% { box-shadow: 0 0 35px rgba(212,168,67,0.5), 0 0 60px rgba(212,168,67,0.2); }
}
@keyframes timerPulse {
  0%,100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}
@keyframes winFlash {
  0% { background: rgba(0,230,118,0.25); }
  100% { background: rgba(0,0,0,0.85); }
}
@keyframes loseFlash {
  0% { background: rgba(255,23,68,0.12); }
  100% { background: transparent; }
}
@keyframes antiSnipeFlash {
  0% { border-color: rgba(0,229,255,0.8); box-shadow: 0 0 20px rgba(0,229,255,0.4); }
  100% { border-color: rgba(212,168,67,0.25); box-shadow: none; }
}
@keyframes spinnerGlow {
  0%,100% { box-shadow: 0 0 30px rgba(212,168,67,0.15), 0 0 60px rgba(212,168,67,0.06); }
  50% { box-shadow: 0 0 50px rgba(212,168,67,0.3), 0 0 100px rgba(212,168,67,0.12); }
}
@keyframes flashGold {
  0% { background-color: transparent; }
  15% { background-color: rgba(255,215,0,0.08); }
  100% { background-color: transparent; }
}
@keyframes screenShake {
  0%,100% { transform: translate(0,0); }
  10% { transform: translate(-3px,-1px); }
  20% { transform: translate(3px,2px); }
  30% { transform: translate(-2px,-2px); }
  40% { transform: translate(2px,1px); }
}
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
}
@keyframes timerUrgent {
  0%,100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA animar o conic-gradient diretamente — rotacionar o ELEMENTO (transform rotate)
2.  NUNCA usar @property — FiveM CEF Chromium 93 nao suporta
3.  NUNCA Canvas para o donut — CSS conic-gradient obrigatorio
4.  NUNCA segmentos fixos — fatias DINAMICAS por deposito
5.  NUNCA pointer girando junto — pointer FIXO no topo, donut gira por baixo
6.  NUNCA cores de jogadores inventadas — usar as 10 cores definidas (--player-1 a --player-10)
7.  NUNCA spin linear — cubic-bezier(0.2, 0.8, 0.3, 1) obrigatorio (8s)
8.  NUNCA resultado no client — server-authoritative via fetchNui
9.  NUNCA fundo claro — #0A0A0A
10. NUNCA sans-serif em titulos — Cinzel
11. NUNCA px fixo — SEMPRE clamp()
12. NUNCA botao < 44px
13. NUNCA GCoin diferente de #00E676
14. NUNCA icones Lucide para identidade — PNGs dourados (X21)
15. NUNCA modal sem backdrop-filter blur
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Donut | Circulo CSS solido ou pie chart lib | conic-gradient DINAMICO com fatias por jogador + border 3px + glow pulse |
| Centro | Texto sobre circulo | Div 50% radial-gradient escuro com pot total JetBrains + border 2px |
| Pointer | Ausente ou gira junto | Triangulo CSS FIXO no topo com drop-shadow dourado (z-index 5) |
| Spin | Transicao rapida ou linear | transform rotate 2880°+ em 8s cubic-bezier(0.2,0.8,0.3,1) |
| Players | Lista texto simples | Cards border-left 4px cor + avatar + barra percentual + badge pill |
| Resultado | Texto "GANHOU" | Overlay 88% blur + titulo gradiente metalico clip-text + countup + confetti + shake |
| Deposito | Input nativo | JetBrains Mono verde + shortcuts MIN/x2/÷2/MAX + botao gradient verde |
| Timer | Numero simples | Cor dinamica (verde→amarelo→vermelho) + pulse + urgency animation |
| Cores | Inventadas | 10 cores DEFINIDAS: #D4A843, #00E676, #FF1744, #00E5FF, #FF6B00, #D32CE6, #FFD700, #4B69FF, #8B6914, #FFFFFF |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-JACKPOT-REVISADO.md — Abril 2026 — 96L → ~340L]`
`[X0: 3 rodadas, 15+ refs — conic-gradient (MDN, smashingmag, frontend-hero, dockyard), spin (codepen daniandl/suman, dev.to/madsstoumann, curveeditor, cssportal), limitations (browserstack, rustcodeweb, digitalocean, w3schools, freefrontend, css-tricks)]`
