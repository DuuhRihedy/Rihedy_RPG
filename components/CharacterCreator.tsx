"use client";

import { useState } from "react";

type WizardStep = "race" | "class" | "abilities" | "details" | "review";

const STEPS: { key: WizardStep; label: string; icon: string }[] = [
  { key: "race", label: "Raça", icon: "🧝" },
  { key: "class", label: "Classe", icon: "⚔️" },
  { key: "abilities", label: "Atributos", icon: "💪" },
  { key: "details", label: "Detalhes", icon: "📝" },
  { key: "review", label: "Revisão", icon: "✅" },
];

const RACES = [
  { name: "Humano", namePtBr: "Humano", bonuses: {}, speed: 30, traits: ["Talento extra", "+4 skill points no nível 1", "+1 skill point por nível"], size: "Medium" },
  { name: "Elfo", namePtBr: "Elfo", bonuses: { dex: 2, con: -2 }, speed: 30, traits: ["Imunidade a sono mágico", "+2 contra encantamentos", "Proficiência com arco"], size: "Medium" },
  { name: "Anão", namePtBr: "Anão", bonuses: { con: 2, cha: -2 }, speed: 20, traits: ["Darkvision 60ft", "+2 vs veneno", "+2 vs magias", "Estabilidade +4"], size: "Medium" },
  { name: "Halfling", namePtBr: "Halfling", bonuses: { dex: 2, str: -2 }, speed: 20, traits: ["+1 em todas as salvaguardas", "+2 em Furtividade", "+2 em Ouvir", "+1 ataque com arma de arremesso"], size: "Small" },
  { name: "Gnomo", namePtBr: "Gnomo", bonuses: { con: 2, str: -2 }, speed: 20, traits: ["Low-light vision", "+1 CA (tamanho)", "+2 vs ilusões", "Speak with Animals 1/dia"], size: "Small" },
  { name: "Meio-Elfo", namePtBr: "Meio-Elfo", bonuses: {}, speed: 30, traits: ["Imunidade a sono mágico", "+2 contra encantamentos", "+1 em Busca/Ouvir/Avistar", "Sem classe favorita"], size: "Medium" },
  { name: "Meio-Orc", namePtBr: "Meio-Orc", bonuses: { str: 2, int: -2, cha: -2 }, speed: 30, traits: ["Darkvision 60ft"], size: "Medium" },
];

const CLASSES = [
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

const ALIGNMENTS = [
  "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
  "Leal e Neutro", "Neutro", "Caótico e Neutro",
  "Leal e Mau", "Neutro e Mau", "Caótico e Mau",
];

const ABILITY_NAMES = ["str", "dex", "con", "int", "wis", "cha"] as const;
const ABILITY_LABELS: Record<string, string> = {
  str: "Força", dex: "Destreza", con: "Constituição", int: "Inteligência", wis: "Sabedoria", cha: "Carisma",
};

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function fmtMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function roll4d6DropLowest(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

interface CharacterData {
  race: number;
  className: number;
  level: number;
  abilities: Record<string, number>;
  name: string;
  alignment: string;
  description: string;
  method: "roll" | "pointbuy" | "standard";
}

export default function CharacterCreator() {
  const [step, setStep] = useState<WizardStep>("race");
  const [char, setChar] = useState<CharacterData>({
    race: 0, className: 0, level: 1,
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    name: "", alignment: "Neutro", description: "", method: "roll",
  });
  const [saved, setSaved] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);
  const race = RACES[char.race];
  const cls = CLASSES[char.className];

  function setAbility(key: string, value: number) {
    setChar({ ...char, abilities: { ...char.abilities, [key]: Math.max(3, Math.min(18, value)) } });
  }

  function rollAll() {
    const newAbilities: Record<string, number> = {};
    for (const ab of ABILITY_NAMES) {
      newAbilities[ab] = roll4d6DropLowest();
    }
    setChar({ ...char, abilities: newAbilities, method: "roll" });
  }

  function setStandard() {
    setChar({ ...char, abilities: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 }, method: "standard" });
  }

  function getFinalAbility(key: string): number {
    const base = char.abilities[key];
    const bonus = (race.bonuses as Record<string, number>)[key] || 0;
    return base + bonus;
  }

  function getHP(): number {
    const conMod = getModifier(getFinalAbility("con"));
    return cls.hitDie + conMod;  // Level 1: max die + CON
  }

  async function handleSave() {
    try {
      const res = await fetch("/api/character/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: char.name || `${race.namePtBr} ${cls.name}`,
          race: race.namePtBr,
          class: cls.name,
          level: char.level,
          alignment: char.alignment,
          description: char.description,
          type: "neutral",
          edition: "3.5",
          abilities: Object.fromEntries(ABILITY_NAMES.map((ab) => [ab, getFinalAbility(ab)])),
          hp: getHP(),
          ac: 10 + getModifier(getFinalAbility("dex")),
        }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      <div className="wizard-progress">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            className={`wizard-step-btn ${step === s.key ? "active" : ""} ${i < currentStepIndex ? "done" : ""}`}
            onClick={() => i <= currentStepIndex + 1 && setStep(s.key)}
          >
            <span className="wizard-step-icon">{i < currentStepIndex ? "✓" : s.icon}</span>
            <span className="wizard-step-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="wizard-content">
        {step === "race" && (
          <div className="wizard-panel">
            <h2>🧝 Escolha a Raça</h2>
            <div className="wizard-options-grid">
              {RACES.map((r, i) => (
                <button
                  key={r.name}
                  className={`wizard-option-card ${char.race === i ? "selected" : ""}`}
                  onClick={() => setChar({ ...char, race: i })}
                >
                  <div className="wizard-option-name">{r.namePtBr}</div>
                  <div className="wizard-option-meta">
                    Velocidade: {r.speed}ft · Tamanho: {r.size}
                  </div>
                  {Object.entries(r.bonuses).length > 0 && (
                    <div className="wizard-option-bonuses">
                      {Object.entries(r.bonuses).map(([ab, val]) => (
                        <span key={ab} className={`wizard-bonus ${(val as number) > 0 ? "positive" : "negative"}`}>
                          {ABILITY_LABELS[ab]} {(val as number) > 0 ? "+" : ""}{val as number}
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

        {step === "class" && (
          <div className="wizard-panel">
            <h2>⚔️ Escolha a Classe</h2>
            <div className="wizard-options-grid">
              {CLASSES.map((c, i) => (
                <button
                  key={c.name}
                  className={`wizard-option-card ${char.className === i ? "selected" : ""}`}
                  onClick={() => setChar({ ...char, className: i })}
                >
                  <div className="wizard-option-name">{c.name}</div>
                  <div className="wizard-option-meta">{c.desc}</div>
                  <div className="wizard-option-stats">
                    <span>d{c.hitDie} PV</span>
                    <span>BAB {c.bab}</span>
                    <span>{c.skills} perícias/nv</span>
                  </div>
                  <div className="wizard-option-saves">
                    Boas: {c.good.map((s) => s === "fort" ? "Fort" : s === "ref" ? "Ref" : "Von").join(", ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "abilities" && (
          <div className="wizard-panel">
            <h2>💪 Atributos</h2>

            <div className="wizard-ability-methods">
              <button className={`calc-tab ${char.method === "roll" ? "active" : ""}`} onClick={rollAll}>🎲 Rolar 4d6</button>
              <button className={`calc-tab ${char.method === "standard" ? "active" : ""}`} onClick={setStandard}>📊 Array Padrão</button>
              <button className={`calc-tab ${char.method === "pointbuy" ? "active" : ""}`}
                onClick={() => setChar({ ...char, abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, method: "pointbuy" })}>
                🎯 Point Buy
              </button>
            </div>

            <div className="wizard-abilities-grid">
              {ABILITY_NAMES.map((ab) => {
                const base = char.abilities[ab];
                const bonus = (race.bonuses as Record<string, number>)[ab] || 0;
                const final = base + bonus;
                const mod = getModifier(final);

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
                    <div className="wizard-ability-mod">{fmtMod(mod)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="wizard-panel">
            <h2>📝 Detalhes do Personagem</h2>
            <div className="wizard-details-form">
              <div className="calc-field">
                <label>Nome</label>
                <input className="input" value={char.name} onChange={(e) => setChar({ ...char, name: e.target.value })}
                  placeholder={`${race.namePtBr} ${cls.name}`} />
              </div>
              <div className="calc-field">
                <label>Nível Inicial</label>
                <input type="number" className="input" value={char.level} min={1} max={20}
                  onChange={(e) => setChar({ ...char, level: +e.target.value })} />
              </div>
              <div className="calc-field">
                <label>Alinhamento</label>
                <select className="input select" value={char.alignment}
                  onChange={(e) => setChar({ ...char, alignment: e.target.value })}>
                  {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="calc-field" style={{ gridColumn: "1/-1" }}>
                <label>Descrição / Aparência</label>
                <textarea className="input textarea" value={char.description} rows={3}
                  onChange={(e) => setChar({ ...char, description: e.target.value })}
                  placeholder="Descreva a aparência e personalidade..." />
              </div>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="wizard-panel">
            <h2>✅ Revisão da Ficha</h2>
            <div className="wizard-review">
              <div className="wizard-review-header">
                <h3>{char.name || `${race.namePtBr} ${cls.name}`}</h3>
                <p>{race.namePtBr} {cls.name} Nv {char.level} — {char.alignment}</p>
              </div>

              <div className="wizard-review-stats">
                <div className="calc-result-card"><span className="calc-result-label">PV</span><span className="calc-result-value">{getHP()}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">CA</span><span className="calc-result-value">{10 + getModifier(getFinalAbility("dex"))}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">Dado de Vida</span><span className="calc-result-value">d{cls.hitDie}</span></div>
                <div className="calc-result-card"><span className="calc-result-label">Velocidade</span><span className="calc-result-value">{race.speed}ft</span></div>
              </div>

              <div className="wizard-abilities-grid" style={{ marginTop: "var(--space-4)" }}>
                {ABILITY_NAMES.map((ab) => {
                  const final = getFinalAbility(ab);
                  return (
                    <div key={ab} className="wizard-ability-card">
                      <div className="wizard-ability-label">{ABILITY_LABELS[ab]}</div>
                      <div className="wizard-ability-final">{final}</div>
                      <div className="wizard-ability-mod">{fmtMod(getModifier(final))}</div>
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
                <div className="wizard-saved">✅ Personagem salvo como NPC no banco!</div>
              ) : (
                <button className="btn btn-primary" style={{ marginTop: "var(--space-5)", width: "100%" }} onClick={handleSave}>
                  💾 Salvar como NPC
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="wizard-nav">
        {currentStepIndex > 0 && (
          <button className="btn btn-ghost" onClick={() => setStep(STEPS[currentStepIndex - 1].key)}>
            ← Voltar
          </button>
        )}
        <div style={{ flex: 1 }} />
        {currentStepIndex < STEPS.length - 1 && (
          <button className="btn btn-primary" onClick={() => setStep(STEPS[currentStepIndex + 1].key)}>
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}
