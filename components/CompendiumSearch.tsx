"use client";

import { useState, useEffect, useCallback } from "react";
import { useEdition } from "@/lib/EditionContext";

interface CompendiumResult {
  id: string;
  category: string;
  name: string;
  namePtBr: string;
  edition: string;
  data: Record<string, unknown>;
  tags: string[];
}

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  all: { icon: "📚", label: "Todos", color: "var(--dnd-gold)" },
  spell: { icon: "✨", label: "Magias", color: "var(--arcane)" },
  monster: { icon: "🐉", label: "Monstros", color: "var(--danger)" },
  class: { icon: "⚔️", label: "Classes", color: "var(--success)" },
  feat: { icon: "🎯", label: "Talentos", color: "var(--warning)" },
  equipment: { icon: "🛡️", label: "Equipamentos", color: "var(--info)" },
  magicItem: { icon: "💎", label: "Itens Mágicos", color: "var(--arcane)" },
};

export default function CompendiumSearch() {
  const { edition: globalEdition } = useEdition();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [edition, setEdition] = useState(globalEdition as string);
  const [results, setResults] = useState<CompendiumResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CompendiumResult | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    setEdition(globalEdition);
  }, [globalEdition]);

  useEffect(() => {
    fetch("/api/compendium/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.breakdown || {}))
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category !== "all") params.set("category", category);
      if (edition !== "all") params.set("edition", edition);
      params.set("limit", "50");

      const res = await fetch(`/api/compendium/search?${params}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, edition]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2 || category !== "all") {
        doSearch();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, edition, doSearch]);

  return (
    <div className="compendium-container">
      {/* Search Bar */}
      <div className="compendium-search-bar">
        <div className="compendium-search-input-wrap">
          <span className="compendium-search-icon">🔍</span>
          <input
            type="text"
            className="input compendium-search-input"
            placeholder="Pesquisar no compêndio de regras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
          />
          {query && (
            <button className="compendium-clear" onClick={() => { setQuery(""); setResults([]); }}>✕</button>
          )}
        </div>

        {/* Category Chips */}
        <div className="compendium-categories">
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              className={`compendium-cat-chip ${category === key ? "active" : ""}`}
              onClick={() => setCategory(key)}
              style={category === key ? { borderColor: cfg.color, color: cfg.color } : undefined}
            >
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
              {key !== "all" && stats[key === "magicItem" ? "magicItems" : `${key}s`] !== undefined && (
                <span className="compendium-cat-count">
                  {stats[key === "magicItem" ? "magicItems" : `${key}s`]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Edition filter */}
        <div className="compendium-edition-row">
          {[
            { value: "all", label: "Todas Edições" },
            { value: "3.5", label: "D&D 3.5" },
            { value: "5e", label: "D&D 5e" },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`npc-chip ${edition === opt.value ? "active" : ""}`}
              onClick={() => setEdition(opt.value)}
            >
              {opt.label}
            </button>
          ))}
          <span className="compendium-result-count">
            {loading ? "Buscando..." : results.length > 0 ? `${results.length} resultados` : ""}
          </span>
        </div>
      </div>

      {/* Layout: Results + Detail */}
      <div className="compendium-layout">
        {/* Results Grid */}
        <div className="compendium-results">
          {results.length === 0 && !loading && query.length < 2 && category === "all" ? (
            <div className="compendium-empty">
              <div className="compendium-empty-icon">📚</div>
              <h3>Compêndio de Regras D&D</h3>
              <p>Busque por magias, monstros, classes, talentos, equipamentos e itens mágicos.</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
                Digite pelo menos 2 caracteres ou escolha uma categoria
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="compendium-empty">
              <div className="compendium-empty-icon">🔍</div>
              <h3>Nenhum resultado</h3>
              <p>Tente outro termo ou categoria</p>
            </div>
          ) : (
            results.map((entry) => {
              const cfg = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG.all;
              return (
                <button
                  key={entry.id}
                  className={`compendium-result-card ${selectedEntry?.id === entry.id ? "selected" : ""}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="compendium-result-icon" style={{ color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div className="compendium-result-info">
                    <div className="compendium-result-name">{entry.namePtBr || entry.name}</div>
                    {entry.namePtBr && entry.namePtBr !== entry.name && (
                      <div className="compendium-result-en">{entry.name}</div>
                    )}
                    <div className="compendium-result-meta">
                      <span className={`badge ${entry.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                        {entry.edition}
                      </span>
                      <span>{cfg.label}</span>
                      {entry.data.level !== undefined && <span>Nv {String(entry.data.level)}</span>}
                      {entry.data.cr !== undefined && <span>CR {String(entry.data.cr)}</span>}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        {selectedEntry && (
          <div className="compendium-detail">
            <div className="compendium-detail-header">
              <span style={{ fontSize: "28px" }}>
                {(CATEGORY_CONFIG[selectedEntry.category] || CATEGORY_CONFIG.all).icon}
              </span>
              <div>
                <h2 className="compendium-detail-title">{selectedEntry.namePtBr || selectedEntry.name}</h2>
                {selectedEntry.namePtBr && selectedEntry.namePtBr !== selectedEntry.name && (
                  <p className="compendium-detail-en">{selectedEntry.name}</p>
                )}
              </div>
              <button className="compendium-detail-close" onClick={() => setSelectedEntry(null)}>✕</button>
            </div>

            <div className="compendium-detail-badges">
              <span className={`badge ${selectedEntry.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                D&D {selectedEntry.edition}
              </span>
              <span className="badge" style={{ background: "var(--bg-elevated)" }}>
                {(CATEGORY_CONFIG[selectedEntry.category] || CATEGORY_CONFIG.all).label}
              </span>
              {selectedEntry.tags.map((tag) => (
                <span key={tag} className="badge" style={{ background: "var(--bg-elevated)" }}>{tag}</span>
              ))}
            </div>

            <div className="compendium-detail-data">
              {Object.entries(selectedEntry.data).map(([key, value]) => {
                if (value === null || value === undefined || value === "") return null;
                const labels: Record<string, string> = {
                  level: "Nível", school: "Escola", castingTime: "Tempo", range: "Alcance",
                  duration: "Duração", description: "Descrição", components: "Componentes",
                  size: "Tamanho", type: "Tipo", alignment: "Alinhamento", ac: "CA",
                  hp: "PV", cr: "CR", hitDie: "Dado de Vida", prerequisites: "Pré-requisitos",
                  proficiencies: "Proficiências", spellcasting: "Magia",
                };
                const label = labels[key] || key;
                const isLong = typeof value === "string" && value.length > 100;

                return (
                  <div key={key} className={`compendium-detail-field ${isLong ? "full" : ""}`}>
                    <span className="compendium-detail-label">{label}</span>
                    <span className="compendium-detail-value">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
