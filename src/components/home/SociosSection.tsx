"use client";
import { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle, Loader2, Users, Heart, Shield, Star } from "lucide-react";

const benefits = [
  { icon: Star, text: "Descuentos exclusivos para socios" },
  { icon: Heart, text: "Atención preferencial en farmacia" },
  { icon: Shield, text: "Seguimiento personalizado de tratamientos" },
  { icon: Users, text: "Acceso a promociones anticipadas" },
];

export default function SociosSection() {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Formatear RUT mientras escribe
  const handleRutChange = (value: string) => {
    let cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleaned.length > 9) cleaned = cleaned.slice(0, 9);

    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setForm((f) => ({ ...f, rut: `${formatted}-${dv}` }));
    } else {
      setForm((f) => ({ ...f, rut: cleaned }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/socios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setForm({ nombre: "", rut: "", telefono: "", email: "", direccion: "" });
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="socios-section py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="socios-blob socios-blob-1" />
      <div className="socios-blob socios-blob-2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full hero-badge">
              <UserPlus className="w-4 h-4 text-corp-cian" />
              <span className="text-xs font-bold uppercase tracking-widest text-corp-cian">
                Programa de Socios
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">
              <span className="gradient-text">Únete a nuestra</span>
              <br />
              <span style={{ color: "var(--color-text-title)" }}>comunidad</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Regístrate como socio NexoFarma y accede a beneficios exclusivos,
              descuentos especiales y atención personalizada por nuestro equipo de
              químicos farmacéuticos.
            </p>

            <div className="space-y-4 pt-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-corp flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <b.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="socios-form-card">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black uppercase" style={{ color: "var(--color-text-title)" }}>
                  ¡Bienvenido!
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Tu registro como socio NexoFarma ha sido exitoso. Pronto recibirás
                  información sobre tus beneficios exclusivos.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-gradient-outline text-sm px-6 py-2.5 mt-2"
                >
                  Registrar otro socio
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: "var(--color-text-title)" }}>
                    Formulario de Registro
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">Completa tus datos para ser socio</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="socios-label">Nombre completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez González"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="socios-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="socios-label">RUT</label>
                      <input
                        type="text"
                        required
                        placeholder="12.345.678-9"
                        value={form.rut}
                        onChange={(e) => handleRutChange(e.target.value)}
                        className="socios-input"
                      />
                    </div>
                    <div>
                      <label className="socios-label">Teléfono</label>
                      <input
                        type="tel"
                        required
                        placeholder="+56 9 1234 5678"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        className="socios-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="socios-label">Correo electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.cl"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="socios-input"
                    />
                  </div>

                  <div>
                    <label className="socios-label">Dirección</label>
                    <input
                      type="text"
                      required
                      placeholder="Av. Ejemplo 1234, Rancagua"
                      value={form.direccion}
                      onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                      className="socios-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient w-full text-base py-4 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Registrarme como Socio
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
