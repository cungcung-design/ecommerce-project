import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
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
  name: z.string().min(2, "Product name is required").max(100),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  imagePublicId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
});

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive(),
});

export const shippingSchema = z.object({
  name: z.string().min(1, "Shipping name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});
