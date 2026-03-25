"use client";

import { useState, useEffect } from "react";

/**
 * Alternador de tema: Underdark (escuro) / Livro (claro)
 * Persiste a escolha no localStorage com a chave "hub-rpg-theme"
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hub-rpg-theme") as "dark" | "light" | null;
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hub-rpg-theme", next);
  }

  // Evita flash de conteúdo antes de montar
  if (!mounted) return null;

  return (
    <button className="theme-toggle-btn" onClick={toggle} type="button">
      {theme === "dark" ? "☀️ Livro" : "🌙 Underdark"}
    </button>
  );
}
