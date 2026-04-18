# CONVERSA 2 — V0 GERA TELAS 1-4 — ROULETTE (#5)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/5.ROULETTE/6.PROMPT-V0-ROLETA-PARTE-1.md` (Telas 1-8, foque 1-4)
- `student/estudo-dos-jogos/5.ROULETTE/7.CSS-COMPONENTES-ROLETA-PARTE-1.md`
- `student/estudo-dos-jogos/5.ROULETTE/6.PROMPT-V0-ROLETA-PARTE-2-ADENDO.md` (mock+tooltips)

Gere RouletteGame.tsx com Telas 1-4. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — MODE SELECT: 2 cards (CLASSICA vs RELAMPAGO). Classica: roleta europeia padrao. Relampago: lucky numbers com multiplicadores 50x-500x. Botao JOGAR verde por card.

TELA 2 — MESA APOSTAS: Layout completo. Roda (wheel-european.png) a esquerda/topo. Mesa de numeros (0-36) ao centro com cores vermelho/preto/verde. Outside bets (1-18/19-36, par/impar, vermelho/preto, colunas, duzias). Chip selector com 8 chips de /assets/games/roulette/chips/. Racetrack (Voisins/Orphelins/Tier) acessavel via racetrack-icon.png. Saldo + total apostado.

TELA 3 — LIGHTNING PHASE (so modo Relampago): Overlay dramatico. 1-5 numeros aleatorios recebem multiplicadores (50x-500x). Cada numero revela com delay stagger. Usar imagens de /assets/games/roulette/multipliers/. Lightning-bolt.png como efeito visual. Duracao ~3s.

TELA 4 — SPINNING: Roda gira (CSS rotate, 4-6s, ease-out). Bola (ball.png) orbita e desacelera. Numero vencedor revelado com glow e som.

Todos assets de /assets/games/roulette/ — EXISTEM (exceto 4 faltantes, usar CSS alt).
