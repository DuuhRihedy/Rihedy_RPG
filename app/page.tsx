import { getDashboardStats } from "@/lib/actions/sessions";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import "./entrada.css";

export const dynamic = "force-dynamic";

/** Itens do menu principal */
const MENU_ITEMS = [
  { href: "/campanhas", icon: "⚔️", label: "Campanhas", desc: "Gerenciar campanhas" },
  { href: "/ferramentas/dados", icon: "🎲", label: "Mesa", desc: "Dados, encontros e ferramentas" },
  { href: "/acervo", icon: "📚", label: "Grimório", desc: "Regras e acervo SRD" },
  { href: "/npcs", icon: "👥", label: "Bestiário", desc: "Banco de NPCs" },
  { href: "/ferramentas/mapas", icon: "🗺️", label: "Mapas", desc: "Geradores de mapas" },
  { href: "/assistente", icon: "🤖", label: "Assistente", desc: "IA para mestres" },
];

export default async function EntradaPage() {
  const stats = await getDashboardStats();

  return (
    <div className="entrada">
      {/* Título */}
      <h1 className="entrada-titulo entrada-animate">HUB RPG</h1>
      <p className="entrada-subtitulo entrada-animate">Centro de Comando do Mestre</p>

      {/* Botão "Continuar" — campanha mais recente */}
      {stats.recentCampaign ? (
        <Link
          href={`/campanhas/${stats.recentCampaign.id}`}
          className="entrada-continuar entrada-animate"
        >
          <span className="entrada-continuar-icon">▶</span>
          <span className="entrada-continuar-info">
            <span className="entrada-continuar-label">Continuar</span>
            <span className="entrada-continuar-nome">{stats.recentCampaign.name}</span>
          </span>
        </Link>
      ) : (
        <Link href="/campanhas" className="entrada-sem-campanha entrada-animate">
          + Criar primeira campanha
        </Link>
      )}

      {/* Grid 3x2 de menu */}
      <div className="entrada-grid entrada-animate">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="entrada-btn">
            <span className="entrada-btn-icon">{item.icon}</span>
            <span className="entrada-btn-label">{item.label}</span>
            <span className="entrada-btn-desc">{item.desc}</span>
          </Link>
        ))}
      </div>

      {/* Rodapé: stats + toggle de tema */}
      <div className="entrada-footer entrada-animate">
        <div className="entrada-stats">
          <span>
            <span className="entrada-stat-value">{stats.campaigns}</span>campanhas
          </span>
          <span>
            <span className="entrada-stat-value">{stats.npcs}</span>NPCs
          </span>
          <span>
            <span className="entrada-stat-value">{stats.sessions}</span>sessões
          </span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
