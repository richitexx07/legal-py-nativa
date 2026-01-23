# 🔐 GUÍA DE SEPARACIÓN: LoginBiometric vs PayBiometric

**Autor:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27  
**Principio:** Separación absoluta de contextos (Login vs Payment)

---

## 📊 COMPARACIÓN LADO A LADO

| Aspecto | LoginBiometric | PayBiometric |
|---------|----------------|--------------|
| **Endpoint Options** | `/api/webauthn/login/options` | `/api/webauthn/payment/options` |
| **Endpoint Verify** | `/api/webauthn/login/verify` | `/api/webauthn/payment/verify` |
| **Props Principal** | `email: string` | `paymentContext: PaymentContext` |
| **Requiere Sesión** | ❌ No | ✅ Sí (JWT) |
| **Context Binding** | ❌ No | ✅ Sí (amount, currency, transactionId) |
| **Headers en Request** | Sin Authorization | `Authorization: Bearer {JWT}` |
| **Body en Options** | `{ email }` | `{ userId, amount, currency, transactionId }` |
| **Body en Verify** | `{ credential, email }` | `{ credential, userId, amount, currency, transactionId }` |
| **Resultado** | `{ session: JWT, user }` | `{ transaction: { id, status: 'authorized' } }` |
| **Uso** | Página `/login` | Modales de pago, suscripciones |
| **Texto Botón** | "Iniciar sesión con huella" | "Confirmar pago {monto} con huella" |
| **Muestra Monto** | ❌ No | ✅ Sí (obligatorio) |

---

## 🔍 VERIFICACIÓN DE SEPARACIÓN

### Checklist: LoginBiometric.tsx

- [ ] ✅ Endpoint: `/api/webauthn/login/*` (NO `/payment/*`)
- [ ] ✅ Props: Solo `email`, NO `paymentContext`
- [ ] ✅ Request: Sin header `Authorization`
- [ ] ✅ Body: Solo `email`, NO `amount`, `currency`, `transactionId`
- [ ] ✅ Resultado: `session` (JWT), NO `transaction`
- [ ] ✅ Texto: "Iniciar sesión", NO "Confirmar pago"
- [ ] ✅ NO muestra monto

### Checklist: PayBiometric.tsx

- [ ] ✅ Endpoint: `/api/webauthn/payment/*` (NO `/login/*`)
- [ ] ✅ Props: Solo `paymentContext`, NO `email`
- [ ] ✅ Request: Con header `Authorization: Bearer {JWT}`
- [ ] ✅ Body: `userId`, `amount`, `currency`, `transactionId`
- [ ] ✅ Resultado: `transaction`, NO `session`
- [ ] ✅ Texto: "Confirmar pago {monto}"
- [ ] ✅ Muestra monto visiblemente

---

## ❌ ERRORES COMUNES DE IMPLEMENTACIÓN

### Error 1: Usar LoginBiometric para Pagos

**❌ INCORRECTO:**
```typescript
// En modal de pago
<LoginBiometric 
  email={user.email}
  onSuccess={(session) => {
    // ⚠️ PELIGROSO: No hay contexto de pago
    await processPayment(transactionId);
  }}
/>
```

**Problemas:**
- No hay context binding (amount, currency, transactionId)
- Backend no puede validar contexto
- Vulnerable a ataques de modificación de monto

**✅ CORRECTO:**
```typescript
// En modal de pago
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

### Error 2: Mezclar Endpoints

**❌ INCORRECTO:**
```typescript
// En PayBiometric usando endpoint de login
const optionsResponse = await fetch("/api/webauthn/login/options", {
  // ⚠️ PELIGROSO: Endpoint incorrecto
  body: JSON.stringify({ amount, currency })
});
```

**✅ CORRECTO:**
```typescript
// En PayBiometric usando endpoint correcto
const optionsResponse = await fetch("/api/webauthn/payment/options", {
  headers: {
    'Authorization': `Bearer ${session.token}`
  },
  body: JSON.stringify({
    userId: paymentContext.userId,
    amount: paymentContext.amount,
    currency: paymentContext.currency,
    transactionId: paymentContext.transactionId
  })
});
```

---

### Error 3: No Enviar Contexto en Verify

**❌ INCORRECTO:**
```typescript
// En PayBiometric verify
const verifyResponse = await fetch("/api/webauthn/payment/verify", {
  body: JSON.stringify({
    credential,
    challenge
    // ⚠️ FALTA: amount, currency, transactionId
  })
});
```

**✅ CORRECTO:**
```typescript
// En PayBiometric verify - CONTEXT BINDING OBLIGATORIO
const verifyResponse = await fetch("/api/webauthn/payment/verify", {
  headers: {
    'Authorization': `Bearer ${session.token}`
  },
  body: JSON.stringify({
    credential,
    challenge,
    // CONTEXT BINDING: Enviar contexto completo
    userId: paymentContext.userId,
    amount: paymentContext.amount,
    currency: paymentContext.currency,
    transactionId: paymentContext.transactionId
  })
});
```

---

### Error 4: No Verificar Sesión en PayBiometric

**❌ INCORRECTO:**
```typescript
// PayBiometric sin verificar sesión
const PayBiometric = ({ paymentContext, onSuccess }) => {
  const handleClick = async () => {
    // ⚠️ No verifica si hay sesión
    await fetch("/api/webauthn/payment/options", {
      // Falta Authorization header
    });
  };
};
```

**✅ CORRECTO:**
```typescript
// PayBiometric con verificación de sesión
const PayBiometric = ({ paymentContext, onSuccess }) => {
  const session = getSession();
  
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
    
    await fetch("/api/webauthn/payment/options", {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
  };
};
```

---

### Error 5: No Mostrar Monto en PayBiometric

**❌ INCORRECTO:**
```typescript
// PayBiometric sin mostrar monto
<PayBiometric paymentContext={ctx} />
// Usuario no sabe cuánto está autorizando
```

**✅ CORRECTO:**
```typescript
// PayBiometric mostrando monto (UX Fintech + Anti-Phishing)
<div className="payment-summary">
  <p className="amount">
    {formatCurrency(paymentContext.amount, paymentContext.currency)}
  </p>
</div>
<PayBiometric paymentContext={ctx} />
```

---

## ✅ BUENAS PRÁCTICAS FINTECH

### 1. Validación de Props en Runtime

```typescript
// LoginBiometric.tsx
useEffect(() => {
  if (!email) {
    console.error("LoginBiometric: email es requerido");
    onError?.("Email es requerido");
  }
}, [email]);

// PayBiometric.tsx
useEffect(() => {
  if (!paymentContext?.userId || !paymentContext?.amount || 
      !paymentContext?.currency || !paymentContext?.transactionId) {
    console.error("PayBiometric: paymentContext completo es requerido");
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
  onError?: (error: WebAuthnError) => void; // ✅ Tipado
}

// NO permitir props ambiguas
interface PayBiometricProps {
  paymentContext: PaymentContext; // ✅ Objeto específico
  // ❌ NO: amount?: number (ambiguo, puede confundirse con login)
}
```

---

### 3. Feedback Visual Claro

```typescript
// LoginBiometric: Texto de login
const labels = {
  idle: "Iniciar sesión con huella",
  active: "Verificando...",
  success: "✓ Autenticado"
};

// PayBiometric: Texto con monto
const labels = {
  idle: `Confirmar pago ${formatAmount(amount, currency)} con huella`,
  active: "Autorizando...",
  success: "✓ Pago autorizado"
};
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
  } else if (error.code === 'TRANSACTION_EXPIRED') {
    onError({ code: 'EXPIRED', message: 'La transacción expiró. Intenta nuevamente.' });
  }
}
```

---

### 5. Auditoría en Cliente

```typescript
// LoginBiometric: Registrar eventos de login
const handleSuccess = (session) => {
  analytics.track('webauthn_login_success', {
    method: 'biometric',
    email: email, // No PII en producción
    timestamp: Date.now()
  });
  onSuccess(session);
};

// PayBiometric: Registrar eventos de pago
const handleSuccess = () => {
  analytics.track('webauthn_payment_success', {
    method: 'biometric',
    transactionId: paymentContext.transactionId,
    amount: paymentContext.amount,
    currency: paymentContext.currency,
    timestamp: Date.now()
  });
  onSuccess();
};
```

---

## 🎨 UX FINTECH: DIFERENCIAS VISUALES

### LoginBiometric

```typescript
// Diseño: Simple, centrado en autenticación
<div className="login-biometric">
  <FingerprintIcon />
  <Text>Iniciar sesión con huella</Text>
  {/* NO muestra monto */}
</div>
```

### PayBiometric

```typescript
// Diseño: Destaca monto, genera confianza
<div className="payment-biometric">
  {/* Muestra monto destacado */}
  <div className="amount-display">
    <Currency>{currency}</Currency>
    <Value>{formatAmount(amount)}</Value>
  </div>
  
  <FingerprintIcon />
  <Text>Confirmar pago con huella</Text>
  
  {/* Badge de seguridad */}
  <SecurityBadge>
    🔒 Pago seguro con biometría
  </SecurityBadge>
</div>
```

---

## 🔒 GARANTÍAS DE SEGURIDAD

### Garantía 1: Imposible Usar Login para Pagos

**Implementación:**
```typescript
// LoginBiometric NO acepta paymentContext
interface LoginBiometricProps {
  email: string;
  // ❌ NO: paymentContext?: PaymentContext;
}

// TypeScript rechaza en compile-time
<LoginBiometric 
  email={email}
  paymentContext={ctx} // ❌ Error de TypeScript
/>
```

---

### Garantía 2: Imposible Usar Payment para Login

**Implementación:**
```typescript
// PayBiometric NO acepta email
interface PayBiometricProps {
  paymentContext: PaymentContext;
  // ❌ NO: email?: string;
}

// TypeScript rechaza en compile-time
<PayBiometric 
  paymentContext={ctx}
  email={email} // ❌ Error de TypeScript
/>
```

---

### Garantía 3: Endpoints Separados

**Implementación:**
```typescript
// Constantes para evitar typos
const LOGIN_ENDPOINTS = {
  options: '/api/webauthn/login/options',
  verify: '/api/webauthn/login/verify'
} as const;

const PAYMENT_ENDPOINTS = {
  options: '/api/webauthn/payment/options',
  verify: '/api/webauthn/payment/verify'
} as const;

// LoginBiometric usa LOGIN_ENDPOINTS
// PayBiometric usa PAYMENT_ENDPOINTS
```

---

## 📝 EJEMPLOS DE USO CORRECTO

### Ejemplo 1: Login en `/login`

```typescript
// app/login/page.tsx
import LoginBiometric from "@/components/Security/LoginBiometric";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  
  return (
    <div>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      {/* ✅ CORRECTO: LoginBiometric para login */}
      <LoginBiometric 
        email={email}
        onSuccess={(session) => {
          // Guardar sesión
          saveSession(session);
          router.push("/panel");
        }}
        onError={(error) => {
          console.error("Error de login:", error);
        }}
      />
    </div>
  );
}
```

---

### Ejemplo 2: Pago en Modal de Suscripción

```typescript
// components/Payments/SubscriptionModal.tsx
import PayBiometric from "@/components/Security/PayBiometric";
import { getSession } from "@/lib/auth";

export default function SubscriptionModal({ planId, amount, currency }) {
  const session = getSession();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Generar transactionId único
    setTransactionId(`txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);
  
  if (!session || !transactionId) return null;
  
  return (
    <Modal>
      {/* ✅ CORRECTO: Mostrar monto */}
      <div className="payment-summary">
        <h3>Confirmar suscripción</h3>
        <p className="amount">
          {formatCurrency(amount, currency)}
        </p>
      </div>
      
      {/* ✅ CORRECTO: PayBiometric para pago */}
      <PayBiometric 
        paymentContext={{
          userId: session.user.id,
          amount,
          currency,
          transactionId
        }}
        onSuccess={() => {
          // Pago autorizado
          handleSubscriptionSuccess(transactionId);
        }}
        onError={(error) => {
          console.error("Error de autorización:", error);
        }}
      />
    </Modal>
  );
}
```

---

## 🧪 TESTS DE SEPARACIÓN

### Test 1: LoginBiometric NO puede autorizar pagos

```typescript
test('LoginBiometric no acepta paymentContext', () => {
  // TypeScript debe rechazar esto
  // @ts-expect-error
  <LoginBiometric 
    email="test@example.com"
    paymentContext={{ amount: 100, currency: 'PYG' }}
  />
});
```

---

### Test 2: PayBiometric NO puede iniciar sesión

```typescript
test('PayBiometric no acepta email', () => {
  // TypeScript debe rechazar esto
  // @ts-expect-error
  <PayBiometric 
    paymentContext={ctx}
    email="test@example.com"
  />
});
```

---

### Test 3: Endpoints correctos

```typescript
test('LoginBiometric usa endpoint de login', async () => {
  const { getByRole } = render(<LoginBiometric email="test@example.com" />);
  const button = getByRole('button');
  fireEvent.click(button);
  
  expect(fetch).toHaveBeenCalledWith(
    '/api/webauthn/login/options', // ✅ Endpoint correcto
    expect.any(Object)
  );
});

test('PayBiometric usa endpoint de payment', async () => {
  const { getByRole } = render(<PayBiometric paymentContext={ctx} />);
  const button = getByRole('button');
  fireEvent.click(button);
  
  expect(fetch).toHaveBeenCalledWith(
    '/api/webauthn/payment/options', // ✅ Endpoint correcto
    expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': expect.stringContaining('Bearer')
      })
    })
  );
});
```

---

## 🎯 PRINCIPIOS DE DISEÑO

1. **Separación absoluta:** Un componente = un propósito
2. **Type safety:** TypeScript estricto previene errores en compile-time
3. **Props mínimas:** Solo lo necesario, sin opciones ambiguas
4. **Endpoints explícitos:** Constantes previenen typos
5. **UX clara:** Usuario siempre sabe qué está autorizando
6. **Auditabilidad:** Fácil rastrear qué componente se usó

---

## ✅ CHECKLIST FINAL

Antes de merge a producción:

- [ ] LoginBiometric solo usa `/api/webauthn/login/*`
- [ ] PayBiometric solo usa `/api/webauthn/payment/*`
- [ ] LoginBiometric NO acepta `paymentContext`
- [ ] PayBiometric NO acepta `email`
- [ ] PayBiometric requiere sesión (JWT)
- [ ] PayBiometric muestra monto visiblemente
- [ ] PayBiometric envía contexto completo en verify
- [ ] TypeScript compila sin errores
- [ ] Tests de separación pasan
- [ ] Documentación actualizada

---

**Firmado por:** Senior Frontend Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
