import prisma from "../lib/prisma.js";

export const createOrder = async (userId, shipping) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive) {
        const error = new Error(`${product.name} is no longer available`);
        error.statusCode = 400;
        throw error;
      }

      if (item.quantity > product.stock) {
        const error = new Error(`Not enough stock for ${product.name}`);
        error.statusCode = 400;
        throw error;
      }

      totalAmount += Number(product.price) * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingCountry: shipping.country,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
};

export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
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
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};
