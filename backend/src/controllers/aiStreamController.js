import { getProductById } from "../services/productService.js";
import {
  addMessage,
  getConversation,
  getRecentMessages,
} from "../services/aiConversationService.js";
import { recordAiTurn } from "../services/aiTelemetryService.js";

function parseSseEvent(raw) {
  const lines = raw.split("\n");
  const eventType = lines
    .find((line) => line.startsWith("event:"))
    ?.slice(6)
    .trim();
  const dataLine = lines.find((line) => line.startsWith("data:"));

  if (!dataLine) {
    return null;
  }

  try {
    return {
      eventType,
      data: JSON.parse(dataLine.slice(5).trim()),
    };
  } catch {
    return null;
  }
}

async function loadProductContext(productId) {
  if (!productId) {
    return null;
  }

  try {
    const product = await getProductById(productId);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category: product.category?.name || null,
    };
  } catch {
    return null;
  }
}

export const streamAIChat = async (req, res, next) => {
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
  const conversationId = req.body.conversation_id;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required.",
    });
  }

  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Conversation is required.",
    });
  }

  let startedAt = null;
  let recorded = false;

  try {
    const conversation = await getConversation(req.user.id, conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const priorMessages = await getRecentMessages(req.user.id, conversationId, 12);
    const productContext = await loadProductContext(req.body.product_id);

    await addMessage(req.user.id, conversationId, {
      role: "user",
      content: message,
      title: conversation.title ? undefined : message.slice(0, 40),
    });

    startedAt = Date.now();
    const toolEvents = [];
    let usage = null;
    let requestStatus = "SUCCESS";
    let errorCode = null;

    const response = await fetch(`${process.env.AI_SERVICE_URL}/api/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
        "x-user-id": String(req.user.id),
        "x-request-id": req.requestId,
      },
      body: JSON.stringify({
        message,
        conversation_messages: priorMessages,
        product_context: productContext,
      }),
    });

    if (!response.ok || !response.body) {
      await recordAiTurn({
        userId: req.user.id,
        conversationId,
        status: "ERROR",
        latencyMs: Date.now() - startedAt,
        errorCode: "AI_UNAVAILABLE",
      }).catch(() => {});
      recorded = true;

      return res.status(502).json({
        success: false,
        message: "AI service unavailable",
      });
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = response.body.getReader();
    let assistantText = "";
    const metadata = {};
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        res.write(Buffer.from(value));
        buffer += Buffer.from(value).toString("utf8");
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const raw of events) {
          const parsed = parseSseEvent(raw);

          if (!parsed) {
            continue;
          }

          if (parsed.eventType === "token" && parsed.data.text) {
            assistantText += parsed.data.text;
          } else if (parsed.eventType === "products") {
            metadata.products = parsed.data.products;
          } else if (parsed.eventType === "order") {
            metadata.order = parsed.data.order;
          } else if (parsed.eventType === "sources") {
            metadata.sources = parsed.data.sources;
          } else if (parsed.eventType === "approval_required") {
            metadata.approval = {
              id: parsed.data.approval_id,
              tool: parsed.data.tool,
              data: parsed.data.data,
              expires_at: parsed.data.expires_at,
            };
          } else if (parsed.eventType === "tool") {
            toolEvents.push({
              agent: parsed.data.agent,
              tool: parsed.data.tool,
              status: parsed.data.status || "SUCCESS",
            });
          } else if (parsed.eventType === "usage") {
            usage = {
              input: parsed.data.input,
              output: parsed.data.output,
              total: parsed.data.total,
            };
          } else if (parsed.eventType === "error") {
            requestStatus = "ERROR";
            errorCode = "AI_ERROR";
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (assistantText || Object.keys(metadata).length > 0) {
      await addMessage(req.user.id, conversationId, {
        role: "assistant",
        content: assistantText,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });
    }

    await recordAiTurn({
      userId: req.user.id,
      conversationId,
      tools: toolEvents,
      status: requestStatus,
      latencyMs: Date.now() - startedAt,
      usage,
      errorCode,
    }).catch((error) => {
      console.error("AI telemetry error:", error.message);
    });
    recorded = true;

    res.end();
  } catch (error) {
    console.error("AI stream proxy error:", error.message);

    if (startedAt && !recorded) {
      await recordAiTurn({
        userId: req.user.id,
        conversationId,
        status: "ERROR",
        latencyMs: Date.now() - startedAt,
        errorCode: "AI_ERROR",
      }).catch(() => {});
    }

    if (!res.headersSent) {
      next(error);
    } else {
      res.end();
    }
  }
};
