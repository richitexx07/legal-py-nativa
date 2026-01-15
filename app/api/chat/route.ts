import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sos el asistente de LegalPy.
- Respondé en español, claro y profesional.
- Si el usuario pide rastrear/ubicar a alguien por GPS sin permiso: explicá que no se puede.
- Si falta info, pedí lo mínimo necesario.
- Ofrecé pasos concretos y ejemplos.`;

interface ChatRequest {
  messages?: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  userContext?: Record<string, any>;
}

/**
 * Bot basado en reglas que intercepta mensajes comunes antes de llamar a OpenAI.
 * @param text - Texto del mensaje del usuario (normalizado a minúsculas)
 * @returns Respuesta predefinida o null si no coincide con ninguna regla
 */
function ruleBot(text: string): string | null {
  const t = (text || "").toLowerCase();

  if (t.includes("precio") || t.includes("costo") || t.includes("valor")) {
    return "Pasame el curso o servicio que te interesa y te envío precios y formas de pago.";
  }

  if (t.includes("whatsapp") || t.includes("contacto")) {
    return "Podés escribirnos directamente por WhatsApp: https://wa.me/595XXXXXXXXX";
  }

  if (t.includes("horario") || t.includes("horarios")) {
    return "Nuestros horarios de atención son de lunes a viernes, de 9:00 a 18:00.";
  }

  if (t.includes("inscripción") || t.includes("inscribirme")) {
    return "Decime a qué curso o servicio querés inscribirte y te paso los pasos.";
  }

  return null;
}

/**
 * Mensaje de fallback cuando OpenAI no está disponible
 */
function fallbackMessage(): string {
  return (
    "🤖 El asistente inteligente de LegalPy no está activo en este momento.\n\n" +
    "Pero igual puedo ayudarte con:\n" +
    "• Precios y formas de pago\n" +
    "• Contacto por WhatsApp\n" +
    "• Horarios de atención\n" +
    "• Inscripciones y servicios\n\n" +
    "👉 Decime qué necesitás (por ejemplo: \"precio\", \"whatsapp\", \"horarios\")."
  );
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body: ChatRequest = await request.json().catch(() => ({}));
    const { messages, userContext } = body || {};
    const lastUserText = messages?.at(-1)?.content || "";

    // 1) Router: respuestas por reglas (gratis)
    const rb = ruleBot(lastUserText);
    if (rb) {
      return NextResponse.json({
        text: rb,
        routed: "rulebot",
        ok: true,
      });
    }

    // 2) Si no hay API Key -> fallback inmediato
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        text: fallbackMessage(),
        routed: "fallback",
        ok: false,
        reason: "NO_API_KEY",
      });
    }

    // 3) Personalidad del asistente
    const system = SYSTEM_PROMPT;

    // 4) Payload para OpenAI Responses API
    const payload = {
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: system },
        ...(Array.isArray(messages) ? messages : []),
      ],
      metadata: { userContext: userContext || {} },
    };

    // 5) Llamada a OpenAI
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // 6) Si OpenAI responde con error -> fallback
    if (!r.ok) {
      const errText = await r.text();
      console.error("OpenAI error:", errText);

      return NextResponse.json({
        text: fallbackMessage(),
        routed: "fallback",
        ok: false,
        reason: "OPENAI_ERROR",
      });
    }

    const data = await r.json();

    // 7) Extraer texto de la respuesta (compatible con varios formatos)
    const text =
      data.output_text ||
      (Array.isArray(data.output)
        ? data.output
            .map((x: any) =>
              Array.isArray(x.content)
                ? x.content.map((c: any) => c.text || "").join("")
                : ""
            )
            .join("")
        : "");

    return NextResponse.json({
      text: text || "No se pudo generar una respuesta.",
      routed: "openai",
      ok: true,
    });
  } catch (e) {
    console.error("Server error:", e);
    return NextResponse.json({
      text: fallbackMessage(),
      routed: "fallback",
      ok: false,
      reason: "SERVER_ERROR",
    });
  }
}
