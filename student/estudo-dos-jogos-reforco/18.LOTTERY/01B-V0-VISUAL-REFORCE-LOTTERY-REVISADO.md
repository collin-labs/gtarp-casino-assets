# REFORCO VISUAL — LOTTERY / LOTERIA (#18) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Matter.js lotto globe (freecodecamp), circular collision (MDN), ball reveal stagger (codepen abirana)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] GRID 5x10 (50 numeros, range 1-50) — NAO 60, NAO 6x10
- [ ] Cada celula com 5 ESTADOS: normal, hover, selected (verde), match (verde glow), miss (cinza 0.4)
- [ ] 6 slots de numeros selecionados (bolas douradas + slots vazios tracejados)
- [ ] GLOBO: Canvas 2D com bolas quicando dentro de container CIRCULAR (collision por distancia ao centro)
- [ ] BALL REVEAL: stagger 1.5s, spring scale 0→1, match=#00E676 glow, miss=#A8A8A8
- [ ] MEGA BALL: bola DOURADA 50% maior (NAO roda de multiplicador!), overlay escuro, range 1-10
- [ ] Custo FIXO G$100 (NAO tem input de valor nem MIN/x2/÷2/MAX)
- [ ] RESULTADO: acertos X/6 + mega ball + countup premio + botoes NOVO BILHETE + VERIFICAR PF
- [ ] SURPRESINHA: seleciona 6 numeros aleatorios com efeito visual de "roleta"
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

## 2. GRID 5x10 — 50 numeros (1-50)

ATENCAO: SAO 50 NUMEROS EM 5 LINHAS × 10 COLUNAS. NAO 60.

```
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gap: 'clamp(4px, 0.4vw, 6px)',
}}
```

CELULA — 5 ESTADOS:

**NORMAL:**
```
style={{
  width: 'clamp(36px, 5vw, 52px)', height: same,
  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(212,168,67,0.08)',
  border: '1px solid rgba(212,168,67,0.25)',
  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(10px,1.2vw,14px)',
  color: '#FFFFFF', cursor: 'pointer', minHeight: 44,
  transition: 'all 0.2s ease',
}}
```

**HOVER:** bg rgba(212,168,67,0.15), border brightens, scale 1.1, glow sutil dourado.

**SELECTED (ate 6):**
```
background: 'linear-gradient(135deg, #00E676, #00C853)',
border: '2px solid #00E676',
boxShadow: '0 0 12px rgba(0,230,118,0.4)',
color: '#FFFFFF', fontWeight: 700,
```
Framer: scale 1→1.15→1 spring.

**MATCH (acertou no sorteio):** border 2px #00E676, glow verde intenso `0 0 20px rgba(0,230,118,0.5)`, particulas.

**MISS (nao acertou):** opacity 0.3, filter grayscale(0.5).

**DISABLED (6 ja selecionados):** opacity 0.3, cursor not-allowed, pointerEvents none.

---

## 3. SELECTED SLOTS (6 bolas douradas)

Row horizontal de 6 posicoes:
- **PREENCHIDO:** bola dourada radial-gradient (#FFD700→#D4A843→#8B6914), borderRadius 50%, numero JetBrains 700 branco, clamp(32px,4vw,48px).
- **VAZIO:** borda 2px dashed rgba(212,168,67,0.3), "?" cinza, borderRadius 50%.

Framer: bounce in ao selecionar (scale 0→1.2→1).
Ao completar 6: badge "PRONTO!" verde brilha.

---

## 4. GLOBO DO SORTEIO — Canvas 2D

Container: clamp(200px,30vw,320px), borderRadius 50%, border 3px com gradient metalico dourado.
Reflexo: pseudo highlight branco oval topo-esquerda.
Sombra: boxShadow `0 0 40px rgba(212,168,67,0.2), 0 12px 40px rgba(0,0,0,0.6)`.

Canvas DENTRO do globo: bolas coloridas quicando com physics.
Collision CIRCULAR: `if (dist(ball, center) > globeRadius - ballRadius) bounce()` — NAO x/y retangular.
20 bolas com velocidades e delays aleatorios, radial-gradient dourado, numero Inter bold 10px preto.

---

## 5. BALL REVEAL — Sequencial dramatico

6 posicoes de reveal abaixo do globo. Cada posicao: circulo 48px, borda tracejada dourada, "?".

SEQUENCIA (stagger 1.5s entre cada):
```jsx
<motion.div
  initial={{ scale: 0, opacity: 0, y: -20 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 1.5 }}
/>
```

Se MATCH: bola verde #00E676, glow, particulas, som especial.
Se MISS: bola cinza #A8A8A8, opacity menor.

Grid do jogador REAGE em tempo real: numero acertado → celula verde pulse. Numero errado → celula cinza.

---

## 6. MEGA BALL PHASE — Bola dourada (NAO roda!)

ATENCAO: Mega Ball eh uma BOLA DOURADA 50% maior que as normais. NAO eh uma roda de multiplicador.

Overlay escuro: rgba(0,0,0,0.4), transicao 0.5s.
Texto "MEGA BALL": Cinzel 800 clamp(20px,3vw,36px) #FFD700 shimmer.

Mega Ball: radial-gradient gold intenso, clamp(60px,8vw,96px), pulsacao `0 0 30px rgba(255,215,0,0.6)`.
Reveal: countup rapido 1→numero final.
Se match: EXPLOSAO — particulas massivas + confetti + flash dourado.

Payouts com Mega bonus:
- 2 acertos: G$50 (sem mega) / G$100 (com mega)
- 3: G$500 / G$1.000
- 4: G$5.000 / G$10.000
- 5: G$50.000 / G$100.000
- 6: G$500.000 / G$1.000.000

---

## 7. RESULTADO

Numeros jogador vs sorteados lado a lado. Acertos verde, erros opacity 0.4.
Badge: "X/6 ACERTOS" + "MEGA BALL!" se acertou.
Premio: JetBrains 700 clamp(18px,3vw,32px) #00E676, countup rAF 2s.
Botoes: NOVO BILHETE (verde) + VERIFICAR PF (dourado ghost).

---

## 8. CONTROLES

Titulo "LOTERIA": Cinzel 800, clamp(14px,2vw,22px), #D4A843, textShadow glow.
Custo: "G$100" fixo (NAO tem input de valor).
Btn SURPRESINHA: dourado outline, Cinzel 600. Efeito: numeros piscam rapido 1s antes de fixar.
Btn COMPRAR BILHETE: verde gradient, disabled ate 6 numeros, minHeight 48.

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA grid com 60 numeros — SAO 50 (range 1-50, grid 5x10)
2.  NUNCA "roda de multiplicador" — Mega Ball eh uma BOLA dourada, NAO roda
3.  NUNCA input de valor/aposta — custo FIXO G$100
4.  NUNCA bola sem animacao spring — TODA bola com initial scale 0 → animate scale 1
5.  NUNCA reveal sem stagger — 1.5s entre cada bola
6.  NUNCA match sem glow verde — SEMPRE #00E676 com boxShadow
7.  NUNCA Mega Ball igual as outras — 50% MAIOR com glow dourado intenso
8.  NUNCA globo estatico — Canvas com bolas em movimento continuo
9.  NUNCA collision retangular no globo — collision CIRCULAR (distancia ao centro)
10. NUNCA fundo claro — #0A0A0A
11. NUNCA sans-serif em titulos — Cinzel
12. NUNCA px fixo — SEMPRE clamp()
13. NUNCA botao < 44px / celula < 44px
14. NUNCA GCoin diferente de #00E676
15. NUNCA resultado no client — server-authoritative (seed-based draw)
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Grid | 60 numeros retangulares | 50 circulos (5x10) com 5 estados visuais |
| Selecao | Click sem feedback | Scale 1→1.15→1 spring + verde gradient + glow |
| Globo | Circulo flat | Canvas 2D com bolas quicando (collision circular) + moldura metalica |
| Reveal | Numeros aparecem de uma vez | Stagger 1.5s com spring + match verde vs miss cinza |
| Mega Ball | Roda de multiplicador | Bola DOURADA 50% maior com overlay escuro + countup |
| Resultado | Texto "X acertos" | Badge visual + countup premio + comparacao lado a lado |
| Custo | Input + atalhos | FIXO G$100 sem input |
| Surpresinha | Click simples | Efeito "roleta visual" — numeros piscam 1s antes de fixar |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-LOTTERY-REVISADO.md — Abril 2026 — 81L → ~260L]`
`[X0: 3 rodadas, 15+ refs — globe physics (freecodecamp Matter.js, MDN bounce/advanced, geeksforgeeks, medium dev-compendium), lottery UI (codepen abirana/jonslater, github jaydenpung/CEYEb3r, codecanyon), canvas (MDN move ball, medium mehmet, codepen gichmbugua, webfx), cards (freefrontend)]`
