import { getCampaign, updateCampaign, linkNpcToCampaign, unlinkNpcFromCampaign, getAvailableNpcsForCampaign, createNote, deleteNote, createArc, updateArcStatus, deleteArc } from "@/lib/actions/campaigns";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import "../../campanhas.css";

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

export default async function EditCampaignPage({ params }: { params: Params }) {
  const { id } = await params;
  const [campaign, availableNpcs] = await Promise.all([
    getCampaign(id),
    getAvailableNpcsForCampaign(id),
  ]);

  if (!campaign) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateCampaign(id, formData);
    redirect(`/campanhas/${id}`);
  }

  async function handleLinkNpc(formData: FormData) {
    "use server";
    const npcId = formData.get("npcId") as string;
    if (npcId) await linkNpcToCampaign(id, npcId);
  }

  async function handleUnlinkNpc(formData: FormData) {
    "use server";
    const npcId = formData.get("npcId") as string;
    await unlinkNpcFromCampaign(id, npcId);
  }

  async function handleCreateNote(formData: FormData) {
    "use server";
    formData.set("campaignId", id);
    await createNote(formData);
  }

  async function handleDeleteNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    await deleteNote(noteId, id);
  }

  async function handleCreateArc(formData: FormData) {
    "use server";
    formData.set("campaignId", id);
    await createArc(formData);
  }

  async function handleUpdateArcStatus(formData: FormData) {
    "use server";
    const arcId = formData.get("arcId") as string;
    const status = formData.get("status") as string;
    await updateArcStatus(arcId, status, id);
  }

  async function handleDeleteArc(formData: FormData) {
    "use server";
    const arcId = formData.get("arcId") as string;
    await deleteArc(arcId, id);
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="campaign-detail-header">
        <div>
          <Link href={`/campanhas/${id}`} className="btn btn-ghost btn-sm">← Voltar à Campanha</Link>
          <h1 className="campaign-detail-title" style={{ marginTop: "var(--space-2)" }}>
            ✏️ Editar — {campaign.name}
          </h1>
        </div>
      </div>

      {/* Edit Form */}
      <form action={handleUpdate}>
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="card-header">
            <span className="card-title">📋 Informações da Campanha</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label className="form-label">Nome da Campanha *</label>
              <input name="name" className="input" defaultValue={campaign.name} required />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea name="description" className="input textarea" rows={4} defaultValue={campaign.description || ""} placeholder="Descreva sua campanha..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              <div className="form-group">
                <label className="form-label">Edição</label>
                <select name="edition" className="input select" defaultValue={campaign.edition}>
                  <option value="3.5">D&D 3.5</option>
                  <option value="5e">D&D 5e</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="input select" defaultValue={campaign.status}>
                  <option value="active">Ativa</option>
                  <option value="paused">Pausada</option>
                  <option value="finished">Encerrada</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              💾 Salvar Alterações
            </button>
          </div>
        </div>
      </form>

      <div className="npc-detail-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

          {/* NPCs da Campanha */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">👥 NPCs ({campaign.npcs.length})</span>
            </div>

            {campaign.npcs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                {campaign.npcs.map(({ npc }) => (
                  <div key={npc.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                    <Link href={`/npcs/${npc.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span>{npc.type === "enemy" ? "💀" : npc.type === "ally" ? "🛡️" : "👤"}</span>
                      <strong>{npc.name}</strong>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                        {[npc.race, npc.class].filter(Boolean).join(" ")}
                      </span>
                    </Link>
                    <form action={handleUnlinkNpc}>
                      <input type="hidden" name="npcId" value={npc.id} />
                      <button type="submit" className="btn btn-danger-text btn-sm" title="Remover da campanha">✕</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            {availableNpcs.length > 0 && (
              <form action={handleLinkNpc} style={{ display: "flex", gap: "var(--space-3)", alignItems: "end" }}>
                <div className="form-group" style={{ flex: "1" }}>
                  <label className="form-label">Vincular NPC</label>
                  <select name="npcId" className="input select" required>
                    <option value="">Selecionar NPC...</option>
                    {availableNpcs.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.type === "enemy" ? "Inimigo" : n.type === "ally" ? "Aliado" : "Neutro"})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">+ Vincular</button>
              </form>
            )}
          </div>

          {/* Arcos Narrativos */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📚 Arcos Narrativos ({campaign.arcs.length})</span>
            </div>

            {campaign.arcs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                {campaign.arcs.map((arc) => (
                  <div key={arc.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{arc.title}</strong>
                      <span className={`campaign-status campaign-status-${arc.status}`} style={{ marginLeft: "var(--space-2)" }}>
                        {arc.status === "active" ? "● Ativo" : arc.status === "completed" ? "✓ Completo" : "○ Abandonado"}
                      </span>
                      {arc.description && (
                        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>
                          {arc.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <form action={handleUpdateArcStatus}>
                        <input type="hidden" name="arcId" value={arc.id} />
                        {arc.status === "active" ? (
                          <>
                            <input type="hidden" name="status" value="completed" />
                            <button type="submit" className="btn btn-ghost btn-sm" title="Marcar como completo">✓</button>
                          </>
                        ) : (
                          <>
                            <input type="hidden" name="status" value="active" />
                            <button type="submit" className="btn btn-ghost btn-sm" title="Reativar">↺</button>
                          </>
                        )}
                      </form>
                      <form action={handleDeleteArc}>
                        <input type="hidden" name="arcId" value={arc.id} />
                        <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form action={handleCreateArc} style={{ display: "flex", gap: "var(--space-3)", alignItems: "end" }}>
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

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

          {/* Notas */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📝 Notas ({campaign.notes.length})</span>
            </div>

            {campaign.notes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                {campaign.notes.map((note) => (
                  <div key={note.id} className="quick-note" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{note.title}</strong>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", margin: "var(--space-1) 0 0", whiteSpace: "pre-line" }}>
                        {note.content.substring(0, 200)}{note.content.length > 200 ? "..." : ""}
                      </p>
                    </div>
                    <form action={handleDeleteNote}>
                      <input type="hidden" name="noteId" value={note.id} />
                      <button type="submit" className="btn btn-danger-text btn-sm">✕</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={handleCreateNote} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="form-group">
                <label className="form-label">Título da Nota</label>
                <input name="title" className="input" placeholder="Ex: Local importante, Info secreta..." required />
              </div>
              <div className="form-group">
                <label className="form-label">Conteúdo</label>
                <textarea name="content" className="input textarea" rows={3} placeholder="Escreva a nota..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
                + Adicionar Nota
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
