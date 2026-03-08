import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (bypasses ES module dotenv issues) ────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(join(__dirname, "../.env"), "utf-8");
  envFile.split("\n").forEach(line => {
    const [key, ...vals] = line.trim().split("=");
    if (key && !key.startsWith("#") && key.trim())
      process.env[key.trim()] = vals.join("=").trim();
  });
} catch (e) { console.warn("⚠️  Could not read .env:", e.message); }

// ══════════════════════════════════════════════════════════════
//  LAYER 1 — TEXT PRE-PROCESSING
//  Clean raw PDF/OCR/paste text before sending to AI
// ══════════════════════════════════════════════════════════════
export function preprocessText(raw = "") {
  return raw
    // Remove null bytes, zero-width chars
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Normalize multiple spaces/tabs to single space
    .replace(/[ \t]{2,}/g, " ")
    // Normalize multiple blank lines to max 2
    .replace(/\n{3,}/g, "\n\n")
    // Fix common PDF artifacts: "J a v a S c r i p t" → "JavaScript"
    .replace(/\b([A-Z])\s(?=[A-Z]\s)/g, "$1")
    // Fix ligatures
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .trim();
}

// ══════════════════════════════════════════════════════════════
//  LAYER 2 — SKILL NORMALIZATION
//  Maps 200+ variants → canonical names
// ══════════════════════════════════════════════════════════════
const ALIAS = {
  // JavaScript ecosystem
  "js":"JavaScript","javascript":"JavaScript","es6":"JavaScript","es2015":"JavaScript","ecmascript":"JavaScript",
  "ts":"TypeScript","typescript":"TypeScript",
  "react":"React","reactjs":"React","react.js":"React","react js":"React",
  "next":"Next.js","nextjs":"Next.js","next.js":"Next.js",
  "vue":"Vue.js","vuejs":"Vue.js","vue.js":"Vue.js","vue js":"Vue.js",
  "angular":"Angular","angularjs":"Angular","angular.js":"Angular",
  "svelte":"Svelte","sveltekit":"SvelteKit",
  "redux":"Redux","zustand":"Zustand","recoil":"Recoil",
  "node":"Node.js","nodejs":"Node.js","node.js":"Node.js","node js":"Node.js",
  "express":"Express","expressjs":"Express","express.js":"Express",
  "nestjs":"NestJS","nest.js":"NestJS","nest":"NestJS",
  "graphql":"GraphQL","graph ql":"GraphQL",
  "rest":"REST APIs","restful":"REST APIs","rest api":"REST APIs","rest apis":"REST APIs","api":"REST APIs",
  // Python ecosystem
  "py":"Python","python":"Python","python3":"Python","python 3":"Python",
  "django":"Django","flask":"Flask","fastapi":"FastAPI","fast api":"FastAPI",
  "numpy":"NumPy","pandas":"Pandas","scikit":"Scikit-learn","sklearn":"Scikit-learn","scikit-learn":"Scikit-learn",
  "tensorflow":"TensorFlow","tf":"TensorFlow","pytorch":"PyTorch","torch":"PyTorch","keras":"Keras",
  // Java / JVM
  "java":"Java","spring":"Spring Boot","spring boot":"Spring Boot","springboot":"Spring Boot",
  "kotlin":"Kotlin","scala":"Scala","maven":"Maven","gradle":"Gradle","hibernate":"Hibernate",
  // Cloud
  "aws":"AWS","amazon web services":"AWS","amazon aws":"AWS",
  "gcp":"GCP","google cloud":"GCP","google cloud platform":"GCP",
  "azure":"Azure","microsoft azure":"Azure","azure cloud":"Azure",
  "heroku":"Heroku","vercel":"Vercel","netlify":"Netlify","digitalocean":"DigitalOcean",
  // DevOps
  "docker":"Docker","containers":"Docker",
  "k8s":"Kubernetes","kubernetes":"Kubernetes","kube":"Kubernetes",
  "ci/cd":"CI/CD","cicd":"CI/CD","ci cd":"CI/CD","continuous integration":"CI/CD","continuous deployment":"CI/CD",
  "jenkins":"Jenkins","github actions":"GitHub Actions","gitlab ci":"GitLab CI","circleci":"CircleCI",
  "terraform":"Terraform","ansible":"Ansible","chef":"Chef","puppet":"Puppet",
  "nginx":"Nginx","apache":"Apache",
  // Databases
  "sql":"SQL","mysql":"MySQL","postgres":"PostgreSQL","postgresql":"PostgreSQL","pg":"PostgreSQL",
  "mongo":"MongoDB","mongodb":"MongoDB","mongoose":"MongoDB",
  "redis":"Redis","cassandra":"Cassandra","elasticsearch":"Elasticsearch","elastic search":"Elasticsearch",
  "dynamodb":"DynamoDB","dynamo":"DynamoDB","firestore":"Firestore","firebase":"Firebase",
  "sqlite":"SQLite","oracle":"Oracle DB","mssql":"SQL Server","sql server":"SQL Server",
  // Tools & practices
  "git":"Git","github":"GitHub","gitlab":"GitLab","bitbucket":"Bitbucket","svn":"SVN",
  "linux":"Linux","unix":"Linux","ubuntu":"Linux","bash":"Bash","shell":"Shell Scripting","shell scripting":"Shell Scripting",
  "agile":"Agile","scrum":"Scrum","kanban":"Kanban","jira":"Jira","confluence":"Confluence",
  "tdd":"TDD","bdd":"BDD","unit testing":"Unit Testing","jest":"Jest","mocha":"Mocha","cypress":"Cypress","selenium":"Selenium",
  "websocket":"WebSockets","websockets":"WebSockets","socket.io":"Socket.io",
  "microservices":"Microservices","micro services":"Microservices","serverless":"Serverless",
  "ml":"Machine Learning","machine learning":"Machine Learning","ai":"AI/ML","artificial intelligence":"AI/ML","deep learning":"Deep Learning","nlp":"NLP","computer vision":"Computer Vision",
  "dsa":"Data Structures","data structures":"Data Structures","algorithms":"Algorithms","ds":"Data Structures",
  "system design":"System Design","low level design":"Low Level Design","high level design":"High Level Design","lld":"Low Level Design","hld":"High Level Design",
  "html":"HTML","html5":"HTML","css":"CSS","css3":"CSS","sass":"Sass","scss":"Sass","tailwind":"Tailwind CSS","tailwindcss":"Tailwind CSS","bootstrap":"Bootstrap","material ui":"Material UI","mui":"Material UI","chakra":"Chakra UI",
  "react native":"React Native","flutter":"Flutter","dart":"Dart","swift":"Swift","ios":"iOS","android":"Android","kotlin android":"Android",
  "figma":"Figma","sketch":"Sketch","adobe xd":"Adobe XD","ui/ux":"UI/UX","ux":"UI/UX","prototyping":"Prototyping",
  "blockchain":"Blockchain","solidity":"Solidity","web3":"Web3","smart contracts":"Smart Contracts",
  "c":"C","c++":"C++","cpp":"C++","c#":"C#","csharp":"C#",".net":".NET","dotnet":".NET","asp.net":"ASP.NET",
  "php":"PHP","laravel":"Laravel","symfony":"Symfony","wordpress":"WordPress",
  "ruby":"Ruby","rails":"Ruby on Rails","ruby on rails":"Ruby on Rails","ror":"Ruby on Rails",
  "go":"Golang","golang":"Golang","rust":"Rust",
  "oauth":"OAuth","jwt":"JWT","ssl":"SSL/TLS","tls":"SSL/TLS","security":"Security","penetration testing":"Penetration Testing","owasp":"OWASP",
  "rabbitmq":"RabbitMQ","kafka":"Apache Kafka","celery":"Celery","message queue":"Message Queue",
};

export function normalizeSkill(s) {
  if (!s) return "";
  const key = s.toLowerCase().trim()
    .replace(/[^a-z0-9./#+\s-]/gi, "")  // strip non-skill chars
    .trim();
  return ALIAS[key] || s.trim();
}

export function normalizeSkillList(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  return arr
    .map(normalizeSkill)
    .filter(s => {
      if (!s || s.length < 2 || seen.has(s.toLowerCase())) return false;
      seen.add(s.toLowerCase());
      return true;
    });
}

// ══════════════════════════════════════════════════════════════
//  LAYER 3 — KEYWORD EXTRACTION BACKUP
//  If AI misses skills, this catches them from raw text
// ══════════════════════════════════════════════════════════════
const ALL_KNOWN_SKILLS = [
  "React","Next.js","Vue.js","Angular","Svelte","SvelteKit",
  "JavaScript","TypeScript","HTML","CSS","Sass","Tailwind CSS","Bootstrap","Material UI",
  "Node.js","Express","NestJS","GraphQL","REST APIs","WebSockets","Socket.io",
  "Python","Django","Flask","FastAPI","NumPy","Pandas","Scikit-learn","TensorFlow","PyTorch","Keras",
  "Java","Spring Boot","Hibernate","Maven","Gradle","Kotlin","Scala",
  "C","C++","C#",".NET","ASP.NET","PHP","Laravel","Ruby","Ruby on Rails","Go","Golang","Rust",
  "SQL","MySQL","PostgreSQL","MongoDB","Redis","Elasticsearch","DynamoDB","Firestore","Firebase","SQLite","Oracle DB","SQL Server","Cassandra",
  "AWS","GCP","Azure","Heroku","Vercel","Netlify","DigitalOcean",
  "Docker","Kubernetes","CI/CD","Jenkins","GitHub Actions","GitLab CI","CircleCI","Terraform","Ansible","Nginx",
  "Git","GitHub","GitLab","Bitbucket","Linux","Bash","Shell Scripting",
  "Machine Learning","Deep Learning","AI/ML","NLP","Computer Vision",
  "Data Structures","Algorithms","System Design","Low Level Design","High Level Design",
  "Microservices","Serverless","Message Queue","RabbitMQ","Apache Kafka",
  "Agile","Scrum","Jira","TDD","Jest","Cypress","Selenium","Mocha",
  "React Native","Flutter","Swift","iOS","Android",
  "OAuth","JWT","SSL/TLS","Security","OWASP",
  "Figma","UI/UX","Prototyping",
  "Blockchain","Solidity","Web3","Smart Contracts",
  "Redux","Zustand","Webpack","Vite","Babel",
];

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  return ALL_KNOWN_SKILLS.filter(skill =>
    lower.includes(skill.toLowerCase())
  );
}

// ══════════════════════════════════════════════════════════════
//  LAYER 4 — SCORE CALCULATION
//  Never fully trust AI score — blend with real math
// ══════════════════════════════════════════════════════════════
function computeAccurateScore(aiScore, matched, missing, resumeText, jdText) {
  const total = matched.length + missing.length;
  if (total === 0) return Math.min(aiScore, 50);

  // Keyword-based score from actual text
  const jdSkills     = extractSkillsFromText(jdText);
  const resumeSkills = extractSkillsFromText(resumeText);
  const jdSet        = new Set(jdSkills.map(s => s.toLowerCase()));
  const resumeSet    = new Set(resumeSkills.map(s => s.toLowerCase()));
  const overlap      = [...jdSet].filter(s => resumeSet.has(s)).length;
  const keywordScore = jdSet.size > 0 ? Math.round((overlap / jdSet.size) * 100) : 0;

  // AI skill-list based score
  const listScore = Math.round((matched.length / total) * 100);

  // Weighted blend:  AI 30% + list 40% + keyword 30%
  const blended = Math.round(aiScore * 0.30 + listScore * 0.40 + keywordScore * 0.30);
  return Math.max(5, Math.min(97, blended));
}

// ══════════════════════════════════════════════════════════════
//  LAYER 5 — VERIFIED RESOURCE LIBRARY
//  Each skill has: video link, article link, AND study notes
// ══════════════════════════════════════════════════════════════
const RESOURCE_DB = {
  "React": {
    links: [
      { title:"React Full Course – Bro Code",        url:"https://www.youtube.com/watch?v=CgkZ7MvWUAA",                                                    type:"youtube" },
      { title:"React Official Docs – react.dev",     url:"https://react.dev/learn",                                                                        type:"article" },
      { title:"React Cheatsheet – devhints.io",      url:"https://devhints.io/react",                                                                      type:"notes"   },
      { title:"React Hooks Cheatsheet",              url:"https://react-hooks-cheatsheet.com/",                                                             type:"notes"   },
    ],
  },
  "Next.js": {
    links: [
      { title:"Next.js Crash Course – Traversy",     url:"https://www.youtube.com/watch?v=mTz0GXj8NN0",                                                    type:"youtube" },
      { title:"Next.js Official Docs",               url:"https://nextjs.org/docs",                                                                        type:"article" },
      { title:"Next.js Cheatsheet – Zero To Mastery", url:"https://zerotomastery.io/cheatsheets/nextjs-cheat-sheet/",                                      type:"notes"   },
    ],
  },
  "Vue.js": {
    links: [
      { title:"Vue.js Crash Course – Traversy",      url:"https://www.youtube.com/watch?v=qZXt1Aom3Cs",                                                    type:"youtube" },
      { title:"Vue.js Official Guide",               url:"https://vuejs.org/guide/",                                                                       type:"article" },
      { title:"Vue.js Cheatsheet – devhints.io",     url:"https://devhints.io/vue",                                                                        type:"notes"   },
    ],
  },
  "Angular": {
    links: [
      { title:"Angular Crash Course – Traversy",     url:"https://www.youtube.com/watch?v=3dHNOWTI7H8",                                                    type:"youtube" },
      { title:"Angular Official Tutorial",           url:"https://angular.io/tutorial",                                                                    type:"article" },
      { title:"Angular Cheatsheet – Official",       url:"https://angular.io/guide/cheatsheet",                                                            type:"notes"   },
    ],
  },
  "TypeScript": {
    links: [
      { title:"TypeScript Full Course – Fireship",   url:"https://www.youtube.com/watch?v=ahCwqrYpIuM",                                                    type:"youtube" },
      { title:"TypeScript Handbook",                 url:"https://www.typescriptlang.org/docs/handbook/",                                                  type:"article" },
      { title:"TypeScript Cheatsheet – devhints.io", url:"https://devhints.io/typescript",                                                                 type:"notes"   },
      { title:"TypeScript Cheat Sheets – Official",  url:"https://www.typescriptlang.org/cheatsheets/",                                                    type:"notes"   },
    ],
  },
  "JavaScript": {
    links: [
      { title:"JavaScript Full Course – FreeCodeCamp", url:"https://www.youtube.com/watch?v=PkZNo7MFNFg",                                                  type:"youtube" },
      { title:"MDN JavaScript Guide",                url:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",                                  type:"article" },
      { title:"JavaScript Cheatsheet – devhints.io", url:"https://devhints.io/es6",                                                                        type:"notes"   },
      { title:"JS CheatSheet – htmlcheatsheet.com",  url:"https://htmlcheatsheet.com/js/",                                                                 type:"notes"   },
    ],
  },
  "Node.js": {
    links: [
      { title:"Node.js Crash Course – Net Ninja",    url:"https://www.youtube.com/watch?v=fBNz5xF-Kx4",                                                    type:"youtube" },
      { title:"Node.js Official Docs",               url:"https://nodejs.org/en/docs/",                                                                    type:"article" },
      { title:"Node.js Cheatsheet – devhints.io",    url:"https://devhints.io/nodejs",                                                                     type:"notes"   },
    ],
  },
  "Express": {
    links: [
      { title:"Express.js Crash Course – Traversy",  url:"https://www.youtube.com/watch?v=L72fhGm1tfE",                                                    type:"youtube" },
      { title:"Express Official Docs",               url:"https://expressjs.com/en/starter/installing.html",                                               type:"article" },
      { title:"Express.js Cheatsheet – devhints.io", url:"https://devhints.io/express",                                                                    type:"notes"   },
    ],
  },
  "Python": {
    links: [
      { title:"Python Full Course – FreeCodeCamp",   url:"https://www.youtube.com/watch?v=rfscVS0vtbw",                                                    type:"youtube" },
      { title:"Python Official Tutorial",            url:"https://docs.python.org/3/tutorial/",                                                            type:"article" },
      { title:"Python Cheatsheet – pythoncheatsheet.org", url:"https://www.pythoncheatsheet.org/",                                                         type:"notes"   },
      { title:"Python Quick Reference – devhints.io", url:"https://devhints.io/python",                                                                    type:"notes"   },
    ],
  },
  "Django": {
    links: [
      { title:"Django Full Course – FreeCodeCamp",   url:"https://www.youtube.com/watch?v=F5mRW0jo-U4",                                                    type:"youtube" },
      { title:"Django Official Tutorial",            url:"https://docs.djangoproject.com/en/stable/intro/tutorial01/",                                     type:"article" },
      { title:"Django Cheatsheet – devhints.io",     url:"https://devhints.io/django",                                                                     type:"notes"   },
    ],
  },
  "Flask": {
    links: [
      { title:"Flask Full Course – FreeCodeCamp",    url:"https://www.youtube.com/watch?v=Qr4QMBUPxWo",                                                    type:"youtube" },
      { title:"Flask Official Docs",                 url:"https://flask.palletsprojects.com/quickstart/",                                                  type:"article" },
      { title:"Flask Cheatsheet – devhints.io",      url:"https://devhints.io/flask",                                                                      type:"notes"   },
    ],
  },
  "FastAPI": {
    links: [
      { title:"FastAPI Full Course – FreeCodeCamp",  url:"https://www.youtube.com/watch?v=0sOvCWFmrtA",                                                    type:"youtube" },
      { title:"FastAPI Official Docs",               url:"https://fastapi.tiangolo.com/tutorial/",                                                         type:"article" },
      { title:"FastAPI Cheatsheet – KomodoHype",     url:"https://github.com/zhanymkanov/fastapi-best-practices",                                          type:"notes"   },
    ],
  },
  "Machine Learning": {
    links: [
      { title:"ML Full Course – Andrew Ng",          url:"https://www.youtube.com/watch?v=jGwO_UgTS7I",                                                    type:"youtube" },
      { title:"Google ML Crash Course (Free)",       url:"https://developers.google.com/machine-learning/crash-course",                                    type:"course"  },
      { title:"ML Cheatsheet – ml-cheatsheet.io",    url:"https://ml-cheatsheet.readthedocs.io/en/latest/",                                                type:"notes"   },
      { title:"Scikit-learn Cheatsheet – DataCamp",  url:"https://www.datacamp.com/cheat-sheet/scikit-learn-cheat-sheet-python-machine-learning",          type:"notes"   },
    ],
  },
  "Deep Learning": {
    links: [
      { title:"Deep Learning Specialization Preview", url:"https://www.youtube.com/watch?v=CS4cs9xVecg",                                                   type:"youtube" },
      { title:"Fast.ai Free Deep Learning Course",   url:"https://course.fast.ai/",                                                                        type:"course"  },
      { title:"Deep Learning Cheatsheet – Stanford", url:"https://stanford.edu/~shervine/teaching/cs-229/cheatsheet-deep-learning",                        type:"notes"   },
    ],
  },
  "TensorFlow": {
    links: [
      { title:"TensorFlow 2.0 Full Course",          url:"https://www.youtube.com/watch?v=tPYj3fFJGjk",                                                    type:"youtube" },
      { title:"TensorFlow Official Tutorials",       url:"https://www.tensorflow.org/tutorials",                                                           type:"article" },
      { title:"Keras/TF Cheatsheet – DataCamp",      url:"https://www.datacamp.com/cheat-sheet/keras-cheat-sheet-neural-networks-in-python",               type:"notes"   },
    ],
  },
  "Docker": {
    links: [
      { title:"Docker in 100 Seconds – Fireship",    url:"https://www.youtube.com/watch?v=Gjnup-PuquQ",                                                    type:"youtube" },
      { title:"Docker Full Course – FreeCodeCamp",   url:"https://www.youtube.com/watch?v=fqMOX6JJhGo",                                                    type:"youtube" },
      { title:"Docker Cheatsheet – devhints.io",     url:"https://devhints.io/docker",                                                                     type:"notes"   },
      { title:"Docker CLI Cheatsheet – Official",    url:"https://docs.docker.com/get-started/docker_cheatsheet.pdf",                                      type:"notes"   },
    ],
  },
  "Kubernetes": {
    links: [
      { title:"Kubernetes Crash Course – TechWorld",  url:"https://www.youtube.com/watch?v=s_o8dwzRlu4",                                                   type:"youtube" },
      { title:"Kubernetes Official Tutorials",        url:"https://kubernetes.io/docs/tutorials/",                                                         type:"article" },
      { title:"kubectl Cheatsheet – Official",        url:"https://kubernetes.io/docs/reference/kubectl/cheatsheet/",                                      type:"notes"   },
    ],
  },
  "AWS": {
    links: [
      { title:"AWS Full Course – FreeCodeCamp",      url:"https://www.youtube.com/watch?v=ulprqHHWlng",                                                    type:"youtube" },
      { title:"AWS Digital Training (Free)",         url:"https://aws.amazon.com/training/digital/",                                                       type:"course"  },
      { title:"AWS Services Cheatsheet – TutorialsDojo", url:"https://tutorialsdojo.com/aws-cheat-sheets/",                                               type:"notes"   },
    ],
  },
  "GCP": {
    links: [
      { title:"GCP Full Course – FreeCodeCamp",      url:"https://www.youtube.com/watch?v=IeMYQ-qJeK4",                                                    type:"youtube" },
      { title:"Google Cloud Skills Boost (Free)",    url:"https://www.cloudskillsboost.google/",                                                           type:"course"  },
      { title:"GCP Cheatsheet – GoogleCloudCheatSheet", url:"https://googlecloudcheatsheet.withgoogle.com/",                                              type:"notes"   },
    ],
  },
  "Azure": {
    links: [
      { title:"Azure Full Course – FreeCodeCamp",    url:"https://www.youtube.com/watch?v=NKEFWyqJ5XA",                                                    type:"youtube" },
      { title:"Microsoft Learn – Azure (Free)",      url:"https://learn.microsoft.com/en-us/azure/",                                                       type:"course"  },
      { title:"Azure Cheatsheet – TutorialsDojo",    url:"https://tutorialsdojo.com/microsoft-azure-cheat-sheets/",                                        type:"notes"   },
    ],
  },
  "CI/CD": {
    links: [
      { title:"CI/CD Pipeline Tutorial – TechWorld", url:"https://www.youtube.com/watch?v=R8_veQiYBjI",                                                    type:"youtube" },
      { title:"GitHub Actions Quickstart",           url:"https://docs.github.com/en/actions/quickstart",                                                  type:"article" },
      { title:"GitHub Actions Cheatsheet",           url:"https://resources.github.com/actions/github-actions-cheat-sheet/",                               type:"notes"   },
    ],
  },
  "SQL": {
    links: [
      { title:"SQL Full Course – FreeCodeCamp",      url:"https://www.youtube.com/watch?v=HXV3zeQKqGY",                                                    type:"youtube" },
      { title:"SQLZoo Interactive Tutorial",         url:"https://sqlzoo.net/",                                                                            type:"course"  },
      { title:"SQL Cheatsheet – sqltutorial.org",    url:"https://www.sqltutorial.org/sql-cheat-sheet/",                                                   type:"notes"   },
      { title:"SQL Quick Reference – w3schools",     url:"https://www.w3schools.com/sql/sql_quickref.asp",                                                 type:"notes"   },
    ],
  },
  "PostgreSQL": {
    links: [
      { title:"PostgreSQL Tutorial for Beginners",   url:"https://www.youtube.com/watch?v=qw--VYLpxG4",                                                    type:"youtube" },
      { title:"PostgreSQL Official Tutorial",        url:"https://www.postgresql.org/docs/current/tutorial.html",                                          type:"article" },
      { title:"PostgreSQL Cheatsheet – devhints.io", url:"https://devhints.io/postgresql",                                                                 type:"notes"   },
    ],
  },
  "MongoDB": {
    links: [
      { title:"MongoDB Crash Course – Web Dev Simplified", url:"https://www.youtube.com/watch?v=-56x56UppqQ",                                             type:"youtube" },
      { title:"MongoDB University (Free)",           url:"https://learn.mongodb.com/",                                                                     type:"course"  },
      { title:"MongoDB Cheatsheet – devhints.io",    url:"https://devhints.io/mongodb",                                                                    type:"notes"   },
    ],
  },
  "Redis": {
    links: [
      { title:"Redis Crash Course – TechWorld",      url:"https://www.youtube.com/watch?v=jgpVdJB2sKQ",                                                    type:"youtube" },
      { title:"Redis Official Docs",                 url:"https://redis.io/docs/",                                                                         type:"article" },
      { title:"Redis Commands Cheatsheet",           url:"https://redis.io/docs/latest/commands/",                                                         type:"notes"   },
    ],
  },
  "GraphQL": {
    links: [
      { title:"GraphQL Full Course – FreeCodeCamp",  url:"https://www.youtube.com/watch?v=ed8SzALpx1Q",                                                    type:"youtube" },
      { title:"GraphQL Official Learn Guide",        url:"https://graphql.org/learn/",                                                                     type:"article" },
      { title:"GraphQL Cheatsheet – devhints.io",    url:"https://devhints.io/graphql",                                                                    type:"notes"   },
    ],
  },
  "Linux": {
    links: [
      { title:"Linux Command Line – FreeCodeCamp",   url:"https://www.youtube.com/watch?v=iwolPf6kN-k",                                                    type:"youtube" },
      { title:"Linux Foundation Free Courses",       url:"https://training.linuxfoundation.org/resources/?_sft_content_type=free-course",                  type:"course"  },
      { title:"Linux Command Cheatsheet – devhints", url:"https://devhints.io/bash",                                                                       type:"notes"   },
      { title:"Linux Commands Cheatsheet – FOSSMint", url:"https://www.fossmint.com/linux-commands-cheat-sheet/",                                         type:"notes"   },
    ],
  },
  "Git": {
    links: [
      { title:"Git & GitHub Full Course – FreeCodeCamp", url:"https://www.youtube.com/watch?v=RGOj5yH7evk",                                               type:"youtube" },
      { title:"Pro Git Book (Free)",                 url:"https://git-scm.com/book/en/v2",                                                                 type:"article" },
      { title:"Git Cheatsheet – GitHub Official",    url:"https://education.github.com/git-cheat-sheet-education.pdf",                                     type:"notes"   },
      { title:"Git Cheatsheet – devhints.io",        url:"https://devhints.io/git-log",                                                                    type:"notes"   },
    ],
  },
  "System Design": {
    links: [
      { title:"System Design Full Course – Gaurav Sen", url:"https://www.youtube.com/watch?v=xpDnVSmNFX0",                                                 type:"youtube" },
      { title:"System Design Primer – GitHub",       url:"https://github.com/donnemartin/system-design-primer",                                            type:"article" },
      { title:"System Design Cheatsheet – Vivek Nayyar", url:"https://gist.github.com/vasanthk/485d1c25737e8e72759f",                                     type:"notes"   },
    ],
  },
  "Data Structures": {
    links: [
      { title:"DSA Full Course – FreeCodeCamp",      url:"https://www.youtube.com/watch?v=8hly31xKli0",                                                    type:"youtube" },
      { title:"Visualgo – Visual DS & Algorithms",   url:"https://visualgo.net/",                                                                          type:"course"  },
      { title:"Big-O Cheatsheet – bigocheatsheet.com", url:"https://www.bigocheatsheet.com/",                                                             type:"notes"   },
    ],
  },
  "Spring Boot": {
    links: [
      { title:"Spring Boot Full Course – Amigoscode", url:"https://www.youtube.com/watch?v=9SGDpanrc8U",                                                   type:"youtube" },
      { title:"Spring Official Guides",              url:"https://spring.io/guides",                                                                       type:"article" },
      { title:"Spring Boot Cheatsheet – devhints.io", url:"https://devhints.io/spring-boot",                                                              type:"notes"   },
    ],
  },
  "React Native": {
    links: [
      { title:"React Native Full Course – FreeCodeCamp", url:"https://www.youtube.com/watch?v=obH0Po_RdWk",                                               type:"youtube" },
      { title:"React Native Official Docs",          url:"https://reactnative.dev/docs/getting-started",                                                   type:"article" },
      { title:"React Native Cheatsheet – devhints",  url:"https://devhints.io/react-native",                                                               type:"notes"   },
    ],
  },
  "Flutter": {
    links: [
      { title:"Flutter Full Course – FreeCodeCamp",  url:"https://www.youtube.com/watch?v=VPvVD8t02U8",                                                    type:"youtube" },
      { title:"Flutter Official Docs",               url:"https://docs.flutter.dev/get-started/codelab",                                                   type:"article" },
      { title:"Flutter Widget Cheatsheet – Official", url:"https://docs.flutter.dev/ui/widgets",                                                           type:"notes"   },
    ],
  },
  "Tailwind CSS": {
    links: [
      { title:"Tailwind CSS Crash Course – Traversy", url:"https://www.youtube.com/watch?v=UBOj6rqRUME",                                                   type:"youtube" },
      { title:"Tailwind CSS Official Docs",          url:"https://tailwindcss.com/docs/",                                                                  type:"article" },
      { title:"Tailwind Cheatsheet – nerdcave.com",  url:"https://nerdcave.com/tailwind-cheat-sheet",                                                      type:"notes"   },
    ],
  },
  "NLP": {
    links: [
      { title:"NLP Full Course – FreeCodeCamp",      url:"https://www.youtube.com/watch?v=X2vAabgKiuM",                                                    type:"youtube" },
      { title:"HuggingFace NLP Course (Free)",       url:"https://huggingface.co/learn/nlp-course/",                                                       type:"course"  },
      { title:"NLP Cheatsheet – Stanford CS224N",    url:"https://stanford.edu/~shervine/teaching/cs-224n/",                                               type:"notes"   },
    ],
  },
  "Golang": {
    links: [
      { title:"Go Full Course – FreeCodeCamp",       url:"https://www.youtube.com/watch?v=YS4e4q9oBaU",                                                    type:"youtube" },
      { title:"Go Official Tour",                    url:"https://go.dev/tour/",                                                                           type:"article" },
      { title:"Go Cheatsheet – devhints.io",         url:"https://devhints.io/go",                                                                         type:"notes"   },
    ],
  },
  "Rust": {
    links: [
      { title:"Rust Full Course – FreeCodeCamp",     url:"https://www.youtube.com/watch?v=BpPEoZW5IiY",                                                    type:"youtube" },
      { title:"Rust Official Book (Free)",           url:"https://doc.rust-lang.org/book/",                                                                type:"article" },
      { title:"Rust Cheatsheet – cheats.rs",         url:"https://cheats.rs/",                                                                             type:"notes"   },
    ],
  },
  "Microservices": {
    links: [
      { title:"Microservices Full Course – FreeCodeCamp", url:"https://www.youtube.com/watch?v=lL_j7ilk7rc",                                              type:"youtube" },
      { title:"Microservices.io Patterns",           url:"https://microservices.io/patterns/",                                                             type:"article" },
      { title:"Microservices Cheatsheet – DZone",    url:"https://dzone.com/articles/microservices-cheat-sheet",                                           type:"notes"   },
    ],
  },
};

function buildResources(missingSkills, aiResources = []) {
  return missingSkills.slice(0, 7).map(skill => {
    // 1. Use our verified library first
    if (RESOURCE_DB[skill]) {
      return { skill, links: RESOURCE_DB[skill].links };
    }
    // 2. Try AI-provided resources if they look valid
    const aiRes = aiResources.find(r => r.skill?.toLowerCase() === skill.toLowerCase());
    const validLinks = aiRes?.links?.filter(l => l.url?.startsWith("http") && l.title) || [];
    return {
      skill,
      links: validLinks.length ? validLinks.slice(0, 3) : [
        { title:`${skill} Full Course – YouTube`,  url:`https://www.youtube.com/results?search_query=${encodeURIComponent(skill+" full course tutorial")}`, type:"youtube"  },
        { title:`${skill} Official Documentation`, url:`https://www.google.com/search?q=${encodeURIComponent(skill+" official documentation")}`,           type:"article"  },
        { title:`${skill} Cheatsheet – devhints`,  url:`https://devhints.io/${encodeURIComponent(skill.toLowerCase().replace(/\s+/g,"-"))}`,               type:"notes"    },
      ],
    };
  });
}

// ══════════════════════════════════════════════════════════════
//  LAYER 6 — THE PROMPT
//  Ultra-specific, structured, leaves no room for AI guessing
// ══════════════════════════════════════════════════════════════
function buildPrompt(resumeText, jobDescription) {
  return `You are a SENIOR TECHNICAL RECRUITER with 15+ years of experience at top tech companies. Your job is to perform a precise, thorough skill gap analysis.

TASK:
1. Read the RESUME and extract every technical skill, tool, framework, language, platform, and methodology mentioned.
2. Read the JOB DESCRIPTION and extract every skill/requirement — both explicit ("must have React") and implicit ("build UIs" implies frontend skills).
3. Classify each JD skill as: MATCHED (clearly present in resume) or MISSING (not found in resume).
4. Calculate a realistic match score.

SCORING RULES (follow strictly):
- If candidate matches 90%+ of JD skills → score 88–95
- If candidate matches 75–89% → score 72–87
- If candidate matches 55–74% → score 55–71
- If candidate matches 35–54% → score 35–54
- If candidate matches <35% → score 10–34
- Adjust ±5 based on: years of experience relevance, seniority level match, domain match

OUTPUT FORMAT: Respond ONLY with a valid JSON object. No markdown. No backticks. No extra text before or after.

{
  "matchScore": <integer 0-100>,
  "jobTitle": "<exact job title from JD>",
  "summary": "<3 sentences: 1) strongest matching areas, 2) most critical gaps, 3) overall hiring recommendation>",
  "matchedSkills": ["<skill1>", "<skill2>", ...],
  "missingSkills": ["<skill1>", "<skill2>", ...],
  "resources": [
    {
      "skill": "<missing skill name>",
      "links": [
        { "title": "<specific resource title>", "url": "https://...", "type": "youtube|course|article" }
      ]
    }
  ]
}

IMPORTANT RULES:
- Be THOROUGH: extract all skills, don't skip anything mentioned
- Be ACCURATE: only put skill in matchedSkills if it's genuinely present in resume
- Normalize skill names: "ReactJS"→"React", "NodeJS"→"Node.js", "JS"→"JavaScript"
- Do NOT duplicate skills across matched and missing
- Resources should be free YouTube videos or official docs only
- Limit resources to top 6 most critical missing skills

═══════════════════════════════
RESUME:
${resumeText.slice(0, 4500)}

═══════════════════════════════
JOB DESCRIPTION:
${jobDescription.slice(0, 2800)}
═══════════════════════════════`;
}

// ══════════════════════════════════════════════════════════════
//  LAYER 7 — RESULT VALIDATION & REPAIR
//  Fix any malformed AI output before returning to user
// ══════════════════════════════════════════════════════════════
function validateAndRepair(parsed, resumeText, jdText) {
  const errors = [];

  // Ensure required fields
  if (typeof parsed.matchScore !== "number" || isNaN(parsed.matchScore)) {
    errors.push("invalid matchScore");
    parsed.matchScore = 50;
  }
  if (!parsed.jobTitle || typeof parsed.jobTitle !== "string") {
    // Try to extract from JD text
    const titleMatch = jdText.match(/(?:job title|position|role)[:\s]+([^\n.]{5,60})/i);
    parsed.jobTitle = titleMatch ? titleMatch[1].trim() : "Job Position";
  }
  if (!parsed.summary || parsed.summary.length < 20) {
    parsed.summary = "Analysis complete. Review matched and missing skills above.";
  }
  if (!Array.isArray(parsed.matchedSkills)) { errors.push("matchedSkills not array"); parsed.matchedSkills = []; }
  if (!Array.isArray(parsed.missingSkills)) { errors.push("missingSkills not array"); parsed.missingSkills = []; }
  if (!Array.isArray(parsed.resources))     { errors.push("resources not array");     parsed.resources     = []; }

  // If AI returned very few skills, augment with keyword extraction
  if (parsed.matchedSkills.length + parsed.missingSkills.length < 3) {
    console.warn("⚠️  AI returned very few skills — augmenting with keyword extraction");
    const jdExtracted     = extractSkillsFromText(jdText);
    const resumeExtracted = extractSkillsFromText(resumeText);
    const resumeSet       = new Set(resumeExtracted.map(s => s.toLowerCase()));
    const aiMatched       = new Set(parsed.matchedSkills.map(s => s.toLowerCase()));
    const aiMissing       = new Set(parsed.missingSkills.map(s => s.toLowerCase()));
    jdExtracted.forEach(skill => {
      const key = skill.toLowerCase();
      if (!aiMatched.has(key) && !aiMissing.has(key)) {
        if (resumeSet.has(key)) parsed.matchedSkills.push(skill);
        else                    parsed.missingSkills.push(skill);
      }
    });
  }

  if (errors.length) console.warn("⚠️  Repaired AI output fields:", errors.join(", "));
  return parsed;
}

// ══════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export const analyzeWithClaude = async (rawResume, rawJD) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set in .env file");
  console.log("🔑 Groq key:", apiKey.slice(0, 10) + "...");

  // Layer 1: Pre-process text
  const resumeText     = preprocessText(rawResume);
  const jobDescription = preprocessText(rawJD);
  console.log(`📝 Resume: ${resumeText.length} chars | JD: ${jobDescription.length} chars`);

  let lastError;

  // Try up to 3 attempts for reliability
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🤖 Groq attempt ${attempt}/3...`);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:  "POST",
        headers: { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
        body: JSON.stringify({
          model:       "llama-3.3-70b-versatile",
          temperature: 0.05,   // very low = most deterministic & accurate
          max_tokens:  3000,
          messages: [
            {
              role:    "system",
              content: "You are a precise technical recruiter. You ONLY output valid JSON. No markdown, no backticks, no preamble, no explanation. Just the raw JSON object."
            },
            {
              role:    "user",
              content: buildPrompt(resumeText, jobDescription)
            }
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `Groq error ${response.status}`);

      const raw = data.choices?.[0]?.message?.content ?? "";
      console.log("📄 Raw AI (first 300):", raw.slice(0, 300));

      // Extract JSON robustly
      const cleaned   = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found in AI response");
      const parsed = JSON.parse(jsonMatch[0]);

      // Layer 7: Validate & repair
      const repaired = validateAndRepair(parsed, resumeText, jobDescription);

      // Layer 2: Normalize skill names
      const matchedSkills = normalizeSkillList(repaired.matchedSkills);
      const matchedSet    = new Set(matchedSkills.map(s => s.toLowerCase()));
      const missingSkills = normalizeSkillList(repaired.missingSkills)
        .filter(s => !matchedSet.has(s.toLowerCase())); // no duplicates

      // Layer 4: Accurate score
      const finalScore = computeAccurateScore(
        Number(repaired.matchScore), matchedSkills, missingSkills, resumeText, jobDescription
      );

      // Layer 5: Verified resources
      const resources = buildResources(missingSkills, repaired.resources);

      const result = {
        matchScore:    finalScore,
        jobTitle:      repaired.jobTitle,
        summary:       repaired.summary,
        matchedSkills,
        missingSkills,
        resources,
      };

      console.log(`✅ Done → Score:${finalScore}% | Matched:${matchedSkills.length} | Missing:${missingSkills.length}`);
      return result;

    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err.message);
      lastError = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 1500));
    }
  }

  throw new Error(`AI analysis failed after 3 attempts: ${lastError?.message}`);
};
