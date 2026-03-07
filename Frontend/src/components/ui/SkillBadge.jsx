/**
 * Colored skill pill badge
 * Usage: <SkillBadge skill="React" type="matched" />
 *        <SkillBadge skill="Docker" type="missing" />
 */
export default function SkillBadge({ skill, type }) {
  const isMatched = type === "matched";
  return (
    <span className={`stag ${isMatched ? "stag-g" : "stag-r"}`}>
      {isMatched ? "✓" : "✗"} {skill}
    </span>
  );
}