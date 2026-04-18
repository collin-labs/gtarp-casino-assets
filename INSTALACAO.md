# INSTALACAO BLACKOUT CASINO NO FIVEM
## Passo a passo - BC faz no seu PC

---

## PASSO 1 - Rodar os SQLs no HeidiSQL (2 min)

1. Abrir HeidiSQL, conectar no banco `brasil` (localhost, user `fivem`)
2. Abrir o arquivo `casino-sql-completo.sql` (ou copiar o conteudo)
3. Colar na aba de query e executar (F9 ou botao play)
4. Verificar que as tabelas foram criadas:
   - `casino_accounts`
   - `casino_config`
   - `casino_transactions`
   - `casino_slots_sessions`
   - `casino_slots_spins`
   - `casino_slots_config`
   - `casino_bicho_rounds`
   - `casino_bicho_config`

---

## PASSO 2 - Build do Next.js (5 min)

No PowerShell, na pasta do projeto casino:

```powershell
# Entrar na pasta do casino
cd C:\CAMINHO-DO-PROJETO-CASINO

# Instalar dependencias (se ainda nao fez)
npm install

# Fazer o build estatico
npm run build
```

Isso vai gerar uma pasta `out/` com o HTML/CSS/JS estatico.
Se der erro de "API routes not supported with output export",
eh porque algum arquivo em `app/api/` existe. Deletar a pasta
`app/api/` inteira (os handlers estao em `server/handlers/` em JS,
nao precisa de API routes do Next.js).

---

## PASSO 3 - Copiar pro servidor (3 min)

A pasta final `bc_casino` no servidor precisa ter esta estrutura:

```
resources/bc_casino/
  fxmanifest.lua          <-- ja criado
  client/
    panel_client.lua      <-- ja existe
    slots_client.lua      <-- ja existe
    bicho_client.lua      <-- ja existe
  server/
    vrp_bridge.lua        <-- NOVO (criado agora)
    handlers/
      panel.js            <-- ja existe (editado: bridge vRP)
      slots.js            <-- ja existe
      bicho.js            <-- ja existe
  out/                    <-- gerado pelo next build
    index.html
    _next/
    assets/
    videos/
    ... (todo o build estatico)
```

No PowerShell:

```powershell
# Criar pasta da resource no servidor
$destino = "C:\GTA-RP-BASE-DE-DADOS\resources\bc_casino"
New-Item -Path $destino -ItemType Directory -Force

# Copiar fxmanifest
Copy-Item "fxmanifest.lua" "$destino\"

# Copiar client/
Copy-Item -Recurse "client\" "$destino\client\" -Force

# Copiar server/ (inclui vrp_bridge.lua e handlers/)
Copy-Item -Recurse "server\" "$destino\server\" -Force

# Copiar o build estatico
Copy-Item -Recurse "out\" "$destino\out\" -Force
```

---

## PASSO 4 - Adicionar no server.cfg (1 min)

Abrir `C:\GTA-RP-BASE-DE-DADOS\server.cfg` e adicionar
no TIER 8 (depois do bc_pausemenu):

```cfg
# TIER 8: BC custom
ensure bc_minimap
ensure bc_notify
ensure bc_hud
ensure bc_pausemenu
ensure bc_casino
```

---

## PASSO 5 - Reiniciar o servidor e testar (2 min)

1. Fechar o FXServer
2. Abrir de novo
3. Conectar no jogo
4. Apertar **F5** (ou digitar `/cassino` no chat)
5. O painel do Blackout Casino deve abrir

---

## TROUBLESHOOTING

**"Could not find resource bc_casino"**
- Verificar se a pasta esta em `resources/bc_casino/` (nao em subpasta)
- Verificar se `fxmanifest.lua` esta na raiz da pasta

**Casino abre mas tela branca**
- A pasta `out/` nao foi gerada ou esta vazia
- Rodar `npm run build` de novo e verificar se `out/index.html` existe

**Erro de banco / tabela nao existe**
- Rodar o SQL de novo no HeidiSQL
- Verificar se esta no banco `brasil`

**F5 nao funciona**
- Testar com `/cassino` no chat primeiro
- F5 pode conflitar com outro script — no jogo, ir em
  Configuracoes > Keybinds > FiveM e procurar "Abrir Blackout Casino"

**Comprar GCoin diz "dinheiro insuficiente"**
- Verificar seu saldo com `/money` ou no bc_pausemenu
- O casino debita da CARTEIRA (nao do banco)
