"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

const tabs = [
  { key: "all", label: "Populares" },
  { key: "medicamentos", label: "Medicamentos" },
  { key: "dermocosmetica", label: "Belleza" },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("featured", "true");
        if (activeTab !== "all") {
          params.set("categoria", activeTab);
        }
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <section className="py-10 sm:py-16 md:py-20" style={{ background: "#f8fbff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="section-title" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            Productos <span className="gradient-text">Destacados</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-3 sm:mt-4 text-sm sm:text-base px-2">
            Los productos más solicitados por nuestros clientes, seleccionados por nuestros químicos farmacéuticos.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap shrink-0"
              style={
                activeTab === tab.key
                  ? {
                      background: "linear-gradient(135deg, var(--color-corp-verde) 0%, var(--color-corp-cian) 100%)",
                      color: "white",
                      boxShadow: "0 8px 20px rgba(0, 196, 179, 0.3)",
                    }
                  : {
                      background: "white",
                      color: "#666",
                      border: "1px solid #eaeaea",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-corp-verde/20 border-t-corp-verde rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No hay productos destacados en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
