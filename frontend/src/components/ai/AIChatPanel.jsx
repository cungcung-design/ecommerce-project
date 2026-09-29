import { useCallback, useEffect, useRef, useState } from "react";
import { History, Minus, X } from "lucide-react";
import { useAIChat } from "../../context/AIChatContext";
import { useNotification } from "../../context/NotificationContext";
import { streamAIChat, friendlyAiError } from "../../services/aiChat";
import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  renameConversation,
} from "../../services/aiConversations";
import AIChatWindow from "./AIChatWindow";
import AIConversationList from "./AIConversationList";

function mapMessage(message) {
  const metadata = message.metadata || {};

  return {
    id: message.id,
    role: message.role,
    content: message.content || "",
    products: metadata.products,
    order: metadata.order,
    sources: metadata.sources,
    approval: metadata.approval,
  };
}

export default function AIChatPanel({ mode = "widget", onClose }) {
  const { pendingPrompt, consumePrompt, productId } = useAIChat();
  const { confirm } = useNotification();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const conversationIdRef = useRef(null);
  const sendRef = useRef(null);
  const abortRef = useRef(null);
  const sendingRef = useRef(false);
  const restoredRef = useRef(false);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const refreshConversations = useCallback(async () => {
    const response = await getConversations();
    const list = response.data || [];
    setConversations(list);
    return list;
  }, []);

  useEffect(() => {
    refreshConversations()
      .then(async (list) => {
        if (restoredRef.current || conversationIdRef.current || !list[0]) {
          return;
        }

        restoredRef.current = true;
        const response = await getConversation(list[0].id);
        const conversation = response.data;

        if (conversationIdRef.current) {
          return;
        }

        setConversationId(conversation.id);
        conversationIdRef.current = conversation.id;
        setMessages((conversation.messages || []).map(mapMessage));
      })
      .catch(() => {
        setError("Could not load previous chats.");
      });
  }, [refreshConversations]);

  useEffect(() => () => {
    abortRef.current?.abort();
  }, []);

  const updateAssistant = (assistantId, updater) => {
    setMessages((previous) => previous.map((item) => (
      item.id === assistantId ? updater(item) : item
    )));
  };

  const sendMessage = useCallback(async (rawText) => {
    const text = rawText.trim();

    if (!text || sendingRef.current) {
      return;
    }

    sendingRef.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setInput("");
    setError("");
    setStatus("");

    let activeId = conversationIdRef.current;

    try {
      if (!activeId) {
        const created = await createConversation();
        activeId = created.data.id;
        conversationIdRef.current = activeId;
        setConversationId(activeId);
      }
    } catch {
      setError("Could not start a chat.");
      setInput(text);
      sendingRef.current = false;
      return;
    }

    const assistantId = crypto.randomUUID();

    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setStreaming(true);

    await streamAIChat({
      message: text,
      conversationId: activeId,
      productId,
      signal: controller.signal,
      onToken: (token) => {
        updateAssistant(assistantId, (item) => ({
          ...item,
          content: `${item.content}${token}`,
        }));
      },
      onProducts: (products) => {
        updateAssistant(assistantId, (item) => ({ ...item, products }));
      },
      onOrder: (order) => {
        updateAssistant(assistantId, (item) => ({ ...item, order }));
      },
      onSources: (sources) => {
        updateAssistant(assistantId, (item) => ({ ...item, sources }));
      },
      onApproval: (approval) => {
        updateAssistant(assistantId, (item) => ({
          ...item,
          approval: {
            id: approval.approval_id,
            tool: approval.tool,
            data: approval.data,
            expires_at: approval.expires_at,
          },
        }));
      },
      onStatus: (messageText) => {
        setStatus(messageText || "");
      },
      onDone: () => {
        sendingRef.current = false;
        setStreaming(false);
        setStatus("");
        refreshConversations().catch(() => {});
      },
      onError: (messageText) => {
        sendingRef.current = false;
        setStreaming(false);
        setStatus("");
        const friendly = friendlyAiError(messageText);
        setError(friendly);
        updateAssistant(assistantId, (item) => ({
          ...item,
          error: true,
          retryMessage: text,
          content: item.content || friendly,
        }));
      },
    });
  }, [productId, refreshConversations]);

  useEffect(() => {
    sendRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    if (!pendingPrompt?.text) {
      return;
    }

    const text = pendingPrompt.text;
    consumePrompt();
    sendRef.current?.(text);
  }, [consumePrompt, pendingPrompt]);

  const openConversation = async (id) => {
    if (streaming) {
      return;
    }

    const response = await getConversation(id);
    const conversation = response.data;
    setConversationId(conversation.id);
    conversationIdRef.current = conversation.id;
    setMessages((conversation.messages || []).map(mapMessage));
    setShowHistory(false);
    setError("");
  };

  const startNewConversation = async () => {
    if (streaming) {
      return;
    }

    const created = await createConversation();
    setConversationId(created.data.id);
    conversationIdRef.current = created.data.id;
    setMessages([]);
    setError("");
    setShowHistory(false);
    refreshConversations().catch(() => {});
  };

  const rename = async (id, title) => {
    await renameConversation(id, title);
    await refreshConversations();
  };

  const remove = async (id) => {
    const conversation = conversations.find((item) => item.id === id);
    const title = conversation?.title?.trim() || "New conversation";
    const confirmed = await confirm({
      title: "Delete chat?",
      message: `"${title}" will be permanently removed from your history.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) {
      return;
    }

    setHistoryError("");

    try {
      await deleteConversation(id);

      if (conversationIdRef.current === id) {
        setConversationId(null);
        conversationIdRef.current = null;
        setMessages([]);
      }

      await refreshConversations();
    } catch {
      setHistoryError("Couldn't delete this chat. Please try again.");
    }
  };

  const handleApprovalComplete = (messageId, result) => {
    setMessages((previous) => previous.map((item) => {
      if (item.id !== messageId) {
        return item;
      }

      return {
        ...item,
        approval: null,
        content: item.content
          ? `${item.content}\n\n${result.message}`
          : result.message,
      };
    }));
  };

  const productSuggestions = productId
    ? [
        "Is this good for gaming?",
        "Does it have warranty?",
        "Show me something cheaper.",
        "What are similar products?",
      ]
    : undefined;

  return (
      <section
      className={`relative flex min-h-0 overflow-hidden bg-white ${
        mode === "page"
          ? "h-[72vh] w-full rounded-2xl border border-slate-200"
          : "h-full"
      }`}
      aria-label="NovaTrend AI"
    >
      {(showHistory || mode === "page") && (
        <div className={mode === "page"
          ? `${showHistory ? "absolute inset-0 z-10 flex" : "hidden"} bg-white sm:static sm:z-auto sm:flex sm:w-auto`
          : "absolute inset-0 z-10 flex min-w-0 bg-white"}
        >
          <AIConversationList
            conversations={conversations}
            activeId={conversationId}
            onSelect={openConversation}
            onNew={startNewConversation}
            onRename={rename}
            onDelete={remove}
            error={historyError}
          />
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className={`rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                mode === "page" ? "sm:hidden" : ""
              }`}
              aria-label="Previous chats"
              onClick={() => setShowHistory((open) => !open)}
            >
              <History className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {mode === "widget" ? "NovaTrend Assistant" : "NovaTrend AI"}
              </p>
              <p className="truncate text-xs text-slate-400">Products, orders, and policies</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onClose && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Minimize chat"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close chat"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </header>

        <AIChatWindow
          messages={messages}
          streaming={streaming}
          status={status}
          input={input}
          onInput={setInput}
          onSend={sendMessage}
          onStop={() => {
            abortRef.current?.abort();
            abortRef.current = null;
            sendingRef.current = false;
            setStreaming(false);
            setStatus("");
          }}
          error={error}
          onRetry={() => {
            const failed = [...messages].reverse().find((item) => item.retryMessage);
            if (failed?.retryMessage) {
              sendMessage(failed.retryMessage);
            }
          }}
          onApprovalComplete={handleApprovalComplete}
          suggestions={productSuggestions}
          onSuggest={sendMessage}
          autoFocus={mode === "widget"}
        />
      </div>
    </section>
  );
}
