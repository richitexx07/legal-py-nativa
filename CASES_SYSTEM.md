# Sistema de Gestión de Casos y Expedientes - Legal PY

## 📋 Resumen

Sistema completo de gestión de casos legales con timeline de eventos, checklist de tareas, gestión de documentos, comentarios, y relación cliente-profesional.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/cases.ts`)

- **Case**: Caso completo con todos sus datos
- **CaseStatus**: `"activo" | "en-pausa" | "cerrado" | "archivado"`
- **CasePriority**: `"baja" | "media" | "alta" | "urgente"`
- **TimelineEvent**: Evento en el timeline del caso
- **ChecklistItem**: Item del checklist de tareas
- **CaseDocument**: Documento asociado al caso
- **CaseComment**: Comentario en el caso
- **CaseNotification**: Notificación relacionada

### Funciones de Gestión (`/lib/cases.ts`)

Todas las funciones usan `localStorage` (mock):

**Gestión de Casos:**
- `createCase()`: Crea un nuevo caso
- `getCaseById()`: Obtiene un caso por ID
- `getCasesByUser()`: Obtiene casos de un usuario (cliente o profesional)
- `updateCase()`: Actualiza un caso
- `archiveCase()`: Archiva un caso

**Timeline:**
- `addTimelineEvent()`: Agrega un evento al timeline

**Checklist:**
- `updateChecklistItem()`: Actualiza el estado de un item del checklist

**Documentos:**
- `addDocument()`: Agrega un documento (mock - no sube realmente)
- `deleteDocument()`: Elimina un documento

**Comentarios:**
- `addComment()`: Agrega un comentario al caso

**Notificaciones:**
- `addNotification()`: Agrega una notificación

**Asignación:**
- `assignProfessional()`: Asigna un profesional al caso

### Componentes (`/components/Case/`)

1. **CaseHeader.tsx**: Header del caso con información principal
2. **CaseStatusBadge.tsx**: Badge de estado del caso
3. **CaseTimeline.tsx**: Timeline de eventos del caso
4. **CaseChecklist.tsx**: Checklist de tareas con progreso
5. **CaseDocuments.tsx**: Gestión de documentos con subida (mock)
6. **CaseComments.tsx**: Comentarios del caso
7. **CaseInfo.tsx**: Información adicional del caso (sidebar)

## 🔐 Flujos Implementados

### 1. Creación de Caso

```
1. Cliente crea un caso:
   - Título y descripción
   - Prioridad (opcional)
   - Tags (opcional)
   - Checklist inicial (opcional)
2. Sistema genera ID único (LPY-{timestamp}-{random})
3. Sistema genera número de caso legible (LPY-{year}{number})
4. Se crea evento inicial en timeline
5. Caso se guarda en localStorage
```

### 2. Gestión de Timeline

```
1. Eventos se agregan automáticamente al:
   - Crear caso
   - Cambiar estado
   - Subir documento
   - Completar tarea
   - Agregar comentario
2. Eventos se muestran en orden cronológico (más recientes primero)
3. Cada evento tiene tipo, estado, y metadata opcional
```

### 3. Checklist de Tareas

```
1. Checklist se puede crear al crear el caso o después
2. Items tienen:
   - Label (texto)
   - Estado (completado/pendiente)
   - Prioridad opcional
   - Fecha de vencimiento opcional
   - Notas opcionales
3. Al completar un item:
   - Se marca como completado
   - Se registra quién y cuándo
   - Se agrega evento al timeline
4. Barra de progreso muestra % completado
```

### 4. Gestión de Documentos

```
1. Usuario puede subir documentos (mock):
   - Selecciona archivo
   - Sistema simula subida
   - Documento se agrega a la lista
   - Se crea evento en timeline
2. Documentos tienen:
   - Nombre, tipo, tamaño
   - Fecha de subida
   - Usuario que subió
   - Categoría opcional
   - Versión
3. Usuario puede eliminar documentos
```

### 5. Comentarios

```
1. Cliente y profesional pueden comentar
2. Comentarios se muestran en orden cronológico
3. Cada comentario muestra:
   - Autor y rol
   - Fecha relativa
   - Contenido
4. Se crea evento en timeline al agregar comentario
```

### 6. Relación Cliente-Profesional

```
1. Cliente puede asignar profesional al caso
2. Profesional asignado puede:
   - Ver el caso
   - Actualizar timeline
   - Completar checklist
   - Subir documentos
   - Comentar
3. Permisos basados en rol:
   - Cliente: propietario del caso
   - Profesional: solo si está asignado
```

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-cases`: Array de todos los casos

### Estructura de datos:

```typescript
{
  id: "LPY-1705789200000-abc123",
  caseNumber: "LPY-20250001",
  title: "Caso de ejemplo",
  clientId: "usr_...",
  professionalId: "usr_...",
  // ... resto de campos
}
```

## 🎨 Características UI

- ✅ Header del caso con badges de estado y prioridad
- ✅ Timeline visual con eventos ordenados
- ✅ Checklist interactivo con barra de progreso
- ✅ Subida de documentos (mock) con preview
- ✅ Sistema de comentarios en tiempo real
- ✅ Sidebar con información del caso
- ✅ Permisos basados en rol
- ✅ Alertas y notificaciones
- ✅ Tags y categorización

## 🔑 IDs Únicos

Los IDs de casos se generan automáticamente con el formato:
```
LPY-{timestamp}-{random_string}
```

Ejemplo: `LPY-1705789200000-a1b2c3d4e`

**No son editables** una vez creados.

Los números de caso legibles tienen el formato:
```
LPY-{year}{number}
```

Ejemplo: `LPY-20250001`

## 🧪 Testing/Demo

### Crear un caso de prueba:

```typescript
import { createCase } from "@/lib/cases";

const response = await createCase({
  title: "Caso de prueba",
  description: "Descripción del caso",
  clientId: "usr_123",
  priority: "alta",
  tags: ["laboral", "urgente"],
  initialChecklist: [
    "Revisar documentos",
    "Preparar demanda",
    "Presentar en juzgado"
  ]
});
```

### Obtener casos de un usuario:

```typescript
import { getCasesByUser } from "@/lib/cases";

const cases = getCasesByUser(userId, "cliente");
```

### Actualizar checklist:

```typescript
import { updateChecklistItem } from "@/lib/cases";

await updateChecklistItem(caseId, itemId, true, userId);
```

## 📝 Permisos y Acceso

### Cliente (Propietario):
- ✅ Ver su caso
- ✅ Editar título, descripción, estado
- ✅ Agregar eventos al timeline
- ✅ Completar checklist
- ✅ Subir documentos
- ✅ Comentar
- ✅ Asignar profesional
- ✅ Cerrar/archivar caso

### Profesional (Asignado):
- ✅ Ver caso si está asignado
- ✅ Agregar eventos al timeline
- ✅ Completar checklist
- ✅ Subir documentos
- ✅ Comentar
- ❌ No puede cambiar estado principal
- ❌ No puede asignar otro profesional

### Sin sesión:
- ❌ No puede ver casos

## ⚠️ Notas de Seguridad

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Validar permisos en backend
- Encriptar documentos sensibles
- Implementar control de versiones de documentos
- Notificaciones reales (email, push)
- Auditoría completa de cambios
- Backup automático de casos
- Límites de tamaño de archivos
- Validación de tipos de archivo permitidos

## 📚 Uso en Componentes

```typescript
import { 
  getCaseById, 
  updateCase, 
  addDocument,
  updateChecklistItem 
} from "@/lib/cases";
import CaseHeader from "@/components/Case/CaseHeader";
import CaseTimeline from "@/components/Case/CaseTimeline";

// Obtener caso
const caseData = getCaseById(caseId);

// Usar componentes
<CaseHeader caseData={caseData} onStatusChange={handleStatusChange} />
<CaseTimeline events={caseData.timeline} />
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Funciones de gestión de casos (mock)
- [x] Sistema de IDs únicos
- [x] Timeline de eventos
- [x] Checklist de tareas
- [x] Gestión de documentos (mock)
- [x] Sistema de comentarios
- [x] Relación cliente-profesional
- [x] Componente CaseHeader
- [x] Componente CaseStatusBadge
- [x] Componente CaseTimeline
- [x] Componente CaseChecklist
- [x] Componente CaseDocuments
- [x] Componente CaseComments
- [x] Componente CaseInfo
- [x] Página de detalle actualizada
- [x] Permisos basados en rol
- [x] Validaciones de acceso

---

**Estado**: ✅ Completado - Listo para desarrollo/demo
