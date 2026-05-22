"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { formatCLP } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  FileText,
  Send,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Save,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof Package }> = {
  pendiente: { label: "Pendiente", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-200", icon: Clock },
  confirmado: { label: "Confirmado", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", icon: CheckCircle2 },
  preparacion: { label: "En Preparación", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200", icon: Package },
  despachado: { label: "Despachado", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200", icon: Truck },
  entregado: { label: "Entregado", color: "text-green-700", bgColor: "bg-green-50 border-green-200", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", color: "text-red-700", bgColor: "bg-red-50 border-red-200", icon: XCircle },
};

const STATUS_FLOW = ["pendiente", "confirmado", "preparacion", "despachado", "entregado"];

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order: initialOrder }: OrderDetailProps) {
  const [order, setOrder] = useState(initialOrder);
  const [saving, setSaving] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [qfNotes, setQfNotes] = useState(order.qfNotes || "");
  const [uploadingInvoice, setUploadingInvoice] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const currentConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
  const CurrentIcon = currentConfig.icon;

  const updateOrder = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || "Error al actualizar", "error");
        return false;
      }
    } catch {
      showToast("Error de conexión", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === order.status) return;
    const ok = await updateOrder({ status: newStatus, statusNote: statusNote || undefined });
    if (ok) {
      showToast(`Estado cambiado a ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      setStatusNote("");
      // Refetch to get updated statusHistory
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) setOrder(await res.json());
    }
  };

  const handleSaveTracking = async () => {
    const ok = await updateOrder({ trackingNumber, trackingUrl });
    if (ok) showToast("Datos de seguimiento guardados");
  };

  const handleSaveNotes = async () => {
    const ok = await updateOrder({ qfNotes });
    if (ok) showToast("Notas guardadas");
  };

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInvoice(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`/api/orders/${order.id}/invoice`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        showToast(err.error || "Error al subir archivo", "error");
        return;
      }

      const { path } = await uploadRes.json();
      showToast("Boleta subida correctamente");

      // Save invoice URL to order
      const ok = await updateOrder({ invoiceUrl: path });
      if (ok) showToast("Boleta asociada al pedido");
    } catch {
      showToast("Error al subir boleta", "error");
    } finally {
      setUploadingInvoice(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendInvoice = async () => {
    if (!order.invoiceUrl) {
      showToast("Primero sube una boleta", "error");
      return;
    }
    setSendingInvoice(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendInvoiceEmail: true }),
      });
      if (res.ok) {
        showToast("Boleta enviada por correo al cliente");
      } else {
        showToast("Error al enviar boleta", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setSendingInvoice(false);
    }
  };

  const getNextStatus = () => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const nextStatus = getNextStatus();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pedidos" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-text-title uppercase tracking-tight">
            Pedido {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Creado el {new Date(order.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${currentConfig.bgColor}`}>
          <CurrentIcon className={`w-5 h-5 ${currentConfig.color}`} />
          <span className={`font-bold text-sm ${currentConfig.color}`}>{currentConfig.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Status Action */}
          {nextStatus && order.status !== "cancelado" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text-title text-sm">Acción Rápida</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Avanzar al siguiente estado</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Nota opcional..."
                    className="input-field text-sm py-2 max-w-[200px]"
                  />
                  <button
                    onClick={() => handleStatusChange(nextStatus)}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-corp-verde text-white rounded-xl font-bold text-sm hover:bg-corp-verde/90 transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {STATUS_CONFIG[nextStatus]?.label}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-text-title flex items-center gap-2">
                <Package className="w-4 h-4 text-corp-verde" />
                Productos ({order.items?.length || 0})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product?.name || ""}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text-title truncate">
                      {item.product?.name || "Producto eliminado"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatCLP(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-text-title">
                    {formatCLP(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCLP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Envío</span>
                <span>{order.shippingCost > 0 ? formatCLP(order.shippingCost) : "Gratis"}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-corp-verde">{formatCLP(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-text-title flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-corp-verde" />
              Seguimiento de Envío
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">N° Seguimiento</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ej: SP123456789"
                  className="input-field mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">URL de Rastreo</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="input-field mt-1 text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSaveTracking}
              disabled={saving}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Guardar Seguimiento
            </button>
          </div>

          {/* Invoice / Boleta */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-text-title flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-corp-verde" />
              Boleta / Factura
            </h3>

            {order.invoiceUrl && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700">Boleta adjunta</p>
                  <a
                    href={order.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline truncate block"
                  >
                    {order.invoiceUrl}
                  </a>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploadingInvoice ? "Subiendo..." : order.invoiceUrl ? "Reemplazar Boleta" : "Subir Boleta"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleInvoiceUpload}
                  className="hidden"
                  disabled={uploadingInvoice}
                />
              </label>

              {order.invoiceUrl && (
                <button
                  onClick={handleSendInvoice}
                  disabled={sendingInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-corp-cian text-white rounded-xl font-bold text-sm hover:bg-corp-cian/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sendingInvoice ? "Enviando..." : "Enviar por Email"}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG o WebP (máx 10MB)</p>
          </div>

          {/* QF Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-text-title flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-corp-verde" />
              Notas del QF
            </h3>
            <textarea
              value={qfNotes}
              onChange={(e) => setQfNotes(e.target.value)}
              placeholder="Notas internas sobre el pedido (verificación receta, observaciones, etc.)"
              rows={3}
              className="input-field text-sm resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Guardar Notas
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-text-title flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-corp-verde" />
              Cliente
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-title">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <a href={`mailto:${order.customerEmail}`} className="text-sm text-corp-cian hover:underline break-all">
                  {order.customerEmail}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <a href={`tel:${order.customerPhone}`} className="text-sm text-corp-cian hover:underline">
                  {order.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress}</p>
                  <p>{order.shippingCity}, {order.shippingRegion}</p>
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">Nota del cliente</p>
                <p className="text-sm text-yellow-800">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Status Change */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-text-title text-sm mb-3">Cambiar Estado</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([value, config]) => {
                const Icon = config.icon;
                const isActive = order.status === value;
                const isPast = STATUS_FLOW.indexOf(value) < STATUS_FLOW.indexOf(order.status);
                return (
                  <button
                    key={value}
                    onClick={() => handleStatusChange(value)}
                    disabled={saving || isActive}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                      ${isActive ? `${config.bgColor} border ${config.color}` : isPast ? "bg-gray-50 text-gray-400 border border-transparent" : "bg-white text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-50"}
                      disabled:cursor-default`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? config.color : isPast ? "text-gray-300" : "text-gray-400"}`} />
                    {config.label}
                    {isActive && <span className="ml-auto text-xs opacity-70">Actual</span>}
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status History / Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-text-title flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-corp-verde" />
                Historial
              </h3>
              <div className="space-y-0">
                {order.statusHistory.map((change, i) => {
                  const toConfig = STATUS_CONFIG[change.toStatus] || STATUS_CONFIG.pendiente;
                  return (
                    <div key={change.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? "bg-corp-verde" : "bg-gray-300"}`} />
                        {i < order.statusHistory!.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-text-title">
                          {toConfig.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(change.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {change.note && (
                          <p className="text-xs text-gray-500 mt-0.5 italic">{change.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WhatsApp Quick Action */}
          <a
            href={`https://wa.me/56${order.customerPhone.replace(/\D/g, "").replace(/^56/, "")}?text=${encodeURIComponent(`Hola ${order.customerName}, sobre tu pedido ${order.orderNumber} en NexoFarma...`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.937 1.395 5.614L.047 23.573a.5.5 0 00.606.608l5.959-1.348A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.634-.498-5.148-1.369l-.36-.213-3.727.843.843-3.727-.213-.36A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
