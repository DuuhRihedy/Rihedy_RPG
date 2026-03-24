"use client";

import { useState, useCallback } from "react";
import { rollDice, rollD20, rollAbilityScores, diceStats } from "@/lib/engine/dice";
import type { DiceResult } from "@/lib/engine/types";
import "../ferramentas.css";

const QUICK_DICE = [
  { label: "d4", expr: "1d4" },
  { label: "d6", expr: "1d6" },
  { label: "d8", expr: "1d8" },
  { label: "d10", expr: "1d10" },
  { label: "d12", expr: "1d12" },
  { label: "d20", expr: "1d20" },
  { label: "d100", expr: "1d100" },
];

const PRESET_ROLLS = [
  { label: "Ataque", expr: "1d20", icon: "⚔️" },
  { label: "Dano (espada)", expr: "1d8", icon: "🗡️" },
  { label: "Dano (2d6)", expr: "2d6", icon: "🔥" },
  { label: "Bola de Fogo", expr: "8d6", icon: "☄️" },
  { label: "Cura (CLW)", expr: "1d8+1", icon: "💚" },
  { label: "Atributos", expr: "4d6kh3", icon: "📊" },
  { label: "Sneak Attack 3d6", expr: "3d6", icon: "🗡️" },
];

interface RollHistoryEntry {
  id: number;
  expression: string;
  result: DiceResult;
  timestamp: Date;
  label?: string;
}

export default function DiceRollerPage() {
  const [customExpr, setCustomExpr] = useState("2d6+3");
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [abilityScores, setAbilityScores] = useState<number[] | null>(null);

  const addToHistory = useCallback((expression: string, result: DiceResult, label?: string) => {
    setHistory(prev => [{
      id: Date.now(),
      expression,
      result,
      timestamp: new Date(),
      label,
    }, ...prev].slice(0, 50));
  }, []);

  const handleRoll = useCallback((expression: string, label?: string) => {
    setIsRolling(true);
    const fullExpr = modifier !== 0
      ? `${expression}${modifier >= 0 ? "+" : ""}${modifier}`
      : expression;
    const result = rollDice(fullExpr);
    setLastRoll(result);
    addToHistory(fullExpr, result, label);
    setTimeout(() => setIsRolling(false), 300);
  }, [modifier, addToHistory]);

  const handleD20 = useCallback(() => {
    const result = rollD20(modifier);
    setLastRoll(result);
    addToHistory(result.expression, result, "d20");
  }, [modifier, addToHistory]);

  const handleAbilityRoll = useCallback(() => {
    const scores = rollAbilityScores();
    setAbilityScores(scores);
  }, []);

  const customStats = customExpr ? diceStats(customExpr) : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🎲 Rolador de Dados</h1>
          <p>D&D 3.5 — Suporta NdS+M, 4d6kh3 e mais</p>
        </div>
      </div>

      <div className="tools-grid">
        {/* Main Roll Area */}
        <div className="tool-main">
          {/* Big Result Display */}
          <div className={`dice-result-display ${isRolling ? "dice-rolling" : ""}`}>
            <div className="dice-result-total">
              {lastRoll ? lastRoll.total : "—"}
            </div>
            {lastRoll && (
              <div className="dice-result-detail">
                <span className="dice-result-expr">{lastRoll.expression}</span>
                <span className="dice-result-rolls">
                  [{lastRoll.rolls.join(", ")}]
                  {lastRoll.modifier !== 0 && ` ${lastRoll.modifier >= 0 ? "+" : ""}${lastRoll.modifier}`}
                </span>
              </div>
            )}
          </div>

          {/* Quick Dice Buttons */}
          <div className="dice-quick-row">
            {QUICK_DICE.map(d => (
              <button
                key={d.label}
                className="dice-btn"
                onClick={() => handleRoll(d.expr, d.label)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Custom Roll */}
          <div className="dice-custom-row">
            <input
              type="text"
              className="input dice-input"
              value={customExpr}
              onChange={(e) => setCustomExpr(e.target.value)}
              placeholder="2d6+3, 4d6kh3, 1d20+5..."
              onKeyDown={(e) => e.key === "Enter" && handleRoll(customExpr, "Custom")}
            />
            <div className="dice-mod-group">
              <label className="dice-mod-label">Mod</label>
              <input
                type="number"
                className="input dice-mod-input"
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              />
            </div>
            <button
              className="btn btn-primary dice-roll-btn"
              onClick={() => handleRoll(customExpr, "Custom")}
            >
              🎲 Rolar
            </button>
          </div>

          {/* Stats Preview */}
          {customStats && (
            <div className="dice-stats-row">
              <span>Mín: <strong>{customStats.min}</strong></span>
              <span>Méd: <strong>{customStats.avg}</strong></span>
              <span>Máx: <strong>{customStats.max}</strong></span>
            </div>
          )}

          {/* Presets */}
          <div className="card" style={{ marginTop: "var(--space-4)" }}>
            <div className="card-header">
              <span className="card-title">⚡ Atalhos D&D</span>
            </div>
            <div className="dice-preset-grid">
              {PRESET_ROLLS.map(p => (
                <button
                  key={p.label}
                  className="dice-preset-btn"
                  onClick={() => handleRoll(p.expr, p.label)}
                >
                  <span className="dice-preset-icon">{p.icon}</span>
                  <span className="dice-preset-label">{p.label}</span>
                  <span className="dice-preset-expr">{p.expr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ability Score Roller */}
          <div className="card" style={{ marginTop: "var(--space-4)" }}>
            <div className="card-header">
              <span className="card-title">📊 Rolar Atributos (4d6 drop lowest)</span>
              <button className="btn btn-gold btn-sm" onClick={handleAbilityRoll}>
                🎲 Rolar 6 Atributos
              </button>
            </div>
            {abilityScores && (
              <div className="ability-scores-row">
                {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((name, i) => (
                  <div key={name} className="ability-score-box">
                    <span className="ability-score-value">{abilityScores[i]}</span>
                    <span className="ability-score-mod">
                      {Math.floor((abilityScores[i] - 10) / 2) >= 0 ? "+" : ""}
                      {Math.floor((abilityScores[i] - 10) / 2)}
                    </span>
                    <span className="ability-score-label">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        <div className="tool-sidebar">
          <div className="card">
            <div className="card-header">
              <span className="card-title">📜 Histórico</span>
              {history.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => setHistory([])}>
                  Limpar
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhuma rolagem ainda
              </p>
            ) : (
              <div className="dice-history-list">
                {history.map(entry => (
                  <div key={entry.id} className="dice-history-item">
                    <div className="dice-history-top">
                      {entry.label && <span className="dice-history-label">{entry.label}</span>}
                      <span className="dice-history-total">{entry.result.total}</span>
                    </div>
                    <div className="dice-history-detail">
                      {entry.expression} → [{entry.result.rolls.join(", ")}]
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
