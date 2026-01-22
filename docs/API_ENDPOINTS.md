# API Endpoints - Justo y Victoria

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```env
# OpenAI API Key (requerido para /api/assistant)
OPENAI_API_KEY=sk-...

# ElevenLabs API Key (requerido para /api/voice)
ELEVENLABS_API_KEY=...

# IDs de Voces de ElevenLabs (opcional, tienen valores por defecto)
ELEVENLABS_VOICE_JUSTO=pNInz6obpgDQGcFmaJgB
ELEVENLABS_VOICE_VICTORIA=EXAVITQu4vr4xnSDxMaL
```

## Endpoints

### POST `/api/assistant`

Endpoint para interactuar con el asistente operativo Justo/Victoria usando OpenAI.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Necesito constituir una EAS en Asunción con un presupuesto de 5.000.000 Gs"
    }
  ],
  "assistantName": "justo", // opcional: "justo" | "victoria"
  "userId": "user_123" // opcional: para tracking
}
```

**Response:**
```json
{
  "text": "Te ayudo con la constitución de EAS...",
  "classification": "Corporativo",
  "structuredData": {
    "classification": "Corporativo",
    "data": {
      "monto": 5000000,
      "ubicacion": "Asunción",
      "tipoCaso": "Constitución de EAS"
    }
  },
  "assistant": "justo",
  "ok": true
}
```

**Características:**
- Clasificación automática del problema (Civil, Penal, Niñez, Corporativo, Académico)
- Extracción automática de datos estructurados (Monto, Ubicación, Tipo de Caso)
- System prompt estricto que previene consejos legales
- Respuestas en formato JSON cuando se extraen datos

**Límites Legales:**
- El asistente NO da consejos legales
- Si se solicita consejo legal, responde: "Como IA operativa, no puedo dar consejo legal, pero te conectaré ahora mismo con un experto en esa área."

---

### POST `/api/voice`

Endpoint para generar audio de texto usando ElevenLabs (Text-to-Speech).

**Request Body:**
```json
{
  "text": "Hola, soy Justo, tu asistente operativo de Legal PY",
  "voiceId": "justo", // "justo" | "victoria"
  "userId": "user_123", // opcional
  "userTier": "PROFESSIONAL" // FREE, BASIC, PROFESSIONAL, ENTERPRISE, GEP
}
```

**Response:**
- Content-Type: `audio/mpeg`
- Stream de audio binario
- Headers adicionales:
  - `X-Voice-Id`: ID de la voz usada
  - `X-Assistant`: Nombre del asistente (Justo/Victoria)

**Permisos:**
- Solo usuarios con tier `BASIC` o superior pueden usar Voice Mode
- Usuarios `FREE` reciben error 403: "Upgrade required for Voice Mode"

**Voces Disponibles:**
- **Justo** (masculino): ID por defecto `pNInz6obpgDQGcFmaJgB` (Antoni)
- **Victoria** (femenino): ID por defecto `EXAVITQu4vr4xnSDxMaL` (Bella)

---

### GET `/api/voice`

Endpoint para verificar el estado del servicio de voz.

**Query Parameters:**
- `tier` (opcional): Tier del usuario para verificar permisos

**Response:**
```json
{
  "available": true,
  "configured": true,
  "hasPermission": true,
  "voices": {
    "justo": "pNInz6obpgDQGcFmaJgB",
    "victoria": "EXAVITQu4vr4xnSDxMaL"
  },
  "message": "Voice Mode está disponible"
}
```

---

## Ejemplo de Uso en Frontend

```typescript
// Llamar al asistente
const response = await fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Necesito ayuda con un caso corporativo' }],
    assistantName: 'justo',
    userId: currentUser.id,
  }),
});

const data = await response.json();
console.log(data.text); // Respuesta del asistente
console.log(data.structuredData); // Datos extraídos

// Generar audio
const audioResponse = await fetch('/api/voice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: data.text,
    voiceId: 'justo',
    userTier: currentUser.tier, // 'BASIC', 'PROFESSIONAL', etc.
  }),
});

const audioBlob = await audioResponse.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

---

## Notas de Seguridad

1. **API Keys**: Nunca expongas las API keys en el frontend. Solo úsalas en los endpoints del servidor.
2. **Permisos**: Siempre verifica el `userTier` antes de permitir el uso de Voice Mode.
3. **Rate Limiting**: Considera implementar rate limiting para prevenir abuso.
4. **Validación**: Valida y sanitiza todos los inputs del usuario antes de enviarlos a las APIs externas.
