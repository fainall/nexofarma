import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NexoFarma | Tu Farmacia de Confianza en Rancagua",
    template: "%s | NexoFarma",
  },
  description: "Farmacia online con despacho rápido en Chile. Medicamentos, dermocosmética, vitaminas y cuidado personal. Atención farmacéutica personalizada.",
  keywords: ["farmacia", "rancagua", "medicamentos", "dermocosmetica", "vitaminas", "chile"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
