import { getNpcs, createNpc } from "@/lib/actions/npcs";
import NpcListFilter from "@/components/NpcListFilter";
import "../campanhas/campanhas.css";

export const dynamic = 'force-dynamic';

const ALIGNMENTS = [
  "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
  "Leal e Neutro", "Neutro", "Caótico e Neutro",
  "Leal e Mau", "Neutro e Mau", "Caótico e Mau",
];

export default async function NpcsPage() {
  const npcs = await getNpcs();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Banco de NPCs</h1>
          <p>Personagens do seu mundo — importáveis para qualquer campanha</p>
        </div>
      </div>

      {/* Create NPC Form */}
      <form action={createNpc} className="card create-form">
        <h4 className="create-form-title">✨ Novo NPC</h4>
        <div className="form-row">
          <input name="name" className="input" placeholder="Nome do NPC..." required />
          <input name="race" className="input" placeholder="Raça" style={{ maxWidth: "140px" }} />
          <input name="class" className="input" placeholder="Classe" style={{ maxWidth: "140px" }} />
          <input name="level" type="number" className="input" placeholder="Nv" style={{ maxWidth: "70px" }} min="1" max="40" />
        </div>
        <div className="form-row">
          <select name="alignment" className="input select" defaultValue="">
            <option value="">Alinhamento...</option>
            {ALIGNMENTS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select name="type" className="input select" defaultValue="neutral">
            <option value="ally">🛡️ Aliado</option>
            <option value="neutral">👤 Neutro</option>
            <option value="enemy">💀 Inimigo</option>
          </select>
          <select name="edition" className="input select" defaultValue="3.5">
            <option value="3.5">D&D 3.5</option>
            <option value="5e">D&D 5e</option>
          </select>
          <button type="submit" className="btn btn-primary">Criar NPC</button>
        </div>
        <textarea
          name="description"
          className="input textarea"
          placeholder="Descrição física e de personalidade..."
          rows={2}
        />

        {/* Atributos */}
        <div style={{ marginTop: "var(--space-3)" }}>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-2)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            Atributos
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
            {["str", "dex", "con", "int", "wis", "cha", "hp", "ac"].map((attr) => (
              <div key={attr} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                <input
                  name={attr}
                  type="number"
                  className="input"
                  defaultValue={10}
                  min="1"
                  style={{ textAlign: "center", maxWidth: "70px" }}
                />
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                  {attr.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* NPCs List with Filters */}
      {npcs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👥</span>
          <h3>Nenhum NPC criado</h3>
          <p>Crie seu primeiro personagem usando o formulário acima</p>
        </div>
      ) : (
        <NpcListFilter npcs={npcs} />
      )}
    </div>
  );
}
