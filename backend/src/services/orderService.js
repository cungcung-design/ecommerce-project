import prisma from "../lib/prisma.js";
import { calculateTotals, createPaymentRecord } from "./paymentService.js";

export const createOrder = async (userId, shipping, paymentMethod) => {
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

    const cartItems = [];
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

      cartItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const { shipping: shippingCost, total, orderItems } = calculateTotals(cartItems);

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: total,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingCountry: shipping.postalCode,
        paymentMethod,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await createPaymentRecord(tx, {
      orderId: order.id,
      amount: total,
      method: paymentMethod,
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

export const cancelOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId,
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.status !== "PENDING") {
    const error = new Error("This order cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  return prisma.order.update({
    where: { id: Number(orderId) },
    data: { status: "CANCELLED" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
