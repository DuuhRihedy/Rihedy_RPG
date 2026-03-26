import { searchMagicItems, getMagicItemFilters } from "@/lib/actions/srd";
import { translateRarity, translateCategory } from "@/lib/translations";
import Link from "next/link";
import AcervoEditionSync from "@/components/AcervoEditionSync";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function MagicItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rarity?: string; category?: string; edition?: string }>;
}) {
  const params = await searchParams;
  const [items, filters] = await Promise.all([
    searchMagicItems(params.q, params.rarity, params.category, params.edition),
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
      <AcervoEditionSync />
      <div className="page-header">
        <div>
          <Link href="/acervo" className="btn btn-ghost btn-sm">← Acervo</Link>
          <h1>✨ Itens Mágicos</h1>
          <p>{items.length} itens encontrados</p>
        </div>
      </div>

      <form className="srd-search-bar card">
        <input
          type="text"
          name="q"
          className="input"
          placeholder="Buscar item mágico..."
          defaultValue={params.q || ""}
        />
        <select name="edition" className="input select" defaultValue={params.edition || ""}>
          <option value="">Todas as edições</option>
          {filters.editions.map((e) => (
            <option key={e} value={e}>D&D {e}</option>
          ))}
        </select>
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
        {items.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
            Nenhum item mágico encontrado
          </div>
        ) : (
          items.map((item) => (
            <Link key={item.id} href={`/acervo/magic-items/${item.index}`} className="srd-result-card card card-interactive">
              <div className="srd-result-header">
                <h3 className="srd-result-name">{item.namePtBr || item.name}</h3>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <span className={`badge badge-sm ${item.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                    {item.edition}
                  </span>
                  <span className="badge" style={{ color: rarityColors[item.rarity] || "var(--text-secondary)", borderColor: rarityColors[item.rarity] || "var(--border-default)", background: "transparent", border: "1px solid" }}>
                    {translateRarity(item.rarity)}
                  </span>
                </div>
              </div>
              <div className="srd-result-meta">
                <span>{translateCategory(item.category)}</span>
                {item.requiresAttunement && <span>🔮 Sintonização</span>}
              </div>
              <div className="srd-result-sub">{item.name}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
