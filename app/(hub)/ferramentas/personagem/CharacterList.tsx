"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCharacter } from "@/lib/actions/characters";
import CharacterCreator from "@/components/CharacterCreator";

interface CharacterItem {
  id: string;
  name: string;
  edition: string;
  race: string | null;
  class: string | null;
  level: number;
  alignment: string | null;
  status: string;
  imageUrl: string | null;
  maxHp: number;
  ac: number;
  campaign: { id: string; name: string } | null;
  updatedAt: string;
}

interface Props {
  initialCharacters: CharacterItem[];
  campaigns: { id: string; name: string; edition: string }[];
}

type View = "list" | "create-35" | "create-5e";

export default function CharacterList({ initialCharacters, campaigns }: Props) {
  const [view, setView] = useState<View>("list");
  const [characters, setCharacters] = useState(initialCharacters);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Deletar este personagem permanentemente?")) return;
    setDeleting(id);
    try {
      await deleteCharacter(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  }

  if (view !== "list") {
    return (
      <div>
        <button
          className="btn btn-ghost"
          onClick={() => setView("list")}
          style={{ marginBottom: "var(--space-4)" }}
        >
          ← Voltar à Lista
        </button>
        <CharacterCreator
          edition={view === "create-35" ? "3.5" : "5e"}
          campaigns={campaigns}
          onSaved={() => {
            setView("list");
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="char-list-container">
      {/* Edition Tabs + Create */}
      <div className="char-actions-bar">
        <div className="char-create-btns">
          <button className="btn btn-primary" onClick={() => setView("create-35")}>
            ⚔️ Nova Ficha 3.5
          </button>
          <button className="btn btn-secondary" onClick={() => setView("create-5e")}>
            🛡️ Nova Ficha 5e
          </button>
        </div>
      </div>

      {/* Character Cards */}
      {characters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧙</div>
          <h3>Nenhum personagem ainda</h3>
          <p>Crie sua primeira ficha de personagem D&D!</p>
        </div>
      ) : (
        <div className="char-grid">
          {characters.map((char) => (
            <div key={char.id} className="char-card">
              <div className="char-card-header">
                <div className="char-card-avatar">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt="" />
                  ) : (
                    <span className="char-card-avatar-placeholder">
                      {char.edition === "3.5" ? "⚔️" : "🛡️"}
                    </span>
                  )}
                </div>
                <div className="char-card-info">
                  <h3 className="char-card-name">{char.name}</h3>
                  <p className="char-card-meta">
                    {[char.race, char.class, char.level && `Nv.${char.level}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="char-card-badges">
                    <span className={`badge ${char.edition === "3.5" ? "badge-edition-35" : "badge-edition-5e"}`}>
                      {char.edition}
                    </span>
                    {char.campaign && (
                      <span className="badge badge-campaign">{char.campaign.name}</span>
                    )}
                    {char.status === "dead" && (
                      <span className="badge badge-danger">💀 Morto</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="char-card-stats">
                <div className="char-card-stat">
                  <span className="char-card-stat-label">PV</span>
                  <span className="char-card-stat-value">{char.maxHp}</span>
                </div>
                <div className="char-card-stat">
                  <span className="char-card-stat-label">CA</span>
                  <span className="char-card-stat-value">{char.ac}</span>
                </div>
                <div className="char-card-stat">
                  <span className="char-card-stat-label">Nível</span>
                  <span className="char-card-stat-value">{char.level}</span>
                </div>
              </div>
              <div className="char-card-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => router.push(`/ferramentas/personagem/${char.id}`)}
                >
                  📋 Ver Ficha
                </button>
                <button
                  className="btn btn-ghost btn-sm danger"
                  onClick={() => handleDelete(char.id)}
                  disabled={deleting === char.id}
                >
                  {deleting === char.id ? "..." : "🗑️"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
