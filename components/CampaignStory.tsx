"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Chapter {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
  updatedAt: string;
}

const CHAPTER_TEMPLATES = [
  { title: "Prólogo", hint: "A ambientação e o gancho inicial da aventura..." },
  { title: "Ato I — Introdução", hint: "Os heróis se encontram, recebem a missão..." },
  { title: "Ato II — Desenvolvimento", hint: "Desafios, reviravoltas, encontros..." },
  { title: "Ato III — Clímax", hint: "O confronto final, a revelação..." },
  { title: "Epílogo", hint: "O que acontece depois, consequências..." },
  { title: "Ambientação", hint: "O mundo, as cidades, a geografia, o clima..." },
  { title: "Facções & Organizações", hint: "Guildas, ordens, cultos, governos..." },
  { title: "Segredos do Mestre", hint: "Informações que só o mestre sabe..." },
];

export default function CampaignStory({ campaignId }: { campaignId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadChapters = useCallback(async () => {
    try {
      const res = await fetch(`/api/chapters?campaignId=${campaignId}`);
      if (res.ok) {
        const data = await res.json();
        setChapters(data);
        if (!activeId && data.length > 0) {
          setActiveId(data[0].id);
          setEditingContent(data[0].content);
          setEditingTitle(data[0].title);
        }
      }
    } catch {}
  }, [campaignId, activeId]);

  useEffect(() => { loadChapters(); }, [loadChapters]);

  const activeChapter = chapters.find((c) => c.id === activeId);

  function selectChapter(ch: Chapter) {
    // Salvar capítulo atual antes de trocar
    if (activeId && editingContent !== activeChapter?.content) {
      saveChapter(activeId, editingContent, editingTitle);
    }
    setActiveId(ch.id);
    setEditingContent(ch.content);
    setEditingTitle(ch.title);
    setAiResult(null);
  }

  async function saveChapter(id: string, content: string, title: string) {
    setSaving(true);
    try {
      await fetch(`/api/chapters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      });
      setLastSaved(new Date().toLocaleTimeString("pt-BR"));
      // Atualizar local
      setChapters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content, title } : c))
      );
    } catch {}
    setSaving(false);
  }

  // Auto-save com debounce de 2 segundos
  function handleContentChange(value: string) {
    setEditingContent(value);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      if (activeId) saveChapter(activeId, value, editingTitle);
    }, 2000);
  }

  function handleTitleChange(value: string) {
    setEditingTitle(value);
  }

  async function handleSaveNow() {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    if (activeId) await saveChapter(activeId, editingContent, editingTitle);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, title: newTitle.trim() }),
      });
      if (res.ok) {
        const ch = await res.json();
        setChapters((prev) => [...prev, ch]);
        setActiveId(ch.id);
        setEditingContent("");
        setEditingTitle(ch.title);
        setNewTitle("");
        setShowNewForm(false);
      }
    } catch {}
  }

  async function handleDelete(id: string) {
    if (!confirm("Deletar este capítulo? O conteúdo será perdido.")) return;
    try {
      await fetch(`/api/chapters/${id}`, { method: "DELETE" });
      setChapters((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        const remaining = chapters.filter((c) => c.id !== id);
        if (remaining.length > 0) {
          selectChapter(remaining[0]);
        } else {
          setActiveId(null);
          setEditingContent("");
          setEditingTitle("");
        }
      }
    } catch {}
  }

  // IA
  async function handleAi(action: string) {
    if (!activeId) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const prompts: Record<string, string> = {
        expand: `Expanda e enriqueça o seguinte texto de história de campanha de RPG D&D 3.5. Adicione detalhes, descrições sensoriais, diálogos e ganchos narrativos. Mantenha o tom e a direção do texto original. Responda em português (PT-BR).\n\nTítulo do capítulo: ${editingTitle}\n\nTexto atual:\n${editingContent || "(vazio — crie um início baseado no título)"}`,
        hooks: `Baseado neste capítulo de uma aventura de D&D 3.5, sugira 5 ganchos narrativos (plot hooks) que o mestre pode usar para engajar os jogadores. Cada gancho deve ter: título, descrição curta, e como conectar com o grupo. Responda em português (PT-BR).\n\nCapítulo: ${editingTitle}\n\n${editingContent || "(sem conteúdo ainda)"}`,
        npcs: `Baseado neste capítulo, sugira 3-5 NPCs que fariam sentido aparecer. Para cada NPC dê: nome, raça, classe, nível, alinhamento, motivação e uma frase marcante. Use regras D&D 3.5. Responda em português (PT-BR).\n\nCapítulo: ${editingTitle}\n\n${editingContent || "(sem conteúdo ainda)"}`,
        locations: `Baseado neste capítulo, descreva detalhadamente os locais mencionados ou que fariam sentido existir. Para cada local dê: nome, tipo (taverna, dungeon, floresta, etc.), descrição visual, perigos, e possíveis encontros com monstros do D&D 3.5 com CR. Responda em português (PT-BR).\n\nCapítulo: ${editingTitle}\n\n${editingContent || "(sem conteúdo ainda)"}`,
        encounters: `Sugira 3-5 encontros temáticos para este capítulo de aventura D&D 3.5. Para cada encontro: nome, monstros específicos (com CR e quantidade), ambiente/terreno, tática dos monstros, e tesouro possível. Baseie nos locais e tom da história. Responda em português (PT-BR).\n\nCapítulo: ${editingTitle}\n\n${editingContent || "(sem conteúdo ainda)"}`,
      };

      const res = await fetch("/api/documents/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "expand-story",
          campaignId,
          documentId: null,
          customContent: prompts[action] || prompts.expand,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data.result);
      }
    } catch {}
    setAiLoading(false);
  }

  function insertAiResult() {
    if (!aiResult) return;
    const newContent = editingContent
      ? `${editingContent}\n\n---\n\n${aiResult}`
      : aiResult;
    setEditingContent(newContent);
    if (activeId) saveChapter(activeId, newContent, editingTitle);
    setAiResult(null);
  }

  function replaceWithAiResult() {
    if (!aiResult) return;
    setEditingContent(aiResult);
    if (activeId) saveChapter(activeId, aiResult, editingTitle);
    setAiResult(null);
  }

  const wordCount = editingContent.split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ display: "flex", gap: "var(--space-4)", minHeight: "500px" }}>

      {/* Sidebar de capítulos */}
      <div style={{
        width: "220px", flexShrink: 0, display: "flex", flexDirection: "column",
        gap: "var(--space-2)", borderRight: "1px solid var(--border-subtle)",
        paddingRight: "var(--space-4)",
      }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--dnd-red)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-1)" }}>
          📜 Capítulos
        </div>

        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => selectChapter(ch)}
            style={{
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              background: activeId === ch.id ? "var(--bg-hover)" : "transparent",
              borderLeft: activeId === ch.id ? "3px solid var(--dnd-red)" : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: "var(--text-sm)", fontWeight: activeId === ch.id ? 700 : 500, color: "var(--text-primary)" }}>
              {ch.title}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              {ch.content ? `${ch.content.split(/\s+/).filter(Boolean).length} palavras` : "vazio"}
            </div>
          </div>
        ))}

        {/* Templates rápidos */}
        {showNewForm ? (
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <input
              className="input"
              placeholder="Nome do capítulo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              style={{ fontSize: "var(--text-xs)" }}
            />
            <div style={{ display: "flex", gap: "var(--space-1)" }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Criar</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowNewForm(false)}>✕</button>
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
              Sugestões:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {CHAPTER_TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  onClick={() => setNewTitle(t.title)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                    fontSize: "10px", color: "var(--dnd-red)", padding: "2px 0",
                  }}
                  title={t.hint}
                >
                  → {t.title}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowNewForm(true)}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            + Novo Capítulo
          </button>
        )}
      </div>

      {/* Editor principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeId ? (
          <>
            {/* Header do editor */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "var(--space-3)", gap: "var(--space-3)",
            }}>
              <input
                value={editingTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleSaveNow}
                style={{
                  background: "none", border: "none", borderBottom: "1px solid var(--border-subtle)",
                  fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 700,
                  color: "var(--dnd-red)", padding: "var(--space-1) 0", flex: 1, outline: "none",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  {wordCount} palavras
                  {lastSaved && ` · salvo ${lastSaved}`}
                  {saving && " · salvando..."}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleSaveNow} disabled={saving}>
                  💾
                </button>
                <button className="btn btn-danger-text btn-sm" onClick={() => handleDelete(activeId)}>
                  🗑️
                </button>
              </div>
            </div>

            {/* Textarea do conteúdo */}
            <textarea
              value={editingContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Escreva a história aqui...&#10;&#10;Dica: Use os botões de IA abaixo para expandir o texto, gerar ganchos narrativos, NPCs ou encontros temáticos."
              style={{
                flex: 1, minHeight: "300px", resize: "vertical",
                padding: "var(--space-4)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                lineHeight: 1.8, color: "var(--text-primary)",
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)", outline: "none",
              }}
            />

            {/* Toolbar IA */}
            <div style={{
              display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)",
              flexWrap: "wrap", alignItems: "center",
            }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginRight: "var(--space-2)" }}>
                🤖 IA:
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAi("expand")} disabled={aiLoading}>
                📖 Expandir
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAi("hooks")} disabled={aiLoading}>
                🎣 Ganchos
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAi("npcs")} disabled={aiLoading}>
                👥 Sugerir NPCs
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAi("locations")} disabled={aiLoading}>
                🏰 Locais
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAi("encounters")} disabled={aiLoading}>
                ⚔️ Encontros
              </button>
              {aiLoading && (
                <span style={{ fontSize: "var(--text-xs)", color: "var(--arcane)" }}>⏳ Processando...</span>
              )}
            </div>

            {/* Resultado da IA */}
            {aiResult && (
              <div style={{
                marginTop: "var(--space-3)", padding: "var(--space-4)",
                background: "var(--bg-deep)", border: "1px solid var(--border-subtle)",
                borderLeft: "3px solid var(--arcane)", borderRadius: "var(--radius-sm)",
                maxHeight: "300px", overflowY: "auto",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: "var(--space-2)",
                }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--arcane)", textTransform: "uppercase" }}>
                    🤖 Resultado da IA
                  </span>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <button className="btn btn-primary btn-sm" onClick={replaceWithAiResult}>
                      Substituir texto
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={insertAiResult}>
                      Anexar ao final
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAiResult(null)}>
                      ✕
                    </button>
                  </div>
                </div>
                <div style={{
                  fontSize: "var(--text-sm)", color: "var(--text-secondary)",
                  lineHeight: 1.7, whiteSpace: "pre-wrap",
                }}>
                  {aiResult}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", gap: "var(--space-3)",
          }}>
            <span style={{ fontSize: "48px" }}>📜</span>
            <p style={{ fontSize: "var(--text-sm)", textAlign: "center", maxWidth: "400px", lineHeight: 1.6 }}>
              Aqui você escreve a história da sua campanha — o enredo, a ambientação, os segredos.
              Organize em capítulos e use a IA para expandir, gerar ganchos narrativos, NPCs e encontros temáticos.
            </p>
            <button className="btn btn-primary" onClick={() => setShowNewForm(true)}>
              + Criar Primeiro Capítulo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
