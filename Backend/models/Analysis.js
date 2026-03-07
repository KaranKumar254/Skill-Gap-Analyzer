import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  skill: String,
  links: [{
    title: String,
    url:   String,
    type:  { type: String, enum: ["youtube", "course", "article"], default: "youtube" },
  }],
});

const analysisSchema = new mongoose.Schema({
  // We use a random sessionId (generated on frontend) to group analyses
  // No login needed — just a browser ID stored in localStorage
  sessionId:      { type: String, required: true, index: true },

  // Input
  resumeText:     { type: String },
  jobDescription: { type: String },
  jobTitle:       { type: String, default: "Untitled Job" },

  // AI Output
  matchScore:    { type: Number, required: true, min: 0, max: 100 },
  matchedSkills: [String],
  missingSkills: [String],
  resources:     [resourceSchema],
  summary:       { type: String },

}, { timestamps: true });

export default mongoose.model("Analysis", analysisSchema);