import express from "express";
import { analyzeResume, getHistory, getAnalysis, deleteAnalysis } from "../controllers/analyzeController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Analyze — open to everyone, no login needed
router.post(
  "/analyze",
  upload.fields([
    { name: "resumeFile", maxCount: 1 },
    { name: "jdFile",     maxCount: 1 },
  ]),
  analyzeResume
);

// History — identified by sessionId (stored in browser localStorage)
router.get   ("/history",     getHistory);
router.get   ("/history/:id", getAnalysis);
router.delete("/history/:id", deleteAnalysis);

export default router;