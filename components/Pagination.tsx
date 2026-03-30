"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-4)", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
        Página {currentPage} de {totalPages} ({totalItems} resultados)
      </div>
      <div style={{ display: "flex", gap: "var(--space-1)" }}>
        {currentPage > 1 && (
          <Link href={createPageUrl(currentPage - 1)} className="btn btn-ghost btn-sm">
            Anterior
          </Link>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((p, i, arr) => {
            const isGap = i > 0 && p - arr[i - 1] > 1;
            return (
              <div key={p} style={{ display: "flex", gap: "var(--space-1)" }}>
                {isGap && <span style={{ padding: "0 var(--space-2)", color: "var(--text-muted)", alignSelf: "center" }}>...</span>}
                <Link
                  href={createPageUrl(p)}
                  className={`btn btn-sm ${p === currentPage ? "btn-primary" : "btn-ghost"}`}
                >
                  {p}
                </Link>
              </div>
            );
          })}

        {currentPage < totalPages && (
          <Link href={createPageUrl(currentPage + 1)} className="btn btn-ghost btn-sm">
            Próxima
          </Link>
        )}
      </div>
    </div>
  );
}
