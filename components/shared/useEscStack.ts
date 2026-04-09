// Hook ESC hierarquico compartilhado — fecha modais na ordem LIFO
// Fluxo: modal aberto → ESC fecha modal mais recente → se nenhum modal → onExit (volta ao lobby)

import { useEffect, useRef, useCallback } from "react";

type EscLayer = {
  id: string;
  close: () => void;
};

export function useEscStack(onExit: () => void) {
  const stackRef = useRef<EscLayer[]>([]);

  const push = useCallback((id: string, close: () => void) => {
    stackRef.current = stackRef.current.filter(l => l.id !== id);
    stackRef.current.push({ id, close });
  }, []);

  const pop = useCallback((id: string) => {
    stackRef.current = stackRef.current.filter(l => l.id !== id);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      e.preventDefault();

      const stack = stackRef.current;
      if (stack.length > 0) {
        const top = stack[stack.length - 1];
        top.close();
        stackRef.current = stack.filter(l => l.id !== top.id);
      } else {
        onExit();
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onExit]);

  return { push, pop };
}
