"use client";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCLP } from "@/lib/utils";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-text-title mb-3">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Agrega productos desde nuestra tienda para comenzar.</p>
        <Link href="/tienda" className="btn-gradient">
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-corp-cian mb-6 sm:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Seguir comprando
      </Link>

      <h1 className="section-title mb-6 sm:mb-8">Tu <span className="gradient-text">Carrito</span></h1>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
              {/* Mobile: stacked layout */}
              <div className="flex gap-3 sm:gap-4 items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-text-title line-clamp-2">{item.name}</h3>
                  <p className="text-corp-cian font-black text-sm mt-0.5">{formatCLP(item.price)}</p>
                </div>

                {/* Desktop: inline controls */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="font-black text-sm text-text-title w-24 text-right shrink-0">
                    {formatCLP(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile: bottom controls row */}
              <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-bold border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="font-black text-sm text-text-title">
                  {formatCLP(item.price * item.quantity)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 sticky top-24">
            <h3 className="font-bold text-lg text-text-title mb-4">Resumen</h3>

            <div className="space-y-3 mb-6">
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

            <Link href="/checkout" className="btn-gradient w-full py-3.5">
              Ir al Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
