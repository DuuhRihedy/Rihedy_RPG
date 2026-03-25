"use client";

import { useState, useEffect, useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";
import "../ferramentas.css";

// Tipos dos geradores
const GENERATORS = [
  {
    id: "azgaar",
    label: "Mapa de Mundo",
    icon: "🌍",
    description: "Gera mapas de mundo completos com terreno, biomas, rios, culturas e estados",
    url: "https://azgaar.github.io/Fantasy-Map-Generator/",
    license: "MIT",
    author: "Azgaar",
    mapType: "world",
    tips: [
      "Clique em <strong>New Map</strong> para gerar um novo mundo aleatório",
      "Use a roda do mouse para zoom e arraste para mover",
      "Clique em qualquer estado/cidade para ver detalhes",
      "Menu <strong>Tools</strong> tem editores de heightmap, culturas e mais",
      "Exporte como PNG, SVG ou JSON pelo menu <strong>Save</strong>",
    ],
  },
  {
    id: "city",
    label: "Mapa de Cidade",
    icon: "🏰",
    description: "Gera cidades medievais fantásticas com muralhas, distritos e ruas",
    url: "https://watabou.github.io/city-generator/",
    license: "GPL-3.0",
    author: "Watabou",
    mapType: "city",
    tips: [
      "Clique com o botão direito para gerar uma nova cidade",
      "Use a roda do mouse para zoom",
      "Clique nos ícones no canto para mudar estilo e tamanho",
      "Exporte como PNG ou SVG pelo menu",
    ],
  },
  {
    id: "dungeon",
    label: "Mapa de Dungeon",
    icon: "🏚️",
    description: "Gera dungeons completas em uma página com descrições de salas",
    url: "https://watabou.github.io/dungeon.html",
    license: "GPL-3.0",
    author: "Watabou",
    mapType: "dungeon",
    tips: [
      "Clique com o botão direito para gerar uma nova dungeon",
      "Cada sala tem uma descrição gerada automaticamente",
      "Use o menu para ajustar tamanho e complexidade",
      "Exporte como PNG, SVG ou Markdown",
    ],
  },
  {
    id: "village",
    label: "Mapa de Vila",
    icon: "🏘️",
    description: "Gera vilas rurais com casas, estradas, campos e árvores",
    url: "https://watabou.github.io/village.html",
    license: "GPL-3.0",
    author: "Watabou",
    mapType: "village",
    tips: [
      "Clique com o botão direito para gerar uma nova vila",
      "Ajuste o tamanho e densidade pelo menu",
      "As vilas têm estradas, casas e campos gerados automaticamente",
      "Exporte como PNG ou SVG",
    ],
  },
];

const MAP_TYPE_LABELS: Record<string, string> = {
  world: "Mundo",
  city: "Cidade",
  dungeon: "Dungeon",
  village: "Vila",
  other: "Outro",
};

interface MapEntry {
  id: string;
  name: string;
  type: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  campaign: { id: string; name: string } | null;
}

interface CampaignOption {
  id: string;
  name: string;
}

export default function MapGeneratorsPage() {
  const [activeGenerator, setActiveGenerator] = useState(GENERATORS[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [maps, setMaps] = useState<MapEntry[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [saving, setSaving] = useState(false);

  // Campos do formulário
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [mapCampaignId, setMapCampaignId] = useState("");

  // Filtro da galeria
  const [filterType, setFilterType] = useState("all");

  // Visualização ampliada
  const [viewingMap, setViewingMap] = useState<MapEntry | null>(null);

  const current = GENERATORS.find((g) => g.id === activeGenerator)!;

  const loadMaps = useCallback(async () => {
    try {
      const res = await fetch("/api/maps");
      if (res.ok) {
        const data = await res.json();
        setMaps(data);
      }
    } catch {}
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns-sidebar");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadMaps();
    loadCampaigns();
  }, [loadMaps, loadCampaigns]);

  function handleOpenSaveForm() {
    setMapName("");
    setMapDescription("");
    setMapImageUrl(null);
    setMapCampaignId("");
    setShowSaveForm(true);
  }

  async function handleSaveMap(e: React.FormEvent) {
    e.preventDefault();
    if (!mapName.trim() || !mapImageUrl) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("name", mapName.trim());
      formData.set("type", current.mapType);
      formData.set("description", mapDescription.trim());
      formData.set("imageUrl", mapImageUrl);
      if (mapCampaignId) formData.set("campaignId", mapCampaignId);

      const res = await fetch("/api/maps", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowSaveForm(false);
        loadMaps();
      }
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMap(id: string) {
    if (!confirm("Deletar este mapa?")) return;
    try {
      await fetch(`/api/maps?id=${id}`, { method: "DELETE" });
      loadMaps();
    } catch {}
  }

  const filteredMaps = filterType === "all"
    ? maps
    : maps.filter((m) => m.type === filterType);

  return (
    <div>
      <div className="hero">
        <h1>🗺️ Geradores de Mapas</h1>
        <p>Gere mapas procedurais, exporte e salve na sua galeria</p>
      </div>

      {/* Abas dos geradores */}
      <div className="map-tabs">
        {GENERATORS.map((gen) => (
          <button
            key={gen.id}
            className={`map-tab ${activeGenerator === gen.id ? "active" : ""}`}
            onClick={() => {
              setActiveGenerator(gen.id);
              setIsLoading(true);
            }}
          >
            <span className="map-tab-icon">{gen.icon}</span>
            <span className="map-tab-label">{gen.label}</span>
          </button>
        ))}
      </div>

      {/* Info do gerador ativo */}
      <div className="map-info-bar">
        <div className="map-info-text">
          <strong>{current.icon} {current.label}</strong>
          <span className="map-info-desc">{current.description}</span>
        </div>
        <div className="map-info-meta">
          <span className="map-license-badge">{current.license}</span>
          <span className="map-author">por {current.author}</span>
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="map-external-link"
            title="Abrir em nova aba"
          >
            ↗ Abrir externo
          </a>
        </div>
      </div>

      {/* Container do iframe */}
      <div className="map-iframe-container">
        {isLoading && (
          <div className="map-loading">
            <div className="map-loading-spinner" />
            <span>Carregando {current.label}...</span>
          </div>
        )}
        <iframe
          key={current.id}
          src={current.url}
          className="map-iframe"
          title={current.label}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>

      {/* Dicas + Botão salvar */}
      <div className="map-actions-row">
        <div className="map-tips card">
          <h3 className="map-tips-title">💡 Dicas de Uso</h3>
          <ul className="map-tips-list">
            {current.tips.map((tip, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: tip }} />
            ))}
          </ul>
        </div>

        <div className="map-save-card card">
          <h3 className="map-tips-title">💾 Salvar Mapa</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", margin: "0 0 var(--space-3)" }}>
            Exporte o mapa do gerador (PNG/SVG) e faça upload aqui para salvar na sua galeria.
          </p>
          <button className="btn btn-primary" onClick={handleOpenSaveForm} style={{ width: "100%" }}>
            📤 Salvar Mapa na Galeria
          </button>
        </div>
      </div>

      {/* Modal de salvar */}
      {showSaveForm && (
        <div className="map-modal-overlay" onClick={() => setShowSaveForm(false)}>
          <div className="map-modal" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h3>💾 Salvar Mapa — {current.label}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSaveForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveMap} className="map-modal-body">
              <div className="form-group">
                <label className="form-label">Nome do Mapa *</label>
                <input
                  className="input"
                  placeholder="Ex: Mapa de Waterdeep, Dungeon do Dragão..."
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="input textarea"
                  rows={2}
                  placeholder="Notas sobre este mapa (opcional)"
                  value={mapDescription}
                  onChange={(e) => setMapDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vincular a Campanha</label>
                <select
                  className="select"
                  value={mapCampaignId}
                  onChange={(e) => setMapCampaignId(e.target.value)}
                >
                  <option value="">Nenhuma (mapa avulso)</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Imagem do Mapa *</label>
                <ImageUpload
                  currentImage={mapImageUrl}
                  onImageChange={(url) => setMapImageUrl(url)}
                  label=""
                  size="large"
                />
              </div>

              <div className="map-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowSaveForm(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !mapName.trim() || !mapImageUrl}
                >
                  {saving ? "Salvando..." : "💾 Salvar Mapa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Galeria de Mapas */}
      <div className="map-gallery-section">
        <div className="map-gallery-header">
          <h2 className="map-gallery-title">🖼️ Galeria de Mapas ({maps.length})</h2>
          <div className="map-gallery-filters">
            <button
              className={`map-filter-btn ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              Todos
            </button>
            {Object.entries(MAP_TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`map-filter-btn ${filterType === key ? "active" : ""}`}
                onClick={() => setFilterType(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredMaps.length === 0 ? (
          <div className="map-gallery-empty">
            <span style={{ fontSize: "48px" }}>🗺️</span>
            <p>Nenhum mapa salvo{filterType !== "all" ? ` do tipo "${MAP_TYPE_LABELS[filterType]}"` : ""}.</p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Use os geradores acima, exporte a imagem e salve aqui.
            </p>
          </div>
        ) : (
          <div className="map-gallery-grid">
            {filteredMaps.map((map) => (
              <div key={map.id} className="map-gallery-card">
                <div
                  className="map-gallery-image"
                  onClick={() => setViewingMap(map)}
                  title="Clique para ampliar"
                >
                  <img src={map.imageUrl} alt={map.name} />
                  <div className="map-gallery-overlay">
                    <span>🔍 Ampliar</span>
                  </div>
                </div>
                <div className="map-gallery-info">
                  <div className="map-gallery-name">{map.name}</div>
                  <div className="map-gallery-meta">
                    <span className={`map-type-badge map-type-${map.type}`}>
                      {MAP_TYPE_LABELS[map.type] || map.type}
                    </span>
                    {map.campaign && (
                      <span className="map-campaign-link">⚔️ {map.campaign.name}</span>
                    )}
                  </div>
                  {map.description && (
                    <p className="map-gallery-desc">{map.description}</p>
                  )}
                  <div className="map-gallery-actions">
                    <span className="map-gallery-date">
                      {new Date(map.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <button
                      className="btn btn-danger-text btn-sm"
                      onClick={() => handleDeleteMap(map.id)}
                      title="Deletar mapa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualização ampliada */}
      {viewingMap && (
        <div className="map-modal-overlay" onClick={() => setViewingMap(null)}>
          <div className="map-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h3>{viewingMap.name}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingMap(null)}>✕</button>
            </div>
            <div className="map-viewer-body">
              <img src={viewingMap.imageUrl} alt={viewingMap.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
