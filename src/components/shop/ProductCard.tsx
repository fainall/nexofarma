"use client";
import Link from "next/link";
import Image from "next/image";
import { Eye, Package } from "lucide-react";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
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

        <div className="mt-auto pt-1 sm:pt-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-corp-cian bg-corp-verde/10 px-3 py-1.5 rounded-full group-hover:bg-corp-verde/20 transition-colors">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Ver producto
          </span>
        </div>
      </div>
    </Link>
  );
}
