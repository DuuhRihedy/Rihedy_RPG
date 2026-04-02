import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";
import "./layout.css";

export const metadata: Metadata = {
  title: "Hub RPG — Centro de Comando do Mestre",
  description:
    "Hub personalizado para gerenciamento de campanhas de RPG com inteligência artificial. D&D 3.5 e 5e.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hub RPG",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
