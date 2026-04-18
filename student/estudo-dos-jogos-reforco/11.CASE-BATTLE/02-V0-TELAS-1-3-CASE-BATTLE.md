# CONVERSA 2 — V0 GERA TELAS 1-3 — CASE BATTLE (#11)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/11.CASE-BATTLE/6.PROMPT-V0-CASE-BATLE-PART-1.md` (T1-T3)
- `student/estudo-dos-jogos/11.CASE-BATTLE/7.CSS-COMPONENTES-CASE-BATTLE-PARTE-1.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/6.PROMPT-V0-CASE-BATLE-PART-3-ADENDO.md`
- `student/estudo-dos-jogos/11.CASE-BATTLE/6.PROMPT-V0-CASE-BATTLE-PARTE-4-ADENDO.md`

COLE JUNTO o arquivo VISUAL-REFORCE-CASE-BATTLE.md.

Gere CaseBattleGame.tsx com Telas 1-3. CSS inline, zero Tailwind, zero placeholder.

TELA 1 — LOBBY: Lista de batalhas abertas. Cada row: caixa (PNG FECHADA thumb), modo (1v1/2v2), valor, slots preenchidos, botao ENTRAR. Filtros: tipo caixa, modo, valor. Botao CRIAR BATALHA destaque dourado. Batalhas ativas no topo.

TELA 2 — CRIAR BATALHA: Selecionar caixa — grid 2x3 com as 6 caixas (FECHADA PNGs reais). Caixa selecionada: borda dourada + glow + preview itens possiveis (carousel mini). Config: modo (1v1/2v2/3v3/4v4), rounds (1/3/5), valor entrada. Botao CRIAR verde.

TELA 3 — SALA ESPERA: Slots de jogadores (1-8 conforme modo). Avatar + nome de quem entrou. Slots vazios pulsam dourado "Aguardando...". Countdown 60s quando room esta cheia. Caixa selecionada grande ao centro. Chat mini lateral.

USAR PNGs REAIS de /assets/games/cases/caixas/ e /assets/games/cases/backgrounds/.
