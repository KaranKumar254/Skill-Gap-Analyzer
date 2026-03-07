/**
 * Validate resume + job description inputs
 * Returns { valid: boolean, error: string }
 */
export function validateAnalysisInputs(resumeText, jobDescription) {
  if (!resumeText.trim()) {
    return { valid: false, error: "Please paste your resume." };
  }
  if (resumeText.trim().length < 100) {
    return { valid: false, error: "Resume seems too short. Paste the full text." };
  }
  if (!jobDescription.trim()) {
    return { valid: false, error: "Please paste the job description." };
  }
  if (jobDescription.trim().length < 50) {
    return { valid: false, error: "Job description seems too short." };
  }
  return { valid: true, error: "" };
}

/**
 * Basic email validation
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}