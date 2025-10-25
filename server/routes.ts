import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      res.json({
        success: true,
        message: "Mensaje recibido correctamente. Nos pondremos en contacto pronto.",
        data: {
          id: message.id,
          createdAt: message.createdAt,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: "Datos inválidos",
          details: validationError.toString(),
        });
      }
      
      console.error("Error processing contact form:", error);
      res.status(500).json({
        success: false,
        error: "Error al procesar el mensaje. Por favor intenta de nuevo.",
      });
    }
  });

  // Get all contact messages (admin endpoint - could be protected)
  app.get("/api/contact/messages", async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener los mensajes",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
