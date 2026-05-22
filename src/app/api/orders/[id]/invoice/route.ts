import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido. Use PDF, JPG, PNG o WebP" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "pdf";
    const filename = `boleta-${params.id}-${Date.now()}.${ext}`;

    const dirs = [
      path.join(process.cwd(), "public", "invoices"),
      "/home/kitpanel/public_html/nexofarma.cl/invoices",
    ];

    for (const dir of dirs) {
      try {
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), buffer);
      } catch (e) {
        console.error(`Failed to write to ${dir}:`, e);
      }
    }

    return NextResponse.json({ path: `/invoices/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Invoice upload error:", error);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
