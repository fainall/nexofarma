"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("nexofarma-popup-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("nexofarma-popup-dismissed", "1");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="popup-glass relative rounded-3xl p-8 md:p-10 max-w-md w-full text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <Image
          src="/images/logo.png"
          alt="NexoFarma"
          width={200}
          height={55}
          className="mx-auto mb-5 h-14 w-auto object-contain"
        />

        <h3 className="text-2xl font-black uppercase tracking-tight mb-2" style={{ color: "var(--color-text-title)" }}>
          ¡Ya aperturamos!
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Tu nueva farmacia de confianza en Rancagua ya abrió sus puertas. Descubre nuestros productos y aprovecha un <strong className="text-corp-cian">10% de descuento</strong> en tu primera compra.
        </p>

        <Link
          href="/tienda"
          onClick={handleClose}
          className="btn-gradient w-full"
        >
          Explorar Tienda <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
