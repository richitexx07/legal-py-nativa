# Push a GitHub (actualiza Vercel si el repo está conectado)
# Ejecutar desde la raíz del proyecto: .\scripts\push-to-github.ps1

Set-Location $PSScriptRoot\..

# Quitar proxy si apunta a 127.0.0.1 y falla el push
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
git config --global --unset http.proxy 2>$null
git config --global --unset https.proxy 2>$null

git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nSi falla por proxy (127.0.0.1):" -ForegroundColor Yellow
  Write-Host "  1. Desactiva proxy en Windows: Configuracion > Red > Proxy" -ForegroundColor Gray
  Write-Host "  2. O ejecuta en PowerShell externo: .\scripts\push-to-github.ps1" -ForegroundColor Gray
  exit $LASTEXITCODE
}
Write-Host "`nPush OK. Vercel desplegara automaticamente si el repo esta conectado." -ForegroundColor Green
