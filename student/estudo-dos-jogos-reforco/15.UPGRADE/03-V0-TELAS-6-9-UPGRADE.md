# CONVERSA 3 — V0 GERA TELAS 6-9 — UPGRADE (#15)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/15.UPGRADE/6.PROMPT-V0-UPGRADE-PARTE-2-ADENDO-2.md`
- `student/estudo-dos-jogos/15.UPGRADE/7.CSS-COMPONENTES-UPGRADE-PARTE-2.md`

Continue UpgradeGame.tsx com Telas 6-9.

TELA 6 — LOSE: Wheel pulsa vermelho. Item do jogador: animacao "destruido" (brightness alta → fade to 0 → icone cinzas). "DESTRUIDO" em vermelho. Feedback discreto mas doloroso. Botao TENTAR NOVAMENTE.

TELA 7 — MODO GCOIN: Mesmo layout versus mas ESQUERDA = input GCoin, DIREITA = seletor multiplicador (x1.5/x2/x3/x5/x10/x25/x50). Chance recalcula por multiplicador. Wheel identico.

TELA 8 — HISTORICO: Panel slide-in. Cada row: item apostado → item alvo, chance, resultado (WIN verde/LOSE vermelho), data.

TELA 9 — PROVABLY FAIR: Modal. Seeds + hash + verificar.

AnimatePresence. Paths reais.
