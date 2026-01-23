# Script para vincular el proyecto local a legal-py-nativa en Vercel
# Ejecutar después de hacer login en Vercel: vercel login

Write-Host "[LINK] Vinculando proyecto a legal-py-nativa en Vercel..." -ForegroundColor Cyan

# Verificar que vercel esté instalado
$vercelVersion = vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Vercel CLI no esta instalado. Instalalo con: npm i -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green

# Verificar si ya está logueado
Write-Host "`n[CHECK] Verificando autenticacion..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] No estas autenticado en Vercel." -ForegroundColor Yellow
    Write-Host "[INFO] Ejecuta primero: vercel login" -ForegroundColor Cyan
    Write-Host "       Luego vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Autenticado como: $whoami" -ForegroundColor Green

# Eliminar configuración antigua si existe
if (Test-Path .vercel) {
    Write-Host "`n[DELETE] Eliminando configuracion antigua..." -ForegroundColor Yellow
    Remove-Item .vercel -Recurse -Force
    Write-Host "[OK] Configuracion antigua eliminada" -ForegroundColor Green
}

# Vincular al proyecto legal-py-nativa
Write-Host "`n[LINK] Vinculando a legal-py-nativa..." -ForegroundColor Cyan
Write-Host "       Selecciona legal-py-nativa cuando se te pregunte" -ForegroundColor Yellow

# Intentar vincular de forma interactiva
vercel link

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Proyecto vinculado correctamente!" -ForegroundColor Green
    Write-Host "`n[CHECK] Verificando configuracion..." -ForegroundColor Cyan
    
    # Verificar que el archivo de configuracion existe
    if (Test-Path .vercel\project.json) {
        $projectConfig = Get-Content .vercel\project.json | ConvertFrom-Json
        Write-Host "[INFO] Proyecto vinculado: $($projectConfig.projectName)" -ForegroundColor Cyan
        Write-Host "[INFO] Project ID: $($projectConfig.projectId)" -ForegroundColor Cyan
        
        # Verificar si es el proyecto correcto
        if ($projectConfig.projectName -eq "legal-py-nativa") {
            Write-Host "[OK] Proyecto correcto vinculado!" -ForegroundColor Green
        } else {
            Write-Host "[WARN] Proyecto vinculado: $($projectConfig.projectName)" -ForegroundColor Yellow
            Write-Host "[WARN] Deberia ser: legal-py-nativa" -ForegroundColor Yellow
            Write-Host "[INFO] Si es incorrecto, ejecuta el script nuevamente y selecciona legal-py-nativa" -ForegroundColor Cyan
        }
    } else {
        Write-Host "[WARN] No se encontro el archivo de configuracion" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n[ERROR] Error al vincular el proyecto" -ForegroundColor Red
    Write-Host "        Intenta ejecutar manualmente: vercel link" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[OK] Listo! Tu proyecto local esta vinculado a legal-py-nativa" -ForegroundColor Green
Write-Host "     Ahora puedes hacer deploy con: vercel --prod" -ForegroundColor Cyan
