"use client";

import { useState } from "react";
import { generateNpc, SRD_CLASSES, SRD_RACES, getModifier } from "@/lib/engine";
import type { Character } from "@/lib/engine/types";
import "./ferramentas.css";

export default function NpcGeneratorPage() {
  const [level, setLevel] = useState(3);
  const [className, setClassName] = useState("");
  const [raceName, setRaceName] = useState("");
  const [npc, setNpc] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);

  function handleGenerate() {
    const generated = generateNpc({
      level,
      className: className || undefined,
      raceName: raceName || undefined,
    });
    setNpc(generated);
    setHistory(prev => [generated, ...prev].slice(0, 10));
  }

  function getModStr(score: number): string {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🧙 Gerador de NPC</h1>
          <p>D&D 3.5 — Gere NPCs com atributos, classe e progressão automática</p>
        </div>
      </div>

      <div className="tools-grid">
        <div className="tool-main">
          {/* Controls */}
          <div className="card gen-controls">
            <div className="gen-controls-row">
              <div className="form-group">
                <label className="form-label">Nível</label>
                <input
                  type="number"
                  className="input"
                  value={level}
                  onChange={(e) => setLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={20}
                  style={{ width: 80, textAlign: "center" }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Classe (vazio = aleatória)</label>
                <select className="input select" value={className} onChange={(e) => setClassName(e.target.value)}>
                  <option value="">🎲 Aleatória</option>
                  {SRD_CLASSES.map(c => (
                    <option key={c.name} value={c.name}>{c.namePtBr} ({c.name})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Raça (vazio = aleatória)</label>
                <select className="input select" value={raceName} onChange={(e) => setRaceName(e.target.value)}>
                  <option value="">🎲 Aleatória</option>
                  {SRD_RACES.map(r => (
                    <option key={r.name} value={r.name}>{r.namePtBr} ({r.name})</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary gen-btn" onClick={handleGenerate}>
                🧙 Gerar NPC
              </button>
            </div>
          </div>

          {/* NPC Card */}
          {npc ? (
            <div className="npc-sheet">
              {/* Header */}
              <div className="npc-sheet-header">
                <div>
                  <h2 className="npc-sheet-name">{npc.name}</h2>
                  <p className="npc-sheet-info">
                    {npc.race} · {npc.classes.map(c => `${c.className} ${c.level}`).join(" / ")} · {npc.alignment}
                  </p>
                </div>
                <div className="npc-sheet-level">
                  <span className="npc-sheet-level-num">Nv {npc.totalLevel}</span>
                </div>
              </div>

              {/* Vitals Row */}
              <div className="npc-sheet-vitals">
                <div className="vital-box vital-hp">
                  <span className="vital-value">{npc.hp.max}</span>
                  <span className="vital-label">HP</span>
                </div>
                <div className="vital-box vital-ac">
                  <span className="vital-value">{npc.ac.total}</span>
                  <span className="vital-label">AC</span>
                </div>
                <div className="vital-box">
                  <span className="vital-value">{npc.ac.touch}</span>
                  <span className="vital-label">Toque</span>
                </div>
                <div className="vital-box">
                  <span className="vital-value">{npc.ac.flatFooted}</span>
                  <span className="vital-label">Surpr.</span>
                </div>
                <div className="vital-box">
                  <span className="vital-value">+{npc.initiative}</span>
                  <span className="vital-label">Init</span>
                </div>
                <div className="vital-box">
                  <span className="vital-value">{npc.speed}ft</span>
                  <span className="vital-label">Desl.</span>
                </div>
              </div>

              {/* Abilities */}
              <div className="npc-sheet-section">
                <h3 className="npc-sheet-section-title">Atributos</h3>
                <div className="npc-sheet-abilities">
                  {(["str", "dex", "con", "int", "wis", "cha"] as const).map(ab => (
                    <div key={ab} className="ability-score-box">
                      <span className="ability-score-value">{npc.abilities[ab]}</span>
                      <span className="ability-score-mod">{getModStr(npc.abilities[ab])}</span>
                      <span className="ability-score-label">{ab.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combat */}
              <div className="npc-sheet-section">
                <h3 className="npc-sheet-section-title">Combate</h3>
                <div className="npc-sheet-combat-grid">
                  <div className="combat-stat">
                    <span className="combat-stat-label">BBA</span>
                    <span className="combat-stat-value">+{npc.attack.baseAttackBonus.join("/+")}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">Corpo-a-corpo</span>
                    <span className="combat-stat-value">{npc.attack.melee >= 0 ? "+" : ""}{npc.attack.melee}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">Distância</span>
                    <span className="combat-stat-value">{npc.attack.ranged >= 0 ? "+" : ""}{npc.attack.ranged}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">Agarrar</span>
                    <span className="combat-stat-value">{npc.attack.grapple >= 0 ? "+" : ""}{npc.attack.grapple}</span>
                  </div>
                </div>
              </div>

              {/* Saves */}
              <div className="npc-sheet-section">
                <h3 className="npc-sheet-section-title">Salvaguardas</h3>
                <div className="npc-sheet-saves">
                  {([
                    { key: "fortitude", label: "Fortitude", icon: "🛡️" },
                    { key: "reflex", label: "Reflexo", icon: "⚡" },
                    { key: "will", label: "Vontade", icon: "🧠" },
                  ] as const).map(save => {
                    const s = npc.saves[save.key];
                    const total = s.base + s.ability + s.misc;
                    return (
                      <div key={save.key} className="save-box">
                        <span className="save-icon">{save.icon}</span>
                        <span className="save-label">{save.label}</span>
                        <span className="save-total">{total >= 0 ? "+" : ""}{total}</span>
                        <span className="save-breakdown">({s.base} base + {s.ability} hab)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">🧙</span>
              <h3>Configure e clique em Gerar NPC</h3>
              <p>Atributos serão distribuídos automaticamente por prioridade da classe</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="tool-sidebar">
          <div className="card">
            <div className="card-header">
              <span className="card-title">📜 Histórico</span>
            </div>
            {history.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhum NPC gerado
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {history.map((h, i) => (
                  <button
                    key={h.id}
                    className={`dice-history-item ${npc?.id === h.id ? "active" : ""}`}
                    onClick={() => setNpc(h)}
                    style={{ cursor: "pointer", border: "none", textAlign: "left", width: "100%", background: npc?.id === h.id ? "var(--bg-hover)" : "transparent" }}
                  >
                    <div className="dice-history-top">
                      <span className="dice-history-label">{h.name}</span>
                      <span className="dice-history-total">Nv {h.totalLevel}</span>
                    </div>
                    <div className="dice-history-detail">
                      {h.race} · {h.classes.map(c => c.className).join("/")}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
