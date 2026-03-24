"use client";

import { useState, useTransition } from "react";
import { linkNpcToCampaign, unlinkNpcFromCampaign } from "@/lib/actions/campaigns";

interface Npc {
  id: string;
  name: string;
  race?: string | null;
  class?: string | null;
  type: string;
  imageUrl?: string | null;
}

interface ImportNpcModalProps {
  campaignId: string;
  availableNpcs: Npc[];
  linkedNpcs: Array<{ npc: Npc }>;
}

export default function ImportNpcPanel({ campaignId, availableNpcs, linkedNpcs }: ImportNpcModalProps) {
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = availableNpcs.filter((npc) =>
    npc.name.toLowerCase().includes(search.toLowerCase()) ||
    (npc.race && npc.race.toLowerCase().includes(search.toLowerCase())) ||
    (npc.class && npc.class.toLowerCase().includes(search.toLowerCase()))
  );

  function handleLink(npcId: string) {
    startTransition(async () => {
      await linkNpcToCampaign(campaignId, npcId);
    });
  }

  function handleUnlink(npcId: string) {
    startTransition(async () => {
      await unlinkNpcFromCampaign(campaignId, npcId);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">👥 NPCs ({linkedNpcs.length})</span>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowImport(!showImport)}
        >
          {showImport ? "✕ Fechar" : "📥 Importar NPC"}
        </button>
      </div>

      {/* Import Panel */}
      {showImport && (
        <div className="import-panel">
          <input
            type="text"
            className="input"
            placeholder="🔍 Buscar NPC por nome, raça ou classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "var(--space-3)" }}
          />
          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
              {availableNpcs.length === 0 ? "Todos os NPCs já estão vinculados" : "Nenhum NPC encontrado"}
            </p>
          ) : (
            <div className="import-list">
              {filtered.map((npc) => (
                <div key={npc.id} className="import-item">
                  <div className="import-item-info">
                    {npc.imageUrl ? (
                      <img src={npc.imageUrl} alt={npc.name} className="import-item-avatar" />
                    ) : (
                      <span className="import-item-icon">
                        {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                      </span>
                    )}
                    <div>
                      <strong>{npc.name}</strong>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                        {[npc.race, npc.class].filter(Boolean).join(" · ") || "Sem detalhes"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-gold btn-sm"
                    onClick={() => handleLink(npc.id)}
                    disabled={isPending}
                  >
                    + Vincular
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Linked NPCs List */}
      {linkedNpcs.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
          Nenhum NPC vinculado — clique em &quot;Importar NPC&quot; para adicionar
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {linkedNpcs.map(({ npc }) => (
            <div key={npc.id} className="import-item">
              <a href={`/npcs/${npc.id}`} className="import-item-info" style={{ textDecoration: "none", color: "inherit" }}>
                {npc.imageUrl ? (
                  <img src={npc.imageUrl} alt={npc.name} className="import-item-avatar" />
                ) : (
                  <span className="import-item-icon">
                    {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                  </span>
                )}
                <div>
                  <strong>{npc.name}</strong>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                    {[npc.race, npc.class].filter(Boolean).join(" · ") || "Sem detalhes"}
                  </div>
                </div>
              </a>
              <button
                type="button"
                className="btn btn-danger-text btn-sm"
                onClick={() => handleUnlink(npc.id)}
                disabled={isPending}
                title="Desvincular"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
