import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "legal-py-session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días
const isProd = process.env.NODE_ENV === "production";

/**
 * POST /api/auth/session
 * Sincroniza la sesión cliente (localStorage) con una cookie httpOnly
 * para que el middleware pueda verificar autenticación en rutas protegidas.
 * El middleware solo comprueba existencia de la cookie; los datos de sesión
 * siguen en localStorage para uso en cliente.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = body?.session;

    if (!session?.user?.id || typeof session.user.id !== "string") {
      return NextResponse.json(
        { success: false, error: "Sesión inválida" },
        { status: 400 }
      );
    }

    const expiresAt = session.expiresAt;
    if (expiresAt) {
      const exp = new Date(expiresAt).getTime();
      if (Number.isNaN(exp) || exp < Date.now()) {
        return NextResponse.json(
          { success: false, error: "Sesión expirada" },
          { status: 400 }
        );
      }
    }

    const value = Buffer.from(
      JSON.stringify({
        userId: session.user.id,
        exp: expiresAt || new Date(Date.now() + COOKIE_MAX_AGE * 1000).toISOString(),
      })
    ).toString("base64url");

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, value, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error al establecer sesión" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Borra la cookie de sesión (logout). El cliente debe llamar además a clearSession()
 * para limpiar localStorage.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
