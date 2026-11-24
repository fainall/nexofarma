import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { clientIp, hit } from "@/lib/rateLimit";
import { securityHeaders } from "@/lib/securityHeaders";

/**
 * Rutas de API que son exclusivamente de administración.
 * Se bloquean por completo aquí, además del control que hace cada handler.
 */
const ADMIN_API_PREFIXES = [
  "/api/mensajes",
  "/api/upload",
  "/api/fix-images",
  "/api/products/bulk",
  "/api/socios/bulk",
];

/**
 * Límites para envíos públicos (POST), por IP: [ruta, intentos, ventana en minutos].
 * El login también queda limitado aquí; el bloqueo por cuenta está en lib/auth.ts.
 */
const POST_LIMITS: [string, number, number][] = [
  ["/api/auth/callback/credentials", 5, 15],
  ["/api/contact", 5, 10],
  ["/api/newsletter", 5, 10],
  ["/api/socios", 5, 10],
  ["/api/orders", 10, 10],
  ["/api/chat", 30, 10],
];

export async function middleware(req: NextRequest) {
  const res = await handle(req);
  for (const { key, value } of securityHeaders) res.headers.set(key, value);
  return res;
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (req.method === "POST") {
    const rule = POST_LIMITS.find(([p]) => pathname === p);
    if (rule) {
      const [route, limit, minutes] = rule;
      const ip = clientIp(req.headers);
      // Sin IP identificable todos comparten un mismo contador: se le da más holgura.
      const max = ip === "sin-ip" ? limit * 10 : limit;
      const r = hit(`${route}|${ip}`, max, minutes * 60_000);
      if (!r.ok) {
        return NextResponse.json(
          { error: "Demasiados intentos. Intenta nuevamente en unos minutos." },
          { status: 429, headers: { "Retry-After": String(r.retryAfter) } }
        );
      }
    }
  }

  // Rutas públicas: solo pasan por el limitador
  if (!pathname.startsWith("/admin") && !ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req });
  const isAdmin = token?.role === "admin";

  // API de administración: responder 401 en JSON, no redirigir a una página
  if (ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Páginas del panel: redirigir al login conservando el destino
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAdmin) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Todas las rutas (para los encabezados de seguridad), salvo los archivos estáticos de Next
  matcher: ["/((?!_next/static|_next/image).*)"],
};
