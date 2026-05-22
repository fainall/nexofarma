import { prisma } from "@/lib/prisma";
import { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";

interface Props {
  searchParams: { categoria?: string; buscar?: string; orden?: string };
}

export const metadata = {
  title: "Tienda",
  description: "Explora nuestro catálogo de medicamentos, dermocosmética, vitaminas y cuidado personal.",
};

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria, buscar, orden } = searchParams;

  const where: Record<string, unknown> = { active: true };

  if (categoria) {
    where.category = { slug: categoria };
  }

  if (buscar) {
    where.OR = [
      { name: { contains: buscar } },
      { description: { contains: buscar } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (orden === "precio-asc") orderBy = { price: "asc" };
  if (orden === "precio-desc") orderBy = { price: "desc" };
  if (orden === "nombre") orderBy = { name: "asc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">
          Nuestra <span className="gradient-text">Tienda</span>
        </h1>
        <p className="text-gray-500">
          {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <ShopFilters
            categories={categories}
            currentCategory={categoria}
            currentSearch={buscar}
            currentSort={orden}
          />
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No se encontraron productos.</p>
              <p className="text-gray-400 text-sm mt-2">Intenta con otra categoría o búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as unknown as Product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
