"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface Props {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export default function ShopFilters({ categories, currentCategory, currentSearch, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");
  const [showMobile, setShowMobile] = useState(false);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/tienda?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("buscar", search || undefined);
  };

  const filters = (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="input-field pr-10"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-corp-cian">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Categorías</h4>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateFilter("categoria", undefined)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                !currentCategory ? "bg-gradient-corp text-white" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateFilter("categoria", cat.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  currentCategory === cat.slug ? "bg-gradient-corp text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Ordenar por</h4>
        <select
          value={currentSort || ""}
          onChange={(e) => updateFilter("orden", e.target.value || undefined)}
          className="input-field text-sm"
        >
          <option value="">Más recientes</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowMobile(!showMobile)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filtros
      </button>

      <div className={cn("lg:block", showMobile ? "block" : "hidden")}>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-24">
          {filters}
        </div>
      </div>
    </>
  );
}
