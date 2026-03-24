"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    section: "Principal",
    items: [
      { href: "/", icon: "📊", label: "Dashboard" },
      { href: "/campanhas", icon: "⚔️", label: "Campanhas" },
    ],
  },
  {
    section: "Banco Global",
    items: [
      { href: "/npcs", icon: "👥", label: "Banco de NPCs" },
    ],
  },
  {
    section: "Conhecimento",
    items: [
      { href: "/acervo", icon: "📚", label: "Acervo de Regras" },
      { href: "/assistente", icon: "🤖", label: "Assistente IA" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeEdition, setActiveEdition] = useState<"3.5" | "5e">("3.5");

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
            <div className="sidebar-section-label">{section.section}</div>
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
