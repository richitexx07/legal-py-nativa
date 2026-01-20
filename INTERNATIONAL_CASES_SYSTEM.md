# Sistema de Filtrado de Casos Internacionales - Legal PY

## 📋 Resumen

Sistema completo de gestión de casos internacionales con embudo de asignación (GEP Gold → Top 5 Consorcios → Subasta) y monto mínimo de USD 5,000.

## 🏗️ Arquitectura

### Tipos TypeScript (`/lib/international.ts`)

- **InternationalCase**: Extensión de `Case` con campos internacionales
- **CaseJurisdiction**: `"nacional" | "internacional"`
- **InternationalCaseStatus**: Estados del embudo
- **AssignmentType**: `"gep_gold" | "consorcio" | "subasta"`
- **LegalConsortium**: Información de consorcios legales
- **AuctionBid**: Ofertas en subasta

### Funciones de Gestión (`/lib/international.ts`)

**Clasificación:**
- `isInternationalCase()`: Determina si un caso es internacional
- `createInternationalCase()`: Convierte un caso a internacional

**Embudo:**
- `sendToGEPGold()`: Envía caso a GEP Gold
- `processGEPGoldResponse()`: Procesa respuesta de GEP Gold
- `sendToTop5Consortia()`: Envía caso a Top 5 Consorcios
- `processConsortiumResponse()`: Procesa respuesta de consorcio

**Subasta:**
- `startAuction()`: Inicia subasta de caso
- `submitAuctionBid()`: Envía oferta en subasta
- `selectAuctionWinner()`: Selecciona ganador de subasta

**Consultas:**
- `getAllInternationalCases()`: Obtiene todos los casos internacionales
- `getInternationalCaseById()`: Obtiene caso por ID
- `getInternationalCases()`: Obtiene casos con filtros
- `getTop5Consortia()`: Obtiene Top 5 consorcios
- `getConsortiumById()`: Obtiene consorcio por ID

### Componentes (`/components/International/`)

1. **InternationalCaseCard.tsx**: Tarjeta de caso internacional
2. **FunnelView.tsx**: Vista del embudo (GEP Gold + Top 5)
3. **AuctionView.tsx**: Vista de subasta con ofertas
4. **InternationalCaseForm.tsx**: Formulario para convertir caso a internacional

## 🔐 Flujos Implementados

### 1. Clasificación de Casos

```
Criterios para caso internacional:
1. Monto estimado >= USD 5,000
2. Múltiples países involucrados
3. Tags o indicadores internacionales

Si cumple criterios → Se puede convertir a internacional
```

### 2. Embudo de Asignación

#### Paso 1: Socio GEP Gold
```
1. Caso se envía a GEP Gold
2. GEP Gold puede:
   - Aceptar → Caso asignado
   - Declinar → Pasa a Paso 2
3. Si acepta, caso queda asignado
```

#### Paso 2: Top 5 Consorcios
```
1. Si GEP Gold declina, caso se envía a Top 5 Consorcios
2. Cada consorcio puede:
   - Aceptar → Caso asignado al primero que acepte
   - Declinar → Continúa con otros consorcios
3. Si todos declinan → Pasa a Paso 3
```

#### Paso 3: Subasta
```
1. Si todos declinan, se inicia subasta
2. Consorcios pueden enviar ofertas:
   - Monto
   - Tarifa propuesta (%)
   - Tiempo estimado
   - Notas
3. Admin selecciona ganador
4. Caso asignado al ganador
```

### 3. Subasta de Casos (UI Demo)

```
1. Subasta se inicia automáticamente si:
   - GEP Gold declina
   - Todos los consorcios declinan
2. Duración: 7 días (configurable)
3. Consorcios pueden:
   - Ver detalles del caso
   - Enviar ofertas
   - Ver otras ofertas (después de enviar)
4. Admin puede:
   - Ver todas las ofertas
   - Seleccionar ganador
5. Ofertas ordenadas por monto (mayor a menor)
```

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
  internationalStatus: "en_subasta",
  assignmentType: "subasta",
  gepGoldEligible: true,
  top5ConsortiaEligible: true,
  auctionEligible: true,
  countriesInvolved: ["Paraguay", "Argentina"],
  languagesRequired: ["Español", "Inglés"],
  complexity: "alta",
  urgency: "normal",
  auctionBids: [...]
}
```

## 🎨 Características UI

- ✅ Clasificación automática de casos
- ✅ Formulario de conversión a internacional
- ✅ Vista del embudo paso a paso
- ✅ Interfaz de subasta con ofertas
- ✅ Tarjetas de casos internacionales
- ✅ Filtros por estado, monto, países
- ✅ Estadísticas de casos internacionales
- ✅ Top 5 Consorcios con información detallada

## 🔑 Top 5 Consorcios Legales

1. **Global Legal Alliance** - 40+ países, ⭐ 4.9
2. **International Law Partners** - Comercio internacional, ⭐ 4.8
3. **Latin American Legal Network** - Especializado en LATAM, ⭐ 4.7
4. **Transatlantic Legal Group** - Europa-LATAM, ⭐ 4.8
5. **Pacific Rim Legal Consortium** - Asia-Pacífico, ⭐ 4.6

Cada consorcio tiene:
- Países de operación
- Especialidades legales
- Rating y casos completados
- Tasa de éxito
- Información de contacto

## 📅 Monto Mínimo

**USD 5,000** - Todos los casos internacionales deben tener un monto estimado de al menos USD 5,000.

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
  urgency: "normal"
});
```

### Enviar a GEP Gold:

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
  notes: "Aceptamos el caso"
});
```

### Enviar oferta en subasta:

```typescript
import { submitAuctionBid } from "@/lib/international";

await submitAuctionBid({
  caseId: "LPY-123",
  consortiumId: "cons_1",
  amount: 12000,
  proposedFee: 15,
  estimatedTime: "3-6 meses",
  notes: "Tenemos experiencia en casos similares"
});
```

## ⚠️ Notas de Seguridad

**Este es un sistema MOCK para desarrollo/demo**. En producción se debe:

- Validar permisos de GEP Gold
- Notificaciones reales a consorcios
- Encriptación de información sensible
- Auditoría completa del embudo
- Límites de tiempo en subastas
- Validación de ofertas
- Control de acceso por roles

## 📚 Uso en Componentes

```typescript
import { 
  getAllInternationalCases,
  sendToGEPGold,
  submitAuctionBid 
} from "@/lib/international";
import InternationalCaseCard from "@/components/International/InternationalCaseCard";
import FunnelView from "@/components/International/FunnelView";
import AuctionView from "@/components/International/AuctionView";

// Obtener casos
const cases = getAllInternationalCases();

// Mostrar tarjeta
<InternationalCaseCard caseData={case} />

// Mostrar embudo
<FunnelView caseData={case} onUpdate={loadCases} />

// Mostrar subasta
<AuctionView caseData={case} onUpdate={loadCases} isAdmin={true} />
```

## ✅ Checklist de Implementación

- [x] Tipos TypeScript completos
- [x] Clasificación nacional/internacional
- [x] Monto mínimo USD 5,000
- [x] Sistema de embudo (GEP Gold)
- [x] Sistema de embudo (Top 5 Consorcios)
- [x] Sistema de subasta (UI demo)
- [x] Componente InternationalCaseCard
- [x] Componente FunnelView
- [x] Componente AuctionView
- [x] Componente InternationalCaseForm
- [x] Página de casos internacionales
- [x] Top 5 Consorcios con datos mock
- [x] Filtros y búsqueda
- [x] Estadísticas

---

**Estado**: ✅ Completado - Listo para desarrollo/demo

**Nota**: El sistema de subasta es una UI demo. En producción se requerirían notificaciones reales, validaciones más estrictas, y control de acceso por roles.
