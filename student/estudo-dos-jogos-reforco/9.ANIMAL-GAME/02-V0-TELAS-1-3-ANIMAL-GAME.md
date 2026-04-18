# CONVERSA 2 — V0 GERA TELAS 1-3 — ANIMAL GAME (#9)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/9.ANIMAL-GAME/6.PROMPT-V0-ANIMAL-GAME-PARTE-1.md` (6 telas, foque 1-3)
- `student/estudo-dos-jogos/9.ANIMAL-GAME/7.CSS-COMPONENTES-ANIMAL-GAME-PARTE-1.md`
- `student/estudo-dos-jogos/9.ANIMAL-GAME/6.PROMPT-V0-ANIMAL-GAME-PARTE-2-ADENDO.md`

Gere AnimalGame.tsx com Telas 1-3. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — APOSTAS: Grid 5x5 com 25 cards de animais. Cada card: imagem PNG de /assets/games/bicho/{N}.png + nome + numero do grupo. Hover: scale 1.05 + borda dourada. Selecionado: borda verde + glow. Painel lateral: tipo aposta (Grupo/Dezena/Centena/Milhar) + input valor + bet controls MIN/x2/÷2/MAX + botao APOSTAR verde. Header: voltar + titulo + saldo.

TELA 2 — SORTEIO: Overlay dramatico. 5 capsulas douradas (esferas metalicas com reflexo). Revelam sequencialmente com stagger 800ms. Cada capsula: gira → abre → numero aparece (4 digitos) + animal do grupo. Som de abertura a cada capsula. Fundo escurece.

TELA 3 — VITORIA: Animal vencedor em destaque grande (scale 1.5, glow dourado, PNG do bicho). "VOCE GANHOU!" Cinzel 800. Multiplicador + lucro com countup. Confetti dourado. Botao NOVA RODADA.

Usar os 25 PNGs REAIS de /assets/games/bicho/. ZERO placeholder.
