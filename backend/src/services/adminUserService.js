import prisma from "../lib/prisma.js";

export const getAllUsers = async ({ search }) => {
  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserRole = async (id, role, currentAdminId) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (Number(id) === currentAdminId) {
    const error = new Error("You cannot change your own admin account role.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id: Number(id) },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const updateUserStatus = async (id, isActive, currentAdminId) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (Number(id) === currentAdminId) {
    const error = new Error("You cannot change your own admin account status.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id: Number(id) },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};
