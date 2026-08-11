import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/lib/prisma.js", () => {
  const calls = [];
  const state = {};

  const model = (name) => ({
    findUnique: vi.fn(async (...args) => {
      calls.push({ model: `${name}.findUnique`, args });
      const handler = state[`${name}.findUnique`];
      return handler ? handler(...args) : null;
    }),
    findFirst: vi.fn(async (...args) => {
      calls.push({ model: `${name}.findFirst`, args });
      const handler = state[`${name}.findFirst`];
      return handler ? handler(...args) : null;
    }),
    findMany: vi.fn(async (...args) => {
      calls.push({ model: `${name}.findMany`, args });
      const handler = state[`${name}.findMany`];
      return handler ? handler(...args) : [];
    }),
    count: vi.fn(async (...args) => {
      calls.push({ model: `${name}.count`, args });
      const handler = state[`${name}.count`];
      return handler ? handler(...args) : 0;
    }),
    create: vi.fn(async (args) => {
      calls.push({ model: `${name}.create`, args });
      const handler = state[`${name}.create`];
      return handler ? handler(args) : { id: 1, ...args.data };
    }),
    update: vi.fn(async (args) => {
      calls.push({ model: `${name}.update`, args });
      const handler = state[`${name}.update`];
      return handler ? handler(args) : { id: args.where.id, ...args.data };
    }),
    delete: vi.fn(async (args) => {
      calls.push({ model: `${name}.delete`, args });
    }),
    deleteMany: vi.fn(async (args) => {
      calls.push({ model: `${name}.deleteMany`, args });
      return 0;
    }),
  });

  const prisma = {
    $transaction: vi.fn(async (fn) => fn(prisma)),
    user: model("user"),
    order: model("order"),
    payment: model("payment"),
    product: model("product"),
    cart: model("cart"),
    cartItem: model("cartItem"),
    category: model("category"),
    refreshToken: model("refreshToken"),
  };

  return { default: prisma, prisma, calls, state };
});

vi.mock("stripe", () => ({
  default: class Stripe {
    constructor() {}
    webhooks = {
      constructEvent: vi.fn(),
    };
  },
}));

import * as orderService from "../src/services/orderService.js";

describe("Order Service", () => {
  beforeEach(async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.user.findUnique.mockClear();
    prisma.user.create.mockClear();
    prisma.refreshToken.create.mockClear();
    prisma.cart.findUnique.mockClear();
    prisma.cartItem.deleteMany.mockClear();
    prisma.product.update.mockClear();
    prisma.product.findFirst.mockClear();
    prisma.order.create.mockClear();
    prisma.order.findFirst.mockClear();
    prisma.order.update.mockClear();
    prisma.payment.create.mockClear();
  });

  it("createOrder: rejects empty cart", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1, items: [] });

    await expect(
      orderService.createOrder(1, { name: "A", phone: "1", address: "A", city: "A", postalCode: "A" }, "COD")
    ).rejects.toThrow("Cart is empty");
  });

  it("createOrder: rejects inactive product", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({
      id: 1,
      items: [
        {
          productId: 1,
          quantity: 1,
          product: { id: 1, name: "Old", price: 10, stock: 99, isActive: false },
        },
      ],
    });

    await expect(
      orderService.createOrder(1, { name: "A", phone: "1", address: "A", city: "A", postalCode: "A" }, "COD")
    ).rejects.toThrow(/no longer available/);
  });

  it("createOrder: rejects quantity exceeding stock", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({
      id: 1,
      items: [
        {
          productId: 1,
          quantity: 10,
          product: { id: 1, name: "Widget", price: 10, stock: 1, isActive: true },
        },
      ],
    });

    await expect(
      orderService.createOrder(1, { name: "A", phone: "1", address: "A", city: "A", postalCode: "A" }, "COD")
    ).rejects.toThrow(/Not enough stock/);
  });

  it("createOrder: calculates server-side total and ignores frontend price", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({
      id: 1,
      items: [
        {
          productId: 1,
          quantity: 2,
          product: { id: 1, name: "Widget", price: 25, stock: 99, isActive: true },
        },
      ],
    });
    prisma.order.create.mockResolvedValue({ id: 1, totalAmount: 60, paymentMethod: "COD", items: [] });
    prisma.payment.create.mockResolvedValue({ id: 1, amount: 60 });
    prisma.product.update.mockResolvedValue({});
    prisma.cartItem.deleteMany.mockResolvedValue(0);

    const order = await orderService.createOrder(1, { name: "A", phone: "1", address: "A", city: "A", postalCode: "A" }, "COD");

    expect(prisma.order.create).toHaveBeenCalled();
    expect(prisma.order.create.mock.calls[0][0].data.totalAmount).toBe(60);
    expect(prisma.order.create.mock.calls[0][0].data.paymentMethod).toBe("COD");
    expect(prisma.payment.create).toHaveBeenCalled();
  });

  it("createOrder: reduces stock for each item", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({
      id: 1,
      items: [
        {
          productId: 1,
          quantity: 2,
          product: { id: 1, name: "Widget", price: 25, stock: 99, isActive: true },
        },
        {
          productId: 2,
          quantity: 1,
          product: { id: 2, name: "Gadget", price: 10, stock: 99, isActive: true },
        },
      ],
    });
    prisma.order.create.mockResolvedValue({ id: 1, totalAmount: 70.5, items: [] });
    prisma.payment.create.mockResolvedValue({ id: 1 });
    prisma.product.update.mockResolvedValue({});
    prisma.cartItem.deleteMany.mockResolvedValue(0);

    await orderService.createOrder(1, { name: "A", phone: "1", address: "A", city: "A", postalCode: "A" }, "COD");

    expect(prisma.product.update).toHaveBeenCalledTimes(2);
  });

  it("cancelOrder: rejects non-pending order", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findFirst.mockResolvedValue({ id: 1, userId: 1, status: "SHIPPED" });

    await expect(orderService.cancelOrder(1, 1)).rejects.toThrow("This order cannot be cancelled");
  });
});
