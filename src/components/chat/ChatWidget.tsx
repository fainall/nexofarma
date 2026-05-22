"use client";
import { useState, useRef, useEffect, Fragment } from "react";
import { X, Send, Pill, Stethoscope } from "lucide-react";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ──────────────────────────────────────────── */
/* Renderizador de Markdown simple              */
/* ──────────────────────────────────────────── */
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, li) => {
        // Empty line → line break
        if (line.trim() === "") return <br key={li} />;

        // Parse inline: **bold**, *italic*, `code`
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
        const rendered = parts.map((part, pi) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={pi} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
            return <em key={pi}>{part.slice(1, -1)}</em>;
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={pi} className="bg-black/5 px-1 rounded text-xs">{part.slice(1, -1)}</code>;
          }
          return <Fragment key={pi}>{part}</Fragment>;
        });

        // Bullet lines
        if (line.trimStart().startsWith("• ") || line.trimStart().startsWith("- ")) {
          const content = line.trimStart().replace(/^[•\-]\s*/, "");
          const bulletParts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((p, pi) => {
            if (p.startsWith("**") && p.endsWith("**")) return <strong key={pi} className="font-bold">{p.slice(2, -2)}</strong>;
            if (p.startsWith("*") && p.endsWith("*")) return <em key={pi}>{p.slice(1, -1)}</em>;
            return <Fragment key={pi}>{p}</Fragment>;
          });
          return (
            <div key={li} className="flex gap-1.5 ml-1 my-0.5">
              <span className="text-corp-cian mt-0.5 shrink-0">•</span>
              <span>{bulletParts}</span>
            </div>
          );
        }

        // Numbered lines (1. 2. etc.)
        const numMatch = line.trimStart().match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const content = numMatch[2];
          const numParts = content.split(/(\*\*.*?\*\*)/g).map((p, pi) => {
            if (p.startsWith("**") && p.endsWith("**")) return <strong key={pi} className="font-bold">{p.slice(2, -2)}</strong>;
            return <Fragment key={pi}>{p}</Fragment>;
          });
          return (
            <div key={li} className="flex gap-1.5 ml-1 my-0.5">
              <span className="text-corp-cian font-bold shrink-0">{numMatch[1]}.</span>
              <span>{numParts}</span>
            </div>
          );
        }

        return <p key={li} className="my-0.5">{rendered}</p>;
      })}
    </>
  );
}

/* ──────────────────────────────────────────── */
/* Chips de sugerencias rápidas                 */
/* ──────────────────────────────────────────── */
const quickSuggestions = [
  { label: "💊 Dolor de cabeza", text: "Tengo dolor de cabeza" },
  { label: "🤒 Tengo fiebre", text: "Tengo fiebre" },
  { label: "🤧 Resfriado", text: "Estoy resfriado" },
  { label: "📍 Horarios", text: "¿Cuál es el horario?" },
  { label: "🚚 Despacho", text: "¿Hacen despacho?" },
  { label: "💪 Vitaminas", text: "¿Qué vitaminas recomiendan?" },
];

/* ──────────────────────────────────────────── */
/* Indicador de escritura (3 dots)              */
/* ──────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        <span className="w-2 h-2 bg-corp-cian/60 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-corp-cian/60 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-corp-cian/60 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────── */
/* Widget principal                             */
/* ──────────────────────────────────────────── */
const WELCOME_MSG = `¡Hola! 👋 Soy el **QF Virtual** de NexoFarma, tu asistente farmacéutico.

Puedo ayudarte con:
• Información sobre **medicamentos** de venta libre
• Recomendaciones para **síntomas comunes**
• **Horarios**, ubicación y despacho
• Consultas sobre **vitaminas** y suplementos

¿En qué puedo ayudarte hoy?`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME_MSG },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setInput("");
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!res.ok) throw new Error("Error en la respuesta");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu consulta. Intenta nuevamente o contáctanos por **WhatsApp** al **+56 963 301 6418**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group",
          isOpen
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gradient-corp hover:shadow-corp-lg"
        )}
        aria-label="Asistente virtual"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <Stethoscope className="w-7 h-7 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-corp-verde/30 animate-ping opacity-75 pointer-events-none" />
          </>
        )}
      </button>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="fixed bottom-[72px] sm:bottom-[84px] left-4 sm:left-6 z-50 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg border border-gray-100 animate-fade-in pointer-events-none">
          <p className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            💬 ¿Necesitas ayuda farmacéutica?
          </p>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-[72px] sm:bottom-24 left-2 sm:left-6 z-50 w-[calc(100vw-16px)] sm:w-[380px] max-w-[400px] max-h-[calc(100vh-90px)] sm:max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-corp p-4 flex items-center gap-3 relative overflow-hidden">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1 right-4">
                <Pill className="w-8 h-8 text-white rotate-45" />
              </div>
              <div className="absolute bottom-1 right-16">
                <Pill className="w-5 h-5 text-white -rotate-12" />
              </div>
            </div>

            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm relative z-10 overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="NexoFarma"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="relative z-10">
              <p className="text-white font-bold text-sm">QF Virtual NexoFarma</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-white/80 text-xs">En línea · Químico Farmacéutico</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] min-h-[220px] bg-gray-50/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {/* Bot avatar */}
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-corp flex items-center justify-center shrink-0 mt-1">
                    <Stethoscope className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-gradient-corp text-white rounded-br-sm"
                      : "bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <RenderMarkdown text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-3 pb-2 pt-1 border-t border-gray-100 bg-white">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2 px-1">
                Consultas frecuentes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.text)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-corp-verde/10 border border-gray-200 hover:border-corp-verde/30 rounded-full text-xs font-medium text-gray-600 hover:text-corp-cian transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: ¿Qué tomo para el dolor de cabeza?"
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-corp-verde/30 border border-gray-200"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-gradient-corp rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:shadow-corp transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              ⚕️ Información orientativa. Consulte siempre a un profesional de salud.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
