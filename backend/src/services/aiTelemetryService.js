import prisma from "../lib/prisma.js";

export async function recordAiTurn({
  userId,
  conversationId,
  tools = [],
  status,
  latencyMs,
  usage,
  errorCode,
}) {
  const tokens = {
    inputTokens: usage?.input ?? null,
    outputTokens: usage?.output ?? null,
    totalTokens: usage?.total ?? null,
  };

  const rows = tools.length
    ? tools.map((tool, index) => {
        const last = index === tools.length - 1;

        return {
          userId,
          conversationId,
          agent: tool.agent || null,
          tool: tool.tool || null,
          status: last && status === "ERROR" ? "ERROR" : tool.status || "SUCCESS",
          latencyMs: last ? latencyMs : null,
          errorCode: last ? errorCode || null : null,
          ...(last ? tokens : {}),
        };
      })
    : [{
        userId,
        conversationId,
        status,
        latencyMs,
        errorCode: errorCode || null,
        ...tokens,
      }];

  await prisma.aiRequestLog.createMany({ data: rows });
}
