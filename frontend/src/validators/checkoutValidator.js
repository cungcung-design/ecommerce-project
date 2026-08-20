import { z } from "zod";

export const paymentMethodEnum = z.enum(["COD", "ONLINE"]);

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required"),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Please enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required"),

  paymentMethod: paymentMethodEnum.default("COD"),
});

export const paymentMethodOptions = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "ONLINE", label: "Online Payment" },
];
