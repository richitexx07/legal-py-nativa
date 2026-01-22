import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rutas públicas (no requieren autenticación)
 * Permiten navegación libre en modo Demo
 */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/opportunities", // Solo lectura
  "/profesionales",
  "/pricing",
  "/legal-center",
  "/legal",
  "/login",
  "/register",
  "/career-center",
  "/cursos",
  "/especializaciones",
];

/**
 * Rutas protegidas (requieren autenticación)
 */
const PROTECTED_ROUTES = [
  "/panel",
  "/post-case",
  "/profile",
  "/security-center",
  "/casos",
  "/notificaciones",
  "/chat",
];

/**
 * Rutas críticas (requieren re-verificación biométrica)
 */
const CRITICAL_ROUTES = [
  "/subscribe",
  "/accept-case",
  "/pagos",
  "/pasantias/postular",
];

/**
 * Middleware de seguridad adaptativa
 * - Rutas públicas: Permitir acceso libre (modo Demo)
 * - Rutas protegidas: Requerir autenticación
 * - Rutas críticas: Requerir re-verificación biométrica
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir archivos estáticos y API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar si es ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar si es ruta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isCriticalRoute = CRITICAL_ROUTES.some(route => pathname.startsWith(route));

  // Obtener sesión del cookie o header (simulado)
  // En producción, esto se leería de un JWT o sesión del servidor
  const sessionCookie = request.cookies.get("legal-py-session");
  const hasSession = !!sessionCookie;

  // Si es ruta protegida o crítica y no hay sesión, redirigir a login
  if ((isProtectedRoute || isCriticalRoute) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es ruta crítica, agregar header para forzar re-verificación
  if (isCriticalRoute && hasSession) {
    const response = NextResponse.next();
    response.headers.set("X-Requires-Re-Verification", "true");
    return response;
  }

  // Permitir acceso normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
