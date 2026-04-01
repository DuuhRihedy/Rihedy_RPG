"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getTodayRequestCount } from "@/lib/actions/assistant";
import { logout } from "@/lib/actions/auth";

export function Header() {
  const [requestCount, setRequestCount] = useState<number | null>(null);

  const refresh = useCallback(() => {
    getTodayRequestCount().then(setRequestCount);
  }, []);

  useEffect(() => {
    refresh();

    // Atualiza a cada 30 segundos
    const interval = setInterval(refresh, 30_000);

    // Atualiza quando a aba ganha foco
    window.addEventListener("focus", refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

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
          <span>IA: {requestCount !== null ? requestCount : "…"}/250</span>
        </div>
        <ThemeToggle />
        <Link href="/configuracoes" className="btn btn-ghost btn-sm" title="Configurações">⚙️</Link>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost btn-sm header-logout-btn" title="Sair">
            🚪
          </button>
        </form>
      </div>
    </header>
  );
}
