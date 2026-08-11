import {
  getAdminDashboard,
} from "../services/adminDashboardService.js";

import prisma from "../lib/prisma.js";

export const getAdminDashboardController =
  async (req, res, next) => {
    try {
      const dashboard =
        await getAdminDashboard();

      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  };

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};
