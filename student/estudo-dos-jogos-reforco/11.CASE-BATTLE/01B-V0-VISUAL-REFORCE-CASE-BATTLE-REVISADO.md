# REFORCO VISUAL — CASE BATTLE (#11) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Carousel deceleration (motion.dev), CS:GO strip pattern, scroll performance (css-tricks)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg #0A0A0A + radial-gradient sutil
- [ ] LOBBY: cards horizontais com mini caixa PNG + player circles + valor GCoin + feixo verde base + badges modo
- [ ] LOBBY: filtros (TODOS/CLASSIC/UNDERDOG/GRATIS) com tab ativa dourada ou verde
- [ ] LOBBY: botao CRIAR BATALHA com gradient dourado metalico (#CB9B51→#D4A843→#8B6914)
- [ ] CRIAR: grid 2x3 com 6 caixas PNG FECHADA reais + background case-bg-*.png opacity 0.2
- [ ] SALA ESPERA: slots jogadores como pedestais (cheio=avatar, vazio=tracejado pulsante) + countdown
- [ ] BATALHA: colunas por jogador (1-4), cada uma com caixa animada 3 fases PNG (FECHADA→SEMI→ABERTA)
- [ ] CAROUSEL STRIP: scroll horizontal de itens com deceleration ease power3.out 5s, item central scale 1.3
- [ ] RARIDADE: 5 cores obrigatorias (Common #B0BEC5, Uncommon #4FC3F7, Rare #7C4DFF, Epic #FF4081, Legendary #FFD700+shimmer)
- [ ] RESULTADO: coluna vencedora com borda dourada espessa + "VENCEDOR!" + dim perdedores
- [ ] Score bar entre players (progress verde com valores GCoin)
- [ ] Round bar topo (ROUND X/Y + mini caixa + progress track)
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,230,118,0.02) 0%, transparent 50%)',
  display: 'flex', flexDirection: 'column',
  padding: 'clamp(8px, 1vw, 14px)', gap: 'clamp(6px, 0.8vw, 10px)',
}}
```

---

## 2. LOBBY — Cards de batalha + filtros + CRIAR

HEADER: titulo Cinzel 800 clamp(14px,1.6vw,22px) #D4A843 letterSpacing 3px textShadow `0 0 12px rgba(212,168,67,0.4), 0 2px 6px rgba(0,0,0,1)`.

Btn CRIAR BATALHA (gradient dourado metalico):
```
style={{
  background: 'linear-gradient(180deg, #CB9B51, #D4A843 30%, #8B6914)',
  border: '1px solid rgba(246,226,122,0.4)', borderRadius: 8,
  color: '#0A0A0A', fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(9px, 0.95vw, 12px)', letterSpacing: '1.5px',
  boxShadow: 'inset 0 1px 0 rgba(255,236,179,0.4), 0 2px 4px rgba(0,0,0,0.5), 0 0 16px rgba(212,168,67,0.15)',
  minHeight: 44,
}}
```

FILTROS (tabs inline):
Container: bg rgba(0,0,0,0.3), borderRadius 8, padding 3px.
Tab ATIVA: bg rgba(212,168,67,0.15), color #D4A843, borderBottom 2px solid #D4A843.
Tab GRATIS ativa: bg rgba(0,230,118,0.1), color #00E676, borderBottom 2px #00E676.
Tab INATIVA: bg transparent, color #666, Inter 600 clamp(9px,0.9vw,12px).

CARD DE BATALHA:
```
style={{
  display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1vw, 16px)',
  padding: 'clamp(8px, 1vw, 14px)', borderRadius: 10,
  position: 'relative', overflow: 'hidden', cursor: 'pointer',
  background: 'linear-gradient(180deg, #1A1A1A, #141414)',
  border: '1px solid rgba(212,168,67,0.15)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
}}
```
Hover: borderColor rgba(212,168,67,0.3), translateY(-2px).

Mini caixa no card: width/height clamp(32px,4vw,48px), objectFit contain.
Player circles: cheio radial-gradient(135deg, #D4A843, #8B6914) 2px solid rgba(212,168,67,0.5). Vazio: 2px dashed rgba(255,255,255,0.1).
Valor: JetBrains 700, #00E676, textShadow verde.
Btn ENTRAR: gradient verde (00C853→004D25), Cinzel 700 clamp(8px,0.85vw,11px).

FEIXO VERDE na base de CADA card:
```
style={{
  position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2,
  background: 'linear-gradient(90deg, transparent 0%, rgba(0,230,118,0.2) 20%, #00E676 50%, rgba(0,230,118,0.2) 80%, transparent 100%)',
  boxShadow: '0 0 6px rgba(0,230,118,0.2)',
}}
```

BADGES:
- UNDERDOG: bg rgba(255,107,0,0.12), border 1px rgba(255,107,0,0.3), color #FF6B00
- GRATIS: bg rgba(0,230,118,0.1), border 1px rgba(0,230,118,0.3), color #00E676
Cada badge: fontSize 9px, fontWeight 700, padding 2px 8px, borderRadius 4, uppercase.

---

## 3. CAIXAS — 6 caixas com 3 estados PNG cada

Assets REAIS (NAO gerar graficos CSS):
```
/assets/games/cases/caixas/1-Caixa-Arsenal-Dourado-FECHADA.png     (G$500)
/assets/games/cases/caixas/1-Caixa-Arsenal-Dourado-SEMI-ABERTA.png
/assets/games/cases/caixas/1-Caixa-Arsenal-Dourado-ABERTA.png
/assets/games/cases/caixas/2-Caixa-Garagem-VIP-FECHADA.png         (G$1.000)
/assets/games/cases/caixas/3-Caixa-Pacote-Urbano-FECHADA.png       (G$100)
/assets/games/cases/caixas/4-Caixa-Cofre-Secreto-FECHADA.png       (G$2.500)
/assets/games/cases/caixas/5-Caixa-Noturna-FECHADA.png             (G$300)
/assets/games/cases/caixas/6-Caixa-Diaria-FECHADA.png              (GRATIS)
```

Backgrounds: `/assets/games/cases/backgrounds/case-bg-{arsenal,garagem,pacote,cofre,noturna,diaria}.png`

ABERTURA 3 FASES (ANIMACAO MAIS CRITICA):
1. **SHAKE (0.5s):** PNG FECHADA treme — Framer animate{{ x:[-3,3,-2,2,0], rotateZ:[-2,2,-1,1,0] }}, repeat 3
2. **TRANSICAO (0.3s):** Troca src pra SEMI-ABERTA, scale [1.1, 1.0]. Flash branco opacity [0,0.3,0] 0.2s
3. **ABERTURA (0.4s):** Troca src pra ABERTA. 8-12 particulas douradas com velocity aleatoria + fade. Glow dourado 0.5s

Se item LEGENDARY: delay extra 0.5s, caixa inteira pulsa dourado, particulas intensas.

---

## 4. CAROUSEL STRIP — Estilo CS:GO (ELEMENTO MAIS CRITICO)

Strip horizontal de itens que scrolla rapido e desacelera ate parar no item sorteado.

CONTAINER DO STRIP:
```
style={{
  width: '100%', overflow: 'hidden', position: 'relative',
  height: 'clamp(50px, 7vw, 80px)',
  borderRadius: 8,
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(212,168,67,0.15)',
}}
```

MARCADOR CENTRAL (indicador do item vencedor):
```
style={{
  position: 'absolute', top: 0, bottom: 0, left: '50%',
  transform: 'translateX(-50%)', width: 2,
  background: '#FFD700',
  boxShadow: '0 0 8px rgba(255,215,0,0.5)',
  zIndex: 10,
}}
```
Setas douradas acima e abaixo do marcador (triangulos 6px).

STRIP DE ITENS (row horizontal, translateX animado):
Cada item: width clamp(40px,5vw,60px), height same, flexShrink 0, borderRadius 4.
Borda: 2px solid cor da raridade do item.
Imagem: thumb PNG do item, objectFit contain.

ANIMACAO DO STRIP (Framer Motion):
```
animate={{ x: finalOffset }}
transition={{
  duration: 5,
  ease: [0.15, 0.85, 0.35, 1.0],  // equivale a power3.out
}}
```
- Comeca rapido (items passam em blur visual)
- Desacelera gradualmente
- Para EXATAMENTE no item central alinhado com o marcador
- Som "tick" a cada item cruzando o centro
- Delay 0-150ms entre strips de players diferentes (pra criar tensao)

ITEM CENTRAL (VENCEDOR, apos parar):
```
style={{
  transform: 'scale(1.3)',
  border: '3px solid {corRaridade}',
  boxShadow: '0 0 15px rgba({corRaridade}, 0.5)',
  transition: 'all 0.3s ease',
}}
```
Abaixo: nome do item + valor GCoin + badge raridade.

---

## 5. CORES DE RARIDADE — 5 niveis obrigatorios

Cada raridade tem border + glow + badge background:

| Raridade | Cor | Border | Glow (boxShadow) | Badge bg |
|----------|-----|--------|-------------------|----------|
| Common | #B0BEC5 | 2px solid #B0BEC5 | 0 0 8px rgba(176,190,197,0.3) | rgba(176,190,197,0.1) |
| Uncommon | #4FC3F7 | 2px solid #4FC3F7 | 0 0 10px rgba(79,195,247,0.4) | rgba(79,195,247,0.1) |
| Rare | #7C4DFF | 2px solid #7C4DFF | 0 0 12px rgba(124,77,255,0.4) | rgba(124,77,255,0.1) |
| Epic | #FF4081 | 2px solid #FF4081 | 0 0 14px rgba(255,64,129,0.5) | rgba(255,64,129,0.1) |
| Legendary | #FFD700 | 3px solid #FFD700 | 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.2) | rgba(255,215,0,0.15) |

Legendary EXTRA: animation `shimmerSweep 2s infinite` (reflexo dourado passando), particulas extras.

---

## 6. BATALHA — Player lanes + round bar + score bar

ROUND BAR (topo):
```
style={{
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '0 clamp(8px, 1vw, 14px)', height: 'clamp(28px, 3.5vw, 38px)',
}}
```
Label "ROUND 2/3": Cinzel 700 clamp(10px,1.1vw,14px) #D4A843.
Progress track: flex 1, height 6, bg #1A1A1A, borderRadius 3, border 1px rgba(212,168,67,0.08).
Progress fill: gradient `linear-gradient(90deg, #004D25, #00E676)`, boxShadow `0 0 8px rgba(0,230,118,0.3)`.

PLAYER LANES: grid `repeat(N, 1fr)` com separadores 1px entre colunas.
Cada lane: flex column, gap clamp(4px,0.5vw,6px), padding clamp(4px,0.5vw,8px).

Lane header: username Cinzel 700 clamp(10px,1.2vw,14px), total JetBrains 700 #00E676.
VS SEPARATOR: 1px solid rgba(212,168,67,0.1), position relative, "VS" badge center Cinzel 800 #D4A843.

SCORE BAR (bottom):
```
style={{
  display: 'flex', alignItems: 'center',
  height: 'clamp(24px, 3vw, 32px)',
  background: 'rgba(0,0,0,0.4)', borderRadius: 6,
  overflow: 'hidden',
}}
```
Cada player: width proportional ao valor acumulado. Cor: player1 #00E676, player2 #FF4081.
Valores em JetBrains Mono nas extremidades.

---

## 7. RESULTADO — Vencedor celebrado

Coluna VENCEDORA:
```
style={{
  border: '2px solid #FFD700',
  boxShadow: '0 0 20px rgba(255,215,0,0.3), inset 0 0 30px rgba(255,215,0,0.05)',
  background: 'rgba(255,215,0,0.03)',
}}
```
"VENCEDOR!": Cinzel 800 clamp(14px,1.8vw,20px) #FFD700 textShadow 2 camadas.

Coluna PERDEDORA: opacity 0.5, filter brightness(0.7).
Confetti dourado sobre coluna vencedora: 80 spans DOM, animation `confettiFall`.
Itens listados: thumb + nome + valor + badge raridade. Total: JetBrains 900 clamp(16px,2vw,24px).
Diferenca: "+G$X" em #00E676 bold.

---

## 8. KEYFRAMES OBRIGATORIOS (10 dos 20+)

```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes circlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.4); }
  50% { box-shadow: 0 0 0 6px rgba(212,168,67,0); }
}
@keyframes vsGlow {
  0%, 100% { text-shadow: 0 0 8px rgba(212,168,67,0.3); }
  50% { text-shadow: 0 0 16px rgba(212,168,67,0.6); }
}
@keyframes itemPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes pulseGold {
  0%, 100% { box-shadow: 0 0 10px rgba(212,168,67,0.2); }
  50% { box-shadow: 0 0 20px rgba(212,168,67,0.5); }
}
@keyframes bigWin {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes shimmerSweep {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}
@keyframes pulseWaiting {
  0%, 100% { border-color: rgba(255,255,255,0.1); }
  50% { border-color: rgba(212,168,67,0.3); }
}
@keyframes flashGreen {
  0% { background: rgba(0,230,118,0.3); }
  100% { background: transparent; }
}
@keyframes flashRed {
  0% { background: rgba(255,68,68,0.3); }
  100% { background: transparent; }
}
```

---

## 9. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA fundo branco ou cinza claro — #0A0A0A obrigatorio
2.  NUNCA SVG para caixas — usar PNGs REAIS (FECHADA/SEMI/ABERTA)
3.  NUNCA pular as 3 fases da abertura — SHAKE→SEMI→ABERTA obrigatorio
4.  NUNCA carousel sem deceleration — ease [0.15,0.85,0.35,1.0] 5s, NAO linear
5.  NUNCA itens sem cor de raridade — 5 cores obrigatorias (Common→Legendary)
6.  NUNCA legendary sem shimmer — animation shimmerSweep + particulas extras
7.  NUNCA cards sem feixo verde na base — OBRIGATORIO em todo card interativo
8.  NUNCA player circles como quadrados — borderRadius 50% SEMPRE
9.  NUNCA valores monetarios sem JetBrains Mono + #00E676
10. NUNCA botoes sem tooltip bilingue
11. NUNCA fontes < 9px, NUNCA touch target < 44px
12. NUNCA px fixo — SEMPRE clamp()
13. NUNCA sans-serif em titulos — Cinzel
14. NUNCA sombras simples — SEMPRE multi-layer
15. NUNCA ease generico — usar cubic-bezier especifico
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Lobby card | Div com texto | Card horizontal com gradient + feixo verde + player circles + badges modo |
| Btn CRIAR | Botao verde generico | Gradient dourado metalico (#CB9B51→#D4A843→#8B6914) com inset glow |
| Caixa abertura | Imagem troca instantanea | 3 fases: SHAKE 0.5s → SEMI-ABERTA 0.3s + flash → ABERTA 0.4s + particulas |
| Carousel | Items aparecem de uma vez | Strip horizontal 5s deceleration ease power3.out, item central scale 1.3 + glow |
| Raridade | Todas mesma cor | 5 cores distintas com border + glow + badge (Common cinza → Legendary dourado+shimmer) |
| Resultado | Texto "GANHOU" | Coluna vencedora borda dourada + "VENCEDOR!" + dim perdedor + confetti |
| Score bar | Ausente | Progress bar proporcional verde/rosa entre players com valores GCoin |
| Filtros | Botoes cinza | Tabs inline com ativa dourada/verde, UNDERDOG laranja, GRATIS verde |
| Slots espera | Circulos estaticos | Pedestais com avatar (cheio) ou tracejado pulsante (vazio) + countdown cor dinamica |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-CASE-BATTLE-REVISADO.md — Abril 2026 — 76L → ~330L]`
`[X0: 3 rodadas, carousel deceleration (motion.dev), CS:GO strip (css-tricks scroll-driven), performance (chrome blog)]`
