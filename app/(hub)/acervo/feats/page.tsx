import { searchFeats, getFeatFilters } from "@/lib/actions/srd";
import Link from "next/link";
import AcervoEditionSync from "@/components/AcervoEditionSync";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function FeatsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; edition?: string }>;
}) {
  const params = await searchParams;
  const [feats, filters] = await Promise.all([
    searchFeats(params.q, params.edition),
    getFeatFilters(),
  ]);

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
      <AcervoEditionSync />
      <div className="page-header">
        <div>
          <Link href="/acervo" className="btn btn-ghost btn-sm">← Acervo</Link>
          <h1>🎯 Talentos (Feats)</h1>
          <p>{feats.length} talentos encontrados</p>
        </div>
      </div>

      <form className="srd-search-bar card">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar talento (nome ou descrição)..."
          defaultValue={params.q || ""}
        />
        <select name="edition" className="input select" defaultValue={params.edition || ""}>
          <option value="">Todas as edições</option>
          {filters.editions.map((e) => (
            <option key={e} value={e}>D&D {e}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="srd-results">
        {feats.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
            Nenhum talento encontrado
          </div>
        ) : (
          feats.map((feat) => (
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
                {(feat.descriptionPtBr || feat.description).substring(0, 300)}
                {(feat.descriptionPtBr || feat.description).length > 300 ? "..." : ""}
              </p>
              <div className="srd-result-sub">{feat.name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
