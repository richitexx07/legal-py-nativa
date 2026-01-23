# 🛡️ CONTROLES DE SEGURIDAD: WebAuthn Legal PY

**Autor:** Security Architect (Threat Modeling Fintech)  
**Fecha:** 2025-01-27  
**Nivel:** Banco Digital / Fintech

---

## 📋 ÍNDICE

1. [Controles de Backend](#controles-de-backend)
2. [Controles de Frontend](#controles-de-frontend)
3. [Controles de Infraestructura](#controles-de-infraestructura)
4. [Controles de Monitoreo](#controles-de-monitoreo)
5. [Controles de Respuesta a Incidentes](#controles-de-respuesta-a-incidentes)

---

## 🔐 CONTROLES DE BACKEND

### 1. Validación de Origin y RP ID

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/login/verify y /api/webauthn/payment/verify
const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'https://legal-py.vercel.app';
const expectedRpId = process.env.WEBAUTHN_RP_ID || 'legal-py.vercel.app';

// Validar origin del request
if (response.origin !== expectedOrigin) {
  auditLog.error('Invalid origin', { origin: response.origin, expected: expectedOrigin });
  throw new Error('Invalid origin');
}

// Validar rpId
if (options.rpId !== expectedRpId) {
  auditLog.error('Invalid rpId', { rpId: options.rpId, expected: expectedRpId });
  throw new Error('Invalid rpId');
}
```

**Justificación:** Previene phishing y ataques cross-origin.

---

### 2. Challenge Único con TTL

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/login/options y /api/webauthn/payment/options
import { randomBytes } from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Generar challenge único
const challenge = randomBytes(32);
const challengeId = crypto.randomUUID();

// Almacenar en Redis con TTL de 60s
await redis.setex(
  `webauthn:challenge:${challengeId}`,
  60, // 60 segundos
  JSON.stringify({
    challenge: challenge.toString('base64'),
    userId: mode === 'login' ? null : userId, // Para login, userId se obtiene después
    email: mode === 'login' ? email : null,
    timestamp: Date.now(),
    context: mode === 'payment' ? {
      userId,
      amount,
      currency,
      transactionId
    } : null
  })
);

// Retornar challenge al frontend
return {
  challenge: challenge.toString('base64'),
  challengeId,
  rpId: expectedRpId,
  timeout: 60000
};
```

**Justificación:** Previene replay attacks.

---

### 3. SignCount Validation

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/login/verify y /api/webauthn/payment/verify
const credential = await db.webauthn_credentials.findOne({
  where: { credentialId: assertion.id }
});

if (!credential) {
  throw new Error('Credential not found');
}

const currentSignCount = credential.signCount;
const responseSignCount = assertion.response.signCount;

// Validar signCount (debe ser mayor que el almacenado)
if (responseSignCount <= currentSignCount) {
  auditLog.error('Replay attack detected', {
    credentialId: assertion.id,
    currentSignCount,
    responseSignCount,
    userId: credential.userId
  });
  throw new Error('Replay attack detected');
}

// Actualizar signCount
await db.webauthn_credentials.update(
  { signCount: responseSignCount },
  { where: { credentialId: assertion.id } }
);
```

**Justificación:** Detecta replay attacks y clonación de credenciales.

---

### 4. Context Binding (Pagos)

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/payment/verify
// Obtener challenge almacenado
const storedChallenge = await redis.get(`webauthn:challenge:${challengeId}`);

if (!storedChallenge) {
  throw new Error('Challenge not found or expired');
}

const challengeData = JSON.parse(storedChallenge);

// Validar contexto
if (
  challengeData.context.userId !== paymentContext.userId ||
  challengeData.context.amount !== paymentContext.amount ||
  challengeData.context.currency !== paymentContext.currency ||
  challengeData.context.transactionId !== paymentContext.transactionId
) {
  auditLog.error('Context mismatch', {
    challengeContext: challengeData.context,
    requestContext: paymentContext,
    userId: paymentContext.userId
  });
  throw new Error('Context mismatch - transaction rejected');
}

// Eliminar challenge después de validación
await redis.del(`webauthn:challenge:${challengeId}`);
```

**Justificación:** Previene modificación de monto/transacción.

---

### 5. Rate Limiting

**Prioridad:** ALTA  
**Estado:** ✅ Implementado

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting por IP
const ipRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // 10 requests por IP
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting por usuario (para pagos)
const userRateLimit = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next();

  const key = `webauthn:rate:user:${userId}`;
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, 300); // 5 minutos
  }

  if (attempts > 10) {
    auditLog.warn('Rate limit exceeded', { userId, attempts });
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  next();
};

// Aplicar a endpoints
app.use('/api/webauthn/login/options', ipRateLimit);
app.use('/api/webauthn/payment/options', ipRateLimit, userRateLimit);
```

**Justificación:** Previene ataques de fuerza bruta y DoS.

---

### 6. Eliminación de Challenge Después de Uso

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/login/verify y /api/webauthn/payment/verify
// Después de validar firma exitosamente
await redis.del(`webauthn:challenge:${challengeId}`);

// Verificar que fue eliminado
const stillExists = await redis.exists(`webauthn:challenge:${challengeId}`);
if (stillExists) {
  auditLog.error('Challenge not deleted', { challengeId });
  // Intentar eliminar nuevamente
  await redis.del(`webauthn:challenge:${challengeId}`);
}
```

**Justificación:** Previene reutilización de challenges.

---

### 7. Logging y Auditoría

**Prioridad:** ALTA  
**Estado:** ✅ Implementado

```typescript
// Endpoint: /api/webauthn/login/verify y /api/webauthn/payment/verify
await auditLog.create({
  event: mode === 'login' ? 'webauthn_login_success' : 'webauthn_payment_authorized',
  userId,
  email: mode === 'login' ? email : null,
  transactionId: mode === 'payment' ? paymentContext.transactionId : null,
  amount: mode === 'payment' ? paymentContext.amount : null,
  currency: mode === 'payment' ? paymentContext.currency : null,
  timestamp: new Date(),
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  credentialId: assertion.id,
  signCount: assertion.response.signCount,
  origin: response.origin,
  rpId: options.rpId
});

// Logging de errores
if (error) {
  await auditLog.create({
    event: mode === 'login' ? 'webauthn_login_failed' : 'webauthn_payment_failed',
    userId,
    error: error.message,
    errorCode: error.code,
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
}
```

**Justificación:** Evidencia para disputas y detección de fraudes.

---

## 🎨 CONTROLES DE FRONTEND

### 1. Validación de HTTPS

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// components/Security/LoginBiometric.tsx y PayBiometric.tsx
useEffect(() => {
  if (!window.isSecureContext) {
    console.error('HTTPS requerido para WebAuthn');
    setShowFallback(true);
    onError?.('HTTPS requerido para biometría');
  }
}, []);
```

**Justificación:** WebAuthn requiere HTTPS.

---

### 2. Validación de Iframe

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// components/Security/LoginBiometric.tsx y PayBiometric.tsx
useEffect(() => {
  if (window.self !== window.top) {
    console.error('WebAuthn no funciona en iframes');
    setShowFallback(true);
    onError?.('WebAuthn no funciona en iframes');
  }
}, []);
```

**Justificación:** WebAuthn no funciona en iframes.

---

### 3. Mostrar Monto en Pagos

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado

```typescript
// components/Security/PayBiometric.tsx
return (
  <div className="flex flex-col items-center justify-center gap-6">
    {/* Mostrar monto destacado */}
    <div className="text-center mb-2">
      <p className="text-sm text-white/60 mb-1">Monto a autorizar</p>
      <p className="text-2xl font-bold text-[#C9A24D]">
        {formatAmount(paymentContext.amount, paymentContext.currency)}
      </p>
    </div>
    {/* ... */}
  </div>
);
```

**Justificación:** Previene phishing visual y confirma monto.

---

### 4. Mostrar Dominio

**Prioridad:** ALTA  
**Estado:** ✅ Implementado

```typescript
// components/Security/LoginBiometric.tsx y PayBiometric.tsx
{process.env.NODE_ENV === "production" && (
  <p className="text-xs text-white/40 mt-2">
    🔒 {typeof window !== "undefined" ? window.location.hostname : "legal-py.vercel.app"}
  </p>
)}
```

**Justificación:** Previene phishing.

---

## 🏗️ CONTROLES DE INFRAESTRUCTURA

### 1. Certificado SSL/TLS

**Prioridad:** CRÍTICA  
**Estado:** ✅ Implementado (Vercel)

- Certificado válido y actualizado
- HSTS (HTTP Strict Transport Security) habilitado
- Certificado EV recomendado (pendiente)

---

### 2. WAF (Web Application Firewall)

**Prioridad:** ALTA  
**Estado:** ⚠️ Recomendado

- Cloudflare WAF o AWS WAF
- Reglas para bloquear ataques comunes
- Rate limiting a nivel de infraestructura

---

### 3. DDoS Protection

**Prioridad:** ALTA  
**Estado:** ⚠️ Recomendado

- Cloudflare DDoS Protection
- AWS Shield
- Rate limiting distribuido

---

## 📊 CONTROLES DE MONITOREO

### 1. Alertas de Replay Detectado

**Prioridad:** CRÍTICA  
**Estado:** ⚠️ Recomendado

```typescript
// Backend: Detectar replay
if (responseSignCount <= currentSignCount) {
  // Alerta inmediata
  await alertService.send({
    severity: 'critical',
    type: 'replay_attack',
    message: 'Replay attack detected',
    data: {
      credentialId: assertion.id,
      userId: credential.userId,
      currentSignCount,
      responseSignCount
    }
  });
  
  throw new Error('Replay attack detected');
}
```

---

### 2. Alertas de Context Mismatch

**Prioridad:** CRÍTICA  
**Estado:** ⚠️ Recomendado

```typescript
// Backend: Detectar context mismatch
if (contextMismatch) {
  // Alerta inmediata
  await alertService.send({
    severity: 'critical',
    type: 'context_mismatch',
    message: 'Context mismatch in payment authorization',
    data: {
      userId: paymentContext.userId,
      transactionId: paymentContext.transactionId,
      challengeContext: challengeData.context,
      requestContext: paymentContext
    }
  });
  
  throw new Error('Context mismatch - transaction rejected');
}
```

---

### 3. Alertas de Login desde Nuevo Dispositivo

**Prioridad:** MEDIA  
**Estado:** ⚠️ Recomendado

```typescript
// Backend: Detectar nuevo dispositivo
const previousDevices = await db.login_history.find({
  where: { userId },
  orderBy: { timestamp: 'desc' },
  take: 10
});

const isNewDevice = !previousDevices.some(device => 
  device.userAgent === req.headers['user-agent'] &&
  device.ip === req.ip
);

if (isNewDevice) {
  await alertService.send({
    severity: 'medium',
    type: 'new_device_login',
    message: 'Login from new device',
    data: {
      userId,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }
  });
}
```

---

## 🚨 CONTROLES DE RESPUESTA A INCIDENTES

### 1. Revocación de Credenciales

**Prioridad:** CRÍTICA  
**Estado:** ⚠️ Recomendado

```typescript
// Endpoint: /api/webauthn/credentials/revoke
async function revokeCredential(credentialId: string, userId: string) {
  // Marcar credencial como revocada
  await db.webauthn_credentials.update(
    { revoked: true, revokedAt: new Date() },
    { where: { credentialId, userId } }
  );
  
  // Logging
  await auditLog.create({
    event: 'credential_revoked',
    userId,
    credentialId,
    timestamp: new Date(),
    reason: 'Security incident'
  });
  
  // Notificar al usuario
  await notificationService.send({
    userId,
    type: 'credential_revoked',
    message: 'Tu credencial biométrica ha sido revocada por seguridad'
  });
}
```

---

### 2. Bloqueo de Cuenta

**Prioridad:** ALTA  
**Estado:** ⚠️ Recomendado

```typescript
// Endpoint: /api/users/block
async function blockUser(userId: string, reason: string) {
  // Bloquear cuenta
  await db.users.update(
    { blocked: true, blockedAt: new Date(), blockReason: reason },
    { where: { id: userId } }
  );
  
  // Revocar todas las credenciales
  await db.webauthn_credentials.update(
    { revoked: true, revokedAt: new Date() },
    { where: { userId } }
  );
  
  // Logging
  await auditLog.create({
    event: 'user_blocked',
    userId,
    reason,
    timestamp: new Date()
  });
}
```

---

## 📋 RESUMEN DE CONTROLES

| Control | Prioridad | Estado | Justificación |
|---------|-----------|--------|---------------|
| Validación de Origin/RP ID | Crítica | ✅ | Previene phishing |
| Challenge único con TTL | Crítica | ✅ | Previene replay |
| SignCount validation | Crítica | ✅ | Detecta replay/clonación |
| Context binding | Crítica | ✅ | Previene modificación de monto |
| Rate limiting | Alta | ✅ | Previene fuerza bruta/DoS |
| Eliminación de challenge | Crítica | ✅ | Previene reutilización |
| Logging completo | Alta | ✅ | Evidencia y auditoría |
| Validación HTTPS | Crítica | ✅ | Requisito WebAuthn |
| Validación iframe | Crítica | ✅ | Requisito WebAuthn |
| Mostrar monto | Crítica | ✅ | Previene phishing visual |
| Mostrar dominio | Alta | ✅ | Previene phishing |
| Certificado EV | Alta | ⚠️ | Mejora confianza |
| WAF | Alta | ⚠️ | Protección adicional |
| DDoS protection | Alta | ⚠️ | Protección infraestructura |
| Alertas de replay | Crítica | ⚠️ | Detección temprana |
| Alertas de context mismatch | Crítica | ⚠️ | Detección temprana |
| Revocación de credenciales | Crítica | ⚠️ | Respuesta a incidentes |

---

**Firmado por:** Security Architect (Threat Modeling Fintech)  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
