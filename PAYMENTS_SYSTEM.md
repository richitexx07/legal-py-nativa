# Sistema de Registro de Pagos - Legal PY

## 📋 Resumen

Sistema de registro de pagos **sin intermediación financiera**. Legal PY NO procesa, recibe, transfiere ni maneja dinero. Solo registra los pagos realizados externamente para llevar control y seguimiento.

## ⚠️ DISCLAIMER CRÍTICO

**Legal PY NO es un procesador de pagos.**

- ❌ NO procesamos pagos
- ❌ NO recibimos dinero
- ❌ NO transferimos fondos
- ❌ NO manejamos transacciones financieras
- ✅ SOLO registramos pagos ya realizados
- ✅ SOLO mantenemos un historial de control

Los pagos se realizan **directamente entre el cliente y el profesional** fuera de nuestra plataforma.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/payments.ts`)

- **PaymentRecord**: Registro completo de un pago
- **PaymentStatus**: `"registrado" | "verificado" | "rechazado" | "pendiente"`
- **PaymentMethod**: Métodos de pago disponibles
- **PaymentCurrency**: Monedas soportadas (PYG, USD, EUR, BRL)
- **RegisterPaymentData**: Datos para registrar un pago

### Funciones de Gestión (`/lib/payments.ts`)

Todas las funciones usan `localStorage` (mock):

**Registro:**
- `registerPayment()`: Registra un nuevo pago (solo registro, no procesa)

**Consultas:**
- `getPaymentHistory()`: Obtiene historial visible (últimos 3 meses)
- `getAllPaymentRecords()`: Obtiene todos los registros (respaldo técnico 6 meses)
- `getPaymentById()`: Obtiene un registro por ID
- `getPaymentsByCase()`: Obtiene pagos de un caso
- `getPaymentsByClient()`: Obtiene pagos de un cliente
- `getPaymentsByProfessional()`: Obtiene pagos de un profesional

**Gestión:**
- `updatePaymentStatus()`: Actualiza el estado de un registro
- `updatePayment()`: Actualiza datos de un registro
- `deletePayment()`: Elimina un registro (solo dentro de 6 meses)

**Estadísticas:**
- `getPaymentStats()`: Obtiene estadísticas de pagos
- `exportPayments()`: Exporta registros para respaldo

### Componentes (`/components/Payments/`)

1. **PaymentDisclaimer.tsx**: Disclaimer claro de que Legal PY no procesa pagos
2. **PaymentForm.tsx**: Formulario para registrar un pago
3. **PaymentCard.tsx**: Tarjeta de pago individual
4. **PaymentHistory.tsx**: Historial de pagos con filtros
5. **PaymentStats.tsx**: Estadísticas de pagos

## 🔐 Flujos Implementados

### 1. Registro de Pago

```
1. Usuario completa formulario:
   - Monto y moneda
   - Método de pago utilizado
   - Descripción
   - Número de referencia/comprobante (opcional)
   - Fecha del pago (opcional)
   - Notas (opcional)
2. Sistema valida datos
3. Sistema genera ID único y número de registro
4. Se guarda el REGISTRO (no se procesa el pago)
5. Se muestra confirmación
```

### 2. Historial Visible (3 Meses)

```
1. Usuario accede a historial
2. Sistema muestra solo pagos de últimos 3 meses
3. Filtros disponibles:
   - Por estado
   - Por método
   - Por moneda
   - Por caso
4. Ordenamiento:
   - Por fecha (más reciente)
   - Por monto (mayor a menor)
```

### 3. Respaldo Técnico (6 Meses)

```
1. Sistema guarda todos los registros por 6 meses
2. Después de 3 meses, no son visibles en historial
3. Pero están disponibles para:
   - Exportación
   - Consultas administrativas
   - Auditoría
4. Después de 6 meses, pueden ser archivados
```

### 4. Asociación a Casos

```
1. Al registrar pago, se puede asociar a un caso
2. Los pagos aparecen en el detalle del caso
3. Filtrado por caso disponible
4. Link directo desde pago a caso
```

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-payments`: Array de todos los registros de pago

### Estructura de datos:

```typescript
{
  id: "pay_1705789200000_abc123",
  paymentNumber: "PAY-20250001",
  caseId: "LPY-...", // Opcional
  clientId: "usr_...",
  professionalId: "usr_...", // Opcional
  amount: 500000,
  currency: "PYG",
  method: "transferencia-bancaria",
  description: "Pago de honorarios",
  status: "registrado",
  registeredAt: "2025-01-19T...",
  // ... resto de campos
}
```

## 🎨 Características UI

- ✅ Disclaimer prominente en todos los componentes
- ✅ Formulario completo de registro
- ✅ Historial con filtros y ordenamiento
- ✅ Tarjetas de pago con información clara
- ✅ Estadísticas de pagos
- ✅ Asociación visual con casos
- ✅ Indicadores de estado (verificado, pendiente, etc.)
- ✅ Formato de moneda correcto
- ✅ Fechas legibles

## 🔑 IDs Únicos

Los IDs de registros de pago se generan automáticamente con el formato:
```
pay_{timestamp}_{random_string}
```

Ejemplo: `pay_1705789200000_a1b2c3d4e`

**No son editables** una vez creados.

Los números de registro legibles tienen el formato:
```
PAY-{year}{number}
```

Ejemplo: `PAY-20250001`

## 📅 Períodos de Visibilidad y Respaldo

### Historial Visible: 3 Meses
- Los usuarios pueden ver pagos de los últimos 3 meses
- Filtros y búsqueda funcionan solo en este período
- Interfaz muestra claramente el período visible

### Respaldo Técnico: 6 Meses
- Todos los registros se mantienen por 6 meses
- Disponibles para exportación y consultas administrativas
- Después de 6 meses, pueden ser archivados según políticas

## 🧪 Testing/Demo

### Registrar un pago de prueba:

```typescript
import { registerPayment } from "@/lib/payments";

const response = await registerPayment({
  caseId: "LPY-123",
  clientId: "usr_123",
  professionalId: "usr_456",
  amount: 500000,
  currency: "PYG",
  method: "transferencia-bancaria",
  description: "Pago de honorarios profesionales",
  reference: "TRANS-123456",
}, "usr_123");
```

### Obtener historial:

```typescript
import { getPaymentHistory } from "@/lib/payments";

const history = getPaymentHistory({
  clientId: "usr_123",
  status: "verificado"
});
// Solo muestra últimos 3 meses
```

### Obtener respaldo técnico:

```typescript
import { getAllPaymentRecords } from "@/lib/payments";

const allRecords = getAllPaymentRecords({
  clientId: "usr_123"
});
// Muestra últimos 6 meses
```

## ⚠️ Notas de Seguridad y Legal

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- **Disclaimers legales claros** en términos y condiciones
- **No almacenar información financiera sensible** (números de tarjeta, etc.)
- **Cumplir con regulaciones financieras** locales
- **No implicar que Legal PY procesa pagos** en ningún momento
- **Validar comprobantes** cuando sea posible
- **Auditoría completa** de todos los registros
- **Encriptación** de datos sensibles
- **Políticas de retención** claras y cumplidas

## 📚 Uso en Componentes

```typescript
import { 
  registerPayment, 
  getPaymentHistory,
  getPaymentsByCase 
} from "@/lib/payments";
import PaymentForm from "@/components/Payments/PaymentForm";
import PaymentHistory from "@/components/Payments/PaymentHistory";

// Registrar pago
const response = await registerPayment({
  caseId: "LPY-123",
  clientId: "usr_123",
  amount: 500000,
  currency: "PYG",
  method: "transferencia-bancaria",
  description: "Pago de honorarios"
}, "usr_123");

// Mostrar historial
<PaymentHistory 
  filters={{ clientId: "usr_123" }}
  showRegisterButton={true}
/>
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Funciones de registro de pagos (mock)
- [x] Sistema de IDs únicos
- [x] Historial visible 3 meses
- [x] Respaldo técnico 6 meses
- [x] Asociación a casos
- [x] Componente PaymentDisclaimer
- [x] Componente PaymentForm
- [x] Componente PaymentCard
- [x] Componente PaymentHistory
- [x] Componente PaymentStats
- [x] Página de historial de pagos
- [x] Disclaimers claros en todos los componentes
- [x] Filtros y ordenamiento
- [x] Estadísticas de pagos

---

**Estado**: ✅ Completado - Listo para desarrollo/demo

**IMPORTANTE**: Este sistema es solo de registro. Legal PY NO procesa pagos.
