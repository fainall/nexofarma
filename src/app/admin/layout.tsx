export const metadata = {
  title: { default: "Admin | NexoFarma", template: "%s | Admin NexoFarma" },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
