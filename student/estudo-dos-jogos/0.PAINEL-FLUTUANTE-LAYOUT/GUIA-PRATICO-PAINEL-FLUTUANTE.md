# COMO USAR O ESTUDO DO PAINEL FLUTUANTE
## Guia prático — seu painel JÁ existe, os docs completam ele
## 28/03/2026

---

# SITUACAO: Painel funciona mas falta coisa

Seu painel tem: HeroCarousel, GameCard, DockBar, GoldParticles, 5 abas, hover effects.
Falta: DepositModal, ComingSoon, CasinoContext, backend FiveM, 14 icons, sons, tooltips.

---

# DOCS QUE VOCE PRECISA (3 de 10)

| Doc | Pra que | Quando |
|:---:|---------|--------|
| **5 ROTEIRO** | ★ PRINCIPAL — 7 fases dizendo O QUE MUDAR no codigo existente | AGORA |
| **7 CSS** | Copiar CSS de componentes novos (DepositModal, ComingSoon) | Quando estilizar |
| **8 BIBLIOTECA** | Referencia das 14 imagens (voce ja baixou, so conferir paths) | Quando integrar imagens |

# DOCS QUE VOCE NAO PRECISA

| Doc | Por que nao precisa |
|:---:|-------------------|
| 0 Pesquisa | Ja leu. Serviu pra criar os outros docs |
| 1 Mega Estudo | Ja leu. Referencia se tiver duvida |
| 2 Guia | Ja leu. Consulta features |
| 3 Prompt AI | Pra gerar do ZERO — seu painel JA existe |
| 4 Adendo DS | Consulta de tokens — so se precisar hex/nome |
| **6 Prompt V0** | **Pra gerar do ZERO no V0/Bolt — PULE ESTE** |
| 9 Guia V0 | Referencia de paths — consultar se necessario |
| 10 Relatorio | Correcoes ja aplicadas nos docs |

---

# PASSO A PASSO — COMO EXECUTAR

## CONVERSA 1: CLEANUP + BACKEND (Fases 0-1)

```
Mensagem 1:
"Leia o Roteiro do Painel Flutuante (Partes 1-2).
Confirme que entendeu listando:
- As 7 fases com nome e objetivo
- Os arquivos que serao editados na Fase 0
- As tabelas SQL da Fase 1"

[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-1.md]
[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-2.md]
```

Depois que a IA confirmar:

```
Mensagem 2:
"Execute a Fase 0 (Cleanup). Pra cada arquivo, mostre
o trecho ANTES e o trecho DEPOIS. Nao reescreva arquivos inteiros."
```

```
Mensagem 3:
"Agora execute a Fase 1 (Banco + Backend).
Gere os CREATE TABLE e os handlers server/client."
```

## CONVERSA 2: ARQUITETURA + PERFORMANCE (Fases 2-3)

```
Mensagem 1:
"Leia as Partes 2-3 do Roteiro. Execute a Fase 2 (CasinoContext + useGameAPI).
Confirme listando os estados do Context e os metodos do hook."

[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-2.md]
[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-3.md]
```

```
Mensagem 2:
"Execute a Fase 3 (Performance). Aplicar throttle, pause particles,
lazy loading. Mostre ANTES/DEPOIS de cada trecho."
```

## CONVERSA 3: ANIMACOES + INTEGRACAO (Fases 4-5)

```
Mensagem 1:
"Leia as Partes 3-4 do Roteiro + o CSS-Componentes.
Execute a Fase 4 (ComingSoon, layoutId Dock, AnimatePresence).
Depois a Fase 5 (DepositModal, saldo, sons, tooltips)."

[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-3.md]
[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-4.md]
[anexar: 7.CSS-COMPONENTES-PAINEL-FLUTUANTE-PARTE-1.md]
[anexar: 7.CSS-COMPONENTES-PAINEL-FLUTUANTE-PARTE-2.md]
```

## CONVERSA 4: POLISH (Fase 6)

```
Mensagem 1:
"Leia a Parte 4 + Adendo do Roteiro. Execute a Fase 6 (Polish).
LazyMotion, prefetch saldo, acessibilidade, ESC handler."

[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-4.md]
[anexar: 5.ROTEIRO-PAINEL-FLUTUANTE-PARTE-5-ADENDO.md]
```

## IMAGENS (ja baixou as 14)

Confira se os paths batem com o Doc 8:

```
Mensagem (qualquer conversa):
"Confira se estas imagens estao nos paths corretos:
[colar lista de paths do Doc 8 Parte 1]"
```

---

# E O DOC 6 PROMPT V0? PRA QUE SERVE?

O Doc 6 Prompt V0 serve pra quem quer GERAR O PAINEL DO ZERO.
Voce colaria o prompt inteiro no V0/Bolt/ChatGPT e ele geraria
o componente BlackoutCasino completo.

VOCE NAO PRECISA DISTO porque seu painel JA EXISTE.

Cenarios onde o V0 seria util:
- Se voce perdesse todo o codigo e precisasse recomecar
- Se voce quisesse gerar uma versao alternativa pra comparar
- Se um amigo quisesse criar um painel similar do zero

No seu caso: PULE o Doc 6. Use o Doc 5 (Roteiro) que edita o existente.

---

# RESUMO FINAL

```
SEU PAINEL JA EXISTE + ESTUDO COMPLETO = USAR O ROTEIRO (Doc 5)

Fase 0: Cleanup (remover codigo morto)
Fase 1: Backend (SQL + server + client Lua)
Fase 2: Arquitetura (CasinoContext + useGameAPI)
Fase 3: Performance (throttle, pause, lazy)
Fase 4: Animacoes (ComingSoon, layoutId, AnimatePresence)
Fase 5: Integracao (DepositModal, saldo, sons, tooltips)
Fase 6: Polish (LazyMotion, prefetch, acessibilidade)

Cada fase no Roteiro tem ANTES/DEPOIS do codigo.
A IA le o Roteiro e sabe exatamente O QUE mudar e ONDE.
```
