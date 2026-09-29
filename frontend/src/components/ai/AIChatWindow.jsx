import { useEffect, useRef } from "react";
import { ArrowUp, Square } from "lucide-react";
import AIMessage from "./AIMessage";

const SUGGESTIONS = [
  "Find headphones under $100",
  "Where is my order?",
  "What is your return policy?",
];

export default function AIChatWindow({
  messages,
  streaming,
  status,
  input,
  onInput,
  onSend,
  onStop,
  error,
  onRetry,
  onApprovalComplete,
  suggestions = SUGGESTIONS,
  onSuggest,
  autoFocus = false,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, streaming, status]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" role="log" aria-live="polite" aria-relevant="additions">
        {messages.length === 0 && (
          <div>
            <p className="text-sm font-medium text-slate-800">NovaTrend AI</p>
            <p className="mt-1 text-sm text-slate-500">
              Ask about products, orders, shipping, and returns.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggest(suggestion)}
                  disabled={streaming}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-left text-xs text-slate-600 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <AIMessage
            key={message.id}
            message={message}
            streaming={streaming && index === messages.length - 1 && message.role === "assistant"}
            onApprovalComplete={onApprovalComplete}
            onRetry={onRetry}
          />
        ))}
        <div ref={endRef} />
      </div>

      {status && streaming && (
        <p className="px-4 text-xs text-slate-500">{status}</p>
      )}

      {error && (
        <div className="px-4 pb-1">
          <p className="text-sm text-rose-600">{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="mt-1 text-xs font-medium text-slate-700 underline">
              Retry
            </button>
          )}
        </div>
      )}

      <form
        className="flex shrink-0 items-end gap-2 border-t border-slate-100 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(input);
        }}
      >
        <label className="sr-only" htmlFor="ai-message">Ask NovaTrend AI</label>
        <textarea
          id="ai-message"
          rows={1}
          value={input}
          autoFocus={autoFocus}
          onChange={(event) => onInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (input.trim() && !streaming) {
                onSend(input);
              }
            }
          }}
          placeholder="Type your message..."
          className="max-h-28 min-h-12 min-w-0 flex-1 resize-none overflow-y-auto rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/30"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop response"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}
