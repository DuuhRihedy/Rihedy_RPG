"use client";

import { useState } from "react";
import { createCharacter } from "@/lib/actions/characters";

// ══════════════════════════════════════════
// Character Creator — Wizard + Form Direto
// Suporta D&D 3.5 e 5e
// ══════════════════════════════════════════

type WizardStep = "race" | "class" | "abilities" | "details" | "review";

const STEPS: { key: WizardStep; label: string; icon: string }[] = [
  { key: "race", label: "Raça", icon: "🧝" },
  { key: "class", label: "Classe", icon: "⚔️" },
  { key: "abilities", label: "Atributos", icon: "💪" },
  { key: "details", label: "Detalhes", icon: "📝" },
  { key: "review", label: "Revisão", icon: "✅" },
];

// ── DADOS D&D 3.5 ─────────────────────

const RACES_35 = [
  { name: "Humano", bonuses: {} as Record<string, number>, speed: 30, traits: ["Talento extra", "+4 skill points no nível 1", "+1 skill point por nível"], size: "Medium" },
  { name: "Elfo", bonuses: { dex: 2, con: -2 }, speed: 30, traits: ["Imunidade a sono mágico", "+2 contra encantamentos", "Proficiência com arco"], size: "Medium" },
  { name: "Anão", bonuses: { con: 2, cha: -2 }, speed: 20, traits: ["Darkvision 60ft", "+2 vs veneno", "+2 vs magias", "Estabilidade +4"], size: "Medium" },
  { name: "Halfling", bonuses: { dex: 2, str: -2 }, speed: 20, traits: ["+1 em todas as salvaguardas", "+2 em Furtividade", "+2 em Ouvir"], size: "Small" },
  { name: "Gnomo", bonuses: { con: 2, str: -2 }, speed: 20, traits: ["Low-light vision", "+1 CA (tamanho)", "+2 vs ilusões"], size: "Small" },
  { name: "Meio-Elfo", bonuses: {}, speed: 30, traits: ["Imunidade a sono mágico", "+2 contra encantamentos", "+1 em Busca/Ouvir/Avistar"], size: "Medium" },
  { name: "Meio-Orc", bonuses: { str: 2, int: -2, cha: -2 }, speed: 30, traits: ["Darkvision 60ft"], size: "Medium" },
];

const CLASSES_35 = [
  { name: "Guerreiro", hitDie: 10, bab: "full", good: ["fort"], skills: 2, desc: "Mestre em combate e armas" },
  { name: "Mago", hitDie: 4, bab: "1/2", good: ["will"], skills: 2, desc: "Lançador arcano preparado" },
  { name: "Clérigo", hitDie: 8, bab: "3/4", good: ["fort", "will"], skills: 2, desc: "Lançador divino, cura" },
  { name: "Ladino", hitDie: 6, bab: "3/4", good: ["ref"], skills: 8, desc: "Perícias, furtividade, Sneak Attack" },
  { name: "Bardo", hitDie: 6, bab: "3/4", good: ["ref", "will"], skills: 6, desc: "Músico, magia arcana espontânea" },
  { name: "Druida", hitDie: 8, bab: "3/4", good: ["fort", "will"], skills: 4, desc: "Magia divina, Wild Shape" },
  { name: "Paladino", hitDie: 10, bab: "full", good: ["fort"], skills: 2, desc: "Guerreiro divino, Smite Evil" },
  { name: "Ranger", hitDie: 8, bab: "full", good: ["fort", "ref"], skills: 6, desc: "Rastreador, combate dual" },
  { name: "Feiticeiro", hitDie: 4, bab: "1/2", good: ["will"], skills: 2, desc: "Magia arcana espontânea" },
  { name: "Monge", hitDie: 8, bab: "3/4", good: ["fort", "ref", "will"], skills: 4, desc: "Artes marciais, Flurry of Blows" },
  { name: "Bárbaro", hitDie: 12, bab: "full", good: ["fort"], skills: 4, desc: "Fúria, resistente, rápido" },
];

// ── DADOS D&D 5e ──────────────────────

const RACES_5E = [
  { name: "Humano", bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, speed: 30, traits: ["+1 em todos os atributos", "Idioma extra"], size: "Medium" },
  { name: "Elfo", bonuses: { dex: 2 }, speed: 30, traits: ["Darkvision", "Proficiência em Percepção", "Transe (4h de descanso)"], size: "Medium" },
  { name: "Anão", bonuses: { con: 2 }, speed: 25, traits: ["Darkvision", "Resistência Anã", "Proficiência com machados"], size: "Medium" },
  { name: "Halfling", bonuses: { dex: 2 }, speed: 25, traits: ["Sortudo (re-roll 1)", "Corajoso (+adv vs medo)", "Ágil (move-se por criaturas maiores)"], size: "Small" },
  { name: "Draconato", bonuses: { str: 2, cha: 1 }, speed: 30, traits: ["Sopro de Dragão", "Resistência a dano do tipo ancestral"], size: "Medium" },
  { name: "Gnomo", bonuses: { int: 2 }, speed: 25, traits: ["Darkvision", "Esperteza Gnômica (adv vs magia Int/Sab/Car)"], size: "Small" },
  { name: "Meio-Elfo", bonuses: { cha: 2 }, speed: 30, traits: ["Darkvision", "+2 atributos à escolha", "2 proficiências de skill"], size: "Medium" },
  { name: "Meio-Orc", bonuses: { str: 2, con: 1 }, speed: 30, traits: ["Darkvision", "Resistência Implacável", "Ataques Selvagens"], size: "Medium" },
  { name: "Tiefling", bonuses: { cha: 2, int: 1 }, speed: 30, traits: ["Darkvision", "Resistência a fogo", "Legado Infernal (magias)"], size: "Medium" },
];

const CLASSES_5E = [
  { name: "Guerreiro", hitDie: 10, saves: ["str", "con"], skills: 2, desc: "Mestre em armas e armaduras" },
  { name: "Mago", hitDie: 6, saves: ["int", "wis"], skills: 2, desc: "Lançador arcano versátil" },
  { name: "Clérigo", hitDie: 8, saves: ["wis", "cha"], skills: 2, desc: "Magia divina e cura" },
  { name: "Ladino", hitDie: 8, saves: ["dex", "int"], skills: 4, desc: "Especialista, Sneak Attack" },
  { name: "Bardo", hitDie: 8, saves: ["dex", "cha"], skills: 3, desc: "Inspiração Bárdica, versatilidade" },
  { name: "Druida", hitDie: 8, saves: ["int", "wis"], skills: 2, desc: "Wild Shape, magia da natureza" },
  { name: "Paladino", hitDie: 10, saves: ["wis", "cha"], skills: 2, desc: "Smite Divino, Aura" },
  { name: "Ranger", hitDie: 10, saves: ["str", "dex"], skills: 3, desc: "Explorador, Inimigo Favorito" },
  { name: "Feiticeiro", hitDie: 6, saves: ["con", "cha"], skills: 2, desc: "Magia inata, Metamagia" },
  { name: "Bruxo", hitDie: 8, saves: ["wis", "cha"], skills: 2, desc: "Patrono, Invocações Místicas" },
  { name: "Monge", hitDie: 8, saves: ["str", "dex"], skills: 2, desc: "Ki, Artes Marciais" },
  { name: "Bárbaro", hitDie: 12, saves: ["str", "con"], skills: 2, desc: "Fúria, Defesa Desarmada" },
];

const ALIGNMENTS = [
  "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
  "Leal e Neutro", "Neutro", "Caótico e Neutro",
  "Leal e Mau", "Neutro e Mau", "Caótico e Mau",
];

const BACKGROUNDS_5E = [
  "Acólito", "Artesão de Guilda", "Charlatão", "Criminoso", "Eremita",
  "Estudioso", "Forasteiro", "Herói do Povo", "Marinheiro", "Nobre",
  "Órfão", "Sábio", "Soldado", "Artista",
];

const ABILITY_NAMES = ["str", "dex", "con", "int", "wis", "cha"] as const;
const ABILITY_LABELS: Record<string, string> = {
  str: "Força", dex: "Destreza", con: "Constituição", int: "Inteligência", wis: "Sabedoria", cha: "Carisma",
};
const ABILITY_SHORT: Record<string, string> = {
  str: "FOR", dex: "DES", con: "CON", int: "INT", wis: "SAB", cha: "CAR",
};

function mod(score: number): number { return Math.floor((score - 10) / 2); }
function fmtMod(m: number): string { return m >= 0 ? `+${m}` : `${m}`; }
function roll4d6(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

function getBAB(bab: string, level: number): number {
  if (bab === "full") return level;
  if (bab === "3/4") return Math.floor(level * 0.75);
  return Math.floor(level * 0.5);
}

function getGoodSave(level: number): number { return 2 + Math.floor(level / 2); }
function getBadSave(level: number): number { return Math.floor(level / 3); }
function getProfBonus(level: number): number { return Math.ceil(level / 4) + 1; }

interface Props {
  edition: "3.5" | "5e";
  campaigns: { id: string; name: string; edition: string }[];
  onSaved: () => void;
}

export default function CharacterCreator({ edition, campaigns, onSaved }: Props) {
  const races = edition === "3.5" ? RACES_35 : RACES_5E;
  const classes = edition === "3.5" ? CLASSES_35 : CLASSES_5E;

  const [step, setStep] = useState<WizardStep>("race");
  const [raceIdx, setRaceIdx] = useState(0);
  const [classIdx, setClassIdx] = useState(0);
  const [level, setLevel] = useState(1);
  const [abilities, setAbilities] = useState<Record<string, number>>({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  const [method, setMethod] = useState<"roll" | "standard" | "pointbuy">("roll");
  const [name, setName] = useState("");
  const [alignment, setAlignment] = useState("Neutro");
  const [background, setBackground] = useState(BACKGROUNDS_5E[0]);
  const [deity, setDeity] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentStep = STEPS.findIndex((s) => s.key === step);
  const race = races[raceIdx];
  const cls = classes[classIdx];

  function setAbility(key: string, val: number) {
    setAbilities((prev) => ({ ...prev, [key]: Math.max(3, Math.min(18, val)) }));
  }

  function rollAll() {
    const a: Record<string, number> = {};
    for (const ab of ABILITY_NAMES) a[ab] = roll4d6();
    setAbilities(a);
    setMethod("roll");
  }

  function setStandard() {
    setAbilities({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
    setMethod("standard");
  }

  function getFinal(key: string): number {
    return abilities[key] + ((race.bonuses as Record<string, number>)[key] || 0);
  }

  function getHP(): number {
    const conMod = mod(getFinal("con"));
    if (edition === "3.5") {
      return (cls as any).hitDie + conMod;
    }
    return cls.hitDie + conMod;
  }

  function getAC(): number { return 10 + mod(getFinal("dex")); }

  async function handleSave() {
    setSaving(true);
    try {
      const data: any = {
        name: name || `${race.name} ${cls.name}`,
        edition,
        race: race.name,
        class: cls.name,
        level,
        alignment,
        str: getFinal("str"),
        dex: getFinal("dex"),
        con: getFinal("con"),
        intl: getFinal("int"),
        wis: getFinal("wis"),
        cha: getFinal("cha"),
        maxHp: getHP(),
        ac: getAC(),
        speed: race.speed,
        initiative: mod(getFinal("dex")),
        notes: notes || undefined,
        campaignId: campaignId || undefined,
      };

      if (edition === "3.5") {
        const cls35 = cls as typeof CLASSES_35[0];
        data.bab = getBAB(cls35.bab, level);
        data.fortSave = cls35.good.includes("fort") ? getGoodSave(level) + mod(getFinal("con")) : getBadSave(level) + mod(getFinal("con"));
        data.refSave = cls35.good.includes("ref") ? getGoodSave(level) + mod(getFinal("dex")) : getBadSave(level) + mod(getFinal("dex"));
        data.willSave = cls35.good.includes("will") ? getGoodSave(level) + mod(getFinal("wis")) : getBadSave(level) + mod(getFinal("wis"));
        data.deity = deity || undefined;
        data.hitDice = `${level}d${cls35.hitDie}`;
      } else {
        const cls5e = cls as typeof CLASSES_5E[0];
        data.proficiencyBonus = getProfBonus(level);
        data.background = background;
        data.hitDice = `${level}d${cls5e.hitDie}`;
        data.savingThrows = JSON.stringify(
          Object.fromEntries(ABILITY_NAMES.map((ab) => [
            ab,
            {
              proficient: cls5e.saves.includes(ab),
              value: cls5e.saves.includes(ab) ? mod(getFinal(ab)) + getProfBonus(level) : mod(getFinal(ab)),
            },
          ]))
        );
      }

      data.gender = gender || undefined;

      await createCharacter(data);
      setSaved(true);
      setTimeout(() => onSaved(), 800);
    } catch (e) {
      console.error("Save error:", e);
      alert("Erro ao salvar personagem");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="wizard-container">
      <div className="wizard-edition-badge">
        <span className={`badge ${edition === "3.5" ? "badge-edition-35" : "badge-edition-5e"}`} style={{ fontSize: "14px", padding: "4px 12px" }}>
          D&D {edition}
        </span>
      </div>

      {/* Progress */}
      <div className="wizard-progress">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            className={`wizard-step-btn ${step === s.key ? "active" : ""} ${i < currentStep ? "done" : ""}`}
            onClick={() => i <= currentStep + 1 && setStep(s.key)}
          >
            <span className="wizard-step-icon">{i < currentStep ? "✓" : s.icon}</span>
            <span className="wizard-step-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="wizard-content">
        {/* ── RAÇA ──────────────────── */}
        {step === "race" && (
          <div className="wizard-panel">
            <h2>🧝 Escolha a Raça</h2>
            <div className="wizard-options-grid">
              {races.map((r, i) => (
                <button
                  key={r.name}
                  className={`wizard-option-card ${raceIdx === i ? "selected" : ""}`}
                  onClick={() => setRaceIdx(i)}
                >
                  <div className="wizard-option-name">{r.name}</div>
                  <div className="wizard-option-meta">
                    Velocidade: {r.speed}ft · Tamanho: {r.size}
                  </div>
                  {Object.entries(r.bonuses).length > 0 && (
                    <div className="wizard-option-bonuses">
                      {Object.entries(r.bonuses).map(([ab, val]) => (
                        <span key={ab} className={`wizard-bonus ${(val as number) > 0 ? "positive" : "negative"}`}>
                          {ABILITY_SHORT[ab] || ab} {(val as number) > 0 ? "+" : ""}{val as number}
                        </span>
                      ))}
                    </div>
                  )}
                  <ul className="wizard-option-traits">
                    {r.traits.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CLASSE ────────────────── */}
        {step === "class" && (
          <div className="wizard-panel">
            <h2>⚔️ Escolha a Classe</h2>
            <div className="wizard-options-grid">
              {classes.map((c, i) => (
                <button
                  key={c.name}
                  className={`wizard-option-card ${classIdx === i ? "selected" : ""}`}
                  onClick={() => setClassIdx(i)}
                >
                  <div className="wizard-option-name">{c.name}</div>
                  <div className="wizard-option-meta">{c.desc}</div>
                  <div className="wizard-option-stats">
                    <span>d{c.hitDie} PV</span>
                    {"bab" in c && <span>BAB {(c as any).bab}</span>}
                    <span>{c.skills} perícias</span>
                  </div>
                  <div className="wizard-option-saves">
                    {"good" in c
                      ? `Boas: ${(c as any).good.map((s: string) => s === "fort" ? "Fort" : s === "ref" ? "Ref" : "Von").join(", ")}`
                      : `Salvas: ${(c as any).saves.map((s: string) => ABILITY_SHORT[s] || s).join(", ")}`
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ATRIBUTOS ─────────────── */}
        {step === "abilities" && (
          <div className="wizard-panel">
            <h2>💪 Atributos</h2>
            <div className="wizard-ability-methods">
              <button className={`calc-tab ${method === "roll" ? "active" : ""}`} onClick={rollAll}>🎲 Rolar 4d6</button>
              <button className={`calc-tab ${method === "standard" ? "active" : ""}`} onClick={setStandard}>📊 Array Padrão</button>
              <button
                className={`calc-tab ${method === "pointbuy" ? "active" : ""}`}
                onClick={() => { setAbilities({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }); setMethod("pointbuy"); }}
              >
                🎯 Point Buy
              </button>
            </div>
            <div className="wizard-abilities-grid">
              {ABILITY_NAMES.map((ab) => {
                const base = abilities[ab];
                const bonus = (race.bonuses as Record<string, number>)[ab] || 0;
                const final = base + bonus;
                const m = mod(final);
                return (
                  <div key={ab} className="wizard-ability-card">
                    <div className="wizard-ability-label">{ABILITY_LABELS[ab]}</div>
                    <div className="wizard-ability-controls">
                      <button className="btn btn-ghost btn-sm" onClick={() => setAbility(ab, base - 1)}>−</button>
                      <span className="wizard-ability-value">{base}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setAbility(ab, base + 1)}>+</button>
                    </div>
                    {bonus !== 0 && <div className="wizard-ability-racial">{bonus > 0 ? `+${bonus}` : bonus} racial</div>}
                    <div className="wizard-ability-final">{final}</div>
                    <div className="wizard-ability-mod">{fmtMod(m)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DETALHES ──────────────── */}
        {step === "details" && (
          <div className="wizard-panel">
            <h2>📝 Detalhes do Personagem</h2>
            <div className="wizard-details-form">
              <div className="calc-field">
                <label>Nome</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={`${race.name} ${cls.name}`} />
              </div>
              <div className="calc-field">
                <label>Nível</label>
                <input type="number" className="input" value={level} min={1} max={20} onChange={(e) => setLevel(+e.target.value)} />
              </div>
              <div className="calc-field">
                <label>Alinhamento</label>
                <select className="input select" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
                  {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {edition === "5e" && (
                <div className="calc-field">
                  <label>Background</label>
                  <select className="input select" value={background} onChange={(e) => setBackground(e.target.value)}>
                    {BACKGROUNDS_5E.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {edition === "3.5" && (
                <div className="calc-field">
                  <label>Divindade</label>
                  <input className="input" value={deity} onChange={(e) => setDeity(e.target.value)} placeholder="Ex: Pelor, Moradin..." />
                </div>
              )}
              <div className="calc-field">
                <label>Gênero</label>
                <input className="input" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Ex: Masculino, Feminino..." />
              </div>
              {campaigns.length > 0 && (
                <div className="calc-field">
                  <label>Campanha (opcional)</label>
                  <select className="input select" value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
                    <option value="">— Nenhuma —</option>
                    {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.edition})</option>)}
                  </select>
                </div>
              )}
              <div className="calc-field" style={{ gridColumn: "1/-1" }}>
                <label>Aparência / Notas</label>
                <textarea
                  className="input textarea"
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a aparência, personalidade, backstory..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ── REVISÃO ──────────────── */}
        {step === "review" && (
          <div className="wizard-panel">
            <h2>✅ Revisão da Ficha</h2>
            <div className="wizard-review">
              <div className="wizard-review-header">
                <h3>{name || `${race.name} ${cls.name}`}</h3>
                <p>
                  {race.name} {cls.name} Nv {level} — {alignment}
                  {edition === "5e" && ` — ${background}`}
                  {edition === "3.5" && deity && ` — ${deity}`}
                </p>
              </div>

              <div className="wizard-review-stats">
                <div className="calc-result-card"><span className="calc-result-label">PV</span><span className="calc-result-value">{getHP()}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">CA</span><span className="calc-result-value">{getAC()}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">Dado de Vida</span><span className="calc-result-value">d{cls.hitDie}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">Velocidade</span><span className="calc-result-value">{race.speed}ft</span></div>
                {edition === "3.5" && (
                  <>
                    <div className="calc-result-card"><span className="calc-result-label">BAB</span><span className="calc-result-value">+{getBAB((cls as any).bab, level)}</span></div>
                    <div className="calc-result-card"><span className="calc-result-label">Iniciativa</span><span className="calc-result-value">{fmtMod(mod(getFinal("dex")))}</span></div>
                  </>
                )}
                {edition === "5e" && (
                  <div className="calc-result-card"><span className="calc-result-label">Prof. Bonus</span><span className="calc-result-value">+{getProfBonus(level)}</span></div>
                )}
              </div>

              {/* Saves for 3.5 */}
              {edition === "3.5" && (
                <div className="wizard-review-stats" style={{ marginTop: "var(--space-3)" }}>
                  {[
                    { label: "Fortitude", good: (cls as any).good.includes("fort"), ab: "con" },
                    { label: "Reflexos", good: (cls as any).good.includes("ref"), ab: "dex" },
                    { label: "Vontade", good: (cls as any).good.includes("will"), ab: "wis" },
                  ].map((save) => {
                    const base = save.good ? getGoodSave(level) : getBadSave(level);
                    const total = base + mod(getFinal(save.ab));
                    return (
                      <div key={save.label} className="calc-result-card">
                        <span className="calc-result-label">{save.label}</span>
                        <span className="calc-result-value">{fmtMod(total)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Saves for 5e */}
              {edition === "5e" && (
                <div className="wizard-abilities-grid" style={{ marginTop: "var(--space-3)" }}>
                  {ABILITY_NAMES.map((ab) => {
                    const prof = (cls as any).saves.includes(ab);
                    const total = mod(getFinal(ab)) + (prof ? getProfBonus(level) : 0);
                    return (
                      <div key={ab} className="wizard-ability-card" style={{ border: prof ? "1px solid var(--dnd-gold)" : undefined }}>
                        <div className="wizard-ability-label">{ABILITY_SHORT[ab]}</div>
                        <div className="wizard-ability-mod">{fmtMod(total)}</div>
                        {prof && <div style={{ fontSize: "9px", color: "var(--dnd-gold)" }}>Proficiente</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Atributos */}
              <div className="wizard-abilities-grid" style={{ marginTop: "var(--space-4)" }}>
                {ABILITY_NAMES.map((ab) => {
                  const final = getFinal(ab);
                  return (
                    <div key={ab} className="wizard-ability-card">
                      <div className="wizard-ability-label">{ABILITY_LABELS[ab]}</div>
                      <div className="wizard-ability-final">{final}</div>
                      <div className="wizard-ability-mod">{fmtMod(mod(final))}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "var(--space-4)" }}>
                <h4>Traços Raciais</h4>
                <ul style={{ marginTop: "var(--space-2)", color: "var(--text-secondary)" }}>
                  {race.traits.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>

              {saved ? (
                <div className="wizard-saved">✅ Personagem salvo com sucesso!</div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "var(--space-5)", width: "100%" }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "💾 Salvar Personagem"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="wizard-nav">
        {currentStep > 0 && (
          <button className="btn btn-ghost" onClick={() => setStep(STEPS[currentStep - 1].key)}>← Voltar</button>
        )}
        <div style={{ flex: 1 }} />
        {currentStep < STEPS.length - 1 && (
          <button className="btn btn-primary" onClick={() => setStep(STEPS[currentStep + 1].key)}>Próximo →</button>
        )}
      </div>
    </div>
  );
}
