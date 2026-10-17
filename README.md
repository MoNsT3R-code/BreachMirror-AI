# BreachMirror AI

A security-awareness and policy-training platform built as a single React application with a server plugin. It combines a **Policy Copilot** (an agentic RAG pipeline built on LangGraph), an encrypted and tamper-evident data layer, a learning journey with certification, and simulated threat telemetry.

> **Training simulation.** Threat events, telemetry, risk scores and countermeasures are simulated. The policy content is reference text, but nothing here monitors or protects real systems. Do not enter real credentials or customer data.

![Format](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)
![AI](https://img.shields.io/badge/AI-LangGraph%20Agentic%20RAG-1C3C3C)
![Security](https://img.shields.io/badge/Security-AES--256--GCM%20%2B%20Hash--Chained%20Audit-c49a2c)
![Tests](https://img.shields.io/badge/Tests-37%20passing-brightgreen)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-0f1c42)
![License](https://img.shields.io/badge/License-Not%20yet%20chosen-lightgrey)

---

## 🌐 Overview

BreachMirror AI helps employees learn security policy in context. Employees ask questions in plain English and receive cited answers drawn only from approved policy content. When the approved content does not cover a question with confidence, the system does not guess: it opens a ticket for the Security Team, who reply in a thread and can publish approved answers so the Copilot handles similar questions from then on.

The application also includes a learning journey (readiness audit, pledges, speed drills and a certification exam with a printable certificate), a security posture dashboard, and an analytics view. Everything runs in one local server process, with no separate backend and no external services required.

---

## 📍 Quick Navigation

* [🌐 Overview](#-overview)
* [📦 Page Architecture](#-page-architecture)
* [✨ Key Features](#-key-features)
* [🤖 Policy Copilot](#-policy-copilot-agentic-rag-with-langgraph)
* [🛟 Escalation and Security Support](#-escalation-and-security-support)
* [🔐 Security](#-security)
* [📁 Repository Structure](#-repository-structure)
* [🧰 Tech Stack](#-tech-stack)
* [💻 System Requirements](#-system-requirements)
* [🚀 Getting Started](#-getting-started)
* [⚙️ Configuration](#️-configuration)
* [🧪 Commands and Tests](#-commands-and-tests)
* [🎮 Keyboard Shortcuts](#-keyboard-shortcuts)
* [🗄️ Data and Storage](#️-data-and-storage)
* [🛠️ Troubleshooting](#️-troubleshooting)
* [⚠️ Scope and Limitations](#️-scope-and-limitations)
* [📄 License](#-license)

---

## 📦 Page Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                 BROWSER · React 19 + Vite                      │
│   Home · Policy Copilot · Dashboard · Security Support · ...   │
└───────────────────────────────┬────────────────────────────────┘
                                │ fetch / Server-Sent Events
                                │ (X-BM-Request header + session cookie)
                                ↓
┌────────────────────────────────────────────────────────────────┐
│          SERVER · Vite plugin (server/auth-plugin.ts)          │
├────────────────────────────────────────────────────────────────┤
│  CSRF check · rate limits · security headers                   │
│  /auth/*              sessions, scrypt hashing, lockout        │
│  /api/policy/*        LangGraph RAG (streamed and JSON)        │
│  /api/support/*       tickets, Security Team console           │
│  /api/profile         employee details (consent-gated)         │
│  /api/breaches/*      acknowledgements                         │
│  /api/security/status, /local-api/health                       │
└───────────────────────────────┬────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────┐
│  server/security/ · encrypted, hash-chained storage            │
│  data/*.json (AES-256-GCM) · .bm-data.key (development only)   │
└────────────────────────────────────────────────────────────────┘
```

| Layer | What It Holds | Where to Read More |
| --- | --- | --- |
| **Browser** | Pages, the live Copilot pipeline view, dashboards and the learning tools | [Frontend](#-frontend) |
| **Server plugin** | Routes, sessions, CSRF protection, rate limits and the RAG pipeline | [Policy Copilot](#-policy-copilot-agentic-rag-with-langgraph) |
| **Encrypted storage** | Accounts, audit log, tickets, FAQs and embeddings | [Data and Storage](#️-data-and-storage) |

---

## ✨ Key Features

✅ **Policy Copilot** - Ask a question in plain English and get a cited answer from the IT Security Policy and the Code of Business Conduct. Answers stream live, and the interface shows each pipeline step as it runs.

✅ **Never Guesses** - If the approved content does not cover a question with confidence, no answer is generated. The question goes to the Security Team instead.

✅ **Security Support** - Employees track their requests and reply in threads. Security Team agents see the queue, reply with policy references, resolve requests and publish approved FAQs.

✅ **Works Offline** - Every answer is grounded and cited with no API key needed. Adding `GEMINI_API_KEY` upgrades retrieval and generation.

✅ **Encrypted and Audited** - AES-256-GCM encryption at rest, a hash-chained audit log that detects tampering, and privacy controls for employee contact details.

✅ **Learning Journey** - Readiness audit, pledges, speed drills, a certification exam with a printable certificate, a day streak and a security posture score.

✅ **Designed Interface** - Light and dark themes, a command palette (Ctrl/Cmd + K), keyboard navigation and WCAG 2.2 AA accessibility.

---

## 🤖 Policy Copilot: Agentic RAG with LangGraph

Open the Copilot from the **Copilot** tab (key `6`), the command palette, or the handbook's **Ask a question** mode. The page shows the pipeline running live, the answer with inline citations, and an evidence panel with relevance scores, confidence and grounding meters.

### The Graph

```text
START → guard ─┬─ greeting / injection / too vague ─────────────────────► respond → END
               └─ policy → rewrite → retrieve → grade ─┬─ not covered ──► escalate → END (Security Team ticket)
                                                       └─► generate → verify ─┬─ grounded ──► finalize → END
                                                              ▲               └─ not grounded ─┘ (retry once, strict)
                                                              └──────────────┘  fails twice ► extractive → finalize
```

| Node | What It Does |
| --- | --- |
| `guard` | Blocks prompt-injection attempts and redacts secrets (API keys, private keys, passwords, SSNs) before anything is searched or sent to a model. |
| `rewrite` | Resolves follow-up questions using conversation memory and expands security synonyms (for example, "lose" → lost or stolen). |
| `retrieve` | Runs BM25 and dense vector search, then fuses the two rankings with Reciprocal Rank Fusion. |
| `grade` | Keeps passages that cover the question, adds matching approved FAQs, and applies Maximal Marginal Relevance to reduce repetition. An answerability gate escalates questions the evidence does not cover. |
| `generate` | Offline, extracts and cites the best policy sentences. With Gemini, writes a streamed answer constrained to the sources with `[S1]`-style citations. |
| `verify` | Checks that every statement cites a valid source. If not, regenerates once in strict mode, then falls back to a cited extract. |
| `finalize` | Computes confidence and grounding, suggests follow-up questions and stores the turn in memory. Low-confidence answers are withheld and escalated. |
| `escalate` | Returns the escalation message and opens a Security Team ticket. |

### Retrieval Details

- **Chunking:** Sentence-aware chunks of about 700 characters with one-sentence overlap, with document, section and heading metadata. Approved FAQs are added as one chunk each.
- **Vector search:** Offline, a local hashed embedding of weighted words and character trigrams, which tolerates typos and word forms. With a Gemini key, `gemini-embedding-001` is used and the embeddings are cached encrypted.
- **Memory:** Conversation memory is kept per signed-in session, limited to the last six turns, and keyed by an HMAC of the session token so the token itself is never stored.

### Measured Quality

Measured offline with `npm test` on a 14-question golden set:

| Metric | Result |
| --- | --- |
| Correct section ranked first | 14 / 14 |
| Answers grounded | 14 / 14 |
| Uncovered questions escalated | All tested cases |
| Latency | Median 12 ms, p95 27 ms |

The golden set is small and was written alongside the system, so treat these results as regression guards rather than a benchmark.

**Streaming API:** `POST /api/policy/stream` with `{ "question": "...", "conversationId": "c-..." }` returns Server-Sent Events: `step`, `token`, `final` and `error`. `POST /api/policy/ask` returns the same final result as JSON. Both require a signed-in session and the `X-BM-Request: 1` header.

---

## 🛟 Escalation and Security Support

Employees never receive fabricated or uncertain policy guidance. When the Copilot cannot answer from approved content, it says so and forwards the question:

> This question is not covered in the current handbook or approved policy content. Your question has been forwarded to the Security Team for review. You will receive a response from Security Agent ID SEC-1042.

### How a Question Flows

1. The answerability gate withholds the answer.
2. A ticket opens and is assigned to the least-loaded Security Team member, with the conversation context and the closest policy passages attached.
3. The employee receives a request number and the agent's ID, and can follow the thread in **Security Support** (key `7`).
4. The agent replies, attaches policy references and can resolve the ticket. Publishing a reply as an approved FAQ makes the Copilot answer similar questions from it.
5. Resolved tickets feed **handbook update recommendations**, so the gaps employees hit most rise to the top for review.

### Who Sees What

| Employees See | Security Team Sees |
| --- | --- |
| Their own requests, status and replies, labelled as Security Team responses | The queue, grouped by status, with a badge for tickets needing attention |
| Only the agent's Security Agent ID, never names or profiles | The requester's name, department and business unit, plus contact details **only if the employee consented** |
| A profile card where they choose whether to share contact details | Related past questions, the Copilot context, approved FAQs and reports |

### Controls

- **Privacy is enforced on the server.** The employee view never includes the agent's user ID, name or email.
- **Console access** is granted only to usernames listed in `BM_SECURITY_TEAM`.
- **Everything is audited**, including every time an agent views requester details.
- **Spam limits:** A repeated open question reuses its ticket, and each employee can have at most 15 open requests.

---

## 🔐 Security

| Area | Implementation |
| --- | --- |
| **Data at rest** | AES-256-GCM encryption for every data file. A fresh IV is used per write, and the file name is authenticated, so swapping files is detected. Writes are atomic. |
| **Keys** | One master key (`BM_DATA_KEY`), with separate encryption, audit and password-pepper keys derived using HKDF-SHA256. |
| **Integrity** | Tampered or swapped files raise an integrity error instead of being silently reset. |
| **Audit log** | Each entry carries the HMAC of the previous one, so edits, deletions and reordering break the chain. Client IPs are stored only as HMACs. |
| **Passwords** | Peppered scrypt hashing. Older hashes are upgraded on the next sign-in. Five failed attempts lock the account for 15 minutes. |
| **Sessions** | 256-bit random tokens stored only as hashes. `HttpOnly` and `SameSite=Strict` cookies, 30-minute idle expiry, 8-hour absolute expiry, and binding to the browser's user agent. |
| **CSRF** | Every write requires a custom header, a same-origin `Origin` and same-origin Fetch Metadata. |
| **Rate limits** | Per-client token buckets for sign-in, registration, password reset, Copilot and other writes. Over-limit requests receive HTTP 429 with `Retry-After`. |
| **Headers** | Strict security headers, `Cache-Control: no-store` on the API, and HSTS over HTTPS. |
| **AI safety** | Prompt-injection patterns are blocked, secrets are redacted before any model call, and answers must be grounded in cited sources. |

**Before production**, add HTTPS, a real database with backups, a secrets manager for `BM_DATA_KEY`, persistent session storage, an email path for password resets and centralised logging. The current storage is designed for a single local process.

---

## 📁 Repository Structure

```text
server/
  auth-plugin.ts           HTTP routes, CSRF, rate limits, headers, SSE
  auth-service.ts          accounts, sessions, lockout, password reset
  policy-rag-service.ts    runs the LangGraph pipeline
  support-service.ts       tickets, assignment, privacy views, FAQs, reports
  rag/                     chunking, knowledge base, retrievers, graph
  security/                encrypted storage, audit log, passwords, rate limits
src/
  app.tsx                  shell and routing
  components/copilot/      Copilot workspace, pipeline view, escalation card
  components/support/      Security Support for employees and the agent console
  components/dashboard/    posture score, widgets and layout
  components/learning/     progress and journey
  components/handbook/     handbook, drills, readiness audit and lab
  services/                API client, telemetry store, learning progress
  styles/                  design tokens and self-hosted fonts
tests/                     node:test suites
```

---

## 🧰 Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite |
| **Server** | Vite server plugin (Node.js 20 or newer) |
| **AI pipeline** | LangGraph, BM25, vector search, Reciprocal Rank Fusion, MMR |
| **Optional model** | Google Gemini (embeddings and generation) |
| **Storage** | Encrypted JSON files (AES-256-GCM, HKDF-SHA256) |
| **Testing** | Node.js test runner with `tsx` |

---

## 💻 System Requirements

* **Node.js:** Version 20 or newer (tested on 24).
* **Browser:** Any modern browser (Chrome, Edge, Firefox or Safari).
* **Internet:** Optional. Only needed for Gemini mode.

---

## 🚀 Getting Started

### Step 1: Install and Run

```bash
npm install
npm run dev
```

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd install` and `npm.cmd run dev`.

### Step 2: Create an Account

Open **http://localhost:3000/**, choose **Create an account** and register with an `@your-domain.com` email address. The username must match the part before the `@`. Then sign in.

### Step 3: Try the Security Team Console (optional)

Register a second account, add its username to `.env` as `BM_SECURITY_TEAM=username`, restart the server and sign in as that user.

### Optional: Enable Gemini

Copy `.env.example` to `.env`, set `GEMINI_API_KEY`, and restart the server. Questions and retrieved policy excerpts are then sent to Google, after secrets are redacted. Enable this only where that use is approved.

---

## ⚙️ Configuration

Set these in `.env`, and never commit that file. See [.env.example](.env.example).

| Variable | Purpose | Default |
| --- | --- | --- |
| `GEMINI_API_KEY` | Enables Gemini embeddings, query rewriting, relevance grading and streamed answers. | Unset (offline mode) |
| `GEMINI_MODEL` | Generation model. | `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Embedding model. | `gemini-embedding-001` |
| `BM_DATA_KEY` | 32-byte base64 master key for encryption. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. | Auto-generated development key |
| `BM_DATA_DIR` | Location of encrypted data files. | `./data` |
| `BM_TRUST_PROXY` | Set to `1` only behind a trusted reverse proxy. | Off |
| `BM_SECURITY_TEAM` | Comma-separated usernames of Security Team members. | None (tickets wait unassigned) |

---

## 🧪 Commands and Tests

| Command | What It Does |
| --- | --- |
| `npm run dev` | Development server on port 3000. |
| `npm run build` / `npm run preview` | Production build and local preview. |
| `npm run lint` | TypeScript type check. |
| `npm test` | 37 tests covering RAG evaluation and safety, Security Support, encryption, tamper detection, audit chain, password upgrades, rate limits, colour contrast, learning progress, the secret scanner and auth rules. |
| `npm run clean` | Removes `dist/`. |

---

## 🎮 Keyboard Shortcuts

| Keys | Action |
| --- | --- |
| `Ctrl/Cmd + K` | Command palette |
| `0` to `7` | Home, Dashboard, Threat activity, Security guide, Analytics, Practice, Policy Copilot, Security Support |
| `H`, `O`, `Q`, `U`, `S`, `A` | Handbook, Code of conduct, Exam, Threat radar, Threat sandbox, Private report |
| `R`, `V`, `C`, `D`, `M` | Run simulation, Enhanced protection, Customize layout, Toggle theme, Toggle sound |
| `?` | Keyboard shortcuts |
| `Esc` | Close dialogs and menus |

Single-key shortcuts are ignored while typing or while a dialog is open.

---

## 🗄️ Data and Storage

**Server (encrypted, in `data/`):**
- **Accounts and audit:** `auth-users.json`, `auth-audit.json`
- **Security Support:** `support-tickets.json`, `support-faqs.json`, `kb-recommendations.json`
- **Other:** `acknowledgements.json`, and `rag-embeddings.json` when Gemini is enabled
- **Key:** `.bm-data.key` is for development only. Keep it out of any backup that leaves the machine. The `data/` folder is git-ignored.

**Browser (`localStorage`):** Theme, layout, learning progress and pledge status, all stored per user preference.

---

## 🛠️ Troubleshooting

- **Integrity check failed (HTTP 503):** A data file was modified, or the key changed. Restore the file or key from a backup. If the key is lost, encrypted data cannot be recovered.
- **Requests return 403:** Writes need the `X-BM-Request: 1` header and a same-origin request. The bundled client sends it; custom scripts must too.
- **Requests return 429:** You hit a rate limit. Wait for the `Retry-After` period.
- **Signed out unexpectedly:** Sessions end after 30 idle minutes, after 8 hours, or when the server restarts.
- **Copilot shows "Extractive synthesis":** Offline mode. Set `GEMINI_API_KEY` for model-written answers.
- **No Security Team console:** Add your username to `BM_SECURITY_TEAM`, restart and sign in again.
- **Port 3000 in use:** Run `npm exec vite -- --port 3001 --host 0.0.0.0`.

---

## ⚠️ Scope and Limitations

- Threat telemetry, risk scores and countermeasures are simulated for training.
- Accounts and sessions are local to one server process and are not a production identity system.
- Security Support has no email or chat notifications. Updates appear as an in-app badge.
- The Copilot answers only from the bundled policy text and approved FAQs, and it can still be wrong. Confirm important decisions with the appropriate policy owner.

---

## 📄 License

No license has been chosen for this repository yet.
