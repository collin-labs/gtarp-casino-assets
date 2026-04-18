# CONVERSA 2 — V0 GERA TELAS 1-3 — JACKPOT (#13)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/13.JACKPOT/6.PROMPT-V0-JACKPOT-PARTE-1.md` (T1-T3)
- `student/estudo-dos-jogos/13.JACKPOT/7.CSS-COMPONENTES-JACKPOT-PARTE-1.md`

COLE JUNTO o arquivo VISUAL-REFORCE-JACKPOT.md.

Gere JackpotGame.tsx com Telas 1-3. CSS inline, zero Tailwind.

TELA 1 — LOBBY: Centro: donut chart (conic-gradient) mostrando fatias dos jogadores. Cada fatia = cor do jogador, proporcional ao deposito. Centro do donut: pot total (GCoin grande). Moldura dourada ao redor (donut-frame-gold.png). Ponteiro dourado no topo (pointer-gold.png). Lateral: lista jogadores (avatar+nome+valor+cor+%). Input deposito + botao DEPOSITAR verde. Timer countdown (20s).

TELA 2 — SPINNING: Donut INTEIRO gira (transform rotate, Framer Motion). Ponteiro FIXO no topo. 8s de spin. Desacelera progressivamente (power3.out). Tick sonoro a cada secao. Overshoot sutil no final.

TELA 3 — RESULTADO: Ponteiro aponta pro vencedor. Fatia vencedora pulsa + glow. Avatar do vencedor no centro do donut. "VENCEDOR!" Cinzel 800. Pot ganho com countup. Confetti dourado. Demais jogadores dim.
