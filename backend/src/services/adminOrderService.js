import prisma from "../lib/prisma.js";

const allowedTransitions = {
  PENDING: ["CONFIRMED", "PROCESSING", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const getAdminOrders = async ({
  search,
  status,
  page,
  limit,
}) => {
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (currentPage - 1) * pageSize;

  const where = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.user = {
      OR: [
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
      ],
    };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getAdminOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const allowed = allowedTransitions[order.status] ?? [];

  if (!allowed.includes(status)) {
    const error = new Error(
      `Cannot change ${order.status} to ${status}`
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: Number(orderId) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    await syncPaymentForOrderStatus(tx, order, status);

    return updated;
  });
};

const syncPaymentForOrderStatus = async (tx, order, newStatus) => {
  const payment = await tx.payment.findUnique({
    where: { orderId: order.id },
  });

  if (!payment) {
    return;
  }

  if (newStatus === "DELIVERED" && payment.method === "COD" && payment.status === "PENDING") {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID" },
    });

    await tx.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", paymentReference: "COD_PAID" },
    });
  }

  if (newStatus === "CANCELLED" && payment.status === "PENDING") {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    await tx.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
  }
};

export { allowedTransitions };
