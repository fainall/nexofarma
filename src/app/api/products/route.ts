import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("categoria");
    const search = searchParams.get("buscar");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = { active: true };

    if (featured === "true") {
      where.featured = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { name, description, price, comparePrice, categoryId, stock, featured, image } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const slug = slugify(name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price: parseInt(price),
        comparePrice: comparePrice ? parseInt(comparePrice) : null,
        categoryId,
        stock: parseInt(stock) || 0,
        featured: featured || false,
        image: image || null,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
