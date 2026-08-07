"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Clock, MapPin, Navigation, PartyPopper } from "lucide-react";

/* Fin del evento: domingo 9 de agosto 2026 a las 00:00 (deja de mostrarse solo) */
const EVENT_END = new Date("2026-08-09T00:00:00-04:00");
const STORAGE_KEY = "nexofarma-inauguracion-2026-08-08";

const MAPS_URL =
  "https://maps.google.com/?q=Avenida+la+Compa%C3%B1%C3%ADa+01661,+Rancagua";

const CONFETTI = [
  { left: "5%", delay: "0s", duration: "3.4s", color: "#1E7B3C", w: 6, h: 11 },
  { left: "13%", delay: "1.1s", duration: "4.1s", color: "#14396B", w: 7, h: 7 },
  { left: "21%", delay: "0.4s", duration: "3.7s", color: "#00C4B3", w: 5, h: 12 },
  { left: "29%", delay: "2.0s", duration: "4.4s", color: "#27A052", w: 8, h: 8 },
  { left: "37%", delay: "0.8s", duration: "3.2s", color: "#14396B", w: 6, h: 10 },
  { left: "45%", delay: "1.6s", duration: "4.0s", color: "#00908F", w: 7, h: 7 },
  { left: "53%", delay: "0.2s", duration: "3.9s", color: "#1E7B3C", w: 5, h: 11 },
  { left: "61%", delay: "2.3s", duration: "3.5s", color: "#2F6FB8", w: 8, h: 8 },
  { left: "69%", delay: "0.9s", duration: "4.3s", color: "#27A052", w: 6, h: 12 },
  { left: "77%", delay: "1.9s", duration: "3.6s", color: "#14396B", w: 7, h: 7 },
  { left: "85%", delay: "0.6s", duration: "4.2s", color: "#00C4B3", w: 5, h: 10 },
  { left: "93%", delay: "1.4s", duration: "3.8s", color: "#1E7B3C", w: 7, h: 9 },
];

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Date.now() > EVENT_END.getTime()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* ── Cabecera festiva ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F2C56] via-[#14396B] to-[#1E7B3C] px-6 pt-7 pb-9 text-center">
          {/* Confeti */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: c.left,
                  width: `${c.w}px`,
                  height: `${c.h}px`,
                  background: c.color,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                }}
              />
            ))}
          </div>

          {/* Globos decorativos */}
          <div className="absolute -left-6 top-8 w-24 h-28 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
          <div className="absolute -right-6 top-4 w-24 h-28 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-white/90">
                <PartyPopper className="w-3 h-3" />
                Nueva fecha
              </span>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-lg">
                <Image
                  src="/images/logo.png"
                  alt="NexoFarma"
                  width={200}
                  height={55}
                  className="h-11 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-white/80 text-sm font-medium mb-1">¡Estás invitado a nuestra</p>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Inauguración!
            </h3>
          </div>

          {/* Onda inferior */}
          <svg
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            className="absolute -bottom-px left-0 w-full h-6"
            aria-hidden="true"
          >
            <path d="M0 12C80 24 160 0 240 10C300 17 350 24 400 16V24H0V12Z" fill="white" />
          </svg>
        </div>

        {/* ── Cuerpo ── */}
        <div className="px-6 pt-5 pb-6">
          <p className="text-center text-gray-500 text-sm leading-relaxed mb-5">
            Acompáñanos a celebrar este gran comienzo juntos en Rancagua.
          </p>

          <div className="space-y-2.5 mb-6">
            {[
              { icon: Calendar, label: "Fecha", value: "Sábado 8 de agosto de 2026" },
              { icon: Clock, label: "Hora", value: "10:30 AM" },
              { icon: MapPin, label: "Lugar", value: "Av. La Compañía 01661, Rancagua" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14396B] to-[#1E7B3C] flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {row.label}
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-snug">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#14396B] to-[#1E7B3C] hover:from-[#1a4680] hover:to-[#27A052] text-white font-bold text-sm transition-all duration-300 hover:shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
          </a>

          <button
            onClick={handleClose}
            className="w-full mt-2 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Seguir navegando
          </button>

          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-[#1E7B3C] mt-3">
            ¡Te esperamos! · Más cerca de ti, siempre
          </p>
        </div>
      </div>
    </div>
  );
}
