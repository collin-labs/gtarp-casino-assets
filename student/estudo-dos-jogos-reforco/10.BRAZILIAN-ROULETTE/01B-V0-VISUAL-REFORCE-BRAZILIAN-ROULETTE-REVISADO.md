# REFORCO VISUAL — BRAZILIAN ROULETTE / ROLETA BRASILEIRA (#10) — REVISADO
# Colar no V0 JUNTO com o prompt de telas (ANTES de gerar)
# Este arquivo tem PRECEDENCIA sobre descricoes vagas do Prompt V0
# X0: Lightning flash technique (kellylougheed/medium), Canvas 2D wheel (dev.to)

---

## CHECKPOINT OBRIGATORIO — V0, LEIA ANTES DE GERAR

Se o componente nao tiver TODOS estes elementos, esta ERRADO:
- [ ] Container com bg-casino.png + vinheta
- [ ] Header: VOLTAR + titulo "ROLETA BRASILEIRA" Cinzel 700 + icones PNG dourados + saldo #00E676
- [ ] Tela 1 MODE SELECT: 3 cards premium (Relampago + Classica + Mini) com feixo verde na base
- [ ] Roda: Canvas 2D nativo (NAO PNG, NAO SVG), requestAnimationFrame, trigonometria pra bola
- [ ] Bola: posicao via cos/sin no raio interno da roda, trail com opacity decrescente
- [ ] Mesa de apostas: grid CSS 3x12 + zero + outside bets, celulas vermelho/preto/verde
- [ ] 5 chips CSS (100 azul / 500 verde / 1K vermelho / 5K roxo / 10K dourado)
- [ ] Lightning Phase: flash branco 100ms + numeros iluminados + badges multiplicador + dimmed grid
- [ ] Spinning: mesa travada (opacity 0.6, pointer none) + banner "APOSTAS ENCERRADAS" + timer countdown
- [ ] Resultado: circulo grande com cor do numero + painel resultado + historico inline
- [ ] BigWin overlay (mult >= 100x): titulo gradiente dourado WebkitBackgroundClip text + countup
- [ ] History overlay: slide-in direita + filtros + estatisticas (cores%, quentes, frios)
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
}}
```

Header: borderBottom 1px rgba(212,168,67,0.1).
Titulo: Cinzel 700, clamp(14px,2vw,22px), #D4A843, textShadow `0 0 12px rgba(255,215,0,0.5), 0 2px 6px rgba(0,0,0,1)`.
Saldo: JetBrains Mono 700, #00E676, textShadow verde.
Icones: PNGs dourados de /assets/br-roulette/icons/, clamp(20px,2.5vw,28px), opacity 0.7, minWidth/Height 44px.

---

## 2. MODE SELECT — 3 Cards premium (NAO 3 botoes flat)

3 cards em row, cada um um convite de modo. DIFERENCA VISUAL entre modos:

CARD BASE (todos):
```
style={{
  background: 'rgba(5,5,5,0.95)',
  border: '1.5px solid rgba(212,168,67,0.3)',
  borderRadius: 'clamp(12px, 1.5vw, 18px)',
  padding: 'clamp(16px, 2vw, 28px)',
  cursor: 'pointer', position: 'relative', overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,215,0,0.08), inset 0 0 15px rgba(0,0,0,0.4), 0 -1px 8px rgba(0,230,118,0.08)',
}}
```
Framer: whileHover={{ y:-6, scale:1.03, borderColor:'rgba(212,168,67,0.7)' }}, whileTap{{ scale:0.97 }}.

FEIXO VERDE NA BASE de cada card (obrigatorio):
```
position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
background: 'linear-gradient(90deg, transparent 5%, rgba(0,230,118,0.3) 20%, #00E676 50%, rgba(0,230,118,0.3) 80%, transparent 95%)',
boxShadow: '0 0 8px rgba(0,230,118,0.3), 0 0 15px rgba(0,230,118,0.15)',
```

Card RELAMPAGO: imagem mode-lightning.png, tint eletrico sutil, badge "ATE 500x".
Card CLASSICA: imagem mode-classic.png, tom classico elegante.
Card MINI: imagem mode-mini.png, tom rapido e compacto, badge "RAPIDO".

Nome modo: Cinzel 800, clamp(13px,1.8vw,20px), #D4A843, textShadow `0 0 10px rgba(255,215,0,0.4)`.

---

## 3. RODA — Canvas 2D nativo (NAO PNG como Roulette #5)

ATENCAO: BR Roulette usa Canvas 2D com requestAnimationFrame, NAO imagem PNG rotacionada.

Canvas container: width clamp(280px,35vw,420px), aspectRatio 1, borderRadius 50%.
Moldura ao redor (div wrapper): border 4px solid rgba(212,168,67,0.5), borderRadius 50%, boxShadow `0 0 30px rgba(212,168,67,0.2), inset 0 0 20px rgba(0,0,0,0.3)`.

Canvas desenha: 37 setores (europeu), cores vermelho #D32F2F / preto #1A1A1A / verde #00C853.
Numeros desenhados com fillText branco, rotacionados conforme angulo do setor.

BOLA: posicao via trigonometria (cos/sin * raio), trail com 8 posicoes opacity decrescente (0.5→0.05), circulo branco com sombra.

Spin: Framer Motion ou rAF com easing deceleration cubic-bezier. Duracao ~4-6s.

Idle: micro-oscilacao rotate [0,2,-2,0] 6s infinite.

---

## 4. MESA DE APOSTAS — Grid CSS felt verde

```
style={{
  display: 'grid',
  gridTemplateColumns: 'clamp(30px, 4vw, 42px) repeat(12, 1fr)',
  gap: 1,
  background: 'rgba(0,0,0,0.3)',
  border: '1.5px solid rgba(212,168,67,0.25)',
  borderRadius: 'clamp(8px, 1vw, 12px)',
  overflow: 'hidden',
}}
```

CELULA NUMERO:
```
style={{
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
  fontSize: 'clamp(10px, 1.3vw, 15px)', color: '#FFFFFF',
  minHeight: 44, cursor: 'pointer', position: 'relative',
  transition: 'all 0.15s ease',
}}
```
Cores: vermelho bg #D32F2F, preto bg #1A1A1A, zero bg #00C853.
Hover: brighten 20%, boxShadow `0 0 8px rgba(255,215,0,0.3)`.
Com chip: mini chip empilhado no canto com valor.

Outside bets (1-18/19-36, Par/Impar, Verm/Pret, Duzias, Colunas): Cinzel 700, clamp(9px,1.1vw,13px), #D4A843.

MESA TRAVADA (durante spin):
```
opacity: 0.6, pointerEvents: 'none', filter: 'brightness(0.7)',
transition: 'opacity 0.4s ease, filter 0.4s ease',
```
Banner "APOSTAS ENCERRADAS": Cinzel 900, clamp(16px,2.5vw,28px), #FFD700, textShadow 3 camadas, spring entrance.

---

## 5. CHIPS — 5 valores CSS

5 chips circulares, gap clamp(4px,0.5vw,8px):
```
style base={{
  width: 'clamp(36px, 5vw, 52px)', height: same,
  borderRadius: '50%', fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 700, fontSize: 'clamp(8px, 1vw, 12px)', color: '#FFFFFF',
  cursor: 'pointer', minWidth: 44, minHeight: 44,
  border: '2px solid rgba(255,255,255,0.3)',
  boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
}}
```
- **100 Azul**: radial-gradient(circle at 35% 35%, #448AFF, #1565C0, #0D47A1)
- **500 Verde**: radial-gradient(circle at 35% 35%, #66BB6A, #388E3C, #1B5E20)
- **1K Vermelho**: radial-gradient(circle at 35% 35%, #EF5350, #D32F2F, #B71C1C)
- **5K Roxo**: radial-gradient(circle at 35% 35%, #AB47BC, #7B1FA2, #4A148C)
- **10K Dourado**: radial-gradient(circle at 35% 35%, #FFD700, #D4A843, #8B6914)

Selecionado: border 2px solid #FFD700, boxShadow `0 0 12px rgba(255,215,0,0.4)`.

---

## 6. LIGHTNING PHASE — Dramatica e eletrica

FLASH BRANCO INICIAL (100ms):
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: [0, 1, 0] }}
  transition={{ duration: 0.3, times: [0, 0.3, 1] }}
  style={{
    position: 'absolute', inset: 0, zIndex: 40,
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    pointerEvents: 'none',
  }}
/>
```

NUMEROS ILUMINADOS (celulas com multiplicador):
```
background: 'rgba(255,215,0,0.15)',
border: '1.5px solid rgba(255,215,0,0.6)',
boxShadow: '0 0 15px rgba(255,215,0,0.4), inset 0 0 10px rgba(255,215,0,0.1)',
animation: 'lightningPulse 1.5s ease-in-out infinite',
```

BADGE MULTIPLICADOR (flutuante sobre o numero):
```
style={{
  position: 'absolute', top: 'clamp(-12px, -1.5vw, -18px)', right: 'clamp(-4px, -0.5vw, -8px)',
  fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(10px, 1.3vw, 16px)', color: '#FFD700',
  textShadow: '0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.4)',
  background: 'rgba(0,0,0,0.8)',
  padding: 'clamp(2px,0.3vw,4px) clamp(4px,0.6vw,8px)',
  borderRadius: 4, border: '1px solid rgba(255,215,0,0.4)',
}}
```
Framer: stagger 0.15s, initial{{ scale:0, y:10 }}, animate{{ scale:1, y:0 }}, spring stiffness 400.

Numeros NAO iluminados: opacity 0.35, filter brightness(0.5), transition 0.4s.
Texto "NUMEROS RELAMPAGO!": Cinzel 900, clamp(16px,2.5vw,28px), #FFD700, textShadow 3 camadas.

---

## 7. RESULTADO — Circulo grande + painel

CIRCULO NUMERO VENCEDOR:
```
style={{
  width: 'clamp(60px, 8vw, 100px)', height: same,
  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(24px, 3.5vw, 42px)', color: '#FFFFFF',
  border: '2px solid rgba(255,215,0,0.6)',
  // background: cor dinamica (vermelho/preto/verde)
  // boxShadow: glow da cor + inset shadow
}}
```
Framer: initial{{ scale:0, rotateZ:-180 }}, animate{{ scale:1, rotateZ:0 }}, spring.

Painel resultado: bg rgba(10,10,10,0.95), border rgba(212,168,67,0.4), borderRadius 16, backdropFilter blur(8px).
Ganho: JetBrains 700, clamp(18px,2.5vw,32px), #00E676, textShadow verde.
Perda: Inter 500, clamp(14px,1.8vw,20px), rgba(255,255,255,0.5).

Historico inline: flex row, circulos clamp(24px,3vw,32px) com cor do numero, ultimo com border #D4A843 scale 1.3.

---

## 8. BIGWIN OVERLAY — Multiplicador >= 100x

```
style={{
  position: 'absolute', inset: 0, zIndex: 50,
  background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
}}
```

Multiplicador: Cinzel 900, clamp(40px,6vw,80px), #FFD700, textShadow 3 camadas.
Framer: initial{{ scale:0, rotateZ:-45 }}, animate{{ scale:[0,1.3,1], rotateZ:[-45,10,0] }}, duration 0.8s.

Titulo "MEGA WIN!":
```
style={{
  fontFamily: "'Cinzel', serif", fontWeight: 900,
  fontSize: 'clamp(32px, 5vw, 64px)', textTransform: 'uppercase',
  letterSpacing: 6,
  background: 'linear-gradient(180deg, #F6F2C0 0%, #FFD700 30%, #D4A843 60%, #8B6914 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,1))',
}}
```

Valor countup: JetBrains 700, clamp(28px,4vw,56px), #00E676, textShadow 3 camadas, rolling 3-4s.
Particulas douradas intensas. Botoes delay apos countup.

---

## 9. HISTORY OVERLAY — Slide-in da direita

Framer: initial{{ opacity:0, x:'100%' }}, animate{{ opacity:1, x:0 }}, exit{{ x:'100%' }}, spring stiffness 300 damping 30.

Filtros: [TODAS][GANHAS][PERDIDAS][MULTIPLICADAS], minHeight 44, ativo borderColor rgba(212,168,67,0.7) color #FFD700.
Linhas com stagger 0.04s. Payout positivo #00E676, negativo rgba(255,255,255,0.5).

Estatisticas: barra horizontal com 3 spans (VERM%, PRETO%, VERDE%), numeros quentes/frios com badges.

---

## 10. MODO MINI — 15 casas (exclusivo BR Roulette)

Mini-roda com 15 casas coloridas (vermelho/preto/branco). Layout mais compacto.
Apostas simplificadas: cor (vermelho/preto/branco) + numero especifico.
Rodada rapida ~3s. Visual mais clean, menos elementos.
Roda menor: clamp(150px,20vw,250px).

---

## 11. O QUE NAO FAZER (PROIBIDO — 15 regras)

```
1.  NUNCA roleta americana (00 double zero) — SEMPRE europeia single zero 37 casas
2.  NUNCA fundo claro — #0A0A0A com bg-casino.png
3.  NUNCA Canvas para UI — Canvas SOMENTE para roda. Modais/overlays = DOM + Framer
4.  NUNCA resultado calculado no client — server-authoritative via fetchNui
5.  NUNCA icones Lucide para identidade visual — PNGs dourados (X21). Lucide so pra [X]
6.  NUNCA cores fora da paleta — hex da paleta base
7.  NUNCA fontes fora do trio — Cinzel/Inter/JetBrains Mono
8.  NUNCA elementos sem clamp() — zero px fixo
9.  NUNCA touch target < 44px
10. NUNCA texto em 1 idioma — toda string via { br, en }
11. NUNCA modal sem backdrop-filter blur
12. NUNCA celula grid sem hover
13. NUNCA roda > 420px fixo — clamp(280px, 35vw, 420px)
14. NUNCA backdrop-filter no betting grid — so em modais (CEF flickering)
15. NUNCA lightning sem flash branco inicial — opacity [0,1,0] 300ms OBRIGATORIO
```

---

## COMPARACAO — V0 FLAT vs CORRETO

| Elemento | V0 FLAT (ERRADO) | CORRETO |
|----------|-------------------|---------|
| Mode Select | 3 botoes flat | 3 cards premium com feixo verde, shadow 5-camada, hover y-6 |
| Roda | Circulo CSS ou PNG | Canvas 2D nativo com rAF, 37 setores desenhados, bola trigonometria |
| Lightning | Numeros com borda amarela | Flash branco fullscreen + badges multiplicador spring stagger + grid dimmed |
| Mesa | Divs coloridas | Grid CSS 3x12 + outside bets + celulas vermelho/preto/verde + hover glow |
| Chips | Circulos flat | 5 radial-gradient (azul/verde/vermelho/roxo/dourado) com highlight 35% 35% |
| Resultado | Texto inline | Circulo grande spring + painel glassmorphism + historico inline circles |
| BigWin | Texto "GANHOU" | Overlay blur 12px + titulo gradiente WebkitBackgroundClip text + countup 3-4s |
| History | Lista simples | Slide-in direita + filtros + estatisticas (cores%, quentes, frios) |
| Mini | Ausente | Roda 15 casas compacta, apostas simplificadas, rodada rapida 3s |
| Spinning | Roda gira e pronto | Mesa travada opacity 0.6 + banner spring + timer countdown com cor urgente |

---

`[REVISADO: 01B-V0-VISUAL-REFORCE-BRAZILIAN-ROULETTE-REVISADO.md — Abril 2026 — 56L → ~310L]`
`[X0: 3 rodadas, lightning flash (medium kellylougheed), Canvas 2D wheel (dev.to), metallic sphere (arc.id.au)]`
