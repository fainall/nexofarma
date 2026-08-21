import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

/**
 * Credenciales del administrador.
 *
 * Se exigen por variable de entorno a proposito: este repositorio es publico,
 * asi que ninguna clave puede vivir en el codigo. Si faltan, el seed se detiene.
 */
function adminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan ADMIN_EMAIL y/o ADMIN_PASSWORD. Definelas en el entorno antes de ejecutar el seed."
    );
  }
  if (password.length < 16) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 16 caracteres.");
  }
  return { email, password };
}

async function main() {
  const dataPath = path.join(__dirname, "seed-data.json");

  if (fs.existsSync(dataPath)) {
    // Full seed from exported data
    console.log("Seeding from seed-data.json...");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Seed categories
    for (const cat of data.categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          image: cat.image,
        },
      });
    }
    console.log(`  ${data.categories.length} categories seeded`);

    // Build category slug->id map
    const dbCategories = await prisma.category.findMany();
    const catMap: Record<string, string> = {};
    for (const cat of data.categories) {
      const dbCat = dbCategories.find((c) => c.slug === cat.slug);
      if (dbCat) catMap[cat.id] = dbCat.id;
    }

    // Seed products
    for (const prod of data.products) {
      const newCategoryId = catMap[prod.categoryId];
      if (!newCategoryId) {
        console.warn(`  Skipping product "${prod.name}" - category not found`);
        continue;
      }
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          image: prod.image,
          images: prod.images,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description || "",
          price: prod.price,
          comparePrice: prod.comparePrice,
          image: prod.image,
          images: prod.images,
          stock: prod.stock,
          featured: prod.featured,
          active: prod.active,
          categoryId: newCategoryId,
        },
      });
    }
    console.log(`  ${data.products.length} products seeded`);

    // Seed admin user
    const admin = adminCredentials();
    const passwordHash = await hash(admin.password, 12);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        name: "Administrador",
        passwordHash,
        role: "admin",
      },
    });
    console.log("  Admin user seeded");
  } else {
    // Minimal seed (no data file)
    console.log("No seed-data.json found, creating minimal seed...");

    const admin = adminCredentials();
    const passwordHash = await hash(admin.password, 12);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        name: "Administrador",
        passwordHash,
        role: "admin",
      },
    });

    const categories = [
      { name: "Medicamentos", slug: "medicamentos", description: "Medicamentos con y sin receta", icon: "Pill" },
      { name: "Dermocosmética", slug: "dermocosmetica", description: "Cuidado especializado para tu piel", icon: "Sparkles" },
      { name: "Vitaminas y Suplementos", slug: "vitaminas-y-suplementos", description: "Refuerza tu bienestar diario", icon: "Leaf" },
      { name: "Cuidado Personal", slug: "cuidado-personal", description: "Higiene y cuidado del día a día", icon: "Heart" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }
    console.log("  Minimal categories seeded");
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
