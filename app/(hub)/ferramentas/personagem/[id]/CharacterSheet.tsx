"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCharacter } from "@/lib/actions/characters";

const ABILITY_NAMES = ["str", "dex", "con", "intl", "wis", "cha"] as const;
const ABILITY_LABELS: Record<string, string> = {
  str: "FOR", dex: "DES", con: "CON", intl: "INT", wis: "SAB", cha: "CAR",
};
const ABILITY_FULL: Record<string, string> = {
  str: "Força", dex: "Destreza", con: "Constituição", intl: "Inteligência", wis: "Sabedoria", cha: "Carisma",
};

function mod(score: number): number { return Math.floor((score - 10) / 2); }
function fmtMod(m: number): string { return m >= 0 ? `+${m}` : `${m}`; }
function safeJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

interface CharacterData {
  id: string;
  name: string;
  edition: string;
  race: string | null;
  class: string | null;
  level: number;
  alignment: string | null;
  background: string | null;
  deity: string | null;
  gender: string | null;
  imageUrl: string | null;
  status: string;
  str: number; dex: number; con: number; intl: number; wis: number; cha: number;
  maxHp: number; currentHp: number; tempHp: number;
  ac: number; touchAc: number | null; flatFootedAc: number | null;
  initiative: number; speed: number;
  bab: number | null; grapple: number | null;
  fortSave: number | null; refSave: number | null; willSave: number | null;
  damageReduction?: string | null;
  spellResistance?: number | null;
  proficiencyBonus: number | null;
  hitDice: string | null;
  deathSaveSuccesses: number; deathSaveFailures: number;
  inspiration: boolean;
  savingThrows: string | null;
  skills: string | null;
  feats: string | null;
  features: string | null;
  equipment: string | null;
  weapons: string | null;
  spells: string | null;
  proficiencies: string | null;
  currency: string | null;
  traits: string | null;
  notes: string | null;
  campaign: { id: string; name: string } | null;
}

export default function CharacterSheet({ character: initial }: { character: CharacterData }) {
  const [char, setChar] = useState(initial);
  const router = useRouter();

  async function saveHp(hp: number) {
    const newHp = Math.max(0, Math.min(hp, char.maxHp + char.tempHp));
    setChar((prev) => ({ ...prev, currentHp: newHp }));
    await updateCharacter(char.id, { currentHp: newHp });
  }

  async function toggleStatus() {
    const next = char.status === "active" ? "dead" : "active";
    setChar((prev) => ({ ...prev, status: next }));
    await updateCharacter(char.id, { status: next });
  }

  const currency = safeJson(char.currency, { cp: 0, sp: 0, gp: 0, pp: 0 });
  const weaponsList = safeJson<any[]>(char.weapons, []);
  const equipList = safeJson<any[]>(char.equipment, []);
  const featsList = safeJson<any[]>(char.feats, []);
  const featuresList = safeJson<any[]>(char.features, []);
  const skillsData = safeJson<Record<string, Record<string, number>> | Record<string, number>>(char.skills, {});
  const skillSections = Array.isArray(skillsData)
    ? []
    : Object.entries(skillsData).every(([, value]) => typeof value === "number")
      ? [{ title: "Pericias", entries: Object.entries(skillsData as Record<string, number>) }]
      : Object.entries(skillsData as Record<string, Record<string, number>>)
          .map(([title, section]) => ({
            title: title.charAt(0).toUpperCase() + title.slice(1),
            entries: Object.entries(section || {}),
          }))
          .filter((section) => section.entries.length > 0);
  const is35 = char.edition === "3.5";

  return (
    <div className="sheet-container">
      {/* Header */}
      <div className="sheet-header">
        <button className="btn btn-ghost" onClick={() => router.push("/ferramentas/personagem")} style={{ marginBottom: "var(--space-3)" }}>
          ← Voltar
        </button>
        <div className="sheet-hero">
          <div className="sheet-avatar">
            {char.imageUrl ? <img src={char.imageUrl} alt="" /> : <span>{is35 ? "⚔️" : "🛡️"}</span>}
          </div>
          <div className="sheet-hero-info">
            <h1 className="sheet-name">{char.name}</h1>
            <p className="sheet-subtitle">
              {[char.race, char.class, `Nível ${char.level}`, char.alignment].filter(Boolean).join(" · ")}
            </p>
            <div className="sheet-badges">
              <span className={`badge ${is35 ? "badge-edition-35" : "badge-edition-5e"}`}>D&D {char.edition}</span>
              {char.campaign && <span className="badge badge-campaign">{char.campaign.name}</span>}
              {char.status === "dead" && <span className="badge badge-danger">💀 Morto</span>}
              {is35 && char.deity && <span className="badge badge-info">🙏 {char.deity}</span>}
              {!is35 && char.background && <span className="badge badge-info">📖 {char.background}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="sheet-hp-section">
        <div className="sheet-hp-bar-container">
          <div className="sheet-hp-bar" style={{ width: `${Math.min(100, (char.currentHp / char.maxHp) * 100)}%` }} />
          <div className="sheet-hp-text">
            ❤️ {char.currentHp} / {char.maxHp}
            {char.tempHp > 0 && <span className="sheet-hp-temp"> (+{char.tempHp} temp)</span>}
          </div>
        </div>
        <div className="sheet-hp-controls">
          <button className="btn btn-ghost btn-sm" onClick={() => saveHp(char.currentHp - 1)}>−1</button>
          <button className="btn btn-ghost btn-sm" onClick={() => saveHp(char.currentHp - 5)}>−5</button>
          <button className="btn btn-ghost btn-sm" onClick={() => saveHp(char.maxHp)}>Full</button>
          <button className="btn btn-ghost btn-sm" onClick={() => saveHp(char.currentHp + 1)}>+1</button>
          <button className="btn btn-ghost btn-sm" onClick={() => saveHp(char.currentHp + 5)}>+5</button>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="sheet-combat-grid">
        <div className="sheet-stat-box">
          <div className="sheet-stat-value">{char.ac}</div>
          <div className="sheet-stat-label">CA</div>
        </div>
        {is35 && char.touchAc !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{char.touchAc}</div>
            <div className="sheet-stat-label">Toque</div>
          </div>
        )}
        {is35 && char.flatFootedAc !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{char.flatFootedAc}</div>
            <div className="sheet-stat-label">Surp.</div>
          </div>
        )}
        <div className="sheet-stat-box">
          <div className="sheet-stat-value">{fmtMod(char.initiative)}</div>
          <div className="sheet-stat-label">Iniciativa</div>
        </div>
        <div className="sheet-stat-box">
          <div className="sheet-stat-value">{char.speed}ft</div>
          <div className="sheet-stat-label">Velocidade</div>
        </div>
        {is35 && char.bab !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">+{char.bab}</div>
            <div className="sheet-stat-label">BAB</div>
          </div>
        )}
        {is35 && char.grapple !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{fmtMod(char.grapple)}</div>
            <div className="sheet-stat-label">Agarrar</div>
          </div>
        )}
        {is35 && char.damageReduction && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{char.damageReduction}</div>
            <div className="sheet-stat-label">RD</div>
          </div>
        )}
        {is35 && char.spellResistance !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{char.spellResistance}</div>
            <div className="sheet-stat-label">RM</div>
          </div>
        )}
        {!is35 && char.proficiencyBonus !== null && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">+{char.proficiencyBonus}</div>
            <div className="sheet-stat-label">Prof.</div>
          </div>
        )}
        {char.hitDice && (
          <div className="sheet-stat-box">
            <div className="sheet-stat-value">{char.hitDice}</div>
            <div className="sheet-stat-label">Dados de Vida</div>
          </div>
        )}
      </div>

      {/* Abilities */}
      <div className="sheet-section">
        <h3 className="sheet-section-title">📊 Atributos</h3>
        <div className="sheet-abilities-row">
          {ABILITY_NAMES.map((ab) => {
            const val = char[ab];
            return (
              <div key={ab} className="sheet-ability-box">
                <div className="sheet-ability-label">{ABILITY_LABELS[ab]}</div>
                <div className="sheet-ability-score">{val}</div>
                <div className="sheet-ability-mod">{fmtMod(mod(val))}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saves */}
      <div className="sheet-section">
        <h3 className="sheet-section-title">🛡️ Salvaguardas</h3>
        {is35 ? (
          <div className="sheet-saves-row">
            <div className="sheet-save-box">
              <span className="sheet-save-label">Fortitude</span>
              <span className="sheet-save-value">{fmtMod(char.fortSave || 0)}</span>
            </div>
            <div className="sheet-save-box">
              <span className="sheet-save-label">Reflexos</span>
              <span className="sheet-save-value">{fmtMod(char.refSave || 0)}</span>
            </div>
            <div className="sheet-save-box">
              <span className="sheet-save-label">Vontade</span>
              <span className="sheet-save-value">{fmtMod(char.willSave || 0)}</span>
            </div>
          </div>
        ) : (
          <div className="sheet-saves-row">
            {ABILITY_NAMES.map((ab) => {
              const saves = safeJson<Record<string, { proficient?: boolean; value?: number }>>(char.savingThrows, {});
              const key = ab === "intl" ? "int" : ab;
              const save = saves[key];
              return (
                <div key={ab} className={`sheet-save-box ${save?.proficient ? "proficient" : ""}`}>
                  <span className="sheet-save-label">{ABILITY_LABELS[ab]}</span>
                  <span className="sheet-save-value">{fmtMod(save?.value || mod(char[ab]))}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skills */}
      {skillSections.length > 0 && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">Pericias</h3>
          <div className="sheet-feats-list">
            {skillSections.map((section) => (
              <div key={section.title} className="sheet-feat-item">
                <strong>{section.title}</strong>
                <p>{section.entries.map(([name, value]) => `${name} ${fmtMod(value)}`).join(" / ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weapons */}
      {weaponsList.length > 0 && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">⚔️ Armas</h3>
          <table className="sheet-table">
            <thead>
              <tr><th>Arma</th><th>Ataque</th><th>Dano</th><th>Tipo</th></tr>
            </thead>
            <tbody>
              {weaponsList.map((w: any, i: number) => (
                <tr key={i}>
                  <td>{w.name}</td>
                  <td>{fmtMod(w.attackBonus || 0)}</td>
                  <td>
                    {w.damage}
                    {w.properties ? <div className="text-muted">{w.properties}</div> : null}
                  </td>
                  <td>{w.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feats */}
      {featsList.length > 0 && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">🎯 Talentos</h3>
          <div className="sheet-feats-list">
            {featsList.map((f: any, i: number) => (
              <div key={i} className="sheet-feat-item">
                <strong>{f.name}</strong>
                {f.description && <p>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {featuresList.length > 0 && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">✨ Características</h3>
          <div className="sheet-feats-list">
            {featuresList.map((f: any, i: number) => (
              <div key={i} className="sheet-feat-item">
                <strong>{f.name}</strong> {f.level && <span className="text-muted">(Nv.{f.level})</span>}
                {f.description && <p>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {equipList.length > 0 && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">🎒 Equipamento</h3>
          <ul className="sheet-equip-list">
            {equipList.map((e: any, i: number) => (
              <li key={i}>
                {e.name} {e.quantity > 1 && `(×${e.quantity})`}
                {e.weight && <span className="text-muted"> — {e.weight} lb</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Currency */}
      <div className="sheet-section">
        <h3 className="sheet-section-title">💰 Riqueza</h3>
        <div className="sheet-currency-row">
          <div className="sheet-currency-item"><span className="sheet-currency-amount">{currency.pp || 0}</span><span className="sheet-currency-type">PP</span></div>
          <div className="sheet-currency-item"><span className="sheet-currency-amount">{currency.gp || 0}</span><span className="sheet-currency-type">PO</span></div>
          <div className="sheet-currency-item"><span className="sheet-currency-amount">{currency.sp || 0}</span><span className="sheet-currency-type">PP</span></div>
          <div className="sheet-currency-item"><span className="sheet-currency-amount">{currency.cp || 0}</span><span className="sheet-currency-type">PC</span></div>
        </div>
      </div>

      {/* Notes */}
      {char.notes && (
        <div className="sheet-section">
          <h3 className="sheet-section-title">📝 Notas</h3>
          <div className="sheet-notes">{char.notes}</div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="sheet-actions-bar">
        <button className="btn btn-ghost" onClick={toggleStatus}>
          {char.status === "active" ? "💀 Marcar como Morto" : "✨ Ressuscitar"}
        </button>
      </div>
    </div>
  );
}
