"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { Product } from "@/types";
import { formatCLP, getDiscountPercentage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/Toast";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const discount = product.comparePrice ? getDiscountPercentage(product.price, product.comparePrice) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
    showToast(`${product.name} agregado al carrito`);
  };

  return (
    <Link href={`/tienda/${product.slug}`} className="product-card group flex flex-col">
      <div className="product-image">
        {product.image ? (
          <div className="w-full h-full flex items-center justify-center p-3 sm:p-6">
            <Image
              src={product.image}
              alt={product.name}
              width={280}
              height={280}
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 group-hover:text-corp-verde/40 transition-all duration-600" />
          </div>
        )}

        {discount > 0 && (
          <span
            className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            -{discount}%
          </span>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-corp-verde)" }}>
            {product.category.name}
          </span>
        )}
        <h3 className="font-bold text-xs sm:text-sm text-text-title group-hover:text-corp-cian transition-colors line-clamp-2 mb-2 sm:mb-3">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-1 sm:gap-2 pt-1 sm:pt-2">
          <div className="min-w-0">
            <p className="text-sm sm:text-lg font-black truncate" style={{ color: "var(--color-corp-cian)" }}>{formatCLP(product.price)}</p>
            {product.comparePrice && (
              <p className="text-[10px] sm:text-xs text-gray-400 line-through">{formatCLP(product.comparePrice)}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="product-add-btn disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
