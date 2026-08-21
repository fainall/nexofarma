import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
  matcher: [
    "/admin/:path*",
    "/api/mensajes/:path*",
    "/api/upload",
    "/api/fix-images",
    "/api/products/bulk",
    "/api/socios/bulk",
  ],
};
