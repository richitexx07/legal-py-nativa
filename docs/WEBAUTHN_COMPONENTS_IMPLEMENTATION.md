# 🎨 IMPLEMENTACIÓN: LoginBiometric y PayBiometric

**Autor:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27

---

## 📦 PROPS EXACTAS

### LoginBiometric.tsx

```typescript
interface LoginBiometricProps {
  /** Email del usuario (requerido para buscar credenciales) */
  email: string;
  
  /** Callback cuando la autenticación es exitosa */
  onSuccess: (session?: {
    token: string;
    expiresAt: string;
    user: {
      id: string;
      email: string;
    };
  }) => void;
  
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  
  /** Deshabilitar el componente */
  disabled?: boolean;
  
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  
  /** Modo demo: true = simula sin backend, false = usa backend real */
  isDemoMode?: boolean;
}
```

**Reglas:**
- ✅ Solo acepta `email` (string)
- ❌ NO acepta `paymentContext`
- ❌ NO acepta `amount`, `currency`, `transactionId`

---

### PayBiometric.tsx

```typescript
interface PaymentContext {
  /** ID del usuario que autoriza el pago (requerido) */
  userId: string;
  /** Monto de la transacción (requerido) */
  amount: number;
  /** Moneda (requerido) */
  currency: string;
  /** ID único de la transacción (requerido) */
  transactionId: string;
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
  
  /** Modo demo: true = simula sin backend, false = usa backend real */
  isDemoMode?: boolean;
}
```

**Reglas:**
- ✅ Solo acepta `paymentContext` (objeto completo)
- ❌ NO acepta `email`
- ❌ NO acepta props individuales (`amount`, `currency`, etc.)

---

## 🔄 DIFERENCIAS DE LÓGICA

### 1. Endpoints

**LoginBiometric:**
```typescript
// Options
POST /api/webauthn/login/options
Body: { email }

// Verify
POST /api/webauthn/login/verify
Body: { credential, email }
```

**PayBiometric:**
```typescript
// Options
POST /api/webauthn/payment/options
Headers: { Authorization: Bearer {JWT} }
Body: { userId, amount, currency, transactionId }

// Verify
POST /api/webauthn/payment/verify
Headers: { Authorization: Bearer {JWT} }
Body: { credential, userId, amount, currency, transactionId }
```

---

### 2. Validación de Sesión

**LoginBiometric:**
```typescript
// NO requiere sesión previa
// Puede usarse sin autenticación
```

**PayBiometric:**
```typescript
// REQUIERE sesión autenticada
const session = getSession();
if (!session || !session.token) {
  throw new Error("Sesión no encontrada");
}

// Incluir JWT en headers
headers: {
  'Authorization': `Bearer ${session.token}`
}
```

---

### 3. Context Binding

**LoginBiometric:**
```typescript
// NO tiene context binding
// Challenge ligado solo a email
```

**PayBiometric:**
```typescript
// CONTEXT BINDING OBLIGATORIO
// Challenge ligado a: userId, amount, currency, transactionId

// En options
body: JSON.stringify({
  userId: paymentContext.userId,
  amount: paymentContext.amount,
  currency: paymentContext.currency,
  transactionId: paymentContext.transactionId
})

// En verify (CRÍTICO)
body: JSON.stringify({
  credential,
  challenge,
  // Context binding para validación backend
  userId: paymentContext.userId,
  amount: paymentContext.amount,
  currency: paymentContext.currency,
  transactionId: paymentContext.transactionId
})
```

---

### 4. Resultado

**LoginBiometric:**
```typescript
onSuccess({
  session: {
    token: "jwt-token",
    expiresAt: "2025-01-27T12:00:00Z"
  },
  user: {
    id: "usr_123",
    email: "usuario@example.com"
  }
})
```

**PayBiometric:**
```typescript
onSuccess() // Sin parámetros
// El backend ya autorizó la transacción
// Verificar estado en BD si es necesario
```

---

### 5. UX Visual

**LoginBiometric:**
```typescript
// Texto simple
"Iniciar sesión con huella"

// NO muestra monto
// NO muestra detalles de transacción
```

**PayBiometric:**
```typescript
// Texto con monto
`Confirmar pago ${formatAmount(amount, currency)} con huella`

// Muestra monto destacado
<div className="amount-display">
  <p>Monto a autorizar</p>
  <p className="amount">{formatAmount(amount, currency)}</p>
</div>

// Muestra dominio (anti-phishing)
<p>🔒 {window.location.hostname}</p>
```

---

## ❌ ERRORES COMUNES DE IMPLEMENTACIÓN

### Error 1: Falta Header Authorization en PayBiometric

**❌ INCORRECTO:**
```typescript
// PayBiometric sin JWT
const optionsResponse = await fetch("/api/webauthn/payment/options", {
  headers: { "Content-Type": "application/json" },
  // ⚠️ Falta Authorization
});
```

**✅ CORRECTO:**
```typescript
// PayBiometric con JWT
const session = getSession();
const optionsResponse = await fetch("/api/webauthn/payment/options", {
  headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.token}` // ✅ REQUERIDO
  },
});
```

---

### Error 2: No Enviar Contexto en Verify

**❌ INCORRECTO:**
```typescript
// PayBiometric verify sin contexto
const verifyResponse = await fetch("/api/webauthn/payment/verify", {
  body: JSON.stringify({
    credential,
    challenge
    // ⚠️ Falta: userId, amount, currency, transactionId
  })
});
```

**✅ CORRECTO:**
```typescript
// PayBiometric verify con contexto completo
const verifyResponse = await fetch("/api/webauthn/payment/verify", {
  headers: {
    "Authorization": `Bearer ${session.token}`
  },
  body: JSON.stringify({
    credential,
    challenge,
    // ✅ CONTEXT BINDING: Enviar contexto completo
    userId: paymentContext.userId,
    amount: paymentContext.amount,
    currency: paymentContext.currency,
    transactionId: paymentContext.transactionId
  })
});
```

---

### Error 3: Usar LoginBiometric en Modal de Pago

**❌ INCORRECTO:**
```typescript
// En modal de suscripción
<LoginBiometric 
  email={user.email}
  onSuccess={(session) => {
    // ⚠️ PELIGROSO: No hay contexto de pago
    await processPayment(transactionId);
  }}
/>
```

**✅ CORRECTO:**
```typescript
// En modal de suscripción
<PayBiometric 
  paymentContext={{
    userId: user.id,
    amount: 150000,
    currency: 'PYG',
    transactionId: 'txn_abc123'
  }}
  onSuccess={() => {
    // Pago ya autorizado por backend
    handlePaymentSuccess();
  }}
/>
```

---

### Error 4: No Validar Sesión en PayBiometric

**❌ INCORRECTO:**
```typescript
// PayBiometric sin verificar sesión
const PayBiometric = ({ paymentContext, onSuccess }) => {
  const handleClick = async () => {
    // ⚠️ No verifica si hay sesión
    await fetch("/api/webauthn/payment/options", {...});
  };
};
```

**✅ CORRECTO:**
```typescript
// PayBiometric con validación de sesión
const PayBiometric = ({ paymentContext, onSuccess }) => {
  const session = getSession();
  
  useEffect(() => {
    if (!session) {
      onError("Debes iniciar sesión para autorizar pagos");
    }
  }, [session]);
  
  const handleClick = async () => {
    if (!session) return;
    // ...
  };
};
```

---

### Error 5: No Mostrar Monto

**❌ INCORRECTO:**
```typescript
// PayBiometric sin mostrar monto
<PayBiometric paymentContext={ctx} />
// Usuario no sabe cuánto está autorizando
```

**✅ CORRECTO:**
```typescript
// PayBiometric mostrando monto (ya implementado)
<div className="amount-display">
  <p className="text-sm text-white/60 mb-1">Monto a autorizar</p>
  <p className="text-2xl font-bold text-[#C9A24D]">
    {formatAmount(paymentContext.amount, paymentContext.currency)}
  </p>
</div>
<PayBiometric paymentContext={ctx} />
```

---

## ✅ BUENAS PRÁCTICAS FINTECH

### 1. Validación de Props en Runtime

```typescript
// LoginBiometric
useEffect(() => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("LoginBiometric: email inválido");
    onError?.("Email inválido");
  }
}, [email]);

// PayBiometric
useEffect(() => {
  if (!paymentContext?.userId || 
      !paymentContext?.amount || 
      !paymentContext?.currency || 
      !paymentContext?.transactionId) {
    console.error("PayBiometric: paymentContext incompleto");
    onError?.("Contexto de pago incompleto");
  }
}, [paymentContext]);
```

---

### 2. Type Safety Estricto

```typescript
// NO usar 'any'
interface LoginBiometricProps {
  email: string; // ✅ Específico
  onSuccess: (session: AuthSession) => void; // ✅ Tipado
}

// NO permitir props ambiguas
interface PayBiometricProps {
  paymentContext: PaymentContext; // ✅ Objeto específico
  // ❌ NO: amount?: number (ambiguo)
}
```

---

### 3. Feedback Visual Inmediato

```typescript
// Estados claros y visibles
const [state, setState] = useState<'idle' | 'active' | 'success' | 'error'>('idle');

// Mostrar estado actual
{state === 'active' && <Spinner />}
{state === 'success' && <CheckIcon />}
{state === 'error' && <ErrorIcon />}
```

---

### 4. Manejo de Errores Específicos

```typescript
// LoginBiometric: Errores de autenticación
catch (error) {
  if (error.code === 'INVALID_CHALLENGE') {
    onError({ code: 'AUTH_FAILED', message: 'Challenge inválido' });
  } else if (error.code === 'CREDENTIAL_NOT_FOUND') {
    onError({ code: 'NO_CREDENTIALS', message: 'No tienes biometría registrada' });
  }
}

// PayBiometric: Errores de autorización
catch (error) {
  if (error.code === 'CONTEXT_MISMATCH') {
    onError({ 
      code: 'PAYMENT_AUTH_FAILED', 
      message: 'El contexto del pago no coincide. Por seguridad, la transacción fue cancelada.' 
    });
  } else if (error.code === 'UNAUTHORIZED') {
    onError({ code: 'SESSION_REQUIRED', message: 'Debes iniciar sesión primero' });
  }
```

---

### 5. UX de Confianza (Fintech)

```typescript
// PayBiometric: Mostrar seguridad visible
<div className="security-badge">
  <LockIcon />
  <span>Pago seguro con biometría</span>
</div>

// Mostrar monto destacado
<div className="amount-display">
  <Currency>{currency}</Currency>
  <Value>{formatAmount(amount)}</Value>
</div>

// Mostrar dominio (anti-phishing)
<p className="domain">🔒 {window.location.hostname}</p>
```

---

## 📊 MATRIZ DE VERIFICACIÓN

| Verificación | LoginBiometric | PayBiometric |
|--------------|----------------|--------------|
| Endpoint correcto | ✅ `/login/*` | ✅ `/payment/*` |
| Props correctas | ✅ Solo `email` | ✅ Solo `paymentContext` |
| Header Authorization | ❌ No requiere | ✅ Requerido |
| Context binding | ❌ No | ✅ Sí (obligatorio) |
| Muestra monto | ❌ No | ✅ Sí |
| Valida sesión | ❌ No | ✅ Sí |
| Texto apropiado | ✅ "Iniciar sesión" | ✅ "Confirmar pago {monto}" |

---

## 🎯 PRINCIPIOS DE DISEÑO

1. **Separación absoluta:** Un componente = un propósito
2. **Type safety:** TypeScript estricto previene errores
3. **Props mínimas:** Solo lo necesario, sin ambigüedad
4. **Endpoints explícitos:** Constantes previenen typos
5. **UX clara:** Usuario siempre sabe qué está autorizando
6. **Auditabilidad:** Fácil rastrear qué componente se usó

---

**Firmado por:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
