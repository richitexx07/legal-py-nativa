# Módulo de Educación y Capacitación - Legal PY

## 📋 Estructura del Módulo

Este módulo incluye:
- **Cursos**: Catálogo de cursos con inscripción funcional
- **Especializaciones**: Programas de especialización jurídica
- **Certificaciones**: Programas de certificación con verificación
- **Pasantías**: Programa de pasantía laboral con postulación
- **Capacitación Empresas**: Servicios de capacitación personalizada
- **Panel Admin**: Panel de administración para gestionar leads

## 🗺️ Mapa del Sitio

```
/
├── /cursos
│   ├── / (listado con filtros)
│   └── /[slug] (detalle + formulario de inscripción)
├── /especializaciones (listado con filtros)
├── /certificaciones (catálogo + verificación de certificados)
├── /pasantias
│   ├── / (listado de pasantías disponibles)
│   └── /postular (formulario de postulación)
├── /capacitacion-empresas (formulario de solicitud de propuesta)
└── /panel (panel admin - inscripciones, postulaciones, solicitudes)
```

## 🧪 Cómo Probar el Flujo Completo

### 1. Cursos

1. **Navegar a cursos**: Click en "Cursos" en el menú
2. **Filtrar cursos**: Usar filtros por área, nivel, modalidad
3. **Ver detalle**: Click en "Ver detalles e inscribirse" en cualquier curso
4. **Inscribirse**:
   - Seleccionar edición
   - Completar formulario (nombre, apellido, email, teléfono)
   - Seleccionar método de pago
   - Click en "Confirmar inscripción"
   - ✅ Recibirás un número de inscripción (ej: LPY-2025-00123)
   - ✅ Se guarda en localStorage y se simula envío de correo

### 2. Especializaciones

1. **Navegar**: Click en "Especializaciones" en el menú
2. **Filtrar**: Usar filtros disponibles
3. **Ver detalles**: Click en "Ver detalles" (página de detalle pendiente)

### 3. Certificaciones

1. **Navegar**: Click en "Certificaciones" en el menú
2. **Verificar certificado**:
   - Ingresar código (ej: LPY-LIT-2025-00123)
   - Click en "Verificar certificado"
   - ✅ Ver resultado de verificación
3. **Ver programas**: Revisar catálogo de certificaciones disponibles

### 4. Pasantías

1. **Navegar**: Click en "Pasantías" en el menú
2. **Ver pasantías disponibles**: Revisar listado
3. **Postular**:
   - Click en "Postular ahora" en una pasantía
   - Completar formulario completo
   - Subir CV (simulado)
   - Click en "Enviar postulación"
   - ✅ Recibirás número de solicitud (ej: LPY-PAS-2025-00123)
   - ✅ Se guarda en localStorage y se simula envío de correo

### 5. Capacitación Empresas

1. **Navegar**: Ir a `/capacitacion-empresas`
2. **Seleccionar tipo**: Profesional / Empresa / Estudiante
3. **Completar formulario**:
   - Datos de contacto
   - Área de interés
   - Modalidad
   - Objetivos
   - (Opcional) Fecha deseada, presupuesto
4. **Solicitar propuesta**:
   - Click en "Solicitar propuesta"
   - ✅ Recibirás número de solicitud (ej: LPY-CAP-2025-00123)
   - ✅ Se simula generación de propuesta PDF y envío por email

### 6. Panel Admin

1. **Navegar**: Ir a `/panel`
2. **Ver inscripciones**: Tab "Inscripciones" muestra todas las inscripciones a cursos
3. **Ver postulaciones**: Tab "Postulaciones" muestra todas las postulaciones a pasantías
4. **Ver solicitudes**: Tab "Solicitudes" muestra todas las solicitudes de capacitación

## 📊 Datos Mock

Todos los datos están en `lib/educacion-data.ts`:
- `mockDocentes`: 5 docentes con perfiles completos
- `mockCursos`: 5 cursos completos con temarios y ediciones
- `mockEspecializaciones`: 8 especializaciones
- `mockCertificaciones`: 2 programas de certificación
- `mockPasantias`: 3 pasantías disponibles

## 💾 Almacenamiento

Los formularios guardan datos en `localStorage`:
- `inscripcionesCursos`: Array de inscripciones a cursos
- `postulacionesPasantias`: Array de postulaciones a pasantías
- `solicitudesCapacitacion`: Array de solicitudes de capacitación

## ✉️ Simulación de Correos

Todos los envíos de correo se simulan en la consola del navegador:
- Abrir DevTools (F12)
- Ver pestaña "Console"
- Al enviar formularios, verás logs como:
  ```
  📧 Correo simulado enviado a: usuario@email.com
  📧 Asunto: Confirmación de inscripción - Curso X
  📧 Contenido: Tu número de inscripción es: LPY-2025-00123
  ```

## 🎯 Funcionalidades Implementadas

✅ Todos los botones y CTAs son funcionales
✅ Formularios con validación completa
✅ Generación de números de solicitud únicos
✅ Almacenamiento en localStorage (simulado)
✅ Simulación de envío de correos
✅ Panel admin para ver todos los registros
✅ Filtros y búsqueda en todas las páginas
✅ Responsive design
✅ Accesibilidad básica (labels, aria)

## 🚀 Próximos Pasos (Opcional)

- [ ] Páginas de detalle para especializaciones
- [ ] Sistema de descarga real de brochures
- [ ] Calendario de eventos
- [ ] Sistema de notificaciones
- [ ] Exportación de datos del panel admin
