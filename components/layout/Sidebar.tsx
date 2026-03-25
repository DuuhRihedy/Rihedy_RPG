"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CampaignLink {
  id: string;
  name: string;
}

const NAV_ITEMS = [
  {
    section: "Principal",
    items: [
      { href: "/", icon: "📊", label: "Dashboard" },
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
      { href: "/npcs", icon: "👥", label: "Banco de NPCs" },
    ],
  },
  {
    section: "Ferramentas",
    items: [
      { href: "/ferramentas/dados", icon: "🎲", label: "Rolador de Dados" },
      { href: "/ferramentas/gerador-npc", icon: "🧙", label: "Gerador de NPC" },
      { href: "/ferramentas/encontros", icon: "⚔️", label: "Encontros & Loot" },
      { href: "/ferramentas/calculadoras", icon: "🧮", label: "Calculadoras" },
      { href: "/ferramentas/homebrew", icon: "🛠️", label: "Homebrew" },
      { href: "/ferramentas/personagem", icon: "🧙", label: "Criar Personagem" },
      { href: "/ferramentas/mapas", icon: "🗺️", label: "Geradores de Mapas" },
    ],
  },
  {
    section: "Conhecimento",
    items: [
      { href: "/acervo", icon: "📚", label: "Acervo de Regras" },
      { href: "/compendium", icon: "🔮", label: "Compêndio" },
      { href: "/assistente", icon: "🤖", label: "Assistente IA" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeEdition, setActiveEdition] = useState<"3.5" | "5e">("3.5");
  const [campaigns, setCampaigns] = useState<CampaignLink[]>([]);
  const [campaignsExpanded, setCampaignsExpanded] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns-sidebar")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});
  }, []);

  return (
    <aside className="sidebar">
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

      {/* Footer — Edition Toggle */}
      <div className="sidebar-footer">
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
      </div>
    </aside>
  );
}
