"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Edition = "3.5" | "5e";

interface EditionContextType {
  edition: Edition;
  setEdition: (e: Edition) => void;
}

const EditionContext = createContext<EditionContextType>({
  edition: "3.5",
  setEdition: () => {},
});

export function EditionProvider({ children }: { children: ReactNode }) {
  const [edition, setEditionState] = useState<Edition>("3.5");

  useEffect(() => {
    const saved = localStorage.getItem("hub-rpg-edition") as Edition | null;
    if (saved === "3.5" || saved === "5e") {
      setEditionState(saved);
    }
  }, []);

  function setEdition(e: Edition) {
    setEditionState(e);
    localStorage.setItem("hub-rpg-edition", e);
  }

  return (
    <EditionContext.Provider value={{ edition, setEdition }}>
      {children}
    </EditionContext.Provider>
  );
}

export function useEdition() {
  return useContext(EditionContext);
}
