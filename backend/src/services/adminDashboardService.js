import prisma from "../lib/prisma.js";

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalProducts,
    activeProducts,
    totalOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.product.count(),

    prisma.product.count({
      where: {
        isActive: true,
      },
    }),

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
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      totalUsers,
      totalProducts,
      activeProducts,
      totalOrders,

      totalRevenue:
        revenueResult._sum.totalAmount
          ? Number(revenueResult._sum.totalAmount)
          : 0,
    },

    recentOrders,
  };
};
