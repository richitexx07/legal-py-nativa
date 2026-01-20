# Sistema de Autenticación - Legal PY

## 📋 Resumen

Sistema completo de autenticación con soporte para múltiples roles, 2FA, y verificación de email. Todo implementado con lógica mock (localStorage) sin necesidad de backend real.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/types.ts`)

- **User**: Usuario base con ID único no editable
- **UserRole**: `"cliente" | "profesional" | "estudiante"`
- **ClientProfile**: Perfil específico para clientes
- **ProfessionalProfile**: Perfil específico para profesionales
- **StudentProfile**: Perfil específico para estudiantes/pasantes
- **AuthSession**: Sesión autenticada del usuario

### Funciones de Autenticación (`/lib/auth.ts`)

Todas las funciones son mock y usan `localStorage`:

- `register()`: Registra nuevo usuario
- `login()`: Inicia sesión (soporta 2FA)
- `loginWithProvider()`: Login social (placeholder)
- `verifyEmail()`: Verifica email con código
- `sendEmailVerificationCode()`: Envía código de verificación
- `getSession()`: Obtiene sesión actual
- `clearSession()`: Cierra sesión
- `updateProfile()`: Actualiza perfil del usuario
- `enableTwoFactor()`: Habilita 2FA
- `disableTwoFactor()`: Deshabilita 2FA

### Componentes (`/components/Auth/`)

1. **RoleSelector.tsx**: Selector visual de rol (Cliente/Profesional/Estudiante)
2. **RegisterForm.tsx**: Formulario de registro con validación
3. **LoginForm.tsx**: Formulario de login con soporte 2FA
4. **TwoFactorForm.tsx**: Formulario de verificación 2FA con inputs de 6 dígitos
5. **EmailVerificationForm.tsx**: Formulario de verificación de email

### Páginas

- `/app/register/page.tsx`: Página de registro completa
- `/app/login/page.tsx`: Página de login completa

## 🔐 Flujos Implementados

### 1. Registro

```
1. Usuario selecciona rol (Cliente/Profesional/Estudiante)
2. Completa email y contraseña
3. Acepta términos y privacidad
4. Sistema crea usuario y perfil vacío
5. Redirige a verificación de email
6. Usuario ingresa código (demo: "123456")
7. Email verificado → Redirige según rol
```

### 2. Login

```
1. Usuario ingresa email y contraseña
2. Si tiene 2FA habilitado:
   - Sistema envía código (mock)
   - Usuario ingresa código de 6 dígitos
3. Sesión creada → Redirige según rol
```

### 3. 2FA (Autenticación de Dos Factores)

- **Métodos soportados**: email, sms, app (placeholders)
- **UI**: Inputs de 6 dígitos con auto-avance
- **Lógica**: Código mock generado y almacenado en localStorage
- **Demo**: Usa cualquier código de 6 dígitos o "123456"

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-users`: Array de usuarios registrados
- `legal-py-session`: Sesión actual del usuario
- `legal-py-profile-{role}-{userId}`: Perfil del usuario según rol
- `legal-py-2fa-code`: Código 2FA temporal (expira en 10 min)
- `legal-py-email-verification`: Código de verificación de email

## 🎨 Características UI

- ✅ Diseño consistente con el tema oscuro de Legal PY
- ✅ Validación de formularios en tiempo real
- ✅ Mensajes de error claros
- ✅ Inputs de contraseña con toggle de visibilidad
- ✅ Auto-avance en inputs de código 2FA
- ✅ Soporte para pegar códigos completos
- ✅ Indicadores de carga
- ✅ Placeholders para login social (Google, Facebook, Apple)

## 🔑 IDs Únicos

Los IDs de usuario se generan automáticamente con el formato:
```
usr_{timestamp}_{random_string}
```

Ejemplo: `usr_1705789200000_a1b2c3d4e`

**No son editables** una vez creados.

## 🧪 Testing/Demo

### Códigos Mock:

- **Verificación de Email**: `123456`
- **2FA**: Cualquier código de 6 dígitos funciona (mock)
- **Reset Password**: `123456` (si está implementado)

### Datos de Prueba:

Los usuarios se guardan en localStorage. Para limpiar:
```javascript
localStorage.removeItem('legal-py-users');
localStorage.removeItem('legal-py-session');
```

## 📝 Próximos Pasos (No Implementados)

1. **Backend Real**: Conectar con API real
2. **Login Social**: Implementar OAuth real (Google, Facebook, Apple)
3. **2FA Real**: Integrar servicios de SMS/Email reales
4. **Tokens JWT**: Implementar tokens reales (actualmente solo mock)
5. **Recuperación de Contraseña**: Completar flujo completo
6. **Verificación de Email Real**: Integrar servicio de email
7. **Rate Limiting**: Protección contra ataques de fuerza bruta
8. **Captcha**: Protección contra bots

## 🔒 Seguridad (Notas)

⚠️ **Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Usar backend real con hash de contraseñas (bcrypt)
- Implementar tokens JWT reales
- Validar y sanitizar todas las entradas
- Implementar rate limiting
- Usar HTTPS obligatorio
- Validar emails con servicios reales
- Implementar 2FA con servicios reales (TOTP, SMS)

## 📚 Uso en Componentes

```typescript
import { getSession, login, register } from "@/lib/auth";
import { UserRole } from "@/lib/types";

// Obtener sesión actual
const session = getSession();
if (session) {
  console.log("Usuario logueado:", session.user.email);
  console.log("Rol:", session.user.role);
}

// Registrar usuario
const response = await register({
  email: "usuario@example.com",
  password: "Password123",
  role: "cliente",
  acceptTerms: true,
  acceptPrivacy: true,
});

// Login
const loginResponse = await login({
  email: "usuario@example.com",
  password: "Password123",
  authMethod: "email",
});
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Funciones mock de autenticación
- [x] Componente RoleSelector
- [x] Componente RegisterForm
- [x] Componente LoginForm
- [x] Componente TwoFactorForm
- [x] Componente EmailVerificationForm
- [x] Página de registro (/register)
- [x] Página de login (/login)
- [x] IDs únicos no editables
- [x] 2FA UI completa
- [x] Verificación de email
- [x] Placeholders para login social
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Redirecciones según rol

---

**Estado**: ✅ Completado - Listo para desarrollo/demo
