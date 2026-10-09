# BreachMirror AI

BreachMirror AI is a security-awareness and policy-training platform for XYZ employees. It combines a **Policy Copilot** built as an agentic RAG pipeline on **LangGraph**, an encrypted and tamper-evident data layer, a learning journey with certification, and simulated threat telemetry, in one React application with a server plugin.

> **Training simulation.** Threat events, telemetry, risk scores and countermeasures are simulated. The policy content is real reference text, but nothing here monitors or protects real systems. Do not paste real credentials or customer data.

## Contents

- [Highlights](#highlights)
- [Quick start](#quick-start)
- [Architecture](#architecture)
- [Policy Copilot: agentic RAG with LangGraph](#policy-copilot-agentic-rag-with-langgraph)
- [Escalation and Security Support](#escalation-and-security-support)
- [Security](#security)
- [Frontend](#frontend)
- [Configuration](#configuration)
- [Commands and tests](#commands-and-tests)
- [Project structure](#project-structure)
- [Data and storage](#data-and-storage)
- [Troubleshooting](#troubleshooting)
- [Scope and limitations](#scope-and-limitations)

## Highlights

- **Policy Copilot.** You ask a question in plain English and get a cited, verified answer from the IT Security Policy v7.0 and the Code of Business Conduct.
  - **Retrieval:** Hybrid search (BM25 + vectors) is fused with Reciprocal Rank Fusion and diversified with MMR.
  - **Agent:** A LangGraph agent with guard, rewrite, grade and verify steps, a self-correcting loop and conversation memory.
  - **Streaming:** Answers stream live, and the UI shows each pipeline step as it runs.
  - **Never guesses:** If the approved content does not cover a question with confidence, no answer is generated. The question goes to the Security Team instead.
- **Escalation and Security Support.** Uncovered questions become tickets for the Security Team.
  - **Employees:** Follow their requests and reply in a thread. Answers are labelled as Security Team responses, distinct from AI answers.
  - **Agents:** See the requester's details and related questions, reply with policy references, resolve requests, and publish approved FAQs that the Copilot uses from then on.
  - **Privacy:** Employees see only an agent's Security Agent ID (for example `SEC-1042`). Every step is audited.
- **Works offline.** Every answer is cited and grounded with no API key. Adding `GEMINI_API_KEY` upgrades retrieval to Gemini embeddings, and adds LLM query rewriting, LLM relevance grading and streamed Gemini answers.
- **Secure by design:**
  - **Storage:** AES-256-GCM encryption at rest with HKDF-derived keys.
  - **Audit log:** Hash-chained, so editing, deleting or reordering entries is detected.
  - **Passwords:** Peppered scrypt hashing, with transparent upgrade of older hashes.
  - **Sessions:** Bound to the browser, with idle and absolute expiry.
  - **Request protection:** CSRF defence, rate limiting and strict security headers.
  - **Copilot input:** Prompt-injection blocking and secret redaction in Copilot questions.
- **Learning journey.** The readiness audit, pledges, speed drills, a certification exam with a printable certificate, a day streak and a security posture score.
- **Designed interface:**
  - **Look:** Glass surfaces over an ambient backdrop, light and dark themes, and pointer-reactive cursor effects.
  - **Navigation:** A command palette (Ctrl/Cmd+K) and a Home page with breadcrumbs.
  - **Accessibility:** WCAG 2.2 AA, with 0 automated accessibility violations in testing.

## Quick start

Requirements: Node.js 20 or newer (tested on 24), npm, and a modern browser.

```bash
npm install
npm run dev
```

Open **http://localhost:3000/**, choose **Create an account** and register with a `@xyz.com` email. The username must match the part before the `@`. Then sign in. You land on the BreachMirror Home page.

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd install` and `npm.cmd run dev`.

Optional: copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable the Gemini-powered path of the Copilot. Restart the server after changing `.env`.

To try the Security Team console, register a second account and list its username in `.env`, for example `BM_SECURITY_TEAM=jane.doe`. Then restart and sign in as that user.

## Architecture

```text
Browser (React 19 + Vite)                     Vite server plugin (server/auth-plugin.ts)
-------------------------                     ----------------------------------------------
Home, Copilot, Dashboard, ...    fetch/SSE    CSRF check · rate limits · security headers
  X-BM-Request header + cookie  ───────────►  /auth/*      sessions, scrypt, lockout
  streamPolicyAnswer() (SSE)                  /api/policy/stream   LangGraph RAG (SSE)
                                              /api/policy/ask      same, JSON
                                              /api/support/*       escalations, tickets, agent console
                                              /api/profile         employee details for the Security Team
                                              /api/breaches/*      acknowledgements
                                              /api/security/status, /local-api/health
                                                        │
                                                        ▼
                                              server/security/   encrypted, hash-chained storage
                                              data/   *.json  (AES-256-GCM)  .bm-data.key (dev only)
```

The server code runs inside the Vite dev and preview servers. There is no separate backend process.

## Policy Copilot: agentic RAG with LangGraph

Open it from the **Copilot** tab (key `6`), the command palette ("Ask the Policy Copilot"), or the handbook's **Ask a question** mode. The page shows the pipeline running live, the answer with inline citation chips, and an evidence panel with relevance scores, highlighted terms and confidence and grounding meters.

### The graph

```text
START → guard ─┬─ greeting / injection / too vague ───────────────────────────► respond → END
               └─ policy → rewrite → retrieve → grade ─┬─ not covered ───────────► escalate → END  (Security Team ticket)
                                                       └─► generate → verify ─┬─ grounded ──────► finalize ─┬─► END
                                                              ▲               ├─ not grounded ──┘           └─ confidence < 50% ► escalate
                                                              └───────────────┘   (retry once, strict)
                                                                      └─ fails twice ► extractive → finalize
```

| Node | What it does |
| --- | --- |
| `guard` | Blocks prompt-injection attempts. Redacts secrets (AWS/GitHub/API keys, private keys, passwords, SSNs) before anything is searched or sent to a model, and warns the user. Routes greetings directly. |
| `rewrite` | Resolves follow-up questions using conversation memory, expands security synonyms ("lose" → lost/stolen, "ChatGPT" → generative AI, ...), and adds two LLM paraphrases when Gemini is available. |
| `retrieve` | Runs BM25 (synonyms weighted lower) and dense vector search, then fuses the two rankings with Reciprocal Rank Fusion. A question that names a document ("the security policy", "the code of conduct") prefers that document. |
| `grade` | Keeps passages that cover the question (IDF-weighted, synonym-aware), or uses an LLM relevance grader with Gemini. It also adds matching Security Team approved FAQs, then applies Maximal Marginal Relevance so sources are relevant but not repetitive. Last comes the **answerability gate**. Offline, the question is escalated rather than answered unless the selected evidence covers at least 60% of its meaningful terms (IDF-weighted, generic words ignored), or at least 50% with an estimated confidence of 70% or more. With Gemini, the question is escalated when the LLM grader finds no relevant passage. |
| `generate` | Without a key: extractive synthesis that picks the best policy sentences and cites each one. With Gemini: a streamed answer constrained to the sources, with `[S1]` citations and injection-safe prompting. |
| `verify` | Grounding check: every statement must cite a valid source and share at least half its content words with it. If it fails, the graph regenerates once in strict mode, then falls back to a cited extract. |
| `finalize` | Computes confidence (top relevance, evidence count, grounding), suggests follow-up questions and stores the turn in memory. As a safety net, an answer below 50% confidence, or one where Gemini says the sources do not cover the question, is withheld and escalated. |
| `escalate` | Discards any draft and returns the escalation message. The server then opens a Security Team ticket (see below). |

**Retrieval details.**
- **Chunking:** Sentence-aware chunks of about 700 characters with a one-sentence overlap, giving 181 chunks with document, section and heading metadata. The Code of Conduct is indexed from its markdown export, its structured pillar rules (for example "never accept gifts during an active RFP") and its "Know the Code" scenarios. Approved FAQs are added as one chunk each.
- **Vector search:** Offline, the dense retriever uses a local hashed embedding of IDF-weighted words plus character trigrams, which tolerates typos and word forms. With a key it uses `gemini-embedding-001`, and the embeddings are cached encrypted in `data/rag-embeddings.json`.
- **Memory:** Conversation memory is kept per signed-in session (LangGraph `MemorySaver`, bounded to the last 6 turns). It is keyed by an HMAC of the session, so the session token itself is never stored.

**Measured quality (offline, `npm test`, 14-question golden set).**
- **Accuracy:** The correct section is ranked first for 14/14 questions.
- **Grounding:** 14/14 answers are grounded, and none of the 14 is escalated.
- **Escalation:** Uncovered workplace questions in the tests (parental leave, Grammarly, Slack, vacation days) are all escalated, with no sources shown.
- **Speed:** Median 12 ms, p95 27 ms.

The golden set is small and was written alongside the system, so treat these as regression guards, not a benchmark. The offline gate works on word coverage, so it can still be fooled by a shared word. For example, "How do I get a new monitor?" matches the policy's employee-monitoring text. The Gemini relevance grader handles such cases better.

**Streaming API.** `POST /api/policy/stream` with `{ "question": "...", "conversationId": "c-..." }` returns `text/event-stream` with these events:

- `step`: `{ node, detail, ms }` as each node finishes.
- `token`: answer text as it is produced.
- `final`: the complete result, `{ answer, sources[], mode, route, confidence, grounding, followUps[], trace[], engine, notice?, escalation? }`. When `route` is `escalated`, `escalation` holds `{ reason, coverage, ticketId, agentId, status }` and `sources` is empty.
- `error`

`POST /api/policy/ask` returns the same final object as JSON. Both require a signed-in session and the `X-BM-Request: 1` header.

## Escalation and Security Support

The goal is that employees never receive fabricated or uncertain policy guidance. When the Copilot cannot answer from approved content, it says so immediately:

> We want to ensure the information provided is accurate and compliant with company policy. This question is not covered in the current handbook or approved policy content. To ensure accuracy, your question has been forwarded to the Security Team for review. You will receive a response from Security Agent ID SEC-1042. Your request number is ESC-000001.

**How a question flows**
1. The answerability gate (or the low-confidence safety net) withholds the answer.
2. The server opens a ticket, assigns the least-loaded Security Team member, and attaches context: the earlier turns of the Copilot conversation and the closest (insufficient) policy passages.
3. The employee gets the request number and the assigned agent's ID. They can follow the thread in **Security Support** (header button or key `7`; a badge shows new replies), add details, or reopen it.
4. An agent replies as a **Response** or **Guidance**, attaches policy references, and can resolve the ticket. Ticking "publish as an approved FAQ" adds the answer to the knowledge base, and the Copilot then answers similar questions from it, citing "Approved Security Team FAQ".
5. Resolving a ticket creates or strengthens a **handbook update recommendation**. Similar questions add demand to the same recommendation, so the gaps employees hit most rise to the top. Agents accept or dismiss them.

Employees can also send any question directly, or press **Ask the Security Team** under any AI answer.

**What each side sees**

| Employee sees | Security Team sees |
| --- | --- |
| Their own requests, status, and replies labelled "Security Team response · SEC-1042" (distinct from "AI-generated" answers) | The queue (needs reply, assigned to me, answered, resolved), with a badge for tickets needing attention |
| Only the agent's Security Agent ID: no names, emails or profiles | The requester's name, employee ID, department and business unit, plus email and phone **only if the employee allowed it** |
| A profile card to fill in their details and choose whether to share contact details | The employee's previous related queries (ranked by similarity) and the Copilot context |
| | Approved FAQs (add, retire), handbook recommendations, and a report: volume by status and reason, 14-day trend, median first response and resolution times |

**Controls**
- **Server-side privacy:** Enforced on the server, not in the UI. The employee projection of a ticket never includes the agent's user id, name or email.
- **Team membership:** Only `BM_SECURITY_TEAM` grants console access. The role chosen at registration grants nothing, and other users get HTTP 403.
- **Encryption:** Tickets, FAQs and recommendations are encrypted at rest like all other data.
- **Audit:** Creation, repeats, every agent view of requester details, replies, resolutions, FAQ approvals and recommendation decisions are written to the hash-chained audit log.
- **Input safety:** Secrets are redacted from questions and messages, and messages are length-limited.
- **Spam limits:** A repeated open question reuses its ticket, and each employee can have at most 15 open requests.

**Support API** (signed-in session plus `X-BM-Request: 1`):
- **Employees:**
  - `GET /api/support/summary`
  - `GET|POST /api/profile`
  - `GET|POST /api/support/tickets`
  - `GET /api/support/tickets/:id`
  - `POST /api/support/tickets/:id/messages`
- **Security Team:**
  - `GET /api/support/agent/tickets?status=open|answered|resolved|mine|all`
  - `GET /api/support/agent/tickets/:id`
  - `POST /api/support/agent/tickets/:id/claim|reply|resolve`
  - `GET /api/support/agent/references`
  - `GET|POST /api/support/agent/faqs`
  - `POST /api/support/agent/faqs/:id/retire`
  - `GET /api/support/agent/recommendations`
  - `POST /api/support/agent/recommendations/:id`
  - `GET /api/support/agent/report`

## Security

| Area | Implementation |
| --- | --- |
| Data at rest | Every data file is AES-256-GCM encrypted. Each file uses a fresh IV per write, and its file name is authenticated as associated data, so copying one file over another is detected. Writes are atomic (temp file, fsync, rename) and owner-only. |
| Keys | One master key (`BM_DATA_KEY`, 32 bytes base64), or for local development an auto-generated `data/.bm-data.key`. Separate keys for encryption, audit HMAC and the password pepper are derived with HKDF-SHA256. |
| Integrity | A tampered or swapped file raises an integrity error (HTTP 503) instead of being silently reset. Plaintext files from older versions are migrated to encrypted storage on first read. |
| Audit log | Every entry carries the HMAC of the previous one, so edits, deletions and reordering break the chain. `GET /api/security/status` and `/local-api/health` report whether the chain is intact. Client IPs are stored only as HMACs. |
| Passwords | scrypt (N=2^15, r=8, p=1) over an HMAC pepper. Older PBKDF2 hashes still verify and are upgraded on the next sign-in. Unknown usernames take comparable time to check. 5 failures lock the account for 15 minutes. |
| Sessions | 256-bit random tokens, stored only as SHA-256 hashes in memory. `HttpOnly`, `SameSite=Strict` cookies (`Secure` over HTTPS). 30-minute idle and 8-hour absolute expiry. A session is bound to the browser's user agent, and a password reset ends all sessions. |
| CSRF | Every write needs the `X-BM-Request: 1` header (cross-site requests cannot add it without a CORS preflight, which is never granted), a same-origin `Origin` header, and same-origin Fetch Metadata. |
| Rate limits | Per-client token buckets: sign in 10/min, register 5/min, password reset 3/min, Copilot 20/min, Security Support 30/min, other writes 60/min. Requests over the limit get HTTP 429 with `Retry-After`. Proxy headers are trusted only with `BM_TRUST_PROXY=1`. |
| Headers | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, COOP and CORP, `Cache-Control: no-store` on the API, and HSTS over HTTPS. |
| AI safety | Prompt-injection patterns are blocked. Secrets are redacted before retrieval or any model call. Policy text is passed to the model as delimited data with an instruction to ignore embedded instructions. Answers must be grounded in cited sources, and questions the approved content does not cover are escalated, never guessed. |
| Support privacy | Security Team members are pseudonymous to employees (Security Agent ID only). Requester contact details are shown to agents only with the employee's consent. Every view of requester details is audited. |

**Before production**, add HTTPS, a real database with backups, a secrets manager for `BM_DATA_KEY`, persistent session storage, an email delivery path for password resets, and centralised logging. The current storage is designed for a single local process.

## Frontend

- **Home.** The landing page after sign-in: an XYZ photo banner, progress at a glance, shortcuts to every area and a people-and-places gallery. Breadcrumbs read `BreachMirror > Dashboard`, `BreachMirror > Policy Copilot`, and so on.
- **Policy Copilot.** A chat with a live pipeline view, inline citations, an evidence panel, confidence and grounding meters, follow-up suggestions, copy and feedback buttons, stop and new chat.
  - **Labels:** AI answers carry an "AI-generated" label.
  - **Escalation:** Escalated questions show a "Forwarded to the Security Team" card with the request number, agent ID and a link to track it.
- **Security Support.** Opened from the header button (with an update badge), key `7` or the Home tile. Employees see their requests, threads and profile card. Security Team members also get the console, with tabs for the queue, approved FAQs, handbook updates and reports.
- **Dashboard.** A security posture score shown as mirrored threat and readiness rings, the learning journey, and a widget grid with drag-to-reorder (mouse, touch and keyboard) and resize.
- **Threat activity, security guide, analytics, practice.** The live threat feed, threat radar, sandbox, accessible charts with table views, and the dilemma lab.
- **Learning tools.** The handbook (sections, decision lab, Copilot, speed drills, readiness audit, full policy), the Code of Conduct, the certification exam and the private security check.
- **Design system.** Tokens and rules live in [DESIGN.md](DESIGN.md) and [src/styles/design-tokens.css](src/styles/design-tokens.css).
  - **Look:** Glass surfaces, an ambient backdrop and cursor effects (a light, a ring, ripples and magnetic buttons), all switchable in the user menu.
  - **Fonts:** Self-hosted, so nothing loads from third parties.
  - **Contrast:** Text contrast over every glass and photo layer is unit-tested.
  - **Accessibility:** Keyboard navigation, focus-trapped dialogs, reduced-motion and Windows high-contrast support.

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `Ctrl/Cmd + K` | Command palette |
| `0` / `1` – `5` / `6` / `7` | Home / Dashboard, Threat activity, Security guide, Analytics, Practice / Policy Copilot / Security Support |
| `H`, `O`, `Q`, `U`, `S`, `A` | Handbook, Code of conduct, Exam, Threat radar, Threat sandbox, Private report |
| `R`, `V`, `C`, `D`, `M` | Run simulation, Enhanced protection, Customize layout, Toggle theme, Toggle sound |
| `?` | Keyboard shortcuts |
| `Esc` | Close dialogs and menus |

Single-key shortcuts are ignored while typing or while a dialog is open.

## Configuration

Set these in `.env` (never commit it). See [.env.example](.env.example).

| Variable | Purpose | Default |
| --- | --- | --- |
| `GEMINI_API_KEY` | Enables Gemini embeddings, query rewriting, relevance grading and streamed generation in the Copilot. | unset (offline mode) |
| `GEMINI_MODEL` | Generation model. | `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Embedding model. | `gemini-embedding-001` |
| `BM_DATA_KEY` | 32-byte base64 master key for data encryption. Generate it with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. | auto-generated `data/.bm-data.key` |
| `BM_DATA_DIR` | Location of the encrypted data files. | `./data` |
| `BM_TRUST_PROXY` | Set to `1` only behind a trusted reverse proxy, to honour `X-Forwarded-For` and `X-Forwarded-Proto`. | off |
| `BM_SECURITY_TEAM` | Comma-separated usernames of Security Team members (console access and a `SEC-####` agent ID). | none (tickets wait unassigned) |

`BM_*` settings can be set in `.env` or as real environment variables. Environment variables win.

With a Gemini key, questions and retrieved policy excerpts are sent to Google. Secrets are redacted first, but only enable it where that use is approved.

## Commands and tests

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 (all interfaces). |
| `npm run build` / `npm run preview` | Production build to `dist/` and a local preview with the same server plugin. |
| `npm run lint` | TypeScript type check. |
| `npm test` | 37 tests: RAG evaluation and safety (golden retrieval, grounding, routing, the answerability gate, learning from approved FAQs, redaction, memory), Security Support (assignment, privacy of agent identity, consent-gated contact details, related queries, replies with references, FAQ publishing, recommendations, audit events, encryption), security (encryption, tamper detection, audit chain, password upgrade, rate limits), WCAG contrast of the design tokens over glass and photo layers, learning progress, the secret scanner and auth rules. |
| `npm run clean` | Remove `dist/`. |

## Project structure

```text
server/
  auth-plugin.ts           HTTP routes, CSRF, rate limits, headers, SSE
  auth-service.ts          accounts, sessions, lockout, password reset
  policy-rag-service.ts    runs the LangGraph pipeline (stream + JSON)
  support-service.ts       escalation tickets, assignment, privacy views, FAQs, recommendations, reports
  ops-service.ts           health, acknowledgements
  rag/  corpus.ts          chunking with overlap and metadata
        knowledge-base.ts  approved Security Team FAQs, reference catalog
        text.ts            tokenising, stemming, security synonyms
        retrievers.ts      BM25, local + Gemini vectors, RRF, MMR
        graph.ts           LangGraph state, nodes, edges, grounding check
  security/ secure-store.ts  AES-256-GCM files, HKDF keys, atomic writes
            audit-log.ts     hash-chained audit trail
            password.ts      peppered scrypt, legacy upgrade
            rate-limit.ts    token buckets
src/
  app.tsx                  shell, routing between tabs, dialogs
  components/copilot/      Copilot workspace, pipeline view, answer + evidence, escalation card
  components/support/      Security Support: employee requests, agent console, thread, profile
  components/home/         Home page
  components/shell/        header, command palette, user menu, cursor effects, backdrops
  components/dashboard/    posture, tools, widget grid
  components/learning/     progress ring, journey
  components/handbook/     handbook modes (detail, document, drills, audit, lab)
  components/common/       dialogs (exam, radar, sandbox, conduct, ...)
  components/charts/       chart kit
  components/ui/           dialog, switch, severity, risk meter, theme switcher
  services/                API client (SSE), telemetry store, learning progress, secret scanner
  styles/                  design tokens, self-hosted fonts
tests/                     node:test suites (run with tsx)
public/images/xyz/     XYZ photos (see the README in that folder)
```

## Data and storage

**Server (encrypted, in `data/`):**
- **Accounts and audit:** `auth-users.json` (accounts, employee profiles and agent IDs) and `auth-audit.json` (hash-chained).
- **Security Support:** `support-tickets.json`, `support-faqs.json` and `kb-recommendations.json`.
- **Other data:** `acknowledgements.json` and `rag-embeddings.json` (only with Gemini).
- **Key:** `.bm-data.key` (development key; keep it out of backups that leave the machine). The whole `data/` folder is git-ignored.

**Browser (`localStorage`, per user preference and progress):**
- **Display:** `breachmirror_theme_preference`, `breachmirror_scenery`, `breachmirror_fx`, `breachmirror_audio_enabled`.
- **Layout:** `bm_widgets_cfg`.
- **Progress:**
  - **Posture and streak:** `bm_posture_history`, `bm_activity_days`.
  - **Learning tools:** `bm_flashcards_mastered`, `bm_onboarding_checklist`, `xyz_sentinel_audit_checks`, `xyz_master_quiz_answers`.
  - **Pledges:** `xyz_policy_pledge_signed`, `xyz_code_conduct_pledge_signed`.
- **Copilot:** `bm_copilot_feedback`.

**Session storage:** `bm_copilot_conversation` (the Copilot thread id).

## Troubleshooting

- **"Secure storage failed an integrity check" (HTTP 503).** A data file was modified, or the key changed. Restore the file or the key from a backup. If the key is lost, the encrypted data cannot be recovered; delete `data/` to start fresh.
- **Requests return 403.** Writes need the `X-BM-Request: 1` header and a same-origin request. The bundled client sends it; scripts and tools must too.
- **Requests return 429.** You hit a rate limit; wait for the `Retry-After` seconds.
- **Signed out unexpectedly.** Sessions end after 30 idle minutes, after 8 hours, when the browser changes, or when the server restarts (sessions are in memory).
- **The Copilot shows "Extractive synthesis".** That is the offline mode. Set `GEMINI_API_KEY` for model-written answers.
- **No "Security Team console" tab.** Add your username to `BM_SECURITY_TEAM` in `.env`, restart the server and sign in again.
- **Escalation says "A Security Agent will be assigned shortly".** No Security Team is configured. Tickets wait in the queue until an agent opens or claims them.
- **Port 3000 is in use.** Run `npm exec vite -- --port 3001 --host 0.0.0.0`.

## Scope and limitations

- Threat telemetry, radar events, risk scores and countermeasures are simulated for training.
- Accounts and sessions are local to one server process. This is not a production identity system.
- Security Support has no email or chat notifications. Updates appear in the app badge, which polls every 45 seconds.
- The Copilot answers only from the bundled policy text and approved FAQs, and it can still be wrong. Check important decisions with IT Security (maya.patel@xyz.com) or Ethics (daniel.brooks@xyz.com, hotline (800) 555-0199).
- No license has been chosen for this repository yet.
