/**
 * Crea o actualiza la cuenta de administrador.
 *
 * Uso:
 *   ADMIN_EMAIL="tu@correo.cl" ADMIN_PASSWORD="clave-larga-y-unica" npm run set-admin
 *
 * No recibe la clave por argumento a proposito: los argumentos quedan
 * registrados en el historial del shell y en la lista de procesos.
 */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Faltan ADMIN_EMAIL y/o ADMIN_PASSWORD.");
  }
  if (password.length < 16) {
    throw new Error("La clave debe tener al menos 16 caracteres.");
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "admin" },
    create: { email, name: "Administrador", passwordHash, role: "admin" },
  });

  console.log(`Administrador listo: ${user.email}`);

  const otros = await prisma.user.findMany({
    where: { email: { not: email } },
    select: { email: true, role: true },
  });
  if (otros.length) {
    console.log("\nOtras cuentas existentes (revisa si deben seguir activas):");
    otros.forEach((u) => console.log(`  - ${u.email} (${u.role})`));
  }
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
