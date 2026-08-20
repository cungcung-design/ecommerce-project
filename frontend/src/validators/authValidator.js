import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "This field is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "This field is required."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name is required."),
  email: z
    .string()
    .trim()
    .min(1, "This field is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});
