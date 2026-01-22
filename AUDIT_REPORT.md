# Informe de Auditoría Integral – Legal PY

**Fecha:** Enero 2026  
**Alcance:** Código fuente vs. Manual de Uso, Política de Seguridad, Material inversores y demo comercial  
**Equipo:** Auditoría Bancaria/Fintech, LegalTech, QA, Security, Customer Journey  

---

## Resumen Ejecutivo (para inversores y GC)

### Estado general de la plataforma

La plataforma **Legal PY** implementa en código la mayor parte de lo prometido en documentación y manuales: modo demo funcional, credenciales demo aisladas, biometría con botón de escape, separación login/pagos, roles (cliente/profesional/estudiante), IA con disclaimer y flujos por rol. Se identifican **gaps concretos** (middleware vs. localStorage, disclaimer literal, UX en rutas de pago) que deben cerrarse antes de presentaciones a inversores o auditorías externas.

### Riesgos críticos

| # | Riesgo | Severidad | Estado |
|---|--------|-----------|--------|
| 1 | Middleware usa cookies; sesión solo en `localStorage` → protección de rutas por servidor **inefectiva** | **Crítico** | ❌ No cumple |
| 2 | Credenciales demo (`demo@legalpy.com` / `inversor2026`) **no visibles** en UI de login → riesgo en demo en vivo | **Alto** | ✅ **CORREGIDO** |
| 3 | Disclaimer IA ≠ "Esto no constituye asesoramiento legal" (texto actual distinto) | **Medio** | ✅ **CORREGIDO** |

### Nivel de madurez

**Demo / Pre‑Prod:** Apto para demo controlada y pruebas internas. **No Fintech‑Ready** hasta resolver el desacople middleware/sesión y endurecer controles en producción.

---

## Matriz de Cumplimiento

### 1. Verificación de credenciales demo

| Requisito | Estado | Evidencia | Impacto |
|-----------|--------|-----------|---------|
| Detección explícita de `demo@legalpy.com` | ✅ Cumple | `lib/auth.ts` L269-270: `if (data.email === "demo@legalpy.com" && data.password === "inversor2026")` | — |
| Plan demo `GEP` asignado automáticamente | ✅ Cumple | `lib/auth.ts` L302, L332: `planId: "GEP"`, `localStorage.setItem("legal-py-demo-plan", "GEP")` | — |
| `isIdentityVerified: true` para demo | ✅ Cumple | `lib/auth.ts` L286: `isIdentityVerified: true` | — |
| Lógica aislada del entorno productivo | ✅ Cumple | `lib/feature-flags.ts` L49: `isMasterKey` solo si `masterKeyEnabled`; demo flags en `localStorage` | — |
| Credenciales visibles en UI (login / ayuda) | ✅ **CORREGIDO** | `app/login/page.tsx`: Aviso demo agregado (Fix 1) | — |

### 2. Biometría y anti-bloqueo

| Requisito | Estado | Evidencia | Impacto |
|-----------|--------|-----------|---------|
| Botón "Omitir verificación (Modo Demo / Incógnito)" visible | ✅ Cumple | `BiometricVerificationModal.tsx` L781-797: botón condicional `(!effectiveIsMandatory \|\| isDemoMode)`; texto según `isDemoMode` | — |
| Botón guarda flag en `sessionStorage` | ✅ Cumple | `BiometricVerificationModal.tsx` L786-787: `sessionStorage.setItem("biometric_skipped", "true")` + `biometric-skip-changed` | — |
| Botón cierra el modal correctamente | ✅ Cumple | `onClose()` enviado a `BiometricGate.handleClose`; en demo o no‑pago, `setShowModal(false)` | — |
| `BiometricGate` lee el flag | ✅ Cumple | `BiometricGate.tsx` L72-75, L180, L196, L341: `sessionStorage.getItem("biometric_skipped") === "true"` | — |
| Gate evita re-renderizar modal tras skip | ✅ Cumple | `BiometricGate.tsx` L344-351: `demoMode && hasSkipped` o `!demoMode && hasSkipped && !isPayment` → `return null` | — |
| Excepción absoluta en rutas de pago | ✅ Cumple | `BiometricGate.tsx` L52-55, L205-209, L316-318: `PAYMENT_ROUTES`; en pago no se cierra, `setBiometricSkipped(false)` al mostrar | — |
| Master key (`demo@legalpy.com`) no ve modal | ✅ Cumple | `BiometricGate.tsx` L168-171: `isMasterKey(currentSession.user.email)` → `setShowModal(false)`; `feature-flags` L49 | — |

### 3. Integración de IA y transparencia legal

| Requisito | Estado | Evidencia | Impacto |
|-----------|--------|-----------|---------|
| `/api/assistant` existe y está conectado | ✅ Cumple | `app/api/assistant/route.ts`; `SmartAssistant.tsx` L308: `fetch("/api/assistant", …)` | — |
| `/api/voice` existe y conectado | ✅ Cumple | `app/api/voice/route.ts`; `SmartAssistant.tsx` L391: `fetch("/api/voice", …)` | — |
| Disclaimer visible y persistente en IA | ✅ Cumple | `SmartAssistant.tsx` L627-633: bloque fijo con `t("ai_assistant.disclaimer")` o fallback "⚠️ IA de Filtrado - No es consejo legal" | — |
| Texto literal "Esto no constituye asesoramiento legal" | ⚠️ Parcial | `lib/translations.ts` L178: "IMPORTANTE: Soy una IA de filtrado. No brindo asesoría legal…" (redacción distinta) | **Medio** |
| Límites legales en backend | ✅ Cumple | `app/api/assistant/route.ts` L16-18: "NO eres abogado. NO das consejos legales…" | — |

### 4. Roles y experiencia por rol

| Requisito | Estado | Evidencia | Impacto |
|-----------|--------|-----------|---------|
| Dashboard cambia según `user.role` / `viewMode` | ✅ Cumple | `app/panel/page.tsx` L26, L42-45, L332-341, L347-370, L452, L639, L1034, L1174: `viewMode` cliente/profesional/estudiante y contenido condicional | — |
| Cada rol ve solo lo suyo | ✅ Cumple | Tabs, CTAs y secciones filtrados por `viewMode` (ej. oportunidades solo profesional, pasantía solo estudiante) | — |
| Roles claros (Client / Pro / Student) | ✅ Cumple | `RoleModeModal`, `viewMode`, `session?.user.role`; `lib/types` `UserRole` | — |

### 5. Infraestructura y seguridad (extendido)

| Requisito | Estado | Evidencia | Impacto |
|-----------|--------|-----------|---------|
| Protección de rutas por middleware | ❌ No cumple | `middleware.ts` L78: `request.cookies.get("legal-py-session")`; `lib/auth.ts` L30, L54: sesión solo en `localStorage`. **Nunca se setea cookie** → middleware siempre sin sesión | **Crítico** |
| Rutas críticas definidas | ✅ Cumple | `middleware` L40-44; `BiometricGate` L32-37: `/subscribe`, `/accept-case`, `/pagos`, etc. | — |

---

## Hallazgos críticos (priorizados)

### 1. [Crítico] Middleware no ve la sesión: cookies vs. `localStorage`

**Descripción:** El middleware usa `request.cookies.get("legal-py-session")` para decidir si hay sesión. La autenticación guarda la sesión únicamente en `localStorage` (`lib/auth.ts`). No existe lógica que escriba la sesión en una cookie.

**Consecuencias:**
- En servidor, `hasSession` es siempre `false`.
- Redirección a `/login` en rutas protegidas se basa en un criterio que nunca se cumple en la práctica cuando la app se usa normalmente (navegación cliente + `localStorage`).
- La “protección” de rutas vía middleware es **inefectiva** para el modelo actual de sesión.

**Evidencia:**
- `middleware.ts` L76-79, L82-86.
- `lib/auth.ts` L29-31, L53-58.

**Recomendación:** Unificar modelo de sesión: o bien (a) sesión en cookie (httpOnly, secure) y middleware siga usando cookie, o (b) rutas protegidas sin depender del middleware para “auth” y usar solo guards en cliente + APIs que validen token/sesión. Documentar claramente qué protege cada capa.

---

### 2. [Alto] Credenciales demo no visibles en la UI de login

**Descripción:** Los documentos (`FLUJO_AUTH_IMPLEMENTADO`, etc.) indican `demo@legalpy.com` / `inversor2026` para pruebas. La página de login y el formulario no muestran estas credenciales (ni siquiera en modo demo).

**Consecuencias:**
- En una demo en vivo, el presentador puede no recordar usuario/contraseña.
- Mayor riesgo de fallo frente a inversores o auditores.

**Evidencia:**
- `app/login/page.tsx`: sin referencias a credenciales demo.
- `components/Auth/LoginForm.tsx`: idem.

**Recomendación:** Mostrar en UI (solo cuando `NEXT_PUBLIC_DEMO_MODE=true` o `localStorage["legal-py-demo-mode"]`) un pequeño texto tipo: “Demo: demo@legalpy.com / inversor2026”, o enlace “Usar cuenta demo” que rellene y envíe el formulario.

---

### 3. [Medio] Disclaimer IA no usa la frase exacta “Esto no constituye asesoramiento legal”

**Descripción:** Se exige un disclaimer explícito tipo “Esto no constituye asesoramiento legal”. El texto actual es “IMPORTANTE: Soy una IA de filtrado. No brindo asesoría legal. Mi función es derivar tu caso al profesional correcto.”

**Consecuencias:**
- Cumple la idea de descargo, pero no la redacción literal solicitada.
- Posible objeción en auditoría legal o compliance.

**Evidencia:**
- `lib/translations.ts` L176-179 (`ai_assistant.disclaimer`).
- `SmartAssistant.tsx` L630 (uso del disclaimer).

**Recomendación:** Incluir la frase exacta “Esto no constituye asesoramiento legal” en el disclaimer del asistente (p. ej. añadirla al texto existente o sustituir según política legal).

---

### 4. [Menor] UX en rutas de pago: X, “Hacerlo más tarde” y backdrop siempre activos

**Descripción:** En rutas de pago (producción), el modal biométrico no se cierra al hacer clic en X, “Hacerlo más tarde” o backdrop porque `BiometricGate.handleClose` hace `return` sin cerrar. Esos controles siguen visibles y clicables, pero no cierran el modal.

**Consecuencias:**
- Usuario hace clic y “no pasa nada” → percepción de bug o inconsistencia.

**Evidencia:**
- `BiometricVerificationModal.tsx` L385-391 (backdrop), L416-424 (X), L682-696 (“Hacerlo más tarde”). Todos llaman `onClose()` sin condicionar a `effectiveIsMandatory`.
- `BiometricGate.tsx` L316-318: en pago, `handleClose` retorna sin abrir.

**Recomendación:** Cuando `effectiveIsMandatory` sea `true`, ocultar o deshabilitar X, “Hacerlo más tarde” y desactivar el cierre por backdrop, para que no se genere la expectativa de poder cerrar.

---

## Recomendaciones

### Técnicas

1. **Sesión y middleware:** Decidir modelo único (cookie vs. `localStorage` + guards cliente). Si se mantiene cookie para middleware, implementar `saveSession` que también setee cookie (httpOnly, secure, sameSite) y que el middleware la use.
2. **Credenciales demo:** Implementar aviso o botón “Usar cuenta demo” solo en modo demo, sin exponer claves en código cliente más allá de lo estrictamente necesario.
3. **Tests automatizados:** Añadir pruebas E2E para: login demo → panel sin bloqueo; skip biometría en no‑pago; ausencia de skip en `/pagos`; disclaimer visible en SmartAssistant.

### UX

1. **Modal biométrico en pagos:** Evitar que X, “Hacerlo más tarde” y backdrop den la sensación de que se puede omitir cuando es obligatorio.
2. **Demo en vivo:** Indicación clara de “Modo demo” en layout (p. ej. banner o badge) cuando corresponda.

### Seguridad

1. **Producción:** Asegurar `NEXT_PUBLIC_DEMO_MODE !== "true"` y que `isMasterKey` / bypass demo estén deshabilitados.
2. **Rate limiting:** Revisar y endurecer en `/api/assistant` y `/api/voice` si se prevé uso masivo.

### Demo comercial

1. **Checklist pre‑demo:** Login con `demo@legalpy.com` / `inversor2026`; comprobar plan GEP y panel profesional; probar skip biométrico en `/panel` y que en `/pagos` no se pueda omitir; abrir SmartAssistant y verificar disclaimer.
2. **Documentar** en un “runbook” de demo los pasos anteriores y los puntos que pueden preguntar inversores (biometría, roles, IA, pagos).

---

## FIX INMEDIATO (obligatorio)

### Fix 1: Aviso de credenciales demo en login (modo demo)

**Objetivo:** Que en modo demo se muestre en la UI de login un aviso con las credenciales de prueba, para evitar fallos en demos en vivo.

**Ubicación:** `app/login/page.tsx`, después del `<Card>` que envuelve `<LoginForm />` (p. ej. antes del “¿Olvidaste tu contraseña?”).

**Código a añadir:**

```tsx
{/* Aviso credenciales demo - solo si modo demo */}
{typeof window !== "undefined" &&
  (process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    localStorage.getItem("legal-py-demo-mode") === "true") && (
  <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-center">
    <p className="text-xs text-amber-200/90 mb-1">Demo inversores / auditoría</p>
    <p className="text-sm font-mono text-amber-100">
      demo@legalpy.com / inversor2026
    </p>
  </div>
)}
```

**Nota:** Si se prefiere no mostrar la contraseña en pantalla, se puede limitar a “demo@legalpy.com” y un botón “Rellenar y enviar cuenta demo” que inyecte usuario y contraseña en el formulario y dispare el submit.

---

### Fix 2: Incluir “Esto no constituye asesoramiento legal” en disclaimer IA

**Objetivo:** Cumplir con la redacción exacta solicitada en documentación y auditoría.

**Ubicación:** `lib/translations.ts`, objeto `es`, sección `ai_assistant.disclaimer`.

**Reemplazo sugerido:**

```ts
// Antes:
disclaimer:
  "IMPORTANTE: Soy una IA de filtrado. No brindo asesoría legal. Mi función es derivar tu caso al profesional correcto.",

// Después:
disclaimer:
  "IMPORTANTE: Esto no constituye asesoramiento legal. Soy una IA de filtrado; mi función es derivar tu caso al profesional correcto.",
```

Ajustar análogamente `en`, `pt` y el resto de idiomas si se usan en demo o auditoría.

---

### Fix 3: Deshabilitar cierre por backdrop/X/“Hacerlo más tarde” cuando es obligatorio

**Objetivo:** Evitar que, en rutas de pago (modal obligatorio), el usuario crea que puede cerrar con X, “Hacerlo más tarde” o clic en backdrop.

**Ubicación:** `components/Security/BiometricVerificationModal.tsx`.

**Cambios:**

1. **Backdrop (L378-394):** No cerrar ni escribir `biometric_skipped` cuando `effectiveIsMandatory` es `true`. Por ejemplo, no ejecutar `onClose` ni `sessionStorage`/`dispatch` si `effectiveIsMandatory`.

2. **Botón X (L415-431):** Misma condición: si `effectiveIsMandatory`, no llamar a `onClose` ni tocar `sessionStorage`/evento. Opcionalmente, ocultar el botón cuando sea obligatorio.

3. **“Hacerlo más tarde” (L682-696):** Si `effectiveIsMandatory`, deshabilitar el botón (`disabled={effectiveIsMandatory || status === "scanning" || isVerifying}`) y no hacer `onClose` ni `sessionStorage` cuando sea obligatorio.

Ejemplo para el **backdrop**:

```tsx
<motion.div
  ...
  onClick={() => {
    if (effectiveIsMandatory) return; // No cerrar en rutas de pago
    if (typeof window !== "undefined") {
      sessionStorage.setItem("biometric_skipped", "true");
      window.dispatchEvent(new Event("biometric-skip-changed"));
    }
    stopCamera();
    onClose();
  }}
  ...
/>
```

Aplicar lógica equivalente al X y a “Hacerlo más tarde”.

---

## Anexo: referencias de código

| Tema | Archivo | Líneas relevantes |
|------|---------|-------------------|
| Login demo | `lib/auth.ts` | 269-333 |
| Master key | `lib/feature-flags.ts` | 45-50 |
| BiometricGate | `components/Security/BiometricGate.tsx` | 32-37, 52-56, 60-66, 72-86, 105-139, 143-224, 304-324, 338-369 |
| Modal biométrico | `components/Security/BiometricVerificationModal.tsx` | 43-45, 378-394, 415-431, 681-696, 780-800 |
| SmartAssistant disclaimer | `components/SmartAssistant.tsx` | 626-633 |
| Assistant API | `app/api/assistant/route.ts` | 1-26 |
| Voice API | `app/api/voice/route.ts` | 1-80 |
| Panel por rol | `app/panel/page.tsx` | 26, 42-45, 332-341, 347-370, 452, 639, 1034, 1174 |
| Middleware | `middleware.ts` | 40-44, 76-86 |
| Sesión | `lib/auth.ts` | 29-31, 53-58 |
| Traducciones disclaimer | `lib/translations.ts` | 176-179 |

---

---

## Fixes aplicados (post-auditoría)

| Fix | Archivo(s) | Estado |
|-----|------------|--------|
| **Fix 1** Aviso credenciales demo en login | `app/login/page.tsx` | ✅ Aplicado |
| **Fix 2** Disclaimer "Esto no constituye asesoramiento legal" | `lib/translations.ts` (`es.ai_assistant.disclaimer`) | ✅ Aplicado |
| **Fix 3** Deshabilitar backdrop/X/"Hacerlo más tarde" cuando obligatorio | `BiometricVerificationModal.tsx` (backdrop, X, botón cancelar) | ✅ Aplicado |

**Pendiente (no implementado en este ciclo):** Unificación middleware/sesión (cookie vs. `localStorage`). Requiere decisión de arquitectura y posible refactor de `lib/auth` y `middleware`.

---

**Fin del informe.**  
Para dudas o ampliación de evidencia, usar las referencias de código de este anexo.
