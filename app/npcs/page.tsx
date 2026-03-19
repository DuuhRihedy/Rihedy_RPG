import { getNpcs, createNpc } from "@/lib/actions/npcs";
import Link from "next/link";
import "../campanhas/campanhas.css";

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

export default async function NpcsPage() {
  const npcs = await getNpcs();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>NPCs</h1>
          <p>Personagens do seu mundo</p>
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
                  defaultValue={attr === "hp" ? 10 : attr === "ac" ? 10 : 10}
                  min="1"
                  style={{ textAlign: "center", maxWidth: "70px" }}
                />
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                  {attr === "intl" ? "INT" : attr.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* NPCs List */}
      {npcs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👥</span>
          <h3>Nenhum NPC criado</h3>
          <p>Crie seu primeiro personagem usando o formulário acima</p>
        </div>
      ) : (
        <div className="npc-grid">
          {npcs.map((npc, i) => (
            <Link
              key={npc.id}
              href={`/npcs/${npc.id}`}
              className="card card-interactive npc-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`npc-card-avatar npc-card-avatar-${npc.type === "enemy" ? "enemy" : npc.type === "ally" ? "ally" : "neutral"}`}>
                {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
              </div>
              <div className="npc-card-info">
                <div className="npc-card-name">{npc.name}</div>
                <div className="npc-card-meta">
                  {[npc.race, npc.class, npc.level ? `Nv ${npc.level}` : null].filter(Boolean).join(" · ") || "Sem detalhes"}
                </div>
                <div className="npc-card-tags">
                  <span className={`badge ${npc.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                    {npc.edition}
                  </span>
                  {npc.status === "dead" && <span className="badge" style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}>Morto</span>}
                  {npc.alignment && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{npc.alignment}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
