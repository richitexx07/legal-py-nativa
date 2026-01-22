# Push a GitHub (actualiza Vercel si el repo está conectado)
# Ejecutar desde la raíz del proyecto: .\scripts\push-to-github.ps1
# O desde PowerShell externo (fuera de Cursor): cd c:\Users\lalla\legal-py; .\scripts\push-to-github.ps1

Set-Location $PSScriptRoot\..

Write-Host "`n=== Configurando Git sin proxy ===" -ForegroundColor Cyan

# 1. Limpiar variables de entorno de proxy
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
$env:NO_PROXY = "*"
Write-Host "✓ Variables de entorno de proxy limpiadas" -ForegroundColor Green

# 2. Desactivar proxy en Git (local y global)
git config --local --unset http.proxy 2>$null
git config --local --unset https.proxy 2>$null
git config --global --unset http.proxy 2>$null
git config --global --unset https.proxy 2>$null
Write-Host "✓ Configuracion de proxy de Git limpiada" -ForegroundColor Green

# 3. Desactivar proxy solo para GitHub (más específico)
git config --local http.https://github.com/.proxy "" 2>$null
git config --global http.https://github.com/.proxy "" 2>$null
Write-Host "✓ Proxy desactivado especificamente para GitHub" -ForegroundColor Green

# 4. Verificar remoto
Write-Host "`n=== Verificando remoto ===" -ForegroundColor Cyan
git remote -v

# 5. Verificar commits pendientes
Write-Host "`n=== Commits pendientes ===" -ForegroundColor Cyan
$commitsAhead = git rev-list --count origin/main..HEAD 2>$null
if ($commitsAhead -gt 0) {
    Write-Host "Hay $commitsAhead commit(s) por subir" -ForegroundColor Yellow
    git log --oneline origin/main..HEAD
} else {
    Write-Host "No hay commits pendientes" -ForegroundColor Gray
}

# 6. Intentar push
Write-Host "`n=== Haciendo push a GitHub ===" -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Push exitoso!" -ForegroundColor Green
    Write-Host "Vercel desplegara automaticamente si el repo esta conectado." -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "`n✗ Push fallo (codigo: $LASTEXITCODE)" -ForegroundColor Red
    
    # Detectar tipo de error
    $errorOutput = git push origin main 2>&1 | Out-String
    if ($errorOutput -match "127\.0\.0\.1|proxy") {
        Write-Host "`nERROR: Problema de proxy detectado (127.0.0.1)" -ForegroundColor Yellow
        Write-Host "`nSoluciones:" -ForegroundColor Yellow
        Write-Host "1. Desactiva proxy en Windows:" -ForegroundColor White
        Write-Host "   Configuracion > Red e Internet > Proxy" -ForegroundColor Gray
        Write-Host "   Desactiva 'Usar servidor proxy'" -ForegroundColor Gray
        Write-Host "`n2. Si usas VPN (NordVPN, etc.), desactivala temporalmente" -ForegroundColor White
        Write-Host "`n3. Ejecuta este script desde PowerShell externo (fuera de Cursor):" -ForegroundColor White
        Write-Host "   cd c:\Users\lalla\legal-py" -ForegroundColor Gray
        Write-Host "   .\scripts\push-to-github.ps1" -ForegroundColor Gray
        Write-Host "`n4. Alternativa: Usa GitHub Desktop o Git GUI" -ForegroundColor White
    } elseif ($errorOutput -match "Permission denied|access") {
        Write-Host "`nERROR: Problema de permisos o autenticacion" -ForegroundColor Yellow
        Write-Host "Verifica que tienes acceso al repositorio y credenciales configuradas" -ForegroundColor Gray
    } else {
        Write-Host "`nError desconocido. Revisa el mensaje arriba." -ForegroundColor Yellow
    }
    
    exit $LASTEXITCODE
}
