"use client";

import { useState, useEffect, useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";

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
}

export default function CampaignMaps({ campaignId }: { campaignId: string }) {
  const [maps, setMaps] = useState<MapEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewingMap, setViewingMap] = useState<MapEntry | null>(null);

  // Campos do form
  const [name, setName] = useState("");
  const [type, setType] = useState("other");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const loadMaps = useCallback(async () => {
    try {
      const res = await fetch(`/api/maps?campaignId=${campaignId}`);
      if (res.ok) setMaps(await res.json());
    } catch {}
  }, [campaignId]);

  useEffect(() => { loadMaps(); }, [loadMaps]);

  function handleOpenForm() {
    setName("");
    setType("other");
    setDescription("");
    setImageUrl(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !imageUrl) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("type", type);
      formData.set("description", description.trim());
      formData.set("imageUrl", imageUrl);
      formData.set("campaignId", campaignId);

      const res = await fetch("/api/maps", { method: "POST", body: formData });
      if (res.ok) {
        setShowForm(false);
        loadMaps();
      }
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deletar este mapa?")) return;
    try {
      await fetch(`/api/maps?id=${id}`, { method: "DELETE" });
      loadMaps();
    } catch {}
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="card-title">🗺️ Mapas ({maps.length})</span>
        <button className="btn btn-primary btn-sm" onClick={handleOpenForm}>+ Adicionar Mapa</button>
      </div>

      {/* Formulário inline */}
      {showForm && (
        <form onSubmit={handleSave} style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input
                className="input"
                placeholder="Nome do mapa..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                {Object.entries(MAP_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              className="input"
              placeholder="Notas sobre o mapa (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Imagem *</label>
            <ImageUpload
              currentImage={imageUrl}
              onImageChange={(url) => setImageUrl(url)}
              label=""
              size="large"
            />
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !name.trim() || !imageUrl}>
              {saving ? "Salvando..." : "💾 Salvar"}
            </button>
          </div>
        </form>
      )}

      {/* Lista de mapas */}
      {maps.length === 0 && !showForm ? (
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8) 0" }}>
          Nenhum mapa adicionado. Clique em &quot;+ Adicionar Mapa&quot; para começar.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--space-3)", padding: maps.length > 0 ? "var(--space-4)" : "0" }}>
          {maps.map((map) => (
            <div key={map.id} className="map-gallery-card">
              <div
                className="map-gallery-image"
                style={{ height: "140px" }}
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
                    onClick={() => handleDelete(map.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualização */}
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
