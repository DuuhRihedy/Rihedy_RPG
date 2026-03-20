import { searchSpells, getSpellFilters } from "@/lib/actions/srd";
import { translateSchool, translateClassList, translateSpellLevel, schoolsMap, classesMap } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function SpellsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.q || undefined;
  const level = params.level !== undefined ? parseInt(params.level) : undefined;
  const school = params.school || undefined;
  const className = params.class || undefined;

  const [spells, filters] = await Promise.all([
    searchSpells(query, level, school, className),
    getSpellFilters(),
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
            <Link href="/acervo" className="btn btn-ghost btn-sm">← Acervo</Link>
          </div>
          <h1>📖 Magias</h1>
          <p>{spells.length} resultados</p>
        </div>
      </div>

      {/* Search & Filters */}
      <form className="srd-search-bar card">
        <input
          name="q"
          className="input"
          placeholder="Buscar magia..."
          defaultValue={query}
        />
        <select name="level" className="input select" defaultValue={params.level ?? ""}>
          <option value="">Todos os níveis</option>
          {filters.levels.map((l) => (
            <option key={l} value={l}>
              {l === 0 ? "Truque" : `${l}º Nível`}
            </option>
          ))}
        </select>
        <select name="school" className="input select" defaultValue={school ?? ""}>
          <option value="">Todas as escolas</option>
          {filters.schools.map((s) => (
            <option key={s} value={s}>{translateSchool(s)}</option>
          ))}
        </select>
        <select name="class" className="input select" defaultValue={className ?? ""}>
          <option value="">Todas as classes</option>
          {filters.classes.map((c) => (
            <option key={c} value={c}>{classesMap[c] || c}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      {/* Spell Table */}
      <div className="card">
        <div className="spell-header">
          <span>Nome</span>
          <span style={{ textAlign: "center" }}>Nível</span>
          <span>Escola</span>
          <span style={{ textAlign: "right" }}>Classes</span>
        </div>
        <div className="spell-list">
          {spells.length === 0 ? (
            <p style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-muted)" }}>
              Nenhuma magia encontrada
            </p>
          ) : (
            spells.map((spell) => (
              <Link key={spell.id} href={`/acervo/spells/${spell.index}`} className="spell-row">
                <span className="spell-name">
                  {spell.namePtBr || spell.name}
                  {spell.namePtBr && (
                    <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", marginLeft: "var(--space-2)" }}>
                      {spell.name}
                    </span>
                  )}
                </span>
                <span className="spell-level">{translateSpellLevel(spell.level)}</span>
                <span className="spell-school">{translateSchool(spell.school)}</span>
                <span className="spell-classes">{translateClassList(spell.classes)}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
