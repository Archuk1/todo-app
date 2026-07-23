import { z } from "zod";

export const VALID_STATUSES = ["todo", "in progress", "done"];

const statusSchema = z.enum(VALID_STATUSES, {
  errorMap: () => ({
    message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
  }),
});


export const taskIdParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "Task id must be a number" })
    .int("Task id must be an integer")
    .positive("Task id must be positive"),
});


export const getTasksQuerySchema = z.object({
  status: statusSchema.optional(),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .default(""),
  status: statusSchema.optional().default("todo"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  status: statusSchema.optional(),
});