import AIApprovalCard from "./AIApprovalCard";
import AIOrderCard from "./AIOrderCard";
import AIProductCards from "./AIProductCards";
import AISources from "./AISources";
import AITypingIndicator from "./AITypingIndicator";

export default function AIMessage({ message, streaming, onApprovalComplete, onRetry }) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message-in flex min-w-0 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`min-w-0 max-w-[85%] ${isUser ? "" : "w-full"}`}>
        {!message.content && streaming ? (
          <AITypingIndicator />
        ) : (
          <div
            className={`min-w-0 overflow-hidden break-words rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere] ${
              isUser ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-800"
            }`}
          >
            {message.content}
          </div>
        )}
        {!isUser && (
          <>
            <AIProductCards products={message.products} />
            <AIOrderCard order={message.order} />
            <AISources sources={message.sources} />
            {message.approval && (
              <AIApprovalCard
                approval={message.approval}
                onComplete={(result) => onApprovalComplete(message.id, result)}
              />
            )}
            {message.error && message.retryMessage && onRetry && (
              <button type="button" onClick={onRetry} className="mt-2 text-xs font-medium text-slate-600 underline">
                Retry
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
