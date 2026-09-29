import prisma from "../lib/prisma.js";

const isEmbedding = (embedding) =>
  Array.isArray(embedding) &&
  embedding.length === 1536 &&
  embedding.every((value) => typeof value === "number" && Number.isFinite(value));

export const createKnowledgeDocument = async (req, res) => {
  try {
    const { title, source } = req.body;

    const document = await prisma.knowledgeDocument.create({
      data: {
        title,
        source,
      },
    });

    return res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Create knowledge document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create document",
    });
  }
};

export const saveKnowledgeChunks = async (req, res) => {
  try {
    const { documentId, chunks } = req.body;

    if (!Number.isInteger(documentId) || !Array.isArray(chunks)) {
      return res.status(400).json({
        success: false,
        message: "Invalid knowledge payload",
      });
    }

    for (const chunk of chunks) {
      if (
        typeof chunk.chunkIndex !== "number" ||
        typeof chunk.content !== "string" ||
        !isEmbedding(chunk.embedding)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid chunk data",
        });
      }

      const vector = `[${chunk.embedding.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk"
        (
          "documentId",
          "chunkIndex",
          "content",
          "embedding"
        )
        VALUES (
          ${documentId},
          ${chunk.chunkIndex},
          ${chunk.content},
          ${vector}::vector
        )
      `;
    }

    return res.json({
      success: true,
      count: chunks.length,
    });
  } catch (error) {
    console.error("Save knowledge chunks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save chunks",
    });
  }
};

export const searchKnowledge = async (req, res) => {
  try {
    const { embedding, limit = 5 } = req.body;

    if (!isEmbedding(embedding)) {
      return res.status(400).json({
        success: false,
        message: "Invalid embedding",
      });
    }

    const vector = `[${embedding.join(",")}]`;

    const results = await prisma.$queryRaw`
      SELECT
        kc.id,
        kc.content,
        kd.title,
        kd.source,
        1 - (kc.embedding <=> ${vector}::vector) AS similarity
      FROM "KnowledgeChunk" kc
      JOIN "KnowledgeDocument" kd
        ON kd.id = kc."documentId"
      ORDER BY kc.embedding <=> ${vector}::vector
      LIMIT ${Number(limit)}
    `;

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Knowledge search error:", error);

    return res.status(500).json({
      success: false,
      message: "Knowledge search failed",
    });
  }
};
