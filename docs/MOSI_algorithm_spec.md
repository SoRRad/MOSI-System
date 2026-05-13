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
| M5 | >=50.0 |

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
| Stage III | Si2, or Si1 with M >=4 or O >=3 |
| Stage I | Si0 and M <=2 and O <=1 |
| Stage II | All remaining combinations |

## MOSI-T Therapeutic Target

MOSI-T is the therapeutic weight-loss target framework. Highest tier wins.

| Tier | Target | Criteria |
|---|---|---|
| A | >=7.5% TWL | No qualifying metabolic/organ comorbidity |
| B | >=15% TWL | OSA, hypertension, hyperlipidemia, GERD, arthropathy, or prior arthroplasty |
| C | >=25% TWL | Type 2 diabetes, impaired fasting glucose, or diabetic microvascular/end-organ disease |
| D | >=30% TWL | Cardiac history, stroke/TIA, Si2, or Si3 systemic disease |

## MOSI-D Decision-Support Display

MOSI-D displays decision-support estimates for:

- Sleeve gastrectomy (SG)
- Roux-en-Y gastric bypass (RYGB)

The active display includes 12-month and 60-month estimates for:

- >=5% TWL
- >=10% TWL
- >=20% TWL
- >=25% TWL
- >=30% TWL
- >=35% TWL

Only documented static values from the current repository history are displayed. Missing estimates remain `N/A` and are labeled as not available from current model output. MOSI-D output is a procedure-specific probability display that may support discussion and requires bariatric surgeon judgment.

## Final Research Results

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

## Limitations

- Retrospective single-center derivation.
- Observational procedure comparisons.
- Procedure-selection bias.
- Smaller BPD-DS/SADI-S and Stage IV subgroups.
- 60-month attrition.
- Decision-support only; not a substitute for clinical decision-making.
