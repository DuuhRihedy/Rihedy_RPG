import { getCampaign, deleteCampaign, getAvailableNpcsForCampaign } from "@/lib/actions/campaigns";
import { deleteSession } from "@/lib/actions/sessions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "@/components/ui/DeleteButton";
import ImportNpcPanel from "@/components/ImportNpcPanel";
import CampaignTabs from "@/components/CampaignTabs";
import CampaignMaps from "@/components/CampaignMaps";
import CampaignMesa from "@/components/CampaignMesa";
import CampaignRegras from "@/components/CampaignRegras";
import CampaignDocuments from "@/components/CampaignDocuments";
import CampaignSessions from "@/components/CampaignSessions";
import CampaignStory from "@/components/CampaignStory";
import "../campanhas.css";

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function CampaignDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const [campaign, availableNpcs] = await Promise.all([
    getCampaign(id),
    getAvailableNpcsForCampaign(id),
  ]);

  if (!campaign) notFound();

  const deleteAction = async () => {
    "use server";
    await deleteCampaign(id);
  };

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div className="hub-hero">
        {campaign.imageUrl && (
          <div className="hub-hero-bg">
            <img src={campaign.imageUrl} alt="" />
          </div>
        )}
        <div className="hub-hero-content">
          <div className="hub-hero-info">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
              <Link href="/campanhas" className="btn btn-ghost btn-sm" style={{ backdropFilter: "blur(4px)" }}>← Campanhas</Link>
              <span className={`badge ${campaign.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                D&D {campaign.edition}
              </span>
              <span className={`campaign-status campaign-status-${campaign.status}`}>
                {campaign.status === "active" ? "● Ativa" : campaign.status === "paused" ? "● Pausada" : "● Encerrada"}
              </span>
            </div>
            <h1 className="hub-hero-title">{campaign.name}</h1>
            {campaign.description && (
              <p className="hub-hero-desc">{campaign.description}</p>
            )}
          </div>
          <div className="campaign-detail-actions">
            <a href={`/api/export/campaign/${id}`} className="btn btn-ghost" download>📦 JSON</a>
            <a href={`/api/export/campaign/${id}/markdown`} className="btn btn-ghost" download>📄 Markdown</a>
            <Link href={`/campanhas/${id}/editar`} className="btn btn-primary">✏️ Editar</Link>
            <DeleteButton action={deleteAction} entityName={campaign.name} />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="hub-stats-bar">
          <div className="hub-stat">
            <span className="hub-stat-value">{campaign._count.sessions}</span>
            <span className="hub-stat-label">Sessões</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-value">{campaign._count.npcs}</span>
            <span className="hub-stat-label">NPCs</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-value">{campaign._count.notes}</span>
            <span className="hub-stat-label">Notas</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-value">{campaign.arcs.length}</span>
            <span className="hub-stat-label">Arcos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CampaignTabs>
        {/* TAB 0: Visão Geral */}
        <div className="hub-overview">
          <div className="campaign-detail-grid">
            <div>
              {/* Descrição */}
              <div className="card" style={{ marginBottom: "var(--space-4)" }}>
                <div className="card-header">
                  <span className="card-title">📋 Sobre a Campanha</span>
                </div>
                {campaign.description ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7, margin: 0 }}>
                    {campaign.description}
                  </p>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                    Nenhuma descrição — <Link href={`/campanhas/${id}/editar`} style={{ color: "var(--dnd-gold)" }}>adicionar</Link>
                  </p>
                )}
              </div>

              {/* Última sessão */}
              {campaign.sessions.length > 0 && (
                <div className="card" style={{ marginBottom: "var(--space-4)" }}>
                  <div className="card-header">
                    <span className="card-title">📖 Última Sessão</span>
                  </div>
                  <div className="session-item">
                    <div className="session-number">#{campaign.sessions[0].number}</div>
                    <div className="session-info">
                      <div className="session-title">
                        {campaign.sessions[0].title || `Sessão ${campaign.sessions[0].number}`}
                      </div>
                      <div className="session-meta">
                        {campaign.sessions[0].date && new Date(campaign.sessions[0].date).toLocaleDateString("pt-BR")}
                        {campaign.sessions[0].durationMin && ` · ${campaign.sessions[0].durationMin}min`}
                      </div>
                      {campaign.sessions[0].notes && (
                        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)", marginTop: "var(--space-2)", lineHeight: 1.5 }}>
                          {campaign.sessions[0].notes.substring(0, 200)}
                          {campaign.sessions[0].notes.length > 200 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna direita do overview */}
            <div>
              {/* NPCs recentes */}
              <div className="card" style={{ marginBottom: "var(--space-4)" }}>
                <div className="card-header">
                  <span className="card-title">👥 NPCs ({campaign.npcs.length})</span>
                </div>
                {campaign.npcs.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                    Nenhum NPC vinculado
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {campaign.npcs.slice(0, 5).map(({ npc }) => (
                      <Link key={npc.id} href={`/npcs/${npc.id}`} className="quick-note" style={{ textDecoration: "none" }}>
                        <span className="quick-note-icon">
                          {npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}
                        </span>
                        <div className="quick-note-content">
                          <div className="quick-note-text"><strong>{npc.name}</strong></div>
                          <div className="quick-note-time">
                            {[npc.race, npc.class].filter(Boolean).join(" · ") || "Sem detalhes"}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {campaign.npcs.length > 5 && (
                      <p style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textAlign: "center" }}>
                        +{campaign.npcs.length - 5} mais...
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Arcos ativos */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">🧵 Arcos Ativos</span>
                </div>
                {campaign.arcs.filter(a => a.status === "active").length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                    Nenhum arco ativo
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {campaign.arcs.filter(a => a.status === "active").map((arc) => (
                      <div key={arc.id} className="quick-note">
                        <span className="quick-note-icon">🟢</span>
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

        {/* TAB 1: História */}
        <div>
          <CampaignStory campaignId={campaign.id} />
        </div>

        {/* TAB 2: Sessões */}
        <div>
          <CampaignSessions campaignId={campaign.id} />
        </div>

        {/* TAB 2: NPCs */}
        <div>
          <ImportNpcPanel
            campaignId={campaign.id}
            availableNpcs={availableNpcs}
            linkedNpcs={campaign.npcs}
          />
        </div>

        {/* TAB 3: Notas */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">📝 Notas ({campaign.notes.length})</span>
            </div>

            {campaign.notes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                {campaign.notes.map((note) => {
                  const deleteNoteAction = async () => {
                    "use server";
                    const { deleteNote } = await import("@/lib/actions/campaigns");
                    await deleteNote(note.id, campaign.id);
                  };
                  return (
                    <div key={note.id} className="hub-note-card">
                      <div className="hub-note-header">
                        <strong>{note.title}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                            {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <form action={deleteNoteAction}>
                            <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                          </form>
                        </div>
                      </div>
                      <p className="hub-note-content">{note.content}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <form action={async (formData: FormData) => {
              "use server";
              const { createNote } = await import("@/lib/actions/campaigns");
              formData.set("campaignId", id);
              await createNote(formData);
            }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="form-group">
                <label className="form-label">Título da Nota</label>
                <input name="title" className="input" placeholder="Ex: Local importante, Info secreta..." required />
              </div>
              <div className="form-group">
                <label className="form-label">Conteúdo</label>
                <textarea name="content" className="input textarea" rows={4} placeholder="Escreva a nota..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
                + Adicionar Nota
              </button>
            </form>
          </div>
        </div>

        {/* TAB 4: Arcos Narrativos */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">🧵 Arcos Narrativos ({campaign.arcs.length})</span>
            </div>

            {campaign.arcs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                {campaign.arcs.map((arc) => {
                  const updateArcStatusAction = async () => {
                    "use server";
                    const { updateArcStatus } = await import("@/lib/actions/campaigns");
                    const newStatus = arc.status === "active" ? "completed" : "active";
                    await updateArcStatus(arc.id, newStatus, campaign.id);
                  };
                  const deleteArcAction = async () => {
                    "use server";
                    const { deleteArc } = await import("@/lib/actions/campaigns");
                    await deleteArc(arc.id, campaign.id);
                  };
                  return (
                    <div key={arc.id} className="hub-arc-card">
                      <div className="hub-arc-header">
                        <div className="hub-arc-info">
                          <span className={`hub-arc-status hub-arc-status-${arc.status}`}>
                            {arc.status === "active" ? "🟢" : arc.status === "completed" ? "✅" : "⚪"}
                          </span>
                          <div>
                            <strong>{arc.title}</strong>
                            <span className={`campaign-status campaign-status-${arc.status}`} style={{ marginLeft: "var(--space-2)" }}>
                              {arc.status === "active" ? "Ativo" : arc.status === "completed" ? "Completo" : "Abandonado"}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                          <form action={updateArcStatusAction}>
                            <button type="submit" className="btn btn-ghost btn-sm" title={arc.status === "active" ? "Completar" : "Reativar"}>
                              {arc.status === "active" ? "✓" : "↺"}
                            </button>
                          </form>
                          <form action={deleteArcAction}>
                            <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                          </form>
                        </div>
                      </div>
                      {arc.description && (
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", margin: "var(--space-2) 0 0", lineHeight: 1.5 }}>
                          {arc.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <form action={async (formData: FormData) => {
              "use server";
              const { createArc } = await import("@/lib/actions/campaigns");
              formData.set("campaignId", id);
              await createArc(formData);
            }} style={{ display: "flex", gap: "var(--space-3)", alignItems: "end" }}>
              <div className="form-group" style={{ flex: "2" }}>
                <label className="form-label">Título do Arco</label>
                <input name="title" className="input" placeholder="Ex: A Maldição do Rei Lich" required />
              </div>
              <div className="form-group" style={{ flex: "3" }}>
                <label className="form-label">Descrição</label>
                <input name="description" className="input" placeholder="Descrição curta (opcional)" />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">+ Adicionar</button>
            </form>
          </div>
        </div>
        {/* TAB 5: Mapas */}
        <div>
          <CampaignMaps campaignId={campaign.id} />
        </div>

        {/* TAB 6: Mesa */}
        <div>
          <CampaignMesa />
        </div>

        {/* TAB 7: Regras */}
        <div>
          <CampaignRegras />
        </div>

        {/* TAB 8: Documentos */}
        <div>
          <CampaignDocuments campaignId={campaign.id} />
        </div>
      </CampaignTabs>
    </div>
  );
}
