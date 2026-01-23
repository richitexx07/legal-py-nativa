# ✅ CHECKLIST DE IMPLEMENTACIÓN: WebAuthn PWA/Mobile

**Autor:** Senior PWA & Mobile Web Security Engineer  
**Fecha:** 2025-01-27

---

## 🔍 VERIFICACIONES PRE-FLIGHT

### Antes de Mostrar Componente Biométrico

```typescript
// 1. Verificar WebAuthn API
const hasWebAuthn = typeof window.PublicKeyCredential !== "undefined";
if (!hasWebAuthn) {
  return <PasswordFallback />;
}

// 2. Verificar HTTPS
const isHTTPS = window.isSecureContext === true;
if (!isHTTPS) {
  console.error("HTTPS requerido para WebAuthn");
  return <PasswordFallback />;
}

// 3. Verificar no iframe
const isNotInIframe = window.self === window.top;
if (!isNotInIframe) {
  console.error("WebAuthn no funciona en iframes");
  return <PasswordFallback />;
}

// 4. Verificar autenticador de plataforma
const hasPlatformAuth = await window.PublicKeyCredential
  .isUserVerifyingPlatformAuthenticatorAvailable();
if (!hasPlatformAuth) {
  return <PasswordFallback />;
}
```

---

## 📱 VERIFICACIONES ESPECÍFICAS POR PLATAFORMA

### iOS

```typescript
// Verificar versión mínima iOS 14
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
if (isIOS) {
  // Verificar iOS 14+
  const iosVersion = parseFloat(
    navigator.userAgent.match(/OS (\d+)_(\d+)/)?.[0]?.replace('_', '.') || '0'
  );
  
  if (iosVersion < 14.0) {
    console.warn("iOS 14+ requerido para WebAuthn");
    return <PasswordFallback />;
  }
  
  // Verificar PWA (recomendado pero no obligatorio)
  const isPWA = window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as any).standalone === true;
  
  if (!isPWA) {
    console.info("PWA instalada mejora la experiencia en iOS");
    // No bloquear, solo informar
  }
}
```

### Android

```typescript
// Verificar versión mínima Chrome 67
const isAndroid = /Android/.test(navigator.userAgent);
if (isAndroid) {
  const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1];
  
  if (!chromeVersion || parseInt(chromeVersion) < 67) {
    console.warn("Chrome 67+ requerido para WebAuthn");
    return <PasswordFallback />;
  }
  
  // Verificar Android 9+ para biometría nativa
  const androidVersion = parseFloat(
    navigator.userAgent.match(/Android (\d+(\.\d+)?)/)?.[1] || '0'
  );
  
  if (androidVersion < 9.0) {
    console.warn("Android 9+ recomendado para biometría nativa");
    // No bloquear, puede funcionar con PIN/password
  }
}
```

---

## 🎨 UX MOBILE: IMPLEMENTACIÓN

### Botón Thumb-Friendly

```typescript
// Mínimo 44x44px (Apple guidelines)
// Recomendado: 56x56px para mejor UX
<button
  className="w-14 h-14 min-w-[56px] min-h-[56px]"
  style={{
    touchAction: 'manipulation', // Mejora respuesta táctil
    WebkitTapHighlightColor: 'transparent' // Elimina highlight azul en iOS
  }}
>
  🔐
</button>
```

### Feedback Háptico

```typescript
// Vibración al iniciar
const handleClick = async () => {
  // Vibración corta al iniciar
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  try {
    const credential = await navigator.credentials.get({...});
    
    // Vibración de éxito (patrón)
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  } catch (error) {
    // Vibración de error (patrón diferente)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }
};
```

### Estados Visuales Claros

```typescript
const [state, setState] = useState<'idle' | 'active' | 'success' | 'error'>('idle');

// Renderizado condicional
{state === 'idle' && (
  <button onClick={handleClick}>
    Iniciar sesión con huella
  </button>
)}

{state === 'active' && (
  <div>
    <Spinner />
    <p>Esperando tu huella...</p>
  </div>
)}

{state === 'success' && (
  <div>
    <CheckIcon />
    <p>✓ Autenticado</p>
  </div>
)}

{state === 'error' && (
  <div>
    <ErrorIcon />
    <p>Error al autenticar</p>
    <button onClick={handleRetry}>Reintentar</button>
    <button onClick={handlePasswordFallback}>Usar contraseña</button>
  </div>
)}
```

---

## 🔄 FALLBACK IMPLEMENTATION

### Componente de Fallback

```typescript
export function PasswordFallback({ onPasswordSubmit }: { onPasswordSubmit: (password: string) => void }) {
  return (
    <div className="fallback-container">
      <div className="warning-banner">
        <p>⚠️ Biometría no disponible en este dispositivo</p>
        <p className="text-sm">Usa tu contraseña para continuar</p>
      </div>
      
      <form onSubmit={(e => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        onPasswordSubmit(formData.get('password') as string);
      })}>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          autoComplete="current-password"
        />
        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
```

### Lógica de Fallback

```typescript
export function BiometricWithFallback() {
  const [compatibility, setCompatibility] = useState<WebAuthnCompatibility | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    checkWebAuthnCompatibility().then((comp) => {
      setCompatibility(comp);
      
      // Mostrar fallback si:
      // 1. WebAuthn no disponible
      // 2. Autenticador no disponible
      // 3. No HTTPS
      // 4. En iframe
      if (comp.fallbackRecommended || !comp.isAvailable) {
        setShowFallback(true);
      }
    });
  }, []);

  if (showFallback || !compatibility?.isAvailable) {
    return <PasswordFallback onPasswordSubmit={handlePassword} />;
  }

  return <BiometricComponent />;
}
```

---

## ⚠️ MANEJO DE ERRORES ESPECÍFICOS

### Errores WebAuthn

```typescript
try {
  const credential = await navigator.credentials.get({
    publicKey: options,
    signal: AbortSignal.timeout(60000) // 60s timeout
  });
} catch (error: any) {
  // Cancelación del usuario (NO es error)
  if (error.name === "NotAllowedError" || error.name === "AbortError") {
    setState('idle');
    return; // No mostrar error
  }
  
  // No soportado
  if (error.name === "NotSupportedError") {
    setState('error');
    setErrorMessage("Biometría no soportada en este dispositivo");
    setShowFallback(true);
    return;
  }
  
  // Error de seguridad (HTTPS, iframe, etc.)
  if (error.name === "SecurityError") {
    setState('error');
    setErrorMessage("Error de seguridad. Verifica que estés en HTTPS.");
    setShowFallback(true);
    return;
  }
  
  // Credencial no encontrada
  if (error.name === "InvalidStateError") {
    setState('error');
    setErrorMessage("No tienes biometría registrada. Regístrate primero.");
    setShowFallback(true);
    return;
  }
  
  // Timeout
  if (error.name === "TimeoutError") {
    setState('error');
    setErrorMessage("Tiempo de espera agotado. Intenta nuevamente.");
    return;
  }
  
  // Error desconocido
  console.error("WebAuthn error:", error);
  setState('error');
  setErrorMessage("Error al autenticar. Intenta nuevamente o usa contraseña.");
  setShowFallback(true);
}
```

---

## 🧪 TESTING CHECKLIST

### Pre-Deployment

- [ ] ✅ **iOS 14+ con Face ID** (Safari normal)
  - [ ] Verificar que funciona
  - [ ] Verificar fallback si no disponible
  - [ ] Verificar feedback visual

- [ ] ✅ **iOS 14+ con Face ID** (PWA instalada)
  - [ ] Verificar mejor experiencia
  - [ ] Verificar que no muestra recomendación

- [ ] ✅ **iOS 14+ con Touch ID** (Safari normal)
  - [ ] Verificar que funciona
  - [ ] Verificar fallback

- [ ] ✅ **iOS 14+ con Touch ID** (PWA instalada)
  - [ ] Verificar mejor experiencia

- [ ] ✅ **Android 9+ con biometría** (Chrome normal)
  - [ ] Verificar que funciona
  - [ ] Verificar fallback

- [ ] ✅ **Android 9+ con biometría** (PWA instalada)
  - [ ] Verificar mejor experiencia

- [ ] ✅ **Android 7-8 sin biometría**
  - [ ] Verificar fallback automático
  - [ ] Verificar que no bloquea

- [ ] ✅ **HTTP (no HTTPS)**
  - [ ] Verificar fallback automático
  - [ ] Verificar mensaje claro

- [ ] ✅ **Iframe**
  - [ ] Verificar fallback automático
  - [ ] Verificar mensaje claro

- [ ] ✅ **Usuario cancela**
  - [ ] Verificar que no muestra error
  - [ ] Verificar que vuelve a estado idle

- [ ] ✅ **Timeout (60s)**
  - [ ] Verificar mensaje claro
  - [ ] Verificar opción de reintentar

- [ ] ✅ **Botón thumb-friendly**
  - [ ] Verificar mínimo 44x44px
  - [ ] Verificar fácil de tocar

- [ ] ✅ **Vibración háptica**
  - [ ] Verificar vibración al iniciar
  - [ ] Verificar vibración de éxito
  - [ ] Verificar vibración de error

- [ ] ✅ **Feedback visual**
  - [ ] Verificar estados claros (idle, active, success, error)
  - [ ] Verificar animaciones suaves

---

## 📊 MATRIZ DE DECISIÓN

| Condición | Acción |
|-----------|--------|
| `!hasWebAuthn` | Mostrar fallback inmediatamente |
| `!isHTTPS` | Mostrar fallback con mensaje "HTTPS requerido" |
| `isInIframe` | Mostrar fallback con mensaje "No funciona en iframes" |
| `!hasPlatformAuth` | Mostrar fallback con mensaje "Biometría no disponible" |
| `iOS < 14` | Mostrar fallback con mensaje "iOS 14+ requerido" |
| `Android Chrome < 67` | Mostrar fallback con mensaje "Chrome 67+ requerido" |
| `Usuario cancela` | Volver a estado idle (no error) |
| `Timeout` | Mostrar error con opción de reintentar |
| `Error desconocido` | Mostrar error genérico + fallback |

---

## 🎯 PRINCIPIOS DE IMPLEMENTACIÓN

1. **Verificar siempre antes de usar**
   - No asumir soporte
   - Verificar todas las condiciones

2. **Fallback siempre disponible**
   - Nunca bloquear al usuario
   - Ofrecer alternativa clara

3. **UX mobile-first**
   - Botones thumb-friendly
   - Feedback visual y háptico
   - Animaciones claras

4. **Manejo de errores específico**
   - No tratar cancelación como error
   - Mensajes claros por tipo de error
   - Fallback automático en errores críticos

5. **Testing exhaustivo**
   - Probar en dispositivos reales
   - Probar múltiples versiones
   - Probar PWA instalada y no instalada

---

**Firmado por:** Senior PWA & Mobile Web Security Engineer  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
