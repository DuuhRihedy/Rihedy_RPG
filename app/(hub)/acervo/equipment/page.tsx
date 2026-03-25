import { searchEquipment, getEquipmentFilters } from "@/lib/actions/srd";
import { translateCategory } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; edition?: string }>;
}) {
  const params = await searchParams;
  const [equipment, filters] = await Promise.all([
    searchEquipment(params.q, params.category, params.edition),
    getEquipmentFilters(),
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link href="/acervo" className="btn btn-ghost btn-sm">← Acervo</Link>
          <h1>🛡️ Equipamentos</h1>
          <p>{equipment.length} itens encontrados</p>
        </div>
      </div>

      <form className="srd-search-bar card">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar equipamento..."
          defaultValue={params.q || ""}
        />
        <select name="edition" className="input select" defaultValue={params.edition || ""}>
          <option value="">Todas as edições</option>
          {filters.editions.map((e) => (
            <option key={e} value={e}>D&D {e}</option>
          ))}
        </select>
        <select name="category" className="input select" defaultValue={params.category || ""}>
          <option value="">Todas as categorias</option>
          {filters.categories.map((c) => (
            <option key={c} value={c}>{translateCategory(c)}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="srd-results">
        {equipment.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
            Nenhum equipamento encontrado
          </div>
        ) : (
          equipment.map((e) => (
            <Link key={e.id} href={`/acervo/equipment/${e.index}`} className="srd-result-card card card-interactive">
              <div className="srd-result-header">
                <h3 className="srd-result-name">{e.namePtBr || e.name}</h3>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <span className={`badge badge-sm ${e.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                    {e.edition}
                  </span>
                  <span className="badge badge-gold">{translateCategory(e.category)}</span>
                </div>
              </div>
              <div className="srd-result-meta">
                {e.cost && <span>💰 {e.cost}</span>}
                {e.weight !== null && <span>⚖️ {e.weight} lb</span>}
                {e.damage && <span>⚔️ {e.damage}</span>}
              </div>
              <div className="srd-result-sub">{e.name}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
