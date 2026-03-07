import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { analyzeWithClaude } from "../config/claude.js";
import Analysis from "../models/Analysis.js";

// POST /api/analyze
export const analyzeResume = async (req, res) => {
  let resumeText     = req.body.resumeText     || "";
  let jobDescription = req.body.jobDescription || "";
  const sessionId    = req.body.sessionId      || req.headers["x-session-id"] || "guest";

  // Handle PDF uploads
  if (req.files?.resumeFile) {
    const file = req.files.resumeFile[0];
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    }
  }

  if (req.files?.jdFile) {
    const file = req.files.jdFile[0];
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      jobDescription = data.text;
    }
  }

  if (!resumeText?.trim())     return res.status(400).json({ message: "Resume text is required." });
  if (!jobDescription?.trim()) return res.status(400).json({ message: "Job description is required." });

  // Call Claude AI
  const aiResult = await analyzeWithClaude(resumeText, jobDescription);

  // Save to MongoDB
  const analysis = await Analysis.create({
    sessionId,
    resumeText:     resumeText.slice(0, 5000),
    jobDescription: jobDescription.slice(0, 3000),
    jobTitle:       aiResult.jobTitle,
    matchScore:     aiResult.matchScore,
    matchedSkills:  aiResult.matchedSkills,
    missingSkills:  aiResult.missingSkills,
    resources:      aiResult.resources,
    summary:        aiResult.summary,
  });

  res.status(201).json(analysis);
};

// GET /api/history?sessionId=xxx
export const getHistory = async (req, res) => {
  const sessionId = req.query.sessionId || req.headers["x-session-id"];
  if (!sessionId) return res.status(400).json({ message: "sessionId is required." });

  const analyses = await Analysis.find({ sessionId })
    .sort({ createdAt: -1 })
    .select("-resumeText -jobDescription")
    .limit(20);

  res.json(analyses);
};

// GET /api/history/:id
export const getAnalysis = async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return res.status(404).json({ message: "Analysis not found." });
  res.json(analysis);
};

// DELETE /api/history/:id
export const deleteAnalysis = async (req, res) => {
  const analysis = await Analysis.findByIdAndDelete(req.params.id);
  if (!analysis) return res.status(404).json({ message: "Analysis not found." });
  res.json({ message: "Deleted successfully." });
};