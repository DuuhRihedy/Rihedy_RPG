"use client";

import { useState, useEffect, useCallback } from "react";
import { BlockEditor } from "@/components/editor";
import type { JSONContent } from "@tiptap/core";

interface Session {
  id: string;
  number: number;
  title: string | null;
  date: string | null;
  notes: string | null;
  aiRecap: string | null;
  durationMin: number | null;
  _count: { events: number; npcsPresent: number };
}

export default function CampaignSessions({ campaignId }: { campaignId: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Campos de criação
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  // Campos de edição
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");

  // IA
  const [generatingRecap, setGeneratingRecap] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions?campaignId=${campaignId}`);
      if (res.ok) setSessions(await res.json());
    } catch {}
  }, [campaignId]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, title: newTitle.trim(), date: newDate || null }),
      });
      setNewTitle("");
      setNewDate("");
      setCreating(false);
      loadSessions();
    } catch {}
  }

  function startEdit(s: Session) {
    setEditing(s.id);
    setEditTitle(s.title || "");
    setEditNotes(s.notes || "");
    setEditDate(s.date ? s.date.split("T")[0] : "");
    setEditDuration(s.durationMin?.toString() || "");
  }

  async function handleSave(id: string) {
    try {
      await fetch(`/api/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          title: editTitle.trim() || null,
          notes: editNotes.trim() || null,
          date: editDate || null,
          durationMin: editDuration ? parseInt(editDuration) : null,
        }),
      });
      setEditing(null);
      loadSessions();
    } catch {}
  }

  async function handleDelete(id: string) {
    if (!confirm("Deletar esta sessão?")) return;
    try {
      await fetch(`/api/sessions/${id}?campaignId=${campaignId}`, { method: "DELETE" });
      loadSessions();
    } catch {}
  }

  async function handleGenerateRecap(session: Session) {
    setGeneratingRecap(session.id);
    try {
      const res = await fetch("/api/documents/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "expand-story",
          campaignId,
          documentId: null,
          customContent: `Gere um recap/resumo detalhado para a Sessão #${session.number}${session.title ? ` "${session.title}"` : ""}${session.notes ? `. Notas do mestre: ${session.notes}` : ". Não há notas ainda — crie um recap fictício baseado no contexto da campanha."}`
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Salvar o recap na sessão
        await fetch(`/api/sessions/${session.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaignId, aiRecap: data.result }),
        });
        loadSessions();
      }
    } catch {}
    setGeneratingRecap(null);
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="card-title">📖 Sessões ({sessions.length})</span>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(!creating)}>
          {creating ? "Cancelar" : "+ Nova Sessão"}
        </button>
      </div>

      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-4)", lineHeight: 1.5 }}>
        Registre cada sessão de jogo com título, data, notas e duração. Clique numa sessão para expandir e editar. A IA pode gerar resumos automáticos.
      </p>

      {/* Formulário de criação */}
      {creating && (
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder="Título da sessão..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ flex: 2, minWidth: "200px" }}
            required
          />
          <input
            type="date"
            className="input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={{ flex: 1, minWidth: "140px" }}
          />
          <button type="submit" className="btn btn-primary btn-sm">Criar</button>
        </form>
      )}

      {/* Lista de sessões */}
      {sessions.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-8) 0" }}>
          Nenhuma sessão registrada. Clique em &quot;+ Nova Sessão&quot; para começar.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            const isEditing = editing === session.id;

            return (
              <div key={session.id} style={{
                border: "1px solid var(--border-subtle)",
                borderTop: isExpanded ? "2px solid var(--dnd-red)" : "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-elevated)",
                overflow: "hidden",
              }}>
                {/* Header da sessão — clicável */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)", cursor: "pointer",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)", fontWeight: 700,
                    color: "var(--dnd-red)", fontSize: "var(--text-base)", minWidth: "36px",
                  }}>
                    #{session.number}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                      {session.title || `Sessão ${session.number}`}
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                      {session.date && new Date(session.date).toLocaleDateString("pt-BR")}
                      {session.durationMin && ` · ${session.durationMin}min`}
                      {session.notes && " · 📝 tem notas"}
                      {session.aiRecap && " · 🤖 tem recap"}
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <div style={{ padding: "0 var(--space-4) var(--space-4)", borderTop: "1px solid var(--border-subtle)" }}>

                    {/* Modo edição */}
                    {isEditing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-3)" }}>
                        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                          <div className="form-group" style={{ flex: 2, minWidth: "200px" }}>
                            <label className="form-label">Título</label>
                            <input className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ flex: 1, minWidth: "140px" }}>
                            <label className="form-label">Data</label>
                            <input type="date" className="input" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: "100px" }}>
                            <label className="form-label">Duração (min)</label>
                            <input type="number" className="input" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} min={0} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Notas da Sessão</label>
                          <BlockEditor
                            content={editNotes}
                            onChange={(json: JSONContent) => setEditNotes(JSON.stringify(json))}
                            placeholder="O que aconteceu nesta sessão? Digite '/' para comandos..."
                            minHeight="180px"
                          />
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancelar</button>
                          <button className="btn btn-primary btn-sm" onClick={() => handleSave(session.id)}>💾 Salvar</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ paddingTop: "var(--space-3)" }}>
                        {/* Notas */}
                        {session.notes ? (
                          <div style={{ marginBottom: "var(--space-3)" }}>
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--dnd-red)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>
                              📝 Notas do Mestre
                            </div>
                            <BlockEditor
                              content={session.notes}
                              editable={false}
                              showMenuBar={false}
                              minHeight="auto"
                            />
                          </div>
                        ) : (
                          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "var(--space-3)" }}>
                            Sem notas ainda — clique em &quot;Editar&quot; para adicionar.
                          </p>
                        )}

                        {/* Recap IA */}
                        {session.aiRecap && (
                          <div style={{ marginBottom: "var(--space-3)", padding: "var(--space-3)", background: "var(--bg-deep)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--arcane)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>
                              🤖 Recap da IA
                            </div>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                              {session.aiRecap}
                            </p>
                          </div>
                        )}

                        {/* Ações */}
                        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                          <button className="btn btn-primary btn-sm" onClick={() => startEdit(session)}>
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleGenerateRecap(session)}
                            disabled={generatingRecap === session.id}
                          >
                            {generatingRecap === session.id ? "⏳ Gerando..." : "🤖 Gerar Recap com IA"}
                          </button>
                          <button
                            className="btn btn-danger-text btn-sm"
                            onClick={() => handleDelete(session.id)}
                            style={{ marginLeft: "auto" }}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
