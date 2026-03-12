import { useState, useRef, createContext, useContext } from "react";

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
:root{--bg:#0b0b12;--surface:#111119;--surface2:#18181f;--border:#252530;--text:#e6e6f0;--muted:#6b6b90;--accent:#f0a500;--purple:#7c5cfc;--green:#22c55e;--red:#ef4444;--r:12px;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.65;min-height:100vh;}
h1,h2,h3,h4{font-family:'Syne',sans-serif;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 2.5rem;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(11,11,18,.92);backdrop-filter:blur(14px);z-index:100;}
.nav-brand{display:flex;align-items:center;gap:.5rem;cursor:pointer;font-family:'Syne',sans-serif;font-size:1.25rem;font-weight:800;color:var(--accent);}
.nav-links{display:flex;align-items:center;gap:1.5rem;}
.nav-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.9rem;transition:color .2s;font-family:'DM Sans',sans-serif;}
.nav-btn:hover,.nav-btn.active{color:var(--text);}
.nav-cta{background:var(--accent);color:#000;border:none;border-radius:8px;padding:.45rem 1.1rem;font-weight:700;font-family:'Syne',sans-serif;font-size:.82rem;cursor:pointer;}
.btn{display:inline-flex;align-items:center;gap:.5rem;border:none;border-radius:var(--r);padding:.75rem 1.75rem;font-weight:700;font-family:'Syne',sans-serif;font-size:.95rem;cursor:pointer;transition:transform .15s,opacity .2s;}
.btn:hover{transform:translateY(-1px);opacity:.9;}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none;}
.btn-y{background:var(--accent);color:#000;}
.btn-g{background:transparent;color:var(--muted);border:1px solid var(--border);}
.btn-g:hover{color:var(--text);}
.btn-d{background:transparent;color:var(--red);border:1px solid rgba(239,68,68,.3);}
/* LANDING */
.landing{max-width:1080px;margin:0 auto;padding:0 2rem 6rem;}
.hero{text-align:center;padding:5rem 0 4rem;}
.hero-pill{display:inline-block;background:rgba(240,165,0,.1);color:var(--accent);border:1px solid rgba(240,165,0,.3);border-radius:999px;padding:.3rem 1rem;font-size:.78rem;font-weight:600;margin-bottom:1.8rem;letter-spacing:.04em;text-transform:uppercase;}
.hero h1{font-size:clamp(2.4rem,5.5vw,4rem);font-weight:800;line-height:1.08;letter-spacing:-.02em;margin-bottom:1.4rem;}
.hero h1 em{font-style:normal;color:var(--accent);}
.hero>p{color:var(--muted);font-size:1.05rem;max-width:500px;margin:0 auto 2.2rem;}
.hero-actions{display:flex;flex-direction:column;align-items:center;gap:.6rem;}
.hero-note{color:var(--muted);font-size:.78rem;}
.preview-card{margin:3.5rem auto 0;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem 2.5rem;display:flex;align-items:center;justify-content:center;gap:2.5rem;max-width:560px;}
.preview-ring{position:relative;width:110px;height:110px;flex-shrink:0;}
.preview-ring svg{width:100%;height:100%;}
.preview-ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.preview-ring-label strong{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:var(--accent);}
.preview-ring-label span{color:var(--muted);font-size:.7rem;}
.preview-chips{display:flex;flex-wrap:wrap;gap:.45rem;max-width:240px;}
.chip{padding:.28rem .75rem;border-radius:999px;font-size:.78rem;font-weight:600;}
.cg{background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.25);}
.cr{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.25);}
.sec-title{font-size:1.7rem;font-weight:800;text-align:center;margin-bottom:2.5rem;}
.how{padding:4rem 0;}
.steps{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.step{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 2rem;min-width:150px;text-align:center;}
.step-num{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--accent);margin-bottom:.4rem;}
.step p{color:var(--muted);font-size:.85rem;}
.features{padding:4rem 0;}
.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1.25rem;}
.feat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1.6rem;transition:border-color .2s;}
.feat-card:hover{border-color:var(--purple);}
.feat-icon{font-size:1.6rem;margin-bottom:.7rem;}
.feat-card h3{font-size:.95rem;margin-bottom:.35rem;}
.feat-card p{color:var(--muted);font-size:.83rem;line-height:1.5;}
.cta-strip{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:3rem;text-align:center;margin:2rem 0;display:flex;flex-direction:column;align-items:center;gap:1.25rem;}
.cta-strip h2{font-size:2rem;}
/* FOOTER */
.footer{border-top:1px solid var(--border);padding:3rem 2.5rem 1.5rem;}
.footer-inner{max-width:1080px;margin:0 auto;display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:2rem;}
.footer-brand p{color:var(--muted);font-size:.82rem;margin-top:.4rem;max-width:260px;}
.footer-cols{display:flex;gap:3rem;}
.footer-col{display:flex;flex-direction:column;gap:.55rem;}
.footer-col h4{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.2rem;}
.footer-col button,.footer-col a{background:none;border:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.85rem;cursor:pointer;text-align:left;text-decoration:none;transition:color .2s;padding:0;}
.footer-col button:hover,.footer-col a:hover{color:var(--accent);}
.footer-bottom{max-width:1080px;margin:0 auto;display:flex;justify-content:space-between;padding-top:1.25rem;border-top:1px solid var(--border);color:var(--muted);font-size:.75rem;}
.footer-powered{color:var(--purple);}
/* ANALYZE */
.analyze-page{max-width:1200px;margin:0 auto;padding:3rem 2rem 5rem;}
.page-header{text-align:center;margin-bottom:2.5rem;}
.page-header h1{font-size:2rem;margin-bottom:.35rem;}
.page-header p{color:var(--muted);}
.error-bar{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:var(--red);border-radius:var(--r);padding:.7rem 1.2rem;margin-bottom:1.5rem;text-align:center;font-size:.88rem;}
.input-grid{display:grid;grid-template-columns:1fr 48px 1fr;}
.input-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;}
.panel-head{display:flex;align-items:center;gap:.6rem;padding:.85rem 1.2rem;border-bottom:1px solid var(--border);background:var(--surface2);flex-wrap:wrap;gap:.5rem;}
.panel-head strong{font-family:'Syne',sans-serif;font-size:.9rem;}
.tab-btns{margin-left:auto;display:flex;gap:.35rem;}
.tab-btn{background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:7px;padding:.28rem .75rem;font-size:.75rem;font-weight:600;font-family:'Syne',sans-serif;cursor:pointer;transition:all .2s;}
.tab-btn.active{background:var(--accent);color:#000;border-color:var(--accent);}
.tab-btn:hover:not(.active){color:var(--text);}
.text-area{width:100%;background:transparent;border:none;outline:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.85rem;line-height:1.7;padding:1.2rem;resize:vertical;min-height:400px;}
.text-area::placeholder{color:var(--border);}
.char-row{text-align:right;color:var(--muted);font-size:.72rem;padding:.3rem .9rem;border-top:1px solid var(--border);}
.upload-zone{border:2px dashed var(--border);border-radius:10px;padding:3rem 1.5rem;text-align:center;cursor:pointer;transition:border-color .2s;margin:1.2rem;}
.upload-zone:hover{border-color:var(--accent);}
.upload-zone-icon{font-size:2.2rem;margin-bottom:.6rem;}
.upload-zone h4{font-size:.92rem;margin-bottom:.3rem;}
.upload-zone p{color:var(--muted);font-size:.78rem;}
.file-preview{margin:1.2rem;background:var(--surface2);border-radius:10px;padding:1.1rem;}
.file-preview img{width:100%;max-height:260px;object-fit:contain;border-radius:8px;margin-bottom:.75rem;}
.file-info{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;}
.file-info-icon{font-size:1.8rem;}
.file-info-name{font-weight:600;font-size:.88rem;}
.file-info-meta{color:var(--muted);font-size:.75rem;margin-top:.1rem;}
.file-actions{display:flex;gap:.5rem;}
.file-btn{border-radius:7px;padding:.3rem .8rem;font-size:.75rem;cursor:pointer;font-family:'DM Sans',sans-serif;}
.file-btn-remove{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.3);}
.file-btn-replace{background:var(--surface);color:var(--muted);border:1px solid var(--border);}
.vs-col{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;padding:1rem .75rem;}
.vs-line{width:1px;flex:1;background:var(--border);}
.vs-text{font-family:'Syne',sans-serif;font-weight:800;font-size:.8rem;color:var(--muted);background:var(--bg);padding:.3rem;}
.analyze-foot{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin-top:2rem;}
.analyze-note{color:var(--muted);font-size:.78rem;}
.spin{display:inline-block;width:16px;height:16px;border:2.5px solid rgba(0,0,0,.2);border-top-color:#000;border-radius:50%;animation:rot .7s linear infinite;}
@keyframes rot{to{transform:rotate(360deg);}}
/* RESULTS */
.results-page{max-width:1080px;margin:0 auto;padding:3rem 2rem 5rem;}
.results-topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;}
.results-topbar h1{font-size:1.9rem;margin-bottom:.3rem;}
.results-topbar p{color:var(--muted);font-size:.9rem;}
.score-row{display:grid;grid-template-columns:auto 1fr;gap:2rem;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem;margin-bottom:2rem;}
.ring-wrap{position:relative;display:inline-block;}
.ring-wrap svg{display:block;}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.ring-center strong{font-family:'Syne',sans-serif;font-size:1.55rem;font-weight:800;}
.ring-center span{color:var(--muted);font-size:.68rem;}
.verdict-pill{display:inline-flex;align-items:center;padding:.3rem .9rem;border-radius:999px;font-size:.8rem;font-weight:600;margin-top:.75rem;}
.v-green{background:rgba(34,197,94,.1);color:var(--green);}
.v-yellow{background:rgba(240,165,0,.1);color:var(--accent);}
.v-red{background:rgba(239,68,68,.1);color:var(--red);}
.summary-box h3{font-size:.88rem;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.07em;}
.summary-box p{color:var(--text);line-height:1.7;font-size:.95rem;}
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:2.5rem;}
.skill-panel{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.4rem;}
.skill-panel-head{display:flex;align-items:center;gap:.55rem;font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;margin-bottom:1rem;}
.dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.dot-g{background:var(--green);}
.dot-r{background:var(--red);}
.count-pill{margin-left:auto;background:var(--surface2);border-radius:999px;padding:.1rem .55rem;font-size:.75rem;color:var(--muted);}
.skill-tags{display:flex;flex-wrap:wrap;gap:.45rem;}
.stag{padding:.3rem .8rem;border-radius:999px;font-size:.8rem;font-weight:500;}
.stag-g{background:rgba(34,197,94,.08);color:var(--green);border:1px solid rgba(34,197,94,.2);}
.stag-r{background:rgba(239,68,68,.08);color:var(--red);border:1px solid rgba(239,68,68,.2);}
.resources-section{margin-bottom:2.5rem;}
.resources-section h2{font-size:1.4rem;margin-bottom:.4rem;}
.resources-section>p{color:var(--muted);font-size:.88rem;margin-bottom:1.4rem;}
.res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.1rem;}
.res-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1.2rem;transition:border-color .2s;}
.res-card:hover{border-color:var(--purple);}
.res-skill{font-family:'Syne',sans-serif;font-weight:700;color:var(--accent);margin-bottom:.75rem;font-size:.9rem;}
.res-links{list-style:none;display:flex;flex-direction:column;gap:.45rem;}
.res-links a{color:var(--text);text-decoration:none;font-size:.83rem;display:flex;align-items:center;gap:.45rem;transition:color .2s;}
.res-links a:hover{color:var(--purple);}
.res-type{color:var(--muted);font-size:.72rem;}
.save-bar{margin-top:2.5rem;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.75rem;display:flex;align-items:center;justify-content:space-between;}
.save-bar p{color:var(--muted);font-size:.9rem;}
/* HISTORY */
.history-page{max-width:820px;margin:0 auto;padding:3rem 2rem 5rem;}
.history-topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;}
.history-topbar h1{font-size:1.9rem;}
.history-list{display:flex;flex-direction:column;gap:.9rem;}
.h-card{display:flex;align-items:center;gap:1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1.2rem 1.4rem;transition:background .2s;}
.h-card:hover{background:var(--surface2);}
.h-score{font-family:'Syne',sans-serif;font-size:1.55rem;font-weight:800;min-width:58px;text-align:center;}
.h-info{flex:1;}
.h-job{font-weight:600;font-size:.92rem;margin-bottom:.2rem;}
.h-date{color:var(--muted);font-size:.78rem;margin-bottom:.25rem;}
.h-missing{color:var(--red);font-size:.8rem;}
.h-actions{display:flex;gap:.5rem;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:6rem 2rem;text-align:center;}
.empty-icon{font-size:2.8rem;}
.empty h3{font-size:1.2rem;}
.empty p{color:var(--muted);font-size:.9rem;max-width:300px;}
@media(max-width:768px){
  .nav{padding:1rem 1.25rem;}.nav-links{gap:.75rem;}
  .input-grid{grid-template-columns:1fr;}
  .vs-col{flex-direction:row;padding:.75rem 0;}
  .vs-line{width:auto;height:1px;flex:1;}
  .skills-grid{grid-template-columns:1fr;}
  .score-row{grid-template-columns:1fr;}
  .preview-card{flex-direction:column;}
  .save-bar{flex-direction:column;gap:1rem;text-align:center;}
}
`;

// ── Shared UI ────────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "var(--green)" : score >= 55 ? "var(--accent)" : "var(--red)";
  return (
    <div className="ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface2)" strokeWidth="12"/>
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{transition:"stroke-dashoffset 1s ease"}}/>
      </svg>
      <div className="ring-center">
        <strong style={{color}}>{score}%</strong>
        <span>match</span>
      </div>
    </div>
  );
}

function Footer() {
  const { go } = useApp();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:800,color:"var(--accent)"}}>⚡ SkillGap</div>
          <p>Know exactly what's standing between you and your dream job.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Product</h4>
            <button onClick={() => go("analyze")}>Analyze Resume</button>
            <button onClick={() => go("history")}>History</button>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <a href="#">How it works</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SkillGap — Built for students & fresh graduates.</span>
        <span className="footer-powered">Powered by Claude AI</span>
      </div>
    </footer>
  );
}

// ── Input Panel (paste / pdf / photo) ───────────────────────────────────────

function InputPanel({ label, icon, text, setText, file, setFile }) {
  const [tab, setTab] = useState("paste");
  const [preview, setPreview] = useState("");
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const isPDF   = f.type === "application/pdf";
    if (!isImage && !isPDF) return;
    setFile(f);
    setPreview(isImage ? URL.createObjectURL(f) : "");
  };

  const onDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };
  const onPick = (e) => handleFile(e.target.files[0]);
  const clear  = () => { setFile(null); setPreview(""); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div className="input-panel">
      {/* Header */}
      <div className="panel-head">
        <span>{icon}</span>
        <strong>{label}</strong>
        <div className="tab-btns">
          <button className={`tab-btn ${tab==="paste"?"active":""}`} onClick={() => setTab("paste")}>✏️ Paste</button>
          <button className={`tab-btn ${tab==="pdf"  ?"active":""}`} onClick={() => setTab("pdf")  }>📎 PDF</button>
          <button className={`tab-btn ${tab==="photo"?"active":""}`} onClick={() => setTab("photo")}>🖼️ Photo</button>
        </div>
      </div>

      {/* Paste tab */}
      {tab === "paste" && (
        <>
          <textarea className="text-area" value={text} onChange={e => setText(e.target.value)}
            placeholder={label === "Your Resume"
              ? "Paste your full resume here...\n\nExample:\nJohn Doe | john@email.com\n\nSKILLS\nReact, Node.js, MongoDB, Git\n\nEXPERIENCE\nFrontend Developer @ Startup (2022–2024)\n- Built dashboards with React\n\nEDUCATION\nB.Tech CS, 2022"
              : "Paste the job description here...\n\nExample:\nSenior Full Stack Developer @ TechCorp\n\nRequirements:\n- 3+ years React experience\n- Node.js & Express\n- AWS / cloud deployment\n- Docker & Kubernetes\n- Redis for caching"
            } rows={18}/>
          <div className="char-row">{text.length} chars</div>
        </>
      )}

      {/* PDF / Photo tab */}
      {(tab === "pdf" || tab === "photo") && (
        <>
          {!file ? (
            <div className="upload-zone"
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
            >
              <div className="upload-zone-icon">{tab === "photo" ? "🖼️" : "📎"}</div>
              <h4>{tab === "photo" ? "Click or drag & drop image" : "Click or drag & drop PDF"}</h4>
              <p>{tab === "photo" ? "PNG, JPG, JPEG supported" : "PDF files only"}</p>
              <input ref={fileRef} type="file"
                accept={tab === "photo" ? "image/*" : "application/pdf"}
                style={{display:"none"}} onChange={onPick}/>
            </div>
          ) : (
            <div className="file-preview">
              {preview
                ? <img src={preview} alt="Uploaded resume"/>
                : (
                  <div className="file-info">
                    <div className="file-info-icon">📄</div>
                    <div>
                      <div className="file-info-name">{file.name}</div>
                      <div className="file-info-meta">{(file.size/1024).toFixed(1)} KB · PDF</div>
                    </div>
                  </div>
                )
              }
              <div className="file-actions">
                <button className="file-btn file-btn-remove" onClick={clear}>✕ Remove</button>
                <button className="file-btn file-btn-replace" onClick={() => fileRef.current.click()}>Replace</button>
              </div>
              <input ref={fileRef} type="file"
                accept={tab === "photo" ? "image/*" : "application/pdf"}
                style={{display:"none"}} onChange={onPick}/>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Pages ────────────────────────────────────────────────────────────────────

function LandingPage() {
  const { go } = useApp();
  const circ = 2 * Math.PI * 42;
  const features = [
    {icon:"🔍",title:"Resume Parsing",  desc:"Every skill extracted automatically from your resume."},
    {icon:"📋",title:"JD Matching",     desc:"Compare against any job description in seconds."},
    {icon:"📊",title:"Match Score",     desc:"Get a % score showing exactly how well you fit."},
    {icon:"📚",title:"Free Resources",  desc:"YouTube & course links for every missing skill."},
  ];
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-pill">Free for students 🎓</div>
        <h1>Know exactly what's<br/><em>standing between you</em><br/>and your dream job.</h1>
        <p>Paste your resume + a job description. Get your skill gap analysis in seconds.</p>
        <div className="hero-actions">
          <button className="btn btn-y" onClick={() => go("analyze")}>Analyze My Resume →</button>
          <span className="hero-note">No signup needed · 3 free analyses/month</span>
        </div>
        <div className="preview-card">
          <div className="preview-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface2)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={circ*0.27}
                strokeLinecap="round" transform="rotate(-90 50 50)"/>
            </svg>
            <div className="preview-ring-label"><strong>73%</strong><span>match</span></div>
          </div>
          <div className="preview-chips">
            {[["React ✓","cg"],["Node.js ✓","cg"],["MongoDB ✓","cg"],["Docker ✗","cr"],["AWS ✗","cr"],["Redis ✗","cr"]].map(([s,c])=>(
              <span key={s} className={`chip ${c}`}>{s}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="how">
        <h2 className="sec-title">How it works</h2>
        <div className="steps">
          {[["01","Paste your resume"],["02","Paste the job description"],["03","Get your gap analysis"],["04","Start learning & apply"]].map(([n,l])=>(
            <div className="step" key={n}><div className="step-num">{n}</div><p>{l}</p></div>
          ))}
        </div>
      </section>
      <section className="features">
        <h2 className="sec-title">Everything you need</h2>
        <div className="feat-grid">
          {features.map(f=>(
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3><p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="cta-strip">
        <h2>Ready to close your skill gap?</h2>
        <button className="btn btn-y" onClick={() => go("analyze")}>Start for Free →</button>
      </div>
      <Footer/>
    </main>
  );
}

function AnalyzePage() {
  const { go, setResult } = useApp();

  const API_URL = "https://skill-gap-analyzer-backend-3joo.onrender.com/api";

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile && resumeText.trim().length < 50) {
      setError("Please paste your resume or upload a file.");
      return;
    }

    if (!jdFile && jdText.trim().length < 30) {
      setError("Please paste the job description or upload a file.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let res, data;

      if (resumeFile || jdFile) {
        const fd = new FormData();

        if (resumeFile) {
          fd.append("resumeFile", resumeFile);
        } else {
          fd.append("resumeText", resumeText);
        }

        if (jdFile) {
          fd.append("jdFile", jdFile);
        } else {
          fd.append("jobDescription", jdText);
        }

        res = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          body: fd
        });

      } else {

        res = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            resumeText: resumeText,
            jobDescription: jdText
          })
        });

      }

      data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Server error");
      }

      setResult(data);
      go("results");

    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="analyze-page">
      <div className="page-header">
        <h1>Analyze Your Resume</h1>
        <p>Paste text, upload a PDF, or take a photo — then hit Analyze</p>
      </div>

      {error && <div className="error-bar">{error}</div>}

      <div className="input-grid">
        <InputPanel
          label="Your Resume"
          icon="📄"
          text={resumeText}
          setText={setResumeText}
          file={resumeFile}
          setFile={setResumeFile}
        />

        <div className="vs-col">
          <div className="vs-line" />
          <span className="vs-text">VS</span>
          <div className="vs-line" />
        </div>

        <InputPanel
          label="Job Description"
          icon="💼"
          text={jdText}
          setText={setJdText}
          file={jdFile}
          setFile={setJdFile}
        />
      </div>

      <div className="analyze-foot">
        <button
          className="btn btn-y"
          style={{ padding: "1rem 2.5rem", fontSize: "1rem" }}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spin" /> Analyzing…
            </>
          ) : (
            "⚡ Analyze My Gaps"
          )}
        </button>

        <span className="analyze-note">
          Takes ~10 seconds · Powered by Claude AI
        </span>
      </div>

      <Footer />
    </main>
  );
}

function ResultsPage() {
  const { go, result } = useApp();
  if (!result) return (
    <div className="empty">
      <div className="empty-icon">📊</div><h3>No analysis yet</h3>
      <p>Run an analysis to see your results here.</p>
      <button className="btn btn-y" onClick={() => go("analyze")}>Analyze Resume</button>
    </div>
  );
  const { matchScore, matchedSkills, missingSkills, resources, summary } = result;
  const vc = matchScore>=80?"v-green":matchScore>=55?"v-yellow":"v-red";
  const vl = matchScore>=80?"🔥 Strong Match":matchScore>=55?"👍 Good Start":"📈 Skill Up Needed";
  return (
    <main className="results-page">
      <div className="results-topbar">
        <div><h1>Your Gap Analysis</h1><p>Here's how you stack up against the job</p></div>
        <button className="btn btn-g" onClick={() => go("analyze")}>← New Analysis</button>
      </div>
      <div className="score-row">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".5rem"}}>
          <ScoreRing score={matchScore}/>
          <span className={`verdict-pill ${vc}`}>{vl}</span>
        </div>
        <div className="summary-box">
          <h3>AI Summary</h3><p>{summary}</p>
        </div>
      </div>
      <div className="skills-grid">
        <div className="skill-panel">
          <div className="skill-panel-head"><span className="dot dot-g"/>Matched Skills<span className="count-pill">{matchedSkills.length}</span></div>
          <div className="skill-tags">{matchedSkills.map(s=><span key={s} className="stag stag-g">✓ {s}</span>)}</div>
        </div>
        <div className="skill-panel">
          <div className="skill-panel-head"><span className="dot dot-r"/>Missing Skills<span className="count-pill">{missingSkills.length}</span></div>
          <div className="skill-tags">{missingSkills.map(s=><span key={s} className="stag stag-r">✗ {s}</span>)}</div>
        </div>
      </div>
      <div className="resources-section">
        <h2>📚 Learning Resources</h2>
        <p>Free YouTube videos & courses to close your gaps</p>
        <div className="res-grid">
          {resources?.map(r=>(
            <div className="res-card" key={r.skill}>
              <div className="res-skill">{r.skill}</div>
              <ul className="res-links">
                {r.links?.map((l,i)=>(
                  <li key={i}><a href={l.url} target="_blank" rel="noopener noreferrer">
                    <span className="res-type">{l.type==="youtube"?"▶":"📖"}</span>{l.title}
                  </a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="save-bar">
        <p>Save this analysis to track your progress over time</p>
        <button className="btn btn-y">Save to History</button>
      </div>
      <Footer/>
    </main>
  );
}

function HistoryPage() {
  const { go } = useApp();
  const history = [
    {_id:"1",createdAt:"2026-03-01",matchScore:73,jobTitle:"Frontend Developer @ Zepto",     missingSkills:["Docker","AWS","Redis"]},
    {_id:"2",createdAt:"2026-02-25",matchScore:55,jobTitle:"Full Stack Engineer @ Razorpay", missingSkills:["Kubernetes","Go","gRPC"]},
    {_id:"3",createdAt:"2026-02-18",matchScore:88,jobTitle:"React Developer @ Freshworks",   missingSkills:["Storybook"]},
  ];
  const sc = s => s>=80?"var(--green)":s>=55?"var(--accent)":"var(--red)";
  const fd = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  return (
    <main className="history-page">
      <div className="history-topbar">
        <h1>Analysis History</h1>
        <button className="btn btn-y" onClick={() => go("analyze")}>+ New Analysis</button>
      </div>
      <div className="history-list">
        {history.map(item=>(
          <div className="h-card" key={item._id}>
            <div className="h-score" style={{color:sc(item.matchScore)}}>{item.matchScore}%</div>
            <div className="h-info">
              <div className="h-job">{item.jobTitle}</div>
              <div className="h-date">{fd(item.createdAt)}</div>
              <div className="h-missing">Missing: {item.missingSkills.join(", ")}</div>
            </div>
            <div className="h-actions">
              <button className="btn btn-g" style={{padding:".4rem .9rem",fontSize:".82rem"}} onClick={() => go("results")}>View →</button>
              <button className="btn btn-d" style={{padding:".4rem .75rem",fontSize:".82rem"}}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </main>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]     = useState("landing");
  const [result, setResult] = useState(null);
  const go = p => setPage(p);
  return (
    <AppCtx.Provider value={{ go, result, setResult }}>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-brand" onClick={() => go("landing")}>⚡ SkillGap</div>
        <div className="nav-links">
          <button className={`nav-btn ${page==="analyze"?"active":""}`} onClick={() => go("analyze")}>Analyze</button>
          <button className={`nav-btn ${page==="history"?"active":""}`} onClick={() => go("history")}>History</button>
          <button className="nav-cta" onClick={() => go("analyze")}>Try Free</button>
        </div>
      </nav>
      {page==="landing" && <LandingPage/>}
      {page==="analyze" && <AnalyzePage/>}
      {page==="results" && <ResultsPage/>}
      {page==="history" && <HistoryPage/>}
    </AppCtx.Provider>
  );
}
