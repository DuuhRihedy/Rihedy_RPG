import { getHouseRules } from "@/lib/actions/house-rules";
import { HOUSE_RULE_CATEGORIES } from "@/lib/house-rule-categories";
import HouseRulesFilter from "./HouseRulesFilter";
import AdminNewRuleButton from "./AdminNewRuleButton";
import "./regras.css";

export const dynamic = "force-dynamic";

export default async function RegrasPage() {
  const rules = await getHouseRules();

  return (
    <div className="regras-page">
      <div className="regras-header">
        <div>
          <h1>📜 Regras da Casa</h1>
          <p>
            Regras customizadas, mecânicas homebrew e convenções da sua mesa
          </p>
        </div>
        <AdminNewRuleButton />
      </div>

      {rules.length === 0 ? (
        <div className="regras-empty">
          <span className="regras-empty-icon">📜</span>
          <h3>Nenhuma regra criada ainda</h3>
          <p>
            Crie suas primeiras regras da casa para definir como sua mesa
            funciona
          </p>
          <AdminNewRuleButton variant="gold" label="Criar Primeira Regra" />
        </div>
      ) : (
        <>
          <HouseRulesFilter
            rules={rules.map((r) => ({
              id: r.id,
              title: r.title,
              icon: r.icon,
              category: r.category,
              summary: r.summary,
              pinned: r.pinned,
              updatedAt: r.updatedAt.toISOString(),
            }))}
            categories={HOUSE_RULE_CATEGORIES}
          />
        </>
      )}
    </div>
  );
}
