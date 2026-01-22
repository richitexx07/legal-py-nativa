# Push a GitHub (actualiza Vercel si el repo está conectado)
# Ejecutar desde la raíz del proyecto: .\scripts\push-to-github.ps1

Set-Location $PSScriptRoot\..

# Opcional: quitar proxy si apunta a 127.0.0.1 y falla
# git config --global --unset http.proxy
# git config --global --unset https.proxy

git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nSi falla por proxy, probar:" -ForegroundColor Yellow
  Write-Host '  $env:HTTP_PROXY=""; $env:HTTPS_PROXY=""; git push origin main' -ForegroundColor Gray
  exit $LASTEXITCODE
}
Write-Host "`nPush OK. Vercel desplegará automáticamente si el repo está conectado." -ForegroundColor Green
