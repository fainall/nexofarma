import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { Category } from "@/types";

export const metadata = { title: "Nuevo Producto" };

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-title uppercase tracking-tight mb-8">Nuevo Producto</h1>
      <ProductForm categories={categories as unknown as Category[]} />
    </div>
  );
}
