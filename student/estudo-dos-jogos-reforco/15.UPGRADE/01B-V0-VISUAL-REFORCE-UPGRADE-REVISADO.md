# REFORCO VISUAL — UPGRADE (#15) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: SVG pathLength="100" para dasharray % (logrocket, noelcserepy), motion.line rotate (motion.dev, svgai.org), SSR flicker fix (noelcserepy)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Layout 3 zonas: ITEM JOGADOR | WHEEL SVG | ITEM ALVO
- [ ] WHEEL: SVG viewBox 200x200, 2 circulos (verde #00E676 + vermelho #FF1744), pathLength="100"
- [ ] TICKER: motion.line dourada que GIRA via animate={{ rotate: anguloFinal }}
- [ ] SPIN: UMA transicao — duration 3.5s, ease [0.12, 0.8, 0.3, 1] (NAO 5 fases!)
- [ ] Slot vazio: dashed 2px dourado + "SELECIONAR ITEM"
- [ ] Item cards: borda COR DA RARIDADE (Common #4B69FF → Legendary #FFD700)
- [ ] Modo ITEM + Modo GCOIN (tabs alternando)
- [ ] Resultado WIN: overlay + item target spring + "UPGRADE!" gold + confetti
- [ ] Resultado LOSE: shake + grayscale + "DESTRUIDO" vermelho + SEM confetti
- [ ] 8 telas: Selecting, Ready, Spinning, Win, Lose, GCoin, History, PF
→ Se faltou 1 item: PARE e releia este bloco.

---

## 1. CONTAINER + LAYOUT

```
style={{
  position: 'absolute', inset: 0, zIndex: 60, borderRadius: 'inherit', overflow: 'hidden',
  backgroundColor: '#0A0A0A',
  backgroundImage: "url('/assets/shared/ui/bg-casino.png'), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.03) 0%, transparent 70%)",
  backgroundSize: 'cover, 100% 100%',
  boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
}}
```

Tabs ITEM/GCOIN: ativa bg rgba(212,168,67,0.1), border rgba(212,168,67,0.3), borderBottom 2px #D4A843, Cinzel 700 #D4A843. Inativa: bg rgba(0,0,0,0.3), color #666.

---

## 2. WHEEL SVG — Elemento central

```jsx
<svg viewBox="0 0 200 200" style={{ width: 'clamp(180px,25vw,320px)' }}>
  {/* Verde (chance %) */}
  <circle cx="100" cy="100" r="88" fill="none"
    stroke="#00E676" strokeWidth="24"
    pathLength="100"
    strokeDasharray={`${chance} ${100 - chance}`}
    strokeDashoffset="25"
    transform="rotate(-90 100 100)" />
  {/* Vermelho (resto %) */}
  <circle cx="100" cy="100" r="88" fill="none"
    stroke="#FF1744" strokeWidth="24"
    pathLength="100"
    strokeDasharray={`${100 - chance} ${chance}`}
    strokeDashoffset={`${25 - chance}`}
    transform="rotate(-90 100 100)" />
  {/* Ticker dourado */}
  <motion.line x1="100" y1="100" x2="100" y2="16"
    stroke="#FFD700" strokeWidth="3" strokeLinecap="round"
    style={{ transformOrigin: '100px 100px', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' }}
    animate={{ rotate: isSpinning ? anguloFinal : 0 }}
    transition={{ duration: 3.5, ease: [0.12, 0.8, 0.3, 1] }} />
</svg>
```
anguloFinal = 1440 + (resultado * 3.6) — 4 voltas + posicao final.
Centro: "11.5%" JetBrains 700 clamp(18px,3vw,36px) #00E676.
Abaixo: "x3.2" #D4A843 multiplicador.

---

## 3. SLOTS ITEM (esquerda + direita)

SLOT VAZIO:
```
style={{
  background: 'rgba(255,255,255,0.03)',
  border: '2px dashed rgba(212,168,67,0.2)', borderRadius: 12,
  width: 'clamp(140px,20vw,220px)', aspectRatio: '1',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}}
```

ITEM CARDS no grid (5 raridades):
- Common: border `1.5px solid rgba(75,105,255,0.5)` badge bg rgba(75,105,255,0.15) color #4B69FF
- Uncommon: border rgba(136,71,255,0.5), color #8847FF
- Rare: border rgba(211,44,230,0.5), color #D32CE6
- Epic: border rgba(235,75,75,0.5), color #EB4B4B
- Legendary: border rgba(255,215,0,0.5), color #FFD700
- Selecionado: border #00E676, animation `itemSelectedPulse 1.5s infinite`

Grid: `repeat(auto-fill, minmax(clamp(80px,12vw,140px),1fr))`, gap clamp(6px,0.8vw,10px).

---

## 4. BARRA RISCO + BOTAO UPGRADE

BARRA:
```
style={{
  width: 'clamp(200px,40vw,400px)', height: 8, borderRadius: 4,
  display: 'flex', overflow: 'hidden',
}}
// Verde: flexBasis {chance}%, bg linear-gradient(90deg, #00E676, #00C853)
// Vermelho: flexBasis {100-chance}%, bg linear-gradient(90deg, #FF1744, #D32F2F)
```

BTN UPGRADE ATIVO:
```
style={{
  background: 'linear-gradient(180deg, #00C853, #004D25)',
  border: '1.5px solid rgba(0,230,118,0.3)', borderRadius: 10,
  color: '#FFFFFF', fontFamily: "'Cinzel', serif", fontWeight: 700,
  fontSize: 'clamp(12px,1.6vw,18px)', textTransform: 'uppercase', letterSpacing: 2,
  boxShadow: '0 4px 16px rgba(0,200,83,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
  minHeight: 48,
}}
```
Desabilitado: bg #1A1A1A, border rgba(255,255,255,0.08), color #666, opacity 0.5.

---

## 5. RESULTADO — Win vs Lose

**WIN:** overlay bg rgba(0,0,0,0.65) backdropFilter blur(4px). Item target spring scale [0,1.15,1] + drop-shadow verde. "UPGRADE!" Cinzel 900 #FFD700 animation victoryPulse 2s infinite. Counter JetBrains #00E676. GoldParticles 30 pool.

**LOSE:** overlay bg rgba(0,0,0,0.7) SEM blur. Item fadeout opacity→0 scale→0.5 grayscale. Wheel shake x [-4,4,-3,3,-1,1,0]. "DESTRUIDO" Cinzel 700 #FF1744. SEM confetti.

---

## 6. KEYFRAMES (5)

```css
@keyframes itemSelectedPulse {
  0%, 100% { border-color: rgba(0,230,118,0.4); }
  50% { border-color: rgba(0,230,118,0.8); }
}
@keyframes waitPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
@keyframes victoryPulse {
  0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.2), 0 2px 6px rgba(0,0,0,1); }
  50% { text-shadow: 0 0 30px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.3), 0 2px 6px rgba(0,0,0,1); }
}
@keyframes balanceWinFlash {
  0%, 100% { color: #00E676; text-shadow: 0 0 10px rgba(0,230,118,0.5); }
  25% { color: #FFFFFF; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
}
@keyframes balanceLoseFlash {
  0%, 100% { color: #00E676; }
  50% { color: rgba(255,59,59,0.8); }
}
```

---

## 7. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA spin em 5 fases — eh UMA transicao 3.5s ease [0.12,0.8,0.3,1]
2.  NUNCA Canvas para wheel — SVG inline com pathLength="100"
3.  NUNCA animar stroke-dasharray em loop — setar 1 vez, girar o TICKER
4.  NUNCA cores raridade Case Battle (#B0BEC5) — usar #4B69FF/#8847FF/#D32CE6/#EB4B4B/#FFD700
5.  NUNCA vermelho #FF4444 — usar #FF1744
6.  NUNCA near-miss customizado — a ease curve ja cria tensao natural
7.  NUNCA resultado LOSE com confetti ou particulas — discreto e sobrio
8.  NUNCA resultado WIN sem confetti + GoldParticles
9.  NUNCA fundo claro — #0A0A0A
10. NUNCA sans-serif em titulos — Cinzel
11. NUNCA px fixo — SEMPRE clamp()
12. NUNCA botao < 44px
13. NUNCA GCoin diferente de #00E676
14. NUNCA Lucide para icones — PNGs dourados (X21)
15. NUNCA backdrop-filter no resultado LOSE — somente no WIN
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Wheel | Circulo CSS flat | SVG viewBox 200x200, 2 circulos pathLength="100", ticker motion.line |
| Spin | 5 fases complexas | UMA transicao: duration 3.5s ease [0.12,0.8,0.3,1] |
| Cores raridade | #B0BEC5 Case Battle | #4B69FF Cases/Upgrade palette |
| Vermelho | #FF4444 | #FF1744 |
| Resultado WIN | Texto simples | Overlay blur + item spring + "UPGRADE!" victoryPulse + confetti 30 pool |
| Resultado LOSE | Generico | Shake + grayscale + "DESTRUIDO" vermelho + SEM confetti + SEM blur |
| Item cards | Borda fixa | Borda COR DA RARIDADE + itemSelectedPulse quando selecionado |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-UPGRADE-REVISADO.md — Abril 2026 — 116L → ~270L]`
`[X0: 3 rodadas, 15+ refs — SVG (noelcserepy pathLength, logrocket circular progress, svgai.org encyclopedia, motion.dev SVG animation, medium gusso, motiontricks dasharray, egghead SVG paths, observablehq dasharray, dev.to nahas SVG icons), Framer (motion.dev components, framer.com motion), previous (freefrontend cards, motion.dev animate-presence/layout)]`
