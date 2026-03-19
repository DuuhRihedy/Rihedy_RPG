export function Header() {
  return (
    <header className="header">
      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <span>⚔️</span>
        <span>/</span>
        <span className="header-breadcrumb-current">Dashboard</span>
      </div>

      {/* Search */}
      <div className="header-search">
        <div className="header-search-wrapper">
          <span className="header-search-icon">🔍</span>
          <input
            type="text"
            className="header-search-input"
            placeholder="Buscar regras, NPCs, campanhas..."
          />
          <span className="header-search-kbd">Ctrl+K</span>
        </div>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <div className="header-ia-tokens">
          <span className="header-ia-tokens-dot" />
          <span>IA: 247/250</span>
        </div>
        <button className="btn btn-ghost btn-sm">⚙️</button>
      </div>
    </header>
  );
}
