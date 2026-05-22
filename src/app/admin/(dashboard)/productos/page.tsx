import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function ProductosPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-text-title uppercase tracking-tight">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-gradient text-sm py-2.5 px-5">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Link>
      </div>

      <ProductsTable products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
