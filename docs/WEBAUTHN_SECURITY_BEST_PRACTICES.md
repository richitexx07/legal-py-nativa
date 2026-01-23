# 🛡️ WEBAUTHN: MEJORES PRÁCTICAS Y ERRORES COMUNES

**Autor:** Senior Backend Security Engineer  
**Fecha:** 2025-01-27

---

## ❌ ERRORES COMUNES Y CÓMO EVITARLOS

### 1. Reutilizar Challenges Entre Contextos

**❌ INCORRECTO:**
```typescript
// Mismo challenge para login y payment
const challenge = generateChallenge();
await redis.set(`webauthn:challenge:${challenge}`, userId);
```

**✅ CORRECTO:**
```typescript
// Challenges separados con prefijos
const loginChallenge = generateChallenge();
await redis.set(`webauthn:login:challenge:${loginChallenge}`, {...});

const paymentChallenge = generateChallenge();
await redis.set(`webauthn:payment:challenge:${paymentChallenge}`, {
  userId,
  amount,
  currency,
  transactionId
});
```

---

### 2. No Validar Context Binding en Pagos

**❌ INCORRECTO:**
```typescript
// Solo verifica la firma, no el contexto
const verification = await verifyAuthenticationResponse({...});
if (verification.verified) {
  await authorizePayment(transactionId); // ⚠️ PELIGROSO
}
```

**✅ CORRECTO:**
```typescript
// Validar contexto ANTES de autorizar
const context = await getChallengeContext(challenge);
if (context.transactionId !== transactionId ||
    context.amount !== transaction.amount ||
    context.userId !== session.userId) {
  throw new Error("CONTEXT_MISMATCH");
}

const verification = await verifyAuthenticationResponse({...});
if (verification.verified) {
  await authorizePayment(transactionId);
}
```

---

### 3. No Verificar SignCount (Replay Attacks)

**❌ INCORRECTO:**
```typescript
// No verifica si el counter aumentó
const verification = await verifyAuthenticationResponse({...});
// ⚠️ Permite reutilizar la misma firma
```

**✅ CORRECTO:**
```typescript
const storedCredential = await getCredential(credentialId);
const verification = await verifyAuthenticationResponse({...});

// Verificar que counter aumentó
if (verification.authenticator.counter <= storedCredential.counter) {
  await auditLog.log({ event: 'REPLAY_ATTACK_DETECTED' });
  throw new Error("REPLAY_ATTACK_DETECTED");
}

// Actualizar counter
await updateCounter(credentialId, verification.authenticator.counter);
```

---

### 4. No Eliminar Challenge Después de Usar

**❌ INCORRECTO:**
```typescript
// Challenge permanece en Redis
const verification = await verifyAuthenticationResponse({...});
// ⚠️ Puede ser reutilizado
```

**✅ CORRECTO:**
```typescript
const verification = await verifyAuthenticationResponse({...});
if (verification.verified) {
  // Eliminar inmediatamente (one-time use)
  await redis.del(`webauthn:payment:challenge:${challenge}`);
  await authorizePayment(transactionId);
}
```

---

### 5. TTL Muy Largo en Challenges

**❌ INCORRECTO:**
```typescript
// Challenge válido por 1 hora (muy largo)
await redis.setex(`webauthn:challenge:${challenge}`, 3600, data);
```

**✅ CORRECTO:**
```typescript
// Challenge válido por 60 segundos (estándar bancario)
await redis.setex(`webauthn:challenge:${challenge}`, 60, data);
```

---

### 6. No Validar Origin y RP ID

**❌ INCORRECTO:**
```typescript
// Confía ciegamente en la respuesta
const verification = await verifyAuthenticationResponse({
  response: credential,
  expectedChallenge: challenge
  // ⚠️ Falta expectedOrigin y expectedRPID
});
```

**✅ CORRECTO:**
```typescript
// Validar origen y RP ID explícitamente
const verification = await verifyAuthenticationResponse({
  response: credential,
  expectedChallenge: challenge,
  expectedOrigin: 'https://legalpy.com', // Whitelist
  expectedRPID: 'legalpy.com',
  authenticator: storedCredential,
  requireUserVerification: true
});
```

---

### 7. Mezclar Login y Payment en Mismo Endpoint

**❌ INCORRECTO:**
```typescript
// Un solo endpoint para ambos contextos
router.post('/webauthn/verify', async (req, res) => {
  const { context } = req.body; // 'login' o 'payment'
  // ⚠️ Lógica mezclada, fácil de confundir
});
```

**✅ CORRECTO:**
```typescript
// Endpoints completamente separados
router.post('/webauthn/login/verify', handleLoginVerify);
router.post('/webauthn/payment/verify', handlePaymentVerify);
```

---

### 8. No Registrar en Auditoría

**❌ INCORRECTO:**
```typescript
// Sin registro de eventos de seguridad
const verification = await verifyAuthenticationResponse({...});
if (verification.verified) {
  await authorizePayment(transactionId);
}
```

**✅ CORRECTO:**
```typescript
// Auditoría completa
await auditLog.log({
  event: 'PAYMENT_CHALLENGE_GENERATED',
  userId,
  transactionId,
  amount,
  currency,
  ipAddress: req.ip,
  userAgent: req.get('user-agent')
});

// Y después de verificar
await auditLog.log({
  event: 'PAYMENT_VERIFICATION_SUCCESS',
  userId,
  transactionId,
  credentialId,
  ipAddress: req.ip
});
```

---

## ✅ MEJORES PRÁCTICAS

### 1. Separación Absoluta de Contextos

```typescript
// Estructura de carpetas
/webauthn
  /login
    - options.ts
    - verify.ts
  /payment
    - options.ts
    - verify.ts
  /shared
    - types.ts
    - validators.ts
```

---

### 2. Validación en Múltiples Capas

```typescript
// Capa 1: Validación de inputs
if (!amount || amount <= 0) {
  return res.status(400).json({ error: 'INVALID_AMOUNT' });
}

// Capa 2: Validación de negocio
const transaction = await db.transactions.findById(transactionId);
if (transaction.amount !== amount) {
  return res.status(400).json({ error: 'AMOUNT_MISMATCH' });
}

// Capa 3: Validación de contexto
const context = await getChallengeContext(challenge);
if (context.amount !== amount) {
  throw new Error("CONTEXT_MISMATCH");
}

// Capa 4: Validación criptográfica
const verification = await verifyAuthenticationResponse({...});
```

---

### 3. Rate Limiting Agresivo

```typescript
// Rate limiting por IP
const ipLimiter = rateLimiter({
  max: 5,        // 5 intentos
  window: 60000  // por minuto
});

// Rate limiting por usuario
const userLimiter = rateLimiter({
  max: 10,       // 10 intentos
  window: 3600000 // por hora
});

// Aplicar ambos
router.post('/payment/verify', ipLimiter, userLimiter, handler);
```

---

### 4. Manejo de Errores Sin Revelar Información

```typescript
// ❌ INCORRECTO: Revela información sensible
if (!user) {
  return res.json({ error: `Usuario ${email} no existe` });
}

// ✅ CORRECTO: Respuesta genérica
if (!user) {
  // Simular delay para evitar timing attacks
  await delay(100 + Math.random() * 200);
  return res.json({
    challenge: '',
    allowCredentials: []
  });
}
```

---

### 5. Validación de User Verification

```typescript
// Siempre requerir userVerification en pagos
const options = await generateAuthenticationOptions({
  rpID,
  allowCredentials,
  userVerification: 'required', // Obligatorio
  timeout: 60000
});

// Y verificar en la respuesta
const authData = parseAuthenticatorData(response.authenticatorData);
if (!authData.flags.uv) {
  throw new Error("USER_VERIFICATION_REQUIRED");
}
```

---

### 6. Rotación de Credenciales

```typescript
// Política: Rotar credenciales cada 90 días
const credentialAge = Date.now() - storedCredential.created_at;
if (credentialAge > 90 * 24 * 60 * 60 * 1000) {
  await notifyUser({
    message: "Tu credencial biométrica expirará pronto. Por favor, regístrala nuevamente."
  });
}
```

---

### 7. Monitoreo y Alertas

```typescript
// Alertar sobre eventos sospechosos
if (contextMismatchCount > 3) {
  await sendAlert({
    severity: 'HIGH',
    message: 'Múltiples context mismatches detectados',
    userId,
    ipAddress: req.ip
  });
}

// Alertar sobre replay attacks
if (replayAttackDetected) {
  await sendAlert({
    severity: 'CRITICAL',
    message: 'Replay attack detectado',
    userId,
    credentialId,
    ipAddress: req.ip
  });
  // Bloquear credencial temporalmente
  await db.webauthnCredentials.disable(credentialId);
}
```

---

## 🔍 CHECKLIST DE SEGURIDAD

Antes de desplegar a producción, verificar:

- [ ] Challenges separados para login y payment
- [ ] TTL de 60s en challenges
- [ ] Context binding en pagos (userId, amount, currency, transactionId)
- [ ] Validación de origin y RP ID
- [ ] Verificación de signCount (anti-replay)
- [ ] Eliminación de challenge después de usar
- [ ] Rate limiting implementado
- [ ] Auditoría completa de eventos
- [ ] Manejo de errores sin revelar información
- [ ] User verification requerido
- [ ] Validación en múltiples capas
- [ ] Monitoreo y alertas configuradas
- [ ] Tests de seguridad (replay, context mismatch, etc.)
- [ ] Documentación de API actualizada

---

## 📊 MÉTRICAS DE SEGURIDAD

### Métricas a Monitorear

1. **Tasa de éxito de verificación**
   - Objetivo: >95%
   - Alerta si: <90%

2. **Tasa de context mismatch**
   - Objetivo: <0.1%
   - Alerta si: >1%

3. **Tasa de replay attacks**
   - Objetivo: 0%
   - Alerta si: >0

4. **Tiempo promedio de verificación**
   - Objetivo: <2s
   - Alerta si: >5s

5. **Tasa de challenges expirados**
   - Objetivo: <5%
   - Alerta si: >10%

---

## 🚨 PLAN DE RESPUESTA A INCIDENTES

### Escenario 1: Replay Attack Detectado

1. **Inmediato:**
   - Bloquear credencial afectada
   - Registrar en auditoría
   - Enviar alerta a seguridad

2. **Corto plazo:**
   - Investigar origen del ataque
   - Notificar al usuario
   - Forzar re-registro de credencial

3. **Largo plazo:**
   - Revisar logs de auditoría
   - Mejorar detección de replay
   - Actualizar documentación

---

### Escenario 2: Context Mismatch en Pago

1. **Inmediato:**
   - Rechazar transacción
   - Registrar en auditoría
   - Bloquear transacción en BD

2. **Corto plazo:**
   - Investigar si fue ataque o bug
   - Notificar al usuario
   - Revisar logs del cliente

3. **Largo plazo:**
   - Mejorar validación de contexto
   - Agregar más checks
   - Actualizar tests

---

## 📚 REFERENCIAS

- [WebAuthn Specification](https://www.w3.org/TR/webauthn-2/)
- [FIDO2 Security Guidelines](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Firmado por:** Senior Backend Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
