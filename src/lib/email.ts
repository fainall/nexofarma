import nodemailer from "nodemailer";
import { formatCLP } from "@/lib/utils";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "NexoFarma <contacto@nexofarma.cl>";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  total: number;
  items: { quantity: number; unitPrice: number; product?: { name: string } }[];
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  invoiceUrl?: string | null;
}

function baseTemplate(title: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
  <tr><td style="background:linear-gradient(135deg,#00b894,#00847e);padding:28px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:1px;">NexoFarma</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.85);font-size:13px;">Tu Farmacia de Confianza</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <h2 style="margin:0 0 20px;color:#1a1a2e;font-size:20px;font-weight:700;">${title}</h2>
    ${content}
  </td></tr>
  <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="margin:0;color:#9ca3af;font-size:12px;">NexoFarma &bull; Av. La Compañía 01661, Rancagua</p>
    <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">+56 994 055 489 &bull; contacto@nexofarma.cl</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function itemsTable(items: OrderEmailData["items"], total: number) {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">${item.product?.name || "Producto"}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6b7280;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;text-align:right;font-weight:600;">${formatCLP(item.unitPrice * item.quantity)}</td>
    </tr>`
    )
    .join("");

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
    <tr style="background:#f9fafb;">
      <th style="padding:10px 0;font-size:12px;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
      <th style="padding:10px 0;font-size:12px;color:#6b7280;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Cant.</th>
      <th style="padding:10px 0;font-size:12px;color:#6b7280;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
    </tr>
    ${rows}
    <tr>
      <td colspan="2" style="padding:14px 0;font-size:16px;font-weight:700;color:#1a1a2e;">Total</td>
      <td style="padding:14px 0;font-size:16px;font-weight:700;color:#00847e;text-align:right;">${formatCLP(total)}</td>
    </tr>
  </table>`;
}

export async function sendOrderConfirmation(order: OrderEmailData) {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Hola <strong>${order.customerName}</strong>, hemos recibido tu pedido correctamente.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#166534;">
        <strong>N° Pedido:</strong> ${order.orderNumber}
      </p>
    </div>
    ${itemsTable(order.items, order.total)}
    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">Dirección de envío</p>
      <p style="margin:0;font-size:14px;color:#374151;">${order.shippingAddress}<br>${order.shippingCity}, ${order.shippingRegion}</p>
    </div>
    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
      Te notificaremos cuando tu pedido sea confirmado y despachado. Si tienes dudas, contáctanos por WhatsApp al +56 994 055 489.
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Pedido ${order.orderNumber} recibido - NexoFarma`,
    html: baseTemplate("¡Pedido Recibido!", content),
  });
}

export async function sendOrderConfirmed(order: OrderEmailData) {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Hola <strong>${order.customerName}</strong>, tu pedido <strong>${order.orderNumber}</strong> ha sido confirmado por nuestro equipo farmacéutico.
    </p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#1e40af;">
        Estamos preparando tu pedido para despacho. Te avisaremos cuando sea enviado.
      </p>
    </div>
    ${itemsTable(order.items, order.total)}`;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Pedido ${order.orderNumber} confirmado - NexoFarma`,
    html: baseTemplate("Pedido Confirmado", content),
  });
}

export async function sendOrderShipped(order: OrderEmailData) {
  if (!process.env.SMTP_USER) return;

  let trackingBlock = "";
  if (order.trackingNumber) {
    trackingBlock = `
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#7c3aed;">
        <strong>N° Seguimiento:</strong> ${order.trackingNumber}
      </p>
      ${order.trackingUrl ? `<p style="margin:8px 0 0;"><a href="${order.trackingUrl}" style="color:#7c3aed;font-size:13px;">Rastrear envío &rarr;</a></p>` : ""}
    </div>`;
  }

  const content = `
    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Hola <strong>${order.customerName}</strong>, tu pedido <strong>${order.orderNumber}</strong> ha sido despachado.
    </p>
    ${trackingBlock}
    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;font-weight:600;">Enviado a</p>
      <p style="margin:0;font-size:14px;color:#374151;">${order.shippingAddress}<br>${order.shippingCity}, ${order.shippingRegion}</p>
    </div>`;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Pedido ${order.orderNumber} despachado - NexoFarma`,
    html: baseTemplate("¡Tu Pedido Va en Camino!", content),
  });
}

export async function sendOrderDelivered(order: OrderEmailData) {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Hola <strong>${order.customerName}</strong>, tu pedido <strong>${order.orderNumber}</strong> ha sido entregado.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#166534;">
        ¡Esperamos que disfrutes tus productos! Si tienes alguna consulta farmacéutica, no dudes en contactarnos.
      </p>
    </div>
    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
      Tu opinión es importante. Escríbenos por WhatsApp al +56 994 055 489 o síguenos en <a href="https://www.instagram.com/nexofarma" style="color:#00847e;">Instagram</a>.
    </p>`;

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Pedido ${order.orderNumber} entregado - NexoFarma`,
    html: baseTemplate("¡Pedido Entregado!", content),
  });
}

export async function sendInvoice(order: OrderEmailData, invoicePath: string) {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Hola <strong>${order.customerName}</strong>, adjuntamos la boleta de tu pedido <strong>${order.orderNumber}</strong>.
    </p>
    ${itemsTable(order.items, order.total)}
    <p style="color:#6b7280;font-size:13px;">
      Si necesitas factura, contáctanos a contacto@nexofarma.cl con tus datos tributarios.
    </p>`;

  const attachments = [];
  if (invoicePath.startsWith("/")) {
    // Local file path
    const fs = await import("fs");
    const path = await import("path");
    const fullPath = path.join(process.cwd(), "public", invoicePath);
    if (fs.existsSync(fullPath)) {
      attachments.push({
        filename: `boleta-${order.orderNumber}.pdf`,
        path: fullPath,
      });
    }
  }

  await transporter.sendMail({
    from: FROM,
    to: order.customerEmail,
    subject: `Boleta pedido ${order.orderNumber} - NexoFarma`,
    html: baseTemplate("Tu Boleta", content),
    attachments,
  });
}
