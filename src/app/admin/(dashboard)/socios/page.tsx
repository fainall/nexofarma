"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Search, Download, UserCheck, UserX, Loader2 } from "lucide-react";

interface Socio {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
}

export default function SociosAdminPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSocios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/socios?${params}`);
      const data = await res.json();
      setSocios(data.socios || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchSocios(); }, [fetchSocios]);

  const exportCSV = () => {
    const headers = ["Nombre", "RUT", "Teléfono", "Email", "Dirección", "Fecha Registro"];
    const rows = socios.map((s) => [
      s.nombre,
      s.rut,
      s.telefono,
      s.email,
      s.direccion,
      new Date(s.createdAt).toLocaleDateString("es-CL"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `socios-nexofarma-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Socios</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "socio registrado" : "socios registrados"}
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={socios.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-corp text-white text-sm font-bold rounded-xl hover:shadow-corp transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, RUT o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-corp-verde focus:ring-2 focus:ring-corp-verde/10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-corp-cian animate-spin" />
          </div>
        ) : socios.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No hay socios registrados</p>
            <p className="text-gray-400 text-sm mt-1">Los socios aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Nombre</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">RUT</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Teléfono</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Email</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Dirección</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Registro</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {socios.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{s.nombre}</td>
                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">{s.rut}</td>
                    <td className="px-5 py-4 text-gray-600">{s.telefono}</td>
                    <td className="px-5 py-4 text-gray-600">{s.email}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">{s.direccion}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(s.createdAt).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-5 py-4">
                      {s.activo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                          <UserCheck className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                          <UserX className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
