import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/apiAuth";

// Validar RUT chileno
function validarRut(rut: string): boolean {
  const cleaned = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const expected = 11 - (sum % 11);
  const dvExpected = expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  return dv === dvExpected;
}

// Formatear RUT
function formatRut(rut: string): string {
  const cleaned = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

// POST - Registrar nuevo socio
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { nombre, rut, telefono, email, direccion } = data;

    // Validaciones
    if (!nombre || !rut || !telefono || !email || !direccion) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (!validarRut(rut)) {
      return NextResponse.json(
        { error: "El RUT ingresado no es válido" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido" },
        { status: 400 }
      );
    }

    const rutFormatted = formatRut(rut);

    // Check si ya existe
    const existing = await prisma.socio.findFirst({
      where: {
        OR: [{ rut: rutFormatted }, { email: email.toLowerCase() }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un socio registrado con ese RUT o correo electrónico" },
        { status: 409 }
      );
    }

    const socio = await prisma.socio.create({
      data: {
        nombre: nombre.trim(),
        rut: rutFormatted,
        telefono: telefono.trim(),
        email: email.toLowerCase().trim(),
        direccion: direccion.trim(),
      },
    });

    return NextResponse.json(
      { message: "¡Registro exitoso! Ya eres socio de NexoFarma.", socio },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar socio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Listar socios (admin)
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { nombre: { contains: search } },
            { rut: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [socios, total] = await Promise.all([
      prisma.socio.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.socio.count({ where }),
    ]);

    return NextResponse.json({ socios, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error al obtener socios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
