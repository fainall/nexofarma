"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  // ShoppingCart, // Hidden while store is in catalog-only mode
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
// import { useCartStore } from "@/store/cartStore"; // Hidden while store is in catalog-only mode
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
const navLinks: { href: string; label: string; highlight?: boolean }[] = [
  { href: "/", label: "Inicio" },
  { href: "/nexonatural", label: "NexoNaturals", highlight: true },
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
  const [promoHidden, setPromoHidden] = useState(false);
  // const itemCount = useCartStore((s) => s.getItemCount()); // Hidden while store is in catalog-only mode
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

  // Aviso promocional descartado previamente
  useEffect(() => {
    if (localStorage.getItem("nexofarma-promo-hidden") === "1") {
      setPromoHidden(true);
    }
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

  const dismissPromo = () => {
    setPromoHidden(true);
    localStorage.setItem("nexofarma-promo-hidden", "1");
  };

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
              <span>📱 +56 994 055 489</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/90 font-medium">
              <a
                href="https://www.instagram.com/nexofarma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                @nexofarma
              </a>
              <span className="w-px h-3 bg-white/30" />
              <span>Lun-Vie 09:30-21:00 | Sáb-Dom 10:00-19:00</span>
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
                  className={cn(
                    "px-4 py-2 text-sm font-semibold transition-colors uppercase tracking-wide rounded-lg",
                    link.highlight
                      ? "text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5"
                      : "text-gray-600 hover:text-corp-cian hover:bg-gray-50"
                  )}
                >
                  {link.highlight && <Leaf className="w-3.5 h-3.5" />}
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

            {/* NexoNaturals */}
            <Link
              href="/nexonatural"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors uppercase tracking-wide"
            >
              <Leaf className="w-4 h-4" />
              NexoNaturals
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
                  mobileSubmenuOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
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

            {/* Mobile promo bar (descartable) */}
            {!promoHidden && (
              <div className="relative mt-3 mx-1 bg-gradient-corp rounded-xl pl-3 pr-2 py-2.5 flex items-center gap-2">
                <span className="text-lg shrink-0 leading-none">🎉</span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white leading-snug">
                    ¡Ya abrimos en Rancagua!
                  </p>
                  <p className="text-[10px] text-white/75 leading-snug">
                    Lun-Vie 09:30-21:00 · Sáb-Dom 10:00-19:00
                  </p>
                </div>

                <a
                  href="https://www.instagram.com/nexofarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  <span className="text-[10px] font-bold text-white">Síguenos</span>
                </a>

                <button
                  onClick={dismissPromo}
                  aria-label="Ocultar aviso"
                  className="shrink-0 w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}
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
