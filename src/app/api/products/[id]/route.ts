import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, description, price, comparePrice, categoryId, stock, featured, active, image } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseInt(price);
    if (comparePrice !== undefined) data.comparePrice = comparePrice ? parseInt(comparePrice) : null;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (featured !== undefined) data.featured = featured;
    if (active !== undefined) data.active = active;
    if (image !== undefined) data.image = image;

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Producto eliminado" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
