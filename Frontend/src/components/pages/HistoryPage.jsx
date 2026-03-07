import { useAnalysis } from "../../context/AnalysisContext";

// Mock history data — will come from MongoDB API later
const mockHistory = [
  {
    _id: "1",
    createdAt: "2026-03-01",
    matchScore: 73,
    jobTitle: "Frontend Developer @ Zepto",
    missingSkills: ["Docker", "AWS", "Redis"],
  },
  {
    _id: "2",
    createdAt: "2026-02-25",
    matchScore: 55,
    jobTitle: "Full Stack Engineer @ Razorpay",
    missingSkills: ["Kubernetes", "Go", "gRPC"],
  },
  {
    _id: "3",
    createdAt: "2026-02-18",
    matchScore: 88,
    jobTitle: "React Developer @ Freshworks",
    missingSkills: ["Storybook"],
  },
];

export default function HistoryPage() {
  const { navigate, setAnalysisResult } = useAnalysis();

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#f0a500";
    return "#ef4444";
  };

  return (
    <main className="history-page">
      <div className="history-header">
        <h1>Analysis History</h1>
        <button className="btn-primary" onClick={() => navigate("analyze")}>
          + New Analysis
        </button>
      </div>

      {mockHistory.length === 0 ? (
        <div className="empty-state">
          <p>No analyses yet. Run your first one!</p>
          <button className="btn-primary" onClick={() => navigate("analyze")}>
            Analyze Resume
          </button>
        </div>
      ) : (
        <div className="history-list">
          {mockHistory.map((item) => (
            <div className="history-card" key={item._id}>
              <div className="history-score" style={{ color: getScoreColor(item.matchScore) }}>
                {item.matchScore}%
              </div>
              <div className="history-info">
                <div className="history-job">{item.jobTitle}</div>
                <div className="history-date">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </div>
                <div className="history-missing">
                  Missing: {item.missingSkills.join(", ")}
                </div>
              </div>
              <button className="btn-ghost">View →</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}