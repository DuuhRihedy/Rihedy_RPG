"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEdition } from "@/lib/EditionContext";
import { useAuth } from "@/lib/AuthContext";
import { logout } from "@/lib/actions/auth";

interface CampaignLink {
  id: string;
  name: string;
}

const NAV_ITEMS = [
  {
    section: "Principal",
    items: [
      { href: "/", icon: "🏠", label: "Dashboard" },
    ],
  },
  {
    section: "Campanhas",
    items: [
      { href: "/campanhas", icon: "⚔️", label: "Todas as Campanhas" },
    ],
    hasCampaigns: true,
  },
  {
    section: "Banco Global",
    items: [
      { href: "/npcs", icon: "👥", label: "NPCs" },
    ],
  },
  {
    section: "Ferramentas",
    items: [
      { href: "/ferramentas/dados", icon: "🎲", label: "Rolador de Dados" },
      { href: "/ferramentas/encontros", icon: "⚔️", label: "Encontros & Loot" },
      { href: "/ferramentas/calculadoras", icon: "🧮", label: "Calculadoras" },
      { href: "/ferramentas/mapas", icon: "🗺️", label: "Geradores de Mapas" },
      { href: "/regras-da-casa", icon: "📜", label: "Regras da Casa" },
    ],
  },
  {
    section: "Conhecimento",
    items: [
      { href: "/acervo", icon: "📚", label: "Acervo D&D" },
      { href: "/assistente", icon: "🤖", label: "Assistente IA" },
    ],
  },
  {
    section: "Sistema",
    items: [
      { href: "/configuracoes", icon: "⚙️", label: "Configurações" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { edition: activeEdition, setEdition: setActiveEdition } = useEdition();
  const { name: userName, role: userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const [campaigns, setCampaigns] = useState<CampaignLink[]>([]);
  const [campaignsExpanded, setCampaignsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns-sidebar")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});
  }, []);

  // Fecha sidebar ao navegar no mobile
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  return (
    <>
      {/* Botão hamburger — só aparece no mobile */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay escuro no mobile */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobile} />
      )}

    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚔️</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Hub RPG</span>
          <span className="sidebar-brand-sub">Centro de Comando</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <div
              className="sidebar-section-label"
              onClick={section.hasCampaigns ? () => setCampaignsExpanded(!campaignsExpanded) : undefined}
              style={section.hasCampaigns ? { cursor: "pointer", userSelect: "none" } : undefined}
            >
              {section.section}
              {section.hasCampaigns && (
                <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.5 }}>
                  {campaignsExpanded ? "▼" : "▶"}
                </span>
              )}
            </div>
            {section.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-text">{item.label}</span>
                </Link>
              );
            })}

            {/* Campanhas ativas como sub-links */}
            {section.hasCampaigns && campaignsExpanded && campaigns.length > 0 && (
              <div className="sidebar-campaigns">
                {campaigns.map((c) => {
                  const campHref = `/campanhas/${c.id}`;
                  const isActive = pathname.startsWith(campHref);
                  return (
                    <Link
                      key={c.id}
                      href={campHref}
                      className={`sidebar-link sidebar-link-sub ${isActive ? "active" : ""}`}
                      title={c.name}
                    >
                      <span className="sidebar-link-icon" style={{ fontSize: "10px" }}>🎯</span>
                      <span className="sidebar-link-text sidebar-campaign-name">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{userName}</span>
          <span className="sidebar-user-role">{isAdmin ? "Mestre" : "Jogador"}</span>
        </div>
        <div className="edition-toggle">
          <button
            className={`edition-toggle-btn ${activeEdition === "3.5" ? "active-35" : ""}`}
            onClick={() => setActiveEdition("3.5")}
          >
            D&D 3.5
          </button>
          <button
            className={`edition-toggle-btn ${activeEdition === "5e" ? "active-5e" : ""}`}
            onClick={() => setActiveEdition("5e")}
          >
            D&D 5e
          </button>
        </div>
        <form action={logout}>
          <button type="submit" className="sidebar-logout-btn">
            Sair
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}
