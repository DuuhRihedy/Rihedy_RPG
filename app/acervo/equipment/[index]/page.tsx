import { getEquipment } from "@/lib/actions/srd";
import { translateCategory } from "@/lib/translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../acervo.css";

export const dynamic = 'force-dynamic';

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;
  const item = await getEquipment(index);
  if (!item) notFound();

  return (
    <div className="page-container">
      <Link href="/acervo/equipment" className="breadcrumb-link">← Equipamentos</Link>

      <div className="spell-detail card">
        <div className="spell-header">
          <h1 className="spell-name">{item.namePtBr || item.name}</h1>
          <p className="spell-original">{item.name}</p>
        </div>

        <div className="spell-meta-grid">
          <div className="spell-meta-item">
            <span className="spell-meta-label">Categoria</span>
            <span className="spell-meta-value">{translateCategory(item.category)}</span>
          </div>
          {item.cost && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Custo</span>
              <span className="spell-meta-value">{item.cost}</span>
            </div>
          )}
          {item.weight !== null && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Peso</span>
              <span className="spell-meta-value">{item.weight} lb</span>
            </div>
          )}
          {item.damage && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Dano</span>
              <span className="spell-meta-value">{item.damage}</span>
            </div>
          )}
          {item.armorClass && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">CA</span>
              <span className="spell-meta-value">{item.armorClass}</span>
            </div>
          )}
          {item.properties && (
            <div className="spell-meta-item">
              <span className="spell-meta-label">Propriedades</span>
              <span className="spell-meta-value">{item.properties}</span>
            </div>
          )}
        </div>

        {item.description && (
          <div className="spell-section">
            <h3>Descrição</h3>
            <p>{item.descriptionPtBr || item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
