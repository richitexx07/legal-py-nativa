# 🔐 BiometricAuth - Guía de Implementación y Seguridad

**Componente:** `components/Security/BiometricAuth.tsx`  
**Versión:** 4.0.0 - Banking Grade Premium  
**Autor:** Legal PY Security Team

---

## 📋 RESUMEN

`BiometricAuth` es un componente de autenticación biométrica estilo **Nubank/Binance/Stripe** que implementa WebAuthn/Passkeys de forma nativa y segura.

### Características Principales

- ✅ **WebAuthn nativo** (NO hacks, NO mocks)
- ✅ **Compatible con:** TouchID, FaceID, Windows Hello, Android Biometrics
- ✅ **UI/UX premium** banking grade
- ✅ **Animaciones fluidas** con Framer Motion
- ✅ **Feedback háptico** (vibración)
- ✅ **Manejo profesional de errores**
- ✅ **Preparado para producción** con backend

---

## 🚀 USO BÁSICO

### Ejemplo 1: Login

```tsx
import BiometricAuth from "@/components/Security/BiometricAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  return (
    <div>
      <BiometricAuth 
        mode="login"
        email="usuario@example.com"
        onSuccess={() => router.push('/panel')}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
```

### Ejemplo 2: Autorización de Pago

```tsx
import BiometricAuth from "@/components/Security/BiometricAuth";

export default function PaymentModal({ amount, currency, transactionId, userId }) {
  return (
    <div>
      <h2>Autorizar Pago</h2>
      <p>Monto: {amount} {currency}</p>
      
      <BiometricAuth 
        mode="payment"
        paymentContext={{
          userId,
          amount,
          currency,
          transactionId,
        }}
        onSuccess={() => {
          // Procesar pago
          console.log('Pago autorizado');
        }}
        onError={(error) => {
          alert(error);
        }}
      />
    </div>
  );
}
```

---

## 🔐 FLUJO WEBAUTHN

### Flujo Challenge-Response

El componente implementa el flujo estándar de WebAuthn:

```
1. Frontend → Backend: POST /api/webauthn/{mode}/options
   - Envía: email (login) o paymentContext (payment)
   - Recibe: challenge (base64), allowCredentials, timeout, rpId

2. Frontend → Hardware: navigator.credentials.get()
   - Usuario autentica con biometría (TouchID, FaceID, etc.)
   - Hardware genera firma criptográfica

3. Frontend → Backend: POST /api/webauthn/{mode}/verify
   - Envía: id, rawId, response (authenticatorData, clientDataJSON, signature)
   - Backend valida firma y contexto
   - Recibe: { verified: true/false, error?: string }
```

### Modo Demo vs Producción

**Modo Demo:**
- Challenge generado localmente
- Verificación simulada
- No requiere backend

**Modo Producción:**
- Challenge viene del backend
- Verificación real con backend
- Context binding obligatorio para pagos

---

## 🛡️ SEGURIDAD

### Verificaciones Implementadas

1. **WebAuthn disponible:**
   ```ts
   typeof window.PublicKeyCredential !== "undefined"
   ```

2. **Autenticador de plataforma disponible:**
   ```ts
   await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
   ```

3. **HTTPS obligatorio:**
   - WebAuthn solo funciona en contextos seguros
   - El navegador lo valida automáticamente

4. **Context binding (pagos):**
   - Challenge ligado a: userId, amount, currency, transactionId
   - Backend valida contexto antes de aceptar firma
   - Previene modificación de monto (replay attacks)

### Controles de Seguridad

- ✅ Challenge único por request (generado en backend)
- ✅ Expiración: 60s
- ✅ Validación: origin, rpId, signCount, credentialID
- ✅ Protección contra replay attacks
- ✅ AbortController para cancelar autenticaciones

---

## ⚠️ QUÉ NO HACER

### ❌ NO inventar APIs

```ts
// ❌ MAL
const fakeAuth = await fakeBiometricAuth();

// ✅ BIEN
const assertion = await navigator.credentials.get({
  publicKey: publicKeyOptions,
});
```

### ❌ NO simular biometría

```ts
// ❌ MAL
if (demoMode) {
  return { success: true }; // Sin verificación real
}

// ✅ BIEN
if (demoMode) {
  // Simular delay pero usar API real
  await new Promise(resolve => setTimeout(resolve, 500));
}
```

### ❌ NO usar librerías obsoletas

```ts
// ❌ MAL
import * as webauthn from 'webauthn-polyfill'; // Obsoleto

// ✅ BIEN
// Usar API nativa directamente
navigator.credentials.get()
```

### ❌ NO ignorar errores

```ts
// ❌ MAL
try {
  await auth();
} catch {
  // Ignorar
}

// ✅ BIEN
try {
  await auth();
} catch (error) {
  // Manejar cada tipo de error específicamente
  if (error.name === "NotAllowedError") {
    // Usuario canceló
  } else if (error.name === "NotSupportedError") {
    // No soportado
  }
}
```

---

## 🔌 INTEGRACIÓN CON BACKEND

### Endpoint 1: Obtener Opciones (Login)

**POST** `/api/webauthn/login/options`

**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response:**
```json
{
  "challenge": "base64-encoded-challenge",
  "allowCredentials": [
    {
      "id": "base64-credential-id",
      "type": "public-key",
      "transports": ["internal", "hybrid"]
    }
  ],
  "userVerification": "required",
  "timeout": 60000,
  "rpId": "legal-py.com"
}
```

### Endpoint 2: Verificar (Login)

**POST** `/api/webauthn/login/verify`

**Request:**
```json
{
  "id": "credential-id",
  "rawId": "base64-raw-id",
  "response": {
    "authenticatorData": "base64-authenticator-data",
    "clientDataJSON": "base64-client-data",
    "signature": "base64-signature",
    "userHandle": "base64-user-handle"
  },
  "type": "public-key"
}
```

**Response:**
```json
{
  "verified": true,
  "user": {
    "id": "user-id",
    "email": "usuario@example.com"
  }
}
```

### Endpoint 3: Obtener Opciones (Payment)

**POST** `/api/webauthn/payment/options`

**Request:**
```json
{
  "email": "usuario@example.com",
  "userId": "user-id",
  "amount": 100000,
  "currency": "PYG",
  "transactionId": "txn-123"
}
```

**Response:**
```json
{
  "challenge": "base64-encoded-challenge",
  "allowCredentials": [...],
  "userVerification": "required",
  "timeout": 60000,
  "rpId": "legal-py.com"
}
```

**IMPORTANTE:** El challenge debe estar ligado al contexto de pago (userId, amount, currency, transactionId) para prevenir replay attacks.

### Endpoint 4: Verificar (Payment)

**POST** `/api/webauthn/payment/verify`

**Request:**
```json
{
  "id": "credential-id",
  "rawId": "base64-raw-id",
  "response": {
    "authenticatorData": "base64-authenticator-data",
    "clientDataJSON": "base64-client-data",
    "signature": "base64-signature",
    "userHandle": "base64-user-handle"
  },
  "type": "public-key",
  "userId": "user-id",
  "amount": 100000,
  "currency": "PYG",
  "transactionId": "txn-123"
}
```

**Response:**
```json
{
  "verified": true,
  "transactionId": "txn-123"
}
```

**IMPORTANTE:** El backend debe validar que el contexto (userId, amount, currency, transactionId) coincida con el challenge antes de aceptar la firma.

---

## 🎨 PROPS DEL COMPONENTE

```ts
interface BiometricAuthProps {
  /** Callback cuando la autenticación es exitosa */
  onSuccess: () => void;
  
  /** Callback opcional cuando hay un error */
  onError?: (error: string) => void;
  
  /** Modo de uso: 'login' para inicio de sesión, 'payment' para autorización de pagos */
  mode?: "login" | "payment";
  
  /** Deshabilitar el componente */
  disabled?: boolean;
  
  /** Email del usuario (opcional, para buscar credenciales guardadas) */
  email?: string;
  
  /** Tamaño del componente */
  size?: "sm" | "md" | "lg";
  
  /** Contexto de pago (solo para mode="payment") */
  paymentContext?: {
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
  };
  
  /** Modo demo: true = simula sin backend, false = usa backend real */
  isDemoMode?: boolean;
}
```

---

## 🐛 MANEJO DE ERRORES

### Errores Comunes

1. **NotAllowedError / AbortError:**
   - Usuario canceló la autenticación
   - **Comportamiento:** No mostrar error, volver a estado idle

2. **NotSupportedError:**
   - Biometría no soportada en este dispositivo
   - **Comportamiento:** Mostrar mensaje amigable

3. **InvalidStateError:**
   - No hay biometría registrada
   - **Comportamiento:** Sugerir registro primero

4. **SecurityError:**
   - Error de seguridad (HTTPS, origin, etc.)
   - **Comportamiento:** Mostrar mensaje de seguridad

5. **UnknownError:**
   - Error desconocido
   - **Comportamiento:** Mostrar mensaje genérico

---

## 📱 COMPATIBILIDAD

### Navegadores Soportados

- ✅ Chrome 67+ (Android, Desktop)
- ✅ Safari 14+ (iOS, macOS)
- ✅ Edge 18+ (Windows, Desktop)
- ✅ Firefox 60+ (Desktop)

### Plataformas Soportadas

- ✅ iOS 12+ (FaceID, TouchID)
- ✅ Android 9+ (API 28+) (Biometría)
- ✅ Windows 10+ (Windows Hello)
- ✅ macOS (TouchID)

### Limitaciones Conocidas

- **iOS:** Requiere HTTPS obligatorio, Safari 14+, PWA instalada para mejor experiencia
- **Android:** Requiere Chrome 67+, algunos dispositivos pueden requerir configuración adicional
- **Desktop:** Windows Hello requiere Windows 10+, TouchID requiere macOS con hardware compatible

---

## 🧪 TESTING

### Testing Manual

1. **Verificar disponibilidad:**
   - Abrir en dispositivo con biometría
   - Verificar que el componente se muestra
   - Verificar que no se muestra en dispositivos sin biometría

2. **Probar autenticación:**
   - Tocar el botón
   - Verificar que aparece el prompt de biometría
   - Autenticar con biometría
   - Verificar que se llama `onSuccess`

3. **Probar cancelación:**
   - Tocar el botón
   - Cancelar el prompt de biometría
   - Verificar que vuelve a estado idle (sin error)

4. **Probar errores:**
   - Simular error de red
   - Verificar que se muestra mensaje de error
   - Verificar que se llama `onError`

### Testing Automatizado

```ts
// Ejemplo con Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import BiometricAuth from '@/components/Security/BiometricAuth';

test('no renderiza si WebAuthn no está disponible', () => {
  // Mock: WebAuthn no disponible
  Object.defineProperty(window, 'PublicKeyCredential', {
    value: undefined,
  });
  
  const { container } = render(
    <BiometricAuth onSuccess={() => {}} />
  );
  
  expect(container.firstChild).toBeNull();
});
```

---

## 📚 RECURSOS

- [WebAuthn Specification](https://www.w3.org/TR/webauthn-2/)
- [MDN: Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [SimpleWebAuthn](https://simplewebauthn.dev/) (Librería backend recomendada)

---

**Firmado por:** Legal PY Security Team  
**Versión:** 4.0.0  
**Fecha:** 2025-01-27
