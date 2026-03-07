/**
 * Animated SVG score ring
 * Usage: <MatchScoreRing score={73} />
 */
export default function MatchScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "var(--green)" : score >= 55 ? "var(--accent)" : "var(--red)";

  return (
    <div className="ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface2)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="ring-center">
        <strong style={{ color }}>{score}%</strong>
        <span>match</span>
      </div>
    </div>
  );
}