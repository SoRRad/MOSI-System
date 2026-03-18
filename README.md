# MOSI Clinical Audit Platform

**Metabolic & Obesity Staging Index — Clinical Decision Support and Internal Validation System**

[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-blue)](https://yourusername.github.io/mosi-system/)
[![Status](https://img.shields.io/badge/Status-Pre--publication%20Internal%20Validation-orange)]()
[![Cohort](https://img.shields.io/badge/Derivation%20Cohort-n%20%3D%203%2C097-green)]()

---

## What This Is

This repository contains the MOSI Clinical Audit Platform — a self-contained, browser-based clinical decision support and prospective internal validation tool for the **Metabolic and Obesity Staging Index (MOSI)**.

MOSI is a three-dimensional bariatric surgery staging system that stratifies patients by:

- **M score** — BMI class (M1–M5, BMI 30–≥50 kg/m²)
- **O score** — metabolic comorbidity burden (HTN + dysglycaemia + OSA + HLD, scored 0–4)
- **Si level** — systemic impairment level (Si0 = none → Si3 = organ failure)

The algorithm assigns patients to **Stage I, II, III, 4A, or 4B**, with corresponding TWL Target Tiers (A–D) and evidence-based procedure recommendations derived from a validated derivation cohort of **n = 3,097 patients**.

---

## Purpose of This Tool

This platform serves two simultaneous functions:

| Function | Description |
|---|---|
| **Clinical decision support** | Real-time MOSI scoring and procedure recommendation at point of care |
| **Internal validation** | Prospective capture of surgeon agreement/disagreement with algorithm outputs |

Every case entered generates a structured audit record. Aggregate agreement rates, per-stage disagreement patterns, and surgeon comments constitute the **internal validation dataset** that will precede external multi-centre validation.

---

## Live Demo

👉 **[Open the Platform](https://yourusername.github.io/mosi-system/)**

> Replace `yourusername` with your GitHub username once deployed.

---

## How to Use

### For Surgeons

1. Open the platform link in any modern browser (Chrome, Firefox, Safari, Edge)
2. Click your name in the top-right corner to select or create your surgeon profile
3. Use **New Case** to enter a pre-operative patient:
   - Enter BMI → M score computes automatically
   - Tick comorbidities → O score computes automatically
   - Select Si level → MOSI stage assigns instantly
4. Review the **Recommendation** screen — procedure guidance, outcome rates, and clinical alerts
5. On the **Feedback** screen, record your clinical judgement:
   - Agreement with computed MOSI stage (Agree / Partially / Disagree)
   - Agreement with procedure recommendation (Agree / Partially / Disagree)
   - Your intended procedure
   - Any reasons for deviation or clinical concerns
6. Submit the case

### For the Research Team

- **My Cases** — individual case log with detail view
- **My Dashboard** — personal agreement rates and pattern charts
- **Unit Aggregate** — pooled data across all surgeons (this is the validation dataset)
- **Export CSV** — download all cases as a structured CSV for R analysis

---

## Data Storage

> **Important: understanding where your data lives**

This is a **client-side application** — there is no server, no cloud database, and no external data transmission of any kind.

### Where data is stored

All case data is stored in your **browser's `localStorage`** — a private, sandboxed storage area built into every modern browser. Data never leaves your device unless you explicitly export it.

```
Browser localStorage key: "mosi_platform_v2"
Storage format: JSON
Location: Local to the browser and device being used
Capacity: ~5MB (supports thousands of cases)
Persistence: Survives browser close/restart; cleared only if browser data is cleared
```

### Implications for multi-surgeon use

Because localStorage is **per browser, per device**, each surgeon's data exists only on their own machine. There is no automatic sync between devices.

**Recommended workflow for data pooling:**

```
Surgeon A  →  Export CSV  ─┐
Surgeon B  →  Export CSV  ─┼─→  Researcher merges in R  →  Analysis
Surgeon C  →  Export CSV  ─┘
```

Each surgeon exports their CSV (Data → Export CSV) and sends it to the research coordinator. The coordinator merges with:

```r
library(tidyverse)

files <- list.files("data/", pattern = "*.csv", full.names = TRUE)
all_cases <- map_dfr(files, read_csv)

# Agreement rates by stage
all_cases %>%
  group_by(stage) %>%
  summarise(
    n = n(),
    stage_agree_pct = mean(stageAgreement == "Agree") * 100,
    proc_agree_pct  = mean(procAgreement  == "Agree") * 100
  )
```

### CSV export schema

| Column | Description |
|---|---|
| `id` | Unique case identifier (timestamp-based) |
| `caseRef` | Anonymised patient reference (surgeon-assigned) |
| `date` | Date of entry |
| `surgeonId` | Internal surgeon ID |
| `surgeonName` | Surgeon full name |
| `bmi` | Pre-operative BMI (kg/m²) |
| `M` | M score (1–5) |
| `O` | O score (0–4) |
| `Si` | Si level (0, 1, 2, 3a, 3b) |
| `stage` | MOSI stage (Stage I / II / III / 4A / 4B) |
| `tier` | TWL Target Tier (Tier A / B / C / D) |
| `tierTarget` | Minimum TWL target (%) |
| `recommended` | Algorithm's procedure recommendation |
| `stageAgreement` | Surgeon response: Agree / Partial / Disagree |
| `procAgreement` | Surgeon response: Agree / Partial / Disagree |
| `intendedProc` | Procedure surgeon intends to perform |
| `reason` | Free text: reason for deviation (if any) |
| `comments` | Free text: concerns, observations, clinical nuances |

---

## MOSI Algorithm Summary

### Scoring

| Dimension | Variable | Levels |
|---|---|---|
| **M** | BMI class | M1 (30–34.9) → M5 (≥50) |
| **O** | Comorbidity count | 0–4 (HTN + dysglycaemia + OSA + HLD) |
| **Si** | Systemic impairment | Si0 (none) → Si3 (organ failure) |

### Staging Rules (applied in order)

1. **Stage 4A** — Si=3, transplant recipient, NOT on dialysis
2. **Stage 4B** — Si=3, active dialysis
3. **Stage III** — Si=2 (any) OR Si=1 AND (M ≥ 4 OR O ≥ 3)
4. **Stage I** — Si=0 AND M ≤ 2 AND O ≤ 1
5. **Stage II** — all remaining combinations

*Algorithm validated at 100% accuracy on derivation cohort (n = 3,097).*

### TWL Target Tiers

| Tier | Min. TWL Target | Triggering Conditions |
|---|---|---|
| A | ≥ 7.5% | BMI indication only — no metabolic comorbidities |
| B | ≥ 15% | OSA, HTN, HLD, GORD, arthropathy |
| C | ≥ 25% | T2DM/IFG, MASLD/cirrhosis, microvascular damage |
| D | ≥ 30% | Cardiac history (MACE risk), stroke/TIA |

### Procedure Success Rates (derivation cohort)

| Stage | Procedure | TWL ≥20% at 12m | TWL ≥20% at 60m* |
|---|---|---|---|
| I | RYGB | 79.3% (CI 71.8–85.2%) | 73.7% |
| I | SG | 54.7% (CI 41.5–67.3%) | 59.3% |
| II | RYGB | 74.6% (CI 71.9–77.1%) | 67.4% |
| II | SG | 50.0% (CI 45.1–54.9%) | 40.5% |
| II | BPD/DS | 88.9% (CI 78.8–94.5%) | 87.2% |
| III | RYGB | 68.8% (CI 65.5–71.9%) | 62.5% |
| III | SG | 40.7% (CI 35.2–46.4%) ⚠ | 36.7% |
| III | BPD/DS | 89.6% (CI 80.0–94.8%) | 87.8% |
| 4A | SG | 65.3% (CI 53.8–75.2%) | — |
| 4B | SG | 43.8% (CI 33.0–55.2%) | — |

*60m rates are observed and pessimistically biased (MNAR dropout confirmed). Procedure ranking BPD/DS > RYGB > SG is stable under all sensitivity bounds.*

---

## Files in This Repository

```
mosi-system/
├── index.html          ← The complete platform (single self-contained file)
└── README.md           ← This file
```

The entire application — MOSI algorithm, decision engine, feedback forms, dashboards, CSV export — is contained within `index.html`. No dependencies, no build step, no server required.

---

## Clinical Validation Status

| Step | Status |
|---|---|
| Algorithm development | ✅ Complete |
| Derivation cohort validation (n=3,097) | ✅ 100% accuracy |
| TWL Target Tier system (MOSI-T) | ✅ Complete |
| Stage IV redesign (4A/4B split) | ✅ Complete |
| MNAR sensitivity analysis (60m data) | ✅ Complete |
| Manuscript (Methods + Results) | ✅ Complete |
| **Internal validation (this tool)** | 🔄 In progress |
| External multi-centre validation | ⬜ Planned |

---

## Privacy and Data Security

- No patient identifiable information should be entered. Use anonymised case references only (e.g. PT-2024-001).
- All data is stored locally in your browser. Nothing is transmitted to any external server.
- Exported CSVs should be handled in accordance with your institution's research data governance policy.
- This tool is intended for clinical research audit purposes. It does not constitute a regulated medical device.

---

## Citation

> *Manuscript in preparation. Full citation will be added upon publication.*

---

## Contact

For questions about the MOSI system, algorithm, or this platform, contact the research team via your institutional channels.

---

*MOSI Clinical Audit Platform · March 2026 · Pre-publication internal validation phase*
