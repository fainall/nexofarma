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
              Tu farmacia de confianza en Rancagua. Salud integral para toda tu familia, con atención personalizada y asesoría profesional.
            </p>
            <a
              href="https://www.instagram.com/nexofarma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-5 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span className="text-sm font-bold">@nexofarma</span>
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase text-sm tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/tienda", label: "Tienda" },
                { href: "/nexonatural", label: "NexoNaturals" },
                { href: "/contacto", label: "Contacto" },
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
                <span>+56 994 055 489</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-corp-verde shrink-0" />
                <span>contacto@nexofarma.cl</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-corp-verde shrink-0 mt-0.5" />
                <span>Lun-Vie: 09:30-21:00<br />Sáb-Dom: 10:00-19:00</span>
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
