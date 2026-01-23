# 🔐 WebAuthn en PWA y Mobile Web - Guía de Seguridad y Compatibilidad

**Autor:** Senior PWA & Mobile Web Security Engineer  
**Fecha:** 2025-01-27  
**Principio:** Realismo sobre limitaciones, nunca inventar soporte inexistente

---

## 📋 ÍNDICE

1. [Checklist de Compatibilidad PWA](#checklist-de-compatibilidad-pwa)
2. [Limitaciones Reales por Plataforma](#limitaciones-reales-por-plataforma)
3. [Estrategia de Fallback](#estrategia-de-fallback)
4. [Errores Típicos en Mobile WebAuthn](#errores-típicos-en-mobile-webauthn)
5. [Recomendaciones de Testing](#recomendaciones-de-testing)

---

## ✅ CHECKLIST DE COMPATIBILIDAD PWA

### Verificaciones Obligatorias

```typescript
// 1. WebAuthn API disponible
const hasWebAuthn = typeof window.PublicKeyCredential !== "undefined";

// 2. Autenticador de plataforma disponible
const hasPlatformAuth = await window.PublicKeyCredential
  .isUserVerifyingPlatformAuthenticatorAvailable();

// 3. HTTPS obligatorio
const isHTTPS = window.isSecureContext === true;

// 4. No en iframe
const isNotInIframe = window.self === window.top;

// 5. PWA instalada (recomendado, no obligatorio)
const isPWA = window.matchMedia("(display-mode: standalone)").matches ||
              (window.navigator as any).standalone === true;
```

### Checklist Completo

- [ ] ✅ **HTTPS activo** (`window.isSecureContext === true`)
- [ ] ✅ **WebAuthn API disponible** (`window.PublicKeyCredential`)
- [ ] ✅ **Autenticador de plataforma disponible** (`isUserVerifyingPlatformAuthenticatorAvailable()`)
- [ ] ✅ **No en iframe** (`window.self === window.top`)
- [ ] ✅ **Same-origin** (no cross-origin auth)
- [ ] ⚠️ **PWA instalada** (recomendado, especialmente iOS)
- [ ] ⚠️ **Navegador compatible** (verificar versión mínima)

---

## 🚨 LIMITACIONES REALES POR PLATAFORMA

### iOS (Safari + PWA)

#### Limitaciones Críticas

1. **Safari 14+ requerido**
   - iOS 14.0+ para WebAuthn completo
   - Versiones anteriores: NO soportan WebAuthn
   - **Verificación:**
     ```typescript
     const isIOS14Plus = /OS 1[4-9]|OS [2-9][0-9]/.test(navigator.userAgent);
     ```

2. **HTTPS obligatorio**
   - HTTP: WebAuthn NO funciona
   - Localhost: Solo en desarrollo con flags especiales
   - **Verificación:**
     ```typescript
     if (!window.isSecureContext) {
       // WebAuthn NO funcionará
       return fallbackToPassword();
     }
     ```

3. **PWA mejora experiencia (no obligatorio)**
   - Safari en modo normal: Funciona, pero UX limitada
   - PWA instalada: Mejor UX, más confiable
   - **Detección:**
     ```typescript
     const isPWA = window.matchMedia("(display-mode: standalone)").matches ||
                   (window.navigator as any).standalone === true;
     ```

4. **No funciona en iframes**
   - Cross-origin iframes: Bloqueado
   - Same-origin iframes: Funciona, pero no recomendado
   - **Verificación:**
     ```typescript
     if (window.self !== window.top) {
       // WebAuthn puede fallar
       return fallbackToPassword();
     }
     ```

5. **FaceID/TouchID requiere iOS 12+**
   - iOS 11 y anteriores: NO soportan biometría WebAuthn
   - **Verificación:**
     ```typescript
     const iosVersion = parseFloat(
       navigator.userAgent.match(/OS (\d+)_(\d+)/)?.[0]?.replace('_', '.') || '0'
     );
     if (iosVersion < 12.0) {
       // Biometría no disponible
     }
     ```

6. **Safari en modo privado**
   - WebAuthn puede fallar silenciosamente
   - **Mitigación:** Detectar modo privado y mostrar fallback

#### Versiones Mínimas

| Feature | Versión Mínima iOS | Safari |
|---------|-------------------|--------|
| WebAuthn básico | iOS 14.0 | Safari 14 |
| FaceID/TouchID | iOS 12.0 | Safari 12 |
| PWA mejorada | iOS 11.3 | Safari 11.3 |

---

### Android (Chrome + PWA)

#### Limitaciones Críticas

1. **Chrome 67+ requerido**
   - Versiones anteriores: NO soportan WebAuthn
   - **Verificación:**
     ```typescript
     const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1];
     if (!chromeVersion || parseInt(chromeVersion) < 67) {
       // WebAuthn NO disponible
       return fallbackToPassword();
     }
     ```

2. **Android 9+ (API 28+) para biometría**
   - Android 8 y anteriores: WebAuthn funciona, pero sin biometría nativa
   - **Verificación:**
     ```typescript
     const androidVersion = parseFloat(
       navigator.userAgent.match(/Android (\d+(\.\d+)?)/)?.[1] || '0'
     );
     if (androidVersion < 9.0) {
       // Biometría puede no estar disponible
     }
     ```

3. **HTTPS obligatorio**
   - HTTP: WebAuthn NO funciona
   - Localhost: Funciona en desarrollo
   - **Misma verificación que iOS**

4. **PWA mejora experiencia**
   - Chrome en modo normal: Funciona bien
   - PWA instalada: Mejor UX, más confiable
   - **Misma detección que iOS**

5. **Algunos dispositivos requieren configuración**
   - Dispositivos con biometría deshabilitada
   - Dispositivos sin sensor biométrico
   - **Mitigación:** Verificar disponibilidad antes de mostrar opción

#### Versiones Mínimas

| Feature | Versión Mínima Android | Chrome |
|---------|----------------------|--------|
| WebAuthn básico | Android 7.0 | Chrome 67 |
| Biometría nativa | Android 9.0 (API 28) | Chrome 67 |
| PWA mejorada | Android 7.0 | Chrome 67 |

---

### Desktop (Windows Hello / Touch ID)

#### Limitaciones

1. **Windows Hello**
   - Windows 10+ requerido
   - Hardware compatible
   - **Verificación:** Detectar OS y hardware

2. **Touch ID (macOS)**
   - macOS con hardware compatible
   - Chrome/Edge/Firefox recomendados
   - **Verificación:** Detectar OS y navegador

3. **Navegadores compatibles**
   - Chrome 67+
   - Edge 18+ (Chromium)
   - Firefox 60+
   - Safari 14+ (macOS)

---

## 🔄 ESTRATEGIA DE FALLBACK

### Niveles de Fallback

```typescript
// Nivel 1: WebAuthn disponible
if (hasWebAuthn && hasPlatformAuth && isHTTPS) {
  return <BiometricComponent />;
}

// Nivel 2: WebAuthn sin biometría (usar PIN/password)
if (hasWebAuthn && isHTTPS) {
  return <PasswordFallback />;
}

// Nivel 3: Sin WebAuthn (password tradicional)
return <PasswordForm />;
```

### Implementación de Fallback

```typescript
export function BiometricWithFallback() {
  const [compatibility, setCompatibility] = useState<WebAuthnCompatibility | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    checkWebAuthnCompatibility().then((comp) => {
      setCompatibility(comp);
      setShowFallback(comp.fallbackRecommended);
    });
  }, []);

  if (showFallback || !compatibility?.isAvailable) {
    return <PasswordFallback />;
  }

  return <BiometricComponent />;
}
```

### Opciones de Fallback

1. **PIN/Password**
   - Siempre disponible
   - Seguro y confiable
   - **UX:** Botón claro "Usar contraseña"

2. **OTP (SMS/Email)**
   - Requiere backend
   - Seguro para 2FA
   - **UX:** "Enviar código"

3. **Magic Link**
   - Requiere backend
   - UX moderna
   - **UX:** "Enviar enlace mágico"

### Regla de Oro: Nunca Bloquear

```typescript
// ❌ INCORRECTO: Bloquear usuario
if (!hasWebAuthn) {
  return <div>Biometría requerida. No puedes continuar.</div>;
}

// ✅ CORRECTO: Ofrecer fallback
if (!hasWebAuthn) {
  return (
    <div>
      <p>Biometría no disponible en este dispositivo.</p>
      <button onClick={handlePasswordFallback}>
        Usar contraseña
      </button>
    </div>
  );
}
```

---

## ❌ ERRORES TÍPICOS EN MOBILE WEBAUTHN

### Error 1: Asumir Soporte Universal

**❌ INCORRECTO:**
```typescript
// Asumir que WebAuthn siempre funciona
const credential = await navigator.credentials.get({...});
```

**✅ CORRECTO:**
```typescript
// Verificar antes de usar
if (!window.PublicKeyCredential) {
  return fallbackToPassword();
}

const isAvailable = await window.PublicKeyCredential
  .isUserVerifyingPlatformAuthenticatorAvailable();

if (!isAvailable) {
  return fallbackToPassword();
}

const credential = await navigator.credentials.get({...});
```

---

### Error 2: Ignorar HTTPS

**❌ INCORRECTO:**
```typescript
// No verificar HTTPS
const credential = await navigator.credentials.get({...});
// Falla silenciosamente en HTTP
```

**✅ CORRECTO:**
```typescript
// Verificar HTTPS primero
if (!window.isSecureContext) {
  console.error("HTTPS requerido para WebAuthn");
  return fallbackToPassword();
}

const credential = await navigator.credentials.get({...});
```

---

### Error 3: No Manejar Errores Específicos

**❌ INCORRECTO:**
```typescript
try {
  const credential = await navigator.credentials.get({...});
} catch (error) {
  // Error genérico
  alert("Error al autenticar");
}
```

**✅ CORRECTO:**
```typescript
try {
  const credential = await navigator.credentials.get({...});
} catch (error) {
  if (error.name === "NotAllowedError") {
    // Usuario canceló - no es error
    return;
  } else if (error.name === "NotSupportedError") {
    // No soportado - mostrar fallback
    return fallbackToPassword();
  } else if (error.name === "SecurityError") {
    // Error de seguridad (HTTPS, iframe, etc.)
    return fallbackToPassword();
  } else {
    // Otro error
    console.error("WebAuthn error:", error);
    return fallbackToPassword();
  }
}
```

---

### Error 4: Botón Muy Pequeño en Mobile

**❌ INCORRECTO:**
```typescript
// Botón pequeño (difícil de tocar)
<button className="w-8 h-8">🔐</button>
```

**✅ CORRECTO:**
```typescript
// Botón thumb-friendly (mínimo 44x44px)
<button 
  className="w-14 h-14 min-w-[56px] min-h-[56px]"
  style={{ touchAction: 'manipulation' }}
>
  🔐
</button>
```

---

### Error 5: No Mostrar Feedback Visual

**❌ INCORRECTO:**
```typescript
// Sin feedback
const handleClick = async () => {
  await navigator.credentials.get({...});
};
```

**✅ CORRECTO:**
```typescript
// Con feedback visual y háptico
const [state, setState] = useState<'idle' | 'active' | 'success' | 'error'>('idle');

const handleClick = async () => {
  setState('active');
  
  // Vibración háptica (mobile)
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  try {
    const credential = await navigator.credentials.get({...});
    setState('success');
    navigator.vibrate([50, 30, 50]); // Patrón de éxito
  } catch (error) {
    setState('error');
  }
};
```

---

### Error 6: Timeout Muy Corto

**❌ INCORRECTO:**
```typescript
// Timeout muy corto (5s)
const credential = await navigator.credentials.get({
  publicKey: {
    ...options,
    timeout: 5000 // ⚠️ Muy corto
  }
});
```

**✅ CORRECTO:**
```typescript
// Timeout estándar (60s)
const credential = await navigator.credentials.get({
  publicKey: {
    ...options,
    timeout: 60000 // ✅ Estándar WebAuthn
  }
});
```

---

### Error 7: No Verificar PWA en iOS

**❌ INCORRECTO:**
```typescript
// Asumir que funciona igual en Safari normal y PWA
const credential = await navigator.credentials.get({...});
```

**✅ CORRECTO:**
```typescript
// Verificar si es PWA y ajustar UX
const isPWA = window.matchMedia("(display-mode: standalone)").matches ||
              (window.navigator as any).standalone === true;

if (!isPWA && isIOS) {
  // Mostrar recomendación de instalar PWA
  console.warn("iOS funciona mejor con PWA instalada");
}
```

---

## 🧪 RECOMENDACIONES DE TESTING

### Dispositivos Mínimos para Testing

#### iOS

1. **iPhone con Face ID** (iOS 14+)
   - iPhone X o superior
   - Safari 14+
   - PWA instalada y no instalada

2. **iPhone con Touch ID** (iOS 14+)
   - iPhone 8 o anterior
   - Safari 14+
   - PWA instalada y no instalada

3. **iPad** (iOS 14+)
   - iPad con Face ID o Touch ID
   - Safari 14+

#### Android

1. **Android 9+ con biometría**
   - Pixel 3 o superior
   - Chrome 67+
   - PWA instalada y no instalada

2. **Android 7-8 sin biometría**
   - Dispositivo con Android 7-8
   - Chrome 67+
   - Verificar fallback

#### Desktop

1. **Windows 10+ con Windows Hello**
   - Chrome 67+ / Edge 18+
   - Hardware compatible

2. **macOS con Touch ID**
   - Chrome 67+ / Safari 14+
   - Hardware compatible

---

### Escenarios de Testing

#### Escenario 1: WebAuthn Disponible

```
✅ Verificar:
- Botón biométrico visible
- Al hacer clic, aparece prompt de biometría
- Autenticación exitosa
- Feedback visual (animación, vibración)
```

#### Escenario 2: WebAuthn No Disponible

```
✅ Verificar:
- Fallback visible inmediatamente
- Botón "Usar contraseña" funcional
- No bloquea al usuario
```

#### Escenario 3: HTTPS Requerido

```
✅ Verificar:
- En HTTP, fallback automático
- Mensaje claro: "HTTPS requerido"
- No intenta usar WebAuthn
```

#### Escenario 4: iOS Safari Normal vs PWA

```
✅ Verificar:
- Safari normal: Funciona, pero puede mostrar recomendación
- PWA instalada: Funciona mejor, sin recomendación
```

#### Escenario 5: Usuario Cancela

```
✅ Verificar:
- Cancelación no es error
- Estado vuelve a "idle"
- No muestra mensaje de error
```

#### Escenario 6: Timeout

```
✅ Verificar:
- Después de 60s, timeout
- Mensaje claro: "Tiempo agotado"
- Opción de reintentar
```

---

### Testing Checklist

- [ ] ✅ **iOS 14+ con Face ID** (Safari normal)
- [ ] ✅ **iOS 14+ con Face ID** (PWA instalada)
- [ ] ✅ **iOS 14+ con Touch ID** (Safari normal)
- [ ] ✅ **iOS 14+ con Touch ID** (PWA instalada)
- [ ] ✅ **Android 9+ con biometría** (Chrome normal)
- [ ] ✅ **Android 9+ con biometría** (PWA instalada)
- [ ] ✅ **Android 7-8 sin biometría** (fallback)
- [ ] ✅ **Windows 10+ con Windows Hello**
- [ ] ✅ **macOS con Touch ID**
- [ ] ✅ **HTTP (fallback automático)**
- [ ] ✅ **Iframe (fallback automático)**
- [ ] ✅ **Usuario cancela (no error)**
- [ ] ✅ **Timeout (mensaje claro)**
- [ ] ✅ **Botón thumb-friendly (mínimo 44x44px)**
- [ ] ✅ **Vibración háptica (mobile)**
- [ ] ✅ **Feedback visual (animaciones)**

---

### Herramientas de Testing

1. **Chrome DevTools**
   - Simular dispositivos móviles
   - Verificar `isSecureContext`
   - Debug WebAuthn

2. **Safari Web Inspector**
   - Debug en iOS real
   - Verificar errores de WebAuthn

3. **BrowserStack / Sauce Labs**
   - Testing en dispositivos reales
   - Múltiples versiones de iOS/Android

4. **Local Testing**
   - Dispositivos físicos
   - Múltiples navegadores
   - PWA instalada y no instalada

---

## 📊 MATRIZ DE COMPATIBILIDAD

| Plataforma | WebAuthn | Biometría | PWA Mejora | HTTPS Req | Versión Mín |
|------------|----------|-----------|------------|-----------|-------------|
| iOS Safari 14+ | ✅ | ✅ | ⚠️ | ✅ | iOS 14.0 |
| iOS Safari 12-13 | ❌ | ❌ | ⚠️ | ✅ | - |
| iOS PWA 14+ | ✅ | ✅ | ✅ | ✅ | iOS 14.0 |
| Android Chrome 67+ | ✅ | ✅* | ⚠️ | ✅ | Android 7.0 |
| Android Chrome 67+ (API 28+) | ✅ | ✅ | ⚠️ | ✅ | Android 9.0 |
| Android PWA 67+ | ✅ | ✅* | ✅ | ✅ | Android 7.0 |
| Windows 10+ | ✅ | ✅ | N/A | ✅ | Windows 10 |
| macOS Touch ID | ✅ | ✅ | N/A | ✅ | macOS 10.12+ |

*Requiere Android 9+ (API 28) para biometría nativa

---

## 🎯 PRINCIPIOS DE IMPLEMENTACIÓN

1. **Verificar siempre antes de usar**
   - No asumir soporte
   - Verificar HTTPS, API, autenticador

2. **Fallback siempre disponible**
   - Nunca bloquear al usuario
   - Ofrecer alternativa clara

3. **UX mobile-first**
   - Botones thumb-friendly (mínimo 44x44px)
   - Feedback visual y háptico
   - Animaciones claras

4. **Manejo de errores específico**
   - No tratar cancelación como error
   - Mensajes claros por tipo de error
   - Fallback automático en errores críticos

5. **Testing en dispositivos reales**
   - No confiar solo en emuladores
   - Probar múltiples versiones
   - Probar PWA instalada y no instalada

---

**Firmado por:** Senior PWA & Mobile Web Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
