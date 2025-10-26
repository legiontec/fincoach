import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

  // Market sentiment endpoint - Calls Python script
  app.get("/api/market-sentiment", async (_req, res) => {
    try {
      console.log("Running market sentiment analysis...");
      
      // Get environment variables (VITE_ prefix is for client-side only)
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
      const newsApiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY || "";
      const server = process.env.SERVER || "";
      const uid = process.env.UID || "";
      const pwd = process.env.PWD || "";
      
      console.log("Environment variables loaded:", {
        hasApiKey: !!apiKey,
        hasNewsApiKey: !!newsApiKey,
        hasServer: !!server
      });
      
      // Pass environment variables to Python script
      const env = Object.assign({}, process.env, {
        GEMINI_API_KEY: apiKey,
        NEWS_API_KEY: newsApiKey,
        SERVER: server,
        UID: uid,
        PWD: pwd
      });
      
      // Run the Python script with environment variables
      const { stdout, stderr } = await execAsync("python scripts/script.py", {
        env: env
      });
      
      if (stderr) {
        console.error("Python script stderr:", stderr);
      }
      
      console.log("Python script output:", stdout);
      
      // The script returns market stress values (mercado 0/1, promP, promN)
      // Parse output to determine sentiment
      let sentimentValue = 0.5; // Neutral by default
      let positiveRatio = 0.5;
      let negativeRatio = 0.5;
      
      // Try to parse sentiment from output
      if (stdout.includes("mercado = 1")) {
        // Positive market
        sentimentValue = 0.7;
        positiveRatio = 0.7;
        negativeRatio = 0.3;
      } else if (stdout.includes("mercado = 0")) {
        // Negative/Stressed market
        sentimentValue = 0.3;
        positiveRatio = 0.3;
        negativeRatio = 0.7;
      }
      
      res.json({
        success: true,
        data: {
          overallSentiment: sentimentValue,
          positiveRatio: positiveRatio,
          negativeRatio: negativeRatio,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Error running market sentiment analysis:", error);
      
      // Return an error to trigger fallback in frontend
      res.status(500).json({
        success: false,
        error: "No se pudo obtener el análisis de sentimiento. Revisa las dependencias de Python.",
        details: error.message,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
