import Image from "next/image";
import Link from "next/link";
import { Leaf, ArrowRight, Sparkles } from "lucide-react";

const featuredProducts = [
  { name: "Colágeno Forte", desc: "575mg · 60 cápsulas", img: "/images/nexonatural/colageno-forte.jpg" },
  { name: "Vitamina C", desc: "500mg · 60 cápsulas", img: "/images/nexonatural/vitamina-c.jpg" },
  { name: "Pre y Probióticos", desc: "50 Billones · 60 cáps.", img: "/images/nexonatural/pre-probioticos.jpg" },
  { name: "Magnesio Complex", desc: "500mg · 60 cápsulas", img: "/images/nexonatural/magnesio-complex.jpg" },
];

export default function NexoNaturalSection() {
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-5">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Marca propia</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4">
            <span className="text-emerald-800">Nexo</span>
            <span className="text-emerald-600">Naturals</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Nuestra línea exclusiva de suplementos naturales. Formulados con ingredientes puros,
            sin preservantes, sin azúcar y libres de calorías.
          </p>
        </div>

        {/* Logo + Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {featuredProducts.map((product) => (
            <div
              key={product.name}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-3 sm:p-5 text-center border-t border-gray-50">
                <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-0.5">{product.name}</h4>
                <p className="text-xs sm:text-sm text-gray-400">{product.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Badges + CTA */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["🌿 100% Natural", "0️⃣ Cero Azúcar", "🚫 Sin Preservantes", "💪 Apto Deportistas"].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full text-xs sm:text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>

          <Link
            href="/nexonatural"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 text-sm sm:text-base"
          >
            <Leaf className="w-5 h-5" />
            Ver toda la línea NexoNaturals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
