import * as orderService from "../services/orderService.js";

export const storeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
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
