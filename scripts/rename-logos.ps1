# Renomear logos da brand — remover espacos nos nomes
# Rodar de: D:\Projetos\GTA-CASINO-ASSETS\
$pasta = "public\assets\brand\LOGO-BLACKOUT-CASINO"

$renames = @{
    "1-GTARP CASINO LOGO 4-2.png"        = "logo-4x2.png"
    "1-GTARP CASINO logo 1-1.png"         = "logo-1x1.png"
    "1-GTARP CASINO LOGO 4-2-ICONE.png"   = "logo-icone.png"
    "1-GTARP CASINO LOGO 4-2-TEXTO.png"   = "logo-texto.png"
}

foreach ($item in $renames.GetEnumerator()) {
    $origem = Join-Path $pasta $item.Key
    $destino = Join-Path $pasta $item.Value
    if (Test-Path $origem) {
        Rename-Item -Path $origem -NewName $item.Value -Force
        Write-Host "OK: $($item.Key) -> $($item.Value)" -ForegroundColor Green
    } elseif (Test-Path $destino) {
        Write-Host "JA EXISTE: $($item.Value)" -ForegroundColor Yellow
    } else {
        Write-Host "NAO ENCONTRADO: $($item.Key)" -ForegroundColor Red
    }
}

Write-Host "`nPronto. Agora faca: npm run build" -ForegroundColor Cyan
