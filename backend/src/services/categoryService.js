import prisma from "../lib/prisma.js";

export const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      products: {
        where: { isActive: true },
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

export const createCategory = async (name) => {
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
  });
};

export const updateCategory = async (id, name) => {
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
  });
};

export const deleteCategory = async (id) => {
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
