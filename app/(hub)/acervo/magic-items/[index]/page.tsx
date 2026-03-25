import { getMagicItem } from "@/lib/actions/srd";
import { translateRarity, translateCategory } from "@/lib/translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../acervo.css";

export const dynamic = 'force-dynamic';

export default async function MagicItemDetailPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;
  const item = await getMagicItem(index);
  if (!item) notFound();

  return (
    <div className="page-container">
      <Link href="/acervo/magic-items" className="breadcrumb-link">← Itens Mágicos</Link>

      <div className="spell-detail card">
        <div className="spell-header">
          <h1 className="spell-name">{item.namePtBr || item.name}</h1>
          <p className="spell-original">{item.name}</p>
        </div>

        <div className="spell-meta-grid">
          <div className="spell-meta-item">
            <span className="spell-meta-label">Raridade</span>
            <span className="spell-meta-value">{translateRarity(item.rarity)}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">Categoria</span>
            <span className="spell-meta-value">{translateCategory(item.category)}</span>
          </div>
          <div className="spell-meta-item">
            <span className="spell-meta-label">Sintonização</span>
            <span className="spell-meta-value">{item.requiresAttunement ? "Sim" : "Não"}</span>
          </div>
        </div>

        {item.description && (
          <div className="spell-section">
            <h3>Descrição</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{item.descriptionPtBr || item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
