"use client";

import { useState, useRef, useEffect } from "react";
import {
  sendMessage,
  getCampaignsForSelector,
  getSessionsForCampaign,
} from "@/lib/actions/assistant";
import type { AssistantMode } from "@/lib/services/ai-assistant";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  mode?: AssistantMode;
  tokens?: number;
}

interface Campaign {
  id: string;
  name: string;
  edition: string;
  status: string;
}

interface Session {
  id: string;
  number: number;
  title: string | null;
}

const MODE_CONFIG = {
  chat: {
    emoji: "📖",
    label: "Chat de Regras",
    placeholder: "Pergunte sobre regras, magias, monstros...",
    color: "var(--info)",
  },
  npc: {
    emoji: "👤",
    label: "Gerar NPC",
    placeholder: "Descreva o NPC que você quer gerar...",
    color: "var(--success)",
  },
  recap: {
    emoji: "📜",
    label: "Recap de Sessão",
    placeholder: "Cole suas notas brutas da sessão...",
    color: "var(--warning)",
  },
};

export default function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AssistantMode>("chat");
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCampaignsForSelector().then(setCampaigns);
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      getSessionsForCampaign(selectedCampaign).then(setSessions);
    } else {
      setSessions([]);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, mode }]);
    setLoading(true);

    try {
      const res = await sendMessage(
        userMsg,
        mode,
        selectedCampaign || undefined,
        selectedSession || undefined,
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.text,
          mode,
          tokens: res.tokensUsed,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Erro: ${err instanceof Error ? err.message : "Falha na comunicação com o Gemini"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const config = MODE_CONFIG[mode];

  return (
    <div className="assistant-container">
      {/* Toolbar */}
      <div className="assistant-toolbar">
        <div className="assistant-modes">
          {(Object.entries(MODE_CONFIG) as [AssistantMode, typeof config][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                className={`assistant-mode-btn ${mode === key ? "active" : ""}`}
                onClick={() => setMode(key)}
                style={
                  mode === key
                    ? { borderColor: cfg.color, color: cfg.color }
                    : undefined
                }
              >
                {cfg.emoji} {cfg.label}
              </button>
            ),
          )}
        </div>

        <div className="assistant-selectors">
          <select
            className="input select"
            value={selectedCampaign}
            onChange={(e) => {
              setSelectedCampaign(e.target.value);
              setSelectedSession("");
            }}
          >
            <option value="">Sem campanha</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.edition})
              </option>
            ))}
          </select>

          {mode === "recap" && sessions.length > 0 && (
            <select
              className="input select"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">Selecione a sessão</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.number} — {s.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="assistant-messages">
        {messages.length === 0 && (
          <div className="assistant-welcome">
            <div className="assistant-welcome-icon">🤖</div>
            <h2>Assistente do Hub RPG</h2>
            <p>
              Pergunte sobre regras, gere NPCs ou crie recaps de sessões.
              <br />
              Selecione uma campanha para respostas contextualizadas.
            </p>
            <div className="assistant-tips">
              <button
                className="assistant-tip"
                onClick={() => {
                  setMode("chat");
                  setInput("Como funciona o Sneak Attack do Ladino?");
                }}
              >
                📖 &quot;Como funciona Sneak Attack?&quot;
              </button>
              <button
                className="assistant-tip"
                onClick={() => {
                  setMode("npc");
                  setInput(
                    "Gere um mercador anão neutro bom que vende itens mágicos suspeitos",
                  );
                }}
              >
                👤 &quot;Gere um mercador anão...&quot;
              </button>
              <button
                className="assistant-tip"
                onClick={() => {
                  setMode("chat");
                  setInput("Quais magias de 3° nível o Mago pode preparar?");
                }}
              >
                📖 &quot;Magias de 3° nível do Mago&quot;
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`assistant-msg ${msg.role === "user" ? "msg-user" : "msg-assistant"}`}
          >
            <div className="msg-avatar">
              {msg.role === "user"
                ? "🧙"
                : msg.mode
                  ? MODE_CONFIG[msg.mode].emoji
                  : "🤖"}
            </div>
            <div className="msg-content">
              {msg.role === "assistant" ? (
                <div
                  className="msg-text markdown"
                  dangerouslySetInnerHTML={{
                    __html: simpleMarkdown(msg.content),
                  }}
                />
              ) : (
                <div className="msg-text">{msg.content}</div>
              )}
              {msg.tokens && (
                <span className="msg-tokens">{msg.tokens} tokens</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="assistant-msg msg-assistant">
            <div className="msg-avatar">{config.emoji}</div>
            <div className="msg-content">
              <div className="msg-text loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="assistant-input-area">
        <div
          className="assistant-input-indicator"
          style={{ background: config.color }}
        />
        <textarea
          className="assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={config.placeholder}
          rows={mode === "recap" ? 4 : 1}
          disabled={loading}
        />
        <button
          className="btn btn-primary assistant-send"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? "⏳" : "➤"}
        </button>
      </div>
    </div>
  );
}

// Markdown simplificado (sem lib externa)
function simpleMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match
        .split("|")
        .filter((c) => c.trim())
        .map((c) => `<td>${c.trim()}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .replace(
      /(<tr>.*<\/tr>\n?)+/g,
      '<table class="md-table">$&</table>',
    )
    .replace(/^\|[-|: ]+\|$/gm, "")
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
