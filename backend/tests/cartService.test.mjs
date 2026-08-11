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
    cart: model("cart"),
    product: model("product"),
    cartItem: model("cartItem"),
  };

  return { default: prisma, prisma, calls, state };
});

import * as cartService from "../src/services/cartService.js";

describe("Cart Service", () => {
  it("getCart: creates cart if missing", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue(null);
    prisma.cart.create.mockResolvedValue({ id: 1, userId: 1 });

    const cart = await cartService.getCart(1);

    expect(cart).toBeDefined();
    expect(prisma.cart.create).toHaveBeenCalledWith({
      data: { userId: 1 },
    });
  });

  it("addCartItem: rejects missing product", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });
    prisma.product.findFirst.mockResolvedValue(null);

    await expect(cartService.addCartItem(1, 999, 1)).rejects.toThrow("Product not found");
  });

  it("addCartItem: rejects quantity exceeding stock", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });
    prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 2, isActive: true });

    await expect(cartService.addCartItem(1, 1, 5)).rejects.toThrow("Not enough stock available");
  });

  it("addCartItem: increases quantity for existing item", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });
    prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 10, isActive: true });
    prisma.cartItem.findUnique.mockResolvedValue({ id: 1, quantity: 2 });
    prisma.cartItem.update.mockResolvedValue({ id: 1, quantity: 3 });

    const item = await cartService.addCartItem(1, 1, 1);

    expect(item.quantity).toBe(3);
    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { quantity: 3 },
      include: { product: true },
    });
  });

  it("updateCartItem: rejects missing item", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });
    prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 10, isActive: true });
    prisma.cartItem.findUnique.mockResolvedValue(null);

    await expect(cartService.updateCartItem(1, 1, 1)).rejects.toThrow("Cart item not found");
  });

  it("removeCartItem: removes existing item", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });
    prisma.cartItem.findUnique.mockResolvedValue({ id: 1 });

    await cartService.removeCartItem(1, 1);

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("clearCart: removes all items", async () => {
    const { prisma } = await import("../src/lib/prisma.js");
    prisma.cart.findUnique.mockResolvedValue({ id: 1 });

    await cartService.clearCart(1);

    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: 1 },
    });
  });
});
