import * as adminOrderService from "../services/adminOrderService.js";

export const listAllOrders = async (req, res, next) => {
  try {
    const orders = await adminOrderService.getAllOrders();

    res.json({
      success: true,
      orders,
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
    const order = await adminOrderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    next(error);
  }
};
