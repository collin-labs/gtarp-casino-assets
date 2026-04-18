# REFORCO VISUAL — COINFLIP / CARA OU COROA (#12) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: CSS 3D coin flip (dev.to shahibur), backface-visibility (MDN), edge stacking (desandro)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] LOBBY: grid auto-fill de room cards + filtros (Low/Medium/High/Todas) + btn CRIAR verde + historico recente
- [ ] Room card: avatar + nickname + badge lado (CARA verde / COROA dourado) + valor GCoin + btn ENTRAR
- [ ] MODAL CRIAR: input valor JetBrains + shortcuts MIN/x2/÷2/MAX + 2 moedas PNG grandes (coin-cara/coin-coroa)
- [ ] MOEDA 3D: perspective 1000px, transformStyle preserve-3d, backfaceVisibility hidden, 2 faces PNG
- [ ] FLIP: countdown 3→2→1 Cinzel 96px + moeda gira rotateY 2160°+ em 2.5s ease + barra suspense
- [ ] CORES LADOS: CARA = #00E676 (verde), COROA = #FFD700 (dourado) — CONSISTENTE em toda UI
- [ ] RESULTADO: vencedor com glow + confetti + countup premio vs perdedor dimmed
- [ ] 8 keyframes: cfShimmer, cfWaitingPulse, cfCoinGlow, cfWinnerGlow, cfSuspenseFill, cfFlash, cfSpin, cfParticleFall
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

## 2. LOBBY — Grid de salas + filtros

FILTROS (4 botoes inline):
```
style normal={{
  padding: 'clamp(6px,0.8vw,10px) clamp(12px,1.5vw,20px)',
  borderRadius: 8, fontFamily: "'Inter', sans-serif",
  fontSize: 'clamp(10px,1.1vw,13px)', fontWeight: 500,
  border: '1px solid rgba(212,168,67,0.2)', background: 'transparent',
  color: '#D4A843', minHeight: 44, cursor: 'pointer',
}}
style ativo={{
  background: 'rgba(212,168,67,0.15)', borderColor: '#FFD700', color: '#FFD700',
}}
```

Btn CRIAR SALA:
```
style={{
  background: 'linear-gradient(180deg, #00C853 0%, #004D25 100%)',
  border: '1.5px solid rgba(0,230,118,0.3)', borderRadius: 8, color: '#FFFFFF',
  fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(10px,1.3vw,14px)',
  textTransform: 'uppercase', letterSpacing: '2px', minHeight: 44,
  boxShadow: '0 4px 16px rgba(0,200,83,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
}}
```

GRID SALAS:
```
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px,18vw,200px), 1fr))',
  gap: 'clamp(8px,1vw,16px)', flex: 1, overflowY: 'auto', alignContent: 'start',
}}
```

ROOM CARD:
```
style={{
  background: '#141414', border: '1px solid rgba(212,168,67,0.15)',
  borderRadius: 'clamp(8px,1vw,12px)', padding: 'clamp(12px,1.5vw,20px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: 'clamp(6px,0.8vw,10px)', position: 'relative', overflow: 'hidden',
}}
```
Hover: y:-4, boxShadow `0 8px 30px rgba(0,0,0,0.4)`.
HIGH STAKE (>10k): borderColor rgba(212,168,67,0.5), boxShadow `0 0 20px rgba(212,168,67,0.1)`.

Avatar: clamp(36px,4.5vw,56px), borderRadius 50%, border 2px solid #D4A843.
Nickname: Cinzel 600, clamp(10px,1.2vw,14px), #F5F5F5.
Lado: Inter 600, uppercase. **CARA=#00E676, COROA=#FFD700**.
Valor: JetBrains 700, clamp(14px,1.8vw,20px), #00E676, textShadow verde.
Btn ENTRAR: border 1px solid #D4A843, color #D4A843, minHeight 44. Hover: #FFD700.
Badge AGUARDANDO: bg rgba(0,230,118,0.08), animation `cfWaitingPulse 2s infinite`.

---

## 3. MOEDA 3D — ELEMENTO MAIS CRITICO

CONTAINER (perspectiva):
```
style={{
  width: 'clamp(100px, 14vw, 180px)', height: same,
  perspective: 1000,
}}
```

INNER (3D preservado):
```
style={{
  width: '100%', height: '100%',
  transformStyle: 'preserve-3d',
  position: 'relative',
}}
```
Framer Motion: animate={{ rotateY: targetAngle }}, transition{{ duration: 2.5, ease: [0.15, 0.05, 0.25, 1.0] }}.
targetAngle: voltas = 4 + Math.floor(Math.random()*3). CARA = voltas*360. COROA = voltas*360 + 180.

FACE CARA:
```
style={{
  position: 'absolute', inset: 0,
  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
  borderRadius: '50%',
  backgroundImage: "url('/assets/coinflip/coin-cara.png')",
  backgroundSize: 'cover',
  boxShadow: '0 0 20px rgba(255,215,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,215,0,0.15)',
}}
```

FACE COROA:
```
style={{
  position: 'absolute', inset: 0,
  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
  borderRadius: '50%', transform: 'rotateY(180deg)',
  backgroundImage: "url('/assets/coinflip/coin-coroa.png')",
  backgroundSize: 'cover',
  boxShadow: '0 0 20px rgba(255,215,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,215,0,0.15)',
}}
```

GLOW DURANTE SPIN (div overlay):
```
style={{
  position: 'absolute', inset: '-10%', borderRadius: '50%',
  pointerEvents: 'none',
  animation: 'cfCoinGlow 0.5s ease-in-out infinite',
}}
```

SOMBRA PROJETADA:
```
style={{
  position: 'absolute', bottom: '-12%', left: '15%', width: '70%', height: '15%',
  borderRadius: '50%',
  background: 'radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)',
  // scaleX varia com rotateY (mais achatada de lado)
}}
```

---

## 4. TELA FLIP — Countdown + Versus + Suspense

CONTAINER FLIP:
```
style={{
  position: 'absolute', inset: 0, zIndex: 70,
  backgroundColor: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(6px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 'clamp(12px,2vw,24px)',
}}
```

POT TOTAL: JetBrains 700, clamp(18px,2.5vw,30px), #00E676, textShadow `0 0 12px rgba(0,230,118,0.4)`.

AREA CENTRAL: flex row, gap clamp(24px,5vw,60px).

CARD JOGADOR (esquerdo/direito):
Avatar: clamp(48px,6vw,72px), borderRadius 50%.
CARA: border `3px solid #00E676`. COROA: border `3px solid #FFD700`.
Nome: Cinzel 700, clamp(12px,1.4vw,16px).
Framer: esquerdo initial{{ x:-50 }}, direito initial{{ x:50 }}.

COUNTDOWN (3→2→1):
```
style={{
  fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(48px, 8vw, 96px)', color: '#D4A843',
  textShadow: '0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)',
}}
```
AnimatePresence mode="wait": initial{{ scale:1.5, opacity:1 }}, exit{{ scale:0.8, opacity:0 }}, duration 0.8s.
Apos "1": 300ms silencio → moeda gira.

BARRA SUSPENSE:
```
style={{
  width: '80%', height: 'clamp(3px,0.4vw,5px)', borderRadius: 3,
  background: '#1A1A1A', overflow: 'hidden',
}}
```
Fill: `linear-gradient(90deg, #D4A843, #FFD700, #00E676)`, animation `cfSuspenseFill 2.5s ease forwards`.

---

## 5. RESULTADO — Vencedor vs Perdedor

FLASH BRANCO no momento do resultado: animation `cfFlash 0.4s`.

VENCEDOR:
- Avatar: border `3px solid #FFD700`, animation `cfWinnerGlow 2s infinite`
- "VENCEDOR!": Cinzel 800, clamp(18px,2.5vw,28px), #FFD700, textShadow 2 camadas
- Premio: JetBrains 700, clamp(20px,3vw,36px), #00E676, countup rAF 2s

PERDEDOR: opacity 0.4, filter grayscale(0.3).

Particulas: 60 spans douradas, animation `cfParticleFall` stagger, sobre o vencedor.
Botoes: REVANCHE (dourado) + NOVO JOGO (verde) + LOBBY (cinza ghost).

---

## 6. ASSETS REAIS

```
/assets/coinflip/coin-cara.png        (face CARA — verde)
/assets/coinflip/coin-coroa.png       (face COROA — dourada)
/assets/coinflip/coin-cara-mini.png   (mini 14-20px)
/assets/coinflip/coin-coroa-mini.png  (mini 14-20px)
/assets/coinflip/icon-history.png     (icone historico dourado)
/assets/coinflip/icon-leaderboard.png (icone ranking dourado)
/assets/coinflip/icon-provably-fair.png
/assets/coinflip/icon-sound-on.png / icon-sound-off.png
/assets/coinflip/icon-copy.png / icon-check.png
```

---

## 7. KEYFRAMES OBRIGATORIOS

```css
@keyframes cfShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
@keyframes cfWaitingPulse {
  0%, 100% { border-color: rgba(0,230,118,0.2); }
  50% { border-color: rgba(0,230,118,0.5); }
}
@keyframes cfCoinGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.2); }
  50% { box-shadow: 0 0 40px rgba(255,215,0,0.5); }
}
@keyframes cfWinnerGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
  50% { box-shadow: 0 0 35px rgba(255,215,0,0.5); }
}
@keyframes cfSuspenseFill {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0%); }
}
@keyframes cfFlash {
  0% { opacity: 0; }
  50% { opacity: 0.3; }
  100% { opacity: 0; }
}
@keyframes cfSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes cfParticleFall {
  0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translateY(80px) scale(0.3) rotate(180deg); }
}
```

---

## 8. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA moeda como circulo CSS flat com letra "H"/"T" — SEMPRE 2 PNGs reais com perspective 3D
2.  NUNCA backfaceVisibility sem -webkit- — OBRIGATORIO ambos (FiveM CEF Chromium)
3.  NUNCA perspective diferente de 1000px — Doc 6 define 1000
4.  NUNCA cores trocadas — CARA eh SEMPRE #00E676 (verde), COROA eh SEMPRE #FFD700 (dourado)
5.  NUNCA flip sem countdown 3→2→1 — AnimatePresence mode="wait" com escala dramatica
6.  NUNCA flip linear — ease [0.15, 0.05, 0.25, 1.0] com 4-7 voltas completas
7.  NUNCA resultado sem flash branco — cfFlash 0.4s no momento exato
8.  NUNCA barra suspense ausente — preenche gradiente dourado→verde em 2.5s (mesma duracao do flip)
9.  NUNCA fundo claro — #0A0A0A + bg-casino.png
10. NUNCA sans-serif em titulos — Cinzel
11. NUNCA px fixo — SEMPRE clamp()
12. NUNCA botao < 44px
13. NUNCA GCoin diferente de #00E676
14. NUNCA icones Lucide para identidade visual — PNGs dourados. Lucide so pra [X] fechar
15. NUNCA room card sem hover (y:-4, shadow cresce) e sem badge lado colorido
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Moeda | Circulo CSS "H"/"T" | 2 PNGs reais (coin-cara/coin-coroa) com perspective 1000 + preserve-3d + backfaceVisibility |
| Flip | Troca instantanea | rotateY 2160°+ em 2.5s ease [0.15,0.05,0.25,1.0] com countdown 3→2→1 + barra suspense |
| Lobby | Lista vertical simples | Grid auto-fill com room cards + filtros Low/Med/High + badges + historico recente |
| Lados | Ambos mesma cor | CARA=#00E676 (verde) COROA=#FFD700 (dourado) CONSISTENTE em toda UI |
| Resultado | Texto "GANHOU" | Flash branco + vencedor glow dourado + countup + particulas vs perdedor dimmed |
| Room card | Div com texto | Card #141414 + avatar + badge lado colorido + valor GCoin + btn ENTRAR + hover y:-4 |
| Countdown | Numero pequeno | Cinzel 96px com AnimatePresence scale 1.5→1.0 + textShadow dourado |
| Suspense | Ausente | Barra gradiente dourado→verde preenchendo em 2.5s (synced com flip) |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-COINFLIP-REVISADO.md — Abril 2026 — 87L → ~340L]`
`[X0: 3 rodadas, 3D coin flip (dev.to/shahibur, medium/akhil), backfaceVisibility (MDN), edge stacking (desandro)]`
