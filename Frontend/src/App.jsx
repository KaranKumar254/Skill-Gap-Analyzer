import { useState, useRef, useEffect, createContext, useContext } from "react";

/* ─────────────────────────────────────────────────────────────
   SESSION
───────────────────────────────────────────────────────────── */
const getSessionId = () => {
  let id = localStorage.getItem("sg_session");
  if (!id) {
    id = "sg_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("sg_session", id);
  }
  return id;
};

/* ─────────────────────────────────────────────────────────────
   SKILL NOTES  (shown when user taps "View Notes")
───────────────────────────────────────────────────────────── */
const SKILL_NOTES = {
  "React":           "React is a JavaScript UI library by Meta. Key topics: JSX syntax, useState & useEffect hooks, props vs state, component lifecycle, conditional rendering, lists & keys, React Router for navigation. Build projects: todo app → weather app → full CRUD app. Interview focus: virtual DOM, reconciliation algorithm, rules of hooks.",
  "Next.js":         "Next.js adds SSR, SSG & ISR on top of React. Key topics: file-based routing, getServerSideProps vs getStaticProps vs getStaticPaths, API routes, Image optimisation, App Router (Next 13+), middleware. Essential for SEO-critical & production full-stack React apps.",
  "Vue.js":          "Vue is a progressive frontend framework. Key topics: Options API vs Composition API, v-bind / v-model directives, computed properties, watchers, Vue Router, Pinia for state management. Popular in Asian tech markets and startups.",
  "Angular":         "Angular is a full TypeScript-based framework by Google. Key topics: NgModules, components, dependency injection (IoC), RxJS observables, reactive forms, Angular Router, HttpClient. Heavily used in enterprise applications. TypeScript knowledge is mandatory first.",
  "TypeScript":      "TypeScript adds static typing to JavaScript. Key topics: type annotations, interfaces vs type aliases, generics, union & intersection types, enums, and utility types (Partial, Pick, Omit, Record). Start by converting a plain JS project to TS. Required at most mid/senior frontend positions.",
  "JavaScript":      "JavaScript is the core web language. Must know: closures, hoisting, event loop & call stack, promises & async/await, prototype chain, ES6+ (destructuring, spread/rest, arrow functions, modules), DOM manipulation, Fetch API. Practice LeetCode Easy–Medium to sharpen logic.",
  "Node.js":         "Node.js runs JavaScript on the server using an event-driven, non-blocking I/O model. Key topics: npm/package.json, core modules (fs, path, http, events), building REST APIs with Express, middleware pattern, error handling, environment variables with dotenv.",
  "Express":         "Express is the #1 Node.js web framework. Key topics: routing, middleware stack (cors, morgan, body-parser), RESTful API design, error-handling middleware, database connections (MongoDB/PostgreSQL), JWT authentication, file uploads with Multer.",
  "Python":          "Python is the #1 language for data science, ML & scripting. Key topics: data types, list comprehensions, functions, classes & OOP, file I/O, virtual environments, pip. For backend: Flask/FastAPI. For data: NumPy, Pandas, Matplotlib, Seaborn.",
  "Django":          "Django is Python's batteries-included web framework. Key topics: MTV architecture, ORM (models + migrations), views, URL routing, Jinja2 templates, Django REST Framework (DRF) for APIs, built-in authentication & admin panel.",
  "Flask":           "Flask is a lightweight Python web framework ideal for APIs & microservices. Key topics: routes, request/response objects, Jinja2 templates, SQLAlchemy ORM, Blueprint for modularity, Flask-JWT for auth. More flexible than Django but needs more manual setup.",
  "FastAPI":         "FastAPI is Python's fastest async framework. Built on Pydantic & Starlette. Key topics: path/query parameters, request body, dependency injection, OAuth2/JWT, background tasks, auto-generated Swagger & ReDoc documentation.",
  "Machine Learning":"ML core: supervised vs unsupervised learning, regression, classification, clustering, overfitting/underfitting, bias-variance tradeoff, train/test/validation split, cross-validation, evaluation metrics (accuracy, precision, recall, F1, AUC-ROC). Libraries: scikit-learn for classical ML, TensorFlow/PyTorch for deep learning.",
  "Deep Learning":   "Deep learning builds multi-layer neural networks. Key topics: perceptrons, activation functions (ReLU/sigmoid/softmax), backpropagation, CNNs (image tasks), RNNs/LSTMs (sequences), Transformers (NLP/vision), batch normalisation, dropout, transfer learning.",
  "TensorFlow":      "TensorFlow 2.x uses Keras as its high-level API. Key topics: Sequential vs Functional model API, common layers (Dense, Conv2D, LSTM, Dropout), model compilation (optimizer, loss, metrics), training loops, callbacks (ModelCheckpoint, EarlyStopping), saving & loading models.",
  "Docker":          "Docker containerises apps for consistent environments. Must know: Dockerfile commands (FROM, RUN, COPY, CMD, EXPOSE, ENV), building & tagging images, running containers with port mapping, volumes, environment variables, and Docker Compose for multi-container setups. Interview question: explain image vs container.",
  "Kubernetes":      "Kubernetes (K8s) orchestrates Docker containers at scale. Key resources: Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, PersistentVolumes, HPA (auto-scaling). Learn kubectl commands, rolling updates, namespaces & RBAC. Practice locally with Minikube or kind.",
  "AWS":             "AWS is the #1 cloud platform. For most dev roles focus on: EC2 (VMs), S3 (object storage), RDS (managed DB), Lambda (serverless), IAM (permissions), VPC (networking), CloudWatch (monitoring), API Gateway. Start with AWS Cloud Practitioner (CLF-C02) certification.",
  "GCP":             "Google Cloud Platform dominates in ML & data engineering. Key services: Compute Engine, Cloud Run (serverless containers), Cloud Storage, BigQuery (data warehouse), Pub/Sub (messaging), Firestore, Vertex AI. Free $300 credit for new users. Start with Google Cloud Skills Boost.",
  "Azure":           "Azure is dominant in enterprise companies. Key services: Azure VMs, App Service (web hosting), Azure Functions (serverless), Azure SQL, Cosmos DB, Blob Storage, Active Directory, AKS (managed K8s). AZ-900 (Azure Fundamentals) certification is a strong differentiator for enterprise roles.",
  "CI/CD":           "CI/CD automates build → test → deploy. CI: auto-run tests on every commit. CD: auto-deploy passing builds. Tools: GitHub Actions (most common), Jenkins, GitLab CI, CircleCI. Learn to write a YAML pipeline that installs deps → runs tests → builds a Docker image → deploys to cloud.",
  "SQL":             "SQL is essential for almost every backend/data role. Must know: SELECT with WHERE, GROUP BY, HAVING, ORDER BY; all JOIN types (INNER/LEFT/RIGHT/FULL/CROSS); subqueries; window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD); indexes & query optimisation. Practice 30+ LeetCode SQL problems.",
  "PostgreSQL":      "PostgreSQL is the most feature-rich open-source relational database. Beyond standard SQL: JSONB columns, CTEs (WITH clauses), full-text search, pl/pgSQL stored functions, triggers, EXPLAIN ANALYZE for query tuning, and PgBouncer for connection pooling.",
  "MongoDB":         "MongoDB is a NoSQL document database. Key topics: documents vs collections, BSON format, CRUD operations, aggregation pipeline ($match, $group, $lookup, $project), indexing, schema design patterns (embedding vs referencing), Mongoose ODM for Node.js.",
  "Redis":           "Redis is an in-memory data store for caching, sessions, pub/sub & rate limiting. Key data structures: strings, hashes, lists, sets, sorted sets. Important features: TTL (key expiration), Redis Pub/Sub, Redis Streams. Classic interview question: design an API rate limiter using Redis.",
  "GraphQL":         "GraphQL is a query language & runtime for APIs — a flexible alternative to REST. Key concepts: schema definition (types, queries, mutations, subscriptions), resolvers, DataLoader to solve the N+1 problem, Apollo Server (backend) & Apollo Client (frontend), fragments, and variables.",
  "Linux":           "Linux is the OS of almost every production server. Essential commands: ls/cd/pwd/mkdir/rm/cp/mv, cat/grep/awk/sed for text processing, chmod/chown for permissions, ps/kill/top for processes, ssh/scp for remote access, cron for scheduling, systemctl for services, and piping (|). Learn Bash scripting for automation.",
  "Git":             "Git is non-negotiable for every developer. Must know: init/clone, add/commit/push/pull, branching (checkout -b, switch), merging vs rebasing, resolving merge conflicts, stash, reset (soft/mixed/hard) vs revert, cherry-pick, and pull requests. Interview: explain Git Flow / trunk-based development.",
  "System Design":   "System Design is tested at mid/senior interviews. Topics: horizontal vs vertical scaling, load balancing, caching (Redis, CDN), database choices (SQL vs NoSQL, sharding, replication), message queues (Kafka, RabbitMQ), microservices vs monolith, rate limiting, CAP theorem. Practice designing: URL shortener, Twitter feed, Netflix, WhatsApp.",
  "Data Structures": "DSA is in almost every coding interview. Master: Arrays, Strings, Linked Lists, Stacks & Queues, HashMaps & HashSets, Binary Trees & BST, BFS & DFS, Heaps/Priority Queues, Graphs, and basic Dynamic Programming (memoisation, tabulation). Aim for 50+ LeetCode Easy/Medium before any interview.",
  "Spring Boot":     "Spring Boot is the standard Java enterprise backend framework. Key topics: dependency injection with @Component/@Service/@Repository/@Controller, building REST APIs, JPA/Hibernate ORM with @Entity, Spring Security for auth (JWT), application.properties/yaml configuration, Maven or Gradle build tools.",
  "React Native":    "React Native builds native iOS & Android apps using JavaScript & React. Key topics: core components (View, Text, Image, ScrollView, FlatList, TextInput), StyleSheet API, React Navigation for routing, state management (Context/Redux/Zustand), platform-specific code (Platform.OS), and Expo for rapid development.",
  "Flutter":         "Flutter builds cross-platform apps (iOS, Android, Web, Desktop) from a single Dart codebase. Key topics: Stateless vs Stateful widgets, widget tree & build method, layout widgets (Row/Column/Stack/Container), state management (setState, Provider, Riverpod, Bloc), async with Future & Stream.",
  "Tailwind CSS":    "Tailwind is a utility-first CSS framework — style directly in HTML using class names. Key utility groups: spacing (p-/m-), sizing (w-/h-/max-w-), flexbox (flex/justify-/items-), grid, typography (text-/font-/leading-), colours, responsive prefixes (sm:/md:/lg:/xl:), and dark mode variant.",
  "NLP":             "NLP covers: text classification, sentiment analysis, NER (named entity recognition), machine translation, summarisation & QA. Key concepts: tokenisation, word embeddings (Word2Vec, GloVe), attention mechanism, Transformer architecture (BERT, GPT, T5), and fine-tuning pretrained models on HuggingFace.",
  "Golang":          "Go (Golang) is designed for performance, simplicity & concurrency. Key features: goroutines (ultra-lightweight threads), channels for communication, select statement, interfaces (implicit), error handling with multiple return values, structs with methods, defer, and the rich standard library.",
  "Rust":            "Rust is a systems language focused on memory safety without a garbage collector. Core concepts: ownership rules, borrowing & references, lifetimes, enums with rich pattern matching, traits (like interfaces), the borrow checker. Steep learning curve but most loved language on Stack Overflow for 9 years running.",
  "Microservices":   "Microservices architecture splits an app into small independent services. Key patterns: API Gateway, Service Discovery, Circuit Breaker (resilience), Saga pattern (distributed transactions), event-driven communication (Kafka/RabbitMQ), distributed tracing (Jaeger/Zipkin). Usually deployed with Docker + Kubernetes.",
  "Blockchain":      "Blockchain is a distributed, immutable ledger. Key concepts: blocks, chains, consensus mechanisms (PoW/PoS), public/private keys, wallets, smart contracts (self-executing code on-chain), gas fees on Ethereum. For development: learn Solidity, Hardhat/Foundry, and ethers.js/web3.js.",
  "Solidity":        "Solidity is Ethereum's smart contract language. Key topics: data types, state variables, functions (view/pure/payable), modifiers, events, mappings, structs, inheritance, interfaces, error handling (require/revert/assert), and security patterns (reentrancy guard, access control). Use Hardhat or Remix IDE.",
  "Redux":           "Redux is a predictable state container for JS apps. Key concepts: single source of truth (store), pure reducer functions, actions & action creators, dispatch, selectors, and Redux Toolkit (modern Redux with createSlice, createAsyncThunk). Understand when Redux is overkill vs necessary.",
  "Jest":            "Jest is the #1 JavaScript testing framework. Key topics: writing test suites (describe/it/test), matchers (expect().toBe/.toEqual/.toThrow), mocking (jest.fn(), jest.mock()), async testing (async/await in tests), code coverage reports, and snapshot testing for UI components.",
};

const AppCtx = createContext(null);
const useApp  = () => useContext(AppCtx);

/* ─────────────────────────────────────────────────────────────
   CSS  — injected into <head> via useEffect so body[data-theme]
          selectors work on the actual document body
───────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* ══ RESET ══ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

/* ══ THEMES ══ */
:root{--dur:.3s}

body{
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:15px;line-height:1.65;
  overflow-x:hidden;
  transition:background var(--dur),color var(--dur);
  min-height:100vh;
}

/* DARK */
body[data-theme="dark"]{
  --bg:#07071a; --bg2:#0e0e28;
  --sur:#111130; --sur2:#181840; --sur3:#1f1f52;
  --bdr:#252560; --bdr2:#3a3a9a;
  --txt:#eeeeff; --txt2:#9898cc; --txt3:#55558a;
  --acc:#7c6fff; --acc2:#ff6b9d;
  --cyan:#00d4ff; --grn:#00ffaa; --red:#ff4d7a; --ylw:#ffc700;
  --glo:rgba(124,111,255,.28); --glo2:rgba(0,212,255,.16);
  --shd:0 24px 64px rgba(0,0,0,.55); --shdsm:0 4px 20px rgba(0,0,0,.4);
  --nav:rgba(7,7,26,.9);
  --inp:#0e0e28;
  color:#eeeeff;
  background:#07071a;
}

/* LIGHT */
body[data-theme="light"]{
  --bg:#f4f3ff; --bg2:#eceaff;
  --sur:#ffffff; --sur2:#f1efff; --sur3:#e6e3ff;
  --bdr:#d8d4ff; --bdr2:#b0a8ff;
  --txt:#140f3a; --txt2:#443e78; --txt3:#8e8ab8;
  --acc:#5c4fff; --acc2:#ff4580;
  --cyan:#007aaa; --grn:#00875e; --red:#c8284e; --ylw:#a87000;
  --glo:rgba(92,79,255,.16); --glo2:rgba(0,122,170,.12);
  --shd:0 8px 40px rgba(92,79,255,.14); --shdsm:0 2px 14px rgba(92,79,255,.1);
  --nav:rgba(244,243,255,.95);
  --inp:#ffffff;
  color:#140f3a;
  background:#f4f3ff;
}

/* ══ BACKGROUND ══ */
.bg-fixed{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(110px)}
body[data-theme="dark"]  .blob1{width:700px;height:700px;top:-200px;left:-120px;background:radial-gradient(circle,rgba(124,111,255,.22),transparent 70%);animation:bm 14s ease-in-out infinite}
body[data-theme="dark"]  .blob2{width:550px;height:550px;bottom:-100px;right:-90px;background:radial-gradient(circle,rgba(0,212,255,.14),transparent 70%);animation:bm 17s ease-in-out infinite reverse}
body[data-theme="dark"]  .blob3{width:400px;height:400px;top:45%;left:38%;background:radial-gradient(circle,rgba(255,107,157,.07),transparent 70%);animation:bm 11s ease-in-out infinite 5s}
body[data-theme="light"] .blob1{width:700px;height:700px;top:-200px;left:-120px;background:radial-gradient(circle,rgba(92,79,255,.1),transparent 70%);animation:bm 14s ease-in-out infinite}
body[data-theme="light"] .blob2{width:550px;height:550px;bottom:-100px;right:-90px;background:radial-gradient(circle,rgba(0,122,170,.08),transparent 70%);animation:bm 17s ease-in-out infinite reverse}
body[data-theme="light"] .blob3{width:400px;height:400px;top:45%;left:38%;background:radial-gradient(circle,rgba(255,69,128,.05),transparent 70%);animation:bm 11s ease-in-out infinite 5s}

.bg-grid{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(var(--bdr) 1px,transparent 1px),linear-gradient(90deg,var(--bdr) 1px,transparent 1px);
  background-size:64px 64px;opacity:.3;
}

@keyframes bm{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(35px,-25px) scale(1.06)}66%{transform:translate(-25px,18px) scale(.95)}}

/* ══ ANIMATIONS ══ */
@keyframes fadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn  {from{opacity:0}to{opacity:1}}
@keyframes slideIn {from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn {from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}}
@keyframes spin    {to{transform:rotate(360deg)}}
@keyframes shimmer {0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes pulse   {0%,100%{box-shadow:0 0 14px var(--glo)}50%{box-shadow:0 0 36px var(--glo),0 0 56px var(--glo2)}}
@keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

/* ══ NAV ══ */
nav.nav{
  position:sticky;top:0;z-index:999;
  display:flex;align-items:center;justify-content:space-between;
  padding:.9rem 2.5rem;
  background:var(--nav);backdrop-filter:blur(28px) saturate(2);
  border-bottom:1px solid var(--bdr);
  transition:background var(--dur),border-color var(--dur);
}
nav.nav::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--acc),var(--cyan),transparent);opacity:.45;
}
.nbrand{display:flex;align-items:center;gap:.6rem;cursor:pointer;text-decoration:none}
.nlogo{
  width:34px;height:34px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,var(--acc),var(--cyan));
  display:flex;align-items:center;justify-content:center;font-size:1.05rem;
  animation:pulse 3s ease-in-out infinite;
}
.nword{font-family:'Sora',sans-serif;font-size:1.08rem;font-weight:800;color:var(--txt)}
.nword em{font-style:normal;color:var(--acc)}
.nright{display:flex;align-items:center;gap:.7rem}
.nlinks{display:flex;gap:.1rem}
.nbtn{
  background:none;border:none;color:var(--txt2);
  cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:.88rem;font-weight:500;
  padding:.42rem .9rem;border-radius:9px;transition:all .2s;
}
.nbtn:hover,.nbtn.on{color:var(--txt);background:var(--sur2)}
.nbtn.on{color:var(--acc)}

/* THEME TOGGLE */
.tog{
  width:52px;height:27px;border-radius:999px;
  background:var(--sur2);border:1.5px solid var(--bdr2);
  cursor:pointer;position:relative;flex-shrink:0;
  transition:all .3s;
}
.tog:hover{border-color:var(--acc);box-shadow:0 0 10px var(--glo)}
.togknob{
  position:absolute;top:2.5px;width:20px;height:20px;border-radius:50%;
  background:linear-gradient(135deg,var(--acc),var(--cyan));
  display:flex;align-items:center;justify-content:center;font-size:.6rem;
  transition:left .3s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 2px 8px var(--glo);
}
body[data-theme="dark"]  .togknob{left:2.5px}
body[data-theme="light"] .togknob{left:27.5px}

.ncta{
  background:linear-gradient(135deg,var(--acc),var(--cyan));color:#fff;
  border:none;border-radius:10px;padding:.5rem 1.15rem;
  font-family:'Sora',sans-serif;font-weight:700;font-size:.83rem;
  cursor:pointer;transition:all .22s;box-shadow:0 4px 16px var(--glo);
}
.ncta:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--glo)}

/* ══ PAGE WRAPPER ══ */
.pz{position:relative;z-index:1}
.pw{position:relative;z-index:1;max-width:1360px;margin:0 auto;padding:3rem 2rem 5rem}

/* ══ BUTTONS ══ */
.btn{
  display:inline-flex;align-items:center;gap:.45rem;
  border:none;border-radius:12px;padding:.75rem 1.6rem;
  font-family:'Sora',sans-serif;font-weight:700;font-size:.9rem;
  cursor:pointer;transition:all .22s;
}
.btn:hover{transform:translateY(-2px)}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.btn-p{background:linear-gradient(135deg,var(--acc),var(--cyan));color:#fff;box-shadow:0 4px 18px var(--glo)}
.btn-p:hover{box-shadow:0 8px 30px var(--glo)}
.btn-o{background:var(--sur2);color:var(--txt2);border:1.5px solid var(--bdr)}
.btn-o:hover{color:var(--txt);border-color:var(--acc);background:var(--sur3)}
.btn-d{background:transparent;color:var(--red);border:1.5px solid var(--red)}
.btn-d:hover{background:rgba(255,77,122,.08)}

/* ══ HERO ══ */
.hero{max-width:1160px;margin:0 auto;padding:7rem 2rem 5rem;text-align:center}
.hbadge{
  display:inline-flex;align-items:center;gap:.5rem;
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:999px;
  padding:.35rem 1rem;font-size:.71rem;font-weight:600;color:var(--txt2);
  text-transform:uppercase;letter-spacing:.1em;margin-bottom:1.8rem;
  box-shadow:var(--shdsm);animation:fadeUp .45s ease both;
  transition:background var(--dur),border-color var(--dur);
}
.hdot{width:7px;height:7px;border-radius:50%;background:var(--grn);box-shadow:0 0 8px var(--grn);animation:pulse 2s infinite}

.hero h1{
  font-family:'Sora',sans-serif;
  font-size:clamp(2.7rem,5.5vw,5rem);
  font-weight:800;line-height:1.05;letter-spacing:-.03em;margin-bottom:1.4rem;
}
.hl{display:block;animation:fadeUp .45s ease both}
.hl:nth-child(1){animation-delay:.04s}
.hl:nth-child(2){animation-delay:.1s}
.hl:nth-child(3){animation-delay:.16s}
.hgrad{
  background:linear-gradient(90deg,var(--acc),var(--cyan),var(--acc2),var(--acc));
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 4s linear infinite;
}
.hsub{color:var(--txt2);font-size:1.03rem;max-width:520px;margin:0 auto 2.4rem;line-height:1.8;animation:fadeUp .45s .2s ease both}
.hacts{display:flex;flex-direction:column;align-items:center;gap:.75rem;animation:fadeUp .45s .25s ease both}
.hacts-row{display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center}
.ctamain{
  background:linear-gradient(135deg,var(--acc),var(--cyan));color:#fff;
  border:none;border-radius:14px;padding:1rem 2.4rem;
  font-family:'Sora',sans-serif;font-weight:800;font-size:1.03rem;
  cursor:pointer;transition:all .25s;box-shadow:0 6px 26px var(--glo);
  display:flex;align-items:center;gap:.5rem;
}
.ctamain:hover{transform:translateY(-3px);box-shadow:0 12px 40px var(--glo)}
.ctasec{
  background:var(--sur);color:var(--txt2);border:1.5px solid var(--bdr);
  border-radius:14px;padding:1rem 1.75rem;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:.94rem;
  cursor:pointer;transition:all .25s;
  display:flex;align-items:center;gap:.45rem;
}
.ctasec:hover{border-color:var(--acc);color:var(--txt);transform:translateY(-2px)}
.trust{color:var(--txt3);font-size:.76rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;justify-content:center}
.tck{color:var(--grn);font-weight:700}

/* HERO MOCKUP */
.hvisual{margin:4rem auto 0;max-width:760px;position:relative;animation:fadeUp .65s .32s ease both}
.mock{
  background:var(--sur);border:1.5px solid var(--bdr);
  border-radius:22px;overflow:hidden;box-shadow:var(--shd);
  transition:background var(--dur),border-color var(--dur);
}
.mockbar{
  display:flex;align-items:center;gap:.5rem;padding:.8rem 1.15rem;
  border-bottom:1px solid var(--bdr);background:var(--sur2);
  transition:background var(--dur),border-color var(--dur);
}
.mdot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.murl{
  flex:1;text-align:center;font-family:'JetBrains Mono',monospace;
  font-size:.67rem;color:var(--txt3);background:var(--sur3);
  border-radius:5px;padding:.17rem .7rem;
  transition:background var(--dur);
}
.mockbody{padding:1.6rem}
.msrow{display:flex;align-items:center;gap:1.75rem;margin-bottom:1.4rem}
.mnum{
  font-family:'JetBrains Mono',monospace;font-size:3.4rem;font-weight:700;line-height:1;
  background:linear-gradient(135deg,var(--acc),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.mlbl{color:var(--txt3);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;margin-top:.15rem}
.mbars{flex:1}
.mbr{display:flex;align-items:center;gap:.65rem;margin-bottom:.42rem}
.mbl{font-size:.72rem;color:var(--txt2);min-width:68px}
.mbt{flex:1;height:5px;background:var(--sur3);border-radius:99px;overflow:hidden;transition:background var(--dur)}
.mbf{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--acc),var(--cyan))}
.mbp{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--txt3);min-width:26px;text-align:right}
.mchips{display:flex;flex-wrap:wrap;gap:.35rem}
.mc{padding:.22rem .68rem;border-radius:999px;font-size:.72rem;font-weight:600}
.mcg{background:rgba(0,255,170,.08);color:var(--grn);border:1px solid rgba(0,255,170,.2)}
.mcr{background:rgba(255,77,122,.08);color:var(--red);border:1px solid rgba(255,77,122,.2)}

/* FLOAT BADGES */
.fbg{
  position:absolute;background:var(--sur);border:1.5px solid var(--bdr);
  border-radius:14px;padding:.62rem .95rem;box-shadow:var(--shd);
  font-size:.76rem;font-weight:600;
  transition:background var(--dur),border-color var(--dur);
}
.fbg1{bottom:24px;left:-16px;animation:float 4s ease-in-out infinite}
.fbg2{top:16px;right:-12px;animation:float 4s ease-in-out infinite;animation-delay:-2s}
.fbi{font-size:1.1rem;margin-bottom:.12rem}
.fbv{color:var(--acc);font-weight:700}
.fbs{color:var(--txt3);font-size:.65rem}

/* STATS BAND */
.sband{position:relative;z-index:1;border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);transition:border-color var(--dur)}
.sinner{max-width:1160px;margin:0 auto;display:flex;justify-content:space-around;flex-wrap:wrap;padding:2.2rem 2rem;gap:2rem}
.sbox{text-align:center}
.sn{font-family:'JetBrains Mono',monospace;font-size:1.95rem;font-weight:700;background:linear-gradient(135deg,var(--acc),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sl{color:var(--txt3);font-size:.76rem;margin-top:.28rem;letter-spacing:.04em}

/* SECTION */
.sec{position:relative;z-index:1;max-width:1160px;margin:0 auto;padding:5rem 2rem}
.stag{font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--acc);text-transform:uppercase;letter-spacing:.18em;display:block;margin-bottom:.45rem}
.sh{font-family:'Sora',sans-serif;font-size:clamp(1.85rem,3vw,2.45rem);font-weight:800;letter-spacing:-.025em;margin-bottom:.55rem}
.sp{color:var(--txt2);font-size:.97rem;max-width:470px;line-height:1.75}

/* STEP CARDS */
.sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.15rem;margin-top:2.8rem}
.sc{
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;padding:1.7rem;
  position:relative;overflow:hidden;transition:all .28s;
  transition:background var(--dur),border-color var(--dur),transform .28s,box-shadow .28s;
}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--acc),var(--cyan));transform:scaleX(0);transition:transform .3s}
.sc:hover{border-color:var(--bdr2);transform:translateY(-5px);box-shadow:var(--shd)}
.sc:hover::before{transform:scaleX(1)}
.scn{font-family:'JetBrains Mono',monospace;font-size:1.9rem;font-weight:700;color:var(--acc);opacity:.18;line-height:1;margin-bottom:.5rem}
.sci{font-size:1.65rem;display:block;margin-bottom:.6rem}
.sc h3{font-family:'Sora',sans-serif;font-size:.91rem;font-weight:700;margin-bottom:.35rem}
.sc p{color:var(--txt2);font-size:.81rem;line-height:1.65}

/* FEATURE CARDS */
.fgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.15rem;margin-top:2.8rem}
.fc{background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;padding:1.7rem;transition:all .28s}
.fc:hover{border-color:var(--bdr2);transform:translateY(-4px);box-shadow:var(--shd)}
.fiw{width:44px;height:44px;border-radius:11px;background:var(--sur2);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:.95rem;transition:background var(--dur),border-color var(--dur)}
.fc h3{font-family:'Sora',sans-serif;font-size:.9rem;font-weight:700;margin-bottom:.32rem}
.fc p{color:var(--txt2);font-size:.81rem;line-height:1.65}

/* CTA BAND */
.cband{position:relative;z-index:1;max-width:1100px;margin:0 auto 5rem;padding:0 2rem}
.cinner{
  background:var(--sur2);border:1.5px solid var(--bdr);border-radius:26px;
  padding:4.5rem 3rem;text-align:center;position:relative;overflow:hidden;
  box-shadow:var(--shd);transition:background var(--dur),border-color var(--dur);
}
.cinner::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--acc),var(--cyan),transparent)}
.cinner h2{font-family:'Sora',sans-serif;font-size:2.2rem;font-weight:800;letter-spacing:-.025em;margin-bottom:.65rem}
.cinner p{color:var(--txt2);margin-bottom:1.9rem;font-size:.98rem}

/* FOOTER */
.foot{position:relative;z-index:1;border-top:1px solid var(--bdr);padding:3.5rem 2.5rem 2rem;transition:border-color var(--dur)}
.footin{max-width:1160px;margin:0 auto;display:flex;justify-content:space-between;gap:2.5rem;flex-wrap:wrap;margin-bottom:1.9rem}
.flr{display:flex;align-items:center;gap:.52rem;margin-bottom:.45rem}
.fli{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--cyan));display:flex;align-items:center;justify-content:center;font-size:.8rem}
.fln{font-family:'Sora',sans-serif;font-size:.98rem;font-weight:800;background:linear-gradient(135deg,var(--acc),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.fdesc{color:var(--txt3);font-size:.81rem;max-width:230px;line-height:1.6}
.fmade{margin-top:.8rem;font-size:.77rem;color:var(--txt3);display:flex;align-items:center;gap:.3rem}
.fmade strong{color:var(--acc);font-weight:700}
.fcols{display:flex;gap:3.5rem}
.fcol{display:flex;flex-direction:column;gap:.52rem}
.fcol h4{font-family:'JetBrains Mono',monospace;font-size:.63rem;color:var(--txt3);text-transform:uppercase;letter-spacing:.14em;margin-bottom:.28rem}
.fcol button,.fcol a{background:none;border:none;color:var(--txt2);font-family:'Plus Jakarta Sans',sans-serif;font-size:.84rem;cursor:pointer;text-align:left;text-decoration:none;transition:color .2s;padding:0}
.fcol button:hover,.fcol a:hover{color:var(--acc)}
.footbot{max-width:1160px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:1.4rem;border-top:1px solid var(--bdr);color:var(--txt3);font-size:.73rem;flex-wrap:wrap;gap:.5rem;transition:border-color var(--dur)}
.fpow{display:flex;align-items:center;gap:.4rem;color:var(--acc);font-weight:600}

/* ══ ANALYZE PAGE ══ */
.phdr{text-align:center;margin-bottom:2.8rem;animation:fadeUp .45s ease both}
.phdr h1{font-family:'Sora',sans-serif;font-size:2.15rem;font-weight:800;letter-spacing:-.025em;margin-bottom:.38rem}
.phdr p{color:var(--txt2)}
.ptag{display:block;font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--acc);text-transform:uppercase;letter-spacing:.14em;margin-bottom:.42rem}
.ebar{background:rgba(255,77,122,.08);border:1.5px solid rgba(255,77,122,.22);color:var(--red);border-radius:11px;padding:.75rem 1.1rem;margin-bottom:1.4rem;font-size:.87rem;animation:slideIn .3s ease}

/* INPUT GRID */
.igrid{display:grid;grid-template-columns:1fr 50px 1fr;align-items:start;animation:fadeUp .45s .1s ease both}
.ipanel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;overflow:hidden;transition:border-color .25s,box-shadow .25s,background var(--dur)}
.ipanel:focus-within{border-color:var(--acc);box-shadow:0 0 0 3px var(--glo)}
.phd{
  display:flex;align-items:center;gap:.48rem;padding:.8rem 1.1rem;
  border-bottom:1px solid var(--bdr);background:var(--sur2);flex-wrap:wrap;
  transition:background var(--dur),border-color var(--dur);
}
.phd strong{font-family:'Sora',sans-serif;font-size:.86rem;font-weight:700}
.tbts{display:flex;gap:.25rem;margin-left:auto}
.tbt{
  background:transparent;color:var(--txt3);border:1px solid var(--bdr);border-radius:7px;
  padding:.2rem .58rem;font-size:.69rem;font-weight:600;
  font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s;
}
.tbt:hover{color:var(--txt2);border-color:var(--bdr2)}
.tbt.on{background:linear-gradient(135deg,var(--acc),var(--cyan));color:#fff;border-color:transparent}
.txa{
  width:100%;background:var(--inp);border:none;outline:none;
  color:var(--txt);font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.86rem;line-height:1.75;padding:1.15rem;resize:vertical;min-height:420px;
  transition:background var(--dur),color var(--dur);
}
.txa::placeholder{color:var(--txt3)}
.cntrow{text-align:right;color:var(--txt3);font-size:.67rem;padding:.28rem .85rem;border-top:1px solid var(--bdr);font-family:'JetBrains Mono',monospace;transition:border-color var(--dur)}
.upzone{
  border:2px dashed var(--bdr2);border-radius:13px;padding:3rem 1.4rem;
  text-align:center;cursor:pointer;transition:all .22s;margin:1.1rem;
}
.upzone:hover{border-color:var(--acc);background:rgba(92,79,255,.03)}
.upico{font-size:2.4rem;margin-bottom:.65rem}
.upzone h4{font-size:.88rem;font-weight:700;margin-bottom:.28rem}
.upzone p{color:var(--txt3);font-size:.75rem}
.fprev{margin:1.1rem;background:var(--sur2);border-radius:11px;padding:.95rem;transition:background var(--dur)}
.fprev img{width:100%;max-height:230px;object-fit:contain;border-radius:7px;margin-bottom:.65rem;display:block}
.finfo{display:flex;align-items:center;gap:.65rem;margin-bottom:.65rem}
.fico{font-size:1.9rem;flex-shrink:0}
.fname{font-weight:600;font-size:.86rem}
.fmeta{color:var(--txt3);font-size:.73rem}
.facts{display:flex;gap:.45rem}
.fbtn{border-radius:7px;padding:.28rem .75rem;font-size:.72rem;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;transition:all .2s}
.fbtnrm{background:rgba(255,77,122,.09);color:var(--red);border:1px solid rgba(255,77,122,.22)}
.fbtnrp{background:var(--sur3);color:var(--txt2);border:1px solid var(--bdr)}

.vscol{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.45rem;padding:.9rem .7rem;min-height:180px}
.vsline{width:1px;flex:1;background:var(--bdr)}
.vspill{font-family:'JetBrains Mono',monospace;font-size:.7rem;font-weight:700;color:var(--acc);background:var(--sur2);border:1.5px solid var(--bdr);border-radius:7px;padding:.28rem .45rem;transition:background var(--dur),border-color var(--dur)}

.afoot{display:flex;flex-direction:column;align-items:center;gap:.7rem;margin-top:2.4rem;animation:fadeUp .45s .2s ease both}
.anote{color:var(--txt3);font-size:.77rem}
.anote em{font-style:normal;color:var(--cyan);font-weight:600}
.spinner{display:inline-block;width:16px;height:16px;border:2.5px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite}

/* ══ RESULTS ══ */
.rtop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2.4rem;animation:fadeUp .45s ease both}
.rtop h1{font-family:'Sora',sans-serif;font-size:1.95rem;font-weight:800;letter-spacing:-.025em;margin-bottom:.28rem}
.rtop p{color:var(--txt2);font-size:.88rem}

/* SCORE CARD */
.scard{
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:24px;padding:2.4rem;
  margin-bottom:1.7rem;display:grid;grid-template-columns:auto 1fr;gap:2.4rem;align-items:center;
  position:relative;overflow:hidden;box-shadow:var(--shd);animation:fadeUp .45s .1s ease both;
  transition:background var(--dur),border-color var(--dur);
}
.scard::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,var(--acc),var(--cyan),transparent)}
.scardglow{position:absolute;top:-40px;right:-40px;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle,var(--glo),transparent 70%);pointer-events:none}
.ringwrap{position:relative;display:inline-block}
.ringwrap svg{display:block}
.ringctr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.rpct{font-family:'JetBrains Mono',monospace;font-size:1.75rem;font-weight:700;line-height:1;animation:scaleIn .6s .3s ease both}
.rlbl{color:var(--txt3);font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.verdict{display:inline-flex;align-items:center;gap:.38rem;padding:.28rem .85rem;border-radius:999px;font-size:.76rem;font-weight:700;margin-top:.7rem}
.vg{background:rgba(0,255,170,.09);color:var(--grn);border:1px solid rgba(0,255,170,.2)}
.vy{background:rgba(255,199,0,.09);color:var(--ylw);border:1px solid rgba(255,199,0,.2)}
.vr{background:rgba(255,77,122,.09);color:var(--red);border:1px solid rgba(255,77,122,.2)}
.smry h3{font-family:'JetBrains Mono',monospace;font-size:.63rem;color:var(--txt3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.55rem}
.smry p{color:var(--txt);line-height:1.8;font-size:.9rem}

/* SKILLS ROW */
.skrow{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.7rem;animation:fadeUp .45s .2s ease both}
.skbox{background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;padding:1.45rem;box-shadow:var(--shdsm);transition:background var(--dur),border-color var(--dur)}
.skboxhd{display:flex;align-items:center;gap:.48rem;font-family:'Sora',sans-serif;font-weight:700;font-size:.88rem;margin-bottom:1rem}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dotg{background:var(--grn);box-shadow:0 0 8px var(--grn)}
.dotr{background:var(--red);box-shadow:0 0 8px var(--red)}
.skcnt{margin-left:auto;background:var(--sur2);border-radius:999px;padding:.09rem .52rem;font-size:.7rem;color:var(--txt3);font-family:'JetBrains Mono',monospace}
.tags{display:flex;flex-wrap:wrap;gap:.35rem}
.tag{padding:.25rem .76rem;border-radius:999px;font-size:.76rem;font-weight:500}
.tagg{background:rgba(0,255,170,.07);color:var(--grn);border:1px solid rgba(0,255,170,.18)}
.tagr{background:rgba(255,77,122,.07);color:var(--red);border:1px solid rgba(255,77,122,.18)}

/* ══ RESOURCE SECTION ══ */
.rsec{margin-bottom:1.7rem;animation:fadeUp .45s .3s ease both}
.rsechd{margin-bottom:1.2rem}
.rsechd h2{font-family:'Sora',sans-serif;font-size:1.38rem;font-weight:800;margin-bottom:.2rem}
.rsechd p{color:var(--txt2);font-size:.85rem}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(305px,1fr));gap:1.2rem}

/* RESOURCE CARD */
.rcard{
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;overflow:hidden;
  transition:border-color .25s,transform .25s,box-shadow .25s,background var(--dur);
  box-shadow:var(--shdsm);
}
.rcard:hover{border-color:var(--bdr2);transform:translateY(-3px);box-shadow:var(--shd)}
.rhead{
  display:flex;align-items:center;justify-content:space-between;
  padding:.82rem 1.15rem;border-bottom:1px solid var(--bdr);
  background:var(--sur2);transition:background var(--dur),border-color var(--dur);
}
.rskill{
  font-family:'Sora',sans-serif;font-weight:800;font-size:.9rem;
  background:linear-gradient(135deg,var(--acc),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.rbadge{
  font-size:.6rem;font-weight:700;
  background:rgba(255,77,122,.09);color:var(--red);
  border:1px solid rgba(255,77,122,.2);
  border-radius:999px;padding:.13rem .5rem;
  font-family:'JetBrains Mono',monospace;flex-shrink:0;
}

/* NOTES ACCORDION */
.ntog{
  width:100%;display:flex;align-items:center;gap:.55rem;
  padding:.68rem 1.15rem;background:none;border:none;
  border-bottom:1px solid var(--bdr);
  color:var(--txt2);cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:.81rem;font-weight:600;
  transition:background .2s,color .2s,border-color var(--dur);text-align:left;
}
.ntog:hover{background:var(--sur3);color:var(--txt)}
.ntico{
  width:22px;height:22px;border-radius:7px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(255,199,0,.25),rgba(255,140,0,.18));
  display:flex;align-items:center;justify-content:center;font-size:.75rem;
}
.ntlbl{flex:1}
.ntarr{color:var(--txt3);font-size:.68rem;margin-left:auto;transition:transform .25s}
.ntarr.open{transform:rotate(180deg)}

.nbody{
  padding:.9rem 1.15rem 1rem;
  border-bottom:1px solid var(--bdr);
  animation:fadeIn .2s ease;
  transition:background var(--dur),border-color var(--dur);
}
body[data-theme="dark"]  .nbody{background:rgba(255,199,0,.025)}
body[data-theme="light"] .nbody{background:rgba(255,180,0,.04)}
.nbody p{color:var(--txt2);font-size:.81rem;line-height:1.8;margin:0}

/* LINKS */
.rlinks{list-style:none}
.rli a{
  display:flex;align-items:center;gap:.55rem;color:var(--txt2);
  text-decoration:none;font-size:.81rem;padding:.53rem 1.15rem;
  border-bottom:1px solid var(--bdr);transition:background .2s,color .2s,border-color var(--dur);
}
.rli:last-child a{border-bottom:none}
.rli a:hover{color:var(--txt);background:var(--sur2)}
.lbdg{
  display:inline-flex;align-items:center;gap:.2rem;
  font-size:.59rem;font-weight:700;border-radius:6px;padding:.12rem .4rem;
  flex-shrink:0;font-family:'JetBrains Mono',monospace;
}
.lyt {background:rgba(255,60,60,.1);  color:#ff4444;border:1px solid rgba(255,60,60,.2)}
.ldoc{background:rgba(0,212,255,.1);  color:var(--cyan);border:1px solid rgba(0,212,255,.2)}
.lnt {background:rgba(255,199,0,.12); color:var(--ylw);border:1px solid rgba(255,199,0,.2)}
.lcrs{background:rgba(0,255,170,.1);  color:var(--grn);border:1px solid rgba(0,255,170,.2)}
.lttl{flex:1;line-height:1.35}
.larr{color:var(--txt3);font-size:.66rem;flex-shrink:0;transition:transform .2s,color .2s}
.rli a:hover .larr{transform:translateX(3px);color:var(--acc)}

/* SAVE BAR */
.svbar{
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:20px;
  padding:1.65rem 1.9rem;display:flex;align-items:center;justify-content:space-between;
  animation:fadeUp .45s .4s ease both;box-shadow:var(--shdsm);
  transition:background var(--dur),border-color var(--dur);
}
.svbar p{color:var(--txt2);font-size:.88rem}
.svbar strong{color:var(--grn)}
.svbtns{display:flex;gap:.7rem}

/* ══ HISTORY ══ */
.htop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.9rem;animation:fadeUp .45s ease both}
.htop h1{font-family:'Sora',sans-serif;font-size:1.95rem;font-weight:800;letter-spacing:-.025em}
.hlist{display:flex;flex-direction:column;gap:.7rem}
.hcard{
  display:flex;align-items:center;gap:1.2rem;
  background:var(--sur);border:1.5px solid var(--bdr);
  border-radius:17px;padding:1.15rem 1.35rem;
  transition:all .22s;box-shadow:var(--shdsm);
  animation:slideIn .4s ease both;
}
.hcard:hover{border-color:var(--bdr2);transform:translateX(5px);background:var(--sur2)}
.hscore{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;min-width:58px;text-align:center}
.hinfo{flex:1}
.hjob{font-family:'Sora',sans-serif;font-weight:700;font-size:.9rem;margin-bottom:.18rem}
.hdate{color:var(--txt3);font-size:.72rem;margin-bottom:.2rem;font-family:'JetBrains Mono',monospace}
.hmiss{color:var(--red);font-size:.77rem}
.hacts{display:flex;gap:.45rem}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.95rem;padding:7rem 2rem;text-align:center}
.empty-ico{font-size:2.9rem}
.empty h3{font-family:'Sora',sans-serif;font-size:1.25rem;font-weight:800}
.empty p{color:var(--txt2);font-size:.88rem;max-width:290px}

/* ══ RESPONSIVE ══ */
@media(max-width:768px){
  nav.nav{padding:.85rem 1.1rem}
  .igrid{grid-template-columns:1fr}
  .vscol{flex-direction:row;min-height:auto;padding:.6rem 0}
  .vsline{width:auto;height:1px;flex:1}
  .skrow{grid-template-columns:1fr}
  .scard{grid-template-columns:1fr;text-align:center}
  .sinner{gap:1.4rem}
  .footin{flex-direction:column}
  .svbar{flex-direction:column;gap:.95rem;text-align:center}
  .rtop{flex-direction:column;gap:.9rem}
  .hero h1{font-size:2.45rem}
  .fbg1,.fbg2{display:none}
  .tbts{margin-left:0;margin-top:.3rem}
  .cinner{padding:3rem 1.4rem}
  .cinner h2{font-size:1.75rem}
  .fcols{gap:2rem}
  .nlinks{display:none}
}
`;

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const r = 56, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const id = score >= 80 ? "gg" : score >= 55 ? "gy" : "gr";
  const col = score >= 80 ? "var(--grn)" : score >= 55 ? "var(--ylw)" : "var(--red)";
  const [c0, c1] = score >= 80 ? ["#00ffaa","#00d4ff"] : score >= 55 ? ["#ffc700","#ff9500"] : ["#ff4d7a","#ff6b9d"];
  return (
    <div className="ringwrap">
      <svg width="148" height="148" viewBox="0 0 148 148">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c0}/><stop offset="100%" stopColor={c1}/>
          </linearGradient>
        </defs>
        <circle cx="74" cy="74" r={r} fill="none" stroke="var(--sur3)" strokeWidth="11"/>
        <circle cx="74" cy="74" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="11"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 74 74)"
          style={{transition:"stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div className="ringctr">
        <span className="rpct" style={{color:col}}>{score}%</span>
        <span className="rlbl">match</span>
      </div>
    </div>
  );
}

function ResourceCard({ r }) {
  const [open, setOpen] = useState(false);
  const notes = SKILL_NOTES[r.skill] || `${r.skill} is a required skill for this role. Study the official documentation and a beginner video course first, then build a small hands-on project to solidify the concepts.`;
  const bc = t => t==="youtube"?"lyt":t==="article"?"ldoc":t==="notes"?"lnt":"lcrs";
  const bl = t => t==="youtube"?"▶ Video":t==="article"?"📖 Docs":t==="notes"?"📝 Notes":"🎓 Course";
  return (
    <div className="rcard">
      <div className="rhead">
        <span className="rskill">{r.skill}</span>
        <span className="rbadge">Missing</span>
      </div>

      {/* NOTES TOGGLE — always shown */}
      <button className="ntog" onClick={() => setOpen(o => !o)}>
        <span className="ntico">📝</span>
        <span className="ntlbl">Study Notes</span>
        <span className={`ntarr${open ? " open" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="nbody">
          <p>{notes}</p>
        </div>
      )}

      <ul className="rlinks">
        {r.links?.map((l, i) => (
          <li className="rli" key={i}>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              <span className={`lbdg ${bc(l.type)}`}>{bl(l.type)}</span>
              <span className="lttl">{l.title}</span>
              <span className="larr">→</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InputPanel({ label, icon, text, setText, file, setFile }) {
  const [tab, setTab]   = useState("paste");
  const [prev, setPrev] = useState("");
  const fref = useRef();
  const handle = f => {
    if (!f) return;
    setFile(f);
    setPrev(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  };
  const clear = () => { setFile(null); setPrev(""); if (fref.current) fref.current.value = ""; };
  return (
    <div className="ipanel">
      <div className="phd">
        <span>{icon}</span>
        <strong>{label}</strong>
        <div className="tbts">
          {["paste","pdf","photo"].map(t => (
            <button key={t} className={`tbt${tab===t?" on":""}`} onClick={() => setTab(t)}>
              {t==="paste"?"✏️ Paste":t==="pdf"?"📎 PDF":"🖼️ Photo"}
            </button>
          ))}
        </div>
      </div>

      {tab === "paste" && (
        <>
          <textarea className="txa" value={text} onChange={e => setText(e.target.value)}
            placeholder={label.includes("Resume")
              ? "Paste your full resume here…\n\nSKILLS\nReact, Node.js, MongoDB\n\nEXPERIENCE\nFrontend Dev @ Startup (2022–2024)\n- Built dashboards with React\n\nEDUCATION\nB.Tech Computer Science, 2022"
              : "Paste the job description here…\n\nFull Stack Developer\n\nRequirements:\n- 2+ years React experience\n- Node.js & Express backend\n- AWS or Azure cloud\n- Docker & CI/CD pipelines"
            } rows={18}/>
          <div className="cntrow">{text.length} chars</div>
        </>
      )}

      {(tab === "pdf" || tab === "photo") && (
        !file
          ? (
            <div className="upzone"
              onClick={() => fref.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files[0]); }}>
              <div className="upico">{tab==="photo"?"🖼️":"📎"}</div>
              <h4>{tab==="photo"?"Click or drag & drop image":"Click or drag & drop PDF"}</h4>
              <p>{tab==="photo"?"PNG, JPG, WEBP supported":"PDF only · max 10 MB"}</p>
              <input ref={fref} type="file" accept={tab==="photo"?"image/*":"application/pdf"}
                style={{display:"none"}} onChange={e => handle(e.target.files[0])}/>
            </div>
          ) : (
            <div className="fprev">
              {prev && <img src={prev} alt="preview"/>}
              {!prev && (
                <div className="finfo">
                  <div className="fico">📄</div>
                  <div>
                    <div className="fname">{file.name}</div>
                    <div className="fmeta">{(file.size/1024).toFixed(1)} KB · PDF</div>
                  </div>
                </div>
              )}
              <div className="facts">
                <button className="fbtn fbtnrm" onClick={clear}>✕ Remove</button>
                <button className="fbtn fbtnrp" onClick={() => fref.current?.click()}>↺ Replace</button>
              </div>
              <input ref={fref} type="file" accept={tab==="photo"?"image/*":"application/pdf"}
                style={{display:"none"}} onChange={e => handle(e.target.files[0])}/>
            </div>
          )
      )}
    </div>
  );
}

function Footer() {
  const { go } = useApp();
  return (
    <footer className="foot">
      <div className="footin">
        <div>
          <div className="flr">
            <div className="fli">⚡</div>
            <span className="fln">SkillGap</span>
          </div>
          <p className="fdesc">AI-powered skill gap analyzer for fresh graduates & students.</p>
          <div className="fmade">Made with ❤️ by <strong>Karan Kumar</strong></div>
        </div>
        <div className="fcols">
          <div className="fcol">
            <h4>Product</h4>
            <button onClick={() => go("analyze")}>Analyze Resume</button>
            <button onClick={() => go("history")}>My History</button>
          </div>
          <div className="fcol">
            <h4>Info</h4>
            <a href="#">How it works</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
      <div className="footbot">
        <span>© {new Date().getFullYear()} SkillGap by Karan Kumar</span>
        <div className="fpow">⚡ Powered by Groq AI</div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGES
───────────────────────────────────────────────────────────── */
function LandingPage() {
  const { go } = useApp();
  const feats = [
    {e:"🔍",t:"Smart Parsing",     d:"Every tech skill extracted automatically from your resume."},
    {e:"📊",t:"Precise Scoring",   d:"AI + keyword blend gives a realistic % match score."},
    {e:"📝",t:"Study Notes",       d:"Tap any missing skill to read a detailed study guide."},
    {e:"📚",t:"Free Resources",    d:"YouTube, official docs & cheatsheet links per skill."},
    {e:"⚡",t:"10-Second Results", d:"Full AI analysis delivered in under 10 seconds."},
    {e:"💾",t:"History Tracking",  d:"All analyses saved so you can track your progress."},
  ];
  return (
    <main className="pz">
      <section className="hero">
        <div className="hbadge"><span className="hdot"/>Free for students · No signup needed</div>
        <h1>
          <span className="hl">Know exactly what's</span>
          <span className="hl hgrad">standing between you</span>
          <span className="hl">and your dream job.</span>
        </h1>
        <p className="hsub">Paste your resume + any job description. Get your match score, skill gaps, personal study notes and free learning resources — in seconds.</p>
        <div className="hacts">
          <div className="hacts-row">
            <button className="ctamain" onClick={() => go("analyze")}>⚡ Analyze My Resume</button>
            <button className="ctasec"  onClick={() => go("history")}>📂 View History</button>
          </div>
          <div className="trust">
            {["No account needed","100% free","PDF & photo upload","Instant results"].map(t => (
              <span key={t} style={{display:"flex",alignItems:"center",gap:".28rem"}}><span className="tck">✓</span>{t}</span>
            ))}
          </div>
        </div>

        <div className="hvisual">
          <div className="fbg fbg1"><div className="fbi">🎯</div><div className="fbv">3 gaps found</div><div className="fbs">Notes ready</div></div>
          <div className="fbg fbg2"><div className="fbi">⚡</div><div className="fbv">8.2s</div><div className="fbs">Groq AI</div></div>
          <div className="mock">
            <div className="mockbar">
              <div className="mdot" style={{background:"#ff5f56"}}/>
              <div className="mdot" style={{background:"#ffbd2e"}}/>
              <div className="mdot" style={{background:"#27c93f"}}/>
              <div className="murl">skillgap.app/results</div>
            </div>
            <div className="mockbody">
              <div className="msrow">
                <div><div className="mnum">85%</div><div className="mlbl">Match Score</div></div>
                <div className="mbars">
                  {[["React",92],["Node.js",84],["MongoDB",70],["Docker",28]].map(([s,v]) => (
                    <div className="mbr" key={s}>
                      <span className="mbl">{s}</span>
                      <div className="mbt"><div className="mbf" style={{width:`${v}%`}}/></div>
                      <span className="mbp">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mchips">
                {[["React ✓","mcg"],["Node.js ✓","mcg"],["Git ✓","mcg"],["Docker ✗","mcr"],["AWS ✗","mcr"],["Redis ✗","mcr"]].map(([s,c]) => (
                  <span key={s} className={`mc ${c}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sband">
        <div className="sinner">
          {[["500+","Analyses done"],["~10s","Avg. speed"],["40+","Skills covered"],["100%","Free forever"]].map(([n,l]) => (
            <div className="sbox" key={l}><div className="sn">{n}</div><div className="sl">{l}</div></div>
          ))}
        </div>
      </div>

      <section className="sec">
        <span className="stag">// process</span>
        <h2 className="sh">How it works</h2>
        <p className="sp">Four simple steps from resume to personalised study roadmap.</p>
        <div className="sgrid">
          {[
            {n:"01",e:"📄",t:"Upload Resume",       d:"Paste text, upload a PDF, or take a photo."},
            {n:"02",e:"💼",t:"Add Job Description", d:"Copy the JD from LinkedIn, Naukri, or any site."},
            {n:"03",e:"🤖",t:"AI Analysis",          d:"Groq AI compares your profile vs the requirements."},
            {n:"04",e:"🚀",t:"Learn & Apply",         d:"Read study notes + use free resources to close every gap."},
          ].map(s => (
            <div className="sc" key={s.n}>
              <div className="scn">{s.n}</div>
              <span className="sci">{s.e}</span>
              <h3>{s.t}</h3><p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{paddingTop:0}}>
        <span className="stag">// features</span>
        <h2 className="sh">Everything you need</h2>
        <p className="sp">All tools to understand and close your skill gaps — completely free.</p>
        <div className="fgrid">
          {feats.map(f => (
            <div className="fc" key={f.t}>
              <div className="fiw">{f.e}</div>
              <h3>{f.t}</h3><p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="cband">
        <div className="cinner">
          <span className="stag">// get started</span>
          <h2>Ready to land your dream job?</h2>
          <p>Join hundreds of graduates who prepare smarter with SkillGap.</p>
          <button className="ctamain" style={{margin:"0 auto"}} onClick={() => go("analyze")}>⚡ Start Free Analysis →</button>
        </div>
      </div>
      <Footer/>
    </main>
  );
}

function AnalyzePage() {
  const { go, setResult }           = useApp();
  const [resumeText, setResumeText] = useState("");
  const [jdText,     setJdText]     = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile,     setJdFile]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const run = async () => {
    if (!resumeFile && resumeText.trim().length < 50) { setError("Please paste your resume (min 50 chars) or upload a file."); return; }
    if (!jdFile    && jdText.trim().length    < 30)  { setError("Please paste the job description or upload a file."); return; }
    setError(""); setLoading(true);
    try {
      const sid = getSessionId();
      let res;
      if (resumeFile || jdFile) {
        const fd = new FormData();
        resumeFile ? fd.append("resumeFile", resumeFile) : fd.append("resumeText", resumeText);
        jdFile     ? fd.append("jdFile", jdFile)         : fd.append("jobDescription", jdText);
        fd.append("sessionId", sid);
        res = await fetch("/api/analyze", { method:"POST", body:fd });
      } else {
        res = await fetch("/api/analyze", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ resumeText, jobDescription:jdText, sessionId:sid })
        });
      }
      const txt = await res.text();
      if (!txt?.trim()) throw new Error("Backend returned empty response — check your terminal.");
      let data;
      try { data = JSON.parse(txt); } catch { throw new Error("Backend error: " + txt.slice(0,200)); }
      if (!res.ok) throw new Error(data.message || "Server error");
      setResult(data); go("results");
    } catch(e) { setError(e.message || "Something went wrong. Please try again."); }
    finally    { setLoading(false); }
  };

  return (
    <main className="pw">
      <div className="phdr">
        <span className="ptag">// ai analysis</span>
        <h1>Analyze Your Resume</h1>
        <p>Paste text, upload PDF, or photo — gap analysis in seconds</p>
      </div>
      {error && <div className="ebar">⚠️ {error}</div>}
      <div className="igrid">
        <InputPanel label="Your Resume"     icon="📄" text={resumeText} setText={setResumeText} file={resumeFile} setFile={setResumeFile}/>
        <div className="vscol">
          <div className="vsline"/><span className="vspill">VS</span><div className="vsline"/>
        </div>
        <InputPanel label="Job Description" icon="💼" text={jdText} setText={setJdText} file={jdFile} setFile={setJdFile}/>
      </div>
      <div className="afoot">
        <button className="ctamain" style={{fontSize:"1.02rem",padding:"1.05rem 3rem"}} onClick={run} disabled={loading}>
          {loading ? <><span className="spinner"/> Analyzing…</> : "⚡ Analyze My Skill Gaps"}
        </button>
        <span className="anote">Takes ~10 seconds · Powered by <em>Groq AI</em></span>
      </div>
      <Footer/>
    </main>
  );
}

function ResultsPage() {
  const { go, result } = useApp();
  if (!result) return (
    <main className="pw">
      <div className="empty">
        <div className="empty-ico">📊</div>
        <h3>No analysis yet</h3>
        <p>Run an analysis to see your results here.</p>
        <button className="btn btn-p" onClick={() => go("analyze")}>Analyze Resume</button>
      </div>
    </main>
  );
  const { matchScore, matchedSkills=[], missingSkills=[], resources=[], summary="" } = result;
  const vc = matchScore>=80?"vg":matchScore>=55?"vy":"vr";
  const vl = matchScore>=80?"🔥 Strong Match":matchScore>=55?"👍 Good Start":"📈 Needs Work";
  return (
    <main className="pw">
      <div className="rtop">
        <div>
          <span className="ptag">// results</span>
          <h1>Your Gap Analysis</h1>
          <p>Here's how you stack up against the job description</p>
        </div>
        <button className="btn btn-o" onClick={() => go("analyze")}>← New Analysis</button>
      </div>

      <div className="scard">
        <div className="scardglow"/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".45rem"}}>
          <ScoreRing score={matchScore}/>
          <span className={`verdict ${vc}`}>{vl}</span>
        </div>
        <div className="smry">
          <h3>AI Summary</h3>
          <p>{summary}</p>
        </div>
      </div>

      <div className="skrow">
        <div className="skbox">
          <div className="skboxhd"><span className="dot dotg"/>Matched Skills<span className="skcnt">{matchedSkills.length}</span></div>
          <div className="tags">{matchedSkills.map(s => <span key={s} className="tag tagg">✓ {s}</span>)}</div>
        </div>
        <div className="skbox">
          <div className="skboxhd"><span className="dot dotr"/>Missing Skills<span className="skcnt">{missingSkills.length}</span></div>
          <div className="tags">{missingSkills.map(s => <span key={s} className="tag tagr">✗ {s}</span>)}</div>
        </div>
      </div>

      <div className="rsec">
        <div className="rsechd">
          <h2>📚 Learning Resources</h2>
          <p>Tap <strong>Study Notes</strong> on any card to read what to learn · Plus free videos, docs & cheatsheets</p>
        </div>
        <div className="rgrid">
          {resources.map(r => <ResourceCard key={r.skill} r={r}/>)}
        </div>
      </div>

      <div className="svbar">
        <p><strong>✅ Auto-saved!</strong> This analysis is in your history.</p>
        <div className="svbtns">
          <button className="btn btn-o" onClick={() => go("history")}>View History →</button>
          <button className="btn btn-p" onClick={() => go("analyze")}>New Analysis</button>
        </div>
      </div>
      <Footer/>
    </main>
  );
}

function HistoryPage() {
  const { go, setResult }     = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/history?sessionId=${getSessionId()}`);
        setHistory(await r.json());
      } catch { setError("Could not load history."); }
      finally  { setLoading(false); }
    })();
  }, []);

  const del = async id => {
    try { await fetch(`/api/history/${id}`, {method:"DELETE"}); setHistory(p => p.filter(h => h._id !== id)); }
    catch { setError("Could not delete."); }
  };

  const sc = s => s>=80?"var(--grn)":s>=55?"var(--ylw)":"var(--red)";
  const fd = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});

  return (
    <main className="pw">
      <div className="htop">
        <div><span className="ptag">// history</span><h1>Analysis History</h1></div>
        <button className="btn btn-p" onClick={() => go("analyze")}>+ New Analysis</button>
      </div>
      {loading && <div className="empty"><div className="empty-ico">⏳</div><p>Loading…</p></div>}
      {error   && <div className="empty"><div className="empty-ico">⚠️</div><p>{error}</p></div>}
      {!loading && !error && history.length === 0 && (
        <div className="empty">
          <div className="empty-ico">🕘</div>
          <h3>No analyses yet</h3>
          <p>Run your first analysis to see it here.</p>
          <button className="btn btn-p" onClick={() => go("analyze")}>Analyze Resume</button>
        </div>
      )}
      {!loading && history.length > 0 && (
        <div className="hlist">
          {history.map((item, i) => (
            <div className="hcard" key={item._id} style={{animationDelay:`${i*.05}s`}}>
              <div className="hscore" style={{color:sc(item.matchScore)}}>{item.matchScore}%</div>
              <div className="hinfo">
                <div className="hjob">{item.jobTitle || "Untitled Job"}</div>
                <div className="hdate">{fd(item.createdAt)}</div>
                <div className="hmiss">Missing: {item.missingSkills?.slice(0,4).join(", ") || "—"}</div>
              </div>
              <div className="hacts">
                <button className="btn btn-o" style={{padding:".38rem .85rem",fontSize:".79rem"}}
                  onClick={() => { setResult(item); go("results"); }}>View →</button>
                <button className="btn btn-d" style={{padding:".38rem .72rem",fontSize:".79rem"}}
                  onClick={() => del(item._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT  — theme applied to document.body so the ENTIRE page
           (including html background) responds to light/dark
───────────────────────────────────────────────────────────── */
export default function App() {
  const [page,   setPage]   = useState("landing");
  const [result, setResult] = useState(null);
  const [theme,  setTheme]  = useState(() => localStorage.getItem("sg_theme") || "dark");

  /* Inject CSS into <head> once — this makes body[data-theme] selectors work */
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "sg-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  /* Apply theme on body — covers 100% of the viewport background */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("sg_theme", theme);
  }, [theme]);

  const go = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <AppCtx.Provider value={{ go, result, setResult }}>
      {/* Full-page background layer (fixed, behind everything) */}
      <div className="bg-fixed">
        <div className="blob blob1"/>
        <div className="blob blob2"/>
        <div className="blob blob3"/>
      </div>
      <div className="bg-grid"/>

      {/* ── NAVBAR ── */}
      <nav className="nav">
        <div className="nbrand" onClick={() => go("landing")}>
          <div className="nlogo">⚡</div>
          <span className="nword">Skill<em>Gap</em></span>
        </div>
        <div className="nright">
          <div className="nlinks">
            <button className={`nbtn${page==="analyze"?" on":""}`} onClick={() => go("analyze")}>Analyze</button>
            <button className={`nbtn${page==="history"?" on":""}`} onClick={() => go("history")}>History</button>
          </div>

          {/* THEME TOGGLE */}
          <button className="tog" onClick={toggleTheme} title="Toggle light / dark mode">
            <div className="togknob">{theme==="dark"?"🌙":"☀️"}</div>
          </button>

          <button className="ncta" onClick={() => go("analyze")}>Try Free →</button>
        </div>
      </nav>

      {page==="landing" && <LandingPage/>}
      {page==="analyze" && <AnalyzePage/>}
      {page==="results" && <ResultsPage/>}
      {page==="history" && <HistoryPage/>}
    </AppCtx.Provider>
  );
}