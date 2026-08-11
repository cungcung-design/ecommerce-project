import { describe, it, expect, vi } from "vitest";

const mockSendEmail = vi.fn().mockResolvedValue(undefined);

vi.mock("../src/services/emailService.js", () => ({
  get sendEmail() {
    return mockSendEmail;
  },
}));

import * as notificationService from "../src/services/notificationService.js";

describe("Notification Service", () => {
  it("sendOrderCreatedEmail: sends email with correct subject and html", async () => {
    const user = { email: "customer@example.com", name: "Jane" };
    const order = { id: 42, totalAmount: 99.5 };

    await notificationService.sendOrderCreatedEmail(user, order);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "customer@example.com",
      subject: "Order #42 Confirmed",
      html: expect.stringContaining("Jane"),
    });
  });

  it("sendPaymentPaidEmail: sends email with payment amount", async () => {
    const user = { email: "customer@example.com", name: "Jane" };
    const order = { id: 42 };
    const payment = { amount: 49.99 };

    await notificationService.sendPaymentPaidEmail(user, order, payment);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "customer@example.com",
      subject: "Payment Confirmed - Order #42",
      html: expect.stringContaining("49.99"),
    });
  });

  it("sendOrderShippedEmail: sends email with order id", async () => {
    const user = { email: "customer@example.com", name: "Jane" };
    const order = { id: 42 };

    await notificationService.sendOrderShippedEmail(user, order);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "customer@example.com",
      subject: "Order #42 Shipped",
      html: expect.stringContaining("42"),
    });
  });

  it("sendOrderDeliveredEmail: sends email with order id", async () => {
    const user = { email: "customer@example.com", name: "Jane" };
    const order = { id: 42 };

    await notificationService.sendOrderDeliveredEmail(user, order);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "customer@example.com",
      subject: "Order #42 Delivered",
      html: expect.stringContaining("42"),
    });
  });

  it("sendOrderCreatedEmail: skips when user email is missing", async () => {
    mockSendEmail.mockClear();
    await notificationService.sendOrderCreatedEmail(null, { id: 1 });

    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
