"use client";

import { useState, useCallback } from "react";

// ── Categorias disponíveis ──
const CATEGORIES = [
  { id: "", label: "Todos", icon: "📖" },
  { id: "spell", label: "Magias", icon: "✨" },
  { id: "monster", label: "Monstros", icon: "🐉" },
  { id: "class", label: "Classes", icon: "⚔️" },
  { id: "feat", label: "Talentos", icon: "🎯" },
  { id: "weapon,armor", label: "Equipamentos", icon: "🛡️" },
  { id: "magic_item", label: "Itens Mágicos", icon: "💎" },
];

// ── Edições ──
const EDITIONS = [
  { id: "", label: "Todas" },
  { id: "3.5", label: "3.5" },
  { id: "5e", label: "5e" },
];

// ── Ícones por categoria ──
const CATEGORY_ICONS: Record<string, string> = {
  spell: "✨",
  monster: "🐉",
  class: "⚔️",
  feat: "🎯",
  weapon: "🗡️",
  armor: "🛡️",
  magic_item: "💎",
  race: "👤",
  condition: "💀",
};

// ── Tipo do resultado ──
interface SearchResult {
  id: string;
  category: string;
  name: string;
  namePtBr: string;
  edition: string;
  tags?: string[];
  data?: Record<string, unknown>;
}

export default function CampaignRegras() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [edition, setEdition] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Busca no compêndio ──
  const handleSearch = useCallback(async () => {
    if (!query.trim() && !category) return;

    setLoading(true);
    setSearched(true);
    setExpandedId(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      if (edition) params.set("edition", edition);
      params.set("limit", "20");

      const res = await fetch(`/api/compendium/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || data || []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, edition]);

  // ── Expande/colapsa detalhe ──
  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── Renderiza detalhes expandidos ──
  const renderDetail = (item: SearchResult) => {
    if (!item.data) return null;
    const data = item.data;

    return (
      <div style={{
        padding: "var(--space-3) var(--space-4)",
        background: "var(--bg-deep)",
        borderTop: "1px solid var(--border-subtle)",
        fontSize: "var(--text-sm)",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
      }}>
        {/* Descrição genérica */}
        {Boolean(data.descriptionPtBr) && (
          <p style={{ margin: "0 0 var(--space-2)" }}>{String(data.descriptionPtBr)}</p>
        )}
        {Boolean(data.description) && !data.descriptionPtBr && (
          <p style={{ margin: "0 0 var(--space-2)" }}>{String(data.description)}</p>
        )}
        {Boolean(data.benefitPtBr) && (
          <p style={{ margin: "0 0 var(--space-2)" }}><strong>Benefício:</strong> {String(data.benefitPtBr)}</p>
        )}
        {Boolean(data.benefit) && !data.benefitPtBr && (
          <p style={{ margin: "0 0 var(--space-2)" }}><strong>Benefício:</strong> {String(data.benefit)}</p>
        )}

        {/* Informações de magia */}
        {Boolean(data.school) && (
          <p style={{ margin: "0 0 var(--space-1)" }}><strong>Escola:</strong> {String(data.school)}</p>
        )}
        {Boolean(data.castingTime) && (
          <p style={{ margin: "0 0 var(--space-1)" }}><strong>Tempo de Conjuração:</strong> {String(data.castingTime)}</p>
        )}
        {Boolean(data.range) && (
          <p style={{ margin: "0 0 var(--space-1)" }}><strong>Alcance:</strong> {String(data.range)}</p>
        )}
        {Boolean(data.duration) && (
          <p style={{ margin: "0 0 var(--space-1)" }}><strong>Duração:</strong> {String(data.duration)}</p>
        )}

        {/* Informações de equipamento */}
        {Boolean(data.cost) && (
          <p style={{ margin: "0 0 var(--space-1)" }}><strong>Custo:</strong> {String(data.cost)}</p>
        )}
        {Boolean(data.damage) && typeof data.damage === "object" && (
          <p style={{ margin: "0 0 var(--space-1)" }}>
            <strong>Dano:</strong> {String((data.damage as Record<string, unknown>).medium || "")}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" as const, marginTop: "var(--space-2)" }}>
            {item.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: "10px",
                padding: "2px 6px",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      {/* Barra de busca */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar regras, magias, monstros..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleSearch} style={{ whiteSpace: "nowrap" as const }}>
          🔍 Buscar
        </button>
      </div>

      {/* Filtros de categoria */}
      <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-2)", flexWrap: "wrap" as const }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`map-filter-btn ${category === cat.id ? "active" : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Filtro de edição */}
      <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
        {EDITIONS.map((ed) => (
          <button
            key={ed.id}
            className={`map-filter-btn ${edition === ed.id ? "active" : ""}`}
            onClick={() => setEdition(ed.id)}
          >
            {ed.label}
          </button>
        ))}
      </div>

      {/* Estado de loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--text-muted)" }}>
          <div className="map-loading-spinner" style={{ margin: "0 auto var(--space-3)" }} />
          Buscando...
        </div>
      )}

      {/* Resultados */}
      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          Nenhum resultado encontrado. Tente termos diferentes.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {results.map((item) => (
            <div
              key={item.id}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                transition: "border-color 0.15s",
                borderColor: expandedId === item.id ? "var(--dnd-gold)" : undefined,
              }}
            >
              {/* Linha do resultado */}
              <div
                onClick={() => toggleExpand(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                {/* Ícone da categoria */}
                <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>
                  {CATEGORY_ICONS[item.category] || "📖"}
                </span>

                {/* Nome */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                    {item.namePtBr || item.name}
                  </div>
                  {item.namePtBr && item.namePtBr !== item.name && (
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontStyle: "italic" }}>
                      {item.name}
                    </div>
                  )}
                </div>

                {/* Badge da edição */}
                <span className={`badge ${item.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                  {item.edition}
                </span>

                {/* Indicador de expansão */}
                <span style={{ color: "var(--text-muted)", fontSize: "12px", transition: "transform 0.2s", transform: expandedId === item.id ? "rotate(180deg)" : "rotate(0)" }}>
                  ▼
                </span>
              </div>

              {/* Detalhe expandido */}
              {expandedId === item.id && renderDetail(item)}
            </div>
          ))}
        </div>
      )}

      {/* Estado inicial */}
      {!searched && !loading && (
        <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          📚 Pesquise no compêndio SRD para consultar regras, magias, monstros e mais.
        </div>
      )}
    </div>
  );
}
