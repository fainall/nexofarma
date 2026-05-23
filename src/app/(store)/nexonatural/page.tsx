import Image from "next/image";
import Link from "next/link";
import { Leaf, Shield, Sparkles, Heart, ArrowLeft, Droplets, Wheat, Dumbbell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexoNaturals — Suplementos Naturales | NexoFarma",
  description:
    "Línea exclusiva de suplementos naturales NexoNaturals. Productos 100% naturales, sin preservantes, cero azúcar. Disponibles en NexoFarma Rancagua.",
};

const products = [
  {
    name: "Colágeno Forte",
    dosage: "575mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/colageno-forte.jpg",
    color: "from-blue-400 to-blue-600",
    benefit: "Piel, cabello y articulaciones",
    desc: "Suplemento natural con propiedades para la elasticidad e hidratación de la piel. Aporta al tejido cartilaginoso, reduciendo el desgaste de articulaciones y músculos, con impacto positivo en cabello, uñas y piel.",
  },
  {
    name: "Vitamina C",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/vitamina-c.jpg",
    color: "from-orange-400 to-orange-600",
    benefit: "Sistema inmune y antioxidante",
    desc: "Ácido ascórbico que actúa como antioxidante protegiendo las células contra radicales libres. Fortalece el sistema inmune frente a infecciones, favorece la absorción de hierro y la cicatrización.",
  },
  {
    name: "Vitamina D3",
    dosage: "740mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/vitamina-d3.jpg",
    color: "from-sky-400 to-sky-600",
    benefit: "Huesos y sistema inmune",
    desc: "Esencial para dientes y huesos fuertes, ya que aumenta la absorción de calcio. Regula el sistema inmunológico y mantiene los músculos y nervios en buena forma. Conocida como la vitamina del sol.",
  },
  {
    name: "Vitamina E 400 UI",
    dosage: "630mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/vitamina-e.jpg",
    color: "from-amber-500 to-amber-700",
    benefit: "Antioxidante y salud celular",
    desc: "Vitamina liposoluble con potente función antioxidante. Previene el envejecimiento prematuro, posee propiedades cardiovasculares, favorece la cicatrización e impulsa el sistema inmunológico.",
  },
  {
    name: "Vitamina B12",
    dosage: "495mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/vitamina-b12.jpg",
    color: "from-indigo-400 to-indigo-600",
    benefit: "Energía y sistema nervioso",
    desc: "Cianocobalamina esencial para la síntesis de proteína y ADN. Produce glóbulos rojos, da energía, mantiene sanas las células nerviosas y participa en el metabolismo de grasas y carbohidratos.",
  },
  {
    name: "Complejo B",
    dosage: "625mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/complejo-b.jpg",
    color: "from-red-400 to-red-600",
    benefit: "Metabolismo y vitalidad",
    desc: "Fórmula completa de Vitaminas B (B1, B2, B3, B5, B6). Contribuye a la función cerebral, metabolización de nutrientes, desarrollo celular, formación de glóbulos rojos y absorción de hierro.",
  },
  {
    name: "Calcio, Magnesio, Zinc + D3",
    dosage: "669mg",
    caps: "90 cápsulas",
    img: "/images/nexonatural/calcio-magnesio-zinc-d3.jpg",
    color: "from-amber-400 to-orange-500",
    benefit: "Huesos, músculos y defensas",
    desc: "Combina nutrientes esenciales para el sistema óseo e inmunológico. El zinc contribuye a la función cardiovascular, la vitamina D fortalece las defensas y el magnesio es clave para los músculos.",
  },
  {
    name: "Magnesio Complex",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/magnesio-complex.jpg",
    color: "from-teal-400 to-teal-600",
    benefit: "Relajación muscular y sueño",
    desc: "Refuerza la salud cardiovascular y ósea, promueve el metabolismo energético y la función cerebral. Necesario para más de 300 reacciones bioquímicas en el organismo. Apto para veganos.",
  },
  {
    name: "Citrato de Magnesio",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/citrato-magnesio.jpg",
    color: "from-cyan-400 to-cyan-600",
    benefit: "Alta absorción, músculos y nervios",
    desc: "Esencial para el sistema óseo y la función cardíaca. Regula el ritmo cardíaco, mantiene la presión arterial y actúa en la regulación de neurotransmisores, reduciendo estrés y ansiedad.",
  },
  {
    name: "Pre y Probióticos 50 Billones",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/pre-probioticos.jpg",
    color: "from-pink-300 to-blue-400",
    benefit: "Flora intestinal y digestión",
    desc: "Fórmula de 5 cepas a 50 billones con Lactobacillus y Bifidobacterium más inulina como prebiótico. Promueve una flora intestinal saludable, mejora la digestión y fortalece el sistema inmunológico.",
  },
  {
    name: "Creatina Monohydrate",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/creatina.jpg",
    color: "from-gray-600 to-gray-800",
    benefit: "Rendimiento deportivo y fuerza",
    desc: "Molécula de origen proteico con función estructural y energética. Favorece la síntesis de ATP, mejora el rendimiento físico y contribuye al aumento de masa muscular.",
  },
  {
    name: "Berberina",
    dosage: "550mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/berberina.jpg",
    color: "from-pink-400 to-pink-600",
    benefit: "Metabolismo y glucosa",
    desc: "Compuesto natural extraído del agracejo, usado en medicina tradicional china. Reconocido por su capacidad para apoyar el equilibrio metabólico, especialmente en glucosa y metabolismo.",
  },
  {
    name: "Maqui",
    dosage: "480mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/maqui.jpg",
    color: "from-purple-500 to-purple-700",
    benefit: "Superantioxidante chileno",
    desc: "Excelente fuente de antioxidantes, polifenoles y antocianinas, con Vitamina C, Calcio, Hierro y Potasio. Promueve la salud cardiovascular y aporta fibras para la salud intestinal y renal.",
  },
  {
    name: "Té Verde + Vinagre de Manzana",
    dosage: "500mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/te-verde-vinagre.jpg",
    color: "from-green-400 to-green-600",
    benefit: "Control de peso y metabolismo",
    desc: "Fórmula ideal como coadyuvante para el colesterol y la retención de líquidos. El vinagre de manzana absorbe toxinas del metabolismo y el té verde actúa como quemador natural de grasa.",
  },
  {
    name: "Vitacolon",
    dosage: "530mg",
    caps: "60 cápsulas",
    img: "/images/nexonatural/vitacolon.jpg",
    color: "from-fuchsia-400 to-fuchsia-600",
    benefit: "Salud digestiva y colon",
    desc: "Compuesto por manzanilla, aloe vera, bailahuén, jengibre y anís. Promueve digestión equilibrada, previene hinchazón y gases, actúa como antiinflamatorio y favorece la desintoxicación.",
  },
];

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    desc: "Ingredientes de origen natural cuidadosamente seleccionados",
  },
  {
    icon: Shield,
    title: "Sin Preservantes",
    desc: "Fórmulas limpias, sin aditivos artificiales ni conservantes",
  },
  {
    icon: Droplets,
    title: "Cero Azúcar",
    desc: "Libres de azúcares añadidos, aptos para todas las dietas",
  },
  {
    icon: Dumbbell,
    title: "Apto Deportistas",
    desc: "Certificados como alimento para deportistas",
  },
];

export default function NexoNaturalPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-900 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
          {/* Floating leaves pattern */}
          <Leaf className="absolute top-[15%] left-[8%] w-6 h-6 text-emerald-500/20 rotate-45" />
          <Leaf className="absolute top-[25%] right-[12%] w-8 h-8 text-teal-400/15 -rotate-12" />
          <Leaf className="absolute bottom-[20%] left-[15%] w-5 h-5 text-emerald-400/20 rotate-90" />
          <Sparkles className="absolute top-[40%] right-[20%] w-5 h-5 text-emerald-300/15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Marca exclusiva NexoFarma
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-6">
                <span className="text-white">Nexo</span>
                <span className="text-emerald-400">Naturals</span>
              </h1>

              <p className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed max-w-xl mb-4">
                Conecta con lo natural. Nuestra línea exclusiva de suplementos
                formulados con lo mejor de la naturaleza.
              </p>
              <p className="text-sm text-emerald-200/60 max-w-lg">
                15 productos diseñados para tu bienestar, con ingredientes puros y
                fórmulas limpias que cuidan de ti y de tu familia.
              </p>
            </div>

            <div className="w-48 sm:w-56 lg:w-72 shrink-0">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl" />
                <Image
                  src="/images/nexonatural/logo.png"
                  alt="NexoNaturals — Conecta con lo Natural"
                  fill
                  className="object-contain rounded-3xl relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-100/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <v.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1">{v.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-900 mb-3">
              Nuestra línea completa
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              15 suplementos naturales diseñados para cubrir todas tus necesidades de bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Product image */}
                <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Color accent bar */}
                <div className={`h-1 bg-gradient-to-r ${product.color}`} />

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 leading-tight">{product.name}</h3>
                    <span className="text-[10px] sm:text-xs text-gray-400 shrink-0 mt-0.5">
                      {product.dosage} · {product.caps}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
                    {product.desc}
                  </p>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                    <Heart className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-emerald-600 font-semibold leading-tight">
                      {product.benefit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/10 rounded-full blur-2xl" />
              <Leaf className="absolute top-6 right-8 w-8 h-8 text-emerald-400/10 rotate-45" />
              <Wheat className="absolute bottom-8 left-8 w-6 h-6 text-teal-300/10" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                ¿Te interesa algún producto?
              </h3>
              <p className="text-emerald-100/70 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Visítanos en nuestra farmacia o escríbenos por WhatsApp para consultar
                disponibilidad y precios de toda la línea NexoNaturals.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/569633016418?text=Hola!%20Me%20interesan%20los%20productos%20NexoNaturals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
