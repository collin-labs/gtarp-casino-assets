# BLACKOUT CASINO — PAINEL ADMINISTRATIVO
## Guia de Acesso e Configuracao

---

## OBJETIVO

O Painel Administrativo permite ao dono do script configurar o Blackout Casino **sem editar codigo ou banco de dados**. Tudo acontece dentro do proprio casino, em uma interface protegida por senha.

Com ele voce pode:
- Renomear a moeda do casino (ex: "GCoin" → "Fichas", "Chips", "Tokens")
- Definir taxas de deposito e saque
- Ajustar limites minimos e maximos
- Editar os textos de ajuda exibidos aos jogadores
- Habilitar ou desabilitar jogos individuais
- Abrir ou fechar o casino inteiro

Todas as alteracoes sao aplicadas **instantaneamente** — sem rebuild, sem restart do servidor.

---

## COMO ACESSAR

### Passo 1 — Abrir o Casino
Pressione **F5** no jogo para abrir o painel flutuante do Blackout Casino.

### Passo 2 — Abrir o Painel Admin
Com o casino aberto (F5), pressione **SHIFT + F5**. O painel admin aparece sobre o casino.

> Nenhum botao visivel existe — o atalho eh secreto, conhecido apenas pelo administrador.
> Para fechar o admin: pressione **SHIFT + F5** novamente ou **ESC**.

### Passo 3 — Autenticar
O modal de login aparece solicitando a senha de administrador. Use o botao **◎** ao lado do campo para mostrar/ocultar a senha digitada.

---

## FLUXO DE SENHA

O sistema de senha tem dois estagios: **configuracao inicial** e **uso normal**.

### Primeiro Acesso (Setup)

Quando o script e instalado pela primeira vez, ele vem com uma **senha mestre** pre-definida:

```
blackout-casino-master-2026
```

1. Abra o casino (F5) e pressione **SHIFT + F5**
2. Digite a senha mestre no campo de login (use **◎** para visualizar)
3. O sistema detecta que e o primeiro acesso e exibe a tela de **Configuracao Inicial**
4. Crie sua **senha pessoal** (minimo 6 caracteres)
5. Confirme a senha
6. Clique em **CRIAR SENHA**

Apos este passo:
- A senha mestre e **permanentemente removida** do banco de dados
- Apenas sua senha pessoal funciona a partir de agora
- Voce e redirecionado ao painel de configuracao

### Acessos Seguintes

1. Pressione **SHIFT + F5** com o casino aberto
2. Digite sua senha pessoal (use **◎** para visualizar)
3. Clique em **ENTRAR**
4. O painel de configuracao abre

### Protecao contra Tentativas

O sistema bloqueia o acesso apos **5 tentativas incorretas** consecutivas. O bloqueio dura **5 minutos**. Durante o bloqueio, uma mensagem informa o tempo restante.

---

## RECUPERACAO DE SENHA

Se voce esqueceu sua senha pessoal, a recuperacao e feita diretamente no banco de dados:

1. Abra o **HeidiSQL** (ou seu gerenciador de banco)
2. Conecte no banco do FiveM (database `brasil`, user `fivem`, localhost:3306)
3. Execute o seguinte SQL:

```sql
UPDATE casino_admin_auth
SET admin_password = NULL, master_password = SHA2('blackout-casino-master-2026', 256), setup_complete = 0
WHERE id = 1;
```

4. Isso restaura a senha mestre original e reseta o setup
5. No proximo acesso via engrenagem, voce passara pelo fluxo de primeiro acesso novamente

---

## PAINEL DE CONFIGURACAO

Apos autenticar, o painel exibe 5 secoes organizadas:

### MOEDA

| Campo | Descricao | Exemplo |
|-------|-----------|---------|
| currency name | Nome da moeda exibida no casino | GCoin, Fichas, Chips |
| currency symbol | Abreviacao usada ao lado dos valores | GC, FC, $C |
| currency icon | Caminho do icone da moeda | /assets/shared/icons/icon-gcoin.png |
| gcoin rate | Taxa de conversao: 1 moeda = $X dinheiro do jogo | 1.05 |
| currency rate label | Texto de conversao exibido no painel de ajuda | 1 GCoin = $1.05 |

### DEPOSITO / SAQUE

| Campo | Descricao | Padrao |
|-------|-----------|--------|
| min deposit | Deposito minimo permitido | 10 |
| max deposit | Deposito maximo por transacao | 50000 |
| min withdraw | Saque minimo permitido | 50 |
| max withdraw | Saque maximo por transacao | 100000 |
| deposit fee percent | Taxa de deposito em % (0 = sem taxa) | 0 |
| withdraw tax percent | Taxa de saque em % | 2 |
| daily deposit limit | Limite diario de deposito | 200000 |
| daily withdraw limit | Limite diario de saque | 100000 |
| cooldown seconds | Tempo entre transacoes do mesmo jogador | 3 |

### TEXTOS DE AJUDA

| Campo | Descricao |
|-------|-----------|
| deposit explanation br | Texto que explica o deposito (portugues) |
| deposit explanation en | Texto que explica o deposito (ingles) |
| withdraw explanation br | Texto que explica o saque (portugues) |
| withdraw explanation en | Texto que explica o saque (ingles) |
| fee explanation br | Texto sobre taxas (portugues) — suporta placeholder `{withdraw_tax_percent}` |
| fee explanation en | Texto sobre taxas (ingles) — suporta placeholder `{withdraw_tax_percent}` |
| help title br | Titulo do painel de ajuda (portugues) |
| help title en | Titulo do painel de ajuda (ingles) |

### CONTROLE

| Campo | Descricao |
|-------|-----------|
| casino enabled | Casino aberto (ON) ou fechado (OFF) para jogadores |
| slot enabled | Slot Machine habilitado (ON) ou desabilitado (OFF) |

### SEGURANCA

- **Trocar senha** — permite alterar a senha de administrador informando a atual e a nova
- **Instrucoes de recuperacao** — exibidas diretamente no painel

---

## COMO SALVAR

1. Edite os campos desejados — um ponto verde (●) aparece ao lado de cada campo alterado
2. O botao **SALVAR** no rodape do painel comeca a pulsar em dourado quando ha mudancas pendentes
3. O botao mostra o numero de campos alterados (ex: "SALVAR (3)")
4. Clique em **SALVAR** — todas as alteracoes sao enviadas ao servidor de uma vez
5. Uma mensagem de confirmacao aparece informando quantas configuracoes foram salvas
6. As mudancas sao aplicadas **instantaneamente** no casino — sem rebuild necessario

> Para que os jogadores vejam as mudancas no frontend (como nome da moeda), eles precisam fechar e reabrir o painel do casino. O cache do hook `useCurrencyConfig` expira na proxima abertura.

---

## ARQUITETURA TECNICA

Para desenvolvedores e administradores avancados:

### Banco de Dados

**Tabela `casino_config`** — Armazena todas as configuracoes como pares chave/valor.

```sql
SELECT chave, valor, descricao FROM casino_config ORDER BY chave;
```

**Tabela `casino_admin_auth`** — Armazena autenticacao do admin (unica row, id=1).

```sql
SELECT id, setup_complete, failed_attempts, locked_until, last_login_at FROM casino_admin_auth;
```

### Endpoints do Servidor

| Endpoint | Funcao |
|----------|--------|
| `casino:admin:auth` | Autenticar com senha |
| `casino:admin:setup` | Criar senha pessoal (primeiro acesso) |
| `casino:admin:getConfig` | Obter todas as configs com descricao |
| `casino:admin:setConfig` | Salvar alteracoes (batch) |
| `casino:admin:changePassword` | Trocar senha de administrador |

### Seguranca

- Senhas armazenadas como **SHA-256** no banco (nunca em texto plano)
- Hashing feito via `SHA2()` do MySQL — sem dependencia de crypto no JS
- Sessao com token aleatorio de 32 caracteres, expira em **15 minutos** de inatividade
- Lockout apos **5 falhas** por **5 minutos**
- Logs de cada operacao no console do servidor FiveM

### Arquivos Envolvidos

| Arquivo | Funcao |
|---------|--------|
| `sql/admin_auth.sql` | Schema e seed da tabela de autenticacao |
| `server/handlers/admin.js` | 5 endpoints server-side (288 linhas) |
| `client/panel_client.lua` | NUI callbacks para os 5 endpoints |
| `components/casino/AdminPanel.tsx` | Interface React do painel admin (678 linhas) |
| `components/casino/BlackoutCasino.tsx` | Botao engrenagem e overlay do admin |

---

## RESUMO RAPIDO

| Item | Valor |
|------|-------|
| Senha mestre inicial | `blackout-casino-master-2026` |
| Onde acessar | **SHIFT + F5** com o casino aberto (atalho oculto) |
| Mostrar/ocultar senha | Botao **◎** ao lado do campo de senha |
| Tentativas antes de bloqueio | 5 |
| Tempo de bloqueio | 5 minutos |
| Sessao expira em | 15 minutos de inatividade |
| Fechar painel admin | **SHIFT + F5** ou **ESC** ou botao ✕ |
| Rebuild necessario apos alterar | Nao — alteracoes sao instantaneas |

---

*Documento criado em 13/04/2026 — BC Agencia Solucoes Digitais*
*Blackout Casino v1.0 — Painel Administrativo*
