import * as adminOrderService from "../services/adminOrderService.js";
import * as paymentService from "../services/paymentService.js";
import * as notificationService from "../services/notificationService.js";

export const listAllOrders = async (req, res, next) => {
  try {
    const result = await adminOrderService.getAdminOrders({
      search: req.query.q,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    res.json({
      success: true,
      orders: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const showAdminOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await adminOrderService.getAdminOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const changeOrderStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await adminOrderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    const user = order.user;
    const newStatus = order.status;

    if (user?.email) {
      if (newStatus === "SHIPPED") {
        await notificationService.sendOrderShippedEmail(user, order);
      }

      if (newStatus === "DELIVERED") {
        await notificationService.sendOrderDeliveredEmail(user, order);

        const payment = await paymentService.getPaymentByOrderId(id);

        if (payment?.method === "COD" && payment?.status === "PAID") {
          await notificationService.sendPaymentPaidEmail(user, order, payment);
        }
      }
    }

     res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const showAdminOrderPayment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const payment = await paymentService.getPaymentByOrderId(id);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};
