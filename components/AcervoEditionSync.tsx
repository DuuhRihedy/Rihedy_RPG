"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEdition } from "@/lib/EditionContext";

// Sincroniza a edição global com o query param "edition" nas páginas do acervo
export default function AcervoEditionSync() {
  const { edition } = useEdition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentEdition = searchParams.get("edition");

  useEffect(() => {
    // Se não tem edição no URL, adiciona a edição global
    if (!currentEdition && pathname.startsWith("/acervo/")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("edition", edition);
      router.replace(`${pathname}?${params.toString()}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
