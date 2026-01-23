# 🚀 Guía de Implementación: Rediseño de Flujo de Autenticación

**Autor:** Arquitecto Senior UX/UI + Seguridad  
**Fecha:** 2025-01-27  
**Objetivo:** Implementar paso a paso el nuevo flujo

---

## 📋 ORDEN DE IMPLEMENTACIÓN

### Fase 1: Home Público (Prioridad Alta)

#### 1.1 Modificar `app/page.tsx`

**Estado actual:** Probablemente requiere autenticación  
**Estado objetivo:** Home público sin autenticación

**Cambios:**
```typescript
// app/page.tsx
export default function Home() {
  // NO verificar sesión aquí
  // NO redirigir a login
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />
      
      {/* Servicios */}
      <ServicesSection />
      
      {/* CTAs */}
      <CTASection />
    </div>
  );
}
```

---

### Fase 2: Registro por Pasos (Prioridad Alta)

#### 2.1 Crear estructura de rutas

```
app/signup/
├── page.tsx              # Paso 1: Tipo de usuario
├── plan/
│   └── page.tsx          # Paso 2: Selección de plan
├── details/
│   └── page.tsx          # Paso 3: Datos básicos
├── payment/
│   └── page.tsx          # Paso 4: Pago
└── success/
    └── page.tsx          # Paso 5: Éxito
```

#### 2.2 Implementar cada paso

**Paso 1: Tipo de Usuario**
```typescript
// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function SignupStep1() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  
  const userTypes = [
    { id: 'professional', label: 'Profesional', icon: '👨‍💼' },
    { id: 'client', label: 'Cliente', icon: '👤' },
    { id: 'student', label: 'Estudiante', icon: '🎓' },
    { id: 'company', label: 'Empresa (GEP / Premium)', icon: '🏢' },
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">
          ¿Qué tipo de cuenta necesitás?
        </h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {userTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setUserType(type.id)}
              className={`p-6 rounded-xl border-2 transition-all ${
                userType === type.id
                  ? 'border-[#C9A24D] bg-[#C9A24D]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <div className="text-white font-semibold">{type.label}</div>
            </button>
          ))}
        </div>
        
        <Button
          variant="primary"
          className="w-full"
          disabled={!userType}
          onClick={() => router.push(`/signup/plan?type=${userType}`)}
        >
          Continuar
        </Button>
      </Card>
    </div>
  );
}
```

**Paso 2: Selección de Plan**
```typescript
// app/signup/plan/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function SignupStep2() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const plans = [
    { id: 'basic', name: 'Básico', price: 100000, features: ['Feature 1', 'Feature 2'] },
    { id: 'pro', name: 'Pro', price: 300000, features: ['Feature 1', 'Feature 2', 'Feature 3'] },
    { id: 'premium', name: 'Premium', price: 500000, features: ['All features'] },
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">
          Elige tu plan
        </h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onClick={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>
        
        <Button
          variant="primary"
          className="w-full"
          disabled={!selectedPlan}
          onClick={() => router.push(`/signup/details?type=${userType}&plan=${selectedPlan}`)}
        >
          Continuar
        </Button>
      </Card>
    </div>
  );
}
```

**Paso 3: Datos Básicos**
```typescript
// app/signup/details/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormField from "@/components/FormField";

export default function SignupStep3() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type');
  const plan = searchParams.get('plan');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar datos en sessionStorage o estado global
    router.push(`/signup/payment?type=${userType}&plan=${plan}`);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">
          Completa tu información
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nombre completo" required>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              required
            />
          </FormField>
          
          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              required
            />
          </FormField>
          
          <FormField label="Teléfono" required>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              required
            />
          </FormField>
          
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-200/90">
              ⚠️ La verificación biométrica se solicitará cuando sea necesario (pagos, acciones sensibles).
            </p>
          </div>
          
          <Button type="submit" variant="primary" className="w-full">
            Continuar
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

**Paso 4: Pago**
```typescript
// app/signup/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PaymentAuthorizationModal from "@/components/Payments/PaymentAuthorizationModal";
import { checkDemoMode } from "@/lib/demo-utils";

export default function SignupStep4() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get('type');
  const plan = searchParams.get('plan');
  const isDemoMode = checkDemoMode();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const handlePayment = () => {
    // En demo: simular pago
    if (isDemoMode) {
      // Simular pago exitoso
      setTimeout(() => {
        router.push('/signup/success');
      }, 1000);
    } else {
      // Mostrar modal de pago real
      setShowPaymentModal(true);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">
          Método de pago
        </h1>
        
        {isDemoMode && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-200/90">
              🎯 Modo Demo: Usa tarjetas de prueba del gateway
            </p>
          </div>
        )}
        
        <PaymentForm 
          onSuccess={() => router.push('/signup/success')}
          demoMode={isDemoMode}
        />
        
        {showPaymentModal && (
          <PaymentAuthorizationModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onAuthorize={() => {
              setShowPaymentModal(false);
              router.push('/signup/success');
            }}
            amount={getPlanPrice(plan)}
            currency="PYG"
            description={`Suscripción ${plan}`}
          />
        )}
      </Card>
    </div>
  );
}
```

---

### Fase 3: Modificar BiometricGate (Prioridad Crítica)

#### 3.1 Actualizar `components/Security/BiometricGate.tsx`

**Estado actual:** Probablemente bloquea navegación  
**Estado objetivo:** NO bloquea, solo se activa en acciones

```typescript
// components/Security/BiometricGate.tsx
"use client";

/**
 * BiometricGate - Action-Based Security (NO bloqueo por navegación)
 *
 * La biometría NO se usa para explorar la plataforma.
 * La biometría se usa exclusivamente para AUTORIZAR ACCIONES SENSIBLES.
 *
 * Este gate global NUNCA muestra modal ni bloquea navegación.
 * Las puertas biométricas se activan solo en ACCIONES:
 * - Suscribirse a plan, realizar pago → PayBiometric en PaymentAuthorizationModal
 * - Crear/enviar caso, subir documento, firmar → gates en cada flujo
 *
 * @author Legal PY Security Team
 * @version 5.0.0 - Action-Based (No Blocking)
 */

export default function BiometricGate() {
  // Este componente NO renderiza nada
  // La biometría se activa solo en acciones específicas
  return null;
}
```

---

### Fase 4: Actualizar Middleware (Prioridad Alta)

#### 4.1 Modificar `middleware.ts`

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rutas públicas (sin autenticación)
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/signup/plan',
    '/signup/details',
    '/signup/payment',
    '/signup/success',
    '/pricing',
    '/profesionales',
    '/servicios',
  ];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Rutas protegidas requieren autenticación
  // (Implementar verificación de sesión aquí)
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### 🔴 CRÍTICO (Hacer primero)

1. **Modificar `BiometricGate.tsx`** - NO debe bloquear navegación
2. **Crear home público** - Sin autenticación requerida
3. **Modificar middleware** - Permitir rutas públicas

### 🟡 ALTA (Hacer segundo)

4. **Crear registro paso 1** - Tipo de usuario
5. **Crear registro paso 2** - Selección de plan
6. **Crear registro paso 3** - Datos básicos
7. **Crear registro paso 4** - Pago
8. **Crear registro paso 5** - Éxito

### 🟢 MEDIA (Hacer tercero)

9. **Actualizar login** - Asegurar que NO pide biometría
10. **Integrar biometría contextual** - Solo en acciones sensibles
11. **Configurar modo demo** - Feature flags y master key

---

## 📝 NOTAS IMPORTANTES

1. **NO remover componentes existentes** - Solo modificar comportamiento
2. **Mantener compatibilidad** - Con código existente
3. **Testing incremental** - Probar cada fase antes de continuar
4. **Documentar cambios** - Actualizar docs relacionados

---

**Firmado por:** Arquitecto Senior UX/UI + Seguridad  
**Fecha:** 2025-01-27  
**Versión:** 1.0.0
