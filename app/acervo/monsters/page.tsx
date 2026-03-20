import { searchMonsters, getMonsterFilters } from "@/lib/actions/srd";
import { translateSize, translateCreatureType, translateAlignment, creatureTypesMap } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function MonstersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q || undefined;
  const type = params.type || undefined;
  const crMin = params.cr_min ? parseFloat(params.cr_min) : undefined;
  const crMax = params.cr_max ? parseFloat(params.cr_max) : undefined;

  const [monsters, filters] = await Promise.all([
    searchMonsters(query, type, crMin, crMax),
    getMonsterFilters(),
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <Link href="/acervo" className="btn btn-ghost btn-sm">← Acervo</Link>
          </div>
          <h1>🐉 Monstros</h1>
          <p>{monsters.length} resultados</p>
        </div>
      </div>

      {/* Search & Filters */}
      <form className="srd-search-bar card">
        <input
          name="q"
          className="input"
          placeholder="Buscar monstro..."
          defaultValue={query}
        />
        <select name="type" className="input select" defaultValue={type ?? ""}>
          <option value="">Todos os tipos</option>
          {filters.types.map((t) => (
            <option key={t} value={t}>
              {creatureTypesMap[t] || creatureTypesMap[t.toLowerCase()] || t}
            </option>
          ))}
        </select>
        <input
          name="cr_min"
          type="number"
          className="input"
          placeholder="ND mín"
          defaultValue={params.cr_min}
          min="0"
          max="30"
          step="0.25"
          style={{ maxWidth: "90px" }}
        />
        <input
          name="cr_max"
          type="number"
          className="input"
          placeholder="ND máx"
          defaultValue={params.cr_max}
          min="0"
          max="30"
          step="0.25"
          style={{ maxWidth: "90px" }}
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      {/* Monster Table */}
      <div className="card">
        <div className="monster-header">
          <span>Nome</span>
          <span>ND</span>
          <span>PV</span>
          <span>CA</span>
          <span>XP</span>
        </div>
        <div className="monster-list">
          {monsters.length === 0 ? (
            <p style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
              Nenhum monstro encontrado
            </p>
          ) : (
            monsters.map((mon) => (
              <Link key={mon.id} href={`/acervo/monsters/${mon.index}`} className="monster-row">
                <div className="monster-info">
                  <span className="monster-name">
                    {mon.namePtBr || mon.name}
                    {mon.namePtBr && (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", marginLeft: "var(--space-2)" }}>
                        {mon.name}
                      </span>
                    )}
                  </span>
                  <span className="monster-meta">
                    {translateSize(mon.size)} {translateCreatureType(mon.type)}
                    {mon.alignment ? ` · ${translateAlignment(mon.alignment)}` : ""}
                  </span>
                </div>
                <span className="monster-stat"><strong>{mon.challengeRating}</strong></span>
                <span className="monster-stat" style={{ color: "var(--danger)" }}><strong>{mon.hitPoints}</strong></span>
                <span className="monster-stat" style={{ color: "var(--info)" }}><strong>{mon.armorClass}</strong></span>
                <span className="monster-stat">{mon.xp.toLocaleString()}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
