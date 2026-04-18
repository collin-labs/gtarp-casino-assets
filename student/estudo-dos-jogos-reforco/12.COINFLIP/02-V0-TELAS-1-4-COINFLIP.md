# CONVERSA 2 — V0 GERA TELAS 1-4 — COINFLIP (#12)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/12.COINFLIP/6.PROMPT-V0-COINFLIP-PARTE-1.md` (T1-T4)
- `student/estudo-dos-jogos/12.COINFLIP/7.CSS-COMPONENTES-COINFLIP-PARTE-1.md`
- `student/estudo-dos-jogos/12.COINFLIP/6.PROMPT-V0-COINFLIP-PARTE-3-ADENDO.md`

COLE JUNTO o arquivo VISUAL-REFORCE-COINFLIP.md.

Gere CoinflipGame.tsx com Telas 1-4. CSS inline, zero Tailwind.

TELA 1 — LOBBY: Grid de salas abertas. Cada card: moeda mini (coin-heads-mini ou coin-tails-mini), valor aposta, criador (avatar+nome), lado disponivel, botao ENTRAR. Filtros: valor min/max, status. Botao CRIAR SALA destaque dourado.

TELA 2 — CRIAR SALA: Modal. Escolher lado: 2 moedas grandes (coin-heads.png vs coin-tails.png), hover scale, click seleciona com glow. Input valor aposta. Botao CRIAR verde.

TELA 3 — ENTRAR SALA: Modal. Resumo: criador (nome+lado) vs voce (lado oposto). Valor. Botao CONFIRMAR verde + botao CANCELAR.

TELA 4 — FLIP: Layout principal. 2 colunas (Player 1 esquerda, Player 2 direita). Cada coluna: avatar + nome + lado escolhido (mini coin) + valor apostado. Centro: MOEDA 3D GRANDE girando (rotateY, perspective 800px). Countdown 3→2→1→FLIP! Moeda gira rapido e desacelera ate parar no lado vencedor.
