# Sistema de Políticas y Descargos Legales - Legal PY

## 📋 Resumen

Sistema completo de políticas de privacidad y términos y condiciones con contenido editable, versionado, y aceptación obligatoria en el registro.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/legal-content.ts`)

- **LegalContent**: Contenido de políticas/ términos con versionado
  - `id`: Identificador único
  - `title`: Título del documento
  - `lastUpdated`: Fecha de última actualización (ISO 8601)
  - `content`: Contenido en Markdown
  - `version`: Número de versión

### Funciones de Gestión (`/lib/legal-content.ts`)

**Políticas de Privacidad:**
- `getPrivacyPolicy()`: Obtiene política de privacidad
- `savePrivacyPolicy()`: Guarda política de privacidad
- `getDefaultPrivacyPolicy()`: Contenido por defecto

**Términos y Condiciones:**
- `getTermsAndConditions()`: Obtiene términos y condiciones
- `saveTermsAndConditions()`: Guarda términos y condiciones
- `getDefaultTermsAndConditions()`: Contenido por defecto

### Componentes

1. **LegalConsent.tsx**: Componente de aceptación de políticas (actualizado)
2. **RegisterForm.tsx**: Formulario de registro con aceptación obligatoria

### Páginas

1. **`/app/legal/privacy/page.tsx`**: Página de políticas de privacidad
2. **`/app/legal/terms/page.tsx`**: Página de términos y condiciones

## 🔐 Flujos Implementados

### 1. Visualización de Políticas

```
1. Usuario accede a /legal/privacy o /legal/terms
2. Sistema carga contenido desde localStorage
3. Si no existe, carga contenido por defecto
4. Muestra contenido formateado (Markdown renderizado)
5. Muestra fecha de actualización y versión
```

### 2. Edición de Contenido

```
1. Usuario hace clic en "Editar"
2. Se muestra textarea con contenido actual
3. Usuario edita el contenido (Markdown)
4. Al guardar:
   - Incrementa versión
   - Actualiza fecha de última actualización
   - Guarda en localStorage
5. Muestra confirmación de guardado
```

### 3. Aceptación Obligatoria en Registro

```
1. Usuario completa formulario de registro
2. Debe marcar checkboxes obligatorios:
   - ✓ Acepto los Términos y Condiciones *
   - ✓ Acepto la Política de Privacidad *
3. Validación:
   - Si no acepta términos → Error: "Debes aceptar los términos y condiciones"
   - Si no acepta privacidad → Error: "Debes aceptar la política de privacidad"
4. Links abren en nueva pestaña para leer políticas
5. Sin aceptación, NO se puede registrar
```

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-privacy-policy`: Contenido de políticas de privacidad
- `legal-py-terms-conditions`: Contenido de términos y condiciones

### Estructura de datos:

```typescript
{
  id: "privacy-policy",
  title: "Política de Privacidad",
  lastUpdated: "2025-01-19T...",
  version: 1,
  content: "# Política de Privacidad\n\n..."
}
```

## 🎨 Características UI

- ✅ Páginas dedicadas para políticas y términos
- ✅ Contenido editable con textarea
- ✅ Renderizado básico de Markdown
- ✅ Versionado automático
- ✅ Fecha de última actualización
- ✅ Checkboxes obligatorios en registro
- ✅ Links a políticas en nueva pestaña
- ✅ Descargo legal visible
- ✅ Validación de aceptación
- ✅ Mensajes de error claros

## 📝 Contenido por Defecto

### Política de Privacidad

Incluye secciones sobre:
- Información que recopilamos
- Uso de la información
- Seguridad de los datos
- Compartir información
- Derechos del usuario
- Cookies
- Retención de datos
- Menores de edad
- Transferencias internacionales
- Cambios a la política
- Contacto

### Términos y Condiciones

Incluye secciones sobre:
- Aceptación de los términos
- Descripción del servicio
- Registro y cuentas
- Uso de la plataforma
- Servicios de profesionales
- Pagos y facturación
- Propiedad intelectual
- Limitación de responsabilidad
- Indemnización
- Cancelación y terminación
- Modificaciones
- Ley aplicable
- Disposiciones generales
- Contacto

## 🔑 Versionado

Cada vez que se edita y guarda el contenido:
- Se incrementa el número de versión
- Se actualiza la fecha de última actualización
- Se mantiene historial (en localStorage)

## 🧪 Testing/Demo

### Editar política de privacidad:

```typescript
import { getPrivacyPolicy, savePrivacyPolicy } from "@/lib/legal-content";

const policy = getPrivacyPolicy();
policy.content = "# Nueva Política\n\n...";
policy.version += 1;
policy.lastUpdated = new Date().toISOString();
savePrivacyPolicy(policy);
```

### Verificar aceptación en registro:

El formulario de registro valida que ambos checkboxes estén marcados antes de permitir el registro.

## ⚠️ Notas de Seguridad y Legal

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- **Almacenar contenido en base de datos** (no localStorage)
- **Control de acceso** para edición (solo administradores)
- **Historial completo** de cambios
- **Notificaciones** a usuarios cuando cambien políticas
- **Re-aceptación** si hay cambios significativos
- **Auditoría legal** del contenido
- **Cumplimiento GDPR/LGPD** según jurisdicción
- **Backup** del contenido legal

## 📚 Uso en Componentes

```typescript
import { getPrivacyPolicy, getTermsAndConditions } from "@/lib/legal-content";

// Obtener contenido
const privacy = getPrivacyPolicy();
const terms = getTermsAndConditions();

// En registro
<LegalConsent
  acceptTerms={acceptTerms}
  acceptPrivacy={acceptPrivacy}
  onTermsChange={setAcceptTerms}
  onPrivacyChange={setAcceptPrivacy}
/>
```

## ✅ Checklist de Implementación

- [x] Página de políticas de privacidad
- [x] Página de términos y condiciones
- [x] Contenido editable (textarea)
- [x] Renderizado básico de Markdown
- [x] Versionado automático
- [x] Fecha de última actualización
- [x] Aceptación obligatoria en registro
- [x] Validación de checkboxes
- [x] Links a políticas en nueva pestaña
- [x] Descargo legal visible
- [x] Contenido por defecto completo
- [x] Almacenamiento en localStorage

---

**Estado**: ✅ Completado - Listo para desarrollo/demo

**Nota**: El contenido es editable desde la UI. En producción, esto debería estar restringido a administradores y almacenarse en una base de datos con historial completo.
