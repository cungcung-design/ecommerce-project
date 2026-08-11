import { describe, it, expect, vi } from "vitest";

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

import * as adminOrderService from "../src/services/adminOrderService.js";

describe("Admin Order Service", () => {
  it("updateOrderStatus: rejects invalid transition", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findUnique.mockResolvedValue({ id: 1, status: "DELIVERED" });

    await expect(adminOrderService.updateOrderStatus(1, "PENDING")).rejects.toThrow("Cannot change DELIVERED to PENDING");
  });

  it("updateOrderStatus: allows valid transition PENDING -> PROCESSING", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findUnique.mockResolvedValue({ id: 1, status: "PENDING" });
    prisma.order.update.mockResolvedValue({ id: 1, status: "PROCESSING" });

    const order = await adminOrderService.updateOrderStatus(1, "PROCESSING");

    expect(order.status).toBe("PROCESSING");
    expect(prisma.order.update).toHaveBeenCalled();
  });

  it("updateOrderStatus: allows valid transition PROCESSING -> SHIPPED", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findUnique.mockResolvedValue({ id: 1, status: "PROCESSING" });
    prisma.order.update.mockResolvedValue({ id: 1, status: "SHIPPED" });

    const order = await adminOrderService.updateOrderStatus(1, "SHIPPED");

    expect(order.status).toBe("SHIPPED");
  });

  it("updateOrderStatus: allows valid transition SHIPPED -> DELIVERED", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findUnique.mockResolvedValue({ id: 1, status: "SHIPPED" });
    prisma.order.update.mockResolvedValue({ id: 1, status: "DELIVERED" });

    const order = await adminOrderService.updateOrderStatus(1, "DELIVERED");

    expect(order.status).toBe("DELIVERED");
  });

  it("updateOrderStatus: rejects non-existent order", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(adminOrderService.updateOrderStatus(999, "PROCESSING")).rejects.toThrow("Order not found");
  });
});
