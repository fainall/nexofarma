"use client";
import { useState } from "react";
import { Send, Gift } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="newsletter-section text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
            ¡Cuida tu salud con nosotros!
          </h3>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Suscríbete y recibe un <strong className="text-white">10% de descuento</strong> en tu primera compra, además de ofertas exclusivas.
          </p>

          {status === "success" ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 max-w-md mx-auto border border-white/30">
              <p className="text-white font-bold">¡Gracias por suscribirte! Revisa tu correo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="flex-1 px-5 py-3.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3.5 bg-white font-bold rounded-full uppercase tracking-wide hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ color: "var(--color-corp-cian)" }}
              >
                <Send className="w-4 h-4" />
                Suscribirme
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-white/80 text-sm mt-3">Hubo un error. Intenta nuevamente.</p>
          )}
        </div>
      </div>
    </section>
  );
}
