import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Category, Product } from "@/types";

export const metadata = { title: "Editar Producto" };

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-title uppercase tracking-tight mb-8">Editar Producto</h1>
      <ProductForm
        categories={categories as unknown as Category[]}
        product={product as unknown as Product}
      />
    </div>
  );
}
