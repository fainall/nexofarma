import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle2, Truck } from "lucide-react";
import { formatCLP } from "@/lib/utils";
import PedidosFilters from "@/components/admin/PedidosFilters";

export const metadata = { title: "Pedidos" };

const statusConfig: Record<string, { label: string; color: string; badge: string }> = {
  pendiente: { label: "Pendiente", color: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" },
  confirmado: { label: "Confirmado", color: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
  preparacion: { label: "En Preparación", color: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
  despachado: { label: "Despachado", color: "text-purple-700", badge: "bg-purple-100 text-purple-800" },
  entregado: { label: "Entregado", color: "text-green-700", badge: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "text-red-700", badge: "bg-red-100 text-red-800" },
};

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const where: Record<string, unknown> = {};

  if (searchParams.status && searchParams.status !== "todos") {
    where.status = searchParams.status;
  }

  if (searchParams.q) {
    where.OR = [
      { orderNumber: { contains: searchParams.q, mode: "insensitive" } },
      { customerName: { contains: searchParams.q, mode: "insensitive" } },
      { customerEmail: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const totalOrders = counts.reduce((sum, c) => sum + c._count.id, 0);
  const countMap: Record<string, number> = {};
  counts.forEach((c) => { countMap[c.status] = c._count.id; });

  const summaryCards = [
    { label: "Total", count: totalOrders, icon: ShoppingBag, color: "bg-gray-900 text-white", status: "todos" },
    { label: "Pendientes", count: countMap.pendiente || 0, icon: Clock, color: "bg-yellow-50 text-yellow-700 border border-yellow-200", status: "pendiente" },
    { label: "Confirmados", count: countMap.confirmado || 0, icon: CheckCircle2, color: "bg-blue-50 text-blue-700 border border-blue-200", status: "confirmado" },
    { label: "Despachados", count: countMap.despachado || 0, icon: Truck, color: "bg-purple-50 text-purple-700 border border-purple-200", status: "despachado" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-text-title uppercase tracking-tight mb-6">Pedidos</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.status}
              href={card.status === "todos" ? "/admin/pedidos" : `/admin/pedidos?status=${card.status}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${card.color} transition-transform hover:scale-[1.02]`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-2xl font-black leading-none">{card.count}</p>
                <p className="text-xs font-semibold mt-0.5 opacity-70">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Filters */}
      <PedidosFilters currentStatus={searchParams.status} currentQuery={searchParams.q} />

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchParams.q || searchParams.status ? "No se encontraron pedidos con esos filtros" : "No hay pedidos aún"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3">N° Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Ciudad</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <Link href={`/admin/pedidos/${order.id}`} className="font-bold text-corp-cian hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-text-title">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{order.shippingCity}</td>
                      <td className="px-5 py-4 text-gray-500">{order.items.length}</td>
                      <td className="px-5 py-4 font-bold">{formatCLP(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc?.badge || "bg-gray-100 text-gray-600"}`}>
                          {sc?.label || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
