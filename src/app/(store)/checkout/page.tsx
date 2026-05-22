"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatCLP } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";

const regiones = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
  "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingRegion: "",
    notes: "",
  });

  const total = getTotal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) errs.customerName = "Nombre requerido";
    if (!form.customerEmail.trim()) errs.customerEmail = "Email requerido";
    if (!form.customerPhone.trim()) errs.customerPhone = "Teléfono requerido";
    if (!form.shippingAddress.trim()) errs.shippingAddress = "Dirección requerida";
    if (!form.shippingCity.trim()) errs.shippingCity = "Ciudad requerida";
    if (!form.shippingRegion) errs.shippingRegion = "Región requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });

      if (!res.ok) throw new Error("Error al crear el pedido");

      const order = await res.json();
      clearCart();
      router.push(`/checkout/confirmacion?pedido=${order.orderNumber}`);
    } catch {
      setErrors({ submit: "Error al procesar tu pedido. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
        <Link href="/tienda" className="btn-gradient">Ir a la Tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/carrito" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-corp-cian mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al carrito
      </Link>

      <h1 className="section-title mb-8">
        <span className="gradient-text">Checkout</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-text-title mb-4">Datos de contacto</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nombre completo" name="customerName" value={form.customerName} onChange={handleChange} error={errors.customerName} required />
                <Input label="Email" name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} error={errors.customerEmail} required />
                <Input label="Teléfono" name="customerPhone" value={form.customerPhone} onChange={handleChange} error={errors.customerPhone} placeholder="+56 9 XXXX XXXX" required />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-text-title mb-4">Dirección de envío</h3>
              <div className="space-y-4">
                <Input label="Dirección" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} error={errors.shippingAddress} required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Ciudad" name="shippingCity" value={form.shippingCity} onChange={handleChange} error={errors.shippingCity} required />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Región</label>
                    <select name="shippingRegion" value={form.shippingRegion} onChange={handleChange} className="input-field" required>
                      <option value="">Seleccionar región</option>
                      {regiones.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.shippingRegion && <p className="mt-1 text-sm text-red-500">{errors.shippingRegion}</p>}
                  </div>
                </div>
                <Textarea label="Notas (opcional)" name="notes" value={form.notes} onChange={handleChange} placeholder="Instrucciones especiales de entrega..." />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg text-text-title mb-4">Tu pedido</h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-title truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold shrink-0">{formatCLP(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{formatCLP(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="text-corp-verde font-bold">Gratis</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-text-title">Total</span>
                  <span className="text-xl font-black text-corp-cian">{formatCLP(total)}</span>
                </div>
              </div>

              {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}

              <Button type="submit" loading={loading} className="w-full py-3.5">
                Confirmar Pedido
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
