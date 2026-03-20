import { getClass } from "@/lib/actions/srd";
import { translateClassName } from "@/lib/translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../acervo.css";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;
  const cls = await getClass(index);
  if (!cls) notFound();

  const proficiencies = cls.proficiencies ? JSON.parse(cls.proficiencies) : [];
  const spellcasting = cls.spellcasting ? JSON.parse(cls.spellcasting) : null;

  return (
    <div className="page-container">
      <Link href="/acervo/classes" className="breadcrumb-link">← Classes</Link>

      <div className="spell-detail card">
        <div className="spell-header">
          <h1 className="spell-name">{translateClassName(cls.name)}</h1>
          <p className="spell-original">{cls.name}</p>
        </div>

        <div className="spell-meta-grid">
          <div className="spell-meta-item">
            <span className="spell-meta-label">Dado de Vida</span>
            <span className="spell-meta-value">d{cls.hitDie}</span>
          </div>
          {cls.savingThrows && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Salvaguardas</span>
              <span className="spell-meta-value">{cls.savingThrows}</span>
            </div>
          )}
          {spellcasting && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Conjuração</span>
              <span className="spell-meta-value">{spellcasting.spellcasting_ability?.name || "—"}</span>
            </div>
          )}
        </div>

        {proficiencies.length > 0 && (
          <div className="spell-section">
            <h3>Proficiências</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {proficiencies.map((p: { name: string }, i: number) => (
                <li key={i} style={{ padding: "4px 0", color: "var(--text-secondary)" }}>
                  ▸ {p.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
