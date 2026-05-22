"use client";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowLeft, Package, Shield, Truck } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {

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
        </div>

        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-corp-verde mb-2">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-title mb-3 sm:mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-bold px-4 py-2 rounded-full border border-amber-200">
              Precio disponible pronto
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <a
            href={`https://wa.me/56963016418?text=${encodeURIComponent(`Hola NexoFarma, me interesa el producto: ${product.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient py-4 text-base w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar disponibilidad
          </a>

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
