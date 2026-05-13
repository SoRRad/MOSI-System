# MOSI System

MOSI System is a single-page, calculator-only static research decision-support platform for the Mayo Obesity Staging Index. The active platform is `index.html`; it calculates MOSI-S severity stage, MOSI-T therapeutic target tier, and MOSI-D procedure-specific probability estimates for sleeve gastrectomy (SG) and Roux-en-Y gastric bypass (RYGB).

The platform does not collect, save, sync, or submit patient-level data. It asks only for BMI and yes/no clinical features needed for the calculation. It has no database behavior and can be opened directly in a browser.

## Research Use

MOSI is a bariatric surgery staging and research decision-support framework. This repository is not a medical device and is not a substitute for clinical judgment or local multidisciplinary review.

MOSI-D values are retrospective research estimates. They may support discussion, but they do not determine treatment.

## Run Locally

Open `index.html` directly in a browser. No build step, server, credentials, or external data source is required.

## Deploy On GitHub Pages

The repository includes `.github/workflows/deploy_pages.yml`, which publishes the static site to GitHub Pages using GitHub Actions. In the repository settings, configure Pages to use GitHub Actions as the source. The `.nojekyll` file is included so Pages serves the static files without Jekyll processing.

## MOSI-S Severity Stage

MOSI-S combines M score, O score, and Si level.

| Component | Definition |
|---|---|
| M1 | BMI 30.0-34.9 |
| M2 | BMI 35.0-39.9 |
| M3 | BMI 40.0-44.9 |
| M4 | BMI 45.0-49.9 |
| M5 | BMI >=50.0 |
| O score | 1 point each for hypertension, dysglycemia, obstructive sleep apnea, and hyperlipidemia |
| Si0 | No end-organ involvement |
| Si1 | Diabetic microvascular/end-organ disease |
| Si2 | Major organ dysfunction including CKD without dialysis, cirrhosis, cardiac history/MACE-risk history, or prior stroke/TIA |
| Si3 | Dialysis-dependent renal failure or solid-organ transplant recipient status |

GERD is not part of O score.

Stage assignment:

| Stage | Rule |
|---|---|
| Stage IV | Si3 |
| Stage IV-A | Transplant recipient not on dialysis, descriptive subgroup |
| Stage IV-B | Dialysis-dependent, with or without transplant, descriptive subgroup |
| Stage III | Si2, or Si1 with M >=4 or O >=3 |
| Stage I | Si0 with M <=2 and O <=1 |
| Stage II | All remaining combinations |

## MOSI-T Therapeutic Target

MOSI-T uses highest-tier-wins logic.

| Tier | Target | Qualifying features |
|---|---|---|
| A | >=7.5% TWL | No qualifying metabolic or organ comorbidity |
| B | >=15% TWL | OSA, hypertension, hyperlipidemia, GERD, arthropathy, or prior arthroplasty |
| C | >=25% TWL | Type 2 diabetes, impaired fasting glucose, or diabetic microvascular/end-organ disease |
| D | >=30% TWL | Cardiac history, stroke/TIA, Si2, or Si3 systemic disease |

## MOSI-D Decision-Support Estimates

MOSI-D displays procedure-specific probability estimates for SG and RYGB at 12 and 60 months across TWL thresholds of >=5%, >=10%, >=20%, >=25%, >=30%, and >=35%.

The static lookup uses the final available v5.1 probability values. Exact 60-month values for >=5%, >=10%, and >=25% TWL are not available in the current model output, so those cells display `N/A`. No values are interpolated.

## Final Manuscript-Aligned Findings

| Measure | Result |
|---|---|
| Staged cohort | n = 3,192 |
| Primary 12-month analytic cohort | n = 2,939 |
| Primary endpoint | TWL >=20% at 12 months |
| Stage distribution | Stage I: 191; Stage II: 1,542; Stage III: 1,297; Stage IV: 162; Stage IV-A: 86; Stage IV-B: 76 |
| 12-month TWL >=20% success by stage | Stage I: 91.6%; Stage II: 87.4%; Stage III: 80.3%; Stage IV: 58.5% |
| AUC | MOSI + Procedure: 0.761; MOSI + Procedure + Age + Sex: 0.789 |
| DeLong | MOSI+Procedure vs BMI+Procedure p = 0.049; MOSI+Procedure vs EOSS-proxy+Procedure p = 0.49 |
| MOSI-T distribution | Tier A: 248; Tier B: 654; Tier C: 1,549; Tier D: 488 |

## Repository Structure

| Path | Purpose |
|---|---|
| `index.html` | Static one-page MOSI calculator |
| `src/mosi-core.js` | Shared MOSI-S, MOSI-T, and MOSI-D calculation logic |
| `docs/MOSI_algorithm_spec.md` | Algorithm and research-results specification |
| `tests/mosi_examples.js` | Example checks using the same shared logic as the app |
| `.github/workflows/deploy_pages.yml` | GitHub Pages deployment workflow |
| `.nojekyll` | Prevents Jekyll processing on GitHub Pages |

## Disclaimer

This software is for research decision-support only. It is not a substitute for clinical decision-making.
