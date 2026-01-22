@echo off
REM Push a GitHub (actualiza Vercel si el repo está conectado)
REM Ejecutar desde la raíz del proyecto o con ruta completa

cd /d "%~dp0\.."

echo === Configurando Git sin proxy ===

REM Limpiar variables de entorno
set HTTP_PROXY=
set HTTPS_PROXY=
set http_proxy=
set https_proxy=

REM Desactivar proxy en Git
git config --local --unset http.proxy 2>nul
git config --local --unset https.proxy 2>nul
git config --global --unset http.proxy 2>nul
git config --global --unset https.proxy 2>nul

REM Desactivar proxy solo para GitHub
git config --local http.https://github.com/.proxy "" 2>nul
git config --global http.https://github.com/.proxy "" 2>nul

echo === Haciendo push a GitHub ===
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Push exitoso! Vercel desplegara automaticamente.
    exit /b 0
) else (
    echo.
    echo Push fallo. Revisa SOLUCION_PUSH.md para ayuda.
    exit /b %ERRORLEVEL%
)
