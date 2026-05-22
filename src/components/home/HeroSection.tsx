"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { Shield, Truck, ArrowRight, Star, Heart } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(animate, 300);
    return () => clearTimeout(timer);
  }, [target, inView]);

  return <span ref={ref}>{count.toLocaleString("es-CL")}{suffix}</span>;
}

// Stagger children animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const floatingCard = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
});

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => { setMounted(true); }, []);

  // Smooth spring physics for parallax
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms for each card
  const card1X = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const card1Y = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const card2X = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const card2Y = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const card3X = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const card3Y = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  // Pharmacist subtle parallax
  const pharmX = useTransform(smoothX, [-0.5, 0.5], [5, -5]);
  const pharmY = useTransform(smoothY, [-0.5, 0.5], [3, -3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const hero = heroRef.current;
    hero?.addEventListener("mousemove", handleMouseMove);
    return () => hero?.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={heroRef} className="hero-section relative min-h-[75vh] sm:min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden">
      {/* Background pharmacy image — blurred */}
      <div className="hero-bg-image" />

      {/* Ambient blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {/* Subtle dot grid */}
      <div className="hero-dot-grid" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left — Content */}
          <motion.div
            className="space-y-7 max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full hero-badge">
              <span className="hero-badge-dot" />
              <span className="text-xs font-bold uppercase tracking-widest text-corp-cian">
                Muy pronto en Rancagua
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-7xl font-black uppercase tracking-tighter leading-[0.92]"
            >
              <span className="gradient-text">Tu nueva</span>
              <br />
              <span className="gradient-text">Farmacia</span>
              <br />
              <span className="hero-title-accent">
                de confianza
                <svg className="hero-title-underline" viewBox="0 0 280 12" fill="none">
                  <motion.path
                    d="M2 8.5C50 2.5 120 2 140 5C160 8 230 10 278 4"
                    stroke="url(#underlineGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={mounted ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="underlineGrad" x1="0" y1="6" x2="280" y2="6">
                      <stop stopColor="#00C4B3" />
                      <stop offset="1" stopColor="#00908F" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-500 max-w-md leading-relaxed">
              Salud integral para tu familia. Elevamos el estándar farmacéutico con despacho rápido, atención personalizada y asesoría profesional.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/tienda" className="btn-gradient text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4">
                Explorar Tienda
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contacto" className="btn-gradient-outline text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4">
                Contactar
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number"><AnimatedCounter target={500} suffix="+" /></span>
                <span className="hero-stat-label">Productos</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number"><AnimatedCounter target={24} suffix="h" /></span>
                <span className="hero-stat-label">Despacho</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">4.9</span>
                <span className="hero-stat-label">Valoración</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Pharmacist visual */}
          <div className="relative hidden lg:flex justify-center items-end h-[580px]">
            {/* Background circle / pedestal */}
            <div className="hero-circle-bg">
              <div className="hero-circle-inner" />
              <div className="hero-circle-ring" />
            </div>

            {/* Pharmacist */}
            <motion.div
              className="relative z-10 flex items-end justify-center h-full"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={mounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
              style={{ x: pharmX, y: pharmY }}
            >
              <Image
                src="/images/farmaceutica.png"
                alt="Químico Farmacéutico NexoFarma"
                width={420}
                height={530}
                className="hero-pharmacist-img"
                priority
              />
            </motion.div>

            {/* Floating Card 1 — Salud Integral (top-left) */}
            <motion.div
              className="hero-floating-card hero-fc-1"
              variants={floatingCard(0.6)}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              style={{ x: card1X, y: card1Y }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="hero-card-icon">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Salud Integral</p>
                <p className="text-[11px] text-white/70">Protección total</p>
              </div>
            </motion.div>

            {/* Floating Card 2 — Despacho (right-middle) */}
            <motion.div
              className="hero-floating-card hero-fc-2"
              variants={floatingCard(0.8)}
              initial="hidden"
              animate="visible"
              style={{ x: card2X, y: card2Y }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="hero-card-icon">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Despacho 24h</p>
                <p className="text-[11px] text-white/70">Rápido y seguro</p>
              </div>
            </motion.div>

            {/* Floating Card 3 — Rating (bottom-right) */}
            <motion.div
              className="hero-floating-card hero-fc-3"
              variants={floatingCard(1.0)}
              initial="hidden"
              animate="visible"
              style={{ x: card3X, y: card3Y }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="hero-card-icon-sm">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">4.9 / 5.0</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ISP Certified badge */}
            <motion.div
              className="hero-certified"
              initial={{ opacity: 0, y: 15 }}
              animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Shield className="w-4 h-4 text-white" />
              <span>ISP Certificada</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
