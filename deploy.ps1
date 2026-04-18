# deploy.ps1 — Build + Deploy bc_casino pro FiveM
# Rodar de: D:\Projetos\GTA-CASINO-ASSETS\

$dest = "C:\GTA-RP-BASE-DE-DADOS\resources\bc_casino"

Write-Host "`n[1/3] Build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "BUILD FALHOU" -ForegroundColor Red; exit 1 }

Write-Host "[2/3] Limpando resource..." -ForegroundColor Cyan
Remove-Item $dest -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path $dest -ItemType Directory -Force | Out-Null

Write-Host "[3/3] Copiando..." -ForegroundColor Cyan
Copy-Item ".\fxmanifest.lua" "$dest\" -Force
Copy-Item -Recurse ".\client" "$dest\client"
Copy-Item -Recurse ".\server" "$dest\server"
Copy-Item ".\out\*" "$dest\" -Recurse -Force

Write-Host "`nPRONTO! No console do FXServer: ensure bc_casino" -ForegroundColor Green
