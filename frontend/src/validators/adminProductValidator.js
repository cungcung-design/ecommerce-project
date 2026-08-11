import { z } from "zod";

export const adminProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name is required")
    .max(100, "Product name is too long"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  categoryId: z.coerce
    .number()
    .int()
    .positive("Please select a category"),

  isActive: z.boolean(),
});
