"use client";

import { useState } from "react";
import { generateEncounter } from "@/lib/engine/generators/encounter";
import { generateLoot } from "@/lib/engine/generators/loot";
import type { Encounter, LootTable, EncounterDifficulty } from "@/lib/engine/types";
import "../ferramentas.css";

const DIFFICULTIES: { value: EncounterDifficulty; label: string; color: string }[] = [
  { value: "easy", label: "Fácil", color: "var(--success)" },
  { value: "average", label: "Médio", color: "var(--info)" },
  { value: "challenging", label: "Desafiador", color: "var(--warning)" },
  { value: "hard", label: "Difícil", color: "var(--danger)" },
  { value: "overpowering", label: "Letal", color: "var(--dnd-red)" },
];

export default function EncounterPage() {
  const [partyLevel, setPartyLevel] = useState(5);
  const [partySize, setPartySize] = useState(4);
  const [difficulty, setDifficulty] = useState<EncounterDifficulty>("average");
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loot, setLoot] = useState<LootTable | null>(null);
  const [lootLevel, setLootLevel] = useState(5);

  function handleGenerateEncounter() {
    const enc = generateEncounter(partyLevel, partySize, difficulty, "Encontro Gerado");
    setEncounter(enc);
  }

  function handleGenerateLoot() {
    const l = generateLoot(lootLevel);
    setLoot(l);
  }

  const diffColor = DIFFICULTIES.find(d => d.value === difficulty)?.color || "var(--text-muted)";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>⚔️ Encontros & Loot</h1>
          <p>D&D 3.5 — Gere encontros equilibrados e tesouros por nível</p>
        </div>
      </div>

      <div className="encounter-layout">
        {/* Encounter Generator */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">⚔️ Gerador de Encontro</span>
            </div>

            <div className="gen-controls-row" style={{ marginBottom: "var(--space-4)" }}>
              <div className="form-group">
                <label className="form-label">Nível do Grupo</label>
                <input
                  type="number"
                  className="input"
                  value={partyLevel}
                  onChange={(e) => setPartyLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  min={1} max={20}
                  style={{ width: 80, textAlign: "center" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tamanho do Grupo</label>
                <input
                  type="number"
                  className="input"
                  value={partySize}
                  onChange={(e) => setPartySize(Math.max(1, Math.min(10, parseInt(e.target.value) || 4)))}
                  min={1} max={10}
                  style={{ width: 80, textAlign: "center" }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Dificuldade</label>
                <div className="difficulty-row">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.value}
                      className={`difficulty-btn ${difficulty === d.value ? "active" : ""}`}
                      style={{ "--diff-color": d.color } as React.CSSProperties}
                      onClick={() => setDifficulty(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleGenerateEncounter} style={{ width: "100%" }}>
              ⚔️ Gerar Encontro
            </button>
          </div>

          {/* Encounter Result */}
          {encounter && (
            <div className="card encounter-result" style={{ marginTop: "var(--space-4)" }}>
              <div className="encounter-header">
                <div>
                  <h3 className="encounter-title">{encounter.name}</h3>
                  <p className="encounter-meta">
                    CR Total: <strong style={{ color: diffColor }}>{encounter.totalCR}</strong> ·
                    XP: <strong>{encounter.xpReward.toLocaleString()}</strong> ·
                    {encounter.partySize} jogadores Nv {encounter.partyLevel}
                  </p>
                </div>
                <span className="encounter-difficulty" style={{ color: diffColor }}>
                  {DIFFICULTIES.find(d => d.value === encounter.difficulty)?.label}
                </span>
              </div>

              <div className="encounter-creatures">
                {encounter.creatures.map((c, i) => (
                  <div key={i} className="creature-row">
                    <div className="creature-info">
                      <span className="creature-count">{c.count}×</span>
                      <div>
                        <strong className="creature-name">{c.name}</strong>
                        <span className="creature-stats">
                          CR {c.cr} · HP {c.hp} · Init +{c.initiative}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loot Generator */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">💰 Gerador de Tesouro</span>
            </div>

            <div className="gen-controls-row" style={{ marginBottom: "var(--space-4)" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Nível do Encontro</label>
                <input
                  type="number"
                  className="input"
                  value={lootLevel}
                  onChange={(e) => setLootLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  min={1} max={20}
                  style={{ textAlign: "center" }}
                />
              </div>
              <button className="btn btn-gold gen-btn" onClick={handleGenerateLoot}>
                💰 Gerar Tesouro
              </button>
            </div>
          </div>

          {/* Loot Result */}
          {loot && (
            <div className="card" style={{ marginTop: "var(--space-4)" }}>
              <div className="card-header">
                <span className="card-title">💰 Tesouro (Nível {loot.encounterLevel})</span>
                <span className="badge badge-gold">{loot.totalValue}</span>
              </div>

              <div className="loot-list">
                {loot.entries.map((entry, i) => (
                  <div key={i} className="loot-item">
                    <span className="loot-icon">
                      {entry.type === "coins" ? "🪙" :
                       entry.type === "gem" ? "💎" :
                       entry.type === "art" ? "🎨" :
                       entry.type === "magic_item" ? "✨" : "📦"}
                    </span>
                    <div className="loot-info">
                      <strong>{entry.quantity > 1 ? `${entry.quantity}× ` : ""}{entry.name}</strong>
                      <span className="loot-value">{entry.value}</span>
                    </div>
                    <span className={`loot-type loot-type-${entry.type}`}>
                      {entry.type === "coins" ? "Moedas" :
                       entry.type === "gem" ? "Gema" :
                       entry.type === "art" ? "Arte" :
                       entry.type === "magic_item" ? "Mágico" : "Mundano"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
