"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// === Tipos ===

interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  sourceFile: string | null;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

interface AiResult {
  action: string;
  result: string;
  tokensUsed: number;
  npcsCreated?: number;
  npcCreated?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  npcs?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  npc?: any;
  error?: string;
}

// === Constantes ===

const DOC_TYPES = [
  { value: "historia", label: "Historia" },
  { value: "ficha", label: "Ficha" },
  { value: "aventura", label: "Aventura" },
  { value: "notas", label: "Notas" },
  { value: "outro", label: "Outro" },
];

const TYPE_BADGES: Record<string, { color: string; label: string }> = {
  historia: { color: "#a855f7", label: "Historia" },
  ficha: { color: "#3b82f6", label: "Ficha" },
  aventura: { color: "#ef4444", label: "Aventura" },
  notas: { color: "#f59e0b", label: "Notas" },
  outro: { color: "#6b7280", label: "Outro" },
};

const AI_ACTIONS = [
  { id: "extract-npcs", icon: "\u{1F9D9}", label: "Extrair NPCs", description: "Encontra e cria NPCs a partir do texto" },
  { id: "analyze-sheet", icon: "\u{1F4CB}", label: "Analisar Ficha", description: "Valida ficha contra regras D&D 3.5" },
  { id: "convert-to-npc", icon: "\u{1F464}", label: "Converter em NPC", description: "Transforma o documento em um NPC" },
  { id: "suggest-encounters", icon: "\u2694\uFE0F", label: "Sugerir Encontros", description: "Sugere encontros tematicos" },
  { id: "expand-story", icon: "\u{1F4D6}", label: "Expandir Historia", description: "Expande e enriquece a narrativa" },
  { id: "suggest-items", icon: "\u{1F5E1}\uFE0F", label: "Sugerir Itens", description: "Sugere itens magicos tematicos" },
  { id: "suggest-monsters", icon: "\u{1F409}", label: "Sugerir Monstros", description: "Sugere monstros de D&D 3.5" },
];

// === Componente Principal ===

export default function CampaignDocuments({ campaignId }: { campaignId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null); // acao em andamento
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("notas");
  const [formContent, setFormContent] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega documentos
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents?campaignId=${campaignId}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Upload de documento
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", formName.trim());
      fd.append("type", formType);
      fd.append("campaignId", campaignId);

      if (uploadMode === "file" && formFile) {
        fd.append("file", formFile);
      } else if (uploadMode === "text" && formContent.trim()) {
        fd.append("content", formContent.trim());
      } else {
        alert("Envie um arquivo ou cole o texto.");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao enviar documento");
        return;
      }

      // Limpa formulario e recarrega
      setFormName("");
      setFormType("notas");
      setFormContent("");
      setFormFile(null);
      setShowUploadForm(false);
      await fetchDocuments();
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao enviar documento");
    } finally {
      setUploading(false);
    }
  };

  // Drop de arquivo
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "txt") {
        alert("Apenas arquivos .txt sao suportados no momento. Para PDFs, copie e cole o texto.");
        return;
      }
      setFormFile(file);
      setFormName(file.name.replace(/\.[^/.]+$/, ""));
      setUploadMode("file");
      setShowUploadForm(true);
    }
  };

  // Excluir documento
  const handleDelete = async (docId: string) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;
    try {
      const res = await fetch(`/api/documents?id=${docId}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedDoc?.id === docId) {
          setSelectedDoc(null);
          setAiResult(null);
        }
        await fetchDocuments();
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  // Acao de IA
  const handleAiAction = async (actionId: string) => {
    if (!selectedDoc) return;
    setAiLoading(actionId);
    setAiResult(null);

    try {
      const res = await fetch("/api/documents/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: selectedDoc.id,
          action: actionId,
          campaignId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAiResult({
          action: actionId,
          result: data.error || "Erro desconhecido",
          tokensUsed: 0,
          error: data.error,
        });
        return;
      }

      setAiResult(data);
    } catch (err) {
      console.error("Erro na acao de IA:", err);
      setAiResult({
        action: actionId,
        result: "Erro de conexao com o servidor.",
        tokensUsed: 0,
        error: "Erro de conexao",
      });
    } finally {
      setAiLoading(null);
    }
  };

  // Salvar resultado da IA como nota
  const handleSaveAsNote = async () => {
    if (!aiResult) return;
    try {
      const actionLabel = AI_ACTIONS.find((a) => a.id === aiResult.action)?.label || aiResult.action;
      const formData = new FormData();
      formData.set("campaignId", campaignId);
      formData.set("title", `[IA] ${actionLabel} — ${selectedDoc?.name || "Documento"}`);
      formData.set("content", aiResult.result);

      // Usa server action via fetch simples para criar nota
      const res = await fetch("/api/documents", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("name", `[IA] ${actionLabel} — ${selectedDoc?.name || "Documento"}`);
          fd.append("type", "notas");
          fd.append("campaignId", campaignId);
          fd.append("content", aiResult.result);
          return fd;
        })(),
      });

      if (res.ok) {
        alert("Resultado salvo como novo documento!");
        await fetchDocuments();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // === Render ===

  if (loading) {
    return (
      <div className="card" style={{ padding: "var(--space-8)", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Carregando documentos...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Cabecalho explicativo */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">{"\u{1F4C4}"} Documentos da Campanha</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            + Novo Documento
          </button>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", margin: 0, lineHeight: 1.6 }}>
          Envie textos, fichas de personagem, aventuras ou notas e use a IA para extrair NPCs,
          analisar fichas, sugerir encontros, expandir historias e muito mais.
          Suporta arquivos <strong>.txt</strong> ou texto colado diretamente.
        </p>
      </div>

      {/* Formulario de upload */}
      {showUploadForm && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{"\u{1F4E4}"} Enviar Documento</span>
          </div>

          {/* Area de drag & drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => { setUploadMode("file"); fileInputRef.current?.click(); }}
            style={{
              border: `2px dashed ${dragOver ? "var(--dnd-gold)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "var(--space-6)",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "var(--space-4)",
              background: dragOver ? "rgba(var(--dnd-gold-rgb, 212, 175, 55), 0.05)" : "transparent",
              transition: "all 0.2s",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormFile(file);
                  setFormName(file.name.replace(/\.[^/.]+$/, ""));
                  setUploadMode("file");
                }
              }}
            />
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "var(--text-sm)" }}>
              {formFile
                ? `Arquivo selecionado: ${formFile.name}`
                : "Arraste um arquivo .txt aqui ou clique para selecionar"}
            </p>
          </div>

          {/* Alternativa: colar texto */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <button
              className={`btn btn-sm ${uploadMode === "file" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setUploadMode("file")}
              type="button"
            >
              {"\u{1F4C1}"} Arquivo
            </button>
            <button
              className={`btn btn-sm ${uploadMode === "text" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setUploadMode("text")}
              type="button"
            >
              {"\u{1F4DD}"} Colar Texto
            </button>
          </div>

          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div className="form-row" style={{ display: "flex", gap: "var(--space-3)" }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Nome do Documento</label>
                <input
                  className="input"
                  placeholder="Ex: Aventura do Dragao Vermelho"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Tipo</label>
                <select
                  className="input"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {uploadMode === "text" && (
              <div className="form-group">
                <label className="form-label">Conteudo</label>
                <textarea
                  className="input textarea"
                  rows={8}
                  placeholder="Cole aqui o texto do documento, ficha de personagem, aventura..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  required
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={uploading}
              >
                {uploading ? "Enviando..." : "Enviar Documento"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowUploadForm(false);
                  setFormFile(null);
                  setFormName("");
                  setFormContent("");
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Layout de duas colunas: lista + visualizador */}
      <div className="grid-docs" style={{ gridTemplateColumns: selectedDoc ? "1fr 2fr" : "1fr" }}>
        {/* Lista de documentos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {documents.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-8)", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                Nenhum documento ainda. Envie o primeiro acima!
              </p>
            </div>
          ) : (
            documents.map((doc) => {
              const badge = TYPE_BADGES[doc.type] || TYPE_BADGES.outro;
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className="card"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setAiResult(null);
                  }}
                  style={{
                    cursor: "pointer",
                    border: isSelected ? "1px solid var(--dnd-gold)" : undefined,
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flex: 1 }}>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius)",
                          background: badge.color + "22",
                          color: badge.color,
                          fontWeight: 600,
                        }}
                      >
                        {badge.label}
                      </span>
                      <strong style={{ fontSize: "var(--text-sm)" }}>{doc.name}</strong>
                    </div>
                    <button
                      className="btn btn-danger-text btn-sm"
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      title="Excluir documento"
                    >
                      {"\u2715"}
                    </button>
                  </div>
                  <p style={{
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-xs)",
                    margin: 0,
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {doc.content.substring(0, 200)}{doc.content.length > 200 ? "..." : ""}
                  </p>
                  <div style={{ marginTop: "var(--space-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                      {new Date(doc.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    {doc.sourceFile && (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                        {"\u{1F4CE}"} {doc.sourceFile}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Painel de visualizacao + IA */}
        {selectedDoc && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* Conteudo do documento */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">{selectedDoc.name}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setSelectedDoc(null); setAiResult(null); }}
                >
                  {"\u2715"} Fechar
                </button>
              </div>
              <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                padding: "var(--space-2)",
                background: "var(--bg-secondary, rgba(0,0,0,0.1))",
                borderRadius: "var(--radius)",
              }}>
                {selectedDoc.content}
              </div>
            </div>

            {/* Toolbar de acoes IA */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">{"\u{1F916}"} Acoes de IA</span>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "var(--space-2)",
              }}>
                {AI_ACTIONS.map((action) => {
                  const isLoading = aiLoading === action.id;
                  return (
                    <button
                      key={action.id}
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleAiAction(action.id)}
                      disabled={!!aiLoading}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        padding: "var(--space-3)",
                        height: "auto",
                        opacity: aiLoading && !isLoading ? 0.5 : 1,
                      }}
                      title={action.description}
                    >
                      <span style={{ fontSize: "1.5rem" }}>
                        {isLoading ? "\u23F3" : action.icon}
                      </span>
                      <span style={{ fontSize: "var(--text-xs)", whiteSpace: "nowrap" }}>
                        {isLoading ? "Processando..." : action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {aiLoading && (
                <p style={{
                  color: "var(--dnd-gold)",
                  fontSize: "var(--text-sm)",
                  textAlign: "center",
                  marginTop: "var(--space-3)",
                  marginBottom: 0,
                }}>
                  {"\u2728"} A IA esta analisando o documento... Isso pode levar alguns segundos.
                </p>
              )}
            </div>

            {/* Resultado da IA */}
            {aiResult && (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">
                    {"\u{1F4A1}"} Resultado: {AI_ACTIONS.find((a) => a.id === aiResult.action)?.label || aiResult.action}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
                    {aiResult.tokensUsed} tokens
                  </span>
                </div>

                {/* Info de NPCs criados */}
                {aiResult.npcsCreated !== undefined && aiResult.npcsCreated > 0 && (
                  <div style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color: "#22c55e",
                  }}>
                    {"\u2705"} {aiResult.npcsCreated} NPC(s) criado(s) e vinculado(s) a campanha!
                  </div>
                )}

                {aiResult.npcCreated && (
                  <div style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color: "#22c55e",
                  }}>
                    {"\u2705"} NPC criado e vinculado a campanha!
                  </div>
                )}

                {aiResult.error && (
                  <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color: "#ef4444",
                  }}>
                    {"\u26A0\uFE0F"} {aiResult.error}
                  </div>
                )}

                {/* Texto do resultado */}
                <div style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  padding: "var(--space-2)",
                  background: "var(--bg-secondary, rgba(0,0,0,0.1))",
                  borderRadius: "var(--radius)",
                }}>
                  {aiResult.result}
                </div>

                {/* Botoes de acao no resultado */}
                <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveAsNote}
                  >
                    {"\u{1F4BE}"} Salvar como Documento
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult.result);
                      alert("Copiado para a area de transferencia!");
                    }}
                  >
                    {"\u{1F4CB}"} Copiar Texto
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
