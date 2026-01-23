# 🎯 Rediseño Completo: Flujo de Autenticación y Verificación Biométrica

**Autor:** Arquitecto Senior UX/UI + Seguridad + Producto SaaS LegalTech  
**Fecha:** 2025-01-27  
**Plataforma:** Legal PY  
**Objetivo:** UX fluida sin bloqueos, biometría contextual, experiencia premium

---

## 📋 RESUMEN EJECUTIVO

### Problema Actual
- Verificación biométrica bloquea al inicio
- UX interrumpida antes de acceder a la plataforma
- No hay home público limpio
- Flujo de registro no guiado

### Solución Propuesta
- **Home público** sin autenticación
- **Registro guiado** por pasos (tipo → plan → datos → pago → acceso)
- **Login simple** (email/password, OAuth opcional)
- **Biometría contextual** solo en acciones sensibles
- **Modo demo** completamente funcional

---

## 🏗️ ARQUITECTURA DE FLUJO

### 1. Home Público (Landing)

```
┌─────────────────────────────────────┐
│         LEGAL PY (Logo)             │
│                                     │
│  "Tu plataforma legal integral"    │
│                                     │
│  [Iniciar Sesión]  [Registrarse]   │
│                                     │
│  ┌─────────┐  ┌─────────┐           │
│  │Servicio1│  │Servicio2│           │
│  │Gs. X    │  │Gs. Y    │           │
│  └─────────┘  └─────────┘           │
│  ┌─────────┐  ┌─────────┐           │
│  │Servicio3│  │Servicio4│           │
│  │Gs. Z    │  │Gs. W    │           │
│  └─────────┘  └─────────┘           │
└─────────────────────────────────────┘
```

**Características:**
- Sin autenticación requerida
- Acceso inmediato a información
- CTAs claros (Login / Registro)
- 4 servicios principales con precios visibles
- Estilo minimalista (Binance / Instagram)

---

### 2. Flujo de Registro (5 Pasos)

```
PASO 1: Tipo de Usuario
┌─────────────────────────────────────┐
│  ¿Qué tipo de cuenta necesitás?    │
│                                     │
│  [ ] Profesional                    │
│  [ ] Cliente                        │
│  [ ] Estudiante                     │
│  [ ] Empresa (GEP / Premium)        │
│                                     │
│              [Continuar →]         │
└─────────────────────────────────────┘

PASO 2: Selección de Plan
┌─────────────────────────────────────┐
│  Elige tu plan                      │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ Básico│  │Pro   │  │Premium│    │
│  │Gs. X │  │Gs. Y │  │Gs. Z │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│              [Continuar →]         │
└─────────────────────────────────────┘

PASO 3: Datos Básicos
┌─────────────────────────────────────┐
│  Completa tu información            │
│                                     │
│  Nombre: [___________]            │
│  Email:  [___________]             │
│  Teléfono: [___________]            │
│                                     │
│  ⚠️ Biometría NO requerida aquí    │
│                                     │
│              [Continuar →]         │
└─────────────────────────────────────┘

PASO 4: Pago
┌─────────────────────────────────────┐
│  Método de pago                     │
│                                     │
│  [ ] Tarjeta de crédito             │
│  [ ] Transferencia bancaria         │
│                                     │
│  Modo Demo: Usar tarjetas de prueba │
│                                     │
│  [Pagar]                            │
└─────────────────────────────────────┘

PASO 5: Acceso a Plataforma
┌─────────────────────────────────────┐
│  ✅ ¡Bienvenido a Legal PY!         │
│                                     │
│  Redirigiendo a tu panel...        │
│                                     │
│  [Ir al Panel]                     │
└─────────────────────────────────────┘
```

**Reglas:**
- **NO** pedir biometría en registro
- **NO** pedir cédula en registro
- Pago con gateway real (demo: tarjetas de prueba)
- Acceso inmediato después del pago

---

### 3. Flujo de Login

```
┌─────────────────────────────────────┐
│         LEGAL PY (Logo)             │
│                                     │
│  Email: [________________]          │
│  Contraseña: [____________]        │
│                                     │
│  [ ] Recordarme                     │
│                                     │
│  [Iniciar Sesión]                   │
│                                     │
│  ────────── O ──────────           │
│                                     │
│  [Google] [Facebook] [Apple]       │
│                                     │
│  ¿No tenés cuenta? [Registrarse]   │
└─────────────────────────────────────┘
```

**Reglas:**
- **NO** pedir cédula
- **NO** pedir biometría
- OAuth opcional (Google, Facebook, Apple)
- Redirección directa al panel después de login

---

### 4. Activación Biométrica (Contextual)

La biometría se activa **SOLO** cuando:

#### A. Pago / Suscripción
```
Usuario intenta pagar → Modal de pago → Biometría requerida
```

#### B. Transferencia
```
Usuario intenta transferir → Modal de transferencia → Biometría requerida
```

#### C. Actualización de Datos Personales
```
Usuario edita datos sensibles → Confirmación → Biometría requerida
```

#### D. Acciones Legales Sensibles
```
Usuario crea caso legal → Confirmación → Biometría requerida
Usuario sube documento oficial → Confirmación → Biometría requerida
```

**Flujo Biométrico (3 Pasos):**
```
┌─────────────────────────────────────┐
│  Verificación de Identidad          │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Paso 1/3: Foto Cédula (Frente)    │
│                                     │
│  [Subir Foto]                       │
│                                     │
│  [Cancelar]                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Verificación de Identidad          │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Paso 2/3: Foto Cédula (Dorso)     │
│                                     │
│  [Subir Foto]                       │
│                                     │
│  [Cancelar]                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Verificación de Identidad          │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Paso 3/3: Selfie con Liveness      │
│                                     │
│  [📷] Cámara activa                │
│                                     │
│  [Escanear Rostro]                  │
│                                     │
│  [Cancelar]                         │
└─────────────────────────────────────┘
```

---

## 🎨 ESTADOS DE UI

### Estado 1: Visitante (No Autenticado)
- **Acceso:** Home público, servicios, precios
- **Restricciones:** No puede crear casos, no puede pagar
- **CTAs:** Login / Registro

### Estado 2: Registrado (Sin Plan)
- **Acceso:** Panel básico, ver casos, explorar
- **Restricciones:** No puede crear casos, no puede pagar
- **CTAs:** Suscribirse a plan

### Estado 3: Con Plan (Sin Verificación Biométrica)
- **Acceso:** Panel completo, crear casos, explorar
- **Restricciones:** No puede pagar, no puede transferir
- **Biometría:** Se solicita al intentar pagar/transferir

### Estado 4: Verificado Biométricamente
- **Acceso:** Panel completo + pagos + transferencias
- **Sin restricciones:** Acceso total
- **Biometría:** Ya completada, no se vuelve a pedir (excepto acciones críticas)

---

## 🗺️ PSEUDODIAGRAMA DE NAVEGACIÓN

```
                    ┌─────────────┐
                    │  HOME (/)   │
                    │  (Público)  │
                    └──────┬──────┘
                           │
            ┌───────────────┴───────────────┐
            │                               │
    ┌───────▼───────┐             ┌────────▼────────┐
    │   LOGIN       │             │   REGISTRO       │
    │  /login       │             │   /signup       │
    └───────┬───────┘             └────────┬────────┘
            │                               │
            │                               │
            │                    ┌──────────▼──────────┐
            │                    │  REGISTRO PASO 1   │
            │                    │  Tipo de Usuario   │
            │                    └──────────┬──────────┘
            │                               │
            │                    ┌──────────▼──────────┐
            │                    │  REGISTRO PASO 2   │
            │                    │  Selección Plan    │
            │                    └──────────┬──────────┘
            │                               │
            │                    ┌──────────▼──────────┐
            │                    │  REGISTRO PASO 3   │
            │                    │  Datos Básicos    │
            │                    └──────────┬──────────┘
            │                               │
            │                    ┌──────────▼──────────┐
            │                    │  REGISTRO PASO 4   │
            │                    │  Pago              │
            │                    └──────────┬──────────┘
            │                               │
            │                    ┌──────────▼──────────┐
            │                    │  REGISTRO PASO 5   │
            │                    │  Acceso            │
            │                    └──────────┬──────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                    ┌───────▼───────┐
                    │   PANEL       │
                    │   /panel      │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐  ┌────────▼────────┐  ┌──────▼──────┐
│  CREAR CASO   │  │  SUSCRIBIRSE   │  │  TRANSFERIR │
│  /post-case   │  │  /pricing      │  │  /transfer  │
└───────┬───────┘  └────────┬────────┘  └──────┬──────┘
        │                   │                  │
        │                   │                  │
        │         ┌──────────▼──────────┐      │
        │         │  MODAL BIOMÉTRICO   │      │
        │         │  (Solo si necesario)│      │
        │         └─────────────────────┘      │
        │                                       │
        └───────────────────────────────────────┘
```

---

## 🔐 REGLAS DE ACTIVACIÓN BIOMÉTRICA

### ✅ CUANDO SÍ se activa

1. **Pago de Suscripción**
   - Ruta: `/pricing` → Seleccionar plan → Pagar
   - Trigger: Click en "Pagar"
   - Modal: `PaymentAuthorizationModal` con `PayBiometric`

2. **Transferencia de Fondos**
   - Ruta: `/transfer` → Ingresar monto → Transferir
   - Trigger: Click en "Transferir"
   - Modal: `PaymentAuthorizationModal` con `PayBiometric`

3. **Actualización de Datos Personales**
   - Ruta: `/profile` → Editar datos sensibles → Guardar
   - Trigger: Click en "Guardar cambios"
   - Modal: `BiometricVerificationModal`

4. **Creación de Caso Legal**
   - Ruta: `/post-case` → Completar formulario → Crear caso
   - Trigger: Click en "Crear caso"
   - Modal: `BiometricVerificationModal`

5. **Subida de Documento Oficial**
   - Ruta: Cualquier flujo que requiera documento oficial
   - Trigger: Subir documento
   - Modal: `BiometricVerificationModal`

### ❌ CUANDO NO se activa

1. **Home público** - Nunca
2. **Login** - Nunca
3. **Registro** - Nunca (hasta paso 4: pago)
4. **Navegación general** - Nunca
5. **Ver casos** - Nunca
6. **Explorar servicios** - Nunca
7. **Ver perfil** - Nunca (solo al editar)

---

## 🎯 MODO DEMO / TESTER

### Configuración

```typescript
// lib/feature-flags.ts
export const featureFlags = {
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  testerRole: process.env.NEXT_PUBLIC_TESTER_ROLE === "true",
  masterKey: process.env.NEXT_PUBLIC_MASTER_KEY || "demo@legalpy.com",
  
  // En demo:
  biometricRequired: false,
  realPayments: false,
  bypassKYC: true,
};
```

### Comportamiento en Demo

1. **Registro:**
   - Paso 4 (Pago): Usar tarjetas de prueba del gateway
   - No requiere biometría real
   - Acceso inmediato

2. **Login:**
   - Credenciales demo visibles
   - No requiere biometría
   - Acceso inmediato

3. **Biometría:**
   - Se muestra pero NO bloquea
   - Botón "Omitir verificación (Modo Demo)" siempre visible
   - Mensaje explicativo claro

4. **Pagos:**
   - Simulados (no reales)
   - Tarjetas de prueba aceptadas
   - No requiere biometría real

### Master Key

```typescript
// lib/auth.ts
export function isMasterKey(email: string): boolean {
  if (!featureFlags.demoMode) return false;
  return email === featureFlags.masterKey;
}

// Uso:
if (isMasterKey(session.user.email)) {
  // Bypass completo en demo
  return { success: true, session };
}
```

---

## 🛠️ RECOMENDACIONES TÉCNICAS

### Frontend (Next.js 16 + React 19)

#### 1. Estructura de Rutas

```
app/
├── page.tsx                    # Home público
├── login/
│   └── page.tsx               # Login simple
├── signup/
│   ├── page.tsx               # Registro paso 1 (tipo)
│   ├── plan/
│   │   └── page.tsx           # Registro paso 2 (plan)
│   ├── details/
│   │   └── page.tsx           # Registro paso 3 (datos)
│   ├── payment/
│   │   └── page.tsx           # Registro paso 4 (pago)
│   └── success/
│       └── page.tsx           # Registro paso 5 (éxito)
├── panel/
│   └── page.tsx               # Dashboard principal
└── ...
```

#### 2. Componentes de Biometría

```typescript
// components/Security/BiometricGate.tsx
// Gate contextual (NO bloquea navegación)

export default function BiometricGate() {
  // Este componente NO renderiza nada
  // La biometría se activa solo en acciones específicas
  return null;
}

// components/Security/BiometricVerificationModal.tsx
// Modal de verificación (3 pasos: cédula frente, dorso, selfie)

// components/Security/PayBiometric.tsx
// Autorización biométrica para pagos (WebAuthn)

// components/Security/LoginBiometric.tsx
// Login biométrico opcional (passwordless)
```

#### 3. Hooks de Estado

```typescript
// hooks/useUserState.ts
export function useUserState() {
  // Estado 0: Visitante
  // Estado 1: Registrado sin plan
  // Estado 2: Con plan sin verificación
  // Estado 3: Verificado biométricamente
}

// hooks/useBiometricCheck.ts
export function useBiometricCheck(forceVerification: boolean = false) {
  // Verifica si requiere biometría antes de acción
  // En demo: ejecuta acción directamente
}
```

#### 4. Guards de Ruta

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rutas públicas (sin autenticación)
  const publicRoutes = ['/', '/login', '/signup', '/pricing'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Rutas protegidas
  const session = getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Rutas que requieren plan
  const planRequiredRoutes = ['/post-case', '/panel'];
  if (planRequiredRoutes.includes(pathname) && !session.user.hasPlan) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }
  
  return NextResponse.next();
}
```

---

### Backend (Recomendado: Express / Fastify)

#### 1. Endpoints de Autenticación

```typescript
// POST /api/auth/register
// Paso 1: Crear usuario (sin plan)
// Paso 2: Asignar plan
// Paso 3: Actualizar datos
// Paso 4: Procesar pago
// Paso 5: Activar cuenta

// POST /api/auth/login
// Autenticación simple (email/password)
// NO requiere biometría

// POST /api/auth/oauth
// OAuth (Google, Facebook, Apple)
// NO requiere biometría
```

#### 2. Endpoints de Biometría

```typescript
// POST /api/biometric/verify
// Verificación biométrica (liveness + cédula)
// Solo cuando es necesario

// POST /api/webauthn/payment/options
// Challenge para autorización de pago
// Solo en pagos/transferencias

// POST /api/webauthn/payment/verify
// Verificación de autorización de pago
// Context binding obligatorio
```

#### 3. Feature Flags (Backend)

```typescript
// lib/feature-flags.ts (Backend)
export const featureFlags = {
  demoMode: process.env.DEMO_MODE === "true",
  biometricRequired: process.env.BIOMETRIC_REQUIRED !== "false",
  realPayments: process.env.REAL_PAYMENTS === "true",
};

// Middleware de feature flags
export function checkFeatureFlag(flag: string) {
  return featureFlags[flag] || false;
}
```

---

## 📱 COMPONENTES UI ESPECÍFICOS

### 1. Home Público (`app/page.tsx`)

```typescript
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section>
        <Logo />
        <h1>Tu plataforma legal integral</h1>
        <Button href="/login">Iniciar Sesión</Button>
        <Button href="/signup">Registrarse</Button>
      </section>
      
      {/* Servicios Principales */}
      <section>
        <ServiceCard 
          name="Consultoría Legal"
          description="Asesoría personalizada"
          price="Gs. 500.000"
        />
        {/* ... 3 más */}
      </section>
    </div>
  );
}
```

### 2. Registro Paso 1 (`app/signup/page.tsx`)

```typescript
export default function SignupStep1() {
  const [userType, setUserType] = useState<'professional' | 'client' | 'student' | 'company' | null>(null);
  
  return (
    <div>
      <h1>¿Qué tipo de cuenta necesitás?</h1>
      <RadioGroup value={userType} onChange={setUserType}>
        <Radio value="professional">Profesional</Radio>
        <Radio value="client">Cliente</Radio>
        <Radio value="student">Estudiante</Radio>
        <Radio value="company">Empresa (GEP / Premium)</Radio>
      </RadioGroup>
      <Button 
        disabled={!userType}
        onClick={() => router.push(`/signup/plan?type=${userType}`)}
      >
        Continuar
      </Button>
    </div>
  );
}
```

### 3. Registro Paso 2 (`app/signup/plan/page.tsx`)

```typescript
export default function SignupStep2() {
  const plans = [
    { id: 'basic', name: 'Básico', price: 'Gs. 100.000/mes' },
    { id: 'pro', name: 'Pro', price: 'Gs. 300.000/mes' },
    { id: 'premium', name: 'Premium', price: 'Gs. 500.000/mes' },
  ];
  
  return (
    <div>
      <h1>Elige tu plan</h1>
      <div className="grid grid-cols-3 gap-4">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <Button onClick={() => router.push('/signup/details')}>
        Continuar
      </Button>
    </div>
  );
}
```

### 4. Registro Paso 3 (`app/signup/details/page.tsx`)

```typescript
export default function SignupStep3() {
  // Formulario simple: nombre, email, teléfono
  // NO biometría, NO cédula
  return (
    <form>
      <Input label="Nombre" />
      <Input label="Email" type="email" />
      <Input label="Teléfono" />
      <Button onClick={() => router.push('/signup/payment')}>
        Continuar
      </Button>
    </form>
  );
}
```

### 5. Registro Paso 4 (`app/signup/payment/page.tsx`)

```typescript
export default function SignupStep4() {
  const isDemoMode = checkDemoMode();
  
  return (
    <div>
      <h1>Método de pago</h1>
      {isDemoMode && (
        <Alert>
          Modo Demo: Usa tarjetas de prueba del gateway
        </Alert>
      )}
      <PaymentForm 
        onSuccess={() => router.push('/signup/success')}
        demoMode={isDemoMode}
      />
    </div>
  );
}
```

---

## 🔄 FLUJO DE ESTADOS (State Machine)

```typescript
type UserState = 
  | 'visitor'           // No autenticado
  | 'registered'        // Autenticado sin plan
  | 'with_plan'         // Con plan, sin verificación biométrica
  | 'verified';         // Verificado biométricamente

type AuthFlow = 
  | 'home'              // Home público
  | 'login'             // Login
  | 'signup_type'       // Registro paso 1
  | 'signup_plan'       // Registro paso 2
  | 'signup_details'    // Registro paso 3
  | 'signup_payment'    // Registro paso 4
  | 'signup_success'    // Registro paso 5
  | 'panel';            // Dashboard

// Transiciones permitidas:
const transitions: Record<UserState, AuthFlow[]> = {
  visitor: ['home', 'login', 'signup_type'],
  registered: ['panel', 'pricing'],
  with_plan: ['panel', 'post-case', 'pricing'],
  verified: ['panel', 'post-case', 'pricing', 'transfer', 'pay'],
};
```

---

## 🎨 ESTILO VISUAL (Referencias)

### Inspiración: Binance Login
- Fondo oscuro (#0E1B2A)
- Botones dorados (#C9A24D)
- Minimalismo
- Tipografía clara

### Inspiración: ChatGPT Pricing
- Cards de planes destacadas
- Comparación clara
- CTAs prominentes

### Inspiración: Instagram
- Simplicidad
- Enfoque en contenido
- Navegación intuitiva

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Home y Autenticación Básica
- [ ] Crear home público (`app/page.tsx`)
- [ ] Crear login simple (`app/login/page.tsx`)
- [ ] Crear registro paso 1 (`app/signup/page.tsx`)
- [ ] Crear registro paso 2 (`app/signup/plan/page.tsx`)
- [ ] Crear registro paso 3 (`app/signup/details/page.tsx`)
- [ ] Crear registro paso 4 (`app/signup/payment/page.tsx`)
- [ ] Crear registro paso 5 (`app/signup/success/page.tsx`)

### Fase 2: Biometría Contextual
- [ ] Modificar `BiometricGate` para NO bloquear navegación
- [ ] Integrar `BiometricVerificationModal` solo en acciones sensibles
- [ ] Integrar `PayBiometric` solo en pagos
- [ ] Actualizar `useBiometricCheck` para respetar contexto

### Fase 3: Modo Demo
- [ ] Configurar feature flags
- [ ] Implementar master key
- [ ] Agregar mensajes explicativos en demo
- [ ] Configurar tarjetas de prueba en gateway

### Fase 4: Testing
- [ ] Probar flujo completo de registro
- [ ] Probar login sin biometría
- [ ] Probar activación biométrica contextual
- [ ] Probar modo demo
- [ ] Probar producción (biometría obligatoria)

---

## 📚 DOCUMENTOS RELACIONADOS

- `docs/DEMO_MODE_RULES.md` - Reglas de modo demo
- `docs/WEBAUTHN_BACKEND_ARCHITECTURE.md` - Arquitectura WebAuthn
- `docs/WEBAUTHN_FRONTEND_ARCHITECTURE.md` - Componentes frontend
- `lib/demo-utils.ts` - Utilidades de modo demo

---

**Firmado por:** Arquitecto Senior UX/UI + Seguridad + Producto SaaS LegalTech  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
