import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No se recibieron datos" }, { status: 400 });
    }

    if (products.length > 500) {
      return NextResponse.json({ error: "Máximo 500 registros por carga" }, { status: 400 });
    }

    // Get all categories for matching
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c) => [c.name.toLowerCase().trim(), c.id])
    );
    const categorySlugMap = new Map(
      categories.map((c) => [c.slug.toLowerCase().trim(), c.id])
    );

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const row = i + 1;

      if (!p.name || !p.price) {
        results.errors.push(`Fila ${row}: Faltan nombre o precio`);
        results.skipped++;
        continue;
      }

      const price = parseInt(String(p.price).replace(/[^0-9]/g, ""));
      if (isNaN(price) || price <= 0) {
        results.errors.push(`Fila ${row}: Precio inválido`);
        results.skipped++;
        continue;
      }

      // Resolve category
      let categoryId = p.categoryId;
      if (!categoryId && p.category) {
        const catLower = String(p.category).toLowerCase().trim();
        categoryId = categoryMap.get(catLower) || categorySlugMap.get(catLower);
        if (!categoryId) {
          results.errors.push(`Fila ${row}: Categoría "${p.category}" no encontrada`);
          results.skipped++;
          continue;
        }
      }

      if (!categoryId) {
        results.errors.push(`Fila ${row}: Sin categoría`);
        results.skipped++;
        continue;
      }

      try {
        const slug = slugify(p.name);
        const existing = await prisma.product.findUnique({ where: { slug } });
        const finalSlug = existing ? `${slug}-${Date.now()}-${i}` : slug;

        const comparePrice = p.comparePrice
          ? parseInt(String(p.comparePrice).replace(/[^0-9]/g, ""))
          : null;

        await prisma.product.create({
          data: {
            name: p.name.trim(),
            slug: finalSlug,
            description: p.description?.trim() || p.name.trim(),
            price,
            comparePrice: comparePrice && comparePrice > price ? comparePrice : null,
            categoryId,
            stock: parseInt(String(p.stock || 0)) || 0,
            featured: p.featured === true || p.featured === "true" || p.featured === "si" || p.featured === "sí",
            image: p.image || null,
            active: true,
          },
        });
        results.created++;
      } catch {
        results.errors.push(`Fila ${row}: Error al crear producto`);
        results.skipped++;
      }
    }

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
