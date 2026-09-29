CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "ProductEmbedding" (
    "productId" INTEGER NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductEmbedding_pkey" PRIMARY KEY ("productId")
);

CREATE INDEX "ProductEmbedding_embedding_hnsw_idx"
ON "ProductEmbedding"
USING hnsw ("embedding" vector_cosine_ops);

ALTER TABLE "ProductEmbedding"
ADD CONSTRAINT "ProductEmbedding_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
