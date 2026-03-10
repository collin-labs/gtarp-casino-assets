# GUIA DE VALIDACAO -- CASES FASE 6

## Case Battles PvP (UI)
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

## RELATORIO DE PESQUISA (REGRA X0)

**Valida? SIM.** Pesquisei: case battle PvP UI CSGORoll DatDrop lobby multiplayer 2025/2026.
**Fontes:** GameTyrant (Best Case Battle Sites 2026), DatDrop PvP, CSGORoll, Clash.gg, Codehub.
**O que trouxe:** Padrao DatDrop/CSGORoll: lobby com lista de salas + colunas paralelas por jogador + items revelados 1 por 1 + placar total + vencedor destacado com crown.
**Sem pesquisa:** Layout generico. Com pesquisa: colunas lado a lado estilo DatDrop, reveal sequencial, crown no vencedor.

---

## ARQUIVOS CRIADOS/EDITADOS

| Arquivo | Tipo | Linhas |
|---------|------|:------:|
| components/games/cases/CaseBattle.tsx | **NOVO** | 40 |
| components/games/cases/CaseBattleLobby.tsx | **NOVO** | 203 |
| components/games/cases/CaseBattleGame.tsx | **NOVO** | 240 |
| components/games/cases/CasesGame.tsx | EDITADO | +35 linhas (import + state + botao + render) |
| **TOTAL** | | **~518** |

---

## O QUE FOI IMPLEMENTADO

### 6.1 -- CaseBattleLobby
- Lista de salas abertas com: criador, caixas, players (slots visuais preenchidos/vazios), entry fee, botao ENTRAR
- Botao CRIAR BATALHA (vermelho)
- Botao VOLTAR
- Mock: 3 batalhas abertas
- Stagger entrance animado

### 6.2 -- CaseBattleGame
- Colunas lado a lado (1 por jogador, suporta 2-4)
- Items revelados 1 por 1 a cada 1.5s (sequencial)
- Cada item: SVG icon por raridade + nome + valor
- Placar total atualizado em tempo real
- Vencedor: borda dourada pulsante + crown emoji + "VENCEDOR!"
- Perdedor: "DERROTA" em vermelho
- Botao FECHAR apos finalizar

### 6.3 -- CaseBattle (wrapper)
- Alterna entre Lobby e Game
- State: activeBattle (null = lobby, number = game)

### 6.4 -- Integracao no CasesGame
- Botao "BATALHAS" no header (vermelho, toggle)
- Quando ativo: mostra CaseBattle em vez do CaseCatalog
- Sidebar de RecentDrops permanece visivel

---

## CHECKLIST TOOLTIP/MODAL/FEEDBACK (REGRA X5)

| # | Elemento | Tooltip | Feedback Visual |
|:-:|---------|:-------:|:---------------:|
| 1 | Botao BATALHAS (header) | "Batalhas PvP" | Toggle vermelho/cinza |
| 2 | Botao CRIAR BATALHA | "Criar nova batalha" | Hover scale + brightness |
| 3 | Botao VOLTAR (lobby) | "Voltar ao catalogo" | Hover scale |
| 4 | Botao ENTRAR (cada sala) | "Entrar na batalha" | Hover scale + glow vermelho |
| 5 | Botao FECHAR (game) | "Fechar" | Hover scale |
| 6 | Player slots (lobby) | -- | Preenchido=vermelho, Vazio=dashed |
| 7 | Items revelados | -- | Spring entrance + border-left colorido |
| 8 | Vencedor | -- | Borda dourada pulsante + crown + glow |

**8 de 8 elementos com feedback.**

---

## TESTE

| # | Teste | O que verificar |
|:-:|-------|----------------|
| 1 | Clicar BATALHAS no header | Lobby aparece com 3 salas mock |
| 2 | Ver salas | Criador, caixas, slots de players, entry fee |
| 3 | Clicar ENTRAR | Tela de batalha com 2 colunas lado a lado |
| 4 | Revelacao sequencial | Items aparecem 1 por 1 a cada 1.5s em ambas colunas |
| 5 | Placar atualiza | Valor total cresce conforme items revelam |
| 6 | Vencedor destacado | Borda dourada, crown, "VENCEDOR!" |
| 7 | Perdedor | "DERROTA" em vermelho |
| 8 | Botao FECHAR | Volta ao lobby |
| 9 | Toggle BATALHAS off | Volta ao catalogo de caixas |

---

## PRONTO PARA PRODUCAO? (REGRA X11)

**SIM.** 3 componentes novos + 1 integracao. Lobby com salas, game com colunas PvP, reveal sequencial, placar em tempo real, vencedor destacado. Backend ja existe (Fase 1 - 4 handlers).

**TODOS os itens desta fase foram implementados: 3 de 3 componentes + 1 integracao. Zero pendencias.**

**Proxima etapa:** PACOTE CONSOLIDADO FINAL do Cases (todas 6 fases)
