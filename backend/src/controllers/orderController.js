import * as orderService from "../services/orderService.js";
import * as paymentService from "../services/paymentService.js";
import * as notificationService from "../services/notificationService.js";

export const storeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(
      req.user.id,
      req.body.shipping,
      req.body.paymentMethod
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });

    const user = req.user;
    if (user?.email) {
      await notificationService.sendOrderCreatedEmail(user, order);
    }
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const showMyOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await orderService.getUserOrderById(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMyOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await orderService.cancelOrder(
      req.user.id,
      req.params.id
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const showMyOrderPayment = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const payment = await paymentService.getPaymentByOrder(
      req.user.id,
      orderId
    );

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};
