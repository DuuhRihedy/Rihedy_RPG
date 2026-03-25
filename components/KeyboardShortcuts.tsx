"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input/textarea/select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Ctrl+K or Cmd+K → Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(".header-search-input") as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }

      // ? → Show shortcuts help
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      }

      // Escape → Close help
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
      }

      // Navigation shortcuts (no modifiers)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case "g":
            if (e.shiftKey) return;
            // Wait for next key
            break;
        }
      }

      // Alt + number → Quick nav
      if (e.altKey && !e.ctrlKey) {
        switch (e.key) {
          case "1": e.preventDefault(); router.push("/"); break;
          case "2": e.preventDefault(); router.push("/campanhas"); break;
          case "3": e.preventDefault(); router.push("/npcs"); break;
          case "4": e.preventDefault(); router.push("/compendium"); break;
          case "5": e.preventDefault(); router.push("/ferramentas/dados"); break;
          case "6": e.preventDefault(); router.push("/assistente"); break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, showHelp]);

  if (!showHelp) return null;

  return (
    <div className="shortcuts-overlay" onClick={() => setShowHelp(false)}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Atalhos de Teclado</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowHelp(false)}>✕</button>
        </div>

        <div className="shortcuts-grid">
          <div className="shortcuts-section">
            <h4>Geral</h4>
            <div className="shortcut-row">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>Busca rápida</span>
            </div>
            <div className="shortcut-row">
              <kbd>?</kbd>
              <span>Mostrar atalhos</span>
            </div>
            <div className="shortcut-row">
              <kbd>Esc</kbd>
              <span>Fechar</span>
            </div>
          </div>

          <div className="shortcuts-section">
            <h4>Navegação (Alt + número)</h4>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>1</kbd>
              <span>Dashboard</span>
            </div>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>2</kbd>
              <span>Campanhas</span>
            </div>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>3</kbd>
              <span>NPCs</span>
            </div>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>4</kbd>
              <span>Compêndio</span>
            </div>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>5</kbd>
              <span>Dados</span>
            </div>
            <div className="shortcut-row">
              <kbd>Alt</kbd> + <kbd>6</kbd>
              <span>Assistente IA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
