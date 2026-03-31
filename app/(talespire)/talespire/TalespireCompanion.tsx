"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./talespire.css";

// ══════════════════════════════════════════════════════
// Hub RPG × Talespire — Symbiote Companion
// Painel lateral integrado ao Talespire com:
//   🎲 Dados · 📜 Acervo · 👥 NPCs · 🔮 Oráculo
// ══════════════════════════════════════════════════════

declare global {
  interface Window {
    TS: any;
    com: any;
  }
}

const TABS = [
  { id: "dice", icon: "🎲", label: "Dados" },
  { id: "chars", icon: "📋", label: "Fichas" },
  { id: "srd", icon: "📜", label: "Acervo" },
  { id: "npcs", icon: "👥", label: "NPCs" },
  { id: "ai", icon: "🔮", label: "Oráculo" },
];

const DICE = [
  { sides: 4, icon: "🔷", label: "d4" },
  { sides: 6, icon: "🎲", label: "d6" },
  { sides: 8, icon: "💎", label: "d8" },
  { sides: 10, icon: "🔶", label: "d10" },
  { sides: 12, icon: "⬡", label: "d12" },
  { sides: 20, icon: "⭐", label: "d20" },
  { sides: 100, icon: "💯", label: "d100" },
];

const SRD_CATEGORIES = [
  { id: "spells", label: "Magias", icon: "✨" },
  { id: "monsters", label: "Monstros", icon: "🐉" },
  { id: "equipment", label: "Equipamentos", icon: "🛡️" },
  { id: "magic-items", label: "Itens Mágicos", icon: "💍" },
  { id: "feats", label: "Talentos", icon: "🎯" },
  { id: "classes", label: "Classes", icon: "⚔️" },
];

interface RollEntry {
  id: number;
  expr: string;
  result: number;
  details: string;
  timestamp: number;
}

interface SrdResult {
  index: string;
  name: string;
  namePtBr: string | null;
  edition?: string;
  description?: string;
  descriptionPtBr?: string | null;
  level?: number;
  school?: string;
  type?: string;
  challengeRating?: number;
  [key: string]: any;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function TalespireCompanion() {
  const [activeTab, setActiveTab] = useState("dice");
  const [tsConnected, setTsConnected] = useState(false);
  const [tsPlayer, setTsPlayer] = useState<string>("");

  // Dice state
  const [rollHistory, setRollHistory] = useState<RollEntry[]>([]);
  const [customRoll, setCustomRoll] = useState("1d20+5");
  const rollIdRef = useRef(0);

  // SRD state
  const [srdCategory, setSrdCategory] = useState("spells");
  const [srdSearch, setSrdSearch] = useState("");
  const [srdResults, setSrdResults] = useState<SrdResult[]>([]);
  const [srdDetail, setSrdDetail] = useState<SrdResult | null>(null);
  const [srdLoading, setSrdLoading] = useState(false);

  // NPC state
  const [npcs, setNpcs] = useState<any[]>([]);
  const [npcDetail, setNpcDetail] = useState<any>(null);
  const [npcsLoading, setNpcsLoading] = useState(false);

  // Characters state
  const [chars, setChars] = useState<any[]>([]);
  const [charDetail, setCharDetail] = useState<any>(null);
  const [charsLoading, setCharsLoading] = useState(false);

  // AI state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Talespire API Init ─────────────────
  useEffect(() => {
    function onTsInit() {
      setTsConnected(true);
      // Get player name
      try {
        const api = window.TS || window.com?.bouncyrock?.talespire;
        if (api?.players?.whoAmI) {
          api.players.whoAmI().then((me: any) => {
            setTsPlayer(me?.player?.name || "Mestre");
          });
        }
        // Subscribe to dice results
        if (api?.dice?.onRollResults) {
          api.dice.onRollResults.push((results: any) => {
            if (results?.resultsGroups) {
              for (const group of results.resultsGroups) {
                const total = evaluateResult(group.result);
                const entry: RollEntry = {
                  id: ++rollIdRef.current,
                  expr: group.name || "???",
                  result: total,
                  details: JSON.stringify(group.result),
                  timestamp: Date.now(),
                };
                setRollHistory((prev) => [entry, ...prev].slice(0, 50));
              }
            }
          });
        }
      } catch (e) {
        console.warn("TS API init error:", e);
      }
    }

    // Listen for TS init event
    if (typeof window !== "undefined") {
      const api = window.TS || window.com?.bouncyrock?.talespire;
      if (api?.symbiote?.onStateChangeEvent) {
        api.symbiote.onStateChangeEvent.push((event: any) => {
          if (event?.kind === "hasInitialized") onTsInit();
        });
      }
      // Check if already initialized
      if (api?.players?.whoAmI) {
        onTsInit();
      }
    }
  }, []);

  // ── Evaluate dice result tree ──────────
  function evaluateResult(node: any): number {
    if (typeof node === "number") return node;
    if (node?.value !== undefined) return node.value;
    if (node?.results) return node.results.reduce((a: number, b: number) => a + b, 0);
    if (node?.operands) {
      const values = node.operands.map(evaluateResult);
      if (node.operator === "+") return values.reduce((a: number, b: number) => a + b, 0);
      if (node.operator === "-") return values[0] - values.slice(1).reduce((a: number, b: number) => a + b, 0);
      if (node.operator === "*") return values.reduce((a: number, b: number) => a * b, 1);
      return values[0];
    }
    return 0;
  }

  // ── Roll Dice ──────────────────────────
  const rollDice = useCallback((expr: string) => {
    const api = window.TS || window.com?.bouncyrock?.talespire;

    if (api?.dice?.putDiceInTray) {
      // Build roll descriptors and send to Talespire
      api.dice.putDiceInTray([{ name: expr, roll: expr }], true).catch((e: any) => {
        console.warn("TS dice error:", e);
        rollLocal(expr);
      });
    } else {
      rollLocal(expr);
    }
  }, []);

  function rollLocal(expr: string) {
    // Local fallback when not in Talespire
    const match = expr.match(/(\d+)?d(\d+)([+-]\d+)?/i);
    if (!match) return;

    const count = parseInt(match[1] || "1");
    const sides = parseInt(match[2]);
    const mod = parseInt(match[3] || "0");

    let total = mod;
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      total += r;
    }

    const entry: RollEntry = {
      id: ++rollIdRef.current,
      expr,
      result: total,
      details: `[${rolls.join(", ")}]${mod ? ` ${mod > 0 ? "+" : ""}${mod}` : ""}`,
      timestamp: Date.now(),
    };
    setRollHistory((prev) => [entry, ...prev].slice(0, 50));
  }

  // ── SRD Search ─────────────────────────
  const searchSrd = useCallback(async () => {
    if (!srdSearch.trim() && srdCategory !== "classes") return;
    setSrdLoading(true);
    setSrdDetail(null);
    try {
      const params = new URLSearchParams({
        category: srdCategory,
        q: srdSearch.trim(),
        limit: "20",
      });
      const res = await fetch(`/api/srd/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSrdResults(data.results || []);
      }
    } catch (e) {
      console.error("SRD search error:", e);
    } finally {
      setSrdLoading(false);
    }
  }, [srdCategory, srdSearch]);

  // ── Load NPCs ──────────────────────────
  const loadNpcs = useCallback(async () => {
    setNpcsLoading(true);
    try {
      const res = await fetch("/api/npcs");
      if (res.ok) {
        const data = await res.json();
        setNpcs(data.npcs || []);
      }
    } catch (e) {
      console.error("NPCs load error:", e);
    } finally {
      setNpcsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "npcs" && npcs.length === 0) loadNpcs();
  }, [activeTab, loadNpcs, npcs.length]);

  // ── Load Characters ────────────────────
  const loadChars = useCallback(async () => {
    setCharsLoading(true);
    try {
      const res = await fetch("/api/characters");
      if (res.ok) {
        const data = await res.json();
        setChars(data.characters || []);
      }
    } catch (e) {
      console.error("Characters load error:", e);
    } finally {
      setCharsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "chars" && chars.length === 0) loadChars();
  }, [activeTab, loadChars, chars.length]);

  // ── Send to Talespire Chat ─────────────
  const sendToChat = useCallback((text: string) => {
    const api = window.TS || window.com?.bouncyrock?.talespire;
    if (api?.chat?.send) {
      api.chat.send(text);
    }
  }, []);

  // ── AI Chat ────────────────────────────
  const sendAiMessage = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: "talespire" }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply || "Sem resposta." },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "⚠️ Erro na consulta ao oráculo." },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Falha na conexão." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════

  return (
    <div className="ts-shell">
      {/* Toolbar */}
      <div className="ts-toolbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ts-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="ts-tab-icon">{tab.icon}</span>
            <span className="ts-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="ts-panels">

        {/* ── 🎲 DICE PANEL ──────────────── */}
        <div className={`ts-panel ${activeTab === "dice" ? "active" : ""}`}>
          <div className="ts-card">
            <div className="ts-card-title">⚡ Rolagem Rápida</div>
            <div className="ts-dice-grid">
              {DICE.map((d) => (
                <button
                  key={d.sides}
                  className="ts-dice-btn"
                  onClick={() => rollDice(`1d${d.sides}`)}
                  title={`Rolar 1${d.label}`}
                >
                  <span className="ts-dice-icon">{d.icon}</span>
                  <span className="ts-dice-label">{d.label}</span>
                </button>
              ))}
              <button
                className="ts-dice-btn"
                onClick={() => rollDice("2d6")}
                title="Rolar 2d6"
              >
                <span className="ts-dice-icon">🎲🎲</span>
                <span className="ts-dice-label">2d6</span>
              </button>
            </div>
          </div>

          <div className="ts-card">
            <div className="ts-card-title">🎯 Rolagem Customizada</div>
            <div className="ts-dice-custom">
              <input
                className="ts-input"
                value={customRoll}
                onChange={(e) => setCustomRoll(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && rollDice(customRoll)}
                placeholder="ex: 2d6+3, 1d20+8..."
              />
              <button
                className="ts-btn ts-btn-primary"
                onClick={() => rollDice(customRoll)}
              >
                Rolar
              </button>
            </div>
            <div style={{ marginTop: "8px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {["1d20+5", "2d6+3", "1d8+2", "4d6", "1d20+10", "8d6"].map((preset) => (
                <button
                  key={preset}
                  className="ts-btn ts-btn-ghost ts-btn-sm"
                  onClick={() => {
                    setCustomRoll(preset);
                    rollDice(preset);
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {rollHistory.length > 0 && (
            <div className="ts-card">
              <div className="ts-card-title">📊 Histórico</div>
              <div className="ts-roll-history">
                {rollHistory.map((roll) => (
                  <div key={roll.id} className="ts-roll-item">
                    <div>
                      <span className="ts-roll-item-expr">{roll.expr}</span>
                      <span style={{ marginLeft: "6px", fontSize: "10px", color: "var(--ts-color-secondary)" }}>
                        {roll.details}
                      </span>
                    </div>
                    <span className="ts-roll-item-result">{roll.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 📜 SRD PANEL ───────────────── */}
        <div className={`ts-panel ${activeTab === "srd" ? "active" : ""}`}>
          {srdDetail ? (
            <div className="ts-card" style={{ flex: 1 }}>
              <button className="ts-detail-back" onClick={() => setSrdDetail(null)}>
                ← Voltar
              </button>
              <div className="ts-detail-title">
                {srdDetail.namePtBr || srdDetail.name}
              </div>
              <div className="ts-detail-subtitle">
                {srdDetail.name !== (srdDetail.namePtBr || srdDetail.name) && (
                  <span style={{ fontStyle: "italic", marginRight: "8px" }}>{srdDetail.name}</span>
                )}
                <span className={`ts-badge ${srdDetail.edition === "3.5" ? "ts-badge-35" : "ts-badge-5e"}`}>
                  {srdDetail.edition || "5e"}
                </span>
                {srdDetail.school && (
                  <span className="ts-badge ts-badge-school" style={{ marginLeft: "4px" }}>
                    {srdDetail.school}
                  </span>
                )}
              </div>
              {srdDetail.level !== undefined && (
                <div style={{ fontSize: "12px", color: "var(--ts-color-secondary)", marginBottom: "6px" }}>
                  Nível: {srdDetail.level}
                  {srdDetail.castingTime && ` · ${srdDetail.castingTime}`}
                  {srdDetail.range && ` · ${srdDetail.range}`}
                </div>
              )}
              {srdDetail.challengeRating !== undefined && (
                <div style={{ fontSize: "12px", color: "var(--ts-color-secondary)", marginBottom: "6px" }}>
                  ND: {srdDetail.challengeRating} · HP: {srdDetail.hitPoints} · CA: {srdDetail.armorClass}
                </div>
              )}
              <div className="ts-detail-body">
                {(srdDetail.descriptionPtBr || srdDetail.description || "Sem descrição disponível.")
                  .split("\n")
                  .map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
              {tsConnected && (
                <button
                  className="ts-btn ts-btn-secondary ts-btn-sm"
                  style={{ marginTop: "10px" }}
                  onClick={() =>
                    sendToChat(
                      `📜 ${srdDetail.namePtBr || srdDetail.name}: ${(srdDetail.descriptionPtBr || srdDetail.description || "").substring(0, 200)}...`
                    )
                  }
                >
                  💬 Enviar ao Chat
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="ts-card">
                <div className="ts-filter-row">
                  {SRD_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`ts-btn ts-btn-sm ${srdCategory === cat.id ? "ts-btn-primary" : "ts-btn-ghost"}`}
                      onClick={() => {
                        setSrdCategory(cat.id);
                        setSrdResults([]);
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ts-card">
                <div className="ts-dice-custom">
                  <input
                    className="ts-input"
                    value={srdSearch}
                    onChange={(e) => setSrdSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchSrd()}
                    placeholder={`Buscar ${SRD_CATEGORIES.find((c) => c.id === srdCategory)?.label || ""}...`}
                  />
                  <button className="ts-btn ts-btn-primary" onClick={searchSrd}>
                    🔍
                  </button>
                </div>
              </div>

              {srdLoading ? (
                <div className="ts-loading"><div className="ts-spinner" /></div>
              ) : srdResults.length > 0 ? (
                <div className="ts-results">
                  {srdResults.map((item) => (
                    <div
                      key={item.index}
                      className="ts-result-item"
                      onClick={() => setSrdDetail(item)}
                    >
                      <div className="ts-result-name">
                        {item.namePtBr || item.name}
                        <span className={`ts-badge ${item.edition === "3.5" ? "ts-badge-35" : "ts-badge-5e"}`} style={{ marginLeft: "6px" }}>
                          {item.edition || "5e"}
                        </span>
                      </div>
                      <div className="ts-result-meta">
                        {item.name !== (item.namePtBr || item.name) && <span>{item.name} · </span>}
                        {item.level !== undefined && <span>Nível {item.level} · </span>}
                        {item.school && <span>{item.school} · </span>}
                        {item.type && <span>{item.type} · </span>}
                        {item.challengeRating !== undefined && <span>ND {item.challengeRating}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : srdSearch ? (
                <div className="ts-empty">
                  <span className="ts-empty-icon">🔍</span>
                  <span className="ts-empty-text">Nenhum resultado encontrado</span>
                </div>
              ) : (
                <div className="ts-empty">
                  <span className="ts-empty-icon">{SRD_CATEGORIES.find((c) => c.id === srdCategory)?.icon}</span>
                  <span className="ts-empty-text">Pesquise no {SRD_CATEGORIES.find((c) => c.id === srdCategory)?.label}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 👥 NPCS PANEL ──────────────── */}
        <div className={`ts-panel ${activeTab === "npcs" ? "active" : ""}`}>
          {npcDetail ? (
            <div className="ts-card" style={{ flex: 1 }}>
              <button className="ts-detail-back" onClick={() => setNpcDetail(null)}>
                ← Voltar
              </button>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                <div className="ts-npc-avatar" style={{ width: "56px", height: "56px", fontSize: "24px" }}>
                  {npcDetail.imageUrl ? (
                    <img src={npcDetail.imageUrl} alt="" />
                  ) : (
                    npcDetail.type === "enemy" ? "💀" : npcDetail.type === "ally" ? "🛡️" : "👤"
                  )}
                </div>
                <div>
                  <div className="ts-detail-title" style={{ marginBottom: "2px" }}>{npcDetail.name}</div>
                  <div className="ts-detail-subtitle" style={{ marginBottom: 0 }}>
                    {[npcDetail.race, npcDetail.class, npcDetail.level && `Nv.${npcDetail.level}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </div>

              {npcDetail.attributes && (
                <div className="ts-detail-stat-grid">
                  {[
                    { label: "FOR", value: npcDetail.attributes.str },
                    { label: "DES", value: npcDetail.attributes.dex },
                    { label: "CON", value: npcDetail.attributes.con },
                    { label: "INT", value: npcDetail.attributes.intl },
                    { label: "SAB", value: npcDetail.attributes.wis },
                    { label: "CAR", value: npcDetail.attributes.cha },
                  ].map((stat) => (
                    <div key={stat.label} className="ts-detail-stat">
                      <div className="ts-detail-stat-value">{stat.value ?? "—"}</div>
                      <div className="ts-detail-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {npcDetail.attributes?.hp && (
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "var(--ts-color-secondary)" }}>
                  ❤️ PV: <strong style={{ color: "var(--ts-color-primary)" }}>{npcDetail.attributes.hp}</strong>
                  {npcDetail.attributes.ac && (
                    <> · 🛡️ CA: <strong style={{ color: "var(--ts-color-primary)" }}>{npcDetail.attributes.ac}</strong></>
                  )}
                </div>
              )}

              {npcDetail.description && (
                <div className="ts-detail-body" style={{ marginBottom: "8px" }}>
                  <div className="ts-card-title" style={{ fontSize: "10px" }}>Descrição</div>
                  <p>{npcDetail.description}</p>
                </div>
              )}

              {npcDetail.backstory && (
                <div className="ts-detail-body">
                  <div className="ts-card-title" style={{ fontSize: "10px" }}>Backstory</div>
                  <p>{npcDetail.backstory.substring(0, 300)}{npcDetail.backstory.length > 300 ? "..." : ""}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="ts-card">
                <div className="ts-card-title">👥 NPCs da Campanha</div>
                <button className="ts-btn ts-btn-ghost ts-btn-sm" onClick={loadNpcs}>
                  🔄 Atualizar
                </button>
              </div>

              {npcsLoading ? (
                <div className="ts-loading"><div className="ts-spinner" /></div>
              ) : npcs.length > 0 ? (
                <div className="ts-results">
                  {npcs.map((npc) => (
                    <div key={npc.id} className="ts-npc-card" onClick={() => setNpcDetail(npc)}>
                      <div className="ts-npc-avatar">
                        {npc.imageUrl ? (
                          <img src={npc.imageUrl} alt="" />
                        ) : (
                          npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"
                        )}
                      </div>
                      <div className="ts-npc-info">
                        <div className="ts-npc-name">{npc.name}</div>
                        <div className="ts-npc-detail">
                          {[npc.race, npc.class].filter(Boolean).join(" · ") || "Sem detalhes"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ts-empty">
                  <span className="ts-empty-icon">👥</span>
                  <span className="ts-empty-text">Nenhum NPC encontrado</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 📋 CHARACTERS PANEL ─────────── */}
        <div className={`ts-panel ${activeTab === "chars" ? "active" : ""}`}>
          {charDetail ? (
            <div className="ts-card" style={{ flex: 1 }}>
              <button className="ts-detail-back" onClick={() => setCharDetail(null)}>
                ← Voltar
              </button>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                <div className="ts-npc-avatar" style={{ width: "56px", height: "56px", fontSize: "24px" }}>
                  {charDetail.imageUrl ? <img src={charDetail.imageUrl} alt="" /> : charDetail.edition === "3.5" ? "⚔️" : "🛡️"}
                </div>
                <div>
                  <div className="ts-detail-title" style={{ marginBottom: "2px" }}>{charDetail.name}</div>
                  <div className="ts-detail-subtitle" style={{ marginBottom: 0 }}>
                    {[charDetail.race, charDetail.class, `Nv.${charDetail.level}`].filter(Boolean).join(" · ")}
                    <span className={`ts-badge ${charDetail.edition === "3.5" ? "ts-badge-35" : "ts-badge-5e"}`} style={{ marginLeft: "6px" }}>
                      {charDetail.edition}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ts-detail-stat-grid">
                {[
                  { label: "FOR", value: charDetail.str },
                  { label: "DES", value: charDetail.dex },
                  { label: "CON", value: charDetail.con },
                  { label: "INT", value: charDetail.intl },
                  { label: "SAB", value: charDetail.wis },
                  { label: "CAR", value: charDetail.cha },
                ].map((stat) => (
                  <div key={stat.label} className="ts-detail-stat">
                    <div className="ts-detail-stat-value">{stat.value ?? "—"}</div>
                    <div className="ts-detail-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "var(--ts-background-primary)", borderRadius: "4px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ts-accent-primary)" }}>❤️ {charDetail.currentHp}/{charDetail.maxHp}</div>
                  <div style={{ fontSize: "9px", color: "var(--ts-color-secondary)" }}>PV</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "var(--ts-background-primary)", borderRadius: "4px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ts-accent-primary)" }}>🛡️ {charDetail.ac}</div>
                  <div style={{ fontSize: "9px", color: "var(--ts-color-secondary)" }}>CA</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "var(--ts-background-primary)", borderRadius: "4px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ts-accent-primary)" }}>⚡ {charDetail.initiative >= 0 ? "+" : ""}{charDetail.initiative}</div>
                  <div style={{ fontSize: "9px", color: "var(--ts-color-secondary)" }}>INIC.</div>
                </div>
                {charDetail.bab !== null && (
                  <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "var(--ts-background-primary)", borderRadius: "4px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ts-accent-primary)" }}>+{charDetail.bab}</div>
                    <div style={{ fontSize: "9px", color: "var(--ts-color-secondary)" }}>BAB</div>
                  </div>
                )}
              </div>
              {charDetail.edition === "3.5" && (
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  {[
                    { label: "Fort", value: charDetail.fortSave },
                    { label: "Ref", value: charDetail.refSave },
                    { label: "Von", value: charDetail.willSave },
                  ].map((save) => (
                    <div key={save.label} style={{ flex: 1, textAlign: "center", padding: "4px", background: "var(--ts-background-primary)", borderRadius: "4px", fontSize: "12px" }}>
                      <span style={{ color: "var(--ts-color-secondary)" }}>{save.label}: </span>
                      <strong>{save.value != null ? (save.value >= 0 ? `+${save.value}` : save.value) : "—"}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="ts-card">
                <div className="ts-card-title">📋 Fichas de Personagem</div>
                <button className="ts-btn ts-btn-ghost ts-btn-sm" onClick={loadChars}>🔄 Atualizar</button>
              </div>
              {charsLoading ? (
                <div className="ts-loading"><div className="ts-spinner" /></div>
              ) : chars.length > 0 ? (
                <div className="ts-results">
                  {chars.map((ch) => (
                    <div key={ch.id} className="ts-npc-card" onClick={() => setCharDetail(ch)}>
                      <div className="ts-npc-avatar">
                        {ch.imageUrl ? <img src={ch.imageUrl} alt="" /> : ch.edition === "3.5" ? "⚔️" : "🛡️"}
                      </div>
                      <div className="ts-npc-info">
                        <div className="ts-npc-name">
                          {ch.name}
                          <span className={`ts-badge ${ch.edition === "3.5" ? "ts-badge-35" : "ts-badge-5e"}`} style={{ marginLeft: "6px" }}>
                            {ch.edition}
                          </span>
                        </div>
                        <div className="ts-npc-detail">
                          {[ch.race, ch.class, `Nv.${ch.level}`].filter(Boolean).join(" · ")}
                          {" · "} ❤️{ch.currentHp}/{ch.maxHp} 🛡️{ch.ac}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ts-empty">
                  <span className="ts-empty-icon">📋</span>
                  <span className="ts-empty-text">Nenhuma ficha encontrada. Crie uma em /ferramentas/personagem</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 🔮 AI PANEL ────────────────── */}
        <div className={`ts-panel ${activeTab === "ai" ? "active" : ""}`}>
          <div className="ts-chat-messages">
            {chatMessages.length === 0 && (
              <div className="ts-empty">
                <span className="ts-empty-icon">🔮</span>
                <span className="ts-empty-text">
                  Pergunte ao Oráculo sobre regras D&D 3.5/5e,
                  peça para gerar NPCs ou tirar dúvidas de combate.
                </span>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`ts-chat-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="ts-chat-msg assistant">
                <div className="ts-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="ts-chat-input-row">
            <input
              className="ts-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAiMessage()}
              placeholder="Pergunte ao Oráculo..."
              disabled={chatLoading}
            />
            <button
              className="ts-btn ts-btn-primary"
              onClick={sendAiMessage}
              disabled={chatLoading}
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="ts-status">
        <span>
          <span className={`ts-status-dot ${tsConnected ? "connected" : ""}`} />
          {tsConnected ? `Talespire · ${tsPlayer}` : "Hub RPG · Offline"}
        </span>
        <span>v1.0</span>
      </div>
    </div>
  );
}
