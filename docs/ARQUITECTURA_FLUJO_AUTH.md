# 🏗️ ARQUITECTURA DE FLUJO DE AUTENTICACIÓN Y ONBOARDING - LEGAL PY

**Versión:** 2.0.0  
**Fecha:** 2026-01-21  
**Estado:** Rediseño Completo - UX Premium SaaS

---

## 📋 RESUMEN EJECUTIVO

Rediseño completo del flujo de autenticación para eliminar bloqueos iniciales y crear una experiencia fluida tipo Binance/Instagram/ChatGPT.

### Principios de Diseño
- ✅ **Cero fricción inicial**: Sin biometría al entrar
- ✅ **Home pública limpia**: Landing page atractiva sin login obligatorio
- ✅ **Biometría contextual**: Solo cuando es necesario (pagos, acciones críticas)
- ✅ **Modo demo funcional**: Acceso completo sin restricciones para testing
- ✅ **Onboarding guiado**: Registro en pasos claros y progresivos

---

## 🗺️ DIAGRAMA DE NAVEGACIÓN

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                          │
│  - Logo + Valor Propuesto                                    │
│  - 4 Servicios Principales                                  │
│  - CTA: Iniciar Sesión / Registrarse                        │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│   LOGIN (/login) │              │ REGISTRO (/signup)│
│  - Email/Pass    │              │  Paso 1: Tipo    │
│  - OAuth opcional │              │  Paso 2: Plan    │
│  - NO biometría  │              │  Paso 3: Datos   │
└──────────────────┘              │  Paso 4: Pago    │
        │                         │  Paso 5: Acceso  │
        │                         └──────────────────┘
        │                                   │
        └─────────────────┬─────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   DASHBOARD (/panel)  │
              │  - Sin bloqueos      │
              │  - Acceso inmediato  │
              └───────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ POST CASE    │  │ PAYMENT      │  │ UPDATE PROFILE│
│ (Sin biometría)│  │ (Con biometría)│  │ (Con biometría)│
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🎯 ESTADOS DE UI Y FLUJOS

### 1. LANDING PAGE (Home Pública)

**Ruta:** `/`  
**Estado:** Público (sin autenticación requerida)

**Componentes:**
- Hero Section con valor propuesto
- 4 Servicios principales (cards con precio)
- CTAs: "Iniciar Sesión" / "Registrarse"
- Footer con enlaces legales

**Comportamiento:**
- Si usuario ya logueado → Redirigir a `/panel`
- Si usuario no logueado → Mostrar landing completa
- **NO mostrar BiometricGate aquí**

---

### 2. REGISTRO (Multi-Step)

**Ruta:** `/signup`  
**Estado:** Público (sin autenticación)

**Paso 1: Selección de Tipo de Usuario**
- Cards: Profesional, Cliente, Estudiante, Empresa (GEP)
- Selección visual con iconos

**Paso 2: Selección de Plan**
- Cards tipo pricing (Básico, Profesional, Empresarial, GEP)
- Comparación de features
- Modo demo: Mostrar "Plan Demo" gratis

**Paso 3: Datos Básicos**
- Email, contraseña, nombre, apellido
- **NO pedir cédula ni biometría aquí**

**Paso 4: Pago**
- Gateway de pagos (Stripe/PayPal)
- Modo demo: Tarjetas de prueba
- **Aquí SÍ activar biometría** (si no está en modo demo)

**Paso 5: Acceso**
- Redirigir a `/panel`
- Mostrar onboarding tour (opcional)

---

### 3. LOGIN

**Ruta:** `/login`  
**Estado:** Público

**Campos:**
- Email
- Contraseña
- OAuth opcional (Google, Facebook)

**Comportamiento:**
- **NO pedir cédula ni biometría**
- Si login exitoso → Redirigir a `/panel`
- Si usuario demo → Acceso inmediato sin restricciones

---

### 4. BIOMETRÍA CONTEXTUAL

**Activación:** Solo en acciones críticas

**Triggers:**
1. **Pago/Transferencia** (`/pagos`, `/subscribe`)
2. **Actualizar datos personales** (`/profile/edit`)
3. **Acciones legales sensibles** (`/accept-case`, `/transfer`)
4. **Cambio de plan** (upgrade/downgrade)

**Flujo Biométrico:**
1. Foto cédula (frente)
2. Foto cédula (dorso)
3. Selfie con liveness
4. Barra de progreso visual
5. Confirmación y acceso

**Excepciones:**
- Modo demo: Bypass completo
- Usuario demo@legalpy.com: Siempre verificado
- Acciones no críticas: Sin biometría

---

## 🔐 SISTEMA DE MODO DEMO

### Feature Flags

```typescript
interface FeatureFlags {
  demoMode: boolean;
  biometricRequired: boolean;
  realPayments: boolean;
  masterKeyEnabled: boolean;
}
```

### Master Key (Demo)

**Email:** `demo@legalpy.com`  
**Password:** `inversor2026`  
**Características:**
- ✅ Acceso sin biometría
- ✅ Todos los planes desbloqueados
- ✅ Sin pagos reales
- ✅ 5 casos demo precargados
- ✅ Acceso a todas las funcionalidades

### Configuración por Entorno

**Desarrollo (Demo):**
```env
DEMO_MODE=true
BIOMETRIC_REQUIRED=false
REAL_PAYMENTS=false
MASTER_KEY_ENABLED=true
```

**Producción:**
```env
DEMO_MODE=false
BIOMETRIC_REQUIRED=true
REAL_PAYMENTS=true
MASTER_KEY_ENABLED=false
```

---

## 🎨 REGLAS DE ACTIVACIÓN BIOMÉTRICA

### Matriz de Decisión

| Acción | Ruta | Biometría | Modo Demo |
|--------|------|-----------|-----------|
| Ver landing | `/` | ❌ No | - |
| Login | `/login` | ❌ No | - |
| Registro | `/signup` | ❌ No | - |
| Ver dashboard | `/panel` | ❌ No | - |
| Publicar caso | `/post-case` | ❌ No | - |
| Ver oportunidades | `/opportunities` | ❌ No | - |
| **Pagar suscripción** | `/subscribe` | ✅ **Sí** | ⚠️ Bypass |
| **Aceptar caso** | `/accept-case` | ✅ **Sí** | ⚠️ Bypass |
| **Transferir fondos** | `/pagos` | ✅ **Sí** | ⚠️ Bypass |
| **Editar perfil** | `/profile/edit` | ✅ **Sí** | ⚠️ Bypass |
| Ver perfil | `/profile` | ❌ No | - |

---

## 🛠️ RECOMENDACIONES TÉCNICAS

### Frontend

1. **Estado Global de Demo:**
   - Context API o Zustand para `demoMode`
   - Hook `useDemoMode()` para verificar estado

2. **BiometricGate Inteligente:**
   - Modificar para que NO bloquee en rutas públicas
   - Activar solo en rutas críticas
   - Respetar modo demo

3. **Routing:**
   - Middleware para proteger rutas críticas
   - Redirects inteligentes según estado de verificación

### Backend (Futuro)

1. **Feature Flags:**
   - Sistema centralizado de flags
   - Configuración por entorno
   - API para verificar flags

2. **Biometría:**
   - Servicio de reconocimiento facial (AWS Rekognition / Face API)
   - Almacenamiento seguro de selfies
   - Matching con cédula subida

3. **Pagos:**
   - Integración Stripe/PayPal
   - Webhooks para confirmación
   - Modo sandbox para desarrollo

---

## 📊 MÉTRICAS DE ÉXITO

**UX:**
- ✅ Tiempo de onboarding < 3 minutos
- ✅ Tasa de abandono en registro < 20%
- ✅ Biometría solo cuando es necesario (0 bloqueos innecesarios)

**Seguridad:**
- ✅ 100% de pagos verificados biométricamente
- ✅ 0 accesos no autorizados
- ✅ Cumplimiento legal (Ley 7593/2025)

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Landing y Login (Prioridad Alta)
- [ ] Rediseñar `/` como landing pública
- [ ] Simplificar `/login` (sin biometría)
- [ ] Crear `/signup` multi-step

### Fase 2: Modo Demo (Prioridad Alta)
- [ ] Implementar feature flags
- [ ] Crear sistema de master key
- [ ] Bypass de biometría en demo

### Fase 3: Biometría Contextual (Prioridad Media)
- [ ] Modificar BiometricGate
- [ ] Activar solo en rutas críticas
- [ ] Flujo guiado mejorado

### Fase 4: Registro Completo (Prioridad Media)
- [ ] Paso de selección de plan
- [ ] Integración de pagos (demo)
- [ ] Onboarding post-registro

---

**Documento generado:** 21 de Enero, 2026  
**Última actualización:** Arquitectura de Flujo v2.0
