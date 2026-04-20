require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ─── Initialize DB (runs schema on startup) ───────────────────
require("./db/database");

// ─── Routes ───────────────────────────────────────────────────
const authRoutes      = require("./routes/authRoutes");
const healthRoutes    = require("./routes/healthRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const recordsRoutes   = require("./routes/recordsRoutes");

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: "10mb" })); // allow base64 images
app.use(cookieParser());
const frontendPath = path.join(__dirname, "../frontend/out");
console.log("📂 Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));

// ─── API Routes ───────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/health",    healthRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/records",   recordsRoutes);

// ─── Gemini AI Setup ─────────────────────────────────────────
const upload = multer();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = "gemini-2.5-flash";

// ─── 🔥 DETECT FOOD FROM IMAGE ───────────────────────────────
app.post("/detect-food", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image provided" });
        }

        console.log("📸 Image received:", req.file.mimetype, req.file.size, "bytes");

        const model = genAI.getGenerativeModel({ model: MODEL });

        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            }
        };

        const prompt = `
Analyze this food image and return ONLY JSON in this format:

{
  "food": "",
  "ingredients": ["", "", ""],
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "fiber": number,
  "sugar": number,
  "description": ""
}

Rules:
- food = exact dish name
- ingredients = main ingredients list
- calories, protein, carbs, fats, fiber, sugar = estimated values per serving (100g standard)
- description = short health explanation (2 lines max)
- return ONLY JSON (no extra text, no markdown)
`;
        console.log("📸 Sending request to Gemini 2.5 Flash...");
        const result = await model.generateContent([imagePart, prompt]);

        let text = result.response.text()
            .replace(/```json|```/g, "")
            .trim();

        console.log("✅ Gemini raw response:", text);

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            console.error("❌ JSON Parse Error:", text);
            return res.json({
                food: "Unknown Food",
                confidence: 80,
                calories: 300, protein: 10, carbs: 40,
                fats: 15, fiber: 5, sugar: 5,
                ingredients: ["Unknown"],
                description: "Could not analyze properly. Try again."
            });
        }

        res.json({
            food: parsed.food || "Unknown Food",
            confidence: 95,
            calories: parsed.calories || 300,
            protein: parsed.protein || 10,
            carbs: parsed.carbs || 40,
            fats: parsed.fats || 15,
            fiber: parsed.fiber || 5,
            sugar: parsed.sugar || 5,
            ingredients: parsed.ingredients || [],
            description: parsed.description || "Healthy food with balanced nutrients."
        });

    } catch (err) {
        console.error("🚨 FULL ERROR:", err.message);
        res.status(500).json({ error: "Failed to process image", details: err.message });
    }
});

// ─── 🔥 MANUAL FOOD LOOKUP ───────────────────────────────────
app.post("/manual-food", async (req, res) => {
    try {
        const { food } = req.body;

        const model = genAI.getGenerativeModel({ model: MODEL });

        const prompt = `
Give nutritional values for "${food}".
Return ONLY JSON (no markdown, no extra text):
{
  "food": "name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "fiber": number,
  "sugar": number,
  "ingredients": ["item1","item2"],
  "description": "short health note"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        console.log("✅ Gemini raw text:", text);
        const parsed = JSON.parse(text);

        res.json(parsed);

    } catch (err) {
        console.error("🚨 MANUAL FOOD ERROR:", err.message);
        res.status(500).json({ error: "Failed manual fetch", details: err.message });
    }
});

// ─── 🔥 HEALTH CHECK ─────────────────────────────────────────
app.post("/health-check", async (req, res) => {
    try {
        const { food, calories, protein, carbs, fats, condition } = req.body;

        const model = genAI.getGenerativeModel({ model: MODEL });

        const prompt = `
User health condition: ${condition}

Food: ${food}
Calories: ${calories}
Protein: ${protein}
Carbs: ${carbs}
Fats: ${fats}

Tell clearly:
1. Is this food safe or not for this condition
2. Give short reason
3. Give 2-3 suggestions (what to reduce or increase)

Return ONLY JSON (no markdown):
{
  "warning": "",
  "suggestions": ["", ""]
}
`;

        const result = await model.generateContent(prompt);

        let text = result.response.text()
            .replace(/```json|```/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            return res.json({
                warning: "Could not analyze health impact",
                suggestions: ["Maintain balanced diet"]
            });
        }

        res.json(parsed);

    } catch (err) {
        console.error("🚨 HEALTH API ERROR:", err.message);
        res.status(500).json({ warning: "Error analyzing health", suggestions: ["Try again"] });
    }
});

// ─── SPA Routing ──────────────────────────────────────────────
app.get(/.*/, (req, res) => {
    const isApi = req.path.startsWith("/api") || 
                  req.path.startsWith("/detect-food") || 
                  req.path.startsWith("/manual-food") || 
                  req.path.startsWith("/health-check");
    
    console.log(`🌐 [GET] ${req.path} - isApi: ${isApi}`);
                  
    if (!isApi) {
        const indexPath = path.join(frontendPath, "index.html");
        console.log("📄 Serving SPA index from:", indexPath);
        res.sendFile(indexPath);
    } else {
        console.log("⚠️ API route not matched by Express routes");
        res.status(404).json({ error: "API route not found" });
    }
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Nutrimate Server: http://localhost:${PORT}`);
});