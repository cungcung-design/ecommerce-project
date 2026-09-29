CREATE TYPE "AiRequestStatus" AS ENUM ('SUCCESS', 'ERROR', 'BLOCKED', 'APPROVAL_REQUIRED');

CREATE TABLE "AiRequestLog" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "conversationId" TEXT,
    "agent" TEXT,
    "tool" TEXT,
    "status" "AiRequestStatus" NOT NULL,
    "latencyMs" INTEGER,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "totalTokens" INTEGER,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRequestLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiRequestLog_createdAt_idx" ON "AiRequestLog"("createdAt");
CREATE INDEX "AiRequestLog_agent_idx" ON "AiRequestLog"("agent");
CREATE INDEX "AiRequestLog_tool_idx" ON "AiRequestLog"("tool");
CREATE INDEX "AiRequestLog_status_idx" ON "AiRequestLog"("status");
