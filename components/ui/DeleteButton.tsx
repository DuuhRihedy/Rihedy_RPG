"use client";

import { useState, useTransition } from "react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  entityName: string;
  className?: string;
}

export function DeleteButton({ action, entityName, className }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await action();
    });
  }

  if (!showConfirm) {
    return (
      <button
        type="button"
        className={className || "btn btn-ghost btn-sm btn-danger-text"}
        onClick={() => setShowConfirm(true)}
      >
        🗑️ Excluir
      </button>
    );
  }

  return (
    <div className="delete-confirm-inline">
      <span className="delete-confirm-text">
        Excluir <strong>{entityName}</strong>?
      </span>
      <div className="delete-confirm-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "⏳ Excluindo..." : "✕ Confirmar"}
        </button>
      </div>
    </div>
  );
}
