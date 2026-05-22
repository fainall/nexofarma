import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Pill, Sparkles, Leaf, Heart } from "lucide-react";

const categories = [
  {
    slug: "medicamentos",
    name: "Medicamentos",
    icon: Pill,
    desc: "Tratamientos farmacéuticos con asesoría profesional QF para tu bienestar.",
    badge: "Más vendido",
    image: "/images/categories/medicamentos.jpg",
  },
  {
    slug: "dermocosmetica",
    name: "Dermocosmética",
    icon: Sparkles,
    desc: "Cuidado profesional de tu piel con las mejores marcas dermatológicas.",
    badge: "Premium",
    image: "/images/categories/dermocosmetica.jpg",
  },
  {
    slug: "vitaminas-y-suplementos",
    name: "Vitaminas y Suplementos",
    icon: Leaf,
    desc: "Refuerza tu bienestar diario con suplementos de calidad certificada.",
    badge: "Natural",
    image: "/images/categories/vitaminas.jpg",
  },
  {
    slug: "cuidado-personal",
    name: "Cuidado Personal",
    icon: Heart,
    desc: "Higiene y cuidado del día a día para toda la familia.",
    badge: "Esencial",
    image: "/images/categories/cuidado-personal.jpg",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="section-title" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            Explora nuestro <span className="gradient-text">Catálogo</span>
          </h2>
        </div>

        <div className="elite-container">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tienda?categoria=${cat.slug}`}
              className="elite-card"
            >
              <div
                className="elite-bg"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="elite-overlay" />
              {/* Logo watermark */}
              <div className="elite-logo">
                <Image
                  src="/images/logo.png"
                  alt="NexoFarma"
                  width={120}
                  height={35}
                  className="elite-logo-img"
                />
              </div>

              <div className="elite-content">
                <span className="elite-top-badge">{cat.badge}</span>

                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="elite-icon-glass">
                    <cat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="elite-card-title">{cat.name}</h3>
                </div>

                <p className="elite-desc">{cat.desc}</p>

                <span className="elite-action">
                  Explorar <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
