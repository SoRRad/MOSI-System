# MOSI Algorithm Specification

This document defines the calculator-only MOSI implementation used by the static platform.

## MOSI-S Severity Stage

MOSI-S is the severity staging system.

### M Score

| Score | BMI range |
|---|---|
| M1 | 30.0-34.9 |
| M2 | 35.0-39.9 |
| M3 | 40.0-44.9 |
| M4 | 45.0-49.9 |
| M5 | ≥50.0 |

### O Score

Add one point each for:

- Hypertension
- Dysglycemia, defined as type 2 diabetes or impaired fasting glucose
- Obstructive sleep apnea
- Hyperlipidemia

O ranges from 0 to 4. GERD is not part of O score.

### Si Level

| Level | Criteria |
|---|---|
| Si0 | No end-organ involvement |
| Si1 | Diabetic microvascular/end-organ disease, including retinopathy, peripheral neuropathy, nephropathy, or diabetic vasculopathy |
| Si2 | Major organ dysfunction, including CKD without dialysis, cirrhosis, cardiac history/MACE-risk history, or prior stroke/TIA |
| Si3 | Organ failure, defined as dialysis-dependent renal failure or solid-organ transplant recipient status |

Dialysis overrides CKD and transplant for subgroup display.

### Stage Assignment

| Stage | Rule |
|---|---|
| Stage IV | Si3 |
| Stage IV-A | Transplant recipient not on dialysis; descriptive subgroup only |
| Stage IV-B | Dialysis-dependent, with or without transplant; descriptive subgroup only |
| Stage III | Si2, or Si1 with M ≥4 or O ≥3 |
| Stage I | Si0 and M ≤2 and O ≤1 |
| Stage II | All remaining combinations |

## MOSI-T Therapeutic Target

MOSI-T is the therapeutic weight-loss target framework. Highest tier wins.

| Tier | Target | Criteria |
|---|---|---|
| A | ≥7.5% TWL | No qualifying metabolic/organ comorbidity |
| B | ≥15% TWL | OSA, hypertension, hyperlipidemia, GERD, arthropathy, or prior arthroplasty |
| C | ≥25% TWL | Type 2 diabetes, impaired fasting glucose, or diabetic microvascular/end-organ disease |
| D | ≥30% TWL | Cardiac history, stroke/TIA, Si2, or Si3 systemic disease |

## MOSI-D Decision-Support Display

MOSI-D displays decision-support estimates for:

- Sleeve gastrectomy (SG)
- Roux-en-Y gastric bypass (RYGB)
- BPD-DS/SADI-S, exploratory and only where exact values are available

The active UI title is "Bariatric procedure outcome estimates." The active display includes 12-month and 60-month estimates for:

- ≥5% TWL
- ≥10% TWL
- ≥20% TWL
- ≥25% TWL
- ≥30% TWL
- ≥35% TWL

The static lookup uses final available v5.1 probability values. Missing estimates remain `N/A` and are labeled as not available from current model output. No values are interpolated. BPD-DS/SADI-S values are exploratory and limited by smaller subgroup size and likely procedure-selection bias.

### v5.1 12-Month Probabilities

| Stage | Procedure | ≥5% | ≥10% | ≥20% | ≥25% | ≥30% | ≥35% |
|---|---|---:|---:|---:|---:|---:|---:|
| Stage I | SG | 98.0% | 96.0% | 82.0% | 60.0% | 26.0% | 10.0% |
| Stage I | RYGB | 100.0% | 100.0% | 95.5% | 81.8% | 64.4% | 34.8% |
| Stage I | BPD-DS/SADI-S | N/A | N/A | N/A | N/A | N/A | N/A |
| Stage II | SG | 98.6% | 95.9% | 68.3% | 51.2% | 29.5% | 14.6% |
| Stage II | RYGB | 99.7% | 99.5% | 93.2% | 82.5% | 61.7% | 38.5% |
| Stage II | BPD-DS/SADI-S | N/A | N/A | 97.0% | N/A | N/A | N/A |
| Stage III | SG | 95.7% | 86.2% | 52.5% | 30.5% | 16.3% | 7.8% |
| Stage III | RYGB | 99.7% | 99.2% | 88.9% | 70.8% | 47.9% | 24.5% |
| Stage III | BPD-DS/SADI-S | N/A | N/A | 94.9% | N/A | N/A | N/A |
| Stage IV | SG | 99.3% | 90.3% | 54.9% | 40.3% | 22.2% | 9.7% |
| Stage IV | RYGB | 100.0% | 100.0% | 92.9% | 78.6% | 57.1% | 50.0% |
| Stage IV | BPD-DS/SADI-S | N/A | N/A | 100.0% | N/A | N/A | N/A |

The Stage IV BPD-DS/SADI-S value is exploratory with small-n caution. Stage IV-A/IV-B use pooled Stage IV procedure estimates in the active display; Stage IV subgroups may differ clinically, and subgroup-specific estimates are descriptive and limited by sample size.

### v5.1 60-Month Probabilities

Exact 60-month values for ≥5%, ≥10%, and ≥25% TWL are unavailable in the current model output and display as `N/A`.

| Stage | Procedure | ≥20% | ≥30% | ≥35% |
|---|---|---:|---:|---:|
| Stage I | SG | 59.3% | 22.2% | 7.4% |
| Stage I | RYGB | 73.7% | 25.0% | 11.8% |
| Stage II | SG | 40.5% | 16.7% | 11.9% |
| Stage II | RYGB | 67.4% | 31.7% | 19.1% |
| Stage III | SG | 36.7% | 13.3% | 7.5% |
| Stage III | RYGB | 62.5% | 27.7% | 16.6% |
| Stage IV | SG | 41.2% | 17.6% | 14.7% |
| Stage IV | RYGB | 91.7% | 58.3% | 25.0% |

No exact BPD-DS/SADI-S 60-month values are included in the active lookup; those cells display `N/A`.

## Final Research Results

| Measure | Result |
|---|---|
| Staged cohort | n = 3,192 |
| Primary 12-month analytic cohort | n = 2,939 |
| Primary endpoint | TWL ≥20% at 12 months |
| Stage distribution | Stage I: 191; Stage II: 1,542; Stage III: 1,297; Stage IV: 162; Stage IV-A: 86; Stage IV-B: 76 |
| 12-month TWL ≥20% success by stage | Stage I: 91.6%; Stage II: 87.4%; Stage III: 80.3%; Stage IV: 58.5% |
| AUC | MOSI + Procedure: 0.761; MOSI + Procedure + Age + Sex: 0.789 |
| DeLong | MOSI+Procedure vs BMI+Procedure p = 0.049; MOSI+Procedure vs EOSS-proxy+Procedure p = 0.49 |
| MOSI-T distribution | Tier A: 248; Tier B: 654; Tier C: 1,549; Tier D: 488 |

## Limitations

- Retrospective single-center derivation.
- Observational procedure comparisons.
- Procedure-selection bias.
- Smaller BPD-DS/SADI-S and Stage IV subgroups.
- 60-month attrition.
- Decision-support only; not a substitute for clinical decision-making.
