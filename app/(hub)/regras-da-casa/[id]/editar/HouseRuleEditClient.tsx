"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHouseRule } from "@/lib/actions/house-rules";
import { HOUSE_RULE_CATEGORIES } from "@/lib/house-rule-categories";
import RichTextField from "@/components/RichTextField";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const ICONS = ["📜", "⚔️", "🎭", "🗺️", "✨", "🔥", "👤", "🧪", "🛡️", "💀", "🎲", "📖", "🏰", "⚡", "🗡️", "💎"];

interface RuleData {
  id: string;
  title: string;
  icon: string;
  category: string;
  summary: string | null;
  content: string;
  pinned: boolean;
}

export default function HouseRuleEditClient({ rule }: { rule: RuleData }) {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [selectedIcon, setSelectedIcon] = useState(rule.icon);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  if (!isAdmin) {
    router.replace(`/regras-da-casa/${rule.id}`);
    return null;
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setSaved(false);
    try {
      await updateHouseRule(rule.id, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="regra-form">
      <Link href={`/regras-da-casa/${rule.id}`} className="regra-detail-back">
        ← Voltar à Regra
      </Link>

      <h1 style={{ marginBottom: "var(--space-6)" }}>✏️ Editar Regra</h1>

      <form action={handleSubmit}>
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
                  defaultValue={rule.title}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select name="category" className="input select" defaultValue={rule.category}>
                  {HOUSE_RULE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pin */}
          <input type="hidden" name="pinned" value={rule.pinned ? "true" : "false"} />

          {/* Resumo */}
          <div className="form-group">
            <label className="form-label">Resumo (aparece no card)</label>
            <textarea
              name="summary"
              className="input textarea"
              defaultValue={rule.summary || ""}
              placeholder="Uma breve explicação de como e quando usar essa regra..."
              rows={2}
            />
          </div>

          {/* Conteúdo */}
          <RichTextField
            key={rule.id}
            name="content"
            label="Conteúdo da Regra"
            initialContent={rule.content}
            placeholder="Escreva a regra completa aqui. Use '/' para inserir blocos..."
            minHeight="400px"
          />

          {/* Botões */}
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", alignItems: "center" }}>
            {saved && (
              <span style={{ color: "var(--success)", fontSize: "var(--text-sm)", fontWeight: 600, animation: "fadeIn 0.2s ease" }}>
                ✓ Salvo com sucesso!
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push(`/regras-da-casa/${rule.id}`)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "💾 Salvar Alterações"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
