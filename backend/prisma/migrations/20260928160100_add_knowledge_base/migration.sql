CREATE TABLE "KnowledgeDocument" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "KnowledgeChunk" (
    "id" SERIAL PRIMARY KEY,
    "documentId" INTEGER NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "KnowledgeChunk_documentId_fkey"
        FOREIGN KEY ("documentId")
        REFERENCES "KnowledgeDocument"("id")
        ON DELETE CASCADE
);

CREATE INDEX "KnowledgeChunk_embedding_hnsw_idx"
ON "KnowledgeChunk"
USING hnsw ("embedding" vector_cosine_ops);

CREATE INDEX "KnowledgeChunk_documentId_idx"
ON "KnowledgeChunk" ("documentId");
