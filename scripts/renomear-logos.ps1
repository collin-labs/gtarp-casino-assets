# Renomear logos do Blackout Casino — remover espacos que quebram no FiveM CEF
# Rodar UMA VEZ no projeto local

$pasta = "D:\Projetos\GTA-CASINO-ASSETS\public\assets\brand\LOGO-BLACKOUT-CASINO"

$renomear = @{
    "1-GTARP CASINO LOGO 4-2.png"        = "logo-4x2.png"
    "1-GTARP CASINO logo 1-1.png"         = "logo-1x1.png"
    "1-GTARP CASINO LOGO 4-2-ICONE.png"   = "logo-icone.png"
    "1-GTARP CASINO LOGO 4-2-TEXTO.png"   = "logo-texto.png"
}

foreach ($item in $renomear.GetEnumerator()) {
    $origem = Join-Path $pasta $item.Key
    $destino = Join-Path $pasta $item.Value
    if (Test-Path $origem) {
        Rename-Item -Path $origem -NewName $item.Value -Force
        Write-Host "OK: $($item.Key) -> $($item.Value)" -ForegroundColor Green
    } else {
        Write-Host "NAO ENCONTRADO: $($item.Key)" -ForegroundColor Yellow
    }
}

Write-Host "`nPronto! Agora faz o build: npm run build" -ForegroundColor Cyan
