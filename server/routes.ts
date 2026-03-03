import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session configuration should ideally be done in index.ts, but we handle the routes here.

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      
      const user = await storage.getUserByEmail(input.email);
      
      if (!user || user.password !== input.password || user.role !== input.role) {
        return res.status(401).json({ message: "Invalid email, password, or role" });
      }

      // Set user session
      if (req.session) {
        (req.session as any).userId = user.id;
      }

      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      res.status(200).json({
        message: "Logged in successfully",
        user: userWithoutPassword,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session || !(req.session as any).userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = (req.session as any).userId;
    const user = await storage.getUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  });

  app.post(api.auth.logout.path, (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Logged out successfully" });
    }
  });

  return httpServer;
}
