import { prisma } from "@/lib/prisma";
import { Package, ShoppingBag, DollarSign, Clock, Users, Mail, TrendingUp, AlertCircle, Upload } from "lucide-react";
import { formatCLP } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    totalSocios,
    unreadMessages,
    lowStockProducts,
    recentOrders,
    recentSocios,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pendiente" } }),
    prisma.socio.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.socio.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allOrders = await prisma.order.findMany();
  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Productos Activos", value: totalProducts.toString(), icon: Package, color: "bg-blue-50 text-blue-600", href: "/admin/productos" },
    { label: "Pedidos Totales", value: totalOrders.toString(), icon: ShoppingBag, color: "bg-green-50 text-green-600", href: "/admin/pedidos" },
    { label: "Ingresos Totales", value: formatCLP(revenue), icon: DollarSign, color: "bg-purple-50 text-purple-600", href: "/admin/pedidos" },
    { label: "Socios Registrados", value: totalSocios.toString(), icon: Users, color: "bg-cyan-50 text-cyan-600", href: "/admin/socios" },
  ];

  const alerts = [
    pendingOrders > 0 && { label: `${pendingOrders} pedido${pendingOrders > 1 ? "s" : ""} pendiente${pendingOrders > 1 ? "s" : ""}`, icon: Clock, color: "text-yellow-600 bg-yellow-50", href: "/admin/pedidos" },
    unreadMessages > 0 && { label: `${unreadMessages} mensaje${unreadMessages > 1 ? "s" : ""} sin leer`, icon: Mail, color: "text-blue-600 bg-blue-50", href: "/admin/mensajes" },
    lowStockProducts > 0 && { label: `${lowStockProducts} producto${lowStockProducts > 1 ? "s" : ""} con stock bajo`, icon: AlertCircle, color: "text-red-600 bg-red-50", href: "/admin/productos" },
  ].filter(Boolean) as { label: string; icon: typeof Clock; color: string; href: string }[];

  const statusColors: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmado: "bg-blue-100 text-blue-800",
    enviado: "bg-purple-100 text-purple-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-title uppercase tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Resumen general de NexoFarma</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-semibold uppercase">Última actualización</p>
          <p className="text-sm font-bold text-gray-600">{new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {alerts.map((alert, i) => (
            <Link key={i} href={alert.href} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold ${alert.color} hover:opacity-80 transition-opacity`}>
              <alert.icon className="w-4 h-4" />
              {alert.label}
            </Link>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-text-title">{stat.value}</p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-text-title flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-corp-verde" />
              Pedidos Recientes
            </h2>
            <Link href="/admin/pedidos" className="text-sm font-bold text-corp-verde hover:text-corp-cian transition-colors">
              Ver todos →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay pedidos aún</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="pb-3 pr-4">Pedido</th>
                    <th className="pb-3 pr-4">Cliente</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Estado</th>
                    <th className="pb-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-4">
                        <Link href={`/admin/pedidos/${order.id}`} className="font-bold text-corp-cian hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{order.customerName}</td>
                      <td className="py-3 pr-4 font-bold">{formatCLP(order.total)}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("es-CL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Socios */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-text-title flex items-center gap-2">
              <Users className="w-5 h-5 text-corp-cian" />
              Nuevos Socios
            </h2>
            <Link href="/admin/socios" className="text-sm font-bold text-corp-verde hover:text-corp-cian transition-colors">
              Ver todos →
            </Link>
          </div>

          {recentSocios.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">No hay socios registrados</p>
          ) : (
            <div className="space-y-3">
              {recentSocios.map((socio) => (
                <div key={socio.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-corp flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{socio.nombre.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-text-title truncate">{socio.nombre}</p>
                    <p className="text-xs text-gray-400 font-mono">{socio.rut}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-text-title mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/admin/productos/nuevo" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-corp-verde hover:bg-corp-verde/5 transition-all text-center group">
            <Package className="w-6 h-6 text-gray-400 group-hover:text-corp-verde transition-colors" />
            <span className="text-xs font-bold text-gray-600 group-hover:text-corp-cian">Nuevo Producto</span>
          </Link>
          <Link href="/admin/carga-masiva" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-corp-verde hover:bg-corp-verde/5 transition-all text-center group">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-corp-verde transition-colors" />
            <span className="text-xs font-bold text-gray-600 group-hover:text-corp-cian">Carga Masiva</span>
          </Link>
          <Link href="/admin/socios" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-corp-verde hover:bg-corp-verde/5 transition-all text-center group">
            <Users className="w-6 h-6 text-gray-400 group-hover:text-corp-verde transition-colors" />
            <span className="text-xs font-bold text-gray-600 group-hover:text-corp-cian">Ver Socios</span>
          </Link>
          <Link href="/admin/mensajes" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-corp-verde hover:bg-corp-verde/5 transition-all text-center group">
            <Mail className="w-6 h-6 text-gray-400 group-hover:text-corp-verde transition-colors" />
            <span className="text-xs font-bold text-gray-600 group-hover:text-corp-cian">Mensajes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
