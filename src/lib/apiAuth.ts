import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

/**
 * Exige una sesión de administrador válida.
 *
 * Devuelve `null` cuando la petición está autorizada, o la respuesta de error
 * que el handler debe retornar de inmediato cuando no lo está.
 *
 * Uso:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado" },
      { status: 403 }
    );
  }

  return null;
}
