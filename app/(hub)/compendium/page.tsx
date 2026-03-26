import CompendiumSearch from "@/components/CompendiumSearch";
import "./compendium.css";

export default function CompendiumPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>📚 Compêndio de Regras</h1>
          <p>Busca unificada em todo o Acervo D&D — 3.5 e 5e</p>
        </div>
      </div>
      <CompendiumSearch />
    </div>
  );
}
