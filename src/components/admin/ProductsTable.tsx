"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Search } from "lucide-react";
import { formatCLP } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

interface ProductItem {
  id: string;
  name: string;
  image: string | null;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category: { name: string };
}

export default function ProductsTable({ products }: { products: ProductItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (product: ProductItem) => {
    setTogglingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-corp-verde/30 focus:border-corp-verde transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">
              {search ? "No se encontraron productos" : "No hay productos aún"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Categoría</th>
                  <th className="px-5 py-3">Precio</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-text-title">{product.name}</p>
                          {product.featured && (
                            <span className="text-[10px] font-bold text-corp-verde uppercase">Destacado</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{product.category.name}</td>
                    <td className="px-5 py-4 font-bold">{formatCLP(product.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(product)}
                        disabled={togglingId === product.id}
                        className="group relative inline-flex items-center"
                        title={product.active ? "Clic para desactivar" : "Clic para activar"}
                      >
                        <div
                          className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                            product.active ? "bg-green-500" : "bg-gray-300"
                          } ${togglingId === product.id ? "opacity-50" : "cursor-pointer"}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 mt-0.5 ${
                              product.active ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                        <span
                          className={`ml-2 text-xs font-bold uppercase ${
                            product.active ? "text-green-800" : "text-gray-500"
                          }`}
                        >
                          {togglingId === product.id
                            ? "..."
                            : product.active
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="px-3 py-1.5 text-xs font-bold text-corp-cian bg-corp-verde/10 rounded-lg hover:bg-corp-verde/20 transition-colors"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
