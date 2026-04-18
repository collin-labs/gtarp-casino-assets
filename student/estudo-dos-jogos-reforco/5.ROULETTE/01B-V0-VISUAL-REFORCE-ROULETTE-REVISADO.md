# REFORCO VISUAL — ROULETTE / ROLETA (#5) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Tela 1 MODE SELECT: 2 cards premium (Classica vs Relampago) com badge POPULAR no Lightning
- [ ] Roda: wheel-european.png REAL (NAO redesenhar), rotate com Framer Motion, clamp(180px,25vw,380px)
- [ ] Bola: div circular branca radial-gradient, orbita reversa, bounce final
- [ ] Mesa: bg #0D5C2A com felt-texture.png, grid CSS 3x12 + outside bets + zero verde
- [ ] Celulas vermelhas rgba(220,38,38,0.15), pretas rgba(26,26,26,0.5), zero rgba(21,128,61,0.3)
- [ ] 6 chips CSS radial-gradient (10/25/50/100/500/1K), selecionado com border #00E676
- [ ] Spin: duration 4.5s, cubic-bezier(0.15, 0.85, 0.35, 1.0), finalAngle calculado
- [ ] Lightning phase: overlay escuro + revelacao sequencial 800ms stagger + flash + raio PNG
- [ ] 3 overlays resultado: Win (verde), Lose (shake sutil), Big Win Lightning (MEGA dourado)
- [ ] Historico: 50 badges circulares + Hot/Cold Numbers + apostas pessoais
- [ ] PF modal: glassmorphism com seeds, VERIFICAR, TROCAR SEED
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER + FUNDO

```
style={{
  position: 'absolute', inset: 0, zIndex: 60,
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  borderRadius: 'inherit', overflow: 'hidden',
}}
```

HUD Header: bg rgba(0,0,0,0.4), borderBottom 1px rgba(212,168,67,0.1). VOLTAR (esq), titulo Cinzel 700 #D4A843 letterSpacing 2px textShadow `0 0 8px rgba(255,215,0,0.3)`, saldo JetBrains #00E676 (dir), botoes PF + H (dir, 44x44, bg rgba(0,0,0,0.3)).

---

## 2. MODE SELECT — 2 Cards (Classica vs Relampago)

Cada card:
```
style={{
  flex: 1, minWidth: 'clamp(200px, 30vw, 300px)',
  background: 'linear-gradient(180deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))',
  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 16,
  padding: 'clamp(16px, 2vw, 24px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1vw, 14px)',
  cursor: 'pointer',
}}
```

Card RELAMPAGO extra: borderColor rgba(255,215,0,0.15), boxShadow `0 0 20px rgba(255,215,0,0.03)`.
Badge POPULAR: background `linear-gradient(135deg, #FFD700, #D4A843)`, color #1A1A1A, Cinzel, fontSize clamp(7px,0.8vw,10px), padding 2px 8px, borderRadius 4.

Titulo modo: Cinzel 700, clamp(14px,1.8vw,20px), #D4A843.
Botao JOGAR: minHeight 44, background `linear-gradient(180deg, #00E676, #00C853)`, color #000, Cinzel 700, boxShadow `0 4px 15px rgba(0,230,118,0.3)`.

Framer: stagger 0.15s, whileHover={{ y:-4 }}, whileTap={{ scale:0.98 }}.

---

## 3. RODA DA ROLETA — Imagem PNG REAL

ATENCAO: NAO redesenhe a roda em CSS/SVG. Usar wheel-european.png que JA TEM os 37 numeros.

```
style={{
  width: 'clamp(180px, 25vw, 380px)', aspectRatio: '1',
  borderRadius: '50%',
  filter: 'drop-shadow(0 0 20px rgba(212,168,67,0.15))',
}}
```

Imagem da roda: `/assets/games/roulette/wheel-european.png`, objectFit cover, borderRadius 50%.

Moldura dourada ao redor:
```
border: '4px solid rgba(212,168,67,0.5)',
boxShadow: '0 0 30px rgba(212,168,67,0.2), inset 0 0 20px rgba(0,0,0,0.3)',
borderRadius: '50%',
```

Idle: micro-oscilacao Framer animate={{ rotate:[0,2,-2,0] }}, duration 6s, repeat Infinity.

SPIN: Framer animate={{ rotate: finalAngle }}, transition={{ duration: 4.5, ease: [0.15, 0.85, 0.35, 1.0] }}.
finalAngle = base rotations (1440-2160) + offset do numero vencedor na EUROPEAN_SEQUENCE.

Glow durante spin: filter `drop-shadow(0 0 30px rgba(212,168,67,0.25))`.

---

## 4. BOLA — Div circular branca

NAO use ball.png para a animacao (pode usar como textura). A bola eh um div CSS:

```
style={{
  width: 'clamp(8px, 1vw, 14px)', height: same,
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #FFF, #E0E0E0, #A0A0A0)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
  position: 'absolute',
}}
```

Orbita: transform rotate em sentido OPOSTO a roda, posicao via translate no raio interno.
Desacelera junto com a roda. Bounce final no numero vencedor.

Bola parada (idle): posicao fixa no topo da roda, top clamp(8px,1.5vw,16px), left 50%.

---

## 5. MESA DE APOSTAS — Felt verde com grid

```
style={{
  width: 'clamp(280px, 45vw, 500px)',
  backgroundColor: '#0D5C2A',
  backgroundImage: "url('/assets/games/roulette/felt-texture.png')",
  backgroundSize: 'cover',
  border: '3px solid rgba(212,168,67,0.5)', borderRadius: 12,
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
  padding: 'clamp(4px, 0.5vw, 8px)',
}}
```

Grid numeros: CSS Grid `gridTemplateColumns: 'repeat(12, 1fr) auto'`. 3 rows:
- Row 1: 3, 6, 9, 12, ..., 36 + "2:1"
- Row 2: 2, 5, 8, 11, ..., 35 + "2:1"
- Row 3: 1, 4, 7, 10, ..., 34 + "2:1"
Zero (0) no topo, span full width.

Celula:
```
style={{
  minHeight: 44, minWidth: 'clamp(28px, 4vw, 44px)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontFamily: "'Inter', sans-serif", fontWeight: 700,
  fontSize: 'clamp(10px, 1.3vw, 16px)', color: '#FFF',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}}
```

Cores por numero:
- **Vermelho**: background rgba(220,38,38,0.15)
- **Preto**: background rgba(26,26,26,0.5)
- **Zero (verde)**: background rgba(21,128,61,0.3)

Outside bets (1a/2a/3a, 1-18/19-36, Par/Impar, Vermelho/Preto): Cinzel 700, clamp(9px,1.1vw,13px), color #D4A843.

Hover celula: overlay branco rgba(255,255,255,0.08), scale 1.03.
Chip posicionado: badge no canto inferior direito, JetBrains Mono clamp(6px,0.7vw,9px), #D4A843.

Durante SPIN: mesa com pointerEvents none, opacity 0.7, chips opacity 0.3 + grayscale 80%.

---

## 6. CHIPS — CSS radial-gradient (6 valores)

6 chips em row horizontal no footer:
```
style base={{
  width: 'clamp(32px, 4vw, 48px)', height: same,
  borderRadius: '50%', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(7px, 0.9vw, 11px)',
}}
```

Cores:
- **G$10**: radial-gradient(circle at 35% 35%, #E0E0E0ee, #E0E0E0, #E0E0E088), cor texto #333
- **G$25**: radial-gradient(circle at 35% 35%, #DC2626ee, #DC2626, #DC262688), cor texto #FFF
- **G$50**: radial-gradient(circle at 35% 35%, #2563EBee, #2563EB, #2563EB88), cor texto #FFF
- **G$100**: radial-gradient(circle at 35% 35%, #15803Dee, #15803D, #15803D88), cor texto #FFF
- **G$500**: radial-gradient(circle at 35% 35%, #7C3AEDee, #7C3AED, #7C3AED88), cor texto #FFF
- **G$1K**: radial-gradient(circle at 35% 35%, #D4A843ee, #D4A843, #D4A84388), cor texto #000

Selecionado: border 2px solid #00E676, boxShadow `0 0 12px rgba(0,230,118,0.4)`.
Nao selecionado: border 2px dashed rgba(255,255,255,0.2), opacity 0.6.
Framer: stagger 0.05s, whileHover{{ scale:1.1 }}, whileTap{{ scale:0.95 }}.

Ao apostar: chip aparece na posicao com Framer initial{{ scale:0 }}, animate{{ scale:1 }}, spring.

---

## 7. LIGHTNING PHASE — Sequencia temporal dramatica

Overlay:
```
style={{
  position: 'absolute', inset: 0, zIndex: 70,
  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
}}
```

Sequencia temporal:
- **t=100ms**: overlay fade-in 500ms
- **t=600ms**: som trovao
- **t=1000ms**: Lucky #1 aparece (flash + raio + badge multiplicador)
- **t=1800ms**: Lucky #2
- **t=2600ms**: Lucky #3
- **t=3400ms+**: overlay fade-out, roda inicia spin

Cada Lucky Number:
- Raio PNG: `/assets/games/roulette/lightning-bolt.png`, width clamp(30px,5vw,60px), filter `drop-shadow(0 0 12px rgba(255,215,0,0.6))`
- Circulo numero: width clamp(40px,5vw,64px), borderRadius 50%, border 3px solid #FFD700, boxShadow `0 0 20px rgba(255,215,0,0.5)`, bg = cor do numero
- Badge multiplicador: background `linear-gradient(135deg, #FFD700, #D4A843)`, color #1A1A1A, Cinzel Decorative 900, clamp(12px,1.8vw,22px)
- Multiplier PNGs disponiveis: `/assets/games/roulette/multipliers/multi-{50,100,200,300,400,500}x.png`

Framer numero: initial{{ scale:3, opacity:0 }}, animate{{ scale:1, opacity:1 }}, ease [0.34,1.56,0.64,1].
Flash branco: animation `lightningFlash 0.15s` por revelacao.

Numeros NAO Lucky na mesa: dimmed opacity 0.4, filter grayscale(50%).
Numeros Lucky na mesa: border 2px solid #FFD700, bg rgba(255,215,0,0.15), boxShadow `0 0 12px rgba(255,215,0,0.3)`.

---

## 8. RESULTADO — 3 variantes de overlay

**WIN** (ganhou aposta normal):
- Overlay: bg rgba(0,0,0,0.7), backdropFilter blur(8px)
- Circulo numero vencedor: width clamp(80px,12vw,140px), borderRadius 50%, bg = radial-gradient da cor, border 4px solid #FF6B6B (se vermelho), boxShadow `0 0 30px rgba(cor,0.4)`
- Numero: Cinzel Decorative 900, clamp(32px,5vw,56px), #FFF
- "VOCE GANHOU!": Cinzel 900, clamp(18px,3vw,36px), #00E676, textShadow `0 0 20px rgba(0,230,118,0.5)`
- Counter: JetBrains 700, clamp(24px,4vw,48px), #00E676, rolling 0→valor 2s
- Framer circulo: initial{{ scale:0.4 }}, animate{{ scale:1 }}, ease [0.34,1.56,0.64,1]

**LOSE** (perdeu):
- Overlay: bg rgba(0,0,0,0.65), SEM blur (mais sóbrio)
- "VOCE PERDEU": Cinzel 700, clamp(16px,2.5vw,28px), rgba(255,255,255,0.5)
- Valor perda: JetBrains, clamp(18px,3vw,32px), rgba(255,59,59,0.6)
- Framer texto: shake x [-3,3,-2,2,0] 0.4s. Sem confetti, sem counter.

**BIG WIN LIGHTNING** (multiplicador 200x+):
- Overlay: bg `radial-gradient(circle at 50% 40%, rgba(255,215,0,0.15), rgba(0,0,0,0.95))`, backdropFilter blur(12px)
- "MEGA WIN": Cinzel Decorative 900, clamp(28px,5vw,64px), #FFD700, textShadow 3 camadas, animation `megaPulse 2s infinite`
- Multiplicador: clamp(36px,6vw,80px), #FFD700, animation `multBigPulse 1.5s infinite`
- Counter: clamp(28px,5vw,56px), #00E676, rolling 4s
- Botoes aparecem APOS counter (delay 4.5s)
- Framer "MEGA WIN": initial{{ scale:0.3 }}, animate{{ scale:1 }}, ease [0.34,1.56,0.64,1]

Botoes pos-resultado: GIRAR NOVAMENTE (gradient verde) + VOLTAR (ghost dourado), delay 2.2s.

---

## 9. MINI HISTORICO — Badges circulares abaixo da roda

Row horizontal de badges circulares, 1 por resultado recente:
```
style={{
  width: 'clamp(20px, 2.5vw, 32px)', height: same,
  borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(7px, 0.9vw, 11px)', color: '#FFF',
  // background = cor do numero (vermelho/preto/verde)
}}
```
Ultimo resultado: border 2px solid #D4A843, transform scale(1.3).

---

## 10. KEYFRAMES OBRIGATORIOS

```css
@keyframes megaPulse {
  0%, 100% { transform: scale(1); text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4); }
  50% { transform: scale(1.08); text-shadow: 0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.6); }
}
@keyframes multBigPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
@keyframes lightningFlash {
  0% { opacity: 0; }
  10% { opacity: 0.3; }
  20% { opacity: 0; }
  30% { opacity: 0.15; }
  100% { opacity: 0; }
}
@keyframes lightningShake {
  0% { transform: translate(0, 0); }
  15% { transform: translate(-3px, 1px); }
  30% { transform: translate(2px, -2px); }
  45% { transform: translate(-1px, 2px); }
  60% { transform: translate(1px, -1px); }
  100% { transform: translate(0, 0); }
}
@keyframes saldoWinFlash {
  0% { color: #FFFFFF; transform: scale(1.15); }
  100% { color: #00E676; transform: scale(1); }
}
@keyframes celulaResultado {
  0%, 100% { box-shadow: 0 0 8px rgba(0,230,118,0.3); }
  50% { box-shadow: 0 0 16px rgba(0,230,118,0.6); }
}
```

---

## 11. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA redesenhar a roda em CSS/SVG — usar wheel-european.png REAL com FM rotate
2.  NUNCA usar Canvas para a roda — Framer Motion animate={{ rotate }} no img/div
3.  NUNCA fundo claro — SEMPRE #0A0A0A com bg-casino.png
4.  NUNCA mesa sem textura felt — bg #0D5C2A + felt-texture.png overlay
5.  NUNCA celulas sem cores distintas — vermelho rgba(220,38,38,0.15), preto rgba(26,26,26,0.5), zero rgba(21,128,61,0.3)
6.  NUNCA chips como circulos flat de cor solida — radial-gradient com highlight em 35% 35%
7.  NUNCA spin instantaneo — duration 4.5s com cubic-bezier(0.15, 0.85, 0.35, 1.0)
8.  NUNCA counter de payout instantaneo — rolling 2s (win) ou 4s (big win)
9.  NUNCA lightning sem sequencia temporal — revelacao stagger 800ms com flash + raio
10. NUNCA roda < clamp(180px, 25vw, 380px) — precisa ser grande o suficiente pra ver os numeros
11. NUNCA botao < 44px, NUNCA celula < 44px minHeight
12. NUNCA px fixo — SEMPRE clamp()
13. NUNCA sans-serif em titulos — Cinzel
14. NUNCA GCoin em cor diferente de #00E676
15. NUNCA omitir backdrop-filter blur nos overlays
```

---

## COMPARACAO — O que o V0 QUER entregar vs o que DEVE entregar

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Roda | Circulo CSS com setores coloridos | wheel-european.png REAL com FM rotate + moldura dourada + drop-shadow |
| Bola | Circulo branco estatico | radial-gradient branco com sombra, orbita reversa, bounce final |
| Mesa | Grid de divs coloridas sem textura | Felt #0D5C2A + felt-texture.png + borda dourada 3px + inset shadow |
| Chips | 6 circulos flat mesma cor | 6 radial-gradient com highlight 35% 35%, cores distintas, selecionado com glow verde |
| Spin | transform rotate instantaneo | 4.5s cubic-bezier deceleration + glow durante spin + mesa dimmed |
| Lightning | Numeros com borda amarela | Overlay escuro + raio PNG + flash branco + stagger 800ms + badges multiplicador |
| Resultado | Texto "17" inline | 3 overlays distintos: Win (circulo gigante + counter), Lose (shake), Big Win (MEGA pulse dourado 4s) |
| Mode Select | 2 botoes flat | 2 cards premium com badge POPULAR, gradientes, stagger entrance |
| Historico | Lista de numeros | 50 badges circulares + Hot/Cold barras + apostas pessoais em grid |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-ROULETTE-REVISADO.md — Abril 2026 — 36L → ~340L]`
