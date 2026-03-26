"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendMessage } from "@/lib/actions/assistant";

interface MiniMsg {
  role: "user" | "assistant";
  content: string;
}

export function ChatSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MiniMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Esconde na página do Assistente IA (já tem chat completo)
  if (pathname === "/assistente") return null;

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await sendMessage(userMsg, "chat");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.text },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erro ao consultar o Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        className="mini-chat-toggle"
        onClick={() => setOpen(!open)}
        title="Assistente IA"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Panel */}
      {open && (
        <div className="mini-chat-panel">
          <div className="mini-chat-header">
            <span>🤖 Assistente Rápido</span>
            <button className="mini-chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="mini-chat-messages">
            {messages.length === 0 && (
              <div className="mini-chat-empty">
                Pergunte sobre regras, magias, monstros...
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mini-msg mini-${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mini-msg mini-assistant mini-loading">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mini-chat-input-area">
            <input
              className="mini-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pergunte..."
              disabled={loading}
            />
            <button
              className="mini-chat-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
