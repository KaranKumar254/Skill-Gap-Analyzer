import { useAnalysis } from "../../context/AnalysisContext";
import MatchScoreRing from "../ui/MatchScoreRing";
import SkillBadge from "../ui/SkillBadge";
import ResourceCard from "../ui/ResourceCard";

export default function ResultsPage() {
  const { analysisResult, navigate } = useAnalysis();

  if (!analysisResult) {
    return (
      <div className="empty-state">
        <p>No analysis yet.</p>
        <button className="btn-primary" onClick={() => navigate("analyze")}>
          Run Analysis
        </button>
      </div>
    );
  }

  const { matchScore, matchedSkills, missingSkills, resources, summary } = analysisResult;

  return (
    <main className="results-page">
      {/* Top bar */}
      <div className="results-header">
        <div>
          <h1>Your Gap Analysis</h1>
          <p className="results-sub">Here's how you stack up against the job</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("analyze")}>
          ← New Analysis
        </button>
      </div>

      {/* Score + summary row */}
      <div className="results-top-row">
        <div className="score-section">
          <MatchScoreRing score={matchScore} />
          <div className="score-verdict">
            {matchScore >= 80 && <span className="verdict great">🔥 Strong Match</span>}
            {matchScore >= 50 && matchScore < 80 && <span className="verdict good">👍 Good Start</span>}
            {matchScore < 50 && <span className="verdict gap">📈 Skill Up Needed</span>}
          </div>
        </div>
        <div className="summary-box">
          <h3>AI Summary</h3>
          <p>{summary}</p>
        </div>
      </div>

      {/* Skills grid */}
      <div className="skills-section">
        {/* Matched */}
        <div className="skills-panel matched-panel">
          <h2 className="skills-heading">
            <span className="heading-dot green" />
            Matched Skills
            <span className="skills-count">{matchedSkills.length}</span>
          </h2>
          <div className="skills-list">
            {matchedSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="matched" />
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="skills-panel missing-panel">
          <h2 className="skills-heading">
            <span className="heading-dot red" />
            Missing Skills
            <span className="skills-count">{missingSkills.length}</span>
          </h2>
          <div className="skills-list">
            {missingSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="resources-section">
        <h2 className="section-title">📚 Learning Resources for Missing Skills</h2>
        <p className="resources-sub">
          Free YouTube videos and courses to close your gaps
        </p>
        <div className="resources-grid">
          {resources.map((r) => (
            <ResourceCard key={r.skill} skill={r.skill} links={r.links} />
          ))}
        </div>
      </div>

      {/* Save prompt */}
      <div className="save-section">
        <p>Want to track your progress?</p>
        <button className="btn-primary">Save to History</button>
      </div>
    </main>
  );
}