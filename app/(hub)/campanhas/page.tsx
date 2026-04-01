import { getCampaigns, createCampaign } from "@/lib/actions/campaigns";
import Link from "next/link";
import "./campanhas.css";

export const dynamic = 'force-dynamic';

export default async function CampanhasPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Campanhas</h1>
          <p>Gerencie suas aventuras e mundos</p>
        </div>
      </div>

      {/* Form criar campanha */}
      <form action={createCampaign} className="card create-form">
        <h4 className="create-form-title">✨ Nova Campanha</h4>
        <div className="form-row">
          <input
            name="name"
            className="input"
            placeholder="Nome da campanha..."
            required
          />
          <select name="edition" className="input select" defaultValue="3.5">
            <option value="3.5">D&D 3.5</option>
            <option value="5e">D&D 5e</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Criar
          </button>
        </div>
        <textarea
          name="description"
          className="input textarea"
          placeholder="Descrição da campanha (opcional)..."
          rows={2}
        />
      </form>

      {/* Lista de campanhas */}
      {campaigns.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📜</span>
          <h3>Nenhuma campanha criada</h3>
          <p>Crie sua primeira campanha usando o formulário acima</p>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campanhas/${campaign.id}`}
              className="card card-interactive campaign-card"
            >
              {campaign.imageUrl && (
                <div className="campaign-card-cover-wrap">
                  <img src={campaign.imageUrl} alt="" className="campaign-card-cover" />
                </div>
              )}
              <div className="campaign-card-top">
                <span className={`badge ${campaign.edition === "3.5" ? "badge-35" : "badge-5e"}`}>
                  D&D {campaign.edition}
                </span>
                <span className={`campaign-status campaign-status-${campaign.status}`}>
                  {campaign.status === "active" ? "Ativa" : campaign.status === "paused" ? "Pausada" : "Encerrada"}
                </span>
              </div>
              <h3 className="campaign-card-name">{campaign.name}</h3>
              {campaign.description && (
                <div 
                  className="campaign-card-desc" 
                  dangerouslySetInnerHTML={{ __html: campaign.description }} 
                />
              )}
              <div className="campaign-card-stats">
                <span>📖 {campaign._count.sessions} sessões</span>
                <span>👥 {campaign._count.npcs} NPCs</span>
                <span>📝 {campaign._count.notes} notas</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
