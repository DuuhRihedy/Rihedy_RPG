import { getNpc, deleteNpc } from "@/lib/actions/npcs";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../../campanhas/campanhas.css";

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

type Params = Promise<{ id: string }>;

export default async function NpcDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const npc = await getNpc(id);

  if (!npc) notFound();

  const deleteAction = deleteNpc.bind(null, id);
  const attrs = npc.attributes;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="campaign-detail-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <Link href="/npcs" className="btn btn-ghost btn-sm">← Voltar</Link>
            <span className={`badge ${npc.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
              D&D {npc.edition}
            </span>
            <span style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: npc.type === "enemy" ? "var(--danger)" : npc.type === "ally" ? "var(--success)" : "var(--text-muted)",
            }}>
              {npc.type === "enemy" ? "💀 Inimigo" : npc.type === "ally" ? "🛡️ Aliado" : "👤 Neutro"}
            </span>
            {npc.status === "dead" && (
              <span className="badge" style={{ background: "var(--danger-subtle)", color: "var(--danger)" }}>MORTO</span>
            )}
          </div>
          <h1 className="campaign-detail-title">{npc.name}</h1>
          <p className="campaign-detail-desc" style={{ marginTop: "var(--space-1)" }}>
            {[npc.race, npc.class, npc.level ? `Nível ${npc.level}` : null, npc.alignment].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="campaign-detail-actions">
          <form action={deleteAction}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}>
              🗑️ Excluir
            </button>
          </form>
        </div>
      </div>

      <div className="npc-detail-grid">
        {/* Left — Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Description */}
          {npc.description && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">📝 Descrição</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7, margin: 0 }}>
                {npc.description}
              </p>
            </div>
          )}

          {/* Backstory */}
          {npc.backstory && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">📜 História</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7, margin: 0 }}>
                {npc.backstory}
              </p>
            </div>
          )}

          {/* Items */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🎒 Itens ({npc.items.length})</span>
            </div>
            {npc.items.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhum item
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {npc.items.map((item) => (
                  <div key={item.id} className="quick-note">
                    <span className="quick-note-icon">
                      {item.magical ? "✨" : "🔧"}
                    </span>
                    <div className="quick-note-content">
                      <div className="quick-note-text">
                        <strong>{item.name}</strong>
                        {item.magical && <span className="badge badge-gold" style={{ marginLeft: "var(--space-2)" }}>Mágico</span>}
                      </div>
                      <div className="quick-note-time">
                        {[item.type, item.value].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Relations */}
          {(npc.relationsFrom.length > 0 || npc.relationsTo.length > 0) && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">🔗 Relações</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {npc.relationsFrom.map((rel) => (
                  <Link key={rel.id} href={`/npcs/${rel.target.id}`} className="quick-note" style={{ textDecoration: "none" }}>
                    <span className="quick-note-icon">→</span>
                    <div className="quick-note-content">
                      <div className="quick-note-text">
                        <strong>{rel.target.name}</strong>
                      </div>
                      <div className="quick-note-time">{rel.type}{rel.description ? ` — ${rel.description}` : ""}</div>
                    </div>
                  </Link>
                ))}
                {npc.relationsTo.map((rel) => (
                  <Link key={rel.id} href={`/npcs/${rel.origin.id}`} className="quick-note" style={{ textDecoration: "none" }}>
                    <span className="quick-note-icon">←</span>
                    <div className="quick-note-content">
                      <div className="quick-note-text">
                        <strong>{rel.origin.name}</strong>
                      </div>
                      <div className="quick-note-time">{rel.type}{rel.description ? ` — ${rel.description}` : ""}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Stats & Campaigns */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Attributes */}
          {attrs && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚔️ Atributos</span>
              </div>

              {/* HP & AC */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                <div className="attr-box" style={{ borderColor: "var(--danger)", background: "var(--danger-subtle)" }}>
                  <span className="attr-value" style={{ color: "var(--danger)", fontSize: "var(--text-2xl)" }}>{attrs.hp}</span>
                  <span className="attr-label">HP</span>
                </div>
                <div className="attr-box" style={{ borderColor: "var(--info)", background: "var(--info-subtle)" }}>
                  <span className="attr-value" style={{ color: "var(--info)", fontSize: "var(--text-2xl)" }}>{attrs.ac}</span>
                  <span className="attr-label">AC</span>
                </div>
              </div>

              <hr className="divider" />

              {/* 6 Attributes */}
              <div className="attributes-grid">
                {([
                  { key: "str", label: "STR" },
                  { key: "dex", label: "DEX" },
                  { key: "con", label: "CON" },
                  { key: "intl", label: "INT" },
                  { key: "wis", label: "WIS" },
                  { key: "cha", label: "CHA" },
                ] as const).map(({ key, label }) => (
                  <div key={key} className="attr-box">
                    <span className="attr-value">{attrs[key]}</span>
                    <span className="attr-mod">{getModifier(attrs[key])}</span>
                    <span className="attr-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📜 Campanhas</span>
            </div>
            {npc.campaigns.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Não vinculado a nenhuma campanha
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {npc.campaigns.map(({ campaign }) => (
                  <Link key={campaign.id} href={`/campanhas/${campaign.id}`} className="quick-note" style={{ textDecoration: "none" }}>
                    <span className="quick-note-icon">⚔️</span>
                    <div className="quick-note-content">
                      <div className="quick-note-text"><strong>{campaign.name}</strong></div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* GM Notes */}
          {npc.gmNotes && (
            <div className="card" style={{ borderColor: "var(--warning)", borderWidth: "1px" }}>
              <div className="card-header">
                <span className="card-title">🔒 Notas do Mestre</span>
                <span className="badge badge-gold">GM Only</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7, margin: 0 }}>
                {npc.gmNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
