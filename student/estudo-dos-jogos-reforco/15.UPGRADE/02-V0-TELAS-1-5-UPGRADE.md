# CONVERSA 2 — V0 GERA TELAS 1-5 — UPGRADE (#15)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/15.UPGRADE/6.PROMPT-V0-UPGRADE-PARTE-1.md`
- `student/estudo-dos-jogos/15.UPGRADE/6.PROMPT-V0-UPGRADE-PARTE-2-ADENDO-1.md`
- `student/estudo-dos-jogos/15.UPGRADE/7.CSS-COMPONENTES-UPGRADE-PARTE-1.md`

COLE JUNTO o arquivo VISUAL-REFORCE-UPGRADE.md.

Gere UpgradeGame.tsx com Telas 1-5. CSS inline, zero Tailwind.

TELA 1 — SELECAO: Layout versus (item apostado ESQUERDA | wheel CENTRO | item alvo DIREITA). Grid inventario scrollavel. Itens reais de /assets/games/cases/itens/.

TELA 2 — READY: Wheel SVG preview (arco verde proporcional a chance, arco vermelho o resto, porcentagem no centro). Ticker parado no topo. Botao UPGRADE verde pulsante.

TELA 3 — MODAL CONFIRMACAO: "Seu [ITEM] sera DESTRUIDO se perder. Chance: X%. Continuar?" Botoes CONFIRMAR (verde) + CANCELAR (vermelho).

TELA 4 — SPINNING: Ticker gira via rotate. 5 fases: buildup→acelera→maxima→desacelera→para.

TELA 5 — WIN: Item alvo aparece no centro wheel com glow. "UPGRADE!" Cinzel dourado. Confetti. Item apostado some (foi consumido). Botao NOVO UPGRADE.
