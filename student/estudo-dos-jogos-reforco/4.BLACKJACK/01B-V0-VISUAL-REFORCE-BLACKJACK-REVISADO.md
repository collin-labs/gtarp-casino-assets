# REFORCO VISUAL — BLACKJACK (#4) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta escura
- [ ] Mesa CENTRAL com felt radial-gradient verde (#1a472a→#0f2d1a→#091a0f) + borda dourada 3px + textura pontos
- [ ] Cartas com CSS 3D flip (perspective 1000, rotateY, backfaceVisibility hidden)
- [ ] Card face UP: fundo BRANCO, naipes VERMELHO #C62828 (copas/ouros) e PRETO #1A1A1A (espadas/paus)
- [ ] Card face DOWN: fundo escuro com padrao diamante "BC" dourado (NAO retangulo liso)
- [ ] 5 chips CSS radial-gradient (Prata 10 / Verde 25 / Azul 50 / Preto 100 / Dourado 500)
- [ ] 5 botoes de acao com COR UNICA cada (HIT=verde, STAND=dourado, DOUBLE=azul, SPLIT=roxo, SURRENDER=vermelho)
- [ ] Badge total com 6 estados de cor (normal/soft/bom/21-glow/bust/dealer)
- [ ] Insurance modal com timer SVG circular + urgencia vermelha <3s
- [ ] 5 variantes de resultado (Win=verde, Bust=shake, BJ Natural=shimmer dourado, Push=dourado neutro, Surrender=sutil)
- [ ] Side bets PP (esq) e 21+3 (dir) na mesa
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
}}
```

VOLTAR (top-left): bg rgba(0,0,0,0.6), border 1px rgba(212,168,67,0.4), Cinzel 700, #D4A843, minHeight 44.
SALDO (top-right): JetBrains Mono 700, #00E676, textShadow `0 0 10px rgba(0,230,118,0.5)`.
PF BADGE (top-center): bg rgba(0,0,0,0.5), border 1px rgba(212,168,67,0.3), JetBrains Mono, seedHash truncado.

---

## 2. MESA DE JOGO — Felt verde CENTRAL (NAO fullscreen)

A mesa eh um elemento CENTRAL posicionado no meio da tela com dimensoes definidas. Imagine uma mesa de blackjack de cassino real vista de cima.

```
style={{
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 'clamp(280px, 55vw, 600px)', minHeight: 'clamp(280px, 50vh, 500px)',
  background: 'radial-gradient(ellipse at 50% 50%, #1a472a 0%, #0f2d1a 70%, #091a0f 100%)',
  borderRadius: 'clamp(12px, 2vw, 20px)',
  border: '3px solid rgba(212,168,67,0.4)',
  boxShadow: '0 0 30px rgba(212,168,67,0.08), 0 8px 32px rgba(0,0,0,0.4), inset 0 0 150px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.2)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
  padding: 'clamp(16px, 3vw, 32px) clamp(12px, 2vw, 24px)',
  overflow: 'hidden',
}}
```

Textura felt (div filha, pseudo ou overlay):
```
backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
backgroundSize: '8px 8px', pointerEvents: 'none'
```

Divider central dourado:
```
width: '60%', height: 1,
background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)'
```

Labels DEALER/PLAYER: Cinzel 700, fontSize clamp(10px,1.3vw,14px), color rgba(255,255,255,0.1), uppercase, letterSpacing 3px.

---

## 3. CARTAS — CSS 3D FLIP (BRANCAS face-up, escuras face-down)

ATENCAO: Blackjack usa cartas BRANCAS com naipes TRADICIONAIS:
- Copas (hearts) e Ouros (diamonds) = **VERMELHO #C62828**
- Espadas (spades) e Paus (clubs) = **PRETO #1A1A1A**
Isso eh DIFERENTE do Poker (que usa gold/green).

Cada carta: width clamp(48px,8vw,72px), height clamp(67px,11.2vw,101px).

FACE UP:
```
style={{
  background: '#FFFFFF', borderRadius: 'clamp(4px, 0.6vw, 8px)',
  border: '1px solid rgba(0,0,0,0.15)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
}}
```
Rank: Inter 700, fontSize clamp(9px,1.3vw,14px), cor do naipe.
Naipe central (watermark): fontSize clamp(16px,2.5vw,28px), position absolute center, opacity 0.8.

FACE DOWN (hole card):
```
style={{
  background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)',
  border: '1.5px solid rgba(212,168,67,0.3)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)', borderRadius: 'clamp(4px, 0.6vw, 8px)',
}}
```
Padrao diamante interno com "BC": Cinzel 900, fontSize clamp(10px,1.5vw,16px), color rgba(212,168,67,0.4).

CSS 3D container:
```
perspective: 1000, transformStyle: 'preserve-3d'
```

Deal animation (Framer): initial={{ x:200, y:-100, opacity:0, rotateY:180 }}, animate={{ x:0, y:0, opacity:1, rotateY:0 }}, spring stiffness 200, damping 25, stagger 0.25s.

Hole card flip (dealer turn): spring stiffness 300, damping 40 + glow transitorio boxShadow `0 0 20px rgba(212,168,67,0.4)` 0.7s.

---

## 4. BADGE TOTAL — 6 estados de cor

```
style={{
  padding: 'clamp(2px, 0.3vw, 4px) clamp(8px, 1vw, 14px)',
  background: 'rgba(0,0,0,0.7)', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(11px, 1.5vw, 16px)',
}}
```

6 CORES:
- **< 17** (normal): color #A8A8A8
- **Soft hand** (A+X): color #448AFF, textShadow `0 0 6px rgba(68,138,255,0.3)`, mostrar "7/17"
- **17-20** (bom): color #00E676, textShadow `0 0 8px rgba(0,230,118,0.4)`
- **21** (perfeito): color #FFD700, textShadow `0 0 12px rgba(255,215,0,0.6)`, animation `bjTotalGlow 1.5s infinite`
- **Bust >21**: color #FF1744, textShadow `0 0 8px rgba(255,23,68,0.5)`
- **Dealer**: color #A8A8A8 (neutro)

Framer: key={total}, initial={{ scale:0.8, opacity:0 }}, animate={{ scale:1, opacity:1 }}, spring.

DOT PULSE (indicador mao ativa): 6px circulo #00E676, boxShadow `0 0 6px rgba(0,230,118,0.6)`, animate y [0,-2,0] infinite.

---

## 5. CHIPS — CSS radial-gradient (NAO usar PNGs)

5 chips em row horizontal, gap clamp(6px,1vw,12px):

```
style base={{
  width: 'clamp(36px, 5.5vw, 52px)', height: 'clamp(36px, 5.5vw, 52px)',
  borderRadius: '50%', fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700, fontSize: 'clamp(9px, 1.2vw, 13px)', color: '#FFFFFF',
  cursor: 'pointer', minHeight: 44,
  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}
```

Gradientes por valor:
- **G$10 Prata**: radial-gradient(circle at 35% 35%, #F5F5F5 0%, #BDBDBD 60%, #9E9E9E 100%), border 2px solid #9E9E9E
- **G$25 Verde**: radial-gradient(circle at 35% 35%, #66BB6A 0%, #388E3C 60%, #1B5E20 100%), border 2px solid #2E7D32
- **G$50 Azul**: radial-gradient(circle at 35% 35%, #448AFF 0%, #1565C0 60%, #0D47A1 100%), border 2px solid #1565C0
- **G$100 Preto**: radial-gradient(circle at 35% 35%, #1A1A1A 0%, #424242 60%, #212121 100%), border 2px solid #424242
- **G$500 Dourado**: radial-gradient(circle at 35% 35%, #D4A843 0%, #8B6914 60%, #5D4600 100%), border 2px solid #8B6914

Selecionado: outline 2px solid rgba(255,255,255,0.5), outlineOffset 2px, scale 1.15.
Disabled: background #1A1A1A, border rgba(255,255,255,0.1), opacity 0.35.
Hover: scale 1.1, boxShadow ganha glow da cor do chip.

BET DISPLAY (acima dos chips): JetBrains Mono 700, clamp(16px,2.5vw,28px), #00E676. Botao clear (X): 28px circulo, bg rgba(255,82,82,0.2).

---

## 6. BOTOES DE ACAO — 5 botoes com COR UNICA

Row horizontal, gap clamp(4px,0.8vw,10px), cada botao com gradiente 3-stop:

- **HIT**: linear-gradient(180deg, #00E676 0%, #00C853 50%, #004D25 100%), border rgba(0,230,118,0.4)
- **STAND**: linear-gradient(180deg, #D4A843 0%, #CB9B51 50%, #8B6914 100%), border rgba(212,168,67,0.4)
- **DOUBLE**: linear-gradient(180deg, #448AFF 0%, #2962FF 50%, #1A237E 100%), border rgba(68,138,255,0.4)
- **SPLIT**: linear-gradient(180deg, #B388FF 0%, #7C4DFF 50%, #4A148C 100%), border rgba(179,136,255,0.4)
- **SURRENDER**: linear-gradient(180deg, #FF5252 0%, #D32F2F 50%, #B71C1C 100%), border rgba(255,82,82,0.4)

Cada botao: Cinzel 700, fontSize clamp(9px,1.2vw,14px), uppercase, letterSpacing 1.5px, minHeight 44, minWidth clamp(60px,10vw,80px), color #FFFFFF.
Disabled: background #1A1A1A, border rgba(255,255,255,0.05), opacity 0.35.
Hover (enabled): y -1, boxShadow `0 4px 16px [shadowColor]`.
Framer: stagger delay i*0.05.

---

## 7. INSURANCE MODAL — Timer SVG circular

Overlay: rgba(0,0,0,0.7), backdropFilter blur(6px).

Modal:
```
style={{
  background: 'rgba(10,10,10,0.95)',
  border: '1.5px solid rgba(212,168,67,0.3)', borderRadius: 16,
  padding: 'clamp(16px, 3vw, 32px)', minWidth: 'clamp(240px, 40vw, 360px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(212,168,67,0.05)',
}}
```

Timer SVG (48x48): circle cx=24 cy=24 r=20. Background stroke rgba(255,255,255,0.1) width 3. Progress stroke #D4A843 width 3, dasharray 126, linecap round. Valor central: JetBrains Mono 700, 14px.
**Urgente (<3s)**: stroke #FF3B3B, color #FF3B3B, animation `bjInsuranceUrgent 0.5s infinite` (opacity pulse).

Botao SIM: gradient verde (00C853→004D25), border rgba(0,230,118,0.3).
Botao NAO: ghost, border rgba(212,168,67,0.3), color #D4A843.

---

## 8. RESULTADO — 5 variantes de overlay

TODAS: position absolute, inset 0, backdropFilter blur, zIndex 80.

**WIN**: bg rgba(0,0,0,0.7), titulo Cinzel 900 clamp(20px,4vw,40px) #00E676, textShadow `0 0 20px rgba(0,230,118,0.5)`, payout countup 1.5s.

**BUST**: bg rgba(0,0,0,0.6), titulo #FF1744, Framer shake x [-3,3,-2,2,0] 0.4s. Sem confetti.

**BLACKJACK NATURAL**: bg rgba(0,0,0,0.85), titulo Cinzel 900 clamp(24px,5vw,48px) #FFD700, textShadow 3 camadas. Shimmer sweep: pseudo-element translateX -100%→100% 1.5s. Confetti: 30 particulas douradas (#FFD700, #D4A843, #00E676, #FFFFFF). Payout 3:2.

**PUSH**: bg rgba(0,0,0,0.5), titulo #FFD700, tom neutro. Sem confetti. Saldo nao muda.

**SURRENDER**: bg rgba(0,0,0,0.5), titulo rgba(212,168,67,0.6), sem textShadow. Cartas fade out 0.5s.

Botoes pos-resultado (delay 2.2s): NOVA MAO (gradient verde) + VOLTAR (ghost dourado).

---

## 9. SIDE BETS — PP (esq) e 21+3 (dir)

Posicao: absolute, top 50%, translateY(-50%), um left e outro right.

```
style={{
  width: 'clamp(48px, 7vw, 64px)', minHeight: 'clamp(48px, 7vw, 64px)',
  background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)',
  borderRadius: 8, cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
}}
```

Win: borderColor rgba(0,230,118,0.5), animation `bjSideBetGlow 1.5s infinite`, payout em #00E676.
Lose: borderColor rgba(255,255,255,0.05), opacity 0.4, texto "-" #666.

---

## 10. KEYFRAMES OBRIGATORIOS

```css
@keyframes bjDotPulse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes bjTotalBounce {
  0% { transform: scale(1); }
  40% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes bjTotalGlow {
  0%, 100% { text-shadow: 0 0 8px rgba(255,215,0,0.4); }
  50% { text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4); }
}
@keyframes bjSideBetGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(0,230,118,0.3); }
  50% { box-shadow: 0 0 20px rgba(0,230,118,0.6); }
}
@keyframes bjShimmerSweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@keyframes bjBalanceWin {
  0%, 100% { color: #00E676; text-shadow: 0 0 10px rgba(0,230,118,0.5); }
  25% { color: #FFFFFF; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
  50% { color: #00E676; text-shadow: 0 0 15px rgba(0,230,118,0.7); }
  75% { color: #FFFFFF; text-shadow: 0 0 20px rgba(255,255,255,0.6); }
}
@keyframes bjBalanceLose {
  0%, 100% { color: #00E676; }
  50% { color: rgba(255,59,59,0.8); }
}
@keyframes bjInsuranceUrgent {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 11. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA mesa como fundo #0A0A0A liso — mesa eh radial-gradient felt verde SEPARADA do fundo
2.  NUNCA cartas face-up com fundo escuro — face-up eh BRANCA (#FFFFFF) com naipes coloridos
3.  NUNCA naipes em gold/green como Poker — Blackjack usa VERMELHO #C62828 e PRETO #1A1A1A tradicionais
4.  NUNCA card flip com opacity fade — SEMPRE perspective 1000 + rotateY + backfaceVisibility hidden
5.  NUNCA card back como retangulo liso — SEMPRE padrao diamante "BC" dourado
6.  NUNCA chips como circulos de cor solida — SEMPRE radial-gradient com highlight em 35% 35%
7.  NUNCA todos botoes de acao da mesma cor — 5 cores UNICAS (verde/dourado/azul/roxo/vermelho)
8.  NUNCA badge total sem 6 estados de cor — normal/soft/bom/21/bust/dealer
9.  NUNCA px fixo em NADA — SEMPRE clamp(min, preferred, max)
10. NUNCA botao < 44px, NUNCA chip < 44px
11. NUNCA sans-serif em titulos — SEMPRE Cinzel
12. NUNCA GCoin em cor diferente de #00E676 + JetBrains Mono
13. NUNCA insurance sem timer SVG circular com urgencia vermelha
14. NUNCA resultado sem 5 variantes visuais distintas (win/bust/bj/push/surrender)
15. NUNCA dealer turn sem flip dramatico do hole card + glow transitorio
```

---

## COMPARACAO — O que o V0 QUER entregar vs o que DEVE entregar

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Mesa | Div #0A0A0A fullscreen | Elemento CENTRAL com felt radial-gradient verde + textura pontos + borda dourada 3px |
| Cartas face-up | Retangulo escuro com texto | Fundo BRANCO, rank Inter 700, naipes vermelho/preto tradicionais, sombra |
| Card back | Retangulo cinza liso | Gradiente escuro 135deg com padrao diamante "BC" dourado rgba(212,168,67,0.4) |
| Card flip | opacity 0→1 | perspective 1000, rotateY 180→0, spring stiffness 300, glow transitorio |
| Chips | 5 circulos flat | 5 radial-gradient com highlight 35% 35% (Prata/Verde/Azul/Preto/Dourado), inset shadow |
| Botoes acao | 5 botoes cinza iguais | 5 gradientes UNICOS (verde/dourado/azul/roxo/vermelho) |
| Badge total | Numero branco inline | 6 estados cor + bounce + glow no 21 + pulse animation |
| Insurance | Alert dialog nativo | Modal glassmorphism + timer SVG circular + urgencia vermelha <3s |
| Resultado | Texto inline "VOCE GANHOU" | 5 overlays distintos: Win (verde), Bust (shake), BJ Natural (shimmer+confetti), Push (dourado), Surrender (sutil) |
| Side bets | Ausentes | PP + 21+3 nas laterais da mesa com glow pulse ao ganhar |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-BLACKJACK-REVISADO.md — Abril 2026 — 32L → ~340L]`
