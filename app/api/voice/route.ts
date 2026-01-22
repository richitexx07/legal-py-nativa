import { NextRequest, NextResponse } from "next/server";

/**
 * IDs de voces de ElevenLabs
 * Voces profesionales y latinas sugeridas
 */
const VOICE_IDS = {
  justo: process.env.ELEVENLABS_VOICE_JUSTO || "pNInz6obpgDQGcFmaJgB", // Antoni (masculino, profesional)
  victoria: process.env.ELEVENLABS_VOICE_VICTORIA || "EXAVITQu4vr4xnSDxMaL", // Bella (femenino, profesional)
};

/**
 * Verifica si el usuario tiene permisos para usar Voice Mode
 * @param userId - ID del usuario (opcional, puede venir del header o body)
 * @param userTier - Tier del usuario (FREE, BASIC, PROFESSIONAL, ENTERPRISE, GEP)
 * @returns true si tiene permisos, false si no
 */
function hasVoicePermission(userTier?: string): boolean {
  // Si no hay tier, asumir FREE (sin permisos)
  if (!userTier) {
    return false;
  }

  const tier = userTier.toUpperCase();
  
  // Solo usuarios con tier BASIC o superior pueden usar Voice Mode
  const allowedTiers = ["BASIC", "PROFESSIONAL", "ENTERPRISE", "GEP", "EMPRESARIAL"];
  
  return allowedTiers.includes(tier);
}

interface VoiceRequest {
  text: string;
  voiceId?: "justo" | "victoria";
  userId?: string;
  userTier?: string; // FREE, BASIC, PROFESSIONAL, ENTERPRISE, GEP
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body: VoiceRequest = await request.json();
    const { text, voiceId = "justo", userId, userTier } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Verificar permisos antes de llamar a ElevenLabs
    if (!hasVoicePermission(userTier)) {
      return NextResponse.json(
        {
          error: "Upgrade required for Voice Mode",
          message: "El modo de voz está disponible solo para usuarios con plan Basic o superior. Actualiza tu plan para acceder a esta funcionalidad.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Verificar API Key de ElevenLabs
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        {
          error: "ElevenLabs API key not configured",
          message: "El servicio de voz no está disponible en este momento.",
        },
        { status: 503 }
      );
    }

    // Obtener el ID de voz correspondiente
    const selectedVoiceId = VOICE_IDS[voiceId] || VOICE_IDS.justo;

    // Llamada a ElevenLabs Text-to-Speech API con streaming
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2", // Modelo multilingüe para español
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error("ElevenLabs API error:", errorText);
      
      return NextResponse.json(
        {
          error: "ElevenLabs API error",
          message: "No se pudo generar el audio. Por favor, intenta nuevamente.",
        },
        { status: elevenLabsResponse.status }
      );
    }

    // Obtener el audio como stream
    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    // Devolver el audio como stream
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
        "X-Voice-Id": voiceId,
        "X-Assistant": voiceId === "justo" ? "Justo" : "Victoria",
      },
    });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Ocurrió un error al generar el audio.",
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar el estado del servicio de voz
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userTier = searchParams.get("tier") || undefined;

  const hasPermission = hasVoicePermission(userTier);
  const isConfigured = !!process.env.ELEVENLABS_API_KEY;

  return NextResponse.json({
    available: isConfigured && hasPermission,
    configured: isConfigured,
    hasPermission,
    voices: {
      justo: VOICE_IDS.justo,
      victoria: VOICE_IDS.victoria,
    },
    message: hasPermission
      ? "Voice Mode está disponible"
      : "Upgrade required for Voice Mode",
  });
}
