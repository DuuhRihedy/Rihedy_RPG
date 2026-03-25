import { getCustomContent, createCustomSpell, createCustomFeat, createCustomEquipment, deleteCustomSpell, deleteCustomFeat, deleteCustomEquipment } from "@/lib/actions/homebrew";
import { DeleteButton } from "@/components/ui/DeleteButton";
import "../calculadoras/calculadoras.css";

export const dynamic = "force-dynamic";

const SCHOOLS = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];

export default async function HomebrewPage() {
  const custom = await getCustomContent();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🛠️ Conteúdo Homebrew</h1>
          <p>Crie magias, talentos e equipamentos personalizados para suas campanhas</p>
        </div>
      </div>

      {/* Create Custom Spell */}
      <form action={createCustomSpell} className="card create-form">
        <h4 className="create-form-title">✨ Nova Magia Homebrew</h4>
        <div className="form-row">
          <input name="name" className="input" placeholder="Nome (EN)..." required />
          <input name="namePtBr" className="input" placeholder="Nome (PT-BR)..." />
          <input name="level" type="number" className="input" placeholder="Nível" min="0" max="9" style={{ maxWidth: 80 }} />
          <select name="school" className="input select">
            {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-row">
          <input name="castingTime" className="input" placeholder="Tempo de conjuração" />
          <input name="range" className="input" placeholder="Alcance" />
          <input name="components" className="input" placeholder="Componentes (V, S, M)" />
          <input name="duration" className="input" placeholder="Duração" />
        </div>
        <div className="form-row">
          <input name="classes" className="input" placeholder="Classes (ex: Wizard, Sorcerer)" />
        </div>
        <textarea name="description" className="input textarea" placeholder="Descrição (EN)" rows={2} />
        <textarea name="descriptionPtBr" className="input textarea" placeholder="Descrição (PT-BR)" rows={2} />
        <button type="submit" className="btn btn-primary">Criar Magia</button>
      </form>

      {/* Create Custom Feat */}
      <form action={createCustomFeat} className="card create-form">
        <h4 className="create-form-title">🎯 Novo Talento Homebrew</h4>
        <div className="form-row">
          <input name="name" className="input" placeholder="Nome (EN)..." required />
          <input name="namePtBr" className="input" placeholder="Nome (PT-BR)..." />
          <input name="prerequisites" className="input" placeholder="Pré-requisitos" />
        </div>
        <textarea name="description" className="input textarea" placeholder="Descrição (EN)" rows={2} />
        <textarea name="descriptionPtBr" className="input textarea" placeholder="Descrição (PT-BR)" rows={2} />
        <button type="submit" className="btn btn-primary">Criar Talento</button>
      </form>

      {/* Create Custom Equipment */}
      <form action={createCustomEquipment} className="card create-form">
        <h4 className="create-form-title">🛡️ Novo Equipamento Homebrew</h4>
        <div className="form-row">
          <input name="name" className="input" placeholder="Nome (EN)..." required />
          <input name="namePtBr" className="input" placeholder="Nome (PT-BR)..." />
          <select name="category" className="input select">
            <option value="Weapon">Arma</option>
            <option value="Armor">Armadura</option>
            <option value="Shield">Escudo</option>
            <option value="Adventuring Gear">Aventura</option>
            <option value="Tool">Ferramenta</option>
          </select>
        </div>
        <div className="form-row">
          <input name="cost" className="input" placeholder="Custo (ex: 50 gp)" />
          <input name="weight" type="number" className="input" placeholder="Peso (lb)" step="0.1" />
          <input name="damage" className="input" placeholder="Dano (ex: 1d8)" />
          <input name="properties" className="input" placeholder="Propriedades" />
        </div>
        <textarea name="description" className="input textarea" placeholder="Descrição" rows={2} />
        <button type="submit" className="btn btn-primary">Criar Equipamento</button>
      </form>

      {/* Listing */}
      {custom.spells.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "var(--space-3)" }}>✨ Magias Custom ({custom.spells.length})</h3>
          <div className="npc-list-view">
            {custom.spells.map((s) => (
              <div key={s.id} className="npc-list-item">
                <div className="npc-list-info">
                  <strong>{s.namePtBr || s.name}</strong>
                  <span className="npc-list-meta">Nv {s.level} · {s.school} · {s.classes}</span>
                </div>
                <DeleteButton
                  action={async () => { "use server"; await deleteCustomSpell(s.id); }}
                  entityName={s.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {custom.feats.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "var(--space-3)" }}>🎯 Talentos Custom ({custom.feats.length})</h3>
          <div className="npc-list-view">
            {custom.feats.map((f) => (
              <div key={f.id} className="npc-list-item">
                <div className="npc-list-info">
                  <strong>{f.namePtBr || f.name}</strong>
                  <span className="npc-list-meta">{f.prerequisites || "Sem pré-requisitos"}</span>
                </div>
                <DeleteButton
                  action={async () => { "use server"; await deleteCustomFeat(f.id); }}
                  entityName={f.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {custom.equipment.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "var(--space-3)" }}>🛡️ Equipamentos Custom ({custom.equipment.length})</h3>
          <div className="npc-list-view">
            {custom.equipment.map((e) => (
              <div key={e.id} className="npc-list-item">
                <div className="npc-list-info">
                  <strong>{e.namePtBr || e.name}</strong>
                  <span className="npc-list-meta">{e.category} · {e.cost} · {e.weight} lb.</span>
                </div>
                <DeleteButton
                  action={async () => { "use server"; await deleteCustomEquipment(e.id); }}
                  entityName={e.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {custom.spells.length === 0 && custom.feats.length === 0 && custom.equipment.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">📝</span>
          <h3>Nenhum conteúdo homebrew</h3>
          <p>Use os formulários acima para criar magias, talentos ou equipamentos personalizados</p>
        </div>
      )}
    </div>
  );
}
