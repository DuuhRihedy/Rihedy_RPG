import { getDashboardStats } from "@/lib/actions/sessions";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import "./entrada.css";

export const dynamic = "force-dynamic";

const MENU_ITEMS = [
  { href: "/campanhas", icon: "⚔️", label: "Campanhas", desc: "Suas aventuras" },
  { href: "/ferramentas/dados", icon: "🎲", label: "Mesa", desc: "Dados e encontros" },
  { href: "/acervo", icon: "📜", label: "Grimório", desc: "Acervo D&D" },
  { href: "/npcs", icon: "💀", label: "Bestiário", desc: "NPCs e criaturas" },
  { href: "/ferramentas/mapas", icon: "🗺️", label: "Mapas", desc: "Gerar mapas" },
  { href: "/assistente", icon: "🔮", label: "Oráculo", desc: "Assistente IA" },
];

export default async function EntradaPage() {
  const stats = await getDashboardStats();

  return (
    <div className="game-screen">
      {/* Camadas de fundo atmosférico */}
      <div className="game-bg" />
      <div className="game-fog" />
      <div className="game-vignette" />

      {/* Conteúdo centralizado */}
      <div className="game-content">

        {/* Logo com ornamentos */}
        <div className="game-header anim-1">
          <div className="game-ornament">⸻ ✦ ⸻</div>
          <h1 className="game-title">HUB RPG</h1>
          <div className="game-divider" />
          <p className="game-subtitle">Centro de Comando do Mestre</p>
        </div>

        {/* Botão Continuar — destaque principal */}
        {stats.recentCampaign ? (
          <Link
            href={`/campanhas/${stats.recentCampaign.id}`}
            className="game-continue anim-2"
          >
            <span className="game-continue-glow" />
            <span className="game-continue-inner">
              <span className="game-continue-play">▶</span>
              <span className="game-continue-text">
                <span className="game-continue-label">Continuar Aventura</span>
                <span className="game-continue-name">{stats.recentCampaign.name}</span>
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/campanhas" className="game-continue anim-2">
            <span className="game-continue-glow" />
            <span className="game-continue-inner">
              <span className="game-continue-play">✦</span>
              <span className="game-continue-text">
                <span className="game-continue-label">Nova Aventura</span>
                <span className="game-continue-name">Criar primeira campanha</span>
              </span>
            </span>
          </Link>
        )}

        {/* Grid de menu */}
        <nav className="game-menu anim-3">
          {MENU_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="game-btn">
              <span className="game-btn-border" />
              <span className="game-btn-icon">{item.icon}</span>
              <span className="game-btn-label">{item.label}</span>
              <span className="game-btn-desc">{item.desc}</span>
            </Link>
          ))}
        </nav>

        {/* Rodapé */}
        <footer className="game-footer anim-4">
          <div className="game-stats">
            <span>{stats.campaigns} campanhas</span>
            <span className="game-dot">·</span>
            <span>{stats.npcs} NPCs</span>
            <span className="game-dot">·</span>
            <span>{stats.sessions} sessões</span>
          </div>
          <ThemeToggle />
        </footer>
      </div>
    </div>
  );
}
