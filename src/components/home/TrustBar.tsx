import { Truck, Shield, UserCheck, CheckCircle } from "lucide-react";

const items = [
  { icon: Truck, title: "Envíos a todo Chile", desc: "Despacho rápido y seguro a todo el país" },
  { icon: Shield, title: "Pago Seguro", desc: "Webpay / Transferencia bancaria" },
  { icon: UserCheck, title: "Asesoría QF", desc: "Consultas con químicos farmacéuticos" },
  { icon: CheckCircle, title: "Calidad Garantizada", desc: "Laboratorios certificados ISP" },
];

export default function TrustBar() {
  return (
    <section className="py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {items.map((item) => (
            <div key={item.title} className="trust-item group">
              <div className="trust-icon-wrap">
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "var(--color-corp-cian)", transition: "all 0.4s ease" }} />
              </div>
              <h5 className="font-bold text-[11px] sm:text-sm uppercase tracking-wide mb-1 sm:mb-2" style={{ color: "var(--color-corp-verde)" }}>
                {item.title}
              </h5>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed hidden sm:block">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
