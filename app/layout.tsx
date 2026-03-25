import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatSidebar } from "@/components/layout/ChatSidebar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";
import "./layout.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Carrega o tema antes do render pra evitar flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("hub-rpg-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />
          <div className="app-main">
            <Header />
            <main className="app-content">
              {children}
            </main>
          </div>
          <ChatSidebar />
          <KeyboardShortcuts />
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
