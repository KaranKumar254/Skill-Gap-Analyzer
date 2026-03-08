import { analyzeWithClaude, preprocessText } from "../config/claude.js";
import Analysis from "../models/Analysis.js";

// ── PDF text extraction ───────────────────────────────────────
const extractPdfText = async (buffer) => {
  const pdfParse = (await import("pdf-parse")).default;
  const data     = await pdfParse(buffer);
  let text       = data.text || "";

  // Fix common PDF artifacts: "J a v a " -> "Java"
  text = text
    .replace(/([A-Za-z])\s(?=[A-Za-z]\s[A-Za-z])/g, "$1")   // spaced-out words
    .replace(/\f/g, "\n")                                      // form feeds → newlines
    .replace(/(\w)-\n(\w)/g, "$1$2");                          // hyphenated line breaks

  return text;
};

// ── Image text extraction (basic — detects common skills by filename/type) ───
const extractImageText = async (file) => {
  // We send image to Groq vision for OCR
  const base64   = file.buffer.toString("base64");
  const mimeType = file.mimetype;
  const apiKey   = process.env.GROQ_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model:      "llama-3.2-11b-vision-preview",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` }
            },
            {
              type: "text",
              text: "Extract ALL text from this resume/document image. Output only the raw extracted text, preserving structure as much as possible. Include all skills, job titles, education, and experience mentioned."
            }
          ]
        }]
      }),
    });

    if (!response.ok) throw new Error(`Vision API error ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.warn("⚠️  Vision OCR failed, using empty text:", err.message);
    return "";
  }
};

// ── Input quality validator ───────────────────────────────────
function validateInput(resumeText, jdText) {
  const errors = [];

  if (!resumeText?.trim()) {
    errors.push("Resume text is required. Please paste your resume or upload a PDF.");
  } else if (resumeText.trim().length < 80) {
    errors.push("Resume seems too short. Please provide a more complete resume (at least a few sentences).");
  }

  if (!jdText?.trim()) {
    errors.push("Job description is required. Please paste the job description.");
  } else if (jdText.trim().length < 40) {
    errors.push("Job description seems too short. Please provide more details.");
  }

  // Warn if text looks like garbage (mostly non-ASCII)
  const nonAsciiRatio = (resumeText?.match(/[^\x00-\x7F]/g) || []).length / (resumeText?.length || 1);
  if (nonAsciiRatio > 0.4) {
    console.warn("⚠️  Resume text has high non-ASCII ratio:", nonAsciiRatio.toFixed(2), "— PDF may need better extraction");
  }

  return errors;
}

// ── POST /api/analyze ─────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    let resumeText     = req.body.resumeText     || "";
    let jobDescription = req.body.jobDescription || "";
    const sessionId    = req.body.sessionId || req.headers["x-session-id"] || "guest";

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 New Analysis Request");
    console.log("   sessionId:", sessionId);
    console.log("   resumeText:", resumeText.length, "chars");
    console.log("   jdText:", jobDescription.length, "chars");
    console.log("   files:", req.files ? Object.keys(req.files) : "none");

    // ── Handle file uploads ──────────────────────────────────
    if (req.files?.resumeFile) {
      const file = req.files.resumeFile[0];
      console.log("📎 Processing resume file:", file.mimetype, `${(file.size/1024).toFixed(1)}KB`);

      if (file.mimetype === "application/pdf") {
        resumeText = await extractPdfText(file.buffer);
        console.log("   PDF extracted:", resumeText.length, "chars");
      } else if (file.mimetype.startsWith("image/")) {
        console.log("🖼️  Running OCR on resume image...");
        resumeText = await extractImageText(file);
        console.log("   OCR extracted:", resumeText.length, "chars");
      }
    }

    if (req.files?.jdFile) {
      const file = req.files.jdFile[0];
      console.log("📎 Processing JD file:", file.mimetype);

      if (file.mimetype === "application/pdf") {
        jobDescription = await extractPdfText(file.buffer);
        console.log("   JD PDF extracted:", jobDescription.length, "chars");
      } else if (file.mimetype.startsWith("image/")) {
        console.log("🖼️  Running OCR on JD image...");
        jobDescription = await extractImageText(file);
        console.log("   JD OCR extracted:", jobDescription.length, "chars");
      }
    }

    // ── Validate inputs ──────────────────────────────────────
    const validationErrors = validateInput(resumeText, jobDescription);
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors[0] });
    }

    // ── Run AI analysis ──────────────────────────────────────
    console.log("🤖 Starting AI analysis...");
    const aiResult = await analyzeWithClaude(resumeText, jobDescription);

    // ── Final sanity checks ──────────────────────────────────
    if (!aiResult || typeof aiResult.matchScore !== "number") {
      throw new Error("AI returned invalid analysis. Please try again.");
    }
    if (aiResult.matchedSkills.length + aiResult.missingSkills.length === 0) {
      throw new Error("Could not extract skills from the provided text. Please ensure your resume and JD contain skill-related content.");
    }

    // ── Save to DB ───────────────────────────────────────────
    console.log("💾 Saving to MongoDB...");
    const analysis = await Analysis.create({
      sessionId,
      resumeText:     resumeText.slice(0, 5000),
      jobDescription: jobDescription.slice(0, 3000),
      jobTitle:       aiResult.jobTitle     || "Job Position",
      matchScore:     aiResult.matchScore,
      matchedSkills:  aiResult.matchedSkills,
      missingSkills:  aiResult.missingSkills,
      resources:      aiResult.resources,
      summary:        aiResult.summary,
    });

    console.log("✅ Analysis saved:", analysis._id);
    console.log(`   Score: ${aiResult.matchScore}% | Matched: ${aiResult.matchedSkills.length} | Missing: ${aiResult.missingSkills.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    res.status(201).json(analysis);

  } catch (err) {
    console.error("❌ analyzeResume error:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ── GET /api/history?sessionId=xxx ───────────────────────────
export const getHistory = async (req, res) => {
  try {
    const sessionId = req.query.sessionId || req.headers["x-session-id"];
    if (!sessionId) return res.status(400).json({ message: "sessionId is required." });

    const analyses = await Analysis.find({ sessionId })
      .sort({ createdAt: -1 })
      .select("-resumeText -jobDescription")
      .limit(20);

    res.json(analyses);
  } catch (err) {
    console.error("❌ getHistory error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/history/:id ──────────────────────────────────────
export const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found." });
    res.json(analysis);
  } catch (err) {
    console.error("❌ getAnalysis error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/history/:id ───────────────────────────────────
export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    console.error("❌ deleteAnalysis error:", err.message);
    res.status(500).json({ message: err.message });
  }
};