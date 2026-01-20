# Sistema de Reputación y Perfiles - Legal PY

## 📋 Resumen

Sistema completo de reputación, calificaciones, reseñas y gestión de profesionales con estados (activo, suspendido, en revisión), bloqueo y denuncia de clientes.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/reputation.ts`)

- **ProfessionalStatus**: `"activo" | "suspendido" | "en-revision"`
- **Review**: Reseña de un cliente con calificación, comentario, tags
- **RatingStats**: Estadísticas de calificación (promedio, distribución)
- **PerformanceHistory**: Historial de desempeño por período
- **Report**: Denuncia de un cliente contra un profesional
- **Block**: Bloqueo de un profesional por un cliente
- **ProfessionalReputation**: Información completa de reputación del profesional

### Funciones de Reputación (`/lib/reputation.ts`)

Todas las funciones usan `localStorage` (mock):

**Calificaciones y Reseñas:**
- `getProfessionalReputation()`: Obtiene reputación completa
- `addReview()`: Agrega una nueva reseña
- `getReviews()`: Obtiene reseñas con paginación y filtros
- `markReviewHelpful()`: Marca reseña como útil
- `respondToReview()`: El profesional responde a una reseña

**Denuncias:**
- `createReport()`: Crea una denuncia contra un profesional
- `getReports()`: Obtiene denuncias (solo administradores)
- `resolveReport()`: Resuelve una denuncia (solo administradores)

**Bloqueos:**
- `blockProfessional()`: Bloquea a un profesional (solo para el cliente)
- `unblockProfessional()`: Desbloquea a un profesional
- `isBlocked()`: Verifica si está bloqueado

**Gestión de Estados:**
- `updateProfessionalStatus()`: Cambia estado del profesional (solo administradores)
- `updatePerformanceHistory()`: Actualiza historial de desempeño

### Componentes (`/components/Profile/`)

1. **StatusBadge.tsx**: Badge de estado del profesional (Activo/Suspendido/En Revisión)
2. **RatingDisplay.tsx**: Visualización de calificaciones con distribución
3. **ReviewCard.tsx**: Tarjeta de reseña individual
4. **ReviewForm.tsx**: Formulario para dejar una reseña
5. **ReportModal.tsx**: Modal para denunciar un profesional
6. **BlockButton.tsx**: Botón de bloqueo/desbloqueo
7. **PerformanceHistory.tsx**: Historial de desempeño por períodos

## 🔐 Flujos Implementados

### 1. Sistema de Calificaciones y Reseñas

```
1. Cliente contrata servicio del profesional
2. Cliente puede dejar reseña:
   - Calificación de 1-5 estrellas
   - Comentario (mínimo 10 caracteres)
   - Tags opcionales (Puntual, Comunicativo, etc.)
3. Reseña se muestra en perfil público
4. Otros usuarios pueden marcar reseña como "útil"
5. Profesional puede responder a reseñas
6. Sistema calcula promedio y distribución automáticamente
```

### 2. Sistema de Denuncias

```
1. Cliente puede denunciar profesional:
   - Tipo de denuncia (6 opciones)
   - Título y descripción detallada
   - Opcionalmente adjuntar archivos
2. Denuncia se envía para revisión
3. Si hay 3+ denuncias pendientes → Estado cambia a "en-revision"
4. Administrador revisa y resuelve
5. Si todas resueltas y estado era "en-revision" → Vuelve a "activo"
```

### 3. Sistema de Bloqueo

```
1. Cliente puede bloquear profesional (con razón opcional)
2. Profesional bloqueado:
   - No aparece en búsquedas para ese cliente
   - No puede contactar al cliente
   - Cliente no ve su perfil
3. Cliente puede desbloquear en cualquier momento
4. Bloqueo es individual (cada cliente tiene su propia lista)
```

### 4. Estados del Profesional

**Activo:**
- Aparece en búsquedas
- Puede recibir contrataciones
- Perfil completamente visible

**En Revisión:**
- Aparece en búsquedas con badge de advertencia
- Puede recibir contrataciones
- Indicador visible de estado

**Suspendido:**
- No aparece en búsquedas (o aparece con advertencia)
- No puede recibir nuevas contrataciones
- Muestra razón de suspensión (si está disponible)
- Puede tener fecha de fin de suspensión

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-reputation-{professionalId}`: Reputación completa del profesional
- `legal-py-block-{clientId}-{professionalId}`: Bloqueo individual

## 🎨 Características UI

- ✅ Badges de estado visuales (Activo/Suspendido/En Revisión)
- ✅ Visualización de calificaciones con distribución
- ✅ Reseñas con calificación, comentario, tags y respuestas
- ✅ Formulario de reseña con calificación interactiva
- ✅ Modal de denuncia con tipos predefinidos
- ✅ Botón de bloqueo/desbloqueo
- ✅ Historial de desempeño por períodos
- ✅ Filtros y ordenamiento de reseñas
- ✅ Marcar reseñas como útiles
- ✅ Respuestas del profesional a reseñas

## 🔑 Validaciones y Restricciones

### Reseñas:
- Un cliente solo puede dejar una reseña por profesional
- Comentario mínimo 10 caracteres
- Calificación obligatoria (1-5)

### Denuncias:
- Título mínimo 5 caracteres
- Descripción mínima 20 caracteres
- No hay límite de denuncias (pero afecta el estado)

### Estados:
- Solo administradores pueden cambiar estados
- Estado "en-revision" automático con 3+ denuncias pendientes
- Estado vuelve a "activo" cuando todas las denuncias se resuelven

## 🧪 Testing/Demo

### Estados de Prueba:

1. **Crear reputación:**
   - Se crea automáticamente al acceder al perfil
   - Estado inicial: "activo"

2. **Agregar reseña:**
   - Calificación 1-5
   - Comentario mínimo 10 caracteres
   - Tags opcionales

3. **Denunciar:**
   - Cualquier tipo de denuncia
   - Si hay 3+ → Estado cambia a "en-revision"

4. **Bloquear:**
   - El cliente no verá el perfil del profesional bloqueado

### Datos de Prueba:

Los datos se guardan en localStorage. Para limpiar:
```javascript
// Limpiar reputación de un profesional
localStorage.removeItem('legal-py-reputation-{professionalId}');

// Limpiar bloqueos
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('legal-py-block-')) {
    localStorage.removeItem(key);
  }
});
```

## 📝 Lenguaje Prudente

El sistema usa lenguaje prudente y evita implicar lógica policial automática:

- ❌ NO dice "reportado a autoridades"
- ❌ NO promete "sanciones automáticas"
- ✅ Dice "será revisado por nuestro equipo"
- ✅ Dice "tomaremos las medidas correspondientes si es necesario"
- ✅ Menciona "moderación" en lugar de "policía"
- ✅ Usa términos como "revisión", "evaluación", "consideración"

## ⚠️ Notas de Seguridad

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Validar que el cliente realmente contrató al profesional antes de permitir reseña
- Implementar verificación de identidad para denuncias
- Limitar frecuencia de denuncias por cliente
- Implementar sistema de apelaciones para profesionales suspendidos
- Notificaciones al profesional cuando se recibe denuncia
- Historial completo de cambios de estado
- Logs de auditoría para todas las acciones

## 📚 Uso en Componentes

```typescript
import { 
  getProfessionalReputation, 
  addReview, 
  blockProfessional,
  createReport 
} from "@/lib/reputation";
import StatusBadge from "@/components/Profile/StatusBadge";
import RatingDisplay from "@/components/Profile/RatingDisplay";

// Obtener reputación
const reputation = getProfessionalReputation(professionalId);

// Agregar reseña
const response = addReview({
  professionalId,
  clientId,
  rating: 5,
  comment: "Excelente profesional",
  tags: ["Puntual", "Comunicativo"]
});

// Bloquear profesional
blockProfessional(professionalId, clientId, "Razón opcional");
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Funciones de reputación (mock)
- [x] Sistema de calificaciones y reseñas
- [x] Componente StatusBadge
- [x] Componente RatingDisplay
- [x] Componente ReviewCard
- [x] Componente ReviewForm
- [x] Componente ReportModal
- [x] Componente BlockButton
- [x] Componente PerformanceHistory
- [x] Página de perfil actualizada
- [x] Estados del profesional (activo/suspendido/en-revision)
- [x] Sistema de bloqueo
- [x] Sistema de denuncias
- [x] Historial de desempeño
- [x] Filtros y ordenamiento de reseñas
- [x] Lenguaje prudente implementado

---

**Estado**: ✅ Completado - Listo para desarrollo/demo
