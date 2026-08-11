import { vi } from "vitest";

export const createPrismaMock = () => {
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

  return { prisma, calls, state };
};
