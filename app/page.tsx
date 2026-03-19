import { getDashboardStats } from "@/lib/actions/sessions";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting animate-fade-in">
        <h1>
          Bem-vindo, <span className="text-gold">Mestre</span>
        </h1>
        <p>Seu centro de comando para campanhas de RPG</p>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="card stat-card animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="stat-card-icon stat-card-icon-red">📜</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.campaigns}</span>
            <span className="stat-card-label">Campanhas Ativas</span>
          </div>
        </div>

        <div className="card stat-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="stat-card-icon stat-card-icon-gold">👥</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.npcs}</span>
            <span className="stat-card-label">NPCs Criados</span>
          </div>
        </div>

        <div className="card stat-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <div className="stat-card-icon stat-card-icon-success">📖</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.sessions}</span>
            <span className="stat-card-label">Sessões Registradas</span>
          </div>
        </div>

        <div className="card stat-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="stat-card-icon stat-card-icon-arcane">🤖</div>
          <div className="stat-card-info">
            <span className="stat-card-value">{stats.aiChats}</span>
            <span className="stat-card-label">Consultas IA</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Active Campaign */}
          {stats.recentCampaign ? (
            <Link href={`/campanhas/${stats.recentCampaign.id}`} className="card campaign-active" style={{ textDecoration: "none" }}>
              <div className="card-header">
                <span className="card-title">⚔️ Campanha Ativa</span>
                <span className={`badge ${stats.recentCampaign.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                  D&D {stats.recentCampaign.edition}
                </span>
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
                {stats.recentCampaign.name}
              </h3>
              {stats.recentCampaign.description && (
                <p style={{ marginBottom: "var(--space-2)", fontSize: "var(--text-sm)" }}>
                  {stats.recentCampaign.description}
                </p>
              )}
              <div className="campaign-meta">
                <span className="campaign-meta-item">
                  📖 {stats.recentCampaign._count.sessions} sessões
                </span>
                <span className="campaign-meta-item">
                  👥 {stats.recentCampaign._count.npcs} NPCs
                </span>
                {stats.recentCampaign.sessions[0]?.date && (
                  <span className="campaign-meta-item">
                    📅 {new Date(stats.recentCampaign.sessions[0].date).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "var(--space-10)" }}>
              <p style={{ fontSize: "var(--text-lg)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                Nenhuma campanha ativa
              </p>
              <Link href="/campanhas" className="btn btn-primary">
                Criar Primeira Campanha
              </Link>
            </div>
          )}

          {/* Recent Notes */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📝 Últimas Notas</span>
            </div>
            {stats.recentNotes.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-4) 0" }}>
                Nenhuma nota ainda. Crie notas nas suas campanhas!
              </p>
            ) : (
              <div className="quick-notes-list">
                {stats.recentNotes.map((note) => (
                  <div key={note.id} className="quick-note">
                    <span className="quick-note-icon">📝</span>
                    <div className="quick-note-content">
                      <div className="quick-note-text"><strong>{note.title}</strong></div>
                      <div className="quick-note-time">
                        {note.campaign.name} · {new Date(note.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* AI Quick Panel */}
          <div className="card ia-panel">
            <div className="card-header">
              <span className="card-title">🤖 Assistente IA</span>
              <span className="badge badge-arcane">Gemini 2.5</span>
            </div>
            <div className="ia-input-wrapper">
              <textarea
                className="ia-input"
                placeholder="Pergunte sobre regras, gere um NPC, peça um recap..."
                rows={3}
              />
            </div>
            <div className="ia-edition-tags">
              <span className="badge badge-35">3.5</span>
              <span className="badge badge-5e">5e</span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                Em breve
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">⚡ Acesso Rápido</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <Link href="/campanhas" className="quick-note" style={{ textDecoration: "none" }}>
                <span className="quick-note-icon">📜</span>
                <div className="quick-note-content">
                  <div className="quick-note-text"><strong>Campanhas</strong></div>
                  <div className="quick-note-time">Gerenciar aventuras</div>
                </div>
              </Link>
              <Link href="/npcs" className="quick-note" style={{ textDecoration: "none" }}>
                <span className="quick-note-icon">👥</span>
                <div className="quick-note-content">
                  <div className="quick-note-text"><strong>NPCs</strong></div>
                  <div className="quick-note-time">Criar e editar personagens</div>
                </div>
              </Link>
              <div className="quick-note" style={{ opacity: 0.5 }}>
                <span className="quick-note-icon">📚</span>
                <div className="quick-note-content">
                  <div className="quick-note-text"><strong>Acervo de Regras</strong></div>
                  <div className="quick-note-time">Em breve — Fase 3</div>
                </div>
              </div>
              <div className="quick-note" style={{ opacity: 0.5 }}>
                <span className="quick-note-icon">🤖</span>
                <div className="quick-note-content">
                  <div className="quick-note-text"><strong>Assistente IA</strong></div>
                  <div className="quick-note-time">Em breve — Fase 4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
