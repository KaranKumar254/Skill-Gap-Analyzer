import { useApp } from "../../context/AnalysisContext";

export default function Navbar({ page }) {
  const { go } = useApp();
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => go("landing")}>
        ⚡ <em>SkillGap</em>
      </div>
      <div className="nav-links">
        <button className={`nav-btn ${page === "analyze" ? "active" : ""}`} onClick={() => go("analyze")}>Analyze</button>
        <button className={`nav-btn ${page === "history" ? "active" : ""}`} onClick={() => go("history")}>History</button>
        <button className="nav-cta" onClick={() => go("analyze")}>Try Free</button>
      </div>
    </nav>
  );
}