import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCLP } from "@/lib/utils";

export const metadata = { title: "Pedidos" };

const statusColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export default async function PedidosPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-title uppercase tracking-tight mb-8">Pedidos</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No hay pedidos aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3">N° Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <Link href={`/admin/pedidos/${order.id}`} className="font-bold text-corp-cian hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-medium text-text-title">{order.customerName}</td>
                    <td className="px-5 py-4 text-gray-500">{order.customerEmail}</td>
                    <td className="px-5 py-4 text-gray-500">{order.items.length}</td>
                    <td className="px-5 py-4 font-bold">{formatCLP(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-CL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
