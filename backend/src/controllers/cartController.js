import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService.js";

export const showCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const item = await addCartItem(
      req.user.id,
      req.body.productId,
      req.body.quantity
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await updateCartItem(
      req.user.id,
      Number(req.params.productId),
      req.body.quantity
    );

    res.json({
      success: true,
      message: "Cart updated",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    await removeCartItem(
      req.user.id,
      Number(req.params.productId)
    );

    res.json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    await clearCart(req.user.id);

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    next(error);
  }
};
