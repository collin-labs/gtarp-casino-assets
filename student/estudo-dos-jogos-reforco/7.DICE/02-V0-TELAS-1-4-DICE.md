# CONVERSA 2 — V0 GERA TELAS 1-4 — DICE (#7)
# O projeto esta importado — NAO precisa anexar nada

Antes de gerar, LEIA do projeto:
- `student/estudo-dos-jogos/7.DICE/6.PROMPT-V0-DICE-PARTE-1.md` (T1-T4)
- `student/estudo-dos-jogos/7.DICE/7.CSS-COMPONENTES-DICE-PARTE-1.md`
- `student/estudo-dos-jogos/7.DICE/6.PROMPT-V0-DICE-PARTE-3-ADENDO.md`

Gere DiceGame.tsx com Telas 1-4. CSS inline, zero Tailwind.

TELA 1 — IDLE: Grid de apostas (numeros 2-12 com odds). 2 dados 3D CSS (dim, estáticos). Area de aposta com chips. Bet controls (MIN/x2/÷2/MAX). Botao ROLAR DADOS verde pulsante. Saldo header.

TELA 2 — LIGHTNING: 2-5 numeros aleatorios recebem multiplicadores (2x-100x). Revelacao com stagger + flash roxo/dourado. Duracao ~2.5s.

TELA 3 — ROLLING: 2 dados giram em 3D (rotateX/Y/Z via Framer Motion spring). Stagger 0.2s entre dados. Blur de movimento nos primeiros 0.5s. Pousam na face correta com bounce. FACE_ROTATIONS conforme Doc 6.

TELA 4 — RESULT: Total (2-12) revelado em badge grande. Apostas ganhas brilham verde + scale. Perdidas dim. Lucro/perda exibido.

Dados sao CUBOS CSS 3D — 6 faces, pips dourados, perspective 800px, transform-style preserve-3d.
