import { getSpell } from "@/lib/actions/srd";
import {
  translateSchool,
  translateCastingTime,
  translateRange,
  translateDuration,
  translateDamageType,
  translateClassList,
  translateSpellLevel,
  uiLabels,
} from "@/lib/translations";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../../acervo.css";

export const dynamic = 'force-dynamic';

type Params = Promise<{ index: string }>;

export default async function SpellDetailPage({ params }: { params: Params }) {
  const { index } = await params;
  const spell = await getSpell(index);

  if (!spell) notFound();

  const namePtBr = spell.namePtBr || spell.name;
  const descPtBr = spell.descriptionPtBr || spell.description;
  const higherPtBr = spell.higherLevelPtBr || spell.higherLevel;
  const materialPtBr = spell.materialPtBr || spell.material;

  return (
    <div className="page-container">
      <div className="spell-detail-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <Link href="/acervo/spells" className="btn btn-ghost btn-sm">← Magias</Link>
          <span className="badge badge-5e">D&D {spell.edition}</span>
          <span className="badge" style={{ background: "var(--bg-tertiary)" }}>{spell.source}</span>
        </div>
        <h1 className="spell-detail-title">{namePtBr}</h1>
        {spell.namePtBr && (
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}>
            {spell.name}
          </p>
        )}
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          {translateSpellLevel(spell.level)} — {translateSchool(spell.school)}
          {spell.ritual && " (ritual)"}
        </p>

        <div className="spell-detail-meta">
          <div className="spell-meta-item">
            <span className="spell-meta-label">{uiLabels.castingTime}</span>
            <span className="spell-meta-value">{translateCastingTime(spell.castingTime)}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">{uiLabels.range}</span>
            <span className="spell-meta-value">{translateRange(spell.range)}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">{uiLabels.components}</span>
            <span className="spell-meta-value">{spell.components}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">{uiLabels.duration}</span>
            <span className="spell-meta-value">
              {spell.concentration && `${uiLabels.concentration}, `}
              {translateDuration(spell.duration)}
            </span>
          </div>
          {spell.damageType && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">{uiLabels.damage}</span>
              <span className="spell-meta-value">{translateDamageType(spell.damageType)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <div className="card-header">
          <span className="card-title">📖 {uiLabels.description}</span>
        </div>
        <p className="spell-description">{descPtBr}</p>
      </div>

      {higherPtBr && (
        <div className="card" style={{ marginBottom: "var(--space-4)" }}>
          <div className="card-header">
            <span className="card-title">⬆️ {uiLabels.higherLevel}</span>
          </div>
          <p className="spell-description">{higherPtBr}</p>
        </div>
      )}

      {materialPtBr && (
        <div className="card" style={{ marginBottom: "var(--space-4)" }}>
          <div className="card-header">
            <span className="card-title">🧪 {uiLabels.material}</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            {materialPtBr}
          </p>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">⚔️ {uiLabels.classes}</span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {spell.classes.split(", ").map((cls) => (
            <span key={cls} className="badge badge-gold">{translateClassList(cls)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
