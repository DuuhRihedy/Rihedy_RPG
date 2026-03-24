import { getNpc, updateNpc, addItemToNpc, removeItemFromNpc, createRelation, deleteRelation, getAllNpcsForSelector } from "@/lib/actions/npcs";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import NpcImageField from "@/components/NpcImageField";
import "../../../campanhas/campanhas.css";

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function EditNpcPage({ params }: { params: Params }) {
  const { id } = await params;
  const [npc, allNpcs] = await Promise.all([
    getNpc(id),
    getAllNpcsForSelector(id),
  ]);

  if (!npc) notFound();

  const attrs = npc.attributes;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateNpc(id, formData);
    redirect(`/npcs/${id}`);
  }

  async function handleAddItem(formData: FormData) {
    "use server";
    await addItemToNpc(formData);
  }

  async function handleRemoveItem(formData: FormData) {
    "use server";
    const itemId = formData.get("itemId") as string;
    await removeItemFromNpc(itemId, id);
  }

  async function handleAddRelation(formData: FormData) {
    "use server";
    await createRelation(formData);
  }

  async function handleDeleteRelation(formData: FormData) {
    "use server";
    const relationId = formData.get("relationId") as string;
    await deleteRelation(relationId, id);
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="campaign-detail-header">
        <div>
          <Link href={`/npcs/${id}`} className="btn btn-ghost btn-sm">← Voltar ao NPC</Link>
          <h1 className="campaign-detail-title" style={{ marginTop: "var(--space-2)" }}>
            ✏️ Editar — {npc.name}
          </h1>
        </div>
      </div>

      <form action={handleUpdate}>
        <div className="npc-detail-grid">
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

            {/* Informações Básicas */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">👤 Informações Básicas</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input name="name" className="input" defaultValue={npc.name} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <div className="form-group">
                    <label className="form-label">Raça</label>
                    <input name="race" className="input" defaultValue={npc.race || ""} placeholder="Ex: Humano, Elfo..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Classe</label>
                    <input name="class" className="input" defaultValue={npc.class || ""} placeholder="Ex: Guerreiro, Mago..." />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" }}>
                  <div className="form-group">
                    <label className="form-label">Nível</label>
                    <input name="level" type="number" className="input" defaultValue={npc.level || ""} min="1" max="30" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alinhamento</label>
                    <select name="alignment" className="input select" defaultValue={npc.alignment || ""}>
                      <option value="">—</option>
                      <option value="Leal e Bom">Leal e Bom</option>
                      <option value="Neutro e Bom">Neutro e Bom</option>
                      <option value="Caótico e Bom">Caótico e Bom</option>
                      <option value="Leal e Neutro">Leal e Neutro</option>
                      <option value="Neutro">Neutro</option>
                      <option value="Caótico e Neutro">Caótico e Neutro</option>
                      <option value="Leal e Mau">Leal e Mau</option>
                      <option value="Neutro e Mau">Neutro e Mau</option>
                      <option value="Caótico e Mau">Caótico e Mau</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipo</label>
                    <select name="type" className="input select" defaultValue={npc.type}>
                      <option value="ally">🛡️ Aliado</option>
                      <option value="enemy">💀 Inimigo</option>
                      <option value="neutral">👤 Neutro</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                  <div className="form-group">
                    <label className="form-label">Edição</label>
                    <select name="edition" className="input select" defaultValue={npc.edition}>
                      <option value="3.5">D&D 3.5</option>
                      <option value="5e">D&D 5e</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" className="input select" defaultValue={npc.status}>
                      <option value="alive">Vivo</option>
                      <option value="dead">Morto</option>
                      <option value="missing">Desaparecido</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Textos */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">📝 Textos</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label">Descrição (aparência, personalidade)</label>
                  <textarea name="description" className="input textarea" rows={4} defaultValue={npc.description || ""} placeholder="Descreva a aparência, traços de personalidade..." />
                </div>
                <div className="form-group">
                  <label className="form-label">📜 História / Backstory</label>
                  <textarea name="backstory" className="input textarea" rows={6} defaultValue={npc.backstory || ""} placeholder="Conte a história deste NPC... De onde veio? O que o motiva?" />
                </div>
                <div className="form-group">
                  <label className="form-label">🔒 Notas do Mestre (GM Only)</label>
                  <textarea name="gmNotes" className="input textarea" rows={4} defaultValue={npc.gmNotes || ""} placeholder="Segredos, planos ocultos, informações que os jogadores não sabem..." />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

            {/* Imagem do NPC */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">🖼️ Imagem</span>
              </div>
              <NpcImageField currentImage={npc.imageUrl} npcName={npc.name} />
            </div>

            {/* Atributos */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚔️ Atributos</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: "var(--danger)" }}>❤️ HP</label>
                  <input name="hp" type="number" className="input" defaultValue={attrs?.hp || 10} min="1" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: "var(--info)" }}>🛡️ AC</label>
                  <input name="ac" type="number" className="input" defaultValue={attrs?.ac || 10} min="0" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" }}>
                {([
                  { name: "str", label: "FOR" },
                  { name: "dex", label: "DES" },
                  { name: "con", label: "CON" },
                  { name: "int", label: "INT" },
                  { name: "wis", label: "SAB" },
                  { name: "cha", label: "CAR" },
                ] as const).map(({ name, label }) => (
                  <div key={name} className="form-group">
                    <label className="form-label">{label}</label>
                    <input 
                      name={name} 
                      type="number" 
                      className="input" 
                      defaultValue={attrs?.[name === "int" ? "intl" : name] || 10} 
                      min="1" 
                      max="30" 
                      style={{ textAlign: "center" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "var(--space-3)" }}>
              💾 Salvar Alterações
            </button>
          </div>
        </div>
      </form>

      <hr className="divider" style={{ margin: "var(--space-8) 0" }} />

      {/* Itens */}
      <div className="card" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card-header">
          <span className="card-title">🎒 Itens ({npc.items.length})</span>
        </div>

        {npc.items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
            {npc.items.map((item) => (
              <div key={item.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span>{item.magical ? "✨" : "🔧"}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginLeft: "var(--space-2)" }}>
                      {[item.type, item.value].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                </div>
                <form action={handleRemoveItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={handleAddItem} style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "end" }}>
          <input type="hidden" name="npcId" value={id} />
          <div className="form-group" style={{ flex: "2", minWidth: "150px" }}>
            <label className="form-label">Nome do Item</label>
            <input name="name" className="input" placeholder="Ex: Espada Longa +1" required />
          </div>
          <div className="form-group" style={{ flex: "1", minWidth: "100px" }}>
            <label className="form-label">Tipo</label>
            <select name="type" className="input select">
              <option value="weapon">Arma</option>
              <option value="armor">Armadura</option>
              <option value="potion">Poção</option>
              <option value="scroll">Pergaminho</option>
              <option value="wondrous">Maravilhoso</option>
              <option value="misc">Diversos</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: "1", minWidth: "80px" }}>
            <label className="form-label">Valor</label>
            <input name="value" className="input" placeholder="100 gp" />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            <input type="checkbox" name="magical" value="true" /> Mágico?
          </label>
          <button type="submit" className="btn btn-primary btn-sm">+ Adicionar</button>
        </form>
      </div>

      {/* Relações */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🔗 Relações</span>
        </div>

        {(npc.relationsFrom.length > 0 || npc.relationsTo.length > 0) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
            {npc.relationsFrom.map((rel) => (
              <div key={rel.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{npc.name}</strong>
                  <span style={{ margin: "0 var(--space-2)", color: "var(--text-gold)" }}>→ {rel.type} →</span>
                  <strong>{rel.target.name}</strong>
                  {rel.description && <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", marginLeft: "var(--space-2)" }}>({rel.description})</span>}
                </div>
                <form action={handleDeleteRelation}>
                  <input type="hidden" name="relationId" value={rel.id} />
                  <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                </form>
              </div>
            ))}
            {npc.relationsTo.map((rel) => (
              <div key={rel.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{rel.origin.name}</strong>
                  <span style={{ margin: "0 var(--space-2)", color: "var(--text-gold)" }}>→ {rel.type} →</span>
                  <strong>{npc.name}</strong>
                  {rel.description && <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", marginLeft: "var(--space-2)" }}>({rel.description})</span>}
                </div>
                <form action={handleDeleteRelation}>
                  <input type="hidden" name="relationId" value={rel.id} />
                  <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                </form>
              </div>
            ))}
          </div>
        )}

        {allNpcs.length > 0 && (
          <form action={handleAddRelation} style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "end" }}>
            <input type="hidden" name="originId" value={id} />
            <div className="form-group" style={{ flex: "2", minWidth: "150px" }}>
              <label className="form-label">NPC Alvo</label>
              <select name="targetId" className="input select" required>
                <option value="">Selecionar NPC...</option>
                {allNpcs.map((n) => (
                  <option key={n.id} value={n.id}>{n.name} ({n.type === "enemy" ? "Inimigo" : n.type === "ally" ? "Aliado" : "Neutro"})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: "1", minWidth: "120px" }}>
              <label className="form-label">Tipo de Relação</label>
              <select name="type" className="input select" required>
                <option value="">—</option>
                <option value="Aliado">Aliado</option>
                <option value="Rival">Rival</option>
                <option value="Mestre">Mestre</option>
                <option value="Aprendiz">Aprendiz</option>
                <option value="Parente">Parente</option>
                <option value="Empregador">Empregador</option>
                <option value="Servo">Servo</option>
                <option value="Amante">Amante</option>
                <option value="Inimigo">Inimigo</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: "1", minWidth: "120px" }}>
              <label className="form-label">Detalhes</label>
              <input name="description" className="input" placeholder="Opcional..." />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">+ Adicionar</button>
          </form>
        )}
      </div>
    </div>
  );
}
