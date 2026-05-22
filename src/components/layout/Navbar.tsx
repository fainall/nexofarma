"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Pill,
  Sparkles,
  Leaf,
  Heart,
  Dumbbell,
  Zap,
  Cookie,
  Scale,
  Watch,
  Package,
  Search,
  ArrowRight,
  Store,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

/* ─── Icon map ─── */
const iconMap: Record<string, React.ElementType> = {
  Pill,
  Sparkles,
  Leaf,
  Heart,
  Dumbbell,
  Zap,
  Cookie,
  Scale,
  Watch,
  Package,
};

/* ─── Types ─── */
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count: { products: number };
}

/* ─── Category groups for mega menu columns ─── */
const categoryGroups: Record<string, { label: string; slugs: string[] }> = {
  salud: {
    label: "Salud y Bienestar",
    slugs: ["medicamentos", "vitaminas-y-suplementos", "control-de-peso"],
  },
  deporte: {
    label: "Nutrición Deportiva",
    slugs: ["proteinas", "nutricion-deportiva", "snacks-saludables"],
  },
  cuidado: {
    label: "Cuidado y Belleza",
    slugs: ["dermocosmetica", "cuidado-personal", "accesorios-deportivos"],
  },
};

/* ─── Navigation links ─── */
const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleMegaEnter = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const getCategoriesByGroup = (groupKey: string) => {
    const group = categoryGroups[groupKey];
    if (!group) return [];
    return group.slugs
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter(Boolean) as Category[];
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Package;
    return iconMap[iconName] || Package;
  };

  const totalProducts = categories.reduce(
    (sum, c) => sum + (c._count?.products || 0),
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tienda?buscar=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
            : "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
        )}
      >
        {/* ── Top bar ── */}
        <div className="hidden lg:block bg-gradient-corp">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8">
            <div className="flex items-center gap-6 text-[11px] text-white/90 font-medium">
              <span>📍 Av. La Compañía 01661, Rancagua</span>
              <span className="w-px h-3 bg-white/30" />
              <span>📱 +56 963 301 6418</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/90 font-medium">
              <span>🚚 Despacho 24h en Rancagua</span>
              <span className="w-px h-3 bg-white/30" />
              <span>Lun-Sáb 09:00-21:00</span>
            </div>
          </div>
        </div>

        {/* ── Main navbar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo.png"
                alt="NexoFarma"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-corp-cian transition-colors uppercase tracking-wide rounded-lg hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}

              {/* Tienda mega menu trigger */}
              <div
                ref={megaRef}
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all",
                    megaOpen
                      ? "text-corp-cian bg-corp-verde/5"
                      : "text-gray-600 hover:text-corp-cian hover:bg-gray-50"
                  )}
                  onClick={() => setMegaOpen(!megaOpen)}
                >
                  <Store className="w-4 h-4" />
                  Tienda
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      megaOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* ── Mega Menu Panel ── */}
                <div
                  className={cn(
                    "absolute top-full -left-40 pt-2 transition-all duration-200",
                    megaOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <div className="w-[780px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Mega header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                          Nuestras Categorías
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {totalProducts} productos disponibles
                        </p>
                      </div>
                      <Link
                        href="/tienda"
                        onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-corp-cian hover:text-corp-verde transition-colors"
                      >
                        Ver todo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Mega body — 3 columns */}
                    <div className="grid grid-cols-3 divide-x divide-gray-100">
                      {Object.entries(categoryGroups).map(
                        ([key, group]) => (
                          <div key={key} className="p-5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">
                              {group.label}
                            </h4>
                            <div className="space-y-1">
                              {getCategoriesByGroup(key).map((cat) => {
                                const Icon = getIcon(cat.icon);
                                return (
                                  <Link
                                    key={cat.id}
                                    href={`/tienda?categoria=${cat.slug}`}
                                    onClick={() => setMegaOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-corp-verde/5 transition-all group/item"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-gradient-corp flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm">
                                      <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-gray-800 group-hover/item:text-corp-cian transition-colors">
                                        {cat.name}
                                      </p>
                                      <p className="text-[11px] text-gray-400">
                                        {cat._count.products} productos
                                      </p>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover/item:text-corp-cian transition-colors" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Mega footer — promo banner */}
                    <div className="bg-gradient-corp px-6 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💊</span>
                        <div>
                          <p className="text-sm font-bold text-white">
                            ¿Necesitas asesoría farmacéutica?
                          </p>
                          <p className="text-[11px] text-white/70">
                            Nuestro QF Virtual te ayuda 24/7
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/contacto"
                        onClick={() => setMegaOpen(false)}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors backdrop-blur-sm"
                      >
                        Contactar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setMenuOpen(false);
                }}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  searchOpen
                    ? "bg-corp-verde/10 text-corp-cian"
                    : "hover:bg-gray-100 text-gray-600"
                )}
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart - hidden while store is in catalog-only mode */}
              {/* <Link
                href="/carrito"
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-corp text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </Link> */}

              {/* Mobile menu toggle */}
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setSearchOpen(false);
                }}
                className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search bar (slides down) ── */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 border-t border-gray-100",
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0 border-t-0"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, vitaminas, medicamentos..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-corp-verde/30 border border-gray-200"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-corp text-white text-sm font-bold rounded-xl hover:shadow-corp transition-all"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            menuOpen
              ? "max-h-[80vh] opacity-100 border-t border-gray-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 py-4 space-y-1 bg-white max-h-[70vh] overflow-y-auto">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-corp-verde/5 hover:text-corp-cian rounded-xl transition-colors uppercase tracking-wide"
            >
              Inicio
            </Link>

            {/* Tienda with expandable categories */}
            <div>
              <button
                onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide rounded-xl transition-colors",
                  mobileSubmenuOpen
                    ? "text-corp-cian bg-corp-verde/5"
                    : "text-gray-700 hover:bg-corp-verde/5 hover:text-corp-cian"
                )}
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Tienda
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    mobileSubmenuOpen && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  mobileSubmenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {/* Ver toda la tienda */}
                <Link
                  href="/tienda"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 ml-4 text-sm font-bold text-corp-cian hover:bg-corp-verde/5 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Ver toda la tienda
                </Link>

                <div className="ml-4 border-l-2 border-corp-verde/20 pl-2 mt-1 space-y-0.5">
                  {Object.entries(categoryGroups).map(([key, group]) => (
                    <div key={key}>
                      <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {group.label}
                      </p>
                      {getCategoriesByGroup(key).map((cat) => {
                        const Icon = getIcon(cat.icon);
                        return (
                          <Link
                            key={cat.id}
                            href={`/tienda?categoria=${cat.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-corp-verde/5 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-md bg-gradient-corp flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-gray-400 ml-auto">
                              {cat._count?.products || 0}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-corp-verde/5 hover:text-corp-cian rounded-xl transition-colors uppercase tracking-wide"
            >
              Contacto
            </Link>

            {/* Mobile promo bar */}
            <div className="mt-3 mx-1 bg-gradient-corp rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-xs font-bold text-white">
                  Despacho 24h en Rancagua
                </p>
                <p className="text-[10px] text-white/70">
                  Envíos a todo Chile
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega menu backdrop */}
      {megaOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 backdrop-blur-[1px]"
          onClick={() => setMegaOpen(false)}
        />
      )}
    </>
  );
}
