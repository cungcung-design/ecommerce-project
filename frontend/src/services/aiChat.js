const apiBase = import.meta.env.VITE_API_URL || "/api";

export async function streamAIChat({
  message,
  conversationId,
  productId,
  signal,
  onToken,
  onProducts,
  onOrder,
  onSources,
  onApproval,
  onStatus,
  onDone,
  onError,
}) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        product_id: productId ?? null,
      }),
      signal,
    });

    if (!response.ok) {
      let messageText = "AI request failed";

      try {
        const data = await response.json();
        messageText = data.message || messageText;
      } catch {
        messageText = "AI request failed";
      }

      throw new Error(messageText);
    }

    if (!response.body) {
      throw new Error("Streaming not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        const lines = event.split("\n");
        const eventType = lines
          .find((line) => line.startsWith("event:"))
          ?.replace("event:", "")
          .trim();
        const dataLine = lines.find((line) => line.startsWith("data:"));

        if (!dataLine) {
          continue;
        }

        const data = JSON.parse(dataLine.replace("data:", "").trim());

        if (eventType === "token") {
          onToken?.(data.text);
        } else if (eventType === "products") {
          onProducts?.(data.products || []);
        } else if (eventType === "order") {
          onOrder?.(data.order);
        } else if (eventType === "sources") {
          onSources?.(data.sources || []);
        } else if (eventType === "approval_required") {
          onApproval?.(data);
        } else if (eventType === "status") {
          onStatus?.(data.message);
        } else if (eventType === "done") {
          onDone?.();
        } else if (eventType === "error") {
          onError?.(data.message);
        }
      }
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    onError?.("Something went wrong. Please try again in a moment.");
  }
}

export function friendlyAiError(message) {
  const text = String(message || "").toLowerCase();

  if (text.includes("unavailable") || text.includes("ai request failed")) {
    return "The assistant is temporarily unavailable.";
  }

  if (text.includes("timeout") || text.includes("too long")) {
    return "That took too long. Please try again.";
  }

  if (text.includes("network") || text.includes("interrupt") || text.includes("failed to fetch")) {
    return "Your connection was interrupted.";
  }

  return "I couldn't complete that request.";
}
