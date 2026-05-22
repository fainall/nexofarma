import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

function formatRut(rut: string): string {
  const clean = cleanRut(rut);
  if (clean.length < 2) return rut;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

function validarRut(rut: string): boolean {
  const clean = cleanRut(rut);
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { socios } = body;

    if (!Array.isArray(socios) || socios.length === 0) {
      return NextResponse.json({ error: "No se recibieron datos" }, { status: 400 });
    }

    if (socios.length > 500) {
      return NextResponse.json({ error: "Máximo 500 registros por carga" }, { status: 400 });
    }

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < socios.length; i++) {
      const s = socios[i];
      const row = i + 1;

      if (!s.nombre || !s.rut || !s.telefono || !s.email || !s.direccion) {
        results.errors.push(`Fila ${row}: Faltan campos requeridos`);
        results.skipped++;
        continue;
      }

      if (!validarRut(s.rut)) {
        results.errors.push(`Fila ${row}: RUT inválido (${s.rut})`);
        results.skipped++;
        continue;
      }

      const rutFormatted = formatRut(s.rut);

      try {
        const existing = await prisma.socio.findFirst({
          where: { OR: [{ rut: rutFormatted }, { email: s.email.toLowerCase().trim() }] },
        });

        if (existing) {
          results.errors.push(`Fila ${row}: RUT o email ya registrado`);
          results.skipped++;
          continue;
        }

        await prisma.socio.create({
          data: {
            nombre: s.nombre.trim(),
            rut: rutFormatted,
            telefono: s.telefono.trim(),
            email: s.email.toLowerCase().trim(),
            direccion: s.direccion.trim(),
          },
        });
        results.created++;
      } catch {
        results.errors.push(`Fila ${row}: Error al crear registro`);
        results.skipped++;
      }
    }

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
