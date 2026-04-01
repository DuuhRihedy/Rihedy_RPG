"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHouseRule } from "@/lib/actions/house-rules";
import { HOUSE_RULE_CATEGORIES } from "@/lib/house-rule-categories";
import RichTextField from "@/components/RichTextField";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const ICONS = ["📜", "⚔️", "🎭", "🗺️", "✨", "🔥", "👤", "🧪", "🛡️", "💀", "🎲", "📖", "🏰", "⚡", "🗡️", "💎"];

export default function HouseRuleFormClient() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [selectedIcon, setSelectedIcon] = useState("📜");
  const router = useRouter();

  if (!isAdmin) {
    router.replace("/regras-da-casa");
    return null;
  }

  return (
    <div className="regra-form">
      <Link href="/regras-da-casa" className="regra-detail-back">
        ← Voltar às Regras da Casa
      </Link>

      <h1 style={{ marginBottom: "var(--space-6)" }}>✨ Nova Regra da Casa</h1>

      <form action={createHouseRule}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Título + Ícone */}
          <div className="regra-form-grid">
            <div className="form-group">
              <label className="form-label">Ícone</label>
              <input type="hidden" name="icon" value={selectedIcon} />
              <div className="regra-form-icon-picker">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`regra-form-icon-btn ${selectedIcon === icon ? "active" : ""}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  name="title"
                  className="input"
                  placeholder="Ex: Conversas de Fogueira"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select name="category" className="input select" defaultValue="geral">
                  {HOUSE_RULE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="form-group">
            <label className="form-label">Resumo (aparece no card)</label>
            <textarea
              name="summary"
              className="input textarea"
              placeholder="Uma breve explicação de como e quando usar essa regra..."
              rows={2}
            />
          </div>

          {/* Conteúdo */}
          <RichTextField
            name="content"
            label="Conteúdo da Regra"
            placeholder="Escreva a regra completa aqui. Use '/' para inserir blocos..."
            minHeight="400px"
          />

          {/* Botões */}
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              📜 Criar Regra
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
