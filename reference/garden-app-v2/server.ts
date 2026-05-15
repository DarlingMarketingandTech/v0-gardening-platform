import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/identify", async (req, res) => {
    try {
      const { image } = req.body; // base64
      if (!image) return res.status(400).json({ error: "No image provided" });

      const prompt = "Identify this plant or insect. Provide the common name, scientific name (if plant), and a brief description of its care needs or characteristics. Format as JSON with keys: commonName, scientificName, description, careSummary.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: image.split(',')[1] || image } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Identification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/diagnose", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "No image provided" });

      const prompt = "Diagnose the health of this plant. Look for signs of disease, pests, or nutrient deficiencies. Provide a diagnosis, severity level, and a step-by-step treatment plan. Format as JSON with keys: diagnosis, severity, confidence, treatmentPlan (array), symptoms.";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: image.split(',')[1] || image } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sensor-data", (req, res) => {
    // Mocking localized microclimate and sensor data
    res.json({
      vitality: 92,
      ambient: {
        temp: 24.5,
        humidity: 58,
        status: "Stable"
      },
      soil: {
        moisture: 68,
        ph: 6.4,
        nutrients: "Optimal",
        temp: 14.5
      },
      light: {
        lux: "4.2k",
        intensity: "Full Sun",
        peakHoursReached: true
      },
      weatherAlerts: [
        { type: "Frost Warning", severity: "Low", message: "Frost risk dropped below 5% for your microclimate." }
      ],
      actions: [
        { id: 1, type: "Watering", plant: "Monstera Deliciosa", location: "Zone B", message: "Reservoir below 15%" },
        { id: 2, type: "Pruning", plant: "Herb Garden", location: "Kitchen", message: "Scheduled sync recommended" },
        { id: 3, type: "Harvest", plant: "Microgreens", location: "Window Sill", message: "Peak nutrient density reached" }
      ]
    });
  });

  app.post("/api/care-advice", async (req, res) => {
    try {
      const { plantName, stage, conditions } = req.body;
      const prompt = `Provide 3 specific care tips for a ${plantName} in the ${stage} growth stage, considering these environmental conditions: ${conditions}. The advice should be prescriptive, brief, and professional. Format as JSON with a single key 'advice' containing an array of 3 strings.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Care advice error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
