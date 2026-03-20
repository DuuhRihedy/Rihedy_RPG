import { searchEquipment, getEquipmentFilters } from "@/lib/actions/srd";
import { translateCategory } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [equipment, filters] = await Promise.all([
    searchEquipment(params.q, params.category),
    getEquipmentFilters(),
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link href="/acervo" className="breadcrumb-link">← Acervo</Link>
          <h1 className="page-title">🛡️ Equipamentos</h1>
          <p className="page-subtitle">{equipment.length} itens encontrados</p>
        </div>
      </div>

      <form className="srd-filters" action="/acervo/equipment">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar equipamento..."
          defaultValue={params.q || ""}
        />
        <select name="category" className="input select" defaultValue={params.category || ""}>
          <option value="">Todas as categorias</option>
          {filters.categories.map((c) => (
            <option key={c} value={c}>{translateCategory(c)}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      <div className="srd-results">
        {equipment.map((e) => (
          <Link key={e.id} href={`/acervo/equipment/${e.index}`} className="srd-result-card card card-interactive">
            <div className="srd-result-header">
              <h3 className="srd-result-name">{e.namePtBr || e.name}</h3>
              <span className="badge badge-gold">{translateCategory(e.category)}</span>
            </div>
            <div className="srd-result-meta">
              {e.cost && <span>💰 {e.cost}</span>}
              {e.weight !== null && <span>⚖️ {e.weight} lb</span>}
              {e.damage && <span>⚔️ {e.damage}</span>}
            </div>
            <div className="srd-result-sub">{e.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
