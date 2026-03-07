import { useAnalysis } from "../../context/AnalysisContext";

export default function LandingPage() {
  const { navigate } = useAnalysis();

  const features = [
    { icon: "🔍", title: "Resume Parsing", desc: "Paste your resume — we extract every skill automatically" },
    { icon: "📋", title: "JD Matching", desc: "Compare against any job description in seconds" },
    { icon: "📊", title: "Match Score", desc: "Get a % score showing how well you fit the role" },
    { icon: "📚", title: "Free Resources", desc: "YouTube & course links for every skill you're missing" },
  ];

  const steps = [
    { num: "01", label: "Paste your resume" },
    { num: "02", label: "Paste the job description" },
    { num: "03", label: "Get your gap analysis" },
    { num: "04", label: "Start learning & apply" },
  ];

  return (
    <main className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Free for students 🎓</div>
        <h1 className="hero-title">
          Know exactly what's<br />
          <span className="hero-accent">standing between you</span><br />
          and your dream job.
        </h1>
        <p className="hero-sub">
          Paste your resume + a job description. Our AI tells you which skills
          you're missing and where to learn them — for free.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("analyze")}>
            Analyze My Resume →
          </button>
          <span className="hero-note">No signup needed · 3 free analyses</span>
        </div>
        <div className="hero-score-preview">
          <div className="score-card">
            <div className="score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a2e" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f0a500" strokeWidth="8"
                  strokeDasharray="197" strokeDashoffset="53" strokeLinecap="round"
                  transform="rotate(-90 50 50)" />
              </svg>
              <div className="score-text">73%</div>
            </div>
            <div className="score-label">Match Score</div>
          </div>
          <div className="score-chips">
            <div className="chip matched">✓ React</div>
            <div className="chip matched">✓ Node.js</div>
            <div className="chip missing">✗ Docker</div>
            <div className="chip missing">✗ AWS</div>
            <div className="chip matched">✓ MongoDB</div>
            <div className="chip missing">✗ Redis</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to close your skill gap?</h2>
        <button className="btn-primary" onClick={() => navigate("analyze")}>
          Start for Free →
        </button>
      </section>
    </main>
  );
}