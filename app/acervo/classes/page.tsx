import { getClasses } from "@/lib/actions/srd";
import { translateClassName } from "@/lib/translations";
import Link from "next/link";
import "../acervo.css";

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link href="/acervo" className="breadcrumb-link">← Acervo</Link>
          <h1 className="page-title">⚔️ Classes</h1>
          <p className="page-subtitle">{classes.length} classes disponíveis</p>
        </div>
      </div>

      <div className="srd-results">
        {classes.map((cls) => (
          <Link key={cls.id} href={`/acervo/classes/${cls.index}`} className="srd-result-card card card-interactive">
            <div className="srd-result-header">
              <h3 className="srd-result-name">{translateClassName(cls.name)}</h3>
              <span className="badge badge-gold">d{cls.hitDie}</span>
            </div>
            <div className="srd-result-meta">
              {cls.savingThrows && <span>🎯 Salvaguardas: {cls.savingThrows}</span>}
            </div>
            <div className="srd-result-sub">{cls.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
