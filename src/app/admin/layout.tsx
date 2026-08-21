import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin | NexoFarma", template: "%s | Admin NexoFarma" },
  // El panel no debe aparecer en buscadores
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
