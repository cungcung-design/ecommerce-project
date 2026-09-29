import { createContext, useContext, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const AIChatContext = createContext(null);

export function AIChatProvider({ children }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(null);

  const productId = useMemo(() => {
    const match = pathname.match(/^\/products\/(\d+)$/);
    return match ? Number(match[1]) : null;
  }, [pathname]);

  const value = useMemo(() => ({
    isOpen,
    productId,
    pendingPrompt,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    ask: (text) => {
      setIsOpen(true);
      setPendingPrompt({ text, nonce: Date.now() });
    },
    consumePrompt: () => {
      setPendingPrompt(null);
    },
  }), [isOpen, pendingPrompt, productId]);

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);

  if (!context) {
    throw new Error("useAIChat must be used inside AIChatProvider");
  }

  return context;
}
