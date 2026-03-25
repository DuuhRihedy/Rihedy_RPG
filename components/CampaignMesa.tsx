"use client";

import { useState, useCallback } from "react";
import { rollDice, diceStats } from "@/lib/engine/dice";
import { generateEncounter } from "@/lib/engine/generators/encounter";
import { generateLoot } from "@/lib/engine/generators/loot";
import type { DiceResult, Encounter, EncounterDifficulty, LootTable } from "@/lib/engine/types";
import "@/app/ferramentas/ferramentas.css";

// ── Tipos de ícone por tipo de loot ──
const LOOT_ICONS: Record<string, string> = {
  coins: "🪙",
  gem: "💎",
  art: "🎨",
  mundane: "🎒",
  magic_item: "✨",
};

// ── Dificuldades com labels em PT-BR ──
const DIFFICULTIES: { value: EncounterDifficulty; label: string; color: string }[] = [
  { value: "easy", label: "Fácil", color: "#48bb78" },
  { value: "average", label: "Médio", color: "#ecc94b" },
  { value: "challenging", label: "Desafiante", color: "#ed8936" },
  { value: "hard", label: "Difícil", color: "#f56565" },
  { value: "overpowering", label: "Letal", color: "#e53e3e" },
];

// ── Sub-abas internas ──
const MESA_TABS = [
  { id: "dados", icon: "🎲", label: "Dados" },
  { id: "encontro", icon: "⚔️", label: "Encontro" },
  { id: "loot", icon: "💰", label: "Loot" },
];

// ── Dados rápidos ──
const QUICK_DICE = ["1d4", "1d6", "1d8", "1d10", "1d12", "1d20"];

export default function CampaignMesa() {
  const [activeSection, setActiveSection] = useState("dados");

  // ── Estado: Dados ──
  const [diceExpr, setDiceExpr] = useState("1d20");
  const [lastResult, setLastResult] = useState<DiceResult | null>(null);
  const [history, setHistory] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  // ── Estado: Encontro ──
  const [partyLevel, setPartyLevel] = useState(3);
  const [partySize, setPartySize] = useState(4);
  const [difficulty, setDifficulty] = useState<EncounterDifficulty>("average");
  const [encounter, setEncounter] = useState<Encounter | null>(null);

  // ── Estado: Loot ──
  const [lootLevel, setLootLevel] = useState(3);
  const [loot, setLoot] = useState<LootTable | null>(null);

  // ── Handlers: Dados ──
  const handleRoll = useCallback((expr: string) => {
    setIsRolling(true);
    setTimeout(() => {
      const result = rollDice(expr);
      setLastResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 200);
  }, []);

  // ── Handlers: Encontro ──
  const handleGenerateEncounter = useCallback(() => {
    const result = generateEncounter(partyLevel, partySize, difficulty);
    setEncounter(result);
  }, [partyLevel, partySize, difficulty]);

  // ── Handlers: Loot ──
  const handleGenerateLoot = useCallback(() => {
    const result = generateLoot(lootLevel);
    setLoot(result);
  }, [lootLevel]);

  // ── Stats da expressão atual ──
  const currentStats = (() => {
    try {
      return diceStats(diceExpr);
    } catch {
      return null;
    }
  })();

  return (
    <div className="card">
      {/* Sub-abas */}
      <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
        {MESA_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`map-tab ${activeSection === tab.id ? "active" : ""}`}
            onClick={() => setActiveSection(tab.id)}
            style={{ flex: 1 }}
          >
            <span className="map-tab-icon">{tab.icon}</span>
            <span className="map-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ SEÇÃO: DADOS ═══ */}
      {activeSection === "dados" && (
        <div>
          {/* Resultado */}
          <div className={`dice-result-display ${isRolling ? "dice-rolling" : ""}`} style={{ padding: "var(--space-5) var(--space-4)" }}>
            {lastResult ? (
              <>
                <div className="dice-result-total" style={{ fontSize: "48px" }}>
                  {lastResult.total}
                </div>
                <div className="dice-result-detail">
                  <span className="dice-result-expr">{lastResult.expression}</span>
                  <span className="dice-result-rolls">[{lastResult.rolls.join(", ")}]</span>
                  {lastResult.modifier !== 0 && (
                    <span style={{ color: "var(--text-muted)" }}>
                      {lastResult.modifier > 0 ? "+" : ""}{lastResult.modifier}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                Clique em um dado ou digite uma expressão
              </div>
            )}
          </div>

          {/* Botões rápidos */}
          <div className="dice-quick-row">
            {QUICK_DICE.map((d) => (
              <button key={d} className="dice-btn" onClick={() => handleRoll(d)}>
                {d}
              </button>
            ))}
          </div>

          {/* Expressão customizada */}
          <div className="dice-custom-row" style={{ marginBottom: "var(--space-3)" }}>
            <input
              className="input dice-input"
              value={diceExpr}
              onChange={(e) => setDiceExpr(e.target.value)}
              placeholder="Ex: 2d6+3, 4d6kh3"
              onKeyDown={(e) => e.key === "Enter" && handleRoll(diceExpr)}
            />
            <button
              className="btn btn-primary dice-roll-btn"
              onClick={() => handleRoll(diceExpr)}
              style={{ padding: "var(--space-2) var(--space-4)" }}
            >
              🎲 Rolar
            </button>
          </div>

          {/* Stats da expressão */}
          {currentStats && (
            <div className="dice-stats-row" style={{ marginBottom: "var(--space-4)" }}>
              <span>Mín: <strong>{currentStats.min}</strong></span>
              <span>Méd: <strong>{currentStats.avg}</strong></span>
              <span>Máx: <strong>{currentStats.max}</strong></span>
            </div>
          )}

          {/* Histórico */}
          {history.length > 0 && (
            <div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase" as const, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "var(--space-2)" }}>
                Últimas rolagens
              </div>
              <div className="dice-history-list" style={{ maxHeight: "200px" }}>
                {history.map((r, i) => (
                  <div key={i} className="dice-history-item">
                    <div className="dice-history-top">
                      <span className="dice-history-label">{r.expression}</span>
                      <span className="dice-history-total">{r.total}</span>
                    </div>
                    <div className="dice-history-detail">
                      [{r.rolls.join(", ")}]{r.modifier !== 0 ? ` ${r.modifier > 0 ? "+" : ""}${r.modifier}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SEÇÃO: ENCONTRO ═══ */}
      {activeSection === "encontro" && (
        <div>
          {/* Controles */}
          <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" as const }}>
            <div className="form-group" style={{ flex: 1, minWidth: "100px" }}>
              <label className="form-label">Nível do Grupo</label>
              <input
                type="number"
                className="input"
                value={partyLevel}
                onChange={(e) => setPartyLevel(Math.max(1, Math.min(20, Number(e.target.value))))}
                min={1}
                max={20}
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: "100px" }}>
              <label className="form-label">Tamanho do Grupo</label>
              <input
                type="number"
                className="input"
                value={partySize}
                onChange={(e) => setPartySize(Math.max(1, Math.min(10, Number(e.target.value))))}
                min={1}
                max={10}
              />
            </div>
          </div>

          {/* Dificuldade */}
          <div className="form-group" style={{ marginBottom: "var(--space-3)" }}>
            <label className="form-label">Dificuldade</label>
            <div className="difficulty-row">
              {DIFFICULTIES.map((d) => (
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

          <button className="btn btn-primary" onClick={handleGenerateEncounter} style={{ width: "100%", marginBottom: "var(--space-4)" }}>
            ⚔️ Gerar Encontro
          </button>

          {/* Resultado do encontro */}
          {encounter && (
            <div className="encounter-result">
              <div className="encounter-header">
                <div>
                  <h4 className="encounter-title">{encounter.name}</h4>
                  <div className="encounter-meta">
                    CR {encounter.totalCR} · {encounter.xpReward} XP
                  </div>
                </div>
                <span
                  className="encounter-difficulty"
                  style={{ color: DIFFICULTIES.find((d) => d.value === encounter.difficulty)?.color }}
                >
                  {DIFFICULTIES.find((d) => d.value === encounter.difficulty)?.label}
                </span>
              </div>

              <div className="encounter-creatures">
                {encounter.creatures.map((c, i) => (
                  <div key={i} className="creature-row">
                    <div className="creature-info">
                      <span className="creature-count">{c.count}x</span>
                      <div>
                        <span className="creature-name">{c.name}</span>
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
      )}

      {/* ═══ SEÇÃO: LOOT ═══ */}
      {activeSection === "loot" && (
        <div>
          <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nível do Encontro</label>
              <input
                type="number"
                className="input"
                value={lootLevel}
                onChange={(e) => setLootLevel(Math.max(1, Math.min(20, Number(e.target.value))))}
                min={1}
                max={20}
              />
            </div>
            <button className="btn btn-primary" onClick={handleGenerateLoot}>
              💰 Gerar Tesouro
            </button>
          </div>

          {/* Resultado do loot */}
          {loot && (
            <div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-3)",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--bg-deep)",
                borderRadius: "var(--radius-md)",
              }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  Nível {loot.encounterLevel}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--dnd-gold)" }}>
                  Total: {loot.totalValue}
                </span>
              </div>

              <div className="loot-list">
                {loot.entries.map((entry, i) => (
                  <div key={i} className="loot-item">
                    <span className="loot-icon">{LOOT_ICONS[entry.type] || "📦"}</span>
                    <div className="loot-info">
                      <strong>
                        {entry.quantity > 1 ? `${entry.quantity}x ` : ""}{entry.name}
                      </strong>
                      <span className="loot-value">{entry.value}</span>
                    </div>
                    <span className={`loot-type loot-type-${entry.type}`}>
                      {entry.type === "coins" ? "Moedas" :
                       entry.type === "gem" ? "Gema" :
                       entry.type === "art" ? "Arte" :
                       entry.type === "mundane" ? "Mundano" :
                       "Mágico"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
