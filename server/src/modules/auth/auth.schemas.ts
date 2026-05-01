import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .pipe(z.string().email({ message: "Invalid email address" }))
  .pipe(
    z.string().max(255, { message: "Email must be less than 255 characters" }),
  )
  .transform((email) => email.toLowerCase());

const passwordField = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });
const nameField = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(255, { message: "Name must be less than 255 characters" });

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: nameField,
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
