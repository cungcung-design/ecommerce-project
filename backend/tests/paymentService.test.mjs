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

vi.mock("stripe", () => {
  const constructEvent = vi.fn();
  return {
    default: class Stripe {
      constructor() {}
      webhooks = { constructEvent };
    },
    constructEvent,
  };
});

import * as paymentService from "../src/services/paymentService.js";
import * as paymentProviderService from "../src/services/paymentProviderService.js";

const { constructEvent } = await import("stripe");

describe("Payment Service", () => {
  it("allows PENDING -> PAID", () => {
    expect(paymentService.canTransitionPayment("PENDING", "PAID")).toBe(true);
  });

  it("allows PENDING -> FAILED", () => {
    expect(paymentService.canTransitionPayment("PENDING", "FAILED")).toBe(true);
  });

  it("allows PAID -> REFUNDED", () => {
    expect(paymentService.canTransitionPayment("PAID", "REFUNDED")).toBe(true);
  });

  it("rejects PENDING -> REFUNDED", () => {
    expect(paymentService.canTransitionPayment("PENDING", "REFUNDED")).toBe(false);
  });

  it("rejects PAID -> PAID", () => {
    expect(paymentService.canTransitionPayment("PAID", "PAID")).toBe(false);
  });

  it("rejects REFUNDED -> PAID", () => {
    expect(paymentService.canTransitionPayment("REFUNDED", "PAID")).toBe(false);
  });

  it("calculates totals with shipping", () => {
    const items = [
      { price: 25, quantity: 2 },
      { price: 10.5, quantity: 1 },
    ];
    const result = paymentService.calculateTotals(items);
    expect(result.subtotal).toBeCloseTo(60.5);
    expect(result.shipping).toBe(10);
    expect(result.total).toBeCloseTo(70.5);
  });

  it("gives free shipping above threshold", () => {
    const items = [{ price: 150, quantity: 1 }];
    const result = paymentService.calculateTotals(items);
    expect(result.shipping).toBe(0);
    expect(result.total).toBeCloseTo(150);
  });

  it("parses checkout.session.completed to paid payload", () => {
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          amount_total: 7050,
          metadata: { orderId: "42" },
        },
      },
    };
    const payload = paymentProviderService.parseWebhookEvent(event);
    expect(payload).toEqual({
      reference: "cs_test_123",
      amount: 70.5,
      providerStatus: "paid",
      orderId: 42,
    });
  });

  it("parses expired session to failed payload", () => {
    const event = {
      type: "checkout.session.expired",
      data: {
        object: {
          id: "cs_test_exp",
          amount_total: 5000,
          metadata: { orderId: "7" },
        },
      },
    };
    const payload = paymentProviderService.parseWebhookEvent(event);
    expect(payload.providerStatus).toBe("failed");
    expect(payload.reference).toBe("cs_test_exp");
  });

  it("returns null for unrelated event", () => {
    expect(paymentProviderService.parseWebhookEvent({ type: "customer.created" })).toBeNull();
  });

  it("throws SIGNATURE_MISSING when signature header missing", () => {
    const req = { headers: {}, body: Buffer.from("{}") };
    expect(() => paymentProviderService.verifyWebhookSignature(req)).toThrow("Missing Stripe signature header");
  });

  it("throws SIGNATURE_INVALID on bad signature", () => {
    constructEvent.mockImplementation(() => {
      const error = new Error("Invalid signature");
      error.code = "SIGNATURE_INVALID";
      throw error;
    });

    const req = {
      headers: { "stripe-signature": "t=12345,v1=bad,v0=bad" },
      body: Buffer.from(JSON.stringify({ id: "evt_test", object: "event" })),
    };
    expect(() => paymentProviderService.verifyWebhookSignature(req)).toThrow("Invalid signature");
  });
});
