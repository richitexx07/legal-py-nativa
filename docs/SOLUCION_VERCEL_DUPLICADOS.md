# 🔧 Solución: Proyectos Duplicados en Vercel

**Fecha:** 2025-01-27  
**Problema:** Dos proyectos en Vercel (`legal-py` y `legal-py-nativa`)

---

## 📊 SITUACIÓN ACTUAL

### Proyecto 1: `legal-py` ❌ (FALLANDO)
- **URL de error:** https://legal-3k6r0sl89-richitexx07-2541s-projects.vercel.app/
- **Estado:** Error de deploy, último intento hace 45 minutos
- **Project ID:** `prj_skJlQsvldAKUngWCQQZqR0IvMaGB`
- **Problema:** Probablemente conectado a un repositorio viejo o incorrecto

### Proyecto 2: `legal-py-nativa` ✅ (FUNCIONANDO)
- **URL:** https://vercel.com/richitexx07-2541s-projects/legal-py-nativa
- **Estado:** Funcionando correctamente
- **Repositorio conectado:** `https://github.com/richitexx07/legal-py-nativa.git` ✅

---

## ✅ SOLUCIÓN APLICADA

### 1. Configuración Local Actualizada

La configuración local ha sido actualizada para apuntar a `legal-py-nativa`:

- ✅ Carpeta `.vercel` antigua eliminada
- ✅ Script de vinculación creado: `scripts/link-vercel-project.ps1`

### 2. Pasos para Completar la Vinculación

**Ejecuta estos comandos en PowerShell:**

```powershell
cd c:\Users\lalla\legal-py

# 1. Hacer login en Vercel (si no estás logueado)
vercel login

# 2. Ejecutar el script de vinculación
.\scripts\link-vercel-project.ps1
```

**O manualmente:**

```powershell
cd c:\Users\lalla\legal-py

# 1. Hacer login
vercel login

# 2. Vincular al proyecto
vercel link

# 3. Cuando se te pregunte, selecciona:
#    - Project: legal-py-nativa
#    - Directory: ./
```

### 3. Eliminar Proyecto Duplicado en Vercel

**Pasos en el Dashboard de Vercel:**

1. Ve a: https://vercel.com/richitexx07-2541s-projects/legal-py
2. Settings → General → Scroll hasta el final
3. Click en "Delete Project"
4. Escribe el nombre del proyecto para confirmar: `legal-py`
5. Click en "Delete"

---

## 🎯 RESULTADO FINAL

Después de completar estos pasos:

- ✅ Un solo proyecto en Vercel: `legal-py-nativa`
- ✅ Configuración local vinculada correctamente
- ✅ Deploys automáticos desde GitHub funcionando
- ✅ Sin proyectos duplicados

---

## 📝 VERIFICACIÓN

Para verificar que todo está correcto:

```powershell
# Verificar proyecto vinculado
vercel inspect

# Ver información del proyecto
vercel project ls
```

---

## 🚀 DEPLOY MANUAL (si es necesario)

Si necesitas hacer deploy manual:

```powershell
# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

---

## ⚠️ NOTAS IMPORTANTES

- El repositorio local está conectado a: `richitexx07/legal-py-nativa`
- El proyecto `legal-py-nativa` en Vercel debe estar conectado al mismo repositorio
- Las variables de entorno deben estar configuradas en `legal-py-nativa`:
  - `NEXT_PUBLIC_DEMO_MODE=true`
  - Cualquier otra variable que necesites

---

**Firmado por:** Equipo Legal PY  
**Fecha:** 2025-01-27  
**Estado:** ✅ Configuración local actualizada, pendiente vinculación manual
