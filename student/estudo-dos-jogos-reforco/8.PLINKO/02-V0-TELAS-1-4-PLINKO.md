# CONVERSA 2 — V0 GERA TELAS 1-4 — PLINKO (#8)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/8.PLINKO/6.PROMPT-V0-PLINKO.md` (todas 7 telas, foque 1-4)
- `student/estudo-dos-jogos/8.PLINKO/7.CSS-COMPONENTES-PLINKO-PARTE-1.md`

Gere PlinkoGame.tsx com Telas 1-4. CSS inline, zero Tailwind.

TELA 1 — IDLE: Board triangular de pegs (8/12/16 rows). Cada peg: circulo 8px dourado #D4A843. Slots multiplicadores na base: divs coloridos (verde→vermelho). Painel lateral: input aposta + seletor rows (8/12/16) + seletor risco (Low/Medium/High) + botao DROP verde. Header: voltar + titulo + saldo.

TELA 2 — BALL DROPPING: Bola (circulo 12px #FFD700 com glow) cai do topo central. A cada peg: bounce aleatorio esquerda/direita. Pegs atingidos: flash brilhante momentaneo. Trail sutil atras da bola (ultimos 5 pontos com opacity decrescente).

TELA 3 — RESULT: Bola pousa no slot. Slot atingido: scale 1.3 + glow da cor + pulse. Multiplicador exibido em badge grande. Payout: "+X GC" com countup. Botao DROP AGAIN.

TELA 4 — BIG WIN: Multiplicador >= 50x. Overlay fullscreen. Valor gigante Cinzel dourado shimmer. Confetti. Countup dramatico.

Board eh CSS/Canvas. Pegs e bola sao elementos visuais, NAO imagens.
