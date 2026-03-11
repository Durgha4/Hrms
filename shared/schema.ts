import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["employee", "client"]),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.enum(["employee", "client"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfJoining: z.string().optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  profileImage: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export type UserWithoutPassword = Omit<User, "password">;
