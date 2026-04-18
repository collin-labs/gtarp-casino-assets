# REFORCO VISUAL — DICE / DADOS (#7) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Header: VOLTAR + titulo "DICE" Cinzel Decorative 900 #FFD700 + icones + saldo #00E676
- [ ] 3 dados CSS 3D (perspective 800, preserve-3d, 6 faces, backfaceVisibility hidden)
- [ ] Pips BRANCOS #FFFFFF com glow branco (NAO dourados)
- [ ] Faces com gradient #1A1A1A → #0A0A0A (NAO azulado)
- [ ] Grid de apostas 8x2 para totais 3-18 (NAO 2-12) + LOW/HIGH/TRIPLE
- [ ] Lightning Phase: multiplicadores 50x-1000x com badges + raios + grid dimmed
- [ ] Rolling 3 fases: SHAKE (0-0.8s) + ROLL spring (0.8-2.6s) + LANDING bounce (2.6-3.0s)
- [ ] Total reveal com spring bounce + grid reage (acertou verde, errou fade)
- [ ] Big Win overlay para multiplicador acertado (confetti dourado, countup 3s)
- [ ] Botao ROLAR DADOS: gradient verde + pulse idle + disabled cinza
- [ ] Historico lateral scrollavel com dados mini + multiplicador + ganho
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER + FUNDO

```
style={{
  position: 'absolute', inset: 0, zIndex: 60,
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  borderRadius: 'inherit', overflow: 'hidden',
  display: 'flex', flexDirection: 'column',
  padding: 'clamp(8px, 1vw, 16px)',
}}
```

Header: VOLTAR esq, "DICE" Cinzel Decorative 900 #FFD700 textShadow `0 0 20px rgba(255,215,0,0.8), 0 4px 8px rgba(0,0,0,1)`, saldo #00E676 dir, icones Som/PF/History (PNG dourados 44px).

---

## 2. DADOS 3D — CSS preserve-3d (ELEMENTO MAIS CRITICO)

3 dados lado a lado, gap clamp(12px,2vw,24px).

Container de cada dado:
```
style={{
  width: 'clamp(60px, 8vw, 120px)', height: same,
  perspective: 800,
}}
```

Cubo interno:
```
style={{
  width: '100%', height: '100%', position: 'relative',
  transformStyle: 'preserve-3d',
  // rotacao via Framer Motion animate
}}
```

6 FACES (cada uma position absolute, inset 0):
```
style={{
  position: 'absolute', width: '100%', height: '100%',
  borderRadius: 12,
  background: 'linear-gradient(145deg, #1A1A1A, #0A0A0A)',
  border: '1px solid rgba(212,168,67,0.3)',
  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,67,0.15)',
  backfaceVisibility: 'hidden',
  display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center',
  padding: '15%',
}}
```

Posicoes das faces (N = metade do tamanho do cubo):
- face1: transform `translateZ(${N}px)`
- face2: transform `rotateY(-90deg) translateZ(${N}px)`
- face3: transform `rotateX(90deg) translateZ(${N}px)`
- face4: transform `rotateX(-90deg) translateZ(${N}px)`
- face5: transform `rotateY(90deg) translateZ(${N}px)`
- face6: transform `rotateY(180deg) translateZ(${N}px)`

PIPS (bolinhas) — BRANCOS, NAO DOURADOS:
```
style={{
  width: '22%', aspectRatio: '1', borderRadius: '50%',
  background: '#FFFFFF',
  boxShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.3)',
}}
```

Layout por face:
- 1 pip: 1 centro
- 2 pips: top-right + bottom-left (diagonal)
- 3 pips: diagonal (top-right, center, bottom-left)
- 4 pips: 4 cantos
- 5 pips: 4 cantos + 1 centro
- 6 pips: 2 colunas de 3

FACE_ROTATIONS para resultado:
```
{1: {x:0, y:0}, 2: {x:0, y:-90}, 3: {x:-90, y:0}, 4: {x:90, y:0}, 5: {x:0, y:90}, 6: {x:0, y:180}}
```

Idle: Framer animate={{ rotateX:[-2,2,-2], rotateY:[-3,3,-3] }}, duration 4s, repeat Infinity.

---

## 3. ROLLING — 3 fases de animacao

**FASE SHAKE (0-0.8s):** Dados tremem no lugar. Framer animate={{ x:[0,-3,4,-2,3,-4,2,0], y:[0,2,-3,4,-2,3,-4,0], rotateZ:[0,-2,3,-1,2,-3,1,0] }}, duration 0.8s, repeat Infinity. Borda dos dados: animation `dice-border-flash 0.2s infinite`.

**FASE ROLL (0.8-2.6s):** Rotacao 3D com spring ate face do resultado.
```
Framer animate={{
  rotateX: FACE_ROTATIONS[resultado].x + 720 + random*720,
  rotateY: FACE_ROTATIONS[resultado].y + 720 + random*720,
  rotateZ: 360 + random*720,
}}
transition={{ type: 'spring', stiffness: 80, damping: 15, duration: 1.8, delay: diceIndex * 0.2 }}
```
Blur de movimento: filter blur(1.5px) nos primeiros 0.5s.

**FASE LANDING (2.6-3.0s):** Bounce no impacto. Framer animate={{ scale:[1,1.08,0.96,1.02,1] }}, duration 0.3s. Flash de luz: div overlay radial-gradient dourado, opacity [0,0.8,0] 0.3s. Sombra projetada na base: ellipse escura blur(3px). Stagger entre dados: 200ms.

---

## 4. GRID DE APOSTAS — 8x2 para totais 3-18

ATENCAO: Sao 3 dados, range eh 3-18 (NAO 2-12).

Grid: display grid, gridTemplateColumns repeat(8, 1fr), gap clamp(4px,0.5vw,8px).
Row 1: totais 3, 4, 5, 6, 7, 8, 9, 10
Row 2: totais 11, 12, 13, 14, 15, 16, 17, 18

Cada card:
```
style={{
  background: '#141414',
  border: '1.5px solid rgba(212,168,67,0.3)',
  borderRadius: 10,
  padding: 'clamp(6px, 0.8vw, 12px) clamp(4px, 0.5vw, 8px)',
  textAlign: 'center', cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,215,0,0.05)',
}}
```
Numero: Cinzel 700, clamp(14px,1.8vw,24px), #D4A843, textShadow `0 0 8px rgba(255,215,0,0.4)`.
Odds: JetBrains Mono 600, clamp(8px,1vw,13px), #A8A8A8.

Odds por total: 3=150:1, 4=60:1, 5=30:1, 6=17:1, 7=12:1, 8=8:1, 9=7:1, 10=6:1, 11=6:1, 12=7:1, 13=8:1, 14=12:1, 15=17:1, 16=30:1, 17=60:1, 18=150:1.

**SELECIONADO** (apostou): borderColor rgba(0,230,118,0.5), background rgba(0,230,118,0.08), boxShadow `0 0 12px rgba(0,230,118,0.2)`.
**DISABLED** (durante roll): pointerEvents none, opacity 0.6.
**LIGHTNING** (tem multiplicador): borderColor rgba(255,215,0,0.8), background rgba(255,215,0,0.05), animation `dice-lightning-pulse 1.5s infinite`. Badge no canto: gradient dourado, JetBrains 900, "x500", scale spring.

Side bets (flex row abaixo do grid): LOW (3-10, 1:1), HIGH (11-18, 1:1), TRIPLE (todos iguais, 30:1). Mesmos estados do grid.

---

## 5. LIGHTNING PHASE — Multiplicadores com raios

Container: bg rgba(0,0,0,0.6), borderRadius 12, border 1px rgba(68,136,255,0.3), boxShadow `0 0 20px rgba(68,136,255,0.15)`.

2-4 badges de multiplicador (1 por total selecionado):
```
style={{
  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(68,136,255,0.1))',
  border: '1px solid rgba(255,215,0,0.5)', borderRadius: 8,
  boxShadow: '0 0 15px rgba(255,215,0,0.3), 0 0 30px rgba(68,136,255,0.15)',
  padding: 'clamp(4px,0.5vw,8px) clamp(8px,1vw,14px)',
}}
```
Numero: Cinzel 700, clamp(14px,1.8vw,22px), #FFFFFF. Multiplicador: JetBrains 900, clamp(16px,2.2vw,28px), #FFD700, textShadow `0 0 15px rgba(255,215,0,0.8)`.

Framer stagger 0.5s: initial{{ scale:0, y:-20 }}, animate{{ scale:1, y:0 }}, spring stiffness 400 damping 20.

Grid durante lightning: cards SEM multiplicador dimmed (overlay rgba(0,0,0,0.4), pointerEvents none). Cards COM multiplicador brilham.

---

## 6. RESULTADO — Total reveal + grid reage

Total display:
```
style={{
  fontFamily: "'Cinzel Decorative', serif", fontWeight: 900,
  fontSize: 'clamp(24px, 4vw, 52px)', color: '#FFD700',
  textShadow: '0 0 25px rgba(255,215,0,0.9), 0 0 50px rgba(255,215,0,0.4), 0 4px 8px rgba(0,0,0,1)',
}}
```
Framer: initial{{ scale:0.3, y:20 }}, animate{{ scale:1, y:0 }}, spring stiffness 300 damping 15.

Grid reage:
- **ACERTOU**: borderColor #00E676, bg rgba(0,230,118,0.15), boxShadow `0 0 25px rgba(0,230,118,0.4)`, scale [1,1.1,1.05] 0.5s
- **ACERTOU + LIGHTNING**: tudo acima + boxShadow extra `0 0 40px rgba(255,215,0,0.6)` + badge multiplicador scale [1,1.6,1.1,1.3,1]
- **ERROU**: opacity 0.35, filter grayscale(0.5), transition 1.5s
- **NAO APOSTOU**: sem mudanca

Win display: JetBrains 700, clamp(14px,2vw,24px), #00E676, countup 500-2000ms. Loss: color #666.
Se payout > 50x aposta → transicao automatica para Big Win Overlay 500ms.

---

## 7. BIG WIN OVERLAY — Multiplicador acertado

```
style={{
  position: 'absolute', inset: 0, zIndex: 75,
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
}}
```

"BIG WIN!": Cinzel Decorative 900, clamp(32px,6vw,64px), #FFD700, textShadow 4 camadas. Framer: initial{{ scale:0 }}, animate{{ scale:[1.2,0.95,1.05,1] }}, spring.

Valor countup: JetBrains 900, clamp(24px,5vw,52px), #00E676, de 0 ate valor em 3s ease-out. Animation `dice-countup-flash` durante countup.

Confetti: GoldParticles burst 200 particulas (#FFD700, #D4A843, #B8860B). NUNCA multicolorido.

Auto-close 5s ou click. "clique para fechar": Inter, rgba(255,255,255,0.3).

---

## 8. CONTROLES — Input + atalhos + ROLAR DADOS

Input aposta: bg #1A1A1A, border 1px rgba(212,168,67,0.4), borderRadius 8, color #00E676, JetBrains 700, clamp(12px,1.5vw,18px), textAlign center. Focus: borderColor #D4A843, boxShadow `0 0 10px rgba(212,168,67,0.3)`.

Atalhos MIN/x2/÷2/MAX: bg rgba(212,168,67,0.1), border 1px rgba(212,168,67,0.3), color #D4A843, JetBrains 600, minWidth 44, minHeight 44.

BOTAO ROLAR DADOS:
```
style={{
  background: 'linear-gradient(180deg, #00E676 0%, #00C853 50%, #004D25 100%)',
  border: '2px solid rgba(0,230,118,0.6)', borderRadius: 10,
  padding: 'clamp(10px,1.2vw,16px) clamp(16px,2.5vw,32px)',
  color: '#FFFFFF', fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(12px, 1.5vw, 18px)', letterSpacing: 'clamp(1px,0.2vw,2px)',
  textTransform: 'uppercase', minHeight: 48,
  boxShadow: '0 4px 15px rgba(0,230,118,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
  animation: 'dice-cta-pulse 2s ease-in-out infinite',
}}
```
Bevel: pseudo ::before gradient branco 15% no topo. Disabled: bg #333, border #444, color #666, sem bevel, sem pulse.

---

## 9. HISTORICO LATERAL — Panel scrollavel

Flex 35% width, bg rgba(0,0,0,0.4), borderRadius 14, border 1px rgba(212,168,67,0.2), overflowY auto, scrollbar 4px dourado.

Cada item: flex row, bg rgba(0,0,0,0.2), borderRadius 6. #id cinza, dados mini (3 quadrados 16px bg #1A1A1A), Total em #D4A843, multiplicador em #FFD700 (ou "--" #444), ganho em #00E676 (ou G$0 #666).

Item com multiplicador: borderLeft 2px rgba(255,215,0,0.5), bg rgba(255,215,0,0.03).
Item com win: borderLeft 2px rgba(0,230,118,0.4).

---

## 10. KEYFRAMES OBRIGATORIOS

```css
@keyframes dice-lightning-pulse {
  0%, 100% { box-shadow: 0 0 15px rgba(68,136,255,0.2), 0 0 8px rgba(255,215,0,0.2); }
  50% { box-shadow: 0 0 25px rgba(68,136,255,0.4), 0 0 15px rgba(255,215,0,0.4); }
}
@keyframes dice-cta-pulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(0,230,118,0.3); }
  50% { box-shadow: 0 4px 25px rgba(0,230,118,0.5); }
}
@keyframes dice-border-flash {
  0%, 100% { border-color: rgba(212,168,67,0.5); }
  50% { border-color: rgba(0,230,118,0.5); }
}
@keyframes dice-lightning-atmosphere {
  0%, 100% { background: rgba(68,136,255,0.01); }
  50% { background: rgba(68,136,255,0.04); }
}
@keyframes dice-bigwin-glow {
  0%, 100% { background: rgba(212,168,67,0.03); }
  50% { background: rgba(212,168,67,0.07); }
}
@keyframes dice-badge-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,215,0,0.5); }
  50% { transform: scale(1.08); box-shadow: 0 0 20px rgba(255,215,0,0.8); }
}
@keyframes dice-countup-flash {
  0%, 100% { text-shadow: 0 0 15px rgba(0,230,118,0.5); }
  50% { text-shadow: 0 0 30px rgba(0,230,118,0.9), 0 0 60px rgba(0,230,118,0.4); }
}
@keyframes dice-shine-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 11. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA pips dourados nos dados — pips sao BRANCOS #FFFFFF com glow branco
2.  NUNCA faces com tint azulado — gradient #1A1A1A → #0A0A0A puro sem cor
3.  NUNCA grid com totais 2-12 — sao 3 dados, range eh 3-18
4.  NUNCA dados como imagens PNG — SEMPRE CSS 3D preserve-3d com 6 divs
5.  NUNCA roll com opacity fade — SEMPRE rotateX/Y/Z com spring + bounce landing
6.  NUNCA roll sem 3 fases — SHAKE (tremer) + ROLL (girar) + LANDING (bounce)
7.  NUNCA fundo claro — SEMPRE #0A0A0A com bg-casino.png
8.  NUNCA sans-serif em titulos — Cinzel Decorative pra titulo, Cinzel pra botoes
9.  NUNCA px fixo — SEMPRE clamp()
10. NUNCA botao < 44px
11. NUNCA GCoin em cor diferente de #00E676 + JetBrains Mono
12. NUNCA lightning sem tint azulado (rgba(68,136,255,0.x)) — eh a cor do modo lightning
13. NUNCA confetti multicolorido — SOMENTE dourado (#FFD700, #D4A843, #B8860B)
14. NUNCA total reveal sem spring bounce — initial scale 0.3 → animate scale 1 com spring
15. NUNCA countup instantaneo — SEMPRE rolling 500-3000ms com easing
```

---

## COMPARACAO — O que o V0 QUER entregar vs o que DEVE entregar

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Dados | 3 divs com numero dentro | Cubos CSS 3D com 6 faces, pips brancos, perspective 800, preserve-3d |
| Pips | Circulos dourados flat | Circulos BRANCOS #FFF com glow branco 2 camadas |
| Roll | opacity 0→1 mostrando resultado | 3 fases: SHAKE tremer + ROLL spring 720-1440deg + LANDING bounce |
| Grid | Botoes "2-12" em row | Grid 8x2 para 3-18 + odds + 3 estados (normal/selecionado/lightning) + LOW/HIGH/TRIPLE |
| Lightning | Badges dourados estaticos | Container azulado + stagger 0.5s + flash + grid dimmed + tint atmosphere |
| Total | Numero inline | Spring bounce scale 0.3→1, Cinzel Decorative 900, 4-camada textShadow |
| Big Win | Texto "GANHOU" | Overlay fullscreen blur + "BIG WIN!" spring + countup 3s + confetti dourado |
| Controles | Input nativo + botao cinza | Input estilizado + atalhos dourados + ROLAR DADOS gradiente verde + bevel + pulse |
| Historico | Ausente | Panel lateral 35% scrollavel com dados mini + multiplicador + ganho colorido |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-DICE-REVISADO.md — Abril 2026 — 45L → ~350L]`
