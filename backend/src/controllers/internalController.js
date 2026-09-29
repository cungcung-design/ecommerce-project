import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { getProducts } from "../services/productService.js";

const isEmbedding = (embedding) =>
  Array.isArray(embedding) &&
  embedding.length === 1536 &&
  embedding.every((value) => typeof value === "number" && Number.isFinite(value));

export const internalProductSearch = async (req, res) => {
  try {
    const { search, categoryId, maxPrice } = req.query;

    const result = await getProducts({
      search,
      categoryId,
      maxPrice,
    });

    return res.json({
      success: true,
      data: result.products,
    });
  } catch (error) {
    console.error("Internal product search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};

export const getEmbeddingSources = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Embedding source error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load products",
    });
  }
};

export const upsertProductEmbeddings = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items must be an array",
      });
    }

    for (const item of items) {
      const { productId, embedding } = item;

      if (!Number.isInteger(productId) || !isEmbedding(embedding)) {
        return res.status(400).json({
          success: false,
          message: "Invalid embedding payload",
        });
      }

      const vector = `[${embedding.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "ProductEmbedding"
          ("productId", "embedding", "updatedAt")
        VALUES
          (
            ${productId},
            ${vector}::vector,
            CURRENT_TIMESTAMP
          )
        ON CONFLICT ("productId")
        DO UPDATE SET
          "embedding" = EXCLUDED."embedding",
          "updatedAt" = CURRENT_TIMESTAMP
      `;
    }

    return res.json({
      success: true,
      message: "Embeddings saved",
      count: items.length,
    });
  } catch (error) {
    console.error("Embedding upsert error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save embeddings",
    });
  }
};

export const semanticProductSearch = async (req, res) => {
  try {
    const { embedding, maxPrice, limit = 10 } = req.body;

    if (!isEmbedding(embedding)) {
      return res.status(400).json({
        success: false,
        message: "Invalid embedding",
      });
    }

    const vector = `[${embedding.join(",")}]`;
    const priceFilter =
      maxPrice !== undefined && maxPrice !== null
        ? Prisma.sql`AND p.price <= ${Number(maxPrice)}`
        : Prisma.empty;

    const products = await prisma.$queryRaw`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p."imageUrl",
        1 - (pe.embedding <=> ${vector}::vector) AS similarity
      FROM "ProductEmbedding" pe
      JOIN "Product" p
        ON p.id = pe."productId"
      WHERE p."isActive" = true
      ${priceFilter}
      ORDER BY pe.embedding <=> ${vector}::vector
      LIMIT ${Number(limit)}
    `;

    return res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Semantic search error:", error);

    return res.status(500).json({
      success: false,
      message: "Semantic search failed",
    });
  }
};

export const getInternalProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Internal get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get product",
    });
  }
};

export const getInternalInventory = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: {
        productId: product.id,
        productName: product.name,
        stock: product.stock,
        inStock: product.stock > 0,
      },
    });
  } catch (error) {
    console.error("Inventory lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get inventory",
    });
  }
};
