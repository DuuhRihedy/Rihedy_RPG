import { searchMagicItems, getMagicItemFilters } from "@/lib/actions/srd";
import { translateRarity, translateCategory } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function MagicItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rarity?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [items, filters] = await Promise.all([
    searchMagicItems(params.q, params.rarity, params.category),
    getMagicItemFilters(),
  ]);

  const rarityColors: Record<string, string> = {
    Common: "var(--text-secondary)",
    Uncommon: "var(--success)",
    Rare: "var(--info)",
    "Very Rare": "var(--arcane)",
    Legendary: "var(--dnd-gold)",
    Artifact: "var(--dnd-red)",
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link href="/acervo" className="breadcrumb-link">← Acervo</Link>
          <h1 className="page-title">✨ Itens Mágicos</h1>
          <p className="page-subtitle">{items.length} itens encontrados</p>
        </div>
      </div>

      <form className="srd-filters" action="/acervo/magic-items">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar item mágico..."
          defaultValue={params.q || ""}
        />
        <select name="rarity" className="input select" defaultValue={params.rarity || ""}>
          <option value="">Todas as raridades</option>
          {filters.rarities.map((r) => (
            <option key={r} value={r}>{translateRarity(r)}</option>
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
        {items.map((item) => (
          <Link key={item.id} href={`/acervo/magic-items/${item.index}`} className="srd-result-card card card-interactive">
            <div className="srd-result-header">
              <h3 className="srd-result-name">{item.namePtBr || item.name}</h3>
              <span className="badge" style={{ color: rarityColors[item.rarity] || "var(--text-secondary)", borderColor: rarityColors[item.rarity] || "var(--border-default)", background: "transparent", border: "1px solid" }}>
                {translateRarity(item.rarity)}
              </span>
            </div>
            <div className="srd-result-meta">
              <span>{translateCategory(item.category)}</span>
              {item.requiresAttunement && <span>🔮 Sintonização</span>}
            </div>
            <div className="srd-result-sub">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
