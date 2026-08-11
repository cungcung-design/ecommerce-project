import prisma from "../lib/prisma.js";

export const getAdminCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

export const getAdminCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const createAdminCategory = async (name) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.create({
    data: { name },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

export const updateAdminCategory = async (id, name) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory && existingCategory.id !== Number(id)) {
    const error = new Error("Category name already taken");
    error.statusCode = 409;
    throw error;
  }

  return prisma.category.update({
    where: { id: Number(id) },
    data: { name },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

export const updateAdminCategoryStatus = async (id, isActive) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.category.update({
    where: { id: Number(id) },
    data: { isActive: Boolean(isActive) },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

export const deleteAdminCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  if (category._count.products > 0) {
    const error = new Error("Cannot delete category with existing products");
    error.statusCode = 400;
    throw error;
  }

  return prisma.category.delete({
    where: { id: Number(id) },
  });
};
