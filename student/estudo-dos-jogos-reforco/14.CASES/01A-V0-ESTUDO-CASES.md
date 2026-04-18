# CONVERSA 1 — V0 ESTUDO — CASES / CAIXAS (#14)
# O projeto esta importado via GitHub

Voce vai criar o componente visual do Cases (abertura de caixas) para o Blackout Casino (FiveM). Sistema de loot boxes estilo CS2/CSGOEmpire — catalogo de caixas, abertura com strip animada, Fast Open, e mini Case Battle PvP. Projeto importado.

## ESTUDE ANTES DE GERAR
Leia INTEIRO do projeto:
- `student/estudo-dos-jogos/14.CASES/2.GUIA-DO-JOGO-CASES-PARTE-1.md`
- `student/estudo-dos-jogos/14.CASES/2.GUIA-DO-JOGO-CASES-PARTE-2-ADENDO.md`
- `student/estudo-dos-jogos/14.CASES/8.BIBLIOTECA-IMAGENS-CASES-PARTE-1.md`
- `student/estudo-dos-jogos/14.CASES/8.BIBLIOTECA-IMAGENS-CASES-PARTE-2.md`
- `student/estudo-dos-jogos/14.CASES/8.BIBLIOTECA-IMAGENS-CASES-PARTE-3.md`
- `student/estudo-dos-jogos/14.CASES/8.BIBLIOTECA-IMAGENS-CASES-PARTE-4.md`

Navegue e confirme que existem:
- `public/assets/games/cases/caixas/` — 18 PNGs (6 caixas × 3 estados)
- `public/assets/games/cases/backgrounds/` — 7 backgrounds
- `public/assets/games/cases/itens/arsenal/` — 8 itens
- `public/assets/games/cases/itens/garagem/` — 8 itens
- `public/assets/shared/icons/` + `public/assets/shared/ui/`

## REGRAS
1. NUNCA Tailwind — APENAS CSS inline style={{}}
2. NUNCA placeholder — usar PNGs reais das caixas e itens
3. Dark mode #0A0A0A. Cinzel/Inter/JetBrains Mono
4. clamp(), touch 44px, bilingue lang="br"|"en"
5. Export: export default function CasesGame({ onBack, lang, playerId, initialBalance })
6. Framer Motion

## PATHS
Caixas: /assets/games/cases/caixas/{N}-Caixa-{Nome}-{ESTADO}.png (FECHADA/SEMI-ABERTA/ABERTA)
Backgrounds: /assets/games/cases/backgrounds/case-bg-{nome}.png + cases-bg.png
Itens: /assets/games/cases/itens/arsenal/{N}-Itens-*.png + itens/garagem/{N}-Itens-*.png
Icons shared: icon-gcoin, icon-provably-fair, icon-history, icon-sound-on/off, icon-copy
UI: /assets/shared/ui/bg-casino.png

## CORES RARIDADE
Common #B0BEC5 | Uncommon #4FC3F7 | Rare #7C4DFF | Epic #FF4081 | Legendary #FFD700

## 11 TELAS
1. CaseCatalog — Grid de caixas disponiveis
2. CasePreview — Preview da caixa + itens possiveis + botao ABRIR
3. CaseOpening — Strip horizontal animada estilo CS:GO
4. CaseResult — Item revelado com efeitos
5. FastOpenResult — Card flip 3D rapido (sem strip)
6. CaseBattleLobby — Lista de battles + criar (mini lobby)
7. CaseBattleGame — Dual strip sincronizada
8. CaseBattleResult — Resultado final battle
9. RecentDrops — Feed lateral de drops recentes
10. ProvablyFairModal
11. HistoryModal

NAO gere codigo. Confirme que leu, assets existem, entendeu os 4 modos (Solo/Fast/Battle/Diaria).
