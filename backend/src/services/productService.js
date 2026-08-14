import prisma from "../lib/prisma.js";
import cloudinary from "../config/cloudinary.js";

export const getProducts = async ({ search, category, categoryId, page, limit, includeInactive, isActive, sort }) => {
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 12;
  const skip = (currentPage - 1) * pageSize;

  const where = {};

  if (isActive !== undefined && isActive !== "") {
    where.isActive = isActive === "true";
  } else if (!includeInactive) {
    where.isActive = true;
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (category) {
    where.category = { name: category };
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  const orderBy = { createdAt: "desc" };

  if (sort === "newest") {
    orderBy.createdAt = "desc";
  } else if (sort === "best-selling") {
    orderBy.id = "desc";
  } else if (sort === "price-asc") {
    orderBy.price = "asc";
  } else if (sort === "price-desc") {
    orderBy.price = "desc";
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: pageSize,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getProductById = async (id, includeInactive = false) => {
  const where = { id: Number(id) };

  if (!includeInactive) {
    where.isActive = true;
  }

  const product = await prisma.product.findUnique({
    where,
    include: { category: true },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const createProduct = async (data) => {
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: Number(data.categoryId) },
    });

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      imageUrl: data.imageUrl || null,
      imagePublicId: data.imagePublicId || null,
    },
    include: { category: true },
  });
};

export const updateProduct = async (id, data) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: { imageUrl: true, imagePublicId: true },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: Number(data.categoryId) },
    });

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  let finalImageUrl = existingProduct.imageUrl;
  let finalImagePublicId = existingProduct.imagePublicId;

  if (data.imageUrl !== undefined) {
    if (data.imageUrl && existingProduct.imagePublicId && existingProduct.imagePublicId !== data.imagePublicId) {
      await cloudinary.uploader.destroy(existingProduct.imagePublicId);
    }

    if (!data.imageUrl && existingProduct.imagePublicId) {
      await cloudinary.uploader.destroy(existingProduct.imagePublicId);
    }

    finalImageUrl = data.imageUrl || null;
    finalImagePublicId = data.imagePublicId || null;
  }

  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.stock !== undefined) updateData.stock = Number(data.stock);
  if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  updateData.imageUrl = finalImageUrl;
  updateData.imagePublicId = finalImagePublicId;

  return prisma.product.update({
    where: { id: Number(id) },
    data: updateData,
    include: { category: true },
  });
};

export const deleteProduct = async (id) => {
  const productId = Number(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { imagePublicId: true },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  // Never destroy order history: products referenced by past orders
  // cannot be hard-deleted.
  const orderItemCount = await prisma.orderItem.count({
    where: { productId },
  });

  if (orderItemCount > 0) {
    const error = new Error(
      "Cannot delete this product because it is part of existing orders."
    );
    error.statusCode = 409;
    throw error;
  }

  // Best-effort cleanup: a Cloudinary failure (e.g. missing/invalid
  // credentials) must never prevent the product from being deleted.
  if (product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (error) {
      console.warn(
        `Failed to delete Cloudinary image for product ${id}:`,
        error.message
      );
    }
  }

  // Remove the product and any transient cart references atomically.
  return prisma.$transaction([
    prisma.cartItem.deleteMany({
      where: { productId },
    }),
    prisma.product.delete({
      where: { id: productId },
    }),
  ]);
};

export const updateProductStatus = async (id, isActive) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: { isActive: Boolean(isActive) },
  });
};
