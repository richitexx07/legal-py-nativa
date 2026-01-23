# ⚠️ DEPRECACIÓN: BiometricAuth.tsx

**Fecha:** 2025-01-27  
**Estado:** ❌ **DEPRECADO - NO USAR**

---

## 🚨 PROBLEMA

El componente `BiometricAuth.tsx` **viola el principio de separación absoluta** entre login y payment contexts.

**Problemas identificados:**

1. **Mezcla contextos** con prop `mode: "login" | "payment"`
2. **Endpoints condicionales** (fácil confundir)
3. **Props ambiguas** (`email?` y `paymentContext?`)
4. **Dificulta auditoría** (no está claro qué contexto se usó)

---

## ✅ SOLUCIÓN: Usar Componentes Separados

### ❌ NO USAR (Deprecado)

```typescript
// BiometricAuth.tsx - DEPRECADO
<BiometricAuth 
  mode="login" // o "payment"
  email={email}
  paymentContext={ctx} // Solo si mode="payment"
/>
```

### ✅ USAR (Recomendado)

```typescript
// Para login
<LoginBiometric 
  email={email}
  onSuccess={handleLogin}
/>

// Para pagos
<PayBiometric 
  paymentContext={ctx}
  onSuccess={handlePayment}
/>
```

---

## 📋 MIGRACIÓN

### Paso 1: Identificar Uso

```bash
# Buscar usos de BiometricAuth
grep -r "BiometricAuth" --include="*.tsx" --include="*.ts"
```

### Paso 2: Reemplazar

**Antes:**
```typescript
import BiometricAuth from "@/components/Security/BiometricAuth";

<BiometricAuth 
  mode="login"
  email={email}
  onSuccess={handleSuccess}
/>
```

**Después:**
```typescript
import LoginBiometric from "@/components/Security/LoginBiometric";

<LoginBiometric 
  email={email}
  onSuccess={handleSuccess}
/>
```

---

## 🔒 GARANTÍAS DE SEGURIDAD

Los componentes separados garantizan:

1. ✅ **Type safety:** TypeScript rechaza props incorrectas
2. ✅ **Endpoints explícitos:** No hay confusión de rutas
3. ✅ **Auditabilidad:** Fácil rastrear qué componente se usó
4. ✅ **Mantenibilidad:** Un componente = un propósito

---

**Firmado por:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27
