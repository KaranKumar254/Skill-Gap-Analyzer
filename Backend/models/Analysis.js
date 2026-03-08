import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url:   { type: String, required: true },
  type:  { type: String, enum: ["youtube","course","article","notes"], default: "youtube" },
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  links: { type: [linkSchema], default: [] },
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  sessionId:      { type: String, required: true, index: true },
  resumeText:     { type: String, default: "" },
  jobDescription: { type: String, default: "" },
  jobTitle:       { type: String, default: "Untitled Job" },
  matchScore:     { type: Number, required: true, min: 0, max: 100 },
  matchedSkills:  { type: [String], default: [] },
  missingSkills:  { type: [String], default: [] },
  resources:      { type: [resourceSchema], default: [] },
  summary:        { type: String, default: "" },
  // Accuracy metadata
  inputQuality: {
    resumeLength: { type: Number },
    jdLength:     { type: Number },
    resumeSource: { type: String, enum: ["text","pdf","image"], default: "text" },
    jdSource:     { type: String, enum: ["text","pdf","image"], default: "text" },
  },
}, { timestamps: true });

// Index for fast history queries
analysisSchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("Analysis", analysisSchema);
