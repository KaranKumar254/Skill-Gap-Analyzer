/**
 * Card showing free learning resources for a missing skill
 * Usage:
 * <ResourceCard
 *   skill="Docker"
 *   links={[{ title: "Docker in 100 Seconds", url: "https://...", type: "youtube" }]}
 * />
 */
export default function ResourceCard({ skill, links }) {
  return (
    <div className="res-card">
      <div className="res-skill">{skill}</div>
      <ul className="res-links">
        {links?.map((link, i) => (
          <li key={i}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <span className="res-type">{link.type === "youtube" ? "▶" : "📖"}</span>
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}