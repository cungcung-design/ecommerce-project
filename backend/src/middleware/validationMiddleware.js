import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errors = error.errors || [{ message: "Validation failed" }];
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  };
};

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(2000).optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.number().int().positive("Category is required"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});
