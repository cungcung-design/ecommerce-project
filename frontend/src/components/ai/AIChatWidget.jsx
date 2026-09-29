import { useCallback, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useAIChat } from "../../context/AIChatContext";
import AIChatPanel from "./AIChatPanel";

const MOBILE_QUERY = "(max-width: 767px)";

export default function AIChatWidget() {
  const { isOpen, openChat, closeChat } = useAIChat();
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(false);

  const closeAndRestoreFocus = useCallback(() => {
    restoreFocusRef.current = true;
    closeChat();
  }, [closeChat]);

  useEffect(() => {
    if (isOpen || !restoreFocusRef.current) {
      return undefined;
    }

    restoreFocusRef.current = false;
    launcherRef.current?.focus();
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        closeAndRestoreFocus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAndRestoreFocus, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const media = window.matchMedia(MOBILE_QUERY);
    const lockScroll = () => {
      if (!media.matches) {
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";
    };

    lockScroll();
    media.addEventListener("change", lockScroll);

    return () => {
      media.removeEventListener("change", lockScroll);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const panel = panelRef.current;

    if (!isOpen || !panel) {
      return undefined;
    }

    const media = window.matchMedia(MOBILE_QUERY);

    const placePanel = () => {
      if (!media.matches || !window.visualViewport) {
        panel.style.height = "";
        panel.style.top = "";
        panel.style.bottom = "";
        return;
      }

      const viewport = window.visualViewport;
      const margin = 8;
      panel.style.top = `${viewport.offsetTop + margin}px`;
      panel.style.bottom = "auto";
      panel.style.height = `${Math.max(240, viewport.height - margin * 2)}px`;
    };

    placePanel();
    window.visualViewport?.addEventListener("resize", placePanel);
    window.visualViewport?.addEventListener("scroll", placePanel);
    media.addEventListener("change", placePanel);

    return () => {
      window.visualViewport?.removeEventListener("resize", placePanel);
      window.visualViewport?.removeEventListener("scroll", placePanel);
      media.removeEventListener("change", placePanel);
      panel.style.height = "";
      panel.style.top = "";
      panel.style.bottom = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="NovaTrend Assistant"
          className="chat-widget-panel fixed z-[60] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 left-[max(0.5rem,env(safe-area-inset-left))] right-[max(0.5rem,env(safe-area-inset-right))] top-[max(0.5rem,env(safe-area-inset-top))] bottom-[max(0.5rem,env(safe-area-inset-bottom))] md:left-auto md:top-auto md:right-4 md:bottom-4 md:h-[min(560px,calc(100dvh-2rem))] md:w-[min(22.5rem,calc(100vw-2rem))] lg:right-6 lg:bottom-6 lg:h-[min(620px,calc(100dvh-3rem))] lg:w-[25rem]"
        >
          <AIChatPanel mode="widget" onClose={closeAndRestoreFocus} />
        </div>
      )}

      {!isOpen && (
        <div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] sm:right-6 sm:bottom-6">
          <button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-label="Chat with us"
            title="Chat with us"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg shadow-orange-600/25 transition-transform duration-150 hover:scale-105 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
              Chat with us
            </span>
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
