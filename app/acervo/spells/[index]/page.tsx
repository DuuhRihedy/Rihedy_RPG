import { getSpell } from "@/lib/actions/srd";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../../acervo.css";

type Params = Promise<{ index: string }>;

export default async function SpellDetailPage({ params }: { params: Params }) {
  const { index } = await params;
  const spell = await getSpell(index);

  if (!spell) notFound();

  function levelLabel(lvl: number) {
    if (lvl === 0) return "Cantrip";
    const suffixes: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
    return `${lvl}${suffixes[lvl] || "th"}-level`;
  }

  return (
    <div className="page-container">
      <div className="spell-detail-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <Link href="/acervo/spells" className="btn btn-ghost btn-sm">← Magias</Link>
          <span className="badge badge-5e">D&D {spell.edition}</span>
          <span className="badge" style={{ background: "var(--bg-tertiary)" }}>{spell.source}</span>
        </div>
        <h1 className="spell-detail-title">{spell.name}</h1>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          {levelLabel(spell.level)} {spell.school}
          {spell.ritual && " (ritual)"}
        </p>

        <div className="spell-detail-meta">
          <div className="spell-meta-item">
            <span className="spell-meta-label">Casting Time</span>
            <span className="spell-meta-value">{spell.castingTime}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">Range</span>
            <span className="spell-meta-value">{spell.range}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">Components</span>
            <span className="spell-meta-value">{spell.components}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">Duration</span>
            <span className="spell-meta-value">
              {spell.concentration && "Concentration, "}
              {spell.duration}
            </span>
          </div>
          {spell.damageType && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Damage</span>
              <span className="spell-meta-value">{spell.damageType}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <div className="card-header">
          <span className="card-title">📖 Descrição</span>
        </div>
        <p className="spell-description">{spell.description}</p>
      </div>

      {spell.higherLevel && (
        <div className="card" style={{ marginBottom: "var(--space-4)" }}>
          <div className="card-header">
            <span className="card-title">⬆️ Em Níveis Superiores</span>
          </div>
          <p className="spell-description">{spell.higherLevel}</p>
        </div>
      )}

      {spell.material && (
        <div className="card" style={{ marginBottom: "var(--space-4)" }}>
          <div className="card-header">
            <span className="card-title">🧪 Material</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            {spell.material}
          </p>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">⚔️ Classes</span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {spell.classes.split(", ").map((cls) => (
            <span key={cls} className="badge badge-gold">{cls}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
