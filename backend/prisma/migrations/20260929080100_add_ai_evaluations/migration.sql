CREATE TABLE "AiEvaluationRun" (
    "id" SERIAL PRIMARY KEY,
    "datasetId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AiEvaluationCase" (
    "id" SERIAL PRIMARY KEY,
    "runId" INTEGER NOT NULL,
    "caseId" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "agentCorrect" BOOLEAN NOT NULL,
    "toolCorrect" BOOLEAN NOT NULL,
    "answerScore" DOUBLE PRECISION,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiEvaluationCase_runId_fkey"
        FOREIGN KEY ("runId")
        REFERENCES "AiEvaluationRun"("id")
        ON DELETE CASCADE
);

CREATE INDEX "AiEvaluationCase_runId_idx"
ON "AiEvaluationCase" ("runId");
