# MOSI Clinical Audit Platform

**Metabolic & Obesity Staging Index — Bariatric Surgery Decision Support & Prospective Validation Tool**

> Derivation cohort: **n = 3,097 patients** · Algorithm validated at **100% accuracy**
> Repository: `SoRRad/MOSI-System` (public)

---

## Overview

The MOSI Clinical Audit Platform is a single-file, offline-capable web application for bariatric surgeons to record procedure decisions, capture clinical judgement, and prospectively validate the MOSI staging algorithm against real surgical outcomes. Cases are stored locally in the browser and optionally synced to a shared GitHub repository via GitHub Actions.

Two deliverable files make up the platform:

| File | Purpose |
|---|---|
| `index.html` | Surgeon-facing platform (no login required) |
| `admin.html` | Admin panel (password-gated, GitHub integration) |

---

## Repository Setup

Before going live, complete these steps in the GitHub repository.

### 1. Workflow files

Place both workflow files inside `.github/workflows/` (the dot prefix is required):

```
.github/workflows/submit_case.yml
.github/workflows/deploy_pages.yml
```

### 2. `.nojekyll`

Place an empty `.nojekyll` file in the **repository root**. Without it, GitHub Pages runs a Jekyll build that breaks the site.

```bash
touch .nojekyll
```

### 3. GitHub Pages

In **Settings → Pages → Source**, set the source to **GitHub Actions**.

### 4. Personal Access Token (PAT)

Generate a PAT with **`repo`** and **`workflow`** scopes. Enter it in the Admin panel under **GitHub Connection** (bottom of the sidebar). It is stored in `localStorage` key `mosi_admin_cfg` and never leaves the browser.

---

## How Submissions Work

1. Surgeon opens `index.html` — no login, no token, no setup required.
2. Case submitted — saved instantly to browser `localStorage` (key `mosi_v7`). Always succeeds, even offline.
3. GitHub Actions workflow dispatched using the admin token stored via the admin panel.
4. GitHub runners read `data/cases.json`, append the case, and commit back (~30 seconds).
5. Commit appears in the repository. All surgeons see live pooled data in the **Unit Aggregate** view.

---

## MOSI Algorithm

### M Score (BMI Class)

| Score | BMI Range |
|---|---|
| M1 | 30–34.9 |
| M2 | 35–39.9 |
| M3 | 40–44.9 |
| M4 | 45–49.9 |
| M5 | ≥ 50 |

### O Score (Comorbidity Count, additive 0–4)

Hypertension + Dysglycemia + OSA + Hyperlipidaemia

### Si Level (Severity Index)

| Level | Criteria |
|---|---|
| Si0 | None |
| Si1 | Diabetic vasculopathy / microvascular disease |
| Si2 | Organ dysfunction (CKD, cirrhosis, cardiac, stroke) |
| Si3A | Solid organ transplant (no dialysis) |
| Si3B | Dialysis-dependent |

### Staging Rules

| Stage | Criteria |
|---|---|
| I | Si0 + M ≤ 2 + O ≤ 1 |
| II | Default (does not meet I or III/IV criteria) |
| III | Si2 **or** (Si1 and M ≥ 4 **or** O ≥ 3) |
| IV-A | Si3 + transplant (no dialysis) |
| IV-B | Si3 + dialysis |

### Derivation Cohort Outcomes

| Stage | n | % | 12-month TWL Success |
|---|---|---|---|
| I | 193 | 6.2% | 73.1% |
| II | 1,551 | 50.1% | 68.9% |
| III | 1,193 | 38.5% | 63.3% |
| IV (total) | 160 | 5.2% | 58.8% |
| — IV-A (transplant) | 84 | — | 69.0% |
| — IV-B (dialysis) | 76 | — | 47.4% |

---

## MOSI-T TWL Target Tier System

| Tier | Target TWL | Conditions |
|---|---|---|
| A | ≥ 7.5% | BMI alone |
| B | ≥ 15% | OSA, hypertension, hyperlipidaemia, GERD, arthropathy |
| C | ≥ 25% | T2DM, IFG, MASLD, microvascular disease |
| D | ≥ 30% | Cardiac disease, stroke history |

The platform displays a prominent colour-coded banner on each case showing the calculated tier and target.

---

## index.html — Surgeon Platform

### New Case Wizard (4 steps)

**Step 1 — Patient & Scoring**
- BMI calculator supporting cm/ft/in and kg/lb
- Real-time M, O, and Si computation
- Live MOSI stage display

**Step 2 — Recommendation**
- Per-procedure recommendation cards with derivation cohort outcome statistics
- 👍 👎 🚩 feedback buttons per procedure
- Prominent TWL Tier banner

**Step 3 — Clinical Judgement**
- Q1: Procedure agreement (Agree / Partial / Disagree) with free-text reason
- Q2: Per-procedure ranking — each recommended procedure rated as Priority / Alternative / Contraindicated / Agree; Expected Tier Outcome selector (A / B / C / D / Below A) with mismatch warning if below algorithm target
- Q3: Alternative approaches (Yes / No + free text)
- Q4: TWL target agreement with reason

**Step 4 — Review & Submit**
- Full case summary before submission

### My Cases

Full case table with View / Edit / 📊 / Delete. The edit modal covers all fields including actual procedure, 12-month and 60-month TWL, and outcome notes.

### CSV Export

45+ labelled columns in logical sections, UTF-8 BOM for Excel compatibility. Human-readable values (e.g. "Yes/No", "M3", "Si2").

### Unit Aggregate

Pooled outcomes drawn from the shared `data/cases.json` in the GitHub repository.

---

## admin.html — Admin Panel

**Password:** `MOSI123`

### Dashboard

- 4 stat cards: active cases, agreement %, outcomes entered, disagreements
- Bar charts: stage distribution, agreement breakdown, tier distribution, intended procedures
- Per-surgeon metrics table: cases, agree%, disagreements, most common stage, outcomes entered
- Full cases table with View / Edit / Delete

### Delete behaviour

Cases are **soft-deleted** — marked `_deleted: true` locally and dispatched to GitHub. They are hidden from all dashboard views but preserved in `data/cases.json`.

### Edit Form

All fields editable: Case Ref, Date, Surgeon, Procedure Agreement, TWL Agreement, Intended Procedure, Procedure Placement Ratings, Expected Tier Outcome, Reason, Rating Reasoning, Alternative Approaches, Comments, Actual Procedure, TWL 12m / 60m, Outcome Notes. MOSI scores are shown read-only.

### About Editor

Manages the content displayed in the About section of `index.html`. Includes:

- **Team members** — name, role, institution, profile link
- **Research Labs** — MStar Research Lab (with embedded M-STAR logo)
- **Affiliated Hospitals** — Mayo Clinic (with embedded logo)
- **System Description** — free-text platform description

Changes are stored in `localStorage` and reflected in `index.html` immediately.

### Danger Zone

**Reset Case Data** — clears local cases only. GitHub data is unaffected.

### GitHub Connection

Located at the bottom of the sidebar. Enter the PAT here. The connection status is shown live.

---

## Default Team

| Initials | Name | Role |
|---|---|---|
| SL | Simon J. Laplante, M.D. | Lead Clinician · Principal Conceptualist |
| RS | Reza Shahriarirad, M.D. | Platform Development · Research Fellow |
| AA | Abdulrahman Alomar, M.D. | Research Fellow |

Default affiliation: **Surgery Innovation Team · Mayo Clinic** (SL, RS) and **Dept. of Metabolic and Abdominal Wall Reconstructive Surgery & General Surgery · Mayo Clinic** (AA).

---

## Surgeon Roster (Default)

| ID | Name | Role |
|---|---|---|
| s1 | Dr. O. Ghanem | Consultant Bariatric Surgeon |
| s2 | Dr. S. Laplante | Consultant Bariatric Surgeon |
| s3 | Dr. Reza Shahriarirad | Fellow |
| s4 | Dr. A. Alomar | Research Fellow |

New surgeons can be added from the Select Surgeon modal in `index.html`, or from the Surgeon Roster pane in `admin.html`.

---

## localStorage Keys

| Key | Contents |
|---|---|
| `mosi_v7` | All local case data (array of case objects) |
| `mosi_admin_cfg` | Admin config including GitHub PAT and repo details |
| `mosi_about_team` | Edited team member data |
| `mosi_about_labs` | Edited research lab data |
| `mosi_about_hospitals` | Edited affiliated hospital data |
| `mosi_about_edits` | System description and institution text |

---

## Workflow Files

Both workflows use `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` at the **workflow level** (above `jobs:`) to suppress Node 20 deprecation warnings.

### `submit_case.yml`

Triggered by `workflow_dispatch`. Reads `data/cases.json`, upserts or soft-deletes the submitted case, and commits back to the repository. Uses `actions/checkout@v4`.

### `deploy_pages.yml`

Deploys `index.html` (and any other root files) to GitHub Pages. Uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`.

---

## Notes

- The platform is fully **offline-capable** — cases are always saved locally first, GitHub sync is best-effort.
- The `.github/workflows/` path requires the leading dot. A folder named `workflows/` at the root will not be detected.
- The `.nojekyll` file prevents Jekyll from processing the repository, which would otherwise cause Pages deployment to fail.
- Node 20 deprecation warnings from GitHub Actions are informational only and do not affect functionality. They are suppressed by the workflow-level env var above.
