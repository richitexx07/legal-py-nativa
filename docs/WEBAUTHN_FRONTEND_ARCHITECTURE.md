# 🎨 ARQUITECTURA FRONTEND WEBAUTHN - LEGAL PY

**Autor:** Senior Frontend Security Engineer (React + WebAuthn + Fintech UX)  
**Fecha:** 2025-01-27  
**Principio:** Separación absoluta de contextos (Login vs Payment)

---

## 📋 ÍNDICE

1. [Arquitectura de Componentes](#arquitectura-de-componentes)
2. [Separación de Responsabilidades](#separación-de-responsabilidades)
3. [Props y Tipos](#props-y-tipos)
4. [Flujos de Usuario](#flujos-de-usuario)
5. [Errores Comunes](#errores-comunes)
6. [Buenas Prácticas Fintech](#buenas-prácticas-fintech)

---

## 🏗️ ARQUITECTURA DE COMPONENTES

### Estructura de Archivos

```
components/
  Security/
    LoginBiometric.tsx      # Solo para login
    PayBiometric.tsx        # Solo para pagos
    WebAuthnTypes.ts        # Tipos compartidos (sin lógica)
    WebAuthnUtils.ts        # Utilidades compartidas (sin contexto)
```

### Principio de Separación

```
┌─────────────────────────────────────────────────────────┐
│                    SEPARACIÓN ABSOLUTA                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  LoginBiometric.tsx          PayBiometric.tsx            │
│  ├─ Endpoint: /login/*      ├─ Endpoint: /payment/*    │
│  ├─ Sin sesión previa       ├─ Requiere sesión          │
│  ├─ Props: email            ├─ Props: paymentContext    │
│  └─ Resultado: JWT          └─ Resultado: authorized    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**⚠️ REGLA CRÍTICA:** Nunca compartir lógica de negocio entre componentes.

---

## 🔀 SEPARACIÓN DE RESPONSABILIDADES

### `LoginBiometric.tsx`

**Responsabilidad Única:** Autenticación passwordless

**Características:**
- ✅ No requiere sesión previa
- ✅ Endpoint: `/api/webauthn/login/options` y `/verify`
- ✅ Props mínimas: `email`, `onSuccess`, `onError`
- ✅ Resultado: Sesión JWT
- ❌ NO puede autorizar pagos
- ❌ NO recibe `amount`, `currency`, `transactionId`

**Casos de Uso:**
- Página de login (`/login`)
- Recuperación de cuenta (opcional)
- Cambio de dispositivo

---

### `PayBiometric.tsx`

**Responsabilidad Única:** Autorización de transacciones financieras

**Características:**
- ✅ Requiere sesión autenticada (JWT)
- ✅ Endpoint: `/api/webauthn/payment/options` y `/verify`
- ✅ Props: `paymentContext` (objeto con `amount`, `currency`, `transactionId`)
- ✅ Resultado: Transacción autorizada
- ❌ NO puede iniciar sesión
- ❌ NO recibe `email`

**Casos de Uso:**
- Modal de pago de suscripción
- Confirmación de transferencia
- Autorización de transacción alta
- Cambio de plan premium

---

## 📦 PROPS Y TIPOS

### `LoginBiometric.tsx` - Props

```typescript
interface LoginBiometricProps {
  /** Email del usuario (requerido para buscar credenciales) */
  email: string;
  
  /** Callback cuando la autenticación es exitosa */
  onSuccess: (session: {
    token: string;
    expiresAt: string;
    user: {
      id: string;
      email: string;
    };
  }) => void;
  
  /** Callback cuando hay error */
  onError: (error: {
    code: string;
    message: string;
    type: 'NETWORK_ERROR' | 'VERIFICATION_FAILED' | 'USER_CANCELLED' | 'NOT_SUPPORTED';
  }) => void;
  
  /** Tamaño del botón */
  size?: 'sm' | 'md' | 'lg';
  
  /** Si está deshabilitado */
  disabled?: boolean;
  
  /** Texto personalizado del botón */
  buttonText?: string;
  
  /** Si mostrar loading state */
  showLoading?: boolean;
}
```

---

### `PayBiometric.tsx` - Props

```typescript
interface PaymentContext {
  /** ID de la transacción (único, generado por backend) */
  transactionId: string;
  
  /** Monto de la transacción */
  amount: number;
  
  /** Moneda (PYG, USD, EUR) */
  currency: string;
  
  /** Descripción opcional */
  description?: string;
}

interface PayBiometricProps {
  /** Contexto del pago (OBLIGATORIO) */
  paymentContext: PaymentContext;
  
  /** Callback cuando la autorización es exitosa */
  onSuccess: (result: {
    verified: true;
    transaction: {
      id: string;
      status: 'authorized';
      authorizedAt: string;
    };
  }) => void;
  
  /** Callback cuando hay error */
  onError: (error: {
    code: string;
    message: string;
    type: 'NETWORK_ERROR' | 'VERIFICATION_FAILED' | 'CONTEXT_MISMATCH' | 'USER_CANCELLED' | 'NOT_SUPPORTED';
  }) => void;
  
  /** Tamaño del botón */
  size?: 'sm' | 'md' | 'lg';
  
  /** Si está deshabilitado */
  disabled?: boolean;
  
  /** Si mostrar detalles del pago */
  showPaymentDetails?: boolean;
  
  /** Si mostrar loading state */
  showLoading?: boolean;
}
```

---

## 🔄 FLUJOS DE USUARIO

### Flujo 1: Login Biométrico

```
Usuario en /login
    │
    ├─> Ingresa email
    │
    ├─> <LoginBiometric email={email} />
    │
    ├─> Usuario hace clic en botón
    │
    ├─> POST /api/webauthn/login/options
    │   └─> Backend retorna challenge + allowCredentials
    │
    ├─> navigator.credentials.get({ publicKey: options })
    │   └─> Usuario autentica con huella/face ID
    │
    ├─> POST /api/webauthn/login/verify
    │   └─> Backend verifica firma
    │
    ├─> onSuccess({ session, user })
    │   └─> Guardar JWT en localStorage/cookie
    │   └─> Redirigir a /panel
    │
    └─> ✅ Usuario autenticado
```

---

### Flujo 2: Autorización de Pago

```
Usuario en modal de pago (ya autenticado)
    │
    ├─> <PayBiometric paymentContext={{ amount, currency, transactionId }} />
    │
    ├─> Usuario hace clic en "Confirmar pago con huella"
    │
    ├─> POST /api/webauthn/payment/options
    │   └─> Headers: Authorization: Bearer {JWT}
    │   └─> Body: { amount, currency, transactionId }
    │   └─> Backend retorna challenge + allowCredentials
    │
    ├─> navigator.credentials.get({ publicKey: options })
    │   └─> Usuario autentica con huella/face ID
    │
    ├─> POST /api/webauthn/payment/verify
    │   └─> Headers: Authorization: Bearer {JWT}
    │   └─> Body: { credential, challenge, transactionId }
    │   └─> Backend verifica firma + contexto
    │
    ├─> onSuccess({ transaction })
    │   └─> Cerrar modal
    │   └─> Mostrar confirmación
    │   └─> Actualizar UI
    │
    └─> ✅ Pago autorizado
```

---

## ❌ ERRORES COMUNES

### Error 1: Reutilizar Componente para Ambos Contextos

**❌ INCORRECTO:**
```typescript
// Componente "universal" que hace ambas cosas
<BiometricAuth 
  mode="login" // o "payment"
  email={email}
  amount={amount} // Solo para payment
/>
```

**Problemas:**
- Lógica mezclada
- Fácil confundir contextos
- Difícil auditar
- Violación de principio de responsabilidad única

**✅ CORRECTO:**
```typescript
// Componentes separados
<LoginBiometric email={email} onSuccess={handleLogin} />
<PayBiometric paymentContext={paymentContext} onSuccess={handlePayment} />
```

---

### Error 2: Usar LoginBiometric para Pagos

**❌ INCORRECTO:**
```typescript
// Intentar usar login para autorizar pago
<LoginBiometric 
  email={user.email}
  onSuccess={(session) => {
    // ⚠️ PELIGROSO: No hay contexto de pago
    await processPayment(transactionId);
  }}
/>
```

**Problemas:**
- No hay binding de contexto (amount, currency, transactionId)
- Vulnerable a ataques de contexto
- No cumple estándares fintech

**✅ CORRECTO:**
```typescript
// Usar componente específico para pagos
<PayBiometric 
  paymentContext={{
    transactionId,
    amount,
    currency
  }}
  onSuccess={handlePaymentSuccess}
/>
```

---

### Error 3: No Validar Sesión en PayBiometric

**❌ INCORRECTO:**
```typescript
// PayBiometric sin verificar sesión
const PayBiometric = ({ paymentContext, onSuccess }) => {
  // ⚠️ No verifica si hay sesión
  const handleClick = async () => {
    await fetch('/api/webauthn/payment/options', {
      // Falta Authorization header
    });
  };
};
```

**✅ CORRECTO:**
```typescript
const PayBiometric = ({ paymentContext, onSuccess }) => {
  const session = getSession(); // Verificar sesión
  
  useEffect(() => {
    if (!session) {
      onError({
        code: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión primero',
        type: 'VERIFICATION_FAILED'
      });
    }
  }, [session]);
  
  const handleClick = async () => {
    if (!session) return;
    
    await fetch('/api/webauthn/payment/options', {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
  };
};
```

---

### Error 4: No Mostrar Detalles del Pago

**❌ INCORRECTO:**
```typescript
// Botón sin contexto visual
<PayBiometric paymentContext={ctx} />
// Usuario no sabe cuánto está autorizando
```

**✅ CORRECTO:**
```typescript
// Mostrar detalles claros
<PayBiometric 
  paymentContext={ctx}
  showPaymentDetails={true}
/>
// Renderiza: "Confirmar pago de Gs. 150.000"
```

---

### Error 5: Manejo de Errores Genérico

**❌ INCORRECTO:**
```typescript
catch (error) {
  onError({ message: 'Error' }); // Muy genérico
}
```

**✅ CORRECTO:**
```typescript
catch (error) {
  if (error.code === 'CONTEXT_MISMATCH') {
    onError({
      code: 'CONTEXT_MISMATCH',
      message: 'El contexto del pago no coincide. Por seguridad, la transacción fue cancelada.',
      type: 'VERIFICATION_FAILED'
    });
  } else if (error.code === 'USER_CANCELLED') {
    // No es error, solo cancelación
    return;
  } else {
    onError({
      code: error.code || 'UNKNOWN_ERROR',
      message: 'No se pudo completar la autorización. Intenta nuevamente.',
      type: 'NETWORK_ERROR'
    });
  }
}
```

---

## ✅ BUENAS PRÁCTICAS FINTECH

### 1. Feedback Visual Inmediato

```typescript
// Estados claros
const [state, setState] = useState<'idle' | 'requesting' | 'authenticating' | 'verifying' | 'success' | 'error'>('idle');

// Mostrar estado actual
{state === 'requesting' && <Spinner />}
{state === 'authenticating' && <Text>Esperando tu huella...</Text>}
{state === 'verifying' && <Text>Verificando...</Text>}
```

---

### 2. Mostrar Monto en PayBiometric

```typescript
// Siempre mostrar monto antes de autorizar
<div className="payment-summary">
  <p className="amount">
    {formatCurrency(paymentContext.amount, paymentContext.currency)}
  </p>
  <p className="description">{paymentContext.description}</p>
</div>
<PayBiometric paymentContext={paymentContext} />
```

---

### 3. Timeout y Reintentos

```typescript
// Timeout de 60s (estándar WebAuthn)
const options = await fetchOptions();
const timeout = options.timeout || 60000;

// Si expira, permitir reintentar
try {
  const credential = await navigator.credentials.get({
    publicKey: options,
    signal: AbortSignal.timeout(timeout)
  });
} catch (error) {
  if (error.name === 'TimeoutError') {
    onError({
      code: 'TIMEOUT',
      message: 'Tiempo de espera agotado. Intenta nuevamente.',
      type: 'VERIFICATION_FAILED'
    });
  }
}
```

---

### 4. Validación de Disponibilidad

```typescript
// Verificar soporte antes de mostrar componente
const isWebAuthnSupported = () => {
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create
  );
};

// Solo renderizar si está soportado
{isWebAuthnSupported() ? (
  <LoginBiometric email={email} />
) : (
  <Button>Usar contraseña</Button>
)}
```

---

### 5. Auditoría en Cliente

```typescript
// Registrar eventos importantes
const handleSuccess = (result) => {
  // Auditoría
  analytics.track('webauthn_login_success', {
    method: 'biometric',
    timestamp: Date.now()
  });
  
  onSuccess(result);
};
```

---

### 6. Manejo de Cancelación

```typescript
// No tratar cancelación como error
try {
  const credential = await navigator.credentials.get({...});
} catch (error) {
  if (error.name === 'NotAllowedError') {
    // Usuario canceló - no es error
    return;
  }
  // Otros errores sí son errores
  onError({...});
}
```

---

### 7. UX de Confianza (Fintech)

```typescript
// Mostrar seguridad visible
<div className="security-badge">
  <LockIcon />
  <span>Pago seguro con biometría</span>
</div>

// Mostrar monto destacado
<div className="amount-display">
  <span className="currency">{currency}</span>
  <span className="value">{formatAmount(amount)}</span>
</div>

// Botón claro y accesible
<Button 
  size="lg"
  className="biometric-button"
  disabled={disabled || !isSupported}
>
  <FingerprintIcon />
  Confirmar pago con huella
</Button>
```

---

## 📊 COMPARACIÓN DE COMPONENTES

| Característica | LoginBiometric | PayBiometric |
|----------------|----------------|--------------|
| **Endpoint** | `/login/*` | `/payment/*` |
| **Requiere sesión** | ❌ No | ✅ Sí |
| **Props principales** | `email` | `paymentContext` |
| **Context binding** | ❌ No | ✅ Sí (amount, currency, transactionId) |
| **Resultado** | JWT session | Transaction authorized |
| **Uso** | `/login` | Modales de pago |
| **Validación backend** | Email + firma | Context + firma |

---

## 🔍 CHECKLIST DE IMPLEMENTACIÓN

### LoginBiometric.tsx

- [ ] Props: `email`, `onSuccess`, `onError`
- [ ] Endpoint: `/api/webauthn/login/options`
- [ ] Endpoint: `/api/webauthn/login/verify`
- [ ] No requiere sesión previa
- [ ] Manejo de errores específicos
- [ ] Feedback visual (loading, success, error)
- [ ] Validación de soporte WebAuthn
- [ ] Timeout de 60s
- [ ] No incluir lógica de pagos

### PayBiometric.tsx

- [ ] Props: `paymentContext`, `onSuccess`, `onError`
- [ ] Endpoint: `/api/webauthn/payment/options`
- [ ] Endpoint: `/api/webauthn/payment/verify`
- [ ] Requiere sesión (verificar JWT)
- [ ] Incluir `Authorization` header
- [ ] Mostrar monto y moneda
- [ ] Context binding (transactionId en verify)
- [ ] Manejo de errores específicos
- [ ] Feedback visual
- [ ] No incluir lógica de login

---

## 🎯 PRINCIPIOS DE DISEÑO

1. **Separación absoluta:** Un componente = un propósito
2. **Props mínimas:** Solo lo necesario, sin opciones ambiguas
3. **Type safety:** TypeScript estricto, sin `any`
4. **Error handling:** Errores específicos, no genéricos
5. **UX clara:** Usuario siempre sabe qué está autorizando
6. **Auditabilidad:** Fácil rastrear qué componente se usó

---

**Firmado por:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
