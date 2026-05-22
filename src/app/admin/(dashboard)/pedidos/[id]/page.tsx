import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetail from "@/components/admin/OrderDetail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detalle de Pedido" };

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    // Fallback if statusHistory relation not yet available
    order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  if (!order) notFound();

  // Ensure statusHistory exists
  const orderData = JSON.parse(JSON.stringify(order));
  if (!orderData.statusHistory) orderData.statusHistory = [];

  return <OrderDetail order={orderData} />;
}
