import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import "express-async-errors";
import express       from "express";
import cors          from "cors";
import connectDB     from "./config/db.js";
import analyzeRoutes from "./routes/Analyze.js";
import errorHandler  from "./middleware/errorHandler.js";

console.log("🔑 Groq Key loaded:", process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌");
console.log("🗄️  Mongo URI loaded:", process.env.MONGO_URI    ? "YES ✅" : "NO ❌");

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "https://skill-gap-analyzer-frontend-ecui.onrender.com",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SkillGap Backend Running 🚀"
  });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
