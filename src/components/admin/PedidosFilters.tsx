"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const statuses = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "preparacion", label: "Preparación" },
  { value: "despachado", label: "Despachado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

export default function PedidosFilters({
  currentStatus,
  currentQuery,
}: {
  currentStatus?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery || "");

  const buildUrl = (status?: string, q?: string) => {
    const params = new URLSearchParams();
    if (status && status !== "todos") params.set("status", status);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/admin/pedidos${qs ? `?${qs}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl(currentStatus, query));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Status Tabs */}
      <div className="flex gap-1 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => router.push(buildUrl(s.value, currentQuery))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
              ${(currentStatus || "todos") === s.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 flex gap-2 sm:max-w-xs sm:ml-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pedido, cliente..."
            className="input-field text-sm pl-9 py-2"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
