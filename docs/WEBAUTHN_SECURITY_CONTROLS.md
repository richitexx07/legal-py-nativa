# Controles de Seguridad WebAuthn - Legal PY

## 🎯 Objetivo

Documentar todos los controles de seguridad implementados para mitigar amenazas identificadas en el Threat Model.

---

## 🛡️ Controles Implementados

### 1. Prevención de Replay Attacks

#### Challenge Management

**Control**: Challenges únicos y de un solo uso

**Implementación**:
```typescript
// Backend (a implementar)
const challenge = crypto.randomBytes(32); // 32 bytes aleatorios
await redis.setex(`challenge:${challengeId}`, 60, JSON.stringify({
  challenge: base64(challenge),
  used: false,
  createdAt: Date.now()
}));

// En verify
const stored = await redis.get(`challenge:${challengeId}`);
if (stored.used === true) {
  throw new Error("Challenge ya fue usado");
}
await redis.set(`challenge:${challengeId}`, { ...stored, used: true });
```

**Frontend**:
- ✅ Challenges generados en backend (no en frontend)
- ✅ TTL de 60 segundos
- ✅ No reutilizar challenges

**Evidencia**: Código de generación y almacenamiento de challenges

---

### 2. Prevención de MITM

#### HTTPS Obligatorio

**Control**: Verificación de contexto seguro

**Implementación Frontend**:
```typescript
// En LoginBiometric y PayBiometric
const compatibility = await checkWebAuthnCompatibility();
if (!compatibility.isSecureContext) {
  // Mostrar fallback, no mostrar componente
  return <FallbackUI />;
}
```

**Backend** (a implementar):
- ✅ Validar que request viene de HTTPS
- ✅ Rechazar requests HTTP (excepto localhost en dev)
- ✅ HSTS headers

**Evidencia**: Verificación de `window.isSecureContext`

---

#### Validación de Origin

**Control**: Validar que el origin es el dominio correcto

**Implementación Backend** (a implementar):
```typescript
// En verify endpoint
const clientData = JSON.parse(base64Decode(assertion.response.clientDataJSON));
const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'https://legal-py.vercel.app';

if (clientData.origin !== expectedOrigin) {
  throw new Error("Origin no válido");
}
```

**Evidencia**: Código de validación de origin

---

#### Validación de rpId

**Control**: Validar que el rpId es el dominio correcto

**Implementación Backend** (a implementar):
```typescript
// En verify endpoint
const expectedRpId = process.env.WEBAUTHN_RP_ID || 'legal-py.vercel.app';

if (authenticatorData.rpIdHash !== hash(expectedRpId)) {
  throw new Error("rpId no válido");
}
```

**Evidencia**: Código de validación de rpId

---

### 3. Prevención de Context Binding Bypass (Pagos)

#### Context Binding Obligatorio

**Control**: Challenge ligado al contexto de pago

**Implementación Backend** (a implementar):
```typescript
// En /api/webauthn/payment/options
const challenge = crypto.randomBytes(32);
await redis.setex(`challenge:payment:${challengeId}`, 60, JSON.stringify({
  challenge: base64(challenge),
  userId: paymentContext.userId,
  amount: paymentContext.amount,
  currency: paymentContext.currency,
  transactionId: paymentContext.transactionId,
  used: false
}));

// En /api/webauthn/payment/verify
const stored = await redis.get(`challenge:payment:${challengeId}`);
if (
  stored.userId !== verifyRequest.userId ||
  stored.amount !== verifyRequest.amount ||
  stored.currency !== verifyRequest.currency ||
  stored.transactionId !== verifyRequest.transactionId
) {
  throw new Error("Contexto no coincide - posible ataque");
}
```

**Frontend**:
- ✅ `paymentContext` obligatorio y completo
- ✅ Validación de campos requeridos
- ✅ Envío de contexto en verify

**Evidencia**: Código de context binding y validación

---

### 4. Prevención de Session Fixation

#### Regeneración de Sesión

**Control**: Regenerar sesión después de login WebAuthn

**Implementación Backend** (a implementar):
```typescript
// Después de verificar WebAuthn login
const newSessionId = crypto.randomBytes(32).toString('hex');
// Invalidar sesiones anteriores del usuario
await invalidateUserSessions(userId);
// Crear nueva sesión
await createSession(newSessionId, userId);
```

**Evidencia**: Código de regeneración de sesión

---

### 5. Prevención de Phishing

#### Mostrar Dominio en UI

**Control**: Mostrar dominio actual para que usuario verifique

**Implementación Frontend**:
```typescript
// En LoginBiometric y PayBiometric
{process.env.NODE_ENV === "production" && (
  <p className="text-xs text-white/40">
    🔒 {window.location.hostname}
  </p>
)}
```

**Evidencia**: UI muestra dominio en producción

---

#### Validación de Origin (Backend)

**Control**: Backend valida origin estricto

**Implementación**: Ver sección "Validación de Origin" arriba

---

### 6. Prevención de Credential Theft

#### Validación de SignCount

**Control**: Validar que signCount es mayor al último conocido

**Implementación Backend** (a implementar):
```typescript
// Obtener último signCount de la credencial
const credential = await getCredential(credentialId);
const lastSignCount = credential.lastSignCount || 0;
const currentSignCount = authenticatorData.signCount;

if (currentSignCount <= lastSignCount) {
  // Posible replay attack
  await logSecurityEvent({
    type: 'SIGNCOUNT_ANOMALY',
    credentialId,
    lastSignCount,
    currentSignCount
  });
  throw new Error("SignCount inválido - posible replay");
}

// Actualizar signCount
await updateCredential(credentialId, { lastSignCount: currentSignCount });
```

**Evidencia**: Código de validación de signCount

---

#### Monitoreo de Anomalías

**Control**: Alertar si signCount cambia abruptamente

**Implementación Backend** (a implementar):
```typescript
// Si signCount salta mucho (ej: de 10 a 1000)
if (currentSignCount - lastSignCount > 100) {
  await sendSecurityAlert({
    type: 'SIGNCOUNT_JUMP',
    credentialId,
    userId,
    jump: currentSignCount - lastSignCount
  });
  // Aún permitir pero alertar
}
```

**Evidencia**: Sistema de alertas

---

### 7. Prevención de Iframe Attacks

#### Verificación de Iframe

**Control**: No ejecutar WebAuthn en iframes

**Implementación Frontend**:
```typescript
const pwa = checkPWAConditions();
if (pwa.isInIframe) {
  // No mostrar componente
  return null;
}
```

**Evidencia**: Verificación de `window.self !== window.top`

---

### 8. Rate Limiting

**Control**: Limitar intentos de autenticación

**Implementación Backend** (a implementar):
```typescript
// Rate limiting por IP
const ipKey = `ratelimit:ip:${req.ip}`;
const ipAttempts = await redis.incr(ipKey);
if (ipAttempts === 1) {
  await redis.expire(ipKey, 300); // 5 minutos
}
if (ipAttempts > 10) {
  throw new Error("Demasiados intentos. Intenta más tarde.");
}

// Rate limiting por usuario
const userKey = `ratelimit:user:${userId}`;
const userAttempts = await redis.incr(userKey);
if (userAttempts === 1) {
  await redis.expire(userKey, 300);
}
if (userAttempts > 5) {
  throw new Error("Demasiados intentos. Intenta más tarde.");
}
```

**Evidencia**: Configuración de rate limiting

---

## 📋 Checklist de Implementación Backend

### Challenge Management

- [ ] Generación única (32 bytes aleatorios)
- [ ] TTL de 60 segundos
- [ ] Marcar como usado después de verify
- [ ] Rechazar challenges reutilizados
- [ ] Almacenamiento seguro (Redis con TTL)

### Validación de Firma

- [ ] Verificar firma criptográfica
- [ ] Validar origin (debe ser dominio correcto)
- [ ] Validar rpId (debe ser dominio correcto)
- [ ] Validar signCount (debe ser mayor al último)
- [ ] Validar credentialID (debe pertenecer al usuario)

### Context Binding (Pagos)

- [ ] Ligar challenge al contexto en options
- [ ] Validar contexto en verify
- [ ] Rechazar si contexto no coincide
- [ ] transactionId único e inmutable

### Session Management

- [ ] Regenerar sesión después de login
- [ ] Invalidar sesiones anteriores
- [ ] Timeout automático
- [ ] Tokens únicos

### Rate Limiting

- [ ] Límite por IP (10 intentos / 5 min)
- [ ] Límite por usuario (5 intentos / 5 min)
- [ ] Límite por credencial (3 intentos / 5 min)
- [ ] Bloqueo temporal después de múltiples fallos

### Logging y Monitoreo

- [ ] Log de todos los intentos
- [ ] Log de intentos fallidos
- [ ] Alertas por signCount anómalo
- [ ] Alertas por contexto no coincidente
- [ ] Alertas por rate limit excedido
- [ ] Retención de logs (90 días mínimo)

---

## 🔍 Evidencia para Auditores

### Código

- ✅ Verificación de HTTPS en frontend
- ✅ Verificación de iframe en frontend
- ✅ Context binding en frontend
- ✅ Validación de entrada completa
- ✅ Manejo seguro de errores

### Documentación

- ✅ Threat model documentado
- ✅ Controles documentados
- ✅ Procedimientos documentados
- ✅ Checklist pre-producción

### Testing

- [ ] Tests de rechazo de challenges reutilizados
- [ ] Tests de rechazo por contexto no coincidente
- [ ] Tests de rechazo por origin incorrecto
- [ ] Tests de rechazo por signCount inválido
- [ ] Tests de rate limiting
- [ ] Tests de session management

---

## 🎯 Nivel Banco Digital

Todos los controles críticos están documentados y preparados para implementación. El frontend ya implementa las verificaciones posibles del lado del cliente. El backend debe implementar los controles restantes antes de producción.
