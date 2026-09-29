import prisma from "../lib/prisma.js";

export const getInternalOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = Number(req.headers["x-user-id"]);

    if (!Number.isInteger(orderId) || !Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Internal order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get order status",
    });
  }
};

export const getInternalOrderItems = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = Number(req.headers["x-user-id"]);

    if (!Number.isInteger(orderId) || !Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: order.items,
    });
  } catch (error) {
    console.error("Internal order items error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get order items",
    });
  }
};

export const cancelInternalOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = Number(req.headers["x-user-id"]);

    if (!Number.isInteger(orderId) || !Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
      });

      if (!order) {
        return { found: false };
      }

      if (order.status === "CANCELLED") {
        return {
          found: true,
          cancelled: true,
          alreadyCancelled: true,
        };
      }

      if (order.status !== "PENDING") {
        return {
          found: true,
          cancelled: false,
          reason: "Order can no longer be cancelled",
          status: order.status,
        };
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });

      return {
        found: true,
        cancelled: true,
        order: updatedOrder,
      };
    });

    if (!result.found) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Internal cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

export const createInternalSupportTicket = async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const { subject, message } = req.body;

    if (!Number.isInteger(userId) || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Create support ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
    });
  }
};
