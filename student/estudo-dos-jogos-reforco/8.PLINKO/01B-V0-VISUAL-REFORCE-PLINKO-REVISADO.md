# REFORCO VISUAL — PLINKO (#8) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + overlay escuro + vinheta radial
- [ ] Header: VOLTAR (esq) + titulo "PLINKO" Cinzel Decorative 900 #FFD700 pulsante + icones Som/PF (dir) + saldo #00E676 (dir)
- [ ] Layout 2 colunas: controles (20-25% esq) + board canvas (70% dir)
- [ ] Board com moldura dourada 1.5px, outline 1px offset 3px, boxShadow 5 camadas
- [ ] Pegs dourados #D4A843 com radialGradient e flash #FFD700 ao contato 150ms
- [ ] Bola VERDE #00E676 (NAO dourada) com trail de 15 posicoes alpha decrescente
- [ ] Slots multiplicadores na base com 4 tiers de cor (cinza/verde/dourado/vermelho)
- [ ] Risk tint overlay que muda por nivel (transparent/dourado sutil/vermelho sutil)
- [ ] Botao APOSTAR: gradiente verde (00E676→00C853→004D25), pulse glow idle
- [ ] Risk selector: 3 botoes (Low=#00C853 verde, Med=#FFD700 dourado, High=#FF1744 vermelho)
- [ ] Result overlay com multiplicador scale bounce + payout float-up
- [ ] Big Win overlay para mult >= 50x (3 tiers, backdrop blur, particulas)
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER PRINCIPAL — Atmosfera cassino premium

```
style={{
  position: 'absolute', inset: 0, zIndex: 60,
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
  borderRadius: 'inherit', overflow: 'hidden',
  display: 'flex', flexDirection: 'column',
  padding: 'clamp(6px, 0.8vw, 14px)',
}}
```

Overlay escurecimento (div absoluta): background rgba(0,0,0,0.75), zIndex 0.
Vinheta (div absoluta): background `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)`, zIndex 1, pointerEvents none.

Beam verde na base (3px):
```
style={{
  position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
  background: 'linear-gradient(90deg, transparent 0%, rgba(0,230,118,0.6) 30%, rgba(0,230,118,0.8) 50%, rgba(0,230,118,0.6) 70%, transparent 100%)',
  boxShadow: '0 0 8px rgba(0,230,118,0.4), 0 0 20px rgba(0,230,118,0.15)',
  zIndex: 5, pointerEvents: 'none',
}}
```

Linha dourada no topo (1px):
```
background: 'linear-gradient(90deg, transparent 0%, rgba(246,226,122,0.5) 50%, transparent 100%)'
```

---

## 2. HEADER BAR

Layout flex row: VOLTAR esq, titulo centro, icones+saldo dir.

TITULO "PLINKO":
```
style={{
  fontFamily: "'Cinzel Decorative', serif", fontWeight: 900,
  fontSize: 'clamp(16px, 2.5vw, 28px)', color: '#FFD700',
  textShadow: '0 0 25px rgba(255,215,0,0.9), 0 4px 10px rgba(0,0,0,1)',
  textTransform: 'uppercase', letterSpacing: '4px',
  animation: 'plinko-pulse-gold 3s ease-in-out infinite',
}}
```

VOLTAR: bg rgba(0,0,0,0.6), border 1px rgba(212,168,67,0.4), Cinzel 700, #D4A843, minHeight 44px.
SALDO: JetBrains Mono 700, #00E676, textShadow `0 0 10px rgba(0,230,118,0.5)`.
Icones Som/PF: PNG dourados de /assets/shared/icons/, clamp(20px,2.5vw,32px), opacity 0.7 → 1 hover.

---

## 3. PAINEL DE CONTROLES (20-25% width, lado esquerdo)

```
style={{
  flex: '0 0 clamp(180px, 22vw, 260px)',
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(212,168,67,0.2)',
  borderRadius: 12,
  padding: 'clamp(8px, 1vw, 16px)',
  display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vw, 14px)',
  boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,215,0,0.05)',
}}
```

Labels (APOSTA, RISCO, LINHAS): Cinzel 700, #D4A843, uppercase, fontSize clamp(8px,1vw,12px), letterSpacing 2px.

INPUT APOSTA:
```
style={{
  width: '100%', background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(212,168,67,0.3)', borderRadius: 6,
  color: '#00E676', fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700, fontSize: 'clamp(12px, 1.5vw, 18px)',
  padding: 'clamp(6px, 0.8vw, 10px)', textAlign: 'center', minHeight: 44,
}}
```
Focus: borderColor rgba(0,230,118,0.5), boxShadow `0 0 8px rgba(0,230,118,0.2)`.

ATALHOS (MIN, x2, /2, MAX) — 4 botoes flex row:
```
style={{
  flex: 1, background: 'rgba(212,168,67,0.1)',
  border: '1px solid rgba(212,168,67,0.2)', borderRadius: 4,
  color: '#D4A843', fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 600, fontSize: 'clamp(7px, 0.9vw, 11px)',
  minHeight: 44, cursor: 'pointer', textAlign: 'center',
}}
```
Hover: bg rgba(212,168,67,0.2), borderColor rgba(212,168,67,0.4), scale 1.05.

RISK SELECTOR — 3 botoes com COR PROPRIA:
- Low ativo: background rgba(0,200,83,0.2), border 1px rgba(0,200,83,0.5), color #00C853, boxShadow `0 0 8px rgba(0,200,83,0.3)`
- Med ativo: background rgba(255,215,0,0.15), border 1px rgba(255,215,0,0.5), color #FFD700, boxShadow `0 0 8px rgba(255,215,0,0.3)`
- High ativo: background rgba(255,23,68,0.15), border 1px rgba(255,23,68,0.5), color #FF1744, boxShadow `0 0 8px rgba(255,23,68,0.3)`
- Inativo: background rgba(255,255,255,0.05), color #666666

SLIDER DE ROWS (8-16):
```
Track: height 4, background 'linear-gradient(90deg, rgba(212,168,67,0.3) 0%, #D4A843 var(--pct), rgba(255,255,255,0.1) var(--pct))', borderRadius 2
Thumb: width clamp(18px,2.5vw,24px), background '#00E676', border '2px solid #00E676', borderRadius 50%, boxShadow '0 0 8px rgba(0,230,118,0.4)'
```

BOTAO APOSTAR:
```
style={{
  width: '100%', padding: 'clamp(8px, 1vw, 14px)',
  background: 'linear-gradient(180deg, #00E676 0%, #00C853 50%, #004D25 100%)',
  border: '1px solid rgba(0,230,118,0.4)', borderRadius: 8,
  color: '#FFFFFF', fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(11px, 1.4vw, 18px)', letterSpacing: '3px',
  textTransform: 'uppercase', minHeight: 44, cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,200,83,0.3)',
  animation: 'plinko-pulse-green 2s ease-in-out infinite',
}}
```
Hover: scale 1.03, boxShadow `0 6px 20px rgba(0,200,83,0.45)`.
Disabled: gradient cinza (#444→#333→#222), borderColor rgba(100,100,100,0.3), color #666, animation none.

BOTAO PARAR (autobet): gradient vermelho (FF3B3B→FF1744→B71C1C), border rgba(255,23,68,0.5), animation `plinko-pulse-red 2s infinite`.

---

## 4. BOARD DE PEGS — Canvas com moldura dourada

Container board (70% da area):
```
style={{
  flex: '1 1 70%', position: 'relative',
  borderRadius: 14,
  border: '1.5px solid rgba(212,168,67,0.3)',
  outline: '1px solid rgba(191,149,63,0.1)',
  outlineOffset: 3,
  boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3), 0 12px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(212,168,67,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
  overflow: 'hidden', background: 'rgba(0,0,0,0.4)',
}}
```

Estado DROPPING: borderColor muda pra rgba(0,230,118,0.25), boxShadow ganha `0 0 15px rgba(0,230,118,0.08)`.

2 Canvas sobrepostos (position absolute inset 0):
- Canvas estatico (zIndex 1): pegs + slots multiplicadores (nao muda durante drop)
- Canvas animacao (zIndex 2): bola + trail (limpa a cada frame)

Risk tint overlay (div, zIndex 3, pointerEvents none):
- Low: transparent
- Medium: rgba(255,215,0,0.03)
- High: rgba(255,23,68,0.03)

PEGS no Canvas:
- Formato piramide: mais pegs embaixo (ex: 12 rows = row 1 tem 3 pegs, row 12 tem 14)
- Cada peg: circulo com radialGradient do Canvas (centro #F6E27A, meio #D4A843, borda #8B6914)
- Glow sutil: segundo circulo com alpha 0.15 ao redor
- Flash ao contato: radialGradient #FFD700 com alpha 1→0 em 150ms

---

## 5. BOLA — VERDE #00E676 (NAO DOURADA)

ATENCAO: A bola eh VERDE, nao dourada. Dourado sao os pegs.

```
Canvas draw:
- Raio: 6px
- Fill: radialGradient centro #00E676 solido → borda rgba(0,230,118,0.6) fade
- Glow: segundo circulo raio 12px, fill rgba(0,230,118,0.3)

Trail: 15 posicoes anteriores
- Cada ponto: circulo com alpha decrescente (0.4, 0.37, 0.34, ..., 0.02)
- Raio decrescente (5px → 2px)
- Cor: #00E676 com alpha acima
```

Animacao: bezier quadratica entre pegs. Easing gravity t^2. Jitter visual +-3px XY. Duracao 120-160ms por segmento. requestAnimationFrame game loop.

---

## 6. SLOTS MULTIPLICADORES (base do board)

Row de retangulos na base do Canvas, 1 por slot (quantidade = rows + 1).

4 TIERS de cor:
- **Loss** (mult <= 1x): bg rgba(100,100,100,0.3), border rgba(100,100,100,0.2), color #A8A8A8
- **Low-win** (1.1-5x): bg rgba(0,230,118,0.15), border rgba(0,230,118,0.3), color #00E676
- **High-win** (5.1-50x): bg rgba(255,215,0,0.15), border rgba(255,215,0,0.4), color #FFD700
- **Extreme** (51-1000x): bg rgba(255,23,68,0.15), border rgba(255,23,68,0.4), color #FF1744, fontWeight 900

Texto: JetBrains Mono 700, fontSize clamp(7px,1.2vw,12px).
Distribuicao simetrica: extremos nas bordas (extreme), centro (loss/low).

Slot atingido: glow pulsante da cor do tier por 2.5s (keyframe plinko-glow-peg).

---

## 7. HISTORICO BADGES (row horizontal abaixo do board)

Flex row scrollavel, badges com resultado de cada drop.

Cada badge:
```
style={{
  borderRadius: 6, padding: 'clamp(3px, 0.4vw, 6px) clamp(6px, 0.8vw, 10px)',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(8px, 1vw, 12px)',
  // cor por tier (mesmas 4 cores dos slots)
}}
```
Framer: stagger 0.03s, initial={{ opacity:0, scale:0.8 }}, animate={{ opacity:1, scale:1 }}.

---

## 8. RESULT OVERLAY (sobre o board, mult < 50x)

Position absolute no board, zIndex 20.

Multiplicador grande:
```
style={{
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 900,
  fontSize: 'clamp(32px, 5vw, 64px)',
  // cor do tier do multiplicador
  textShadow: '0 0 20px rgba(cor,0.6), 0 0 40px rgba(cor,0.2), 0 4px 12px rgba(0,0,0,0.8)',
}}
```
Framer: initial={{ scale:0 }} animate={{ scale:[0, 1.6, 1] }} transition={{ duration:0.5, type:'spring' }}.

Payout float-up: JetBrains Mono 700, #00E676, animate y 0→-50 + opacity [0,1,1,0] em 2s.
Contagem animada: rAF de 0 ate payout em 1.5s, ease-out cubic.
Auto-dismiss: 2.5s normal, 1.5s autobet. AnimatePresence exit opacity 0 scale 0.5.

---

## 9. BIG WIN OVERLAY (mult >= 50x, fullscreen)

Position absolute inset 0, zIndex 65.

```
style={{
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(6px)',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
}}
```

Flash branco: div inset 0, rgba(255,255,255,0.8), Framer opacity 1→0 em 150ms.

Gradient pulsante: radialGradient rgba(255,215,0,0.15), animation `plinko-bigwin-pulse 2s infinite`.

Titulo: Cinzel Decorative 900, clamp(28px,5vw,64px), #FFD700, textShadow 3 camadas.
Framer: initial={{ scale:0, rotate:-10 }} animate={{ scale:[0,1.8,1.3], rotate:[-10,5,0] }} duration 0.8s.

Multiplicador: JetBrains 900, clamp(36px,7vw,80px), #FF1744, delay 0.5s.
Payout: JetBrains 700, clamp(20px,3.5vw,48px), #00E676, contagem 3s, delay 0.8s.

3 tiers:
- 50-99x: "BIG WIN!" auto-close 3s
- 100-499x: "MEGA WIN!" auto-close 4s
- 500-1000x: "LEGENDARY WIN!" auto-close 5s

"clique para fechar": Inter, rgba(255,255,255,0.3), opacity pulse.

---

## 10. KEYFRAMES OBRIGATORIOS

```css
@keyframes plinko-pulse-green {
  0%   { box-shadow: 0 0 6px rgba(0,230,118,0.2); }
  50%  { box-shadow: 0 0 18px rgba(0,230,118,0.4), 0 0 30px rgba(0,230,118,0.15); }
  100% { box-shadow: 0 0 6px rgba(0,230,118,0.2); }
}
@keyframes plinko-pulse-gold {
  0%   { text-shadow: 0 0 25px rgba(255,215,0,0.6), 0 4px 10px rgba(0,0,0,1); }
  50%  { text-shadow: 0 0 40px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.3), 0 4px 10px rgba(0,0,0,1); }
  100% { text-shadow: 0 0 25px rgba(255,215,0,0.6), 0 4px 10px rgba(0,0,0,1); }
}
@keyframes plinko-pulse-red {
  0%   { box-shadow: 0 0 6px rgba(255,23,68,0.2); }
  50%  { box-shadow: 0 0 18px rgba(255,23,68,0.4), 0 0 30px rgba(255,23,68,0.15); }
  100% { box-shadow: 0 0 6px rgba(255,23,68,0.2); }
}
@keyframes plinko-glow-peg {
  0%   { box-shadow: 0 0 0 rgba(255,215,0,0); }
  30%  { box-shadow: 0 0 12px rgba(255,215,0,0.8), 0 0 24px rgba(255,215,0,0.3); }
  100% { box-shadow: 0 0 0 rgba(255,215,0,0); }
}
@keyframes plinko-bigwin-pulse {
  0%   { opacity: 0.15; }
  50%  { opacity: 0.3; }
  100% { opacity: 0.15; }
}
@keyframes plinko-slide-up {
  0%   { opacity: 0; transform: translateY(0); }
  10%  { opacity: 1; }
  70%  { opacity: 1; transform: translateY(-30px); }
  100% { opacity: 0; transform: translateY(-50px); }
}
```

---

## 11. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA bola dourada/branca/vermelha — bola SEMPRE #00E676 verde neon
2.  NUNCA pegs coloridos (azul, roxo, branco) — pegs SEMPRE #D4A843 dourado, flash #FFD700
3.  NUNCA fundo branco/cinza claro — SOMENTE #0A0A0A com bg-casino.png
4.  NUNCA Matter.js ou engine de fisica — path eh PRE-CALCULADO, animacao eh visual bezier
5.  NUNCA sans-serif em titulos — Cinzel Decorative pra titulo, Cinzel pra labels/botoes
6.  NUNCA px fixo em NADA — SEMPRE clamp(min, preferred, max)
7.  NUNCA botao interativo < 44px
8.  NUNCA box-shadow unica — SEMPRE multicamada (minimo 2 camadas)
9.  NUNCA Lucide/FontAwesome — PNGs dourados de /assets/shared/icons/ (exceto [X] close)
10. NUNCA GCoin em cor diferente de #00E676 + JetBrains Mono
11. NUNCA gradientes genericos (azul→roxo) — SOMENTE paleta Blackout (ouro, verde, vermelho, preto)
12. NUNCA particulas nao-douradas — confetti SEMPRE #FFD700/#D4A843/#F6E27A
13. NUNCA trail de bola com menos de 15 posicoes — 15 obrigatorio com alpha decrescente
14. NUNCA slots multiplicadores todos da mesma cor — 4 tiers obrigatorios (cinza/verde/dourado/vermelho)
15. NUNCA risk selector sem cor propria — Low=verde, Med=dourado, High=vermelho, inativo=cinza
```

---

## COMPARACAO — O que o V0 QUER entregar vs o que DEVE entregar

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Bola | Circulo branco ou dourado | Circulo VERDE #00E676 com radialGradient + trail 15 posicoes |
| Pegs | Circulos cinza uniformes | Circulos dourados radialGradient (#F6E27A→#D4A843→#8B6914), flash #FFD700 |
| Board | Div com background escuro | Canvas dual-layer com moldura 5-shadow + outline + risk tint overlay |
| Slots | Retangulos todos verdes | 4 tiers: cinza (loss), verde (low), dourado (high), vermelho (extreme) |
| Risk | 3 botoes cinza iguais | 3 botoes com cor propria (verde/dourado/vermelho) + glow |
| APOSTAR | Botao verde flat | Gradiente 3-stop (00E676→00C853→004D25) + pulse glow infinite |
| Result | Texto "x4" inline | Multiplicador scale bounce [0,1.6,1] + payout float-up + contagem rAF |
| Big Win | Nenhum overlay | Fullscreen blur + flash branco + titulo spring + 3 tiers |
| Fundo | #0A0A0A solido | bg-casino.png + overlay + vinheta + beam verde + linha dourada |
| Controles | Inputs nativos browser | Panel glassmorphism blur(8px) + inputs estilizados + slider custom |

---

`[REVISADO: VISUAL-REFORCE-PLINKO.md — Abril 2026 — 30L → ~310L]`
