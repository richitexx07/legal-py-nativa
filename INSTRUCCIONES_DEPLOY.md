# Instrucciones para Actualizar GitHub y Vercel

## 📋 Resumen
Tienes **2 commits** pendientes de subir a GitHub:
- `336be3d` - chore: script push con unset proxy; npm run deploy
- `9a46da0` - chore: script push-to-github.ps1 para actualizar GitHub/Vercel

## 🚀 Solución Rápida (RECOMENDADO)

### Opción 1: PowerShell Externo
1. Abre **PowerShell** o **Terminal de Windows** (fuera de Cursor)
2. Ejecuta:
   ```powershell
   cd c:\Users\lalla\legal-py
   .\scripts\push-to-github.ps1
   ```

### Opción 2: CMD/Batch
1. Abre **CMD** o **Símbolo del sistema**
2. Ejecuta:
   ```cmd
   cd c:\Users\lalla\legal-py
   scripts\push-to-github.bat
   ```

### Opción 3: NPM Script
Desde PowerShell externo:
```powershell
cd c:\Users\lalla\legal-py
npm run deploy
```

## 🔧 Si Sigue Fallando

### Problema: Error "127.0.0.1" o "proxy"
**Causa:** Windows o una VPN está redirigiendo el tráfico a un proxy local.

**Soluciones:**
1. **Desactivar proxy en Windows:**
   - Configuración → Red e Internet → Proxy
   - Desactiva "Usar servidor proxy"

2. **Desactivar VPN temporalmente:**
   - Si usas NordVPN, ExpressVPN, etc., desactívala

3. **Usar GitHub Desktop:**
   - Instala [GitHub Desktop](https://desktop.github.com/)
   - Abre el repositorio y haz clic en "Push origin"

## ✅ Después del Push

Una vez exitoso, **Vercel desplegará automáticamente** en unos minutos.

Verifica en:
- GitHub: https://github.com/richitexx07/legal-py-nativa
- Vercel: https://vercel.com/dashboard

## 📝 Archivos Creados

- `scripts/push-to-github.ps1` - Script PowerShell mejorado
- `scripts/push-to-github.bat` - Script Batch alternativo
- `SOLUCION_PUSH.md` - Guía detallada de solución
- `INSTRUCCIONES_DEPLOY.md` - Este archivo

## 🔍 Verificar Estado

```powershell
# Ver commits pendientes
git log --oneline origin/main..HEAD

# Ver estado
git status
```
