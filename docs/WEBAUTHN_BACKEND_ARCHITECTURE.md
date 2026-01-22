# Arquitectura Backend WebAuthn - Legal PY

## 🎯 Objetivo

Diseñar un backend WebAuthn **seguro y separado por contexto** para Legal PY, siguiendo estándares de bancos digitales (Binance, Nubank).

---

## 🔐 Separación de Flujos (OBLIGATORIO)

### Endpoints de Login Biométrico

```
GET  /api/webauthn/login/options
POST /api/webauthn/login/verify
```

**Propósito**: Autenticación passwordless para inicio de sesión.

**Flujo**:
1. Frontend solicita opciones → Backend genera challenge único
2. Usuario autentica con biometría → Frontend obtiene assertion
3. Frontend envía assertion → Backend valida y crea sesión

---

### Endpoints de Pago/Transacción Biométrica

```
POST /api/webauthn/payment/options
POST /api/webauthn/payment/verify
```

**Propósito**: Autorización biométrica para transacciones financieras.

**Flujo**:
1. Frontend envía contexto de pago → Backend genera challenge ligado al contexto
2. Usuario autentica con biometría → Frontend obtiene assertion
3. Frontend envía assertion + contexto → Backend valida firma Y contexto

---

## 🛡️ Seguridad WebAuthn Real

### Challenge Management

- **Generación**: Challenge único por request (32 bytes aleatorios)
- **Expiración**: 60 segundos
- **Almacenamiento**: Redis/Memcached con TTL
- **Validación**: Rechazar challenges reutilizados (protección replay)

### Validaciones Obligatorias

1. **Origin**: Verificar que `clientDataJSON.origin` coincida con el dominio esperado
2. **rpId**: Validar que `rpId` sea el dominio correcto
3. **signCount**: Verificar que el contador sea mayor al último conocido (anti-replay)
4. **credentialID**: Validar que la credencial pertenezca al usuario
5. **Firma**: Verificar la firma criptográfica con la clave pública almacenada

### Configuración WebAuthn

```typescript
{
  userVerification: "required",  // Obligatorio para seguridad bancaria
  authenticatorSelection: {
    authenticatorAttachment: "platform",  // Preferir FaceID/TouchID
    requireResidentKey: false,
  },
  timeout: 60000,  // 60 segundos
}
```

---

## 🔗 Context Binding (CRÍTICO para Pagos)

### En Pagos: Challenge Ligado al Contexto

El challenge debe estar ligado a:

- `userId`: ID del usuario que autoriza
- `amount`: Monto de la transacción
- `currency`: Moneda (PYG, USD, etc.)
- `transactionId`: ID único de la transacción

### Validación de Contexto

**Backend debe rechazar la firma si**:
- El contexto no coincide con el challenge almacenado
- El challenge expiró
- El challenge ya fue usado (replay attack)
- El userId no coincide con el dueño de la credencial

### Ejemplo de Payload (Payment Options)

```json
{
  "userId": "user_123",
  "amount": 50000,
  "currency": "PYG",
  "transactionId": "txn_abc123"
}
```

**Backend responde**:
```json
{
  "challenge": "base64_encoded_challenge",
  "allowCredentials": [...],
  "rpId": "legal-py.vercel.app",
  "timeout": 60000,
  "userVerification": "required"
}
```

**El challenge se almacena en Redis con**:
```json
{
  "challenge": "...",
  "userId": "user_123",
  "amount": 50000,
  "currency": "PYG",
  "transactionId": "txn_abc123",
  "expiresAt": "2026-01-22T16:00:00Z"
}
```

---

## 📋 Flujo Paso a Paso

### Login Biométrico

1. **Frontend**: `GET /api/webauthn/login/options?email=user@example.com`
2. **Backend**: 
   - Busca credenciales del usuario
   - Genera challenge único
   - Almacena challenge en Redis (TTL 60s)
   - Retorna opciones WebAuthn
3. **Frontend**: `navigator.credentials.get()` → Usuario autentica
4. **Frontend**: `POST /api/webauthn/login/verify` con assertion
5. **Backend**:
   - Valida challenge (existe, no expirado, no usado)
   - Valida firma criptográfica
   - Valida origin, rpId, signCount
   - Crea sesión de usuario
   - Marca challenge como usado
   - Retorna token de sesión

### Pago Biométrico

1. **Frontend**: `POST /api/webauthn/payment/options` con contexto
2. **Backend**:
   - Valida que el usuario tenga credenciales
   - Genera challenge único
   - **LIGA challenge al contexto** (userId, amount, currency, transactionId)
   - Almacena en Redis con contexto
   - Retorna opciones WebAuthn
3. **Frontend**: `navigator.credentials.get()` → Usuario autoriza
4. **Frontend**: `POST /api/webauthn/payment/verify` con assertion + contexto
5. **Backend**:
   - Valida challenge (existe, no expirado, no usado)
   - **VALIDA QUE EL CONTEXTO COINCIDA** (userId, amount, currency, transactionId)
   - Valida firma criptográfica
   - Valida origin, rpId, signCount
   - Autoriza la transacción
   - Marca challenge como usado
   - Retorna confirmación

---

## ⚠️ Errores Comunes y Mitigación

### 1. Replay Attacks

**Problema**: Usuario reutiliza una firma válida.

**Mitigación**:
- Challenges únicos y de un solo uso
- Validar signCount (debe ser mayor al último)
- TTL corto (60s)

### 2. Context Mismatch (Pagos)

**Problema**: Usuario cambia el monto después de obtener el challenge.

**Mitigación**:
- Context binding: challenge ligado al contexto
- Validar contexto en verify
- Rechazar si no coincide

### 3. Challenge Expiration

**Problema**: Usuario tarda más de 60s en autenticar.

**Mitigación**:
- TTL de 60s en Redis
- Frontend muestra timeout
- Usuario debe reiniciar el flujo

### 4. Credential Theft

**Problema**: Credencial robada y usada en otro dispositivo.

**Mitigación**:
- Validar origin (solo desde dominio correcto)
- Validar rpId
- Monitorear signCount (alertas si cambia abruptamente)

---

## 📚 Recomendaciones de Librerías

### Backend (Node.js)

**@simplewebauthn/server** (Recomendado)
- Implementación completa de WebAuthn
- Validaciones de seguridad incluidas
- Soporte para challenges, verificaciones, etc.

```bash
npm install @simplewebauthn/server
```

**Alternativas**:
- `webauthn` (más básico)
- `@github/webauthn-json` (solo frontend)

### Almacenamiento de Challenges

**Redis** (Recomendado)
- TTL automático
- Alta performance
- Escalable

**Alternativas**:
- Memcached
- Base de datos con expiración

---

## 🔄 Switch Demo → Producción

### Frontend Preparado

El componente `BiometricAuth` ya está preparado:

```typescript
// Demo mode (actual)
isDemoMode={true}  // Genera challenge localmente, simula verificación

// Producción (cuando backend esté listo)
isDemoMode={false}  // Usa endpoints reales, verificación real
```

### Variables de Entorno

```env
# Demo
NEXT_PUBLIC_DEMO_MODE=true

# Producción
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_WEBAUTHN_API_URL=https://api.legal-py.com
```

---

## ✅ Checklist de Implementación Backend

- [ ] Endpoints `/api/webauthn/login/options` y `/verify`
- [ ] Endpoints `/api/webauthn/payment/options` y `/verify`
- [ ] Generación de challenges únicos
- [ ] Almacenamiento de challenges (Redis con TTL)
- [ ] Validación de origin y rpId
- [ ] Validación de signCount
- [ ] Context binding para pagos
- [ ] Protección contra replay attacks
- [ ] Manejo de errores amigables
- [ ] Logging de intentos de autenticación
- [ ] Rate limiting en endpoints
- [ ] Tests de seguridad

---

## 📝 Notas Finales

- **Nunca reutilizar challenges** entre login y pagos
- **Context binding es crítico** para pagos
- **Validaciones de seguridad** son obligatorias
- **Frontend ya está preparado** para el switch
