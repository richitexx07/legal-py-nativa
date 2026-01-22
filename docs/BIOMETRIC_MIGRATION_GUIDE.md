# Guía de Migración: BiometricAuth → Componentes Separados

## 🎯 Objetivo

Migrar de `BiometricAuth` (componente genérico) a componentes separados:
- `LoginBiometric.tsx` - Solo login
- `PayBiometric.tsx` - Solo pagos

---

## 📋 Cambios Requeridos

### 1. LoginForm.tsx

#### Antes
```typescript
import BiometricAuth from "@/components/Security/BiometricAuth";

<BiometricAuth
  email={email}
  mode="login"
  onSuccess={handleLogin}
/>
```

#### Después
```typescript
import LoginBiometric from "@/components/Security/LoginBiometric";

<LoginBiometric
  email={email}
  onSuccess={(session) => handleLogin(session)}
/>
```

**Cambios**:
- ✅ Importar `LoginBiometric` en lugar de `BiometricAuth`
- ✅ Remover prop `mode="login"` (ya no es necesaria)
- ✅ `onSuccess` ahora recibe `session` como parámetro

---

### 2. PaymentAuthorizationModal.tsx

#### Antes
```typescript
import BiometricAuth from "@/components/Security/BiometricAuth";

<BiometricAuth
  email={email}
  mode="payment"
  paymentContext={context}
  onSuccess={handlePayment}
/>
```

#### Después
```typescript
import PayBiometric from "@/components/Security/PayBiometric";
import { getSession } from "@/lib/auth";

// Obtener userId de la sesión
const session = getSession();
const userId = session?.user?.id;

// Generar transactionId único
const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

<PayBiometric
  paymentContext={{
    userId: userId!, // Requerido
    amount: 50000,
    currency: "PYG",
    transactionId: transactionId,
  }}
  onSuccess={handlePayment}
/>
```

**Cambios**:
- ✅ Importar `PayBiometric` en lugar de `BiometricAuth`
- ✅ Remover prop `email` (no se usa en pagos)
- ✅ Remover prop `mode="payment"` (ya no es necesaria)
- ✅ Obtener `userId` de la sesión (requerido)
- ✅ Generar `transactionId` único
- ✅ `paymentContext` ahora es obligatorio y completo

---

## ✅ Checklist de Migración

- [ ] Actualizar imports en `LoginForm.tsx`
- [ ] Actualizar imports en `PaymentAuthorizationModal.tsx`
- [ ] Reemplazar `BiometricAuth` con `LoginBiometric` en login
- [ ] Reemplazar `BiometricAuth` con `PayBiometric` en pagos
- [ ] Agregar obtención de `userId` en modales de pago
- [ ] Agregar generación de `transactionId` en modales de pago
- [ ] Actualizar callbacks `onSuccess` para recibir `session` (login)
- [ ] Verificar que no se mezclen usos
- [ ] Probar flujo de login
- [ ] Probar flujo de pago
- [ ] Verificar modo demo funciona

---

## 🔍 Verificación Post-Migración

### Login
- [ ] `LoginBiometric` se muestra en `/login`
- [ ] Autenticación funciona (demo y producción)
- [ ] `onSuccess` recibe `session`
- [ ] Redirección funciona después de login

### Pagos
- [ ] `PayBiometric` se muestra en modales de pago
- [ ] Muestra monto y moneda correctamente
- [ ] `paymentContext` está completo
- [ ] Autorización funciona (demo y producción)
- [ ] Usuario debe estar autenticado

---

## ⚠️ Errores Comunes

### Error: "paymentContext completo es requerido"

**Causa**: Falta algún campo en `paymentContext`.

**Solución**: Asegurar que `userId`, `amount`, `currency` y `transactionId` estén presentes.

### Error: "Usuario no autenticado"

**Causa**: `PayBiometric` requiere usuario autenticado.

**Solución**: Verificar sesión antes de mostrar el componente.

### Error: "email es requerido"

**Causa**: `LoginBiometric` requiere email.

**Solución**: Asegurar que el email esté disponible antes de renderizar.

---

## 📝 Notas

- `BiometricAuth.tsx` se mantiene por compatibilidad pero está deprecado
- Los nuevos componentes están preparados para backend real
- Modo demo funciona en ambos componentes
- Separación estricta garantiza seguridad
