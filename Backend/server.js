import "express-async-errors";
import express       from "express";
import cors          from "cors";
import dotenv        from "dotenv";
import connectDB     from "./config/db.js";
import analyzeRoutes from "./routes/analyze.js";
import errorHandler  from "./middleware/errorHandler.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect Database ─────────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ───────────────────────────────────────────────────
app.use("/api", analyzeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SkillGap API is running 🚀" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});