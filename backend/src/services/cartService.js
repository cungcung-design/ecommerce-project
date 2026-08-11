import prisma from "../lib/prisma.js";

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  return cart;
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
};

export const addCartItem = async (userId, productId, quantity) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error("Not enough stock available");
    error.statusCode = 400;
    throw error;
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      const error = new Error("Requested quantity exceeds stock");
      error.statusCode = 400;
      throw error;
    }

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error("Quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
    include: { product: true },
  });
};

export const removeCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({
    where: { id: item.id },
  });
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
