// Schema for events

import { z } from "zod";

const startedAtField = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Invalid date format",
  })
  .transform((value) => new Date(value));

export const editEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, { message: "Description cannot be empty" })
      .optional(),
    capacity: z
      .number()
      .int()
      .positive({ message: "Capacity must be a positive integer" })
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, { message: "Address is required" })
      .max(255, { message: "Address must be less than 255 characters" })
      .optional(),
    startedAt: startedAtField.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const createEventSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description cannot be empty" })
    .optional(),
  capacity: z
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" })
    .optional(),
  address: z
    .string()
    .trim()
    .min(1, { message: "Address is required" })
    .max(255, { message: "Address must be less than 255 characters" }),

  startedAt: startedAtField,
});
