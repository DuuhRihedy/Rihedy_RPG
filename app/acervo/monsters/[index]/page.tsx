import { getMonster } from "@/lib/actions/srd";
import {
  translateSize,
  translateCreatureType,
  translateAlignment,
  translateDamageList,
  translateConditionList,
  translateSpeed,
  translateSenses,
  uiLabels,
} from "@/lib/translations";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../../acervo.css";

type Params = Promise<{ index: string }>;

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default async function MonsterDetailPage({ params }: { params: Params }) {
  const { index } = await params;
  const mon = await getMonster(index);

  if (!mon) notFound();

  const namePtBr = mon.namePtBr || mon.name;
  const speedStr = translateSpeed(mon.speed);
  const sensesStr = translateSenses(mon.senses);

  // Usa as versões PT-BR das habilidades se disponíveis
  const actions = mon.actionsPtBr
    ? JSON.parse(mon.actionsPtBr)
    : mon.actions ? JSON.parse(mon.actions) : [];
  const specialAbilities = mon.specialAbilitiesPtBr
    ? JSON.parse(mon.specialAbilitiesPtBr)
    : mon.specialAbilities ? JSON.parse(mon.specialAbilities) : [];
  const legendaryActions = mon.legendaryActionsPtBr
    ? JSON.parse(mon.legendaryActionsPtBr)
    : mon.legendaryActions ? JSON.parse(mon.legendaryActions) : [];
  const reactions = mon.reactionsPtBr
    ? JSON.parse(mon.reactionsPtBr)
    : mon.reactions ? JSON.parse(mon.reactions) : [];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <Link href="/acervo/monsters" className="btn btn-ghost btn-sm">← Monstros</Link>
          <span className="badge badge-5e">D&D {mon.edition}</span>
        </div>
        <h1 style={{ fontSize: "var(--text-2xl)" }}>{namePtBr}</h1>
        {mon.namePtBr && (
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}>
            {mon.name}
          </p>
        )}
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          {translateSize(mon.size)} {translateCreatureType(mon.type)}
          {mon.alignment ? `, ${translateAlignment(mon.alignment)}` : ""}
        </p>
      </div>

      <div className="monster-detail-grid">
        {/* Left — Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Basic Stats */}
          <div className="card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <div className="attr-box" style={{ borderColor: "var(--info)", background: "var(--info-subtle)" }}>
                <span className="attr-value" style={{ color: "var(--info)", fontSize: "var(--text-2xl)" }}>{mon.armorClass}</span>
                <span className="attr-label">CA</span>
              </div>
              <div className="attr-box" style={{ borderColor: "var(--danger)", background: "var(--danger-subtle)" }}>
                <span className="attr-value" style={{ color: "var(--danger)", fontSize: "var(--text-2xl)" }}>{mon.hitPoints}</span>
                <span className="attr-label">PV ({mon.hitDice})</span>
              </div>
              <div className="attr-box" style={{ borderColor: "var(--warning)", background: "var(--warning-subtle)" }}>
                <span className="attr-value" style={{ color: "var(--warning)", fontSize: "var(--text-2xl)" }}>{mon.challengeRating}</span>
                <span className="attr-label">ND ({mon.xp.toLocaleString()} XP)</span>
              </div>
            </div>

            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
              <strong>{uiLabels.speed}:</strong> {speedStr}
            </p>

            <hr className="divider" />

            {/* Ability Scores */}
            <div className="attributes-grid" style={{ marginTop: "var(--space-3)" }}>
              {([
                { key: "str", label: "FOR", val: mon.str },
                { key: "dex", label: "DES", val: mon.dex },
                { key: "con", label: "CON", val: mon.con },
                { key: "intl", label: "INT", val: mon.intl },
                { key: "wis", label: "SAB", val: mon.wis },
                { key: "cha", label: "CAR", val: mon.cha },
              ] as const).map(({ key, label, val }) => (
                <div key={key} className="attr-box">
                  <span className="attr-value">{val}</span>
                  <span className="attr-mod">{getModifier(val)}</span>
                  <span className="attr-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Senses & Languages */}
          <div className="card">
            {sensesStr && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                <strong>{uiLabels.senses}:</strong> {sensesStr}
              </p>
            )}
            {mon.languages && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                <strong>{uiLabels.languages}:</strong> {mon.languages}
              </p>
            )}
            {mon.damageImmunities && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                <strong>{uiLabels.damageImmunities}:</strong> {translateDamageList(mon.damageImmunities)}
              </p>
            )}
            {mon.damageResistances && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                <strong>{uiLabels.damageResistances}:</strong> {translateDamageList(mon.damageResistances)}
              </p>
            )}
            {mon.conditionImmunities && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <strong>{uiLabels.conditionImmunities}:</strong> {translateConditionList(mon.conditionImmunities)}
              </p>
            )}
          </div>
        </div>

        {/* Right — Abilities & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Special Abilities */}
          {specialAbilities.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚡ {uiLabels.specialAbilities}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {specialAbilities.map((ab: { name: string; desc: string }, i: number) => (
                  <div key={i}>
                    <p style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {ab.name}
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {ab.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚔️ {uiLabels.actions}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {actions.map((act: { name: string; desc: string }, i: number) => (
                  <div key={i}>
                    <p style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {act.name}
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reactions */}
          {reactions.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">🔄 {uiLabels.reactions}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {reactions.map((act: { name: string; desc: string }, i: number) => (
                  <div key={i}>
                    <p style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {act.name}
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legendary Actions */}
          {legendaryActions.length > 0 && (
            <div className="card" style={{ borderColor: "var(--warning)", borderWidth: "1px" }}>
              <div className="card-header">
                <span className="card-title">👑 {uiLabels.legendaryActions}</span>
                <span className="badge badge-gold">Lendário</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {legendaryActions.map((act: { name: string; desc: string }, i: number) => (
                  <div key={i}>
                    <p style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {act.name}
                    </p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {act.desc}
                    </p>
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
