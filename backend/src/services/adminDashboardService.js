import prisma from "../lib/prisma.js";

export const getDashboardStats = async () => {
  const [
    users,
    products,
    orders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count(),

    prisma.order.count(),

    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },

      where: {
        paymentStatus: "PAID",
      },
    }),

    prisma.order.findMany({
      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    users,
    products,
    orders,

    revenue:
      revenueResult._sum.totalAmount || 0,

    recentOrders,
  };
};
