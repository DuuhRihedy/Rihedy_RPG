import { getSrdStats } from "@/lib/actions/srd";
import Link from "next/link";
import "./acervo.css";

export const dynamic = 'force-dynamic';

export default async function AcervoPage() {
  const stats = await getSrdStats();

  const categories = [
    { icon: "📖", name: "Magias", count: stats.spells, href: "/acervo/spells", desc: "Spells" },
    { icon: "🐉", name: "Monstros", count: stats.monsters, href: "/acervo/monsters", desc: "Monsters" },
    { icon: "⚔️", name: "Classes", count: stats.classes, href: "/acervo/classes", desc: "Classes" },
    { icon: "🎯", name: "Talentos", count: stats.feats, href: "/acervo/feats", desc: "Feats" },
    { icon: "🛡️", name: "Equipamentos", count: stats.equipment, href: "/acervo/equipment", desc: "Equipment" },
    { icon: "✨", name: "Itens Mágicos", count: stats.magicItems, href: "/acervo/magic-items", desc: "Magic Items" },
  ];

  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="page-container">
      <div className="acervo-hero animate-fade-in">
        <h1>
          📚 <span className="text-gold">Acervo de Regras</span>
        </h1>
        <p>
          {totalItems.toLocaleString()} registros · Acervo D&D
        </p>
      </div>

      <div className="acervo-categories">
        {categories.map((cat, i) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="card card-interactive acervo-cat-card animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="acervo-cat-icon">{cat.icon}</span>
            <span className="acervo-cat-name">{cat.name}</span>
            <span className="acervo-cat-count">
              {cat.count} {cat.desc}
            </span>
          </Link>
        ))}
      </div>

      {totalItems === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "var(--space-10)" }}>
          <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
            Acervo vazio — execute a importação do banco de dados
          </p>
          <code style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            npx tsx prisma/import-srd.ts
          </code>
        </div>
      )}
    </div>
  );
}
