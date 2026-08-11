import prisma from "../lib/prisma.js";
import paymentProviderService from "./paymentProviderService.js";

const SHIPPING_FEE = 10;
const FREE_SHIPPING_THRESHOLD = 100;

export const paymentStatusTransitions = {
  PENDING: ["PAID", "FAILED"],
  PAID: ["REFUNDED"],
  FAILED: [],
  REFUNDED: [],
};

export const canTransitionPayment = (from, to) => {
  const allowed = paymentStatusTransitions[from] ?? [];
  return allowed.includes(to);
};

export const calculateTotals = (items) => {
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const price = Number(item.price);
    const line = price * item.quantity;

    subtotal += line;

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });
  }

  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return { subtotal, shipping, total, orderItems };
};

export const createPaymentRecord = async (tx, { orderId, amount, method, status = "PENDING", transactionId = null }) => {
  return tx.payment.create({
    data: {
      orderId,
      amount,
      method,
      status,
      transactionId,
    },
  });
};

export const getPaymentByOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: Number(orderId), userId },
    select: { id: true },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.payment.findUnique({
    where: { orderId: order.id },
    include: { order: true },
  });
};

export const getPaymentByOrderId = async (orderId) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId: Number(orderId) },
    include: { order: { include: { user: true } } },
  });

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  return payment;
};

export const updatePaymentStatus = async (paymentId, newStatus, options = {}) => {
  const { transactionId } = options;

  const payment = await prisma.payment.findUnique({
    where: { id: Number(paymentId) },
  });

  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  if (!canTransitionPayment(payment.status, newStatus)) {
    const error = new Error(
      `Invalid payment transition: ${payment.status} to ${newStatus}`
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        ...(transactionId ? { transactionId } : {}),
      },
    });

    const orderUpdate = { paymentStatus: newStatus };
    if (transactionId) {
      orderUpdate.paymentReference = transactionId;
    }

    await tx.order.update({
      where: { id: payment.orderId },
      data: orderUpdate,
    });

    return updated;
  });
};

export const processProviderWebhook = async ({ reference, amount, providerStatus, orderId }) => {
  const payment = await prisma.payment.findFirst({
    where: { transactionId: reference },
    include: { order: true },
  });

  if (!payment) {
    const error = new Error("Payment not found for the given reference");
    error.statusCode = 404;
    throw error;
  }

  if (orderId !== undefined && payment.orderId !== Number(orderId)) {
    const error = new Error("Order/payment relationship mismatch");
    error.statusCode = 400;
    throw error;
  }

  const paymentAmountCents = Math.round(Number(payment.amount) * 100);
  const providedAmountCents = Math.round(Number(amount) * 100);

  if (paymentAmountCents !== providedAmountCents) {
    const error = new Error("Payment amount mismatch");
    error.statusCode = 400;
    throw error;
  }

  const targetStatus = providerStatus === "paid" ? "PAID" : "FAILED";

  if (payment.status === targetStatus) {
    return {
      processed: false,
      payment,
      reason: `already_${targetStatus.toLowerCase()}`,
    };
  }

  if (!canTransitionPayment(payment.status, targetStatus)) {
    const error = new Error(
      `Invalid payment transition: ${payment.status} to ${targetStatus}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (targetStatus === "PAID") {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", transactionId: reference },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          paymentReference: reference,
          status: payment.order.status === "CANCELLED"
            ? "CANCELLED"
            : "CONFIRMED",
        },
      });

      return { processed: true, payment: updated, reason: "paid" };
    });
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "FAILED" },
    });

    return { processed: true, payment: updated, reason: "failed" };
  });
};

export const prepareOnlinePaymentSession = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: Number(orderId), userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId: order.id },
  });

  if (!payment) {
    const error = new Error("Payment not found for this order");
    error.statusCode = 404;
    throw error;
  }

  if (payment.method !== "ONLINE") {
    const error = new Error("Cash on Delivery orders cannot be paid online");
    error.statusCode = 400;
    throw error;
  }

  const terminalStatuses = ["PAID", "REFUNDED", "FAILED"];
  if (terminalStatuses.includes(payment.status)) {
    const error = new Error("Payment already processed");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (payment.transactionId) {
    const existing = await paymentProviderService.retrievePaymentSession(
      payment.transactionId
    );

    if (existing) {
      return existing;
    }
  }

  const session = await paymentProviderService.createPaymentSession({
    order,
    payment,
    user,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { transactionId: session.reference },
  });

  return session;
};
