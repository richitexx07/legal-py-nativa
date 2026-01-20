# Sistema de Notificaciones - Legal PY

## 📋 Resumen

Sistema completo de notificaciones multi-canal (Email, WhatsApp, App) con preferencias de usuario configurables y funciones mock para desarrollo/demo.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/notifications.ts`)

- **Notification**: Notificación individual
- **NotificationChannel**: `"email" | "whatsapp" | "app"`
- **NotificationType**: Tipos de notificaciones (case_created, payment_registered, etc.)
- **NotificationPriority**: `"low" | "medium" | "high" | "urgent"`
- **NotificationStatus**: `"pending" | "sent" | "delivered" | "read" | "failed"`
- **NotificationPreferences**: Preferencias de usuario por canal

### Funciones de Gestión (`/lib/notifications.ts`)

**Envío:**
- `sendNotification()`: Crea y envía notificaciones según preferencias
- `sendNotificationToChannel()`: Envía a canal específico (mock)

**Preferencias:**
- `getNotificationPreferences()`: Obtiene preferencias de usuario
- `saveNotificationPreferences()`: Guarda preferencias
- `getDefaultPreferences()`: Preferencias por defecto

**Gestión:**
- `getUserNotifications()`: Obtiene notificaciones de usuario con filtros
- `markNotificationAsRead()`: Marca como leída
- `markAllNotificationsAsRead()`: Marca todas como leídas
- `deleteNotification()`: Elimina notificación
- `getNotificationStats()`: Obtiene estadísticas

**Plantillas:**
- `getNotificationTemplate()`: Plantillas por tipo de notificación

### Componentes (`/components/Notifications/`)

1. **NotificationBell.tsx**: Botón de notificaciones en navbar con contador
2. **NotificationPanel.tsx**: Panel desplegable con lista de notificaciones
3. **NotificationCard.tsx**: Tarjeta individual de notificación
4. **NotificationList.tsx**: Lista completa con filtros
5. **NotificationPreferences.tsx**: Gestión de preferencias de usuario

## 🔐 Flujos Implementados

### 1. Envío de Notificaciones

```
1. Sistema detecta evento (ej: caso creado)
2. Obtiene preferencias del usuario
3. Determina canales habilitados según:
   - Canal habilitado
   - Tipo de notificación permitido
   - Prioridad mínima configurada
   - Horas silenciosas (excepto urgentes)
4. Crea notificación para cada canal
5. Envía a cada canal (mock):
   - Email: Simula envío
   - WhatsApp: Simula envío
   - App: Simula push notification
6. Actualiza estado: pending → sent → delivered
```

### 2. Preferencias de Usuario

```
Cada usuario puede configurar:
- Email:
  - Habilitado/Deshabilitado
  - Tipos de notificaciones permitidos
  - Prioridades mínimas
- WhatsApp:
  - Habilitado/Deshabilitado
  - Número de teléfono
  - Tipos de notificaciones permitidos
  - Prioridades mínimas
- App (Futuro):
  - Habilitado/Deshabilitado
  - Push notifications
  - Tipos de notificaciones permitidos
  - Prioridades mínimas
- Horas Silenciosas:
  - Habilitado/Deshabilitado
  - Hora inicio/fin
  - No aplica a notificaciones urgentes
```

### 3. Visualización

```
1. Usuario hace clic en campana de notificaciones
2. Se muestra panel con últimas 10 notificaciones
3. Notificaciones no leídas destacadas
4. Usuario puede:
   - Marcar como leída
   - Hacer clic para ver detalle
   - Ir a página de acción
   - Ver todas las notificaciones
```

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-notifications`: Array de todas las notificaciones
- `legal-py-notification-preferences-{userId}`: Preferencias por usuario

### Estructura de datos:

```typescript
// Notificación
{
  id: "notif_1705789200000_abc123",
  userId: "usr_123",
  type: "case_created",
  channel: "email",
  priority: "medium",
  title: "Nuevo caso creado",
  message: "Se ha creado el caso...",
  status: "delivered",
  createdAt: "2025-01-19T...",
  actionUrl: "/casos/123",
  actionLabel: "Ver caso"
}

// Preferencias
{
  userId: "usr_123",
  email: {
    enabled: true,
    types: ["case_created", "payment_registered"],
    priority: ["medium", "high", "urgent"]
  },
  whatsapp: {
    enabled: false,
    phoneNumber: "+595 981 123456",
    types: ["case_assigned"],
    priority: ["high", "urgent"]
  },
  app: {
    enabled: true,
    types: [...],
    priority: [...],
    pushEnabled: true
  },
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00"
  }
}
```

## 🎨 Características UI

- ✅ Campana de notificaciones en navbar con contador
- ✅ Panel desplegable con últimas notificaciones
- ✅ Tarjetas de notificación con información completa
- ✅ Indicadores de no leídas
- ✅ Filtros por canal, tipo, estado
- ✅ Preferencias configurables por canal
- ✅ Horas silenciosas
- ✅ Estadísticas de notificaciones
- ✅ Acciones directas desde notificaciones

## 📧 Canales de Notificación

### Email (Mock)
- Simula envío de correo electrónico
- Log en consola: `[MOCK EMAIL]`
- Delay simulado: 500ms

### WhatsApp (Mock)
- Simula envío de mensaje WhatsApp
- Requiere número de teléfono configurado
- Log en consola: `[MOCK WHATSAPP]`
- Delay simulado: 500ms

### App (Placeholder)
- Simula notificación push
- Preparado para app móvil futura
- Log en consola: `[MOCK APP PUSH]`
- Delay simulado: 300ms

## 🧪 Testing/Demo

### Enviar notificación:

```typescript
import { sendNotification } from "@/lib/notifications";

await sendNotification({
  userId: "usr_123",
  type: "case_created",
  priority: "medium",
  title: "Nuevo caso creado",
  message: "Se ha creado el caso LPY-123",
  actionUrl: "/casos/123",
  actionLabel: "Ver caso",
  metadata: {
    caseId: "LPY-123",
    caseTitle: "Caso de ejemplo"
  }
});
```

### Obtener notificaciones:

```typescript
import { getUserNotifications } from "@/lib/notifications";

const notifications = getUserNotifications("usr_123", {
  unreadOnly: true,
  channel: "email",
  limit: 10
});
```

### Guardar preferencias:

```typescript
import { saveNotificationPreferences } from "@/lib/notifications";

await saveNotificationPreferences({
  userId: "usr_123",
  email: {
    enabled: true,
    types: ["case_created", "payment_registered"],
    priority: ["medium", "high", "urgent"]
  },
  // ... resto de preferencias
});
```

## ⚠️ Notas de Seguridad

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Integrar servicio real de email (SendGrid, AWS SES, etc.)
- Integrar API de WhatsApp Business
- Implementar push notifications reales (Firebase, OneSignal, etc.)
- Validar números de teléfono
- Rate limiting para evitar spam
- Encriptación de datos sensibles
- Logs de auditoría
- Políticas de retención de notificaciones

## 📚 Uso en Componentes

```typescript
import { sendNotification } from "@/lib/notifications";
import NotificationBell from "@/components/Notifications/NotificationBell";
import NotificationList from "@/components/Notifications/NotificationList";

// Enviar notificación
await sendNotification({
  userId: "usr_123",
  type: "case_created",
  title: "Nuevo caso",
  message: "Se creó un caso"
});

// Mostrar campana
<NotificationBell userId="usr_123" />

// Mostrar lista
<NotificationList userId="usr_123" />
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Sistema de preferencias de usuario
- [x] Envío mock por Email
- [x] Envío mock por WhatsApp
- [x] Placeholder para App futura
- [x] Componente NotificationBell
- [x] Componente NotificationPanel
- [x] Componente NotificationCard
- [x] Componente NotificationList
- [x] Componente NotificationPreferences
- [x] Página de notificaciones
- [x] Integración en NavbarTop
- [x] Filtros y búsqueda
- [x] Estadísticas
- [x] Horas silenciosas
- [x] Plantillas por tipo

---

**Estado**: ✅ Completado - Listo para desarrollo/demo

**Nota**: Todos los canales son mock/placeholder. En producción se requerirían integraciones reales con servicios de terceros.
