"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="section-title mb-3">
          <span className="gradient-text">Contáctanos</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">¡Mensaje enviado!</h3>
              <p className="text-green-600">Te responderemos a la brevedad. Gracias por contactarnos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} placeholder="+56 9 XXXX XXXX" />
                <Input label="Asunto" name="subject" value={form.subject} onChange={handleChange} required />
              </div>
              <Textarea label="Mensaje" name="message" value={form.message} onChange={handleChange} required />

              {status === "error" && <p className="text-red-500 text-sm">Error al enviar. Intenta nuevamente.</p>}

              <Button type="submit" loading={status === "loading"} size="lg" className="w-full sm:w-auto">
                <Send className="w-4 h-4" /> Enviar Mensaje
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {[
            { icon: MapPin, title: "Dirección", text: "Av. La Compañía 01661\nRancagua, O'Higgins" },
            { icon: Phone, title: "Teléfono", text: "+56 963 301 6418" },
            { icon: Mail, title: "Email", text: "contacto@nexofarma.cl" },
            { icon: Clock, title: "Horarios", text: "Lun-Sáb: 09:00-21:00\nDom: 10:00-20:00" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
              <div className="w-11 h-11 bg-corp-verde/10 rounded-full flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-corp-cian" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-title uppercase">{item.title}</h5>
                <p className="text-sm text-gray-500 whitespace-pre-line">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
