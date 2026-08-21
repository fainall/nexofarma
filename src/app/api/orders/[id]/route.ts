import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/apiAuth";
import {
  sendOrderConfirmed,
  sendOrderShipped,
  sendOrderDelivered,
  sendInvoice,
} from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { status, trackingNumber, trackingUrl, qfNotes, invoiceUrl, statusNote, sendInvoiceEmail } = body;

    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (status) {
      const validStatuses = ["pendiente", "confirmado", "preparacion", "despachado", "entregado", "cancelado"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;
    if (qfNotes !== undefined) updateData.qfNotes = qfNotes;
    if (invoiceUrl !== undefined) updateData.invoiceUrl = invoiceUrl;

    // Update order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { items: { include: { product: true } } },
    });

    // Log status change
    if (status && status !== currentOrder.status) {
      await prisma.statusChange.create({
        data: {
          orderId: params.id,
          fromStatus: currentOrder.status,
          toStatus: status,
          note: statusNote || null,
        },
      });

      // Send emails based on new status
      const emailData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        shippingRegion: order.shippingRegion,
        total: order.total,
        items: order.items,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        invoiceUrl: order.invoiceUrl,
      };

      try {
        if (status === "confirmado") {
          await sendOrderConfirmed(emailData);
        } else if (status === "despachado") {
          await sendOrderShipped(emailData);
        } else if (status === "entregado") {
          await sendOrderDelivered(emailData);
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }
    }

    // Send invoice email if invoiceUrl was just set or resend requested
    const shouldSendInvoice = sendInvoiceEmail || (invoiceUrl && invoiceUrl !== currentOrder.invoiceUrl);
    if (shouldSendInvoice && order.invoiceUrl) {
      try {
        await sendInvoice(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            shippingAddress: order.shippingAddress,
            shippingCity: order.shippingCity,
            shippingRegion: order.shippingRegion,
            total: order.total,
            items: order.items,
          },
          order.invoiceUrl
        );
      } catch (emailError) {
        console.error("Error sending invoice:", emailError);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
