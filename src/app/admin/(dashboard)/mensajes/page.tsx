"use client";
import { useEffect, useState, useCallback } from "react";
import { Mail, MailOpen, Search, Loader2, Trash2, Eye, X, Clock, User, Phone } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MensajesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (filter !== "all") params.set("filter", filter);
      const res = await fetch(`/api/mensajes?${params}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const toggleRead = async (msg: Message) => {
    try {
      await fetch(`/api/mensajes/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !msg.read }),
      });
      fetchMessages();
      if (selected?.id === msg.id) {
        setSelected({ ...msg, read: !msg.read });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    try {
      await fetch(`/api/mensajes/${id}`, { method: "DELETE" });
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await fetch(`/api/mensajes/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      fetchMessages();
    }
  };

  const filters = [
    { key: "all" as const, label: "Todos" },
    { key: "unread" as const, label: "Sin leer" },
    { key: "read" as const, label: "Leídos" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Mensajes</h1>
          <p className="text-sm text-gray-500 mt-1">{total} mensaje{total !== 1 ? "s" : ""} de contacto</p>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === f.key
                  ? "bg-gradient-corp text-white shadow-corp"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-corp-cian animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No hay mensajes</p>
              <p className="text-gray-400 text-sm mt-1">Los mensajes de contacto aparecerán aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === msg.id ? "bg-corp-verde/5 border-l-4 border-corp-verde" : ""
                  } ${!msg.read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!msg.read ? "bg-corp-cian" : "bg-transparent"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${!msg.read ? "font-bold text-gray-900" : "font-semibold text-gray-600"}`}>
                          {msg.name}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString("es-CL")}
                        </span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${!msg.read ? "font-semibold text-gray-700" : "text-gray-500"}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Pág. {page}/{totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  ←
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              {/* Detail Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 truncate">{selected.subject}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRead(selected)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={selected.read ? "Marcar como no leído" : "Marcar como leído"}
                  >
                    {selected.read ? <MailOpen className="w-4 h-4 text-gray-400" /> : <Mail className="w-4 h-4 text-corp-cian" />}
                  </button>
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Info */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-corp flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{selected.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900">{selected.name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selected.email}
                      </span>
                      {selected.phone && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {selected.phone}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selected.createdAt).toLocaleString("es-CL", {
                          day: "numeric", month: "long", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="px-6 py-6 flex-1">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold">Selecciona un mensaje</p>
              <p className="text-gray-400 text-sm mt-1">Haz clic en un mensaje para ver su contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
