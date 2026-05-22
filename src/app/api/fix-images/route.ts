import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as fs from "fs";
import * as path from "path";

export async function POST() {
  try {
    const productsDir = path.join(process.cwd(), "public", "images", "products");
    const categoriesDir = path.join(process.cwd(), "public", "images", "categories");

    const results: { updated: string[]; notFound: string[]; alreadySet: string[] } = {
      updated: [],
      notFound: [],
      alreadySet: [],
    };

    // Fix product images
    if (fs.existsSync(productsDir)) {
      const files = fs.readdirSync(productsDir);
      for (const file of files) {
        const ext = path.extname(file);
        const slug = file.replace(ext, "");
        const imagePath = `/images/products/${file}`;

        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) {
          results.notFound.push(slug);
          continue;
        }
        if (product.image) {
          results.alreadySet.push(slug);
          continue;
        }

        await prisma.product.update({
          where: { slug },
          data: { image: imagePath },
        });
        results.updated.push(slug);
      }
    }

    // Fix category images
    if (fs.existsSync(categoriesDir)) {
      const catFiles = fs.readdirSync(categoriesDir);
      const catUpdated: string[] = [];
      for (const file of catFiles) {
        const ext = path.extname(file);
        const slug = file.replace(ext, "");
        const imagePath = `/images/categories/${file}`;

        try {
          await prisma.category.update({
            where: { slug },
            data: { image: imagePath },
          });
          catUpdated.push(slug);
        } catch {
          // category not found by that slug
        }
      }
      (results as Record<string, unknown>).categoriesUpdated = catUpdated;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Fix images error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
