# Script para vincular el proyecto local a legal-py-nativa en Vercel
# Ejecutar después de hacer login en Vercel: vercel login

Write-Host "🔗 Vinculando proyecto a legal-py-nativa en Vercel..." -ForegroundColor Cyan

# Verificar que vercel esté instalado
$vercelVersion = vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel CLI no está instalado. Instálalo con: npm i -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green

# Verificar si ya está logueado
Write-Host "`n📋 Verificando autenticación..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No estás autenticado en Vercel." -ForegroundColor Yellow
    Write-Host "🔐 Ejecuta primero: vercel login" -ForegroundColor Cyan
    Write-Host "   Luego vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Autenticado como: $whoami" -ForegroundColor Green

# Eliminar configuración antigua si existe
if (Test-Path .vercel) {
    Write-Host "`n🗑️  Eliminando configuración antigua..." -ForegroundColor Yellow
    Remove-Item .vercel -Recurse -Force
    Write-Host "✅ Configuración antigua eliminada" -ForegroundColor Green
}

# Vincular al proyecto legal-py-nativa
Write-Host "`n🔗 Vinculando a legal-py-nativa..." -ForegroundColor Cyan
Write-Host "   Selecciona 'legal-py-nativa' cuando se te pregunte" -ForegroundColor Yellow

# Intentar vincular de forma interactiva
vercel link

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Proyecto vinculado correctamente!" -ForegroundColor Green
    Write-Host "`n📋 Verificando configuración..." -ForegroundColor Cyan
    vercel inspect
} else {
    Write-Host "`n❌ Error al vincular el proyecto" -ForegroundColor Red
    Write-Host "   Intenta ejecutar manualmente: vercel link" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ ¡Listo! Tu proyecto local está vinculado a legal-py-nativa" -ForegroundColor Green
Write-Host "   Ahora puedes hacer deploy con: vercel --prod" -ForegroundColor Cyan
