# Solución para Push a GitHub

## Problema
Error: `Failed to connect to github.com port 443 via 127.0.0.1`

Este error indica que Git está intentando usar un proxy en localhost (127.0.0.1) que no está disponible.

## Soluciones Rápidas

### Opción 1: Ejecutar script desde PowerShell externo (RECOMENDADO)
1. Abre **PowerShell** o **Terminal** fuera de Cursor
2. Ejecuta:
   ```powershell
   cd c:\Users\lalla\legal-py
   .\scripts\push-to-github.ps1
   ```

### Opción 2: Desactivar proxy en Windows
1. Abre **Configuración de Windows**
2. Ve a **Red e Internet** > **Proxy**
3. Desactiva **"Usar servidor proxy"** si está activado
4. Vuelve a intentar el push

### Opción 3: Desactivar VPN temporalmente
Si usas VPN (NordVPN, ExpressVPN, etc.), desactívala temporalmente y vuelve a intentar.

### Opción 4: Usar GitHub Desktop
1. Instala [GitHub Desktop](https://desktop.github.com/)
2. Abre el repositorio
3. Haz clic en **Push origin**

## Configuración Manual de Git

Si prefieres configurar Git manualmente:

```powershell
# Limpiar proxy de Git
git config --global --unset http.proxy
git config --global --unset https.proxy

# Desactivar proxy solo para GitHub
git config --global http.https://github.com/.proxy ""

# Limpiar variables de entorno (en PowerShell)
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""

# Intentar push
git push origin main
```

## Verificar Estado

```powershell
# Ver commits pendientes
git log --oneline origin/main..HEAD

# Ver configuración de proxy
git config --global --get http.proxy
git config --global --get https.proxy

# Ver remoto
git remote -v
```

## Después del Push

Una vez que el push sea exitoso, **Vercel desplegará automáticamente** si:
- El repositorio está conectado a un proyecto en Vercel
- La rama `main` está configurada para auto-deploy

Puedes verificar el despliegue en: https://vercel.com/dashboard
