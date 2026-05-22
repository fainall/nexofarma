import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="NexoFarma"
                width={160}
                height={45}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu farmacia de confianza en Rancagua. Salud integral para toda tu familia, con despacho rápido y atención personalizada.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-sm tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/tienda", label: "Tienda" },
                { href: "/contacto", label: "Contacto" },
                { href: "/carrito", label: "Carrito" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-corp-verde transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-sm tracking-wider mb-4">Categorías</h4>
            <ul className="space-y-2">
              {[
                { href: "/tienda?categoria=medicamentos", label: "Medicamentos" },
                { href: "/tienda?categoria=proteinas", label: "Proteínas" },
                { href: "/tienda?categoria=nutricion-deportiva", label: "Nutrición Deportiva" },
                { href: "/tienda?categoria=vitaminas-y-suplementos", label: "Vitaminas" },
                { href: "/tienda?categoria=dermocosmetica", label: "Dermocosmética" },
                { href: "/tienda?categoria=cuidado-personal", label: "Cuidado Personal" },
                { href: "/tienda?categoria=snacks-saludables", label: "Snacks Saludables" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-corp-verde transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-sm tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-corp-verde shrink-0 mt-0.5" />
                <span>Av. La Compañía 01661, Rancagua</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-corp-verde shrink-0" />
                <span>+56 963 301 6418</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-corp-verde shrink-0" />
                <span>contacto@nexofarma.cl</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-corp-verde shrink-0 mt-0.5" />
                <span>Lun-Sáb: 09:00-21:00<br />Dom: 10:00-20:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NexoFarma. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Farmacia autorizada por el ISP de Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
