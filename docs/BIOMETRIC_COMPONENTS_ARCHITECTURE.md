# Arquitectura de Componentes Biométricos - Legal PY

## 🎯 Objetivo

Separar completamente la biometría en dos componentes distintos, reutilizables y auditables:

1. **LoginBiometric.tsx** - Solo para inicio de sesión
2. **PayBiometric.tsx** - Solo para autorización de pagos

---

## 📦 Componentes

### 1. LoginBiometric.tsx

**Uso exclusivo**: Inicio de sesión passwordless

**Ubicación**: `/login`

**Endpoint**: `/api/webauthn/login/options` → `/api/webauthn/login/verify`

#### Props

```typescript
interface LoginBiometricProps {
  /** Email del usuario (requerido) */
  email: string;
  /** Callback cuando la autenticación es exitosa */
  onSuccess: (session?: any) => void;
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  /** Deshabilitar el componente */
  disabled?: boolean;
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  /** Modo demo */
  isDemoMode?: boolean;
}
```

#### Características

- ✅ Requiere `email` para buscar credenciales
- ✅ Endpoint específico: `/api/webauthn/login/*`
- ✅ Retorna sesión de usuario en `onSuccess`
- ✅ Texto: "Iniciar sesión con huella"
- ❌ NO puede autorizar pagos

---

### 2. PayBiometric.tsx

**Uso exclusivo**: Autorización de pagos, transferencias, suscripciones

**Ubicación**: Modales de pago, transferencias, suscripciones

**Endpoint**: `/api/webauthn/payment/options` → `/api/webauthn/payment/verify`

#### Props

```typescript
interface PaymentContext {
  userId: string;        // Requerido
  amount: number;        // Requerido
  currency: string;     // Requerido
  transactionId: string; // Requerido
}

interface PayBiometricProps {
  /** Contexto de pago - OBLIGATORIO para context binding */
  paymentContext: PaymentContext;
  /** Callback cuando la autorización es exitosa */
  onSuccess: () => void;
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  /** Deshabilitar el componente */
  disabled?: boolean;
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  /** Modo demo */
  isDemoMode?: boolean;
}
```

#### Características

- ✅ Requiere `paymentContext` completo (userId, amount, currency, transactionId)
- ✅ Endpoint específico: `/api/webauthn/payment/*`
- ✅ Context binding: challenge ligado al contexto
- ✅ Muestra monto y moneda (UX Fintech)
- ✅ Texto: "Confirmar pago {monto} con huella"
- ❌ NO puede iniciar sesión

---

## 🔐 Reglas de Seguridad

### LoginBiometric

- ✅ Solo para autenticación de usuarios
- ✅ Requiere email
- ❌ NO puede autorizar pagos
- ❌ NO acepta paymentContext

### PayBiometric

- ✅ Solo para autorización de pagos
- ✅ Requiere usuario autenticado (validar en el componente padre)
- ✅ Requiere paymentContext completo
- ✅ Context binding obligatorio
- ❌ NO puede iniciar sesión
- ❌ NO acepta email

### Separación Estricta

**Nunca permitir que**:
- `LoginBiometric` autorice pagos
- `PayBiometric` inicie sesión
- Se reutilicen challenges entre login y pagos

---

## 🎨 UX Diferencias

### LoginBiometric

- **Texto idle**: "Iniciar sesión con huella" (o "🎯 Demo: Iniciar sesión con huella")
- **Texto active**: "Verificando..."
- **Texto success**: "✓ Autenticado"
- **No muestra monto** (no aplica)

### PayBiometric

- **Muestra monto**: `Gs. 50.000` (o equivalente)
- **Texto idle**: "Confirmar pago Gs. 50.000 con huella"
- **Texto active**: "Autorizando..."
- **Texto success**: "✓ Pago autorizado"
- **Contexto visible**: Monto y moneda siempre visibles

---

## 📋 Diferencias de Lógica

### LoginBiometric

1. **Options Request**: Solo envía `email`
2. **Verify Request**: Envía assertion + `email`
3. **Backend Response**: Retorna `session` del usuario
4. **onSuccess**: Recibe `session` como parámetro

### PayBiometric

1. **Options Request**: Envía `userId`, `amount`, `currency`, `transactionId`
2. **Backend**: Liga challenge al contexto (context binding)
3. **Verify Request**: Envía assertion + contexto completo
4. **Backend**: Valida firma Y contexto (deben coincidir)
5. **onSuccess**: Solo confirma autorización (no retorna sesión)

---

## ⚠️ Errores Comunes de Implementación

### 1. Usar LoginBiometric para pagos

❌ **Incorrecto**:
```typescript
<LoginBiometric
  email={user.email}
  onSuccess={() => processPayment()} // ERROR: Login no autoriza pagos
/>
```

✅ **Correcto**:
```typescript
<PayBiometric
  paymentContext={{
    userId: user.id,
    amount: 50000,
    currency: "PYG",
    transactionId: "txn_123"
  }}
  onSuccess={() => processPayment()}
/>
```

### 2. Usar PayBiometric para login

❌ **Incorrecto**:
```typescript
<PayBiometric
  paymentContext={{...}}
  onSuccess={() => router.push("/panel")} // ERROR: Payment no inicia sesión
/>
```

✅ **Correcto**:
```typescript
<LoginBiometric
  email={email}
  onSuccess={(session) => {
    saveSession(session);
    router.push("/panel");
  }}
/>
```

### 3. Falta de validación de contexto

❌ **Incorrecto**:
```typescript
<PayBiometric
  paymentContext={{
    userId: user.id,
    // Falta amount, currency, transactionId
  }}
/>
```

✅ **Correcto**:
```typescript
<PayBiometric
  paymentContext={{
    userId: user.id,
    amount: 50000,
    currency: "PYG",
    transactionId: generateTransactionId(),
  }}
/>
```

### 4. Reutilizar componente genérico

❌ **Incorrecto**:
```typescript
<BiometricAuth mode="login" /> // Componente genérico
<BiometricAuth mode="payment" /> // Mezcla lógica
```

✅ **Correcto**:
```typescript
<LoginBiometric email={email} /> // Componente específico
<PayBiometric paymentContext={context} /> // Componente específico
```

---

## ✅ Buenas Prácticas Fintech

### 1. Separación de Responsabilidades

- Cada componente tiene un propósito único
- No mezclar lógica de login con pagos
- Endpoints separados en backend

### 2. Context Binding (Pagos)

- Siempre ligar challenge al contexto
- Validar contexto en backend
- Rechazar si contexto no coincide

### 3. Validación de Usuario (Pagos)

- Verificar que el usuario esté autenticado antes de mostrar `PayBiometric`
- Validar que `userId` en contexto coincida con sesión

### 4. UX Clara

- Mostrar monto en pagos
- Textos específicos por contexto
- Feedback visual diferenciado

### 5. Manejo de Errores

- Errores específicos por componente
- Mensajes claros para el usuario
- Logging para auditoría

### 6. Seguridad

- Challenges únicos por request
- Expiración de challenges (60s)
- Validación de origin y rpId
- Protección contra replay attacks

---

## 🔄 Migración desde BiometricAuth

### Antes (Componente Genérico)

```typescript
// Login
<BiometricAuth
  email={email}
  mode="login"
  onSuccess={handleLogin}
/>

// Payment
<BiometricAuth
  email={email}
  mode="payment"
  paymentContext={context}
  onSuccess={handlePayment}
/>
```

### Después (Componentes Separados)

```typescript
// Login
<LoginBiometric
  email={email}
  onSuccess={(session) => handleLogin(session)}
/>

// Payment
<PayBiometric
  paymentContext={context}
  onSuccess={handlePayment}
/>
```

---

## 📝 Checklist de Implementación

- [ ] Crear `LoginBiometric.tsx`
- [ ] Crear `PayBiometric.tsx`
- [ ] Actualizar `LoginForm.tsx` para usar `LoginBiometric`
- [ ] Actualizar `PaymentAuthorizationModal.tsx` para usar `PayBiometric`
- [ ] Validar que no se mezclen usos
- [ ] Agregar validaciones de contexto
- [ ] Actualizar documentación
- [ ] Tests de componentes separados

---

## 🎯 Resultado Final

- ✅ Separación completa de responsabilidades
- ✅ Componentes auditables y reutilizables
- ✅ Seguridad mejorada (context binding)
- ✅ UX clara y específica
- ✅ Preparado para backend real
- ✅ Fácil de mantener y extender
