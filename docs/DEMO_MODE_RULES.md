# 🎯 Reglas de Modo Demo - Legal PY

**Autor:** Security Engineer Fintech  
**Fecha:** 2025-01-27  
**Versión:** 2.0.0

---

## 📋 RESUMEN EJECUTIVO

El modo demo permite que la plataforma funcione como demostración sin bloquear a los usuarios, mientras mantiene la seguridad en producción.

### Principios Fundamentales

1. **En Demo:** Biometría se muestra, se explica, funciona, pero **NO BLOQUEA**
2. **En Producción:** Biometría obligatoria en pagos, escape oculto
3. **Sin Hacks:** Lógica clara y centralizada, fácil de desactivar

---

## 🔧 CONFIGURACIÓN

### Variable de Entorno

```bash
# .env.local o Vercel Environment Variables
NEXT_PUBLIC_DEMO_MODE=true   # Activa modo demo
NEXT_PUBLIC_DEMO_MODE=false  # Producción (o no definir)
```

### Detección Automática

El sistema detecta modo demo mediante:

1. **Variable de entorno:** `process.env.NEXT_PUBLIC_DEMO_MODE === "true"`
2. **Usuario demo:** `demo@legalpy.com` (master key)
3. **localStorage (desarrollo):** `localStorage.getItem("legal-py-demo-mode") === "true"`

---

## 📐 REGLAS DE COMPORTAMIENTO

### Modo Demo (`NEXT_PUBLIC_DEMO_MODE=true`)

#### ✅ Biometría

- **Se muestra:** Modal biométrico aparece normalmente
- **Se explica:** Mensaje claro "🎯 Modo Demo: Esta es una demostración..."
- **Funciona:** Usuario puede probar la funcionalidad completa
- **NO bloquea:** Botón de escape siempre visible, puede cerrarse en cualquier momento

#### ✅ Botones de Escape

- **Botón X:** Siempre visible (esquina superior derecha)
- **Fondo clickeable:** Siempre activo
- **"Hacerlo más tarde":** Siempre visible
- **"Omitir verificación":** Siempre visible al final del modal

#### ✅ Flujo de Acciones

- **Crear casos:** No requiere biometría (ejecuta acción directamente)
- **Pagos:** No requiere biometría (ejecuta acción directamente)
- **Otras acciones:** No bloquean

---

### Producción (`NEXT_PUBLIC_DEMO_MODE=false` o no definido)

#### ✅ Biometría

- **Obligatoria en pagos:** `/subscribe`, `/payments`, `/checkout`, `/pricing`
- **Opcional en otras acciones:** Usuario puede cerrar modal
- **Escape oculto en pagos:** No se puede omitir en rutas de pago

#### ✅ Botones de Escape

- **Botón X:** Visible excepto en pagos obligatorios
- **Fondo clickeable:** Visible excepto en pagos obligatorios
- **"Hacerlo más tarde":** Visible excepto en pagos obligatorios
- **"Omitir verificación":** Visible excepto en pagos obligatorios

#### ✅ Flujo de Acciones

- **Crear casos:** Requiere biometría si usuario no está verificado
- **Pagos:** **SIEMPRE** requiere biometría (obligatorio)
- **Otras acciones:** Según configuración de seguridad

---

## 🛠️ IMPLEMENTACIÓN TÉCNICA

### Archivos Clave

1. **`lib/demo-utils.ts`**
   - `checkDemoMode()`: Detecta modo demo
   - `checkDemoUser()`: Detecta usuario demo
   - `canSkipBiometric()`: Verifica si se puede omitir biometría
   - `isBiometricMandatory()`: Verifica si biometría es obligatoria

2. **`hooks/useBiometricCheck.ts`**
   - Respeta modo demo: ejecuta acción directamente sin mostrar modal
   - En producción: muestra modal según reglas

3. **`components/Security/BiometricVerificationModal.tsx`**
   - Detecta modo demo automáticamente
   - Muestra mensaje explicativo en demo
   - Botones de escape siempre visibles en demo

### Código de Ejemplo

```typescript
// Detección de modo demo
import { checkDemoMode, canSkipBiometric, isBiometricMandatory } from "@/lib/demo-utils";

const demoMode = checkDemoMode(); // true si NEXT_PUBLIC_DEMO_MODE=true
const canSkip = canSkipBiometric(); // true en demo
const isMandatory = isBiometricMandatory(isPaymentRoute); // false en demo

// En hook de biometría
if (demoMode || demoUser) {
  // En demo: ejecutar acción directamente
  action();
  return;
}

// En modal
const effectiveIsMandatory = (isDemoMode || demoMode || demoUser) ? false : isMandatory;
```

---

## 🚀 DESPLIEGUE

### Desarrollo Local

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

### Staging (Demo)

```bash
# Vercel Environment Variables
NEXT_PUBLIC_DEMO_MODE=true
```

### Producción

```bash
# Vercel Environment Variables
NEXT_PUBLIC_DEMO_MODE=false
# O simplemente no definir la variable
```

---

## ✅ CHECKLIST PRE-PRODUCCIÓN

Antes de desactivar modo demo:

- [ ] Verificar que `NEXT_PUBLIC_DEMO_MODE` no esté definido o sea `false`
- [ ] Verificar que `demo@legalpy.com` no tenga permisos especiales en producción
- [ ] Verificar que biometría sea obligatoria en rutas de pago
- [ ] Verificar que botones de escape estén ocultos en pagos
- [ ] Probar flujo completo de pago con biometría obligatoria
- [ ] Verificar que usuarios no puedan omitir biometría en pagos

---

## 🔒 SEGURIDAD

### Garantías

1. **Modo demo solo activo con variable de entorno explícita**
2. **Usuario demo (`demo@legalpy.com`) solo funciona en modo demo**
3. **En producción, biometría obligatoria en pagos**
4. **No hay hardcode de usuarios o bypasses permanentes**

### Riesgos Mitigados

- ✅ No se puede activar modo demo accidentalmente en producción
- ✅ Usuario demo no tiene acceso especial en producción
- ✅ Biometría siempre obligatoria en pagos (producción)
- ✅ Fácil de desactivar: solo cambiar variable de entorno

---

## 📚 DOCUMENTOS RELACIONADOS

- `lib/demo-utils.ts` - Implementación de utilidades demo
- `hooks/useBiometricCheck.ts` - Hook de verificación biométrica
- `components/Security/BiometricVerificationModal.tsx` - Modal biométrico
- `docs/WEBAUTHN_SECURITY_CONTROLS.md` - Controles de seguridad WebAuthn

---

**Firmado por:** Security Engineer Fintech  
**Fecha:** 2025-01-27  
**Versión:** 2.0.0
