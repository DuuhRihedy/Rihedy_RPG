import { getCampaign, updateCampaign, deleteCampaign } from "@/lib/actions/campaigns";
import { createSession } from "@/lib/actions/sessions";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../campanhas.css";

type Params = Promise<{ id: string }>;

export default async function CampaignDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) notFound();

  const updateAction = updateCampaign.bind(null, id);
  const deleteAction = deleteCampaign.bind(null, id);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="campaign-detail-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <Link href="/campanhas" className="btn btn-ghost btn-sm">← Voltar</Link>
            <span className={`badge ${campaign.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
              D&D {campaign.edition}
            </span>
            <span className={`campaign-status campaign-status-${campaign.status}`}>
              {campaign.status === "active" ? "● Ativa" : campaign.status === "paused" ? "● Pausada" : "● Encerrada"}
            </span>
          </div>
          <h1 className="campaign-detail-title">{campaign.name}</h1>
          {campaign.description && (
            <p className="campaign-detail-desc">{campaign.description}</p>
          )}
        </div>
        <div className="campaign-detail-actions">
          <form action={deleteAction}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}>
              🗑️ Excluir
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card stat-card">
          <div className="stat-card-icon stat-card-icon-red">📖</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{campaign._count.sessions}</span>
            <span className="stat-card-label">Sessões</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon stat-card-icon-gold">👥</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{campaign._count.npcs}</span>
            <span className="stat-card-label">NPCs</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card-icon stat-card-icon-arcane">📝</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{campaign._count.notes}</span>
            <span className="stat-card-label">Notas</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="campaign-detail-grid">
        {/* Left — Sessions */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">📖 Sessões</span>
            </div>

            {/* New Session Form */}
            <form action={createSession} style={{ marginBottom: "var(--space-4)" }}>
              <input type="hidden" name="campaignId" value={campaign.id} />
              <div className="form-row">
                <input name="title" className="input" placeholder="Título da sessão..." />
                <input name="date" type="date" className="input" style={{ maxWidth: "160px" }} />
                <button type="submit" className="btn btn-primary btn-sm">+ Sessão</button>
              </div>
            </form>

            {/* Sessions List */}
            {campaign.sessions.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8) 0" }}>
                Nenhuma sessão registrada. Crie a primeira acima!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {campaign.sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-number">#{session.number}</div>
                    <div className="session-info">
                      <div className="session-title">
                        {session.title || `Sessão ${session.number}`}
                      </div>
                      <div className="session-meta">
                        {session.date && new Date(session.date).toLocaleDateString("pt-BR")}
                        {session.durationMin && ` · ${session.durationMin}min`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — NPCs & Arcs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* NPCs */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">👥 NPCs</span>
              <Link href="/npcs" className="btn btn-ghost btn-sm">Ver todos →</Link>
            </div>
            {campaign.npcs.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhum NPC vinculado
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {campaign.npcs.map(({ npc }) => (
                  <Link key={npc.id} href={`/npcs/${npc.id}`} className="quick-note" style={{ textDecoration: "none" }}>
                    <span className="quick-note-icon">
                      {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                    </span>
                    <div className="quick-note-content">
                      <div className="quick-note-text"><strong>{npc.name}</strong></div>
                      <div className="quick-note-time">
                        {[npc.race, npc.class, npc.level ? `Nv ${npc.level}` : null].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Story Arcs */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🧵 Arcos Narrativos</span>
            </div>
            {campaign.arcs.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhum arco narrativo
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {campaign.arcs.map((arc) => (
                  <div key={arc.id} className="quick-note">
                    <span className="quick-note-icon">
                      {arc.status === "active" ? "🟢" : arc.status === "resolved" ? "✅" : "⚪"}
                    </span>
                    <div className="quick-note-content">
                      <div className="quick-note-text"><strong>{arc.title}</strong></div>
                      {arc.description && <div className="quick-note-time">{arc.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
