# Sistema de Derivación Priorizada por Perfil Técnico (DPT) - Legal PY

## 📋 Resumen

Sistema ético de derivación de casos internacionales basado en perfil técnico, especialidad y experiencia. 
**NO hay subastas ni competencia económica.** El proceso es transparente, profesional y respetuoso de códigos éticos del ejercicio jurídico.

Proceso: GEP Gold (evaluación prioritaria) → Tier Premium → Tier Standard

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/international.ts`)

- **InternationalCase**: Extensión de `Case` con campos internacionales y perfil técnico
- **CaseJurisdiction**: `"nacional" | "internacional"`
- **InternationalCaseStatus**: Estados del embudo ético
  - `"pendiente_revision"` | `"en_embudo"` | `"en_evaluacion_gep"` | `"asignado_gep"` | `"asignado_consorcio_tier_premium"` | `"asignado_consorcio_tier_standard"` | `"rechazado"` | `"completado"`
- **AssignmentType**: `"gep_gold" | "consorcio_tier_premium" | "consorcio_tier_standard"` (sin subastas)
- **CaseTechnicalProfile**: Perfil técnico del caso (categoría, complejidad, especialidades, jurisdicción)
- **DerivationStatus**: Estado de derivación ética con razón y coincidencias
- **GEPConfiguration**: Configuración GEP (prioridad, ventana de evaluación)
- **LegalConsortium**: Información de consorcios legales con tier (premium/standard)

### Funciones de Gestión (`/lib/international.ts`)

**Clasificación:**
- `isInternationalCase()`: Determina si un caso es internacional
- `createInternationalCase()`: Convierte un caso a internacional con perfil técnico

**Derivación Ética:**
- `sendToGEPGold()`: Deriva caso a GEP Gold (evaluación prioritaria de 48h)
- `processGEPGoldResponse()`: Procesa respuesta de GEP Gold
- `deriveToTierPremium()`: Deriva caso a Consorcios Tier Premium según perfil técnico
- `deriveToTierStandard()`: Deriva caso a Consorcios Tier Standard según perfil técnico
- `processConsortiumResponse()`: Procesa respuesta de consorcio (Tier Premium o Standard)

**Consultas:**
- `getAllInternationalCases()`: Obtiene todos los casos internacionales
- `getInternationalCaseById()`: Obtiene caso por ID
- `getInternationalCases()`: Obtiene casos con filtros
- `getTop5Consortia()`: Obtiene todos los consorcios
- `getTierPremiumConsortia()`: Obtiene consorcios Tier Premium
- `getTierStandardConsortia()`: Obtiene consorcios Tier Standard
- `getConsortiumById()`: Obtiene consorcio por ID

### Componentes (`/components/International/`)

1. **InternationalCaseCard.tsx**: Tarjeta de caso internacional con información de derivación técnica
2. **FunnelView.tsx**: Vista del embudo ético (GEP Gold → Tier Premium → Tier Standard)
3. **InternationalCaseForm.tsx**: Formulario para convertir caso a internacional con perfil técnico

## 🔐 Flujos Implementados

### 1. Clasificación de Casos

```
Criterios para caso internacional:
1. Monto estimado >= USD 5,000
2. Múltiples países involucrados
3. Tags o indicadores internacionales

Si cumple criterios → Se puede convertir a internacional
Se crea perfil técnico: categoría, complejidad, especialidades requeridas
```

### 2. Embudo de Derivación Ética

#### Paso 1: GEP Gold (Evaluación Prioritaria)

```
1. Caso se deriva a GEP Gold según perfil técnico
2. Ventana exclusiva de 48 horas para evaluación
3. GEP Gold puede:
   - Aceptar → Caso asignado
   - Declinar → Pasa a Paso 2
4. Si acepta, caso queda asignado
5. Proceso basado en coincidencia de perfil técnico, NO en precio
```

#### Paso 2: Consorcios Tier Premium

```
1. Si GEP Gold declina, caso se deriva automáticamente a Tier Premium
2. Derivación basada en coincidencia de:
   - Especialidades legales
   - Jurisdicción
   - Experiencia documentada
3. Cada consorcio puede:
   - Aceptar → Caso asignado al primero que acepte
   - Declinar → Continúa con otros consorcios
4. Si todos declinan → Pasa a Paso 3
5. NO hay competencia económica, solo coincidencia técnica
```

#### Paso 3: Consorcios Tier Standard

```
1. Si Tier Premium declina, caso se deriva a Tier Standard
2. Mismo criterio de coincidencia técnica
3. Si todos declinan → Caso marcado como rechazado
4. NO hay subastas, NO hay pujas, NO hay competencia por precio
```

### 3. Perfil Técnico del Caso

Cada caso internacional tiene un perfil técnico que incluye:

- **Categoría**: Tipo de caso legal (ej: "Derecho Corporativo", "Arbitraje Internacional")
- **Nivel de Complejidad**: `"baja" | "media" | "alta" | "muy_alta"`
- **Jurisdicción**: Países involucrados
- **Especialidades Requeridas**: Lista de especialidades legales necesarias
- **Experiencia Mínima**: Años de experiencia requeridos (opcional)

La derivación se basa en la coincidencia de estos factores con los perfiles de GEP Gold y consorcios.

## 🗄️ Almacenamiento (localStorage)

### Keys utilizadas:

- `legal-py-international-cases`: Array de casos internacionales

### Estructura de datos:

```typescript
{
  ...Case, // Todos los campos de Case
  jurisdiction: "internacional",
  isInternational: true,
  estimatedAmount: 10000,
  currency: "USD",
  minimumAmount: 5000,
  internationalStatus: "en_evaluacion_gep",
  assignmentType: "gep_gold",
  technicalProfile: {
    categoria: "Derecho Corporativo",
    nivelComplejidad: "alta",
    jurisdiccion: ["Paraguay", "Argentina"],
    especialidadesRequeridas: ["Fusiones y Adquisiciones", "Compliance"]
  },
  derivationStatus: {
    estado: "en_evaluacion_gep",
    fechaDerivacion: "2024-01-15T10:00:00Z",
    razonDerivacion: "Derivación prioritaria según perfil técnico",
    perfilTecnicoCoincidente: ["Especialidad en Fusiones y Adquisiciones"]
  },
  gepConfiguration: {
    prioridad: true,
    ventanaEvaluacion: 48
  },
  countriesInvolved: ["Paraguay", "Argentina"],
  languagesRequired: ["Español", "Inglés"],
  complexity: "alta",
  urgency: "normal"
}
```

## 🎨 Características UI

- ✅ Clasificación automática de casos
- ✅ Formulario de conversión a internacional con perfil técnico
- ✅ Vista del embudo ético paso a paso
- ✅ Información de derivación técnica visible
- ✅ Tarjetas de casos internacionales con perfil técnico
- ✅ Filtros por estado, monto, países, complejidad
- ✅ Estadísticas de casos internacionales
- ✅ Consorcios con información detallada y tier
- ✅ Badges de "Evaluación Prioritaria" para GEP
- ✅ Indicadores de coincidencia de perfil técnico

## 🔑 Consorcios Legales

### Tier Premium:
1. **Global Legal Alliance** - 40+ países, ⭐ 4.9
2. **International Law Partners** - Comercio internacional, ⭐ 4.8
3. **Latin American Legal Network** - Especializado en LATAM, ⭐ 4.7

### Tier Standard:
4. **Transatlantic Legal Group** - Europa-LATAM, ⭐ 4.8
5. **Pacific Rim Legal Consortium** - Asia-Pacífico, ⭐ 4.6

Cada consorcio tiene:
- Países de operación
- Especialidades legales
- Rating y casos completados
- Tasa de éxito
- Tier (premium/standard)
- Información de contacto

## 📅 Monto Mínimo

**USD 5,000** - Todos los casos internacionales deben tener un monto estimado de al menos USD 5,000.

## ⚖️ Principios Éticos

1. **NO hay subastas**: La derivación se basa exclusivamente en perfil técnico
2. **NO hay competencia económica**: No se puja por casos
3. **Transparencia**: El proceso de derivación es visible y explicado
4. **Coincidencia técnica**: Se deriva según especialidad, experiencia y jurisdicción
5. **Respeto a códigos éticos**: El sistema respeta los estándares profesionales del ejercicio jurídico

## 🧪 Testing/Demo

### Convertir caso a internacional:

```typescript
import { createInternationalCase } from "@/lib/international";
import { getCaseById } from "@/lib/cases";

const caseData = getCaseById("LPY-123");
const response = await createInternationalCase(caseData, {
  caseId: caseData.id,
  estimatedAmount: 10000,
  countriesInvolved: ["Paraguay", "Argentina"],
  languagesRequired: ["Español", "Inglés"],
  complexity: "alta",
  urgency: "normal",
  categoria: "Derecho Corporativo",
  especialidadesRequeridas: ["Fusiones y Adquisiciones", "Compliance"]
});
```

### Derivar a GEP Gold:

```typescript
import { sendToGEPGold } from "@/lib/international";

await sendToGEPGold("LPY-123");
```

### Procesar respuesta GEP Gold:

```typescript
import { processGEPGoldResponse } from "@/lib/international";

await processGEPGoldResponse({
  caseId: "LPY-123",
  response: "aceptado", // o "declinado"
  notes: "Aceptamos el caso según nuestro perfil técnico"
});
```

### Derivar a Tier Premium:

```typescript
import { deriveToTierPremium } from "@/lib/international";

await deriveToTierPremium("LPY-123");
```

## ⚠️ Notas de Seguridad

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Validar permisos de GEP Gold
- Notificaciones reales a consorcios
- Encriptación de información sensible
- Auditoría completa del embudo
- Validación de perfiles técnicos
- Control de acceso por roles
- Verificación de coincidencias de perfil técnico

## 📚 Uso en Componentes

```typescript
import { 
  getAllInternationalCases,
  sendToGEPGold,
  deriveToTierPremium
} from "@/lib/international";
import InternationalCaseCard from "@/components/International/InternationalCaseCard";
import FunnelView from "@/components/International/FunnelView";

// Obtener casos
const cases = getAllInternationalCases();

// Mostrar tarjeta
<InternationalCaseCard caseData={case} />

// Mostrar embudo ético
<FunnelView caseData={case} onUpdate={loadCases} />
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Clasificación nacional/internacional
- [x] Monto mínimo USD 5,000
- [x] Sistema de derivación ética (GEP Gold)
- [x] Sistema de derivación ética (Tier Premium)
- [x] Sistema de derivación ética (Tier Standard)
- [x] Perfil técnico del caso
- [x] Estado de derivación con razón
- [x] Componente InternationalCaseCard
- [x] Componente FunnelView
- [x] Componente InternationalCaseForm
- [x] Página de casos internacionales
- [x] Consorcios con tier (premium/standard)
- [x] Filtros y búsqueda
- [x] Estadísticas
- [x] Eliminación completa de subastas
- [x] Textos éticos y profesionales

---

**Estado**: ✅ Completado - Sistema ético de derivación implementado

**Nota**: El sistema de derivación es ético y profesional. NO hay subastas, NO hay pujas, NO hay competencia económica. La derivación se basa exclusivamente en coincidencia de perfil técnico, especialidad y experiencia.
