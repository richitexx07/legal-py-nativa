# Política de Seguridad - Autenticación Biométrica y Gestión de Modo Demo

**Plataforma:** Legal PY  
**Versión:** 1.0  
**Fecha:** Enero 2026  
**Estado:** Activa

---

## 1. Propósito

Esta política define las reglas de seguridad relacionadas con:

* Autenticación biométrica
* Autorización de pagos
* Uso de modo demo
* Prevención de bloqueos de interfaz

El objetivo es equilibrar:

* Seguridad
* Usabilidad
* Cumplimiento legal
* Experiencia de demostración

---

## 2. Principios de Seguridad

Legal PY se rige por los siguientes principios:

* 🔐 **Seguridad por contexto**
* 🧠 **Menor fricción posible**
* 🚫 **Nunca bloquear completamente al usuario**
* 🧪 **Separación estricta entre Demo y Producción**

---

## 3. Autenticación Biométrica

### 3.1 Tecnología

* **WebAuthn / Passkeys** (estándar W3C)
* Autenticadores de plataforma (biometría local)
* **No se almacenan datos biométricos en servidores**
* Los datos biométricos permanecen en el dispositivo del usuario

### 3.2 Separación de Flujos

* **Login biométrico ≠ Autorización de pagos**
* Cada flujo utiliza:
  * Challenges distintos
  * Validaciones independientes
  * Contexto propio
  * Endpoints separados (`/api/webauthn/login/*` vs `/api/webauthn/payment/*`)

### 3.3 Controles de Seguridad

**Implementados:**
- Verificación de HTTPS (previene MITM)
- Verificación de iframe (previene cross-origin)
- Challenges únicos (previene replay)
- Validación de origin en backend (previene phishing)
- SignCount validation (previene replay)
- Session regeneration (previene session fixation)
- Context binding para pagos (previene modificación de monto)

---

## 4. Autorización de Pagos

### 4.1 Obligatoriedad

La biometría es **obligatoria** en:

* Pagos
* Transferencias
* Suscripciones

### 4.2 Context Binding

El challenge está ligado a:

* Usuario (`userId`)
* Monto (`amount`)
* Moneda (`currency`)
* Operación específica (`transactionId`)

**El backend rechaza la autorización si el contexto no coincide exactamente.**

### 4.3 Restricciones

* **No se permite bypass en producción**
* El botón de omitir se oculta automáticamente en rutas de pago
* La verificación es obligatoria y no puede ser evitada

---

## 5. Modo Demo

### 5.1 Definición

El modo demo es un entorno controlado para:

* Pruebas
* Presentaciones
* Evaluación de la plataforma

### 5.2 Reglas del Modo Demo

**La biometría:**
* Se presenta como funcional
* Puede omitirse mediante un botón de escape visible
* El botón muestra: "Omitir Verificación (Modo Demo / Incógnito)"

**El bypass:**
* Solo aplica a la sesión actual (sessionStorage)
* No afecta pagos reales
* Se elimina al cerrar el navegador

### 5.3 Identificación

El modo demo está claramente identificado en la interfaz:
* Título del modal: "🎯 Verificación Biométrica (Demo)"
* Mensaje explicativo sobre el modo demo
* Botón de escape siempre visible

---

## 6. Botón de Escape y Anti-Bloqueo

Para prevenir incidentes de UX:

* Todo modal biométrico incluye:
  * Opción de salida controlada
  * Botón X en la esquina superior derecha
  * Botón "Hacerlo más tarde"
  * Botón de escape en la parte inferior (cuando aplica)

**El sistema:**
* Recuerda la omisión solo en sesión (sessionStorage)
* Dispara evento `biometric-skip-changed` para reactividad
* En rutas críticas de pago: El escape es ignorado

---

## 7. Exclusiones y Excepciones

| Contexto              | ¿Se permite omitir biometría? | Notas                                    |
| --------------------- | ----------------------------- | ---------------------------------------- |
| Home / Login          | ✅ Sí                         | Solo en modo demo o rutas no críticas    |
| Registro              | ✅ Sí                         | Solo en modo demo o rutas no críticas    |
| Panel                 | ✅ Sí                         | Solo en modo demo o rutas no críticas    |
| Demo                  | ✅ Sí                         | Botón de escape siempre visible          |
| Pagos / Suscripciones | ❌ No                          | Obligatorio en producción, no puede omitirse |
| Transferencias       | ❌ No                          | Obligatorio en producción, no puede omitirse |

---

## 8. Auditoría y Cumplimiento

### 8.1 Estándares Aplicados

* ✅ **OWASP Top 10** - Mitigación de vulnerabilidades comunes
* ✅ **FIDO2/WebAuthn** - Estándar W3C
* ✅ **PCI DSS** - Para pagos (si aplica)
* ✅ **ISO 27001** - Gestión de seguridad de la información

### 8.2 Preparación para Auditoría

* Compatible con prácticas fintech
* Preparado para auditoría externa
* No simula biometría (usa WebAuthn real)
* No almacena datos sensibles indebidos
* Documentación completa de controles de seguridad

### 8.3 Threat Model

* Replay attacks: Mitigado (challenges únicos, signCount)
* MITM: Mitigado (HTTPS, origin validation, rpId validation)
* Context bypass: Mitigado (context binding obligatorio)
* Session fixation: Mitigado (session regeneration)
* Phishing: Parcialmente mitigado (origin validation, mostrar dominio)
* Device compromise: Parcialmente mitigado (revocación, notificaciones)

---

## 9. Revisión de la Política

Esta política:

* Se revisa periódicamente
* Se endurece al pasar a producción total
* Puede desactivar completamente el modo demo
* Se notifica a usuarios con al menos 30 días de anticipación

### 9.1 Transición a Producción

Cuando Legal PY transite a Producción Total:

1. **Notificación:** Al menos 30 días antes
2. **Aceptación:** Los usuarios deben aceptar nuevas políticas
3. **Endurecimiento:** Políticas de seguridad se endurecen automáticamente
4. **Desactivación:** El modo demo puede desactivarse completamente
5. **Obligatoriedad:** La biometría será obligatoria en todas las rutas críticas

---

## 10. Contacto

Para preguntas sobre esta Política de Seguridad:

- **Email:** seguridad@legalpy.com
- **Documentación:** `/docs/WEBAUTHN_THREAT_MODEL.md`
- **Auditoría:** `/docs/AUDITORIA_MANUAL_BIOMETRICO.md`

---

**Fin de la Política de Seguridad**
