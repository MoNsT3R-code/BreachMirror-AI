# BreachMirror AI

BreachMirror AI is a browser-based cybersecurity awareness and incident-response training console. It combines simulated breach telemetry, zero-blame incident coaching, security policy education, interactive analytics, threat-response exercises, and compliance certification in one React application.

The application is intentionally designed as a safe training simulator. Its incidents, telemetry, policies, risk scores, remediation guidance, and health status are mock or locally generated data unless explicitly connected to a future backend. Do not treat the displayed events or commands as evidence from a production security environment.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [How To Use The application](#how-to-use-the-application)
- [Dashboard Views](#dashboard-views)
- [Interactive Tools](#interactive-tools)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Theme, Audio, And Vengeance Mode](#theme-audio-and-vengeance-mode)
- [application Architecture](#application-architecture)
- [State And Persistence](#state-and-persistence)
- [API And Backend Behavior](#local-api-and-backend-behavior)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Safety And Scope](#safety-and-scope)

## Features

- Server-backed local operator accounts with selectable security roles.
- Dashboard views for telemetry, playbooks, analytics, and scenario training.
- Simulated live threat streams with severity filters and forensic inspection.
- Interactive radar views for simulated handbook breach vectors.
- Local secret and phishing detection through the Confession Airlock.
- Zero-blame remediation coaching and downloadable incident certificates.
- Stewart IT Security Policy and Code of Business Conduct learning tools.
- Section quizzes, flashcards, decision labs, readiness audits, and certification exams.
- Policy Q&A with locally ranked policy passages, source citations, and optional server-side Gemini drafting.
- D3-powered threat-volume, attack-vector, and tenure-risk visualizations.
- Widget visibility and ordering customization.
- Dark/light theme switching, browser audio, speech synthesis, and visual alert modes.
- Keyboard-first navigation for the primary console workflows.
- Local storage for dashboard preferences, layout, pledges, readiness progress, and exam answers. Authentication state is held in an HttpOnly server cookie.

## Quick Start

### Prerequisites

Install the following before starting:

- Node.js 18 or newer.
- npm 9 or newer, included with Node.js.
- A modern browser with support for ES modules, Web Audio, speech synthesis, and `localStorage`.

### Install And Run

From the repository root:

```bash
npm install
npm run dev
```

The development server runs at:

```text
http://localhost:3000/
```

The Vite server binds to `0.0.0.0`, so the network URL printed by Vite can be used to open the application from another device on the same network.

### Production Preview

Create and preview a production build:

```bash
npm run build
npm run preview
```

The production build is written to `dist/`. The preview command serves that build locally through Vite.

## Available Commands

The scripts are defined in [package.json](package.json).

| Command | Description |
| --- | --- |
| `npm install` | Install runtime and development dependencies. |
| `npm run dev` | Start Vite on port `3000` and bind to all interfaces. |
| `npm run build` | Type-check as part of the Vite production build and emit `dist/`. |
| `npm run preview` | Serve the generated production build locally. |
| `npm run lint` | Run `tsc --noEmit` for TypeScript validation. |
| `npm run clean` | Remove `dist` and `server.js` using the repository's shell command. |

On Windows PowerShell, if `npm` is blocked by the execution policy, use the Windows command shim:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
```

## How To Use The application

### 1. Create A Local Operator Account

The initial screen is the login panel:

1. Select **Create account** and provide your full name, Stewart username, `@stewart.com` company email, role, password, and matching confirmation password.
2. Your username must match the local part of your company email. Passwords must be 8-64 characters with uppercase and lowercase letters, a number, and a special character; passwords containing an identifier or common weak passwords are rejected.
3. Sign in with either your registered username or company email. The browser does not store the password or a client-managed session.

Available roles:
   - Incident Commander
   - Threat Hunter
   - SOC Security Lead
   - Cloud Security Architect

Five consecutive failed logins lock an account for 15 minutes. Login failures use generic messages unless the account is locked. **Forgot password?** starts the local development reset flow; the reset token is printed only in the Vite server log and is never shown in the UI.

### 2. Navigate The Console

After authorization, the main dashboard renders a glass-style navbar, a welcome banner, configurable widgets, and the active view. The navbar exposes the main tools, operator details, theme control, audio control, and logout.

The application shell and dashboard state are coordinated by [src/app.tsx](src/app.tsx). The login screen is implemented in [src/components/auth/login-panel.tsx](src/components/auth/login-panel.tsx).

### 3. Explore Training Workflows

A typical learning path is:

1. Review the Threat Telemetry view.
2. Inspect a sample event from the live threat stream.
3. Read the generated coaching and remediation guidance.
4. Open the Security Handbook and complete a section quiz.
5. Practice a scenario in the Workplace Dilemma Lab.
6. Use the Confession Airlock to test secret and phishing detection.
7. Finish the Readiness Audit and Master Certification Exam.

## Dashboard Views

The dashboard uses five view keys. The overview shows all visible widgets; the remaining views filter widgets by their configured category.

| View | Shortcut | Category | Purpose |
| --- | --- | --- | --- |
| Dashboard | `1` | All | Full overview of visible widgets. |
| Threat Telemetry | `2` | `telemetry` | Simulated events, sensors, and breach vectors. |
| Security Playbook | `3` | `playbook` | Policy guidance and onboarding material. |
| D3 Analytics | `4` | `analytics` | Interactive threat and tenure visualizations. |
| Dilemma Lab | `5` | `simulator` | Scenario-based security decision practice. |

### Threat Telemetry Widgets

#### 3D Radar Breach Detector

Implemented by [radar-widget.tsx](src/components/widgets/radar-widget.tsx).

- Displays simulated handbook breach vectors on an animated radar.
- Supports scanner and 3D grid presentation modes.
- Lets the operator select breach blips.
- Opens the full Tactical Radar.
- Links selected vectors to the associated handbook section.

#### Threat Velocity And Sensors

Implemented by [threat-speed-widget.tsx](src/components/widgets/threat-speed-widget.tsx).

- Displays simulated threat velocity in events per minute.
- Tracks prevented and quarantined event counters.
- Supports live and paused sensor state.
- Starts the application's simulated threat injection flow.

#### Live Threat Stream And Quarantines

Implemented by [threat-feed-widget.tsx](src/components/widgets/threat-feed-widget.tsx).

- Lists mock intercepted threat events.
- Filters by search text.
- Filters by severity.
- Opens the Forensic Telemetry modal for a selected event.

#### Active Ingress Vector Hooks

Implemented by [active-threats-widget.tsx](src/components/widgets/active-threats-widget.tsx).

This widget displays simulated monitoring daemons for categories such as:

- GenAI ingestion.
- Git secrets.
- USB and physical devices.
- Phishing.
- Cloud storage.
- Wi-Fi.
- MFA and identity controls.

### Security Playbook Widgets

#### Internee And New Joiner Handbook

Implemented by [handbook-widget.tsx](src/components/widgets/handbook-widget.tsx).

- Switches between IT Security Policy and Code of Conduct content.
- Displays policy pillars and vectors.
- Provides links to the full handbook and Code of Conduct tools.
- Supports audio alerts and policy-related actions.

#### Security Directives: Do's And Don'ts

Implemented by [do-and-dont-widget.tsx](src/components/widgets/do-and-dont-widget.tsx).

- Filters rules for AI tools, Git secrets, MFA, physical devices, and cloud storage.
- Separates approved behavior from prohibited behavior.
- Expands rationale and real-world precedent.
- Shows sanctioned alternatives.
- Copies approved paths to the clipboard.

#### Day 1-14 Security Checklist

Implemented by [onboarding-checklist-widget.tsx](src/components/widgets/onboarding-checklist-widget.tsx).

- Tracks onboarding milestones.
- Displays completion percentage.
- Awards simulated XP.
- Keeps progress in component state for the current session.

### Analytics Widgets

#### D3 Threat Stream Velocity

Implemented by [threat-stream-chart.tsx](src/components/widgets/threat-stream-chart.tsx).

- Shows a simulated 24-hour threat-volume area chart.
- Supports hover inspection.
- Includes an accessible table representation.

#### D3 Attack Vector Donut

Implemented by [attack-vector-chart.tsx](src/components/widgets/attack-vector-chart.tsx).

- Compares simulated GenAI leaks, Git secrets, USB media, phishing proxies, and cloud misconfiguration.
- Supports hover and click selection.
- Includes an accessible table representation.

#### D3 Tenure Vulnerability Matrix

Implemented by [tenure-risk-chart.tsx](src/components/widgets/tenure-risk-chart.tsx).

- Compares simulated phishing, GenAI paste, and secret-commit rates.
- Groups results by employee tenure.
- Provides hover annotations and an accessible table representation.

### Simulator Widgets

#### Workplace Dilemma Lab

Implemented by [workplace-scenarios-widget.tsx](src/components/widgets/workplace-scenarios-widget.tsx).

- Starts an interactive challenge session.
- Presents realistic workplace security scenarios.
- Offers multiple choices for each scenario.
- Provides correctness feedback and XP changes.
- Shows a Day 0, Day 2, Day 5, and Day 10 consequence timeline.
- Supports retry, next scenario, and exit actions.
- Does not persist progress after the component session ends.

## Interactive Tools

### Widget Customizer

Implemented by [widget-customizer-modal.tsx](src/components/common/widget-customizer-modal.tsx).

Open it from the sliders control or with `C`.

Capabilities:

- Reorder widgets.
- Toggle widget visibility.
- apply changes.
- Cancel uncommitted changes.
- Restore the default layout.

applied layout configuration is stored under `bm_widgets_cfg`.

### Forensic Telemetry And Coaching

Implemented by [breach-detail-modal.tsx](src/components/common/breach-detail-modal.tsx).

Open it by selecting **Inspect** on a telemetry event.

The modal displays:

- Intercepted action.
- Event status.
- User cohort.
- Violated rule.
- Root cause.
- Potential blast radius.
- Simulated teachable-moment analysis.
- Risk score.
- Immediate remediation steps.
- Recommended sanctioned tools.
- Compliance impact.

The acknowledge action currently calls a local API facade that returns success without persisting to a backend.

### AI Threat Sandbox

Implemented by [threat-sandbox-modal.tsx](src/components/common/threat-sandbox-modal.tsx).

Open it from the navbar, the welcome banner, or with `S`.

Capabilities:

- Run built-in scenario presets.
- Enter a custom action or command.
- Select a target operator role.
- Receive a simulated threat category.
- Receive severity and risk score.
- Review blast-radius analysis.
- Review immediate remediation and a safer alternative.
- Review a recommended security directive.

Despite its product name, the current implementation is local keyword-based classification with a simulated delay. It does not currently call Gemini or another remote AI service.

### Security Handbook

Implemented by [security-handbook-modal.tsx](src/components/common/security-handbook-modal.tsx).

The handbook contains the stored Stewart IT Security Policy v7.0 content and supports:

- Search across policy vectors.
- Category filtering.
- Policy blueprint inspection.

### Policy RAG Q&A

The Policy Assistant retrieves relevant passages from the local IT Security Policy and Code of Business Conduct before answering. Results include source excerpts and section references. Without `GEMINI_API_KEY`, it displays the retrieved excerpts without generating a model answer. With a key configured, Gemini drafts a concise answer using only the retrieved passages. The key stays on the server; the browser never receives it.

When Gemini is enabled, the user's question and the matching policy excerpts are sent to Google for answer drafting. Do not enable this for confidential documents or questions unless that use is approved. The local retriever uses BM25-style keyword ranking; it does not yet use vector embeddings.
- Breach mechanics and prevention guidance.
- Rules and policy directives.
- Per-section quizzes.
- Browser speech-synthesis briefings.
- Threat alarm audio.
- Policy pledge persistence.
- Markdown export.
- Clipboard copy.
- Browser printing.
- Security sentinel certificate scoring.
- Links to the Code of Conduct and Master Exam.

The handbook also embeds several learning modes:

| Learning mode | Component | Purpose |
| --- | --- | --- |
| Decision Lab | [decision-lab.tsx](src/components/handbook/decision-lab.tsx) | Evaluate preset or custom workplace policy scenarios. |
| Ask Sentinel | [policy-assistant.tsx](src/components/handbook/policy-assistant.tsx) | Search policy FAQs with citations, guidance, and escalation contacts. |
| Speed Drills | [flashcards.tsx](src/components/handbook/flashcards.tsx) | Flip cards, mark mastery, track a session streak, and reset drills. |
| Readiness Audit | [readiness-audit.tsx](src/components/handbook/readiness-audit.tsx) | Complete ten checks, calculate a rank, and update certificate status. |
| Full Policy Document | Inside the handbook modal | Read the complete stored policy and emergency contacts. |

### Stewart Code Of Conduct

Implemented by [conduct-modal.tsx](src/components/common/conduct-modal.tsx).

The module includes:

- Seven core pillars.
- Searchable pillar subtopics.
- An ethical decision test.
- Sixteen Know the Code scenarios.
- Expandable answers and action protocols.
- CEO message and Stewart DNA content.
- Speak Up and hotline information.
- Full document view.
- Compliance pledge behavior.
- Markdown download and clipboard copy.
- A link to the Master Exam.

### Master Certification Exam

Implemented by [certification-quiz-modal.tsx](src/components/common/certification-quiz-modal.tsx).

The exam combines questions from the IT Security Policy and Code of Business Conduct.

Capabilities:

- Filter questions by source document.
- Navigate directly to a question.
- Lock an answer after selection.
- Review explanations and policy directives.
- View source citations.
- View contact and action guidance.
- Reset answers.
- Print the certification result.

Certification requires every question to be answered and a score of at least 80 percent. Answers are stored under `stewart_master_quiz_answers`.

### Tactical Vengeance Radar

Implemented by [threat-radar-modal.tsx](src/components/common/threat-radar-modal.tsx).

The radar supports animated 3D isometric and 2D top-down modes with ten simulated handbook breach vectors.

Capabilities:

- Select clickable radar blips.
- View target dossiers.
- Review scenario, source, cohort, payload vector, and projected blast radius.
- Detect vectors as the sweep crosses them.
- Reset the radar.
- Toggle local sound.
- Open the related handbook section.
- Deploy simulated countermeasures.

Available countermeasures:

1. Canary honeytoken.
2. BGP blackhole and session invalidation.
3. Forensic mirror sandbox.

Countermeasures neutralize a selected sample after a short simulated delay and increment the countermeasure total.

### Zero-Blame Confession Airlock

Implemented by [confession-airlock-modal.tsx](src/components/common/confession-airlock-modal.tsx).

The Airlock evaluates pasted content locally in browser memory. It includes test presets for:

- AWS access keys.
- GitHub personal access tokens.
- OpenAI API keys.
- Phishing links and suspicious messages.

For matching content, it reports:

- Finding type.
- Matched string.
- Risk severity.
- Estimated blast radius.
- Cleanup or remediation script.
- Credential rotation command.

Operators can copy remediation text and download a generated Markdown zero-blame immunity certificate. The scanned content is not sent to the backend.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `?` or `Shift + /` | Open the keyboard shortcut reference. |
| `1` | Switch to Dashboard. |
| `2` | Switch to Threat Telemetry. |
| `3` | Switch to Security Playbook. |
| `4` | Switch to D3 Analytics. |
| `5` | Switch to Dilemma Lab. |
| `V` | Toggle Vengeance Overdrive. |
| `U` | Open Tactical Radar. |
| `A` | Open Confession Airlock. |
| `M` | Toggle audio. |
| `H` | Open Security Handbook. |
| `O` | Open Code of Conduct. |
| `S` | Open AI Threat Sandbox. |
| `Q` | Open Master Certification Exam. |
| `R` | Simulate a threat anomaly. |
| `C` | Open Widget Customizer. |
| `Escape` | Close modals and overlays. |

Shortcuts are ignored while the operator is typing in an input, textarea, select, or content-editable element. `Escape` remains active in those controls: it blurs the active field and closes overlays.

## Theme, Audio, And Vengeance Mode

### Theme

Theme behavior is implemented by [theme-context.tsx](src/context/theme-context.tsx).

Supported modes:

- `dark`
- `light`
- `system`

The application defaults to dark mode. The active mode is applied to the document root through `dark` or `light` classes. System mode follows the browser's `prefers-color-scheme` media query.

The preference key is `breachmirror_theme_preference`.

### Audio

Sound behavior is implemented by [sound-effects.ts](src/services/sound-effects.ts) and coordinated by [alert-context.tsx](src/context/alert-context.tsx).

The Web Audio API and browser speech synthesis are used for:

- Radar blips.
- Target locks.
- Countermeasure effects.
- DEFCON alerts.
- Confession Airlock purge effects.
- Success sounds.
- Quiz sounds.
- Threat alarms.
- Voice alerts.
- Handbook voice briefings.

Audio defaults to enabled. The preference key is `breachmirror_audio_enabled`.

### Vengeance Overdrive

Vengeance state is implemented by [alert-context.tsx](src/context/alert-context.tsx).

- Vengeance mode defaults to off.
- DEFCON defaults to 3.
- Enabling Vengeance sets DEFCON to 1 and plays an alert.
- Disabling Vengeance returns DEFCON to 3.
- Setting DEFCON to 1 automatically enables Vengeance.
- Countermeasure deployment increments the total.
- Vengeance mode adds `vengeance-active` to the document root.
- Scanlines are managed in memory and can be toggled by components that expose the control.
- The initial countermeasure total is 14 when no stored value exists.

## application Architecture

The application is a Vite-powered React single-page application.

```text
Browser
  |
  v
src/main.tsx
  |
  v
ThemeProvider + VengeanceProvider
  |
  v
app.tsx
  |
  +-- login-panel
  |
  +-- Dashboardapp
        |
        +-- navigation-bar
        +-- search-bar
        +-- widget-container
        |     +-- Dashboard widgets
        |
        +-- Tool modals
        |     +-- Handbook
        |     +-- Code of Conduct
        |     +-- Master Exam
        |     +-- Tactical Radar
        |     +-- Confession Airlock
        |     +-- AI Threat Sandbox
        |     +-- Forensic Telemetry
        |     +-- Widget Customizer
        |
        +-- Browser APIs
              +-- localStorage
              +-- Web Audio
              +-- Speech synthesis
              +-- Clipboard
              +-- File download
```

### application Bootstrap

[src/main.tsx](src/main.tsx) creates the React root and renders the application in `StrictMode`. It imports the global stylesheet from [src/index.css](src/index.css).

### Providers

[app.tsx](src/app.tsx) wraps the application in:

- `ThemeProvider`, which owns theme preference and resolved theme.
- `VengeanceProvider`, which owns Vengeance mode, DEFCON, sound, scanlines, and countermeasure totals.

Components access those values through `useTheme()` and `useVengeance()`.

### Dashboard Composition

The main dashboard keeps the following state categories:

- Current tab.
- Widget configuration.
- Modal visibility.
- Selected telemetry event.
- Selected handbook vector.
- Selected radar breach.
- Backend health metadata.
- Search query.
- Threat simulation state.
- Toast messages.

Widget configuration is filtered by visibility, selected category, and search query before rendering. Widgets are rendered through [widget-container.tsx](src/components/common/widget-container.tsx), which provides shared framing and interaction behavior.

### Data Sources

Most content is defined in local TypeScript data modules:

- [src/data/sample-data.ts](src/data/sample-data.ts): dashboard widgets and mock threat events.
- [src/data/handbook-content.ts](src/data/handbook-content.ts): IT Security Policy vectors and content.
- [src/data/conduct-content.ts](src/data/conduct-content.ts): Code of Conduct pillars and scenarios.
- [src/data/certification-questions.ts](src/data/certification-questions.ts): certification questions.
- [src/data/handbook-lab-content.ts](src/data/handbook-lab-content.ts): handbook learning-lab content.

Shared domain shared-types are defined in [src/shared-shared-types.ts](src/shared-shared-types.ts).

## State And Persistence

The following local storage keys are used by the application:

| Key | Stored data | Persistence behavior |
| --- | --- | --- |
| `bm_user_session` | Current operator session | Persists across reloads until logout. |
| `bm_widgets_cfg` | Widget visibility and ordering | Persists applied custom layouts. |
| `breachmirror_theme_preference` | `dark`, `light`, or `system` | Persists the selected theme. |
| `breachmirror_audio_enabled` | Audio enabled flag | Persists audio preference. |
| `breachmirror_vengeance_mode` | Vengeance enabled flag | Persists Vengeance mode. |
| `breachmirror_defcon` | DEFCON level from 1 to 5 | Persists selected DEFCON level. |
| `breachmirror_countermeasures_count` | Countermeasure total | Persists deployed countermeasures. |
| `stewart_sentinel_audit_checks` | Readiness audit checks | Persists handbook readiness progress. |
| `stewart_policy_pledge_signed` | IT policy pledge state | Persists the signed pledge. |
| `stewart_code_conduct_pledge_signed` | Code of Conduct pledge state | Persists the signed pledge. |
| `stewart_master_quiz_answers` | Master Exam answers | Persists selected answers. |

The following are intentionally session-only or component-local in the current implementation:

- New Joiner Checklist progress.
- Workplace Dilemma progress.
- Flashcard mastery and streak state.
- Radar vector neutralization state.
- Handbook per-section quiz answers.
- AI Sandbox results.
- Temporary toast messages.
- Current modal selections.
- Scanline state.

To clear the application's stored state, open the browser developer console and run:

```js
localStorage.clear();
location.reload();
```

This clears all local storage for the current origin, including data belonging to other applications served from the same origin. Use it only in a development profile or after confirming the origin.

## API And Backend Behavior

The Vite development server installs a local authentication plugin with these endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/password-reset/request`
- `POST /auth/password-reset/confirm`

Passwords are hashed with Node's built-in `crypto.pbkdf2` using a unique random salt per user. Session tokens are random, stored only as SHA-256 hashes in server memory, and expire after 30 minutes of inactivity. Reset tokens are random, hashed in memory, and expire after 15 minutes. Registration, login, lockout, reset, password-change, logout, and session-expiry events are recorded in `data/auth-audit.json` without passwords or tokens.

User records are stored outside `src` in `data/auth-users.json`. The directory and both JSON files are created automatically on first use, and the files are ignored by Git. This is a local development implementation: sessions are invalidated when the Vite process restarts, JSON storage is not suitable for concurrent production workloads, and the simulator still contains mock security telemetry.

For production, place the auth service behind an HTTPS reverse proxy or use a production server that terminates HTTPS. Secure cookies are enabled when the request is HTTPS, and the application must use HTTPS, a real persistent datastore, secret management, rate limiting, CSRF protections appropriate to the deployment, monitoring, backups, and a production email/token delivery path before handling real accounts or security data.

The API facade is implemented in [src/services/local-local-api.ts](src/services/local-local-api.ts).

### Health Check

`fetchHealth()` requests `/local-api/health` when the dashboard loads. If the request fails, the app returns virtual health metadata so the UI remains usable:

```text
status: ONLINE
uptime: derived from the current time
 encryption: AES-256-GCM
node: USC-01 KERNEL
geminiConfigured: true
```

The fallback is presentation data; it does not prove that an API, encryption service, or Gemini integration is active.

### Teachable-Moment Analysis

`generateTeachableMomentApi()` waits approximately 600 ms and returns a local rule-based coaching response derived from the selected `ThreatEvent`.

### Custom Action Analysis

`analyzeCustomActionApi()` waits approximately 700 ms and classifies text using keywords such as:

- `key`, `secret`, `token`, or `password`: critical secret exposure.
- `gpt`, `ai`, `chat`, or `prompt`: critical GenAI exfiltration risk.
- `usb`, `drive`, or `plug`: elevated physical device risk.
- Other text: high unsanctioned workflow risk.

This is a deterministic local simulation, not a model inference request.

### Breach Simulation And Acknowledgement

- `simulateBreachApi()` currently returns `null`; the UI uses its own fallback simulation.
- `acknowledgeBreachApi()` currently returns `true` without writing to a backend.

### Backend Requirement

The Vite development server provides local authentication and the authenticated `/api/policy/ask` RAG endpoint. The policy retriever runs on the server. Gemini generation is optional and requires `GEMINI_API_KEY`; without it, policy excerpts are returned directly.

## Project Structure

```text
.
├── index.html                    Vite HTML entry point
├── metadata.json                 Project metadata
├── package.json                  Scripts and dependencies
├── package-lock.json             Locked dependency versions
├── tsconfig.json                 TypeScript compiler configuration
├── vite.config.ts                Vite, React, Tailwind, alias, and HMR config
├── public/                       Static assets served as-is
└── src/
    ├── app.tsx                   application shell and dashboard state
    ├── index.css                 Global styles and Tailwind entry styles
    ├── main.tsx                  React bootstrap
    ├── shared-shared-types.ts                  Shared domain shared-types
    ├── vite-env.d.ts             Vite type declarations
    ├── components/
    │   ├── auth/                 Login and session entry UI
    │   ├── common/               Navbar, modals, loaders, cards, and controls
    │   ├── handbook/             Embedded handbook learning modes
    │   └── widgets/              Dashboard widgets and D3 visualizations
    ├── context/                  Theme and Vengeance providers
    ├── data/                     Local policy, scenario, quiz, and mock data
    ├── services/                 API facade and sound effects
    └── styles/                   Feature-specific CSS files
```

### Important Source Files

| Area | File |
| --- | --- |
| application shell | [src/app.tsx](src/app.tsx) |
| React bootstrap | [src/main.tsx](src/main.tsx) |
| Shared models | [src/shared-shared-types.ts](src/shared-shared-types.ts) |
| Login flow | [src/components/auth/login-panel.tsx](src/components/auth/login-panel.tsx) |
| Navigation | [src/components/common/navigation-bar.tsx](src/components/common/navigation-bar.tsx) |
| Theme state | [src/context/theme-context.tsx](src/context/theme-context.tsx) |
| Vengeance state | [src/context/alert-context.tsx](src/context/alert-context.tsx) |
| API facade | [src/services/local-local-api.ts](src/services/local-local-api.ts) |
| Audio effects | [src/services/sound-effects.ts](src/services/sound-effects.ts) |
| Mock dashboard content | [src/data/sample-data.ts](src/data/sample-data.ts) |
| IT policy content | [src/data/handbook-content.ts](src/data/handbook-content.ts) |
| Code of Conduct content | [src/data/conduct-content.ts](src/data/conduct-content.ts) |
| Certification questions | [src/data/certification-questions.ts](src/data/certification-questions.ts) |

## Configuration

### TypeScript

[tsconfig.json](tsconfig.json) uses:

- ES2022 output targeting.
- ESNext modules.
- Bundler module resolution.
- React JSX runtime.
- DOM and DOM.Iterable libraries.
- Strictly separated module handling through `isolatedModules`.
- `@/*` path alias mapped to the repository root.
- No emitted JavaScript from TypeScript (`noEmit: true`).

### Vite

[vite.config.ts](vite.config.ts) configures:

- `@vitejs/plugin-react` for React transformation.
- `@tailwindcss/vite` for Tailwind integration.
- `@` as a path alias for the repository root.
- Port `3000` through the npm development script.
- Optional HMR and file-watching disablement through `DISABLE_HMR=true`.

To disable HMR and file watching for a development run:

```powershell
$env:DISABLE_HMR = "true"
npm.cmd run dev
```

### Environment Variables

The app can run without environment variables. Set `GEMINI_API_KEY` in a local, uncommitted `.env` file to enable answer drafting for Policy RAG Q&A:

```env
GEMINI_API_KEY=your_key_here
APP_URL=http://localhost:3000
```

The key is read by the Vite server and is not exposed through frontend environment variables. Do not add real secrets to the repository or commit local `.env` files.

## Development Workflow

### Make A UI Change

1. Start the dev server with `npm.cmd run dev` on Windows or `npm run dev` on other shells.
2. Identify the owning component in `src/components/`.
3. Reuse existing context, data shared-types, and shared styles where possible.
4. Keep local state in the component unless the behavior is shared by multiple features.
5. Run `npm.cmd run lint` after the change.
6. Run `npm.cmd run build` before considering a feature complete.

### Add A Dashboard Widget

A typical widget change involves:

1. Add or update a component under `src/components/widgets/`.
2. Add the widget configuration to [src/data/sample-data.ts](src/data/sample-data.ts).
3. Add a render case in `renderWidgetContent()` inside [src/app.tsx](src/app.tsx).
4. Assign the correct widget category: `telemetry`, `playbook`, `analytics`, or `simulator`.
5. Confirm that the widget works in the overview and its category tab.
6. Confirm it can be hidden and restored through the Widget Customizer.

### Add A Modal Tool

1. Create the modal under `src/components/common/`.
2. Add an open-state variable in [src/app.tsx](src/app.tsx).
3. Add the open callback to the navbar or relevant widget.
4. Add the modal to the dashboard render tree.
5. Include it in the shared close handler and, where appropriate, the keyboard shortcut handler.
6. Keep browser-only integrations guarded appropriately when needed.

### Add Persistent State

Before adding a new `localStorage` key:

1. Choose a namespaced key beginning with `bm_`, `breachmirror_`, or the existing feature namespace.
2. Define a safe default for missing or malformed data.
3. Handle browser-only access through `typeof window !== 'undefined'` when initialization can occur outside the browser.
4. Document the key in the Local Storage section of this README.
5. Decide whether logout should clear the value.

## Troubleshooting

### `npm run` Is Blocked In PowerShell

PowerShell may block the `npm.ps1` shim through its execution policy. Use `npm.cmd`:

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Avoid changing the machine-wide execution policy just to run this project.

### The Screen Is Covered In Red TypeScript Errors

Run:

```powershell
npm.cmd run lint
```

If JSX and React imports are reported as untyped, confirm that these development dependencies are installed:

```powershell
npm.cmd install --save-dev @shared-types/react @shared-types/react-dom
```

Many JSX errors can be cascading diagnostics caused by missing React declarations. Fix the first module/type error before editing every red line individually.

### Port 3000 Is Already In Use

Stop the process using the port or start Vite with a different port:

```powershell
npm.cmd exec vite -- --port 3001 --host 0.0.0.0
```

Then open `http://localhost:3001/`.

### Audio Does Not Play

Browsers commonly block audio until the user interacts with the page. Click a control first, confirm the audio toggle is enabled, and check the browser tab's permissions. Speech synthesis behavior also varies by browser and operating system.

### The UI Still Shows Old State

The application intentionally persists several preferences. Clear only the relevant key in the browser console, for example:

```js
localStorage.removeItem('bm_widgets_cfg');
location.reload();
```

To reset everything for this origin:

```js
localStorage.clear();
location.reload();
```

### Health Status Looks Real But No Backend Is Running

The health display intentionally falls back to virtual status when `/local-api/health` is unavailable. The fallback is a UI convenience for this simulator and should not be interpreted as live infrastructure health.

## Safety And Scope

BreachMirror AI is an educational simulator, not a production security monitoring or incident-response system.

- Threat events are mock data.
- Risk scores are heuristic or static.
- AI coaching is local rule-based output.
- Secret scanning is a lightweight demonstration, not a complete secret scanner.
- Remediation commands are examples and may require adaptation.
- Health status can be virtual and does not prove service availability.
- No operator authentication or authorization is implemented.
- No incident acknowledgement is persisted to a backend.
- Do not paste real credentials, customer data, proprietary source code, or personal information into the demo.
- Verify all remediation actions with your organization's security team and approved runbooks before using them in a real environment.

## License And Repository Policy

No license or contribution policy is declared in the current repository. Add the appropriate license and contribution terms before publishing or redistributing the application.
