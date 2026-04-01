"use client";

import { useState } from "react";
import Link from "next/link";

interface Rule {
  id: string;
  title: string;
  icon: string;
  category: string;
  summary: string | null;
  pinned: boolean;
  updatedAt: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

export default function HouseRulesFilter({
  rules,
  categories,
}: {
  rules: Rule[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("");

  const filtered = activeCategory
    ? rules.filter((r) => r.category === activeCategory)
    : rules;

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      {/* Filtros */}
      <div className="regras-filters">
        <button
          className={`regras-filter-btn ${activeCategory === "" ? "active" : ""}`}
          onClick={() => setActiveCategory("")}
        >
          📖 Todas ({rules.length})
        </button>
        {categories.map((cat) => {
          const count = rules.filter((r) => r.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              className={`regras-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="regras-grid">
        {filtered.map((rule, i) => (
          <Link
            key={rule.id}
            href={`/regras-da-casa/${rule.id}`}
            style={{ textDecoration: "none", color: "inherit", animationDelay: `${i * 50}ms` }}
            className="animate-fade-in"
          >
            <div className={`regra-card ${rule.pinned ? "regra-card-pinned" : ""}`}>
              {rule.pinned && <span className="regra-pin-badge">📌</span>}

              <div className="regra-card-header">
                <div className="regra-card-icon">{rule.icon}</div>
                <div className="regra-card-title">{rule.title}</div>
              </div>

              <span className="regra-category">
                {categoryMap[rule.category]?.icon || "📖"}{" "}
                {categoryMap[rule.category]?.label || rule.category}
              </span>

              {rule.summary && (
                <div className="regra-card-summary">{rule.summary}</div>
              )}

              <div className="regra-card-footer">
                <span className="regra-card-date">
                  {formatDate(rule.updatedAt)}
                </span>
                <span className="regra-card-arrow">Ler →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
          Nenhuma regra nesta categoria.
        </div>
      )}
    </>
  );
}
