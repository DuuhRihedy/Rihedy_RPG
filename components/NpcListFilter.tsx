"use client";

import { useState } from "react";
import Link from "next/link";

interface NpcItem {
  id: string;
  name: string;
  race: string | null;
  class: string | null;
  level: number | null;
  alignment: string | null;
  type: string;
  status: string;
  edition: string;
  imageUrl: string | null;
  _count: { items: number; campaigns: number };
}

interface NpcListFilterProps {
  npcs: NpcItem[];
}

export default function NpcListFilter({ npcs }: NpcListFilterProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editionFilter, setEditionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = npcs.filter((npc) => {
    if (search) {
      const s = search.toLowerCase();
      const match =
        npc.name.toLowerCase().includes(s) ||
        (npc.race && npc.race.toLowerCase().includes(s)) ||
        (npc.class && npc.class.toLowerCase().includes(s));
      if (!match) return false;
    }
    if (typeFilter !== "all" && npc.type !== typeFilter) return false;
    if (editionFilter !== "all" && npc.edition !== editionFilter) return false;
    if (statusFilter !== "all" && npc.status !== statusFilter) return false;
    return true;
  });

  const counts = {
    total: npcs.length,
    allies: npcs.filter((n) => n.type === "ally").length,
    enemies: npcs.filter((n) => n.type === "enemy").length,
    neutral: npcs.filter((n) => n.type === "neutral").length,
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="npc-filter-bar">
        <div className="npc-filter-search">
          <span className="npc-filter-search-icon">🔍</span>
          <input
            type="text"
            className="input npc-filter-search-input"
            placeholder="Buscar por nome, raça ou classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="npc-filter-clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="npc-filter-chips">
          <div className="npc-filter-group">
            <span className="npc-filter-label">Tipo</span>
            <div className="npc-chip-row">
              {[
                { value: "all", label: "Todos", icon: "👥" },
                { value: "ally", label: `Aliados (${counts.allies})`, icon: "🛡️" },
                { value: "enemy", label: `Inimigos (${counts.enemies})`, icon: "💀" },
                { value: "neutral", label: `Neutros (${counts.neutral})`, icon: "👤" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`npc-chip ${typeFilter === opt.value ? "active" : ""}`}
                  onClick={() => setTypeFilter(opt.value)}
                >
                  <span>{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="npc-filter-group">
            <span className="npc-filter-label">Edição</span>
            <div className="npc-chip-row">
              {[
                { value: "all", label: "Todas" },
                { value: "3.5", label: "D&D 3.5" },
                { value: "5e", label: "D&D 5e" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`npc-chip ${editionFilter === opt.value ? "active" : ""}`}
                  onClick={() => setEditionFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="npc-filter-group">
            <span className="npc-filter-label">Status</span>
            <div className="npc-chip-row">
              {[
                { value: "all", label: "Todos" },
                { value: "alive", label: "Vivos" },
                { value: "dead", label: "Mortos" },
                { value: "missing", label: "Desaparecidos" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`npc-chip ${statusFilter === opt.value ? "active" : ""}`}
                  onClick={() => setStatusFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="npc-filter-meta">
          <span className="npc-filter-count">
            {filtered.length} de {npcs.length} NPCs
          </span>
          <div className="npc-view-toggle">
            <button
              className={`npc-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grade"
            >
              ▦
            </button>
            <button
              className={`npc-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Lista"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>Nenhum NPC encontrado</h3>
          <p>Tente ajustar os filtros</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="npc-grid">
          {filtered.map((npc, i) => (
            <Link
              key={npc.id}
              href={`/npcs/${npc.id}`}
              className="card card-interactive npc-card"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {npc.imageUrl ? (
                <img src={npc.imageUrl} alt={npc.name} className="npc-card-img" />
              ) : (
                <div className={`npc-card-avatar npc-card-avatar-${npc.type === "enemy" ? "enemy" : npc.type === "ally" ? "ally" : "neutral"}`}>
                  {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                </div>
              )}
              <div className="npc-card-info">
                <div className="npc-card-name">{npc.name}</div>
                <div className="npc-card-meta">
                  {[npc.race, npc.class, npc.level ? `Nv ${npc.level}` : null].filter(Boolean).join(" · ") || "Sem detalhes"}
                </div>
                <div className="npc-card-tags">
                  <span className={`badge ${npc.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                    {npc.edition}
                  </span>
                  {npc.status === "dead" && <span className="badge" style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}>Morto</span>}
                  {npc.status === "missing" && <span className="badge" style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}>Desaparecido</span>}
                  {npc._count.campaigns > 0 && (
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                      ⚔️ {npc._count.campaigns}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="npc-list-view">
          {filtered.map((npc, i) => (
            <Link
              key={npc.id}
              href={`/npcs/${npc.id}`}
              className="npc-list-item"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              {npc.imageUrl ? (
                <img src={npc.imageUrl} alt={npc.name} className="npc-list-avatar" />
              ) : (
                <div className={`npc-list-avatar-placeholder npc-card-avatar-${npc.type === "enemy" ? "enemy" : npc.type === "ally" ? "ally" : "neutral"}`}>
                  {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                </div>
              )}
              <div className="npc-list-info">
                <strong>{npc.name}</strong>
                <span className="npc-list-meta">
                  {[npc.race, npc.class, npc.level ? `Nv ${npc.level}` : null].filter(Boolean).join(" · ") || "Sem detalhes"}
                </span>
              </div>
              <div className="npc-list-tags">
                <span className={`badge ${npc.edition === "3.5" ? "badge-35" : "badge-5e"}`}>{npc.edition}</span>
                {npc.status === "dead" && <span className="badge" style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}>Morto</span>}
              </div>
              <span className="npc-list-arrow">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
