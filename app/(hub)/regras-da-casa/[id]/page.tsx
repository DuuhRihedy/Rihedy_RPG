import { getHouseRule } from "@/lib/actions/house-rules";
import { HOUSE_RULE_CATEGORIES } from "@/lib/house-rule-categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import HouseRuleActions from "./HouseRuleActions";
import "../regras.css";

export const dynamic = "force-dynamic";

export default async function HouseRuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await getHouseRule(id);
  if (!rule) notFound();

  const cat = HOUSE_RULE_CATEGORIES.find((c) => c.id === rule.category);

  return (
    <div className="regra-detail">
      <Link href="/regras-da-casa" className="regra-detail-back">
        ← Voltar às Regras da Casa
      </Link>

      <div className="regra-detail-hero">
        <div className="regra-detail-icon">{rule.icon}</div>
        <h1 className="regra-detail-title">{rule.title}</h1>
      </div>

      <div className="regra-detail-meta">
        <span className="regra-category">
          {cat?.icon || "📖"} {cat?.label || rule.category}
        </span>
        {rule.pinned && (
          <span className="badge badge-gold">📌 Fixada</span>
        )}
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          Atualizada em{" "}
          {rule.updatedAt.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <HouseRuleActions ruleId={rule.id} pinned={rule.pinned} />

      <div
        className="regra-content"
        dangerouslySetInnerHTML={{ __html: rule.content }}
      />
    </div>
  );
}
