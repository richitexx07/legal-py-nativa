# 🔐 ARQUITECTURA BACKEND WEBAUTHN - LEGAL PY

**Autor:** Senior Backend Security Engineer (Fintech / WebAuthn / FIDO2)  
**Fecha:** 2025-01-27  
**Estándar:** FIDO2 / WebAuthn Level 2, NIST SP 800-63B

---

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Separación de Contextos](#separación-de-contextos)
3. [Endpoints Detallados](#endpoints-detallados)
4. [Flujos Paso a Paso](#flujos-paso-a-paso)
5. [Seguridad y Mitigaciones](#seguridad-y-mitigaciones)
6. [Librerías Recomendadas](#librerías-recomendadas)
7. [Esquema de Base de Datos](#esquema-de-base-de-datos)

---

## 🏗️ ARQUITECTURA GENERAL

### Principios de Diseño

1. **Separación absoluta** entre Login y Payment contexts
2. **Challenge único** por request con expiración corta (60s)
3. **Context binding** obligatorio en pagos
4. **Zero-trust** en validación de origen y RP ID
5. **Auditoría completa** de todas las operaciones

### Stack Tecnológico Recomendado

```
Backend: Node.js 20+ / TypeScript
Framework: Express / Fastify
Librería WebAuthn: @simplewebauthn/server v9+
Base de Datos: PostgreSQL 15+
Cache: Redis (para challenges)
```

---

## 🔀 SEPARACIÓN DE CONTEXTOS

### Context 1: LOGIN (Passwordless Authentication)

**Propósito:** Autenticar usuario sin contraseña

**Características:**
- No requiere sesión previa
- Challenge ligado solo a `email` o `userId`
- `userVerification: "required"`
- Permite múltiples credenciales por usuario

### Context 2: PAYMENT (Transaction Authorization)

**Propósito:** Autorizar transacciones financieras

**Características:**
- **REQUIERE** sesión autenticada previa
- Challenge ligado a: `userId`, `amount`, `currency`, `transactionId`
- `userVerification: "required"` + `userPresence: true`
- Solo una credencial activa por usuario (la más reciente)
- Rechazo automático si contexto no coincide

---

## 📡 ENDPOINTS DETALLADOS

### 🔐 LOGIN BIOMÉTRICO

#### `POST /api/webauthn/login/options`

**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response:**
```json
{
  "challenge": "base64url-encoded-challenge",
  "rpId": "legalpy.com",
  "allowCredentials": [
    {
      "id": "credential-id-base64url",
      "type": "public-key",
      "transports": ["usb", "nfc", "ble", "internal"]
    }
  ],
  "userVerification": "required",
  "timeout": 60000
}
```

**Validaciones Backend:**
- Email existe en BD
- Usuario tiene credenciales registradas
- Generar challenge único (32 bytes aleatorios)
- Guardar en Redis con TTL 60s: `webauthn:login:challenge:{challenge}`
- Incluir `email` en metadata del challenge

---

#### `POST /api/webauthn/login/verify`

**Request:**
```json
{
  "email": "usuario@example.com",
  "credential": {
    "id": "credential-id-base64url",
    "rawId": "ArrayBuffer",
    "response": {
      "authenticatorData": "base64url",
      "clientDataJSON": "base64url",
      "signature": "base64url",
      "userHandle": "base64url"
    },
    "type": "public-key"
  },
  "challenge": "challenge-from-options"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "session": {
    "token": "jwt-session-token",
    "expiresAt": "2025-01-27T12:00:00Z"
  },
  "user": {
    "id": "usr_123",
    "email": "usuario@example.com"
  }
}
```

**Response (Error):**
```json
{
  "verified": false,
  "error": "INVALID_CHALLENGE | INVALID_SIGNATURE | CREDENTIAL_NOT_FOUND",
  "code": "AUTH_FAILED"
}
```

**Validaciones Backend:**
1. Recuperar challenge de Redis: `webauthn:login:challenge:{challenge}`
2. Verificar expiración (TTL)
3. Validar `origin` (debe ser `https://legalpy.com`)
4. Validar `rpId` (debe ser `legalpy.com`)
5. Verificar firma usando clave pública del credential
6. Verificar `userVerification` flag en `authenticatorData`
7. Actualizar `signCount` en BD (proteger contra replay)
8. Eliminar challenge de Redis (one-time use)
9. Generar sesión JWT
10. Registrar en auditoría

---

### 💳 PAGO / TRANSACCIÓN BIOMÉTRICA

#### `POST /api/webauthn/payment/options`

**Headers:**
```
Authorization: Bearer {session-token}
```

**Request:**
```json
{
  "amount": 150000,
  "currency": "PYG",
  "transactionId": "txn_abc123",
  "description": "Suscripción Plan Profesional"
}
```

**Response:**
```json
{
  "challenge": "base64url-encoded-challenge",
  "rpId": "legalpy.com",
  "allowCredentials": [
    {
      "id": "credential-id-base64url",
      "type": "public-key",
      "transports": ["usb", "nfc", "ble", "internal"]
    }
  ],
  "userVerification": "required",
  "userPresence": true,
  "timeout": 60000
}
```

**Validaciones Backend:**
1. **Verificar sesión autenticada** (JWT válido)
2. **Validar transacción:**
   - `transactionId` único y no procesado
   - `amount` > 0
   - `currency` válida
   - Usuario tiene fondos/suscripción válida
3. **Generar challenge único** (32 bytes)
4. **Guardar en Redis con contexto:**
   ```
   Key: webauthn:payment:challenge:{challenge}
   Value: {
     userId: "usr_123",
     amount: 150000,
     currency: "PYG",
     transactionId: "txn_abc123",
     timestamp: 1706364000000,
     expiresAt: 1706364060000
   }
   TTL: 60s
   ```
5. **Bloquear transacción** en BD (status: `pending_biometric`)

---

#### `POST /api/webauthn/payment/verify`

**Headers:**
```
Authorization: Bearer {session-token}
```

**Request:**
```json
{
  "credential": {
    "id": "credential-id-base64url",
    "rawId": "ArrayBuffer",
    "response": {
      "authenticatorData": "base64url",
      "clientDataJSON": "base64url",
      "signature": "base64url",
      "userHandle": "base64url"
    },
    "type": "public-key"
  },
  "challenge": "challenge-from-options",
  "transactionId": "txn_abc123"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "transaction": {
    "id": "txn_abc123",
    "status": "authorized",
    "authorizedAt": "2025-01-27T12:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "verified": false,
  "error": "INVALID_CHALLENGE | CONTEXT_MISMATCH | INVALID_SIGNATURE | TRANSACTION_EXPIRED",
  "code": "PAYMENT_AUTH_FAILED"
}
```

**Validaciones Backend (CRÍTICAS):**

1. **Verificar sesión autenticada**
2. **Recuperar challenge con contexto:**
   ```typescript
   const challengeData = await redis.get(`webauthn:payment:challenge:${challenge}`);
   if (!challengeData) throw new Error("INVALID_CHALLENGE");
   
   const context = JSON.parse(challengeData);
   ```
3. **VALIDAR CONTEXTO (OBLIGATORIO):**
   ```typescript
   if (context.userId !== session.userId) {
     throw new Error("CONTEXT_MISMATCH: userId");
   }
   if (context.transactionId !== request.transactionId) {
     throw new Error("CONTEXT_MISMATCH: transactionId");
   }
   // Verificar que amount/currency coinciden con transacción en BD
   ```
4. **Validar origen y RP ID**
5. **Verificar firma**
6. **Verificar userVerification y userPresence**
7. **Actualizar signCount**
8. **Eliminar challenge de Redis**
9. **Autorizar transacción en BD:**
   ```sql
   UPDATE transactions 
   SET status = 'authorized', 
       authorized_at = NOW(),
       biometric_verified = true
   WHERE id = $1 AND status = 'pending_biometric';
   ```
10. **Registrar en auditoría con contexto completo**

---

## 🔄 FLUJOS PASO A PASO

### Flujo 1: Login Biométrico (Passwordless)

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│ Cliente │         │ Backend  │         │  Redis   │
└────┬────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ 1. POST /login/options                  │
     │    { email }                            │
     ├───────────────────>│                     │
     │                    │ 2. Buscar usuario  │
     │                    │    y credenciales  │
     │                    ├───────────────────>│
     │                    │                    │
     │                    │ 3. Generar challenge │
     │                    │    (32 bytes)      │
     │                    │                    │
     │                    │ 4. Guardar en Redis│
     │                    │    TTL: 60s         │
     │                    ├───────────────────>│
     │                    │                    │
     │ 5. Response: challenge,                 │
     │    allowCredentials                     │
     │<───────────────────┤                    │
     │                    │                    │
     │ 6. navigator.credentials.get()          │
     │    (WebAuthn API)                       │
     │                    │                    │
     │ 7. POST /login/verify                   │
     │    { credential, challenge }            │
     ├───────────────────>│                    │
     │                    │ 8. Recuperar       │
     │                    │    challenge       │
     │                    ├───────────────────>│
     │                    │<───────────────────┤
     │                    │                    │
     │                    │ 9. Validar origen │
     │                    │    y RP ID         │
     │                    │                    │
     │                    │ 10. Verificar      │
     │                    │     firma           │
     │                    │                    │
     │                    │ 11. Actualizar     │
     │                    │     signCount      │
     │                    │                    │
     │                    │ 12. Eliminar       │
     │                    │     challenge       │
     │                    ├───────────────────>│
     │                    │                    │
     │                    │ 13. Generar JWT    │
     │                    │                    │
     │ 14. Response: { verified, session }     │
     │<───────────────────┤                    │
     │                    │                    │
```

---

### Flujo 2: Autorización de Pago

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Cliente │         │ Backend  │         │  Redis   │         │    BD    │
└────┬────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │                     │
     │ 1. POST /payment/options                │                     │
     │    { amount, currency, transactionId }  │                     │
     │    Headers: Authorization: Bearer {JWT}  │                     │
     ├───────────────────>│                     │                     │
     │                    │ 2. Verificar JWT   │                     │
     │                    │                    │                     │
     │                    │ 3. Validar         │                     │
     │                    │    transacción     │                     │
     │                    ├─────────────────────────────────────────>│
     │                    │<─────────────────────────────────────────┤
     │                    │                    │                     │
     │                    │ 4. Bloquear        │                     │
     │                    │    transacción     │                     │
     │                    │    (pending_biometric)                  │
     │                    ├─────────────────────────────────────────>│
     │                    │                    │                     │
     │                    │ 5. Generar challenge│                    │
     │                    │    con contexto    │                     │
     │                    │                    │                     │
     │                    │ 6. Guardar en Redis│                     │
     │                    │    con contexto    │                     │
     │                    ├───────────────────>│                     │
     │                    │                    │                     │
     │ 7. Response: challenge,                 │                     │
     │    allowCredentials                     │                     │
     │<───────────────────┤                    │                     │
     │                    │                    │                     │
     │ 8. navigator.credentials.get()          │                     │
     │    (WebAuthn API)                       │                     │
     │                    │                    │                     │
     │ 9. POST /payment/verify                 │                     │
     │    { credential, challenge, transactionId }                    │
     ├───────────────────>│                     │                     │
     │                    │ 10. Verificar JWT  │                     │
     │                    │                    │                     │
     │                    │ 11. Recuperar      │                     │
     │                    │     challenge + contexto                  │
     │                    ├───────────────────>│                     │
     │                    │<───────────────────┤                     │
     │                    │                    │                     │
     │                    │ 12. VALIDAR CONTEXTO│                     │
     │                    │     (userId, amount, etc.)               │
     │                    │                    │                     │
     │                    │ 13. Validar origen │                     │
     │                    │     y RP ID         │                     │
     │                    │                    │                     │
     │                    │ 14. Verificar      │                     │
     │                    │     firma           │                     │
     │                    │                    │                     │
     │                    │ 15. Actualizar     │                     │
     │                    │     signCount      │                     │
     │                    │                    │                     │
     │                    │ 16. Eliminar       │                     │
     │                    │     challenge       │                     │
     │                    ├───────────────────>│                     │
     │                    │                    │                     │
     │                    │ 17. Autorizar      │                     │
     │                    │     transacción     │                     │
     │                    ├─────────────────────────────────────────>│
     │                    │<─────────────────────────────────────────┤
     │                    │                    │                     │
     │ 18. Response: { verified, transaction }│                     │
     │<───────────────────┤                    │                     │
     │                    │                    │                     │
```

---

## 🛡️ SEGURIDAD Y MITIGACIONES

### 1. Replay Attacks

**Problema:** Reutilizar challenge ya consumido

**Mitigación:**
- Challenge one-time use (eliminar de Redis después de verificar)
- TTL corto (60s)
- `signCount` incremental (rechazar si signCount no aumenta)

**Implementación:**
```typescript
// Después de verificar firma
await redis.del(`webauthn:login:challenge:${challenge}`);

// Verificar signCount
const storedCredential = await db.getCredential(credentialId);
if (response.signCount <= storedCredential.signCount) {
  throw new Error("REPLAY_ATTACK_DETECTED");
}
await db.updateSignCount(credentialId, response.signCount);
```

---

### 2. Context Mismatch (Pagos)

**Problema:** Usar challenge de un pago para autorizar otro

**Mitigación:**
- Context binding obligatorio
- Validar `transactionId`, `amount`, `currency` en verify
- Rechazar si no coincide

**Implementación:**
```typescript
const challengeData = await redis.get(`webauthn:payment:challenge:${challenge}`);
const context = JSON.parse(challengeData);

// Validaciones estrictas
if (context.userId !== session.userId) {
  await auditLog.log({
    event: "PAYMENT_CONTEXT_MISMATCH",
    userId: session.userId,
    expectedUserId: context.userId,
    transactionId: request.transactionId
  });
  throw new Error("CONTEXT_MISMATCH");
}

// Verificar contra BD también
const transaction = await db.getTransaction(request.transactionId);
if (transaction.amount !== context.amount || 
    transaction.currency !== context.currency) {
  throw new Error("CONTEXT_MISMATCH");
}
```

---

### 3. Origin Spoofing

**Problema:** Ataque desde dominio malicioso

**Mitigación:**
- Validar `origin` en `clientDataJSON`
- Validar `rpId` en `authenticatorData`
- Whitelist de orígenes permitidos

**Implementación:**
```typescript
const clientData = JSON.parse(
  Buffer.from(credential.response.clientDataJSON, 'base64url').toString()
);

const allowedOrigins = [
  'https://legalpy.com',
  'https://www.legalpy.com',
  'https://app.legalpy.com'
];

if (!allowedOrigins.includes(clientData.origin)) {
  throw new Error("INVALID_ORIGIN");
}

if (clientData.type !== 'webauthn.get') {
  throw new Error("INVALID_TYPE");
}

// Validar rpId en authenticatorData
const authData = parseAuthenticatorData(credential.response.authenticatorData);
if (authData.rpIdHash !== hashRPId('legalpy.com')) {
  throw new Error("INVALID_RP_ID");
}
```

---

### 4. Challenge Expiration

**Problema:** Challenge usado después de expirar

**Mitigación:**
- TTL en Redis (60s)
- Validar timestamp en challenge data
- Rechazar si expirado

**Implementación:**
```typescript
const challengeData = await redis.get(`webauthn:payment:challenge:${challenge}`);
if (!challengeData) {
  throw new Error("CHALLENGE_EXPIRED_OR_INVALID");
}

const context = JSON.parse(challengeData);
const now = Date.now();
if (now > context.expiresAt) {
  await redis.del(`webauthn:payment:challenge:${challenge}`);
  throw new Error("CHALLENGE_EXPIRED");
}
```

---

### 5. Credential Cloning

**Problema:** Múltiples dispositivos con misma credencial

**Mitigación:**
- Un solo credential activo por usuario en pagos
- Rotación periódica de credenciales
- Alertas si se detecta uso desde múltiples IPs

---

### 6. Rate Limiting

**Problema:** Ataques de fuerza bruta

**Mitigación:**
- Rate limiting por IP: 5 intentos/minuto
- Rate limiting por usuario: 10 intentos/hora
- Bloqueo temporal después de 3 fallos

**Implementación:**
```typescript
// Usar Redis para rate limiting
const key = `rate_limit:webauthn:${ipAddress}`;
const attempts = await redis.incr(key);
if (attempts === 1) {
  await redis.expire(key, 60); // 1 minuto
}
if (attempts > 5) {
  throw new Error("RATE_LIMIT_EXCEEDED");
}
```

---

## 📚 LIBRERÍAS RECOMENDADAS

### @simplewebauthn/server (v9+)

**Recomendación:** ⭐⭐⭐⭐⭐

**Razones:**
- Implementación completa de WebAuthn Level 2
- TypeScript nativo
- Buenas prácticas de seguridad
- Activamente mantenida
- Usada por empresas fintech

**Instalación:**
```bash
npm install @simplewebauthn/server
```

**Uso básico:**
```typescript
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse
} from '@simplewebauthn/server';

// Generar opciones de login
const options = await generateAuthenticationOptions({
  rpID: 'legalpy.com',
  allowCredentials: userCredentials.map(cred => ({
    id: Buffer.from(cred.id, 'base64url'),
    type: 'public-key',
    transports: cred.transports
  })),
  userVerification: 'required'
});

// Verificar respuesta
const verification = await verifyAuthenticationResponse({
  response: credential,
  expectedChallenge: challenge,
  expectedOrigin: 'https://legalpy.com',
  expectedRPID: 'legalpy.com',
  authenticator: storedCredential,
  requireUserVerification: true
});
```

---

### Alternativas (No recomendadas para producción)

- **fido2-lib**: Menos mantenida
- **webauthn**: Implementación básica, falta features
- **@webauthn/server**: Menos documentación

---

## 🗄️ ESQUEMA DE BASE DE DATOS

### Tabla: `webauthn_credentials`

```sql
CREATE TABLE webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE, -- Base64URL encoded
  public_key BYTEA NOT NULL, -- COSE key format
  counter BIGINT NOT NULL DEFAULT 0, -- signCount
  transports TEXT[], -- ['usb', 'nfc', 'ble', 'internal']
  context TEXT NOT NULL CHECK (context IN ('login', 'payment')), -- Separación
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMP,
  
  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_credential_id (credential_id),
  INDEX idx_context (context),
  INDEX idx_active (is_active)
);
```

---

### Tabla: `webauthn_challenges` (Opcional - alternativa a Redis)

```sql
CREATE TABLE webauthn_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge TEXT NOT NULL UNIQUE, -- Base64URL
  context TEXT NOT NULL CHECK (context IN ('login', 'payment')),
  user_id UUID REFERENCES users(id),
  metadata JSONB, -- Para payment: { amount, currency, transactionId }
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Índices
  INDEX idx_challenge (challenge),
  INDEX idx_expires_at (expires_at),
  INDEX idx_used (used)
);

-- Limpiar challenges expirados (cron job)
DELETE FROM webauthn_challenges 
WHERE expires_at < NOW() - INTERVAL '1 hour';
```

---

### Tabla: `webauthn_audit_log`

```sql
CREATE TABLE webauthn_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  context TEXT NOT NULL CHECK (context IN ('login', 'payment')),
  event_type TEXT NOT NULL, -- 'challenge_generated', 'verification_success', 'verification_failed', 'context_mismatch'
  credential_id TEXT,
  transaction_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB, -- Detalles adicionales
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_context (context),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

---

## 🔍 VALIDACIONES ADICIONALES

### Validación de User Verification

```typescript
// Verificar flags en authenticatorData
const authData = parseAuthenticatorData(response.authenticatorData);

if (!authData.flags.uv) { // User Verification
  throw new Error("USER_VERIFICATION_REQUIRED");
}

if (!authData.flags.up) { // User Presence (para pagos)
  throw new Error("USER_PRESENCE_REQUIRED");
}
```

---

### Validación de Transports

```typescript
// Preferir transports seguros
const secureTransports = ['internal', 'usb'];
const credential = await db.getCredential(credentialId);

if (!credential.transports.some(t => secureTransports.includes(t))) {
  // Log warning pero permitir (algunos dispositivos no reportan transports)
  await auditLog.warn({
    event: "UNKNOWN_TRANSPORT",
    credentialId,
    transports: credential.transports
  });
}
```

---

## 📊 MÉTRICAS Y MONITOREO

### Métricas Clave

1. **Tasa de éxito de verificación:** `success_count / total_attempts`
2. **Tiempo promedio de verificación:** `avg(verify_duration)`
3. **Tasa de rechazo por contexto:** `context_mismatch_count / payment_attempts`
4. **Tasa de challenges expirados:** `expired_challenges / total_challenges`

### Alertas Críticas

- ⚠️ **Múltiples fallos de verificación** del mismo usuario (>3 en 5 min)
- ⚠️ **Context mismatch** en pagos (posible ataque)
- ⚠️ **Replay attack detectado** (signCount no aumenta)
- ⚠️ **Origen inválido** (posible phishing)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Endpoints separados para login y payment
- [ ] Challenge único con TTL 60s
- [ ] Context binding en pagos
- [ ] Validación de origen y RP ID
- [ ] Verificación de signCount (anti-replay)
- [ ] Rate limiting implementado
- [ ] Auditoría completa
- [ ] Manejo de errores robusto
- [ ] Tests unitarios y de integración
- [ ] Documentación de API
- [ ] Monitoreo y alertas

---

**Firmado por:** Senior Backend Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
