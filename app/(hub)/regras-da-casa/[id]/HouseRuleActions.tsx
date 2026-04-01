"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteHouseRule, togglePinHouseRule } from "@/lib/actions/house-rules";
import { useAuth } from "@/lib/AuthContext";

export default function HouseRuleActions({
  ruleId,
  pinned,
}: {
  ruleId: string;
  pinned: boolean;
}) {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [confirming, setConfirming] = useState(false);

  if (!isAdmin) return null;

  async function handleDelete() {
    await deleteHouseRule(ruleId);
  }

  async function handleTogglePin() {
    await togglePinHouseRule(ruleId);
  }

  return (
    <div className="regra-detail-actions">
      <Link href={`/regras-da-casa/${ruleId}/editar`} className="btn btn-primary btn-sm">
        ✏️ Editar
      </Link>
      <button onClick={handleTogglePin} className="btn btn-secondary btn-sm">
        {pinned ? "📌 Desafixar" : "📌 Fixar no Topo"}
      </button>

      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="btn btn-ghost btn-sm btn-danger-text">
          🗑️ Excluir
        </button>
      ) : (
        <div className="delete-confirm-inline">
          <span className="delete-confirm-text">Tem certeza?</span>
          <div className="delete-confirm-actions">
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              Sim, excluir
            </button>
            <button onClick={() => setConfirming(false)} className="btn btn-ghost btn-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
