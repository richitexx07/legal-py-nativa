import { NextRequest, NextResponse } from "next/server";

/**
 * System Prompt estricto para Justo/Victoria
 * Define el comportamiento operativo y los límites legales
 */
const SYSTEM_PROMPT = `Eres Justo/Victoria, un asistente operativo de Legal PY.

TU MISIÓN:
1. Escuchar el problema del usuario y CLASIFICARLO (Civil, Penal, Niñez, Corporativo, Académico).
2. GUIAR al usuario para llenar los formularios de la plataforma. Extrae datos clave (Monto, Ubicación, Tipo de Caso) y devuélvelos en formato JSON para que el Frontend los use.
3. RECOMENDAR servicios específicos (Abogados, Escribanos, Cursos).

LÍMITES LEGALES (CRÍTICO):
- NO eres abogado. NO das consejos legales, ni interpretas leyes, ni predices sentencias.
- Si te piden consejo legal, responde: 'Como IA operativa, no puedo dar consejo legal, pero te conectaré ahora mismo con un experto en esa área.'
- Sé empático, profesional y usa principios de neuroventas (seguridad, rapidez, ahorro de energía).

FORMATO DE RESPUESTA:
- Cuando extraigas datos del usuario, devuélvelos en formato JSON estructurado.
- Ejemplo: {"classification": "Corporativo", "data": {"monto": 5000000, "ubicacion": "Asunción", "tipoCaso": "Constitución de EAS"}}
- Si no hay datos extraídos, responde solo con texto natural.

Responde siempre en español, de forma clara y profesional.`;

interface AssistantRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  assistantName?: "justo" | "victoria"; // Para personalización futura
  userId?: string; // Para verificación de permisos
}

/**
 * Clasifica el problema del usuario en categorías legales
 */
function classifyProblem(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("corporativo") || lowerText.includes("empresa") || lowerText.includes("eas") || lowerText.includes("inversión")) {
    return "Corporativo";
  }
  if (lowerText.includes("penal") || lowerText.includes("delito") || lowerText.includes("crimen")) {
    return "Penal";
  }
  if (lowerText.includes("niñez") || lowerText.includes("menor") || lowerText.includes("infancia")) {
    return "Niñez";
  }
  if (lowerText.includes("civil") || lowerText.includes("contrato") || lowerText.includes("propiedad")) {
    return "Civil";
  }
  if (lowerText.includes("académico") || lowerText.includes("universidad") || lowerText.includes("estudiante")) {
    return "Académico";
  }
  
  return "General";
}

/**
 * Extrae datos estructurados del mensaje del usuario
 */
function extractStructuredData(text: string, classification: string): Record<string, any> {
  const data: Record<string, any> = {};
  const lowerText = text.toLowerCase();
  
  // Extraer monto (buscar números seguidos de "gs", "guaraníes", etc.)
  const montoMatch = text.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(?:gs|guaraníes|guaranies)/i);
  if (montoMatch) {
    data.monto = parseInt(montoMatch[1].replace(/\./g, "").replace(",", "."));
  }
  
  // Extraer ubicación (ciudades comunes de Paraguay)
  const ciudades = ["asunción", "asuncion", "ciudad del este", "encarnación", "encarnacion", "luque", "san lorenzo", "lambaré", "lambare", "fernando de la mora"];
  for (const ciudad of ciudades) {
    if (lowerText.includes(ciudad)) {
      data.ubicacion = ciudad.charAt(0).toUpperCase() + ciudad.slice(1);
      break;
    }
  }
  
  // Extraer tipo de caso según clasificación
  if (classification === "Corporativo") {
    if (lowerText.includes("eas") || lowerText.includes("empresa")) {
      data.tipoCaso = "Constitución de EAS";
    } else if (lowerText.includes("inversión") || lowerText.includes("inversion")) {
      data.tipoCaso = "Inversión Extranjera";
    }
  } else if (classification === "Penal") {
    data.tipoCaso = "Asesoría Penal";
  } else if (classification === "Civil") {
    data.tipoCaso = "Asesoría Civil";
  }
  
  return data;
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body: AssistantRequest = await request.json();
    const { messages, assistantName = "justo", userId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Verificar API Key de OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured",
          message: "El servicio de asistente no está disponible en este momento."
        },
        { status: 503 }
      );
    }

    // Obtener el último mensaje del usuario
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    const userText = lastUserMessage?.content || "";

    // Clasificar el problema
    const classification = classifyProblem(userText);
    
    // Extraer datos estructurados
    const extractedData = extractStructuredData(userText, classification);

    // Preparar mensajes para OpenAI (usar Chat Completions API estándar)
    const openAIMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...messages.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ];

    // Llamada a OpenAI Chat Completions API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Modelo más económico y rápido
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "text" }, // Permitir JSON cuando sea necesario
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      
      return NextResponse.json(
        {
          error: "OpenAI API error",
          message: "No se pudo procesar tu solicitud. Por favor, intenta nuevamente.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "No se pudo generar una respuesta.";

    // Intentar parsear JSON si la respuesta contiene datos estructurados
    let structuredData = null;
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structuredData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Si no hay JSON, usar los datos extraídos automáticamente
      if (Object.keys(extractedData).length > 0) {
        structuredData = {
          classification,
          data: extractedData,
        };
      }
    }

    return NextResponse.json({
      text: assistantResponse,
      classification,
      structuredData: structuredData || (Object.keys(extractedData).length > 0 ? { classification, data: extractedData } : null),
      assistant: assistantName,
      ok: true,
    });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Ocurrió un error al procesar tu solicitud.",
      },
      { status: 500 }
    );
  }
}
