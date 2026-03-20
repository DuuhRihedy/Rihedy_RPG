import { prisma } from "@/lib/db";
import Link from "next/link";
import "../acervo.css";

export default async function FeatsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; edition?: string; type?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { namePtBr: { contains: params.q } },
    ];
  }
  if (params.edition) where.edition = params.edition;

  const feats = await prisma.srdFeat.findMany({
    where,
    orderBy: [{ edition: "asc" }, { name: "asc" }],
  });

  const featTypes: Record<string, string> = {
    General: "Geral",
    Fighter: "Guerreiro",
    Metamagic: "Metamagia",
    "Item Creation": "Criação de Item",
  };

  function getFeatType(feat: { prerequisites: string | null }): string {
    if (!feat.prerequisites) return "Geral";
    try {
      const p = JSON.parse(feat.prerequisites);
      return featTypes[p.type] || p.type || "Geral";
    } catch {
      return "Geral";
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link href="/acervo" className="breadcrumb-link">← Acervo</Link>
          <h1 className="page-title">🎯 Talentos (Feats)</h1>
          <p className="page-subtitle">{feats.length} talentos encontrados</p>
        </div>
      </div>

      <form className="srd-filters" action="/acervo/feats">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar talento..."
          defaultValue={params.q || ""}
        />
        <select name="edition" className="input select" defaultValue={params.edition || ""}>
          <option value="">Todas as edições</option>
          <option value="3.5">D&D 3.5</option>
          <option value="5e">D&D 5e</option>
        </select>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="srd-results">
        {feats.map((feat) => (
          <div key={feat.id} className="srd-result-card card">
            <div className="srd-result-header">
              <h3 className="srd-result-name">{feat.namePtBr || feat.name}</h3>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <span className={`badge ${feat.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                  {feat.edition}
                </span>
                <span className="badge badge-gold">{getFeatType(feat)}</span>
              </div>
            </div>
            <p className="srd-result-desc" style={{ margin: "var(--space-2) 0 0", color: "var(--text-secondary)", fontSize: "var(--text-sm)", whiteSpace: "pre-line" }}>
              {feat.descriptionPtBr || feat.description}
            </p>
            <div className="srd-result-sub">{feat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
