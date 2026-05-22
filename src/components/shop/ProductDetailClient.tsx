"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Minus, Plus, ArrowLeft, Package, Shield, Truck } from "lucide-react";
import { Product } from "@/types";
import { formatCLP, getDiscountPercentage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/Toast";
import ProductCard from "./ProductCard";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const discount = product.comparePrice ? getDiscountPercentage(product.price, product.comparePrice) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      stock: product.stock,
    });
    showToast(`${product.name} agregado al carrito`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-corp-cian mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a la tienda
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="object-contain w-full h-full p-6 sm:p-10"
              priority
            />
          ) : (
            <Package className="w-24 h-24 text-gray-300" />
          )}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-corp-verde mb-2">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-title mb-3 sm:mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
            <span className="text-3xl font-black text-corp-cian">{formatCLP(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">{formatCLP(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-500">Cantidad:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-10 flex items-center justify-center font-bold text-sm border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-400">
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="btn-gradient py-4 text-base w-full sm:w-auto disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar al Carrito
          </button>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
            <div className="text-center">
              <Truck className="w-6 h-6 text-corp-verde mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">Envío rápido</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-corp-verde mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">Pago seguro</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 text-corp-verde mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">Calidad garantizada</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="section-title mb-8">
            Productos <span className="gradient-text">Relacionados</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
