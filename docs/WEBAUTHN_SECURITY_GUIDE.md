# 🔐 WebAuthn Security Guide - Legal PY

**Versión:** 1.0.0  
**Fecha:** 21 de Enero, 2026  
**Audiencia:** Backend Developers, Security Engineers

---

## 📋 RESUMEN

Este documento explica el flujo WebAuthn implementado en `BiometricAuth.tsx` y cómo conectarlo correctamente al backend para verificación de firmas criptográficas.

---

## 🔄 FLUJO WEBAUTHN (Challenge-Response)

### 1. Frontend: Iniciar Autenticación

```typescript
// El componente genera un challenge aleatorio
const challenge = generateChallenge(); // 32 bytes aleatorios

// Llama a la API WebAuthn nativa
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge,
    allowCredentials: [...], // Opcional: credenciales específicas
    timeout: 60000,
    rpId: window.location.hostname,
  },
});
```

### 2. Frontend: Extraer Datos

```typescript
const response = assertion.response as AuthenticatorAssertionResponse;

const dataToSend = {
  id: assertion.id,
  rawId: arrayBufferToBase64(assertion.rawId),
  response: {
    authenticatorData: arrayBufferToBase64(response.authenticatorData),
    clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
    signature: arrayBufferToBase64(response.signature),
    userHandle: response.userHandle 
      ? arrayBufferToBase64(response.userHandle) 
      : null,
  },
  type: assertion.type,
};
```

### 3. Backend: Verificar Firma

```typescript
// POST /api/auth/webauthn/verify
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

const verification = await verifyAuthenticationResponse({
  response: {
    authenticatorData: base64ToArrayBuffer(data.authenticatorData),
    clientDataJSON: base64ToArrayBuffer(data.clientDataJSON),
    signature: base64ToArrayBuffer(data.signature),
    userHandle: data.userHandle ? base64ToArrayBuffer(data.userHandle) : undefined,
  },
  expectedChallenge: storedChallenge, // Del paso 1 (guardado en sesión)
  expectedOrigin: 'https://legalpy.com',
  expectedRPID: 'legalpy.com',
  authenticator: {
    credentialID: base64ToArrayBuffer(data.rawId),
    credentialPublicKey: storedPublicKey, // De la base de datos
    counter: storedCounter, // Prevenir replay attacks
  },
});

if (verification.verified) {
  // Autenticación exitosa
  // Actualizar counter en BD
  // Crear sesión
  return { success: true, session: createSession(user) };
}
```

---

## 🚨 SEGURIDAD: QUÉ NO HACER

### ❌ NUNCA HACER

1. **NO confiar solo en la verificación del frontend**
   - El frontend solo verifica que la API respondió
   - El backend DEBE verificar la firma criptográfica

2. **NO reutilizar challenges**
   - Cada challenge debe ser único y usado una sola vez
   - Guardar en sesión con expiración (5 minutos)

3. **NO ignorar el counter**
   - El counter previene replay attacks
   - Debe incrementarse en cada autenticación exitosa
   - Si el counter recibido es menor o igual al almacenado, RECHAZAR

4. **NO permitir múltiples intentos con el mismo challenge**
   - Un challenge = una autenticación
   - Si falla, generar nuevo challenge

5. **NO almacenar challenges en localStorage**
   - Usar sesiones del servidor o tokens JWT temporales
   - Los challenges deben ser efímeros

6. **NO confiar en el rpId del frontend**
   - El backend debe validar el rpId esperado
   - Debe coincidir exactamente con el dominio

7. **NO permitir autenticación sin verificación de origen**
   - Validar `expectedOrigin` estrictamente
   - Solo permitir orígenes autorizados

---

## ✅ MEJORES PRÁCTICAS

### 1. Challenge Generation

```typescript
// Backend: Generar challenge seguro
import crypto from 'crypto';

const challenge = crypto.randomBytes(32);
const challengeBase64 = challenge.toString('base64');

// Guardar en sesión con expiración
session.set('webauthn_challenge', challengeBase64, { expiresIn: 300 }); // 5 min
```

### 2. Verificación de Firma

```typescript
// Usar biblioteca probada: @simplewebauthn/server
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

const verification = await verifyAuthenticationResponse({
  response: parsedResponse,
  expectedChallenge: session.get('webauthn_challenge'),
  expectedOrigin: process.env.ALLOWED_ORIGIN,
  expectedRPID: process.env.RP_ID,
  authenticator: storedCredential,
  requireUserVerification: true, // CRÍTICO: Requerir verificación del usuario
});
```

### 3. Manejo de Counter

```typescript
if (verification.verified) {
  const newCounter = verification.authenticationInfo.newCounter;
  
  // Verificar que el counter aumentó
  if (newCounter <= storedCounter) {
    throw new Error('Counter replay attack detected');
  }
  
  // Actualizar en BD
  await updateCredentialCounter(credentialId, newCounter);
}
```

### 4. Rate Limiting

```typescript
// Limitar intentos de autenticación
const attempts = await getAuthAttempts(userId);
if (attempts > 5) {
  throw new Error('Too many attempts');
}

// Incrementar contador de intentos
await incrementAuthAttempts(userId);
```

---

## 🔧 INTEGRACIÓN BACKEND (High-Level)

### Endpoint: POST /api/auth/webauthn/verify

```typescript
// Pseudocódigo de integración
export async function POST(request: Request) {
  try {
    const { id, rawId, response, type } = await request.json();
    
    // 1. Obtener challenge de la sesión
    const expectedChallenge = session.get('webauthn_challenge');
    if (!expectedChallenge) {
      return Response.json({ error: 'Challenge expired' }, { status: 400 });
    }
    
    // 2. Buscar credencial en BD
    const credential = await db.credentials.findUnique({
      where: { id: rawId },
      include: { user: true },
    });
    
    if (!credential) {
      return Response.json({ error: 'Credential not found' }, { status: 404 });
    }
    
    // 3. Verificar firma
    const verification = await verifyAuthenticationResponse({
      response: {
        authenticatorData: base64ToArrayBuffer(response.authenticatorData),
        clientDataJSON: base64ToArrayBuffer(response.clientDataJSON),
        signature: base64ToArrayBuffer(response.signature),
      },
      expectedChallenge,
      expectedOrigin: process.env.ALLOWED_ORIGIN,
      expectedRPID: process.env.RP_ID,
      authenticator: {
        credentialID: base64ToArrayBuffer(rawId),
        credentialPublicKey: base64ToArrayBuffer(credential.publicKey),
        counter: credential.counter,
      },
      requireUserVerification: true,
    });
    
    if (!verification.verified) {
      return Response.json({ error: 'Verification failed' }, { status: 401 });
    }
    
    // 4. Verificar counter
    if (verification.authenticationInfo.newCounter <= credential.counter) {
      return Response.json({ error: 'Replay attack detected' }, { status: 401 });
    }
    
    // 5. Actualizar counter
    await db.credentials.update({
      where: { id: rawId },
      data: { counter: verification.authenticationInfo.newCounter },
    });
    
    // 6. Eliminar challenge usado
    session.delete('webauthn_challenge');
    
    // 7. Crear sesión
    const sessionToken = createSession(credential.user);
    
    return Response.json({ 
      success: true, 
      session: sessionToken 
    });
    
  } catch (error) {
    console.error('WebAuthn verification error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 📚 BIBLIOTECAS RECOMENDADAS

### Backend

- **@simplewebauthn/server** (Node.js)
  - La más popular y mantenida
  - Soporta todos los estándares FIDO2
  - Documentación excelente

- **webauthn** (Python)
  - Para backends en Python
  - Implementación completa

### Frontend

- **NO usar bibliotecas** (recomendado)
  - El componente usa la API nativa directamente
  - Menos dependencias = más seguro
  - Mejor rendimiento

---

## 🧪 TESTING

### Tests Recomendados

1. **Test de disponibilidad**
   - Verificar que el componente se oculta si no hay soporte
   - Verificar que se muestra si hay soporte

2. **Test de autenticación exitosa**
   - Mock de `navigator.credentials.get()`
   - Verificar que `onSuccess` se llama

3. **Test de errores**
   - Test de cancelación del usuario
   - Test de timeout
   - Test de dispositivo no compatible

4. **Test de seguridad backend**
   - Test de replay attack (mismo challenge dos veces)
   - Test de counter validation
   - Test de origin validation

---

## 📊 MÉTRICAS DE SEGURIDAD

Trackear:

- Tasa de éxito de autenticación biométrica
- Tasa de rechazo (usuario cancela)
- Intentos fallidos por usuario
- Dispositivos más usados
- Errores de verificación en backend

---

## 🔗 RECURSOS

- [WebAuthn Spec](https://www.w3.org/TR/webauthn-2/)
- [SimpleWebAuthn Docs](https://simplewebauthn.dev/)
- [FIDO2 Alliance](https://fidoalliance.org/)

---

**Documento generado:** 21 de Enero, 2026  
**Componente:** `components/Security/BiometricAuth.tsx`  
**Estado:** ✅ Listo para Integración Backend
