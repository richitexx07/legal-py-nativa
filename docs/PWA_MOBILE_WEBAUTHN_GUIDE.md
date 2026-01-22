# Guía PWA y Mobile WebAuthn - Legal PY

## 🎯 Objetivo

Asegurar que la biometría funcione correctamente en:
- iOS (Safari + PWA)
- Android (Chrome + PWA)
- Desktop (Windows Hello / Touch ID)

---

## ✅ Checklist de Compatibilidad PWA

### Requisitos Obligatorios

- [x] **HTTPS activo** (`window.isSecureContext === true`)
- [x] **Same-origin** (no cross-origin auth)
- [x] **No iframes** (WebAuthn no funciona en iframes)
- [x] **WebAuthn disponible** (`window.PublicKeyCredential`)
- [x] **Autenticador de plataforma** (`isUserVerifyingPlatformAuthenticatorAvailable()`)

### Requisitos PWA

- [x] **Display mode standalone** (`display-mode: standalone`)
- [x] **Manifest.json configurado** (para instalación)
- [x] **Service Worker** (opcional pero recomendado)
- [x] **Iconos PWA** (múltiples tamaños)

### Verificaciones Implementadas

```typescript
// Verificación completa
const compatibility = await checkWebAuthnCompatibility();
const pwa = checkPWAConditions();

// Disponible solo si:
- compatibility.isAvailable === true
- compatibility.platformAuthenticatorAvailable === true
- compatibility.isSecureContext === true
- !pwa.isInIframe
```

---

## 📱 Limitaciones Reales por Plataforma

### iOS (Safari)

#### Limitaciones Conocidas

1. **HTTPS Obligatorio**
   - WebAuthn NO funciona en HTTP
   - Requiere certificado válido (no self-signed en producción)

2. **Versión de Safari**
   - Safari 14+ requerido para WebAuthn completo
   - iOS 14+ para mejor soporte
   - FaceID requiere iOS 12+

3. **PWA vs Safari**
   - Funciona mejor en PWA instalada
   - En Safari normal puede tener limitaciones
   - `display-mode: standalone` mejora experiencia

4. **No Iframes**
   - WebAuthn NO funciona en iframes
   - Debe ejecutarse en ventana principal

5. **Cross-Origin**
   - No funciona en cross-origin
   - Mismo dominio requerido

#### Soluciones Implementadas

- ✅ Verificación de HTTPS antes de mostrar componente
- ✅ Detección de PWA instalada
- ✅ Verificación de iframe (ocultar si está en iframe)
- ✅ Fallback a contraseña si no está disponible

---

### Android (Chrome)

#### Limitaciones Conocidas

1. **Versión de Chrome**
   - Chrome 67+ requerido
   - Android 9+ (API 28+) para biometría completa

2. **Biometría del Sistema**
   - Requiere configuración de biometría en Android
   - Algunos dispositivos pueden requerir configuración adicional

3. **PWA**
   - Funciona mejor en PWA instalada
   - Chrome normal funciona pero PWA mejora UX

4. **Navegadores Alternativos**
   - Firefox Android: Soporte limitado
   - Samsung Internet: Soporte variable
   - Edge Android: Soporte completo

#### Soluciones Implementadas

- ✅ Detección de plataforma Android
- ✅ Verificación de autenticador disponible
- ✅ Fallback seguro si no está disponible

---

### Desktop

#### Windows Hello

- ✅ Windows 10+ requerido
- ✅ Hardware compatible (cámara IR, sensor de huella)
- ✅ Edge/Chrome recomendados

#### macOS Touch ID

- ✅ macOS con hardware compatible
- ✅ Safari/Chrome/Edge soportados
- ✅ TouchID requiere hardware específico

#### Soluciones Implementadas

- ✅ Detección de plataforma desktop
- ✅ Verificación de autenticador disponible
- ✅ Fallback a contraseña

---

## 🔄 Estrategia de Fallback

### Niveles de Fallback

1. **Nivel 1: WebAuthn Disponible**
   - ✅ Usar biometría nativa
   - ✅ Mejor experiencia

2. **Nivel 2: WebAuthn No Disponible**
   - ⚠️ Mostrar mensaje claro
   - ⚠️ Botón de fallback a contraseña
   - ⚠️ NO bloquear al usuario

3. **Nivel 3: Error de Autenticación**
   - ⚠️ Mostrar error específico
   - ⚠️ Permitir reintento
   - ⚠️ Opción de fallback

### Implementación

```typescript
// En LoginBiometric y PayBiometric
if (!isAvailable) {
  if (compatibility?.fallbackRecommended) {
    return (
      <div className="fallback-ui">
        <p>⚠️ Biometría no disponible</p>
        <button onClick={fallbackToPassword}>
          Usar contraseña
        </button>
      </div>
    );
  }
  return null;
}
```

### Fallback Options

1. **Contraseña tradicional**
   - Siempre disponible
   - Seguro y confiable

2. **PIN**
   - Para usuarios que prefieren PIN
   - Más rápido que contraseña

3. **OTP (One-Time Password)**
   - SMS o Email
   - Seguro pero menos conveniente

---

## ⚠️ Errores Típicos en Mobile WebAuthn

### 1. HTTPS No Activo

**Error**: `SecurityError: The operation is insecure`

**Causa**: WebAuthn requiere HTTPS (excepto localhost)

**Solución**:
- ✅ Verificar `window.isSecureContext`
- ✅ Usar HTTPS en producción
- ✅ Fallback si no está disponible

### 2. Iframe Context

**Error**: `NotAllowedError` o `SecurityError`

**Causa**: WebAuthn no funciona en iframes

**Solución**:
- ✅ Verificar `window.self !== window.top`
- ✅ Ejecutar en ventana principal
- ✅ No usar iframes para WebAuthn

### 3. iOS Safari Limitaciones

**Error**: `NotSupportedError` o comportamiento inconsistente

**Causa**: Safari tiene limitaciones conocidas

**Solución**:
- ✅ Recomendar PWA instalada
- ✅ Verificar versión de Safari
- ✅ Fallback a contraseña

### 4. Timeout en Mobile

**Error**: Usuario tarda más de 60s

**Causa**: Timeout configurado muy corto o usuario lento

**Solución**:
- ✅ Timeout de 60s (configurado)
- ✅ Mensaje claro si expira
- ✅ Permitir reintento

### 5. Permisos Denegados

**Error**: `NotAllowedError`

**Causa**: Usuario denegó permiso de biometría

**Solución**:
- ✅ No mostrar error agresivo
- ✅ Explicar cómo habilitar
- ✅ Fallback inmediato

### 6. Credencial No Encontrada

**Error**: `InvalidStateError`

**Causa**: Usuario no tiene biometría registrada

**Solución**:
- ✅ Mensaje claro: "Regístrate primero"
- ✅ Redirigir a registro
- ✅ Fallback a contraseña

---

## 🧪 Recomendaciones de Testing

### Dispositivos a Probar

#### iOS
- [ ] iPhone 12+ (FaceID)
- [ ] iPhone 8-11 (TouchID)
- [ ] iPad (FaceID/TouchID según modelo)
- [ ] Safari normal
- [ ] PWA instalada

#### Android
- [ ] Android 9+ (Chrome)
- [ ] Android 10+ (mejor soporte)
- [ ] Diferentes fabricantes (Samsung, Xiaomi, etc.)
- [ ] Chrome normal
- [ ] PWA instalada

#### Desktop
- [ ] Windows 10+ (Windows Hello)
- [ ] macOS (TouchID)
- [ ] Chrome/Edge/Firefox

### Escenarios de Prueba

1. **HTTPS vs HTTP**
   - [ ] Verificar que HTTP muestra fallback
   - [ ] Verificar que HTTPS funciona

2. **PWA vs Browser**
   - [ ] Probar en Safari normal
   - [ ] Probar en PWA instalada
   - [ ] Comparar experiencia

3. **Iframe**
   - [ ] Verificar que no funciona en iframe
   - [ ] Verificar fallback correcto

4. **Fallbacks**
   - [ ] Deshabilitar biometría en dispositivo
   - [ ] Verificar que muestra fallback
   - [ ] Verificar que no bloquea

5. **Errores**
   - [ ] Cancelar autenticación
   - [ ] Timeout
   - [ ] Permisos denegados
   - [ ] Credencial no encontrada

### Herramientas de Testing

1. **Chrome DevTools**
   - Device Mode
   - Network throttling
   - Security panel

2. **Safari Web Inspector**
   - iOS Simulator
   - Device testing

3. **BrowserStack / Sauce Labs**
   - Testing en dispositivos reales
   - Múltiples plataformas

---

## 📝 Configuración PWA (Next.js)

### Manifest.json

```json
{
  "name": "Legal PY",
  "short_name": "LegalPY",
  "description": "Plataforma legal integral de Paraguay",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0E1B2A",
  "theme_color": "#C9A24D",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (Opcional)

- Recomendado para mejor experiencia
- Cache de assets
- Offline support

---

## ✅ Mejoras Implementadas

### UX Mobile

- ✅ Botones más grandes en mobile (thumb-friendly)
- ✅ Touch targets mínimo 44x44px (Apple guidelines)
- ✅ Vibración háptica mejorada
- ✅ Animaciones optimizadas para mobile
- ✅ Feedback visual claro

### Compatibilidad

- ✅ Verificación completa de compatibilidad
- ✅ Detección de PWA instalada
- ✅ Detección de plataforma (iOS/Android/Desktop)
- ✅ Verificación de HTTPS
- ✅ Verificación de iframe

### Fallbacks

- ✅ Fallback seguro si no está disponible
- ✅ NO bloquea al usuario
- ✅ Mensajes claros
- ✅ Opción de usar contraseña

---

## 🎯 Resultado Final

- ✅ Compatible con iOS, Android y Desktop
- ✅ Funciona en PWA instalada
- ✅ Fallbacks seguros implementados
- ✅ UX optimizada para mobile
- ✅ Preparado para producción
- ✅ No bloquea usuarios
