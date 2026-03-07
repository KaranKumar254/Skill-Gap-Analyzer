/**
 * Format ISO date string → "1 Mar 2026"
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Return a label + color based on match score
 */
export function getScoreVerdict(score) {
  if (score >= 80) return { label: "🔥 Strong Match",      color: "#22c55e" };
  if (score >= 60) return { label: "👍 Good Start",        color: "#f0a500" };
  if (score >= 40) return { label: "📈 Needs Work",        color: "#f97316" };
  return              { label: "⚠️ Skill Up Needed",      color: "#ef4444" };
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(str, maxLength = 120) {
  if (!str) return "";
  return str.length <= maxLength ? str : str.slice(0, maxLength) + "…";
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}