import { z } from "zod";

export const paymentMethodEnum = z.enum(["COD", "ONLINE"]);

export const paymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

export const createPaymentSessionSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const paymentStatusSchema = z.object({
  status: paymentStatusEnum,
  paymentReference: z.string().optional(),
});

export { paymentStatusSchema as updatePaymentStatusSchema };
