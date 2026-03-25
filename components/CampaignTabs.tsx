"use client";

import { useState } from "react";

interface CampaignTabsProps {
  defaultTab?: string;
  children: React.ReactNode;
}

const TABS = [
  { id: "overview", icon: "📋", label: "Visão Geral" },
  { id: "story", icon: "📜", label: "História" },
  { id: "sessions", icon: "📖", label: "Sessões" },
  { id: "npcs", icon: "👥", label: "NPCs" },
  { id: "notes", icon: "📝", label: "Notas" },
  { id: "arcs", icon: "🧵", label: "Arcos" },
  { id: "maps", icon: "🗺️", label: "Mapas" },
  { id: "mesa", icon: "🎲", label: "Mesa" },
  { id: "regras", icon: "📚", label: "Regras" },
  { id: "docs", icon: "📄", label: "Documentos" },
];

export default function CampaignTabs({ defaultTab = "overview", children }: CampaignTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <div className="hub-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`hub-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="hub-tab-icon">{tab.icon}</span>
            <span className="hub-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="hub-tab-content">
        {/* Children should be 5 divs with data-tab attribute */}
        {Array.isArray(children)
          ? children.map((child: React.ReactNode, i: number) => {
              const tabId = TABS[i]?.id;
              if (!tabId) return null;
              return (
                <div
                  key={tabId}
                  className={`hub-tab-panel ${activeTab === tabId ? "active" : ""}`}
                >
                  {child}
                </div>
              );
            })
          : children}
      </div>
    </div>
  );
}
