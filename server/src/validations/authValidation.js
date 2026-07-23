import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long"), 
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});