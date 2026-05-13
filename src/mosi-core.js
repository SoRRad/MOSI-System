(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MOSICore = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var THRESHOLDS = [5, 10, 20, 25, 30, 35];
  var TIER_TARGETS = { A: 7.5, B: 15, C: 25, D: 30 };

  var MOSID_PROBABILITIES = {
    "Stage I": {
      SG: {
        5: { month12: 98.0, month60: null },
        10: { month12: 96.0, month60: null },
        20: { month12: 82.0, month60: 59.3 },
        25: { month12: 60.0, month60: null },
        30: { month12: 26.0, month60: 22.2 },
        35: { month12: 10.0, month60: 7.4 }
      },
      RYGB: {
        5: { month12: 100.0, month60: null },
        10: { month12: 100.0, month60: null },
        20: { month12: 95.5, month60: 73.7 },
        25: { month12: 81.8, month60: null },
        30: { month12: 64.4, month60: 25.0 },
        35: { month12: 34.8, month60: 11.8 }
      }
    },
    "Stage II": {
      SG: {
        5: { month12: 98.6, month60: null },
        10: { month12: 95.9, month60: null },
        20: { month12: 68.3, month60: 40.5 },
        25: { month12: 51.2, month60: null },
        30: { month12: 29.5, month60: 16.7 },
        35: { month12: 14.6, month60: 11.9 }
      },
      RYGB: {
        5: { month12: 99.7, month60: null },
        10: { month12: 99.5, month60: null },
        20: { month12: 93.2, month60: 67.4 },
        25: { month12: 82.5, month60: null },
        30: { month12: 61.7, month60: 31.7 },
        35: { month12: 38.5, month60: 19.1 }
      }
    },
    "Stage III": {
      SG: {
        5: { month12: 95.7, month60: null },
        10: { month12: 86.2, month60: null },
        20: { month12: 52.5, month60: 36.7 },
        25: { month12: 30.5, month60: null },
        30: { month12: 16.3, month60: 13.3 },
        35: { month12: 7.8, month60: 7.5 }
      },
      RYGB: {
        5: { month12: 99.7, month60: null },
        10: { month12: 99.2, month60: null },
        20: { month12: 88.9, month60: 62.5 },
        25: { month12: 70.8, month60: null },
        30: { month12: 47.9, month60: 27.7 },
        35: { month12: 24.5, month60: 16.6 }
      }
    },
    "Stage IV": {
      SG: {
        5: { month12: 99.3, month60: null },
        10: { month12: 90.3, month60: null },
        20: { month12: 54.9, month60: 41.2 },
        25: { month12: 40.3, month60: null },
        30: { month12: 22.2, month60: 17.6 },
        35: { month12: 9.7, month60: 14.7 }
      },
      RYGB: {
        5: { month12: 100.0, month60: null },
        10: { month12: 100.0, month60: null },
        20: { month12: 92.9, month60: 91.7 },
        25: { month12: 78.6, month60: null },
        30: { month12: 57.1, month60: 58.3 },
        35: { month12: 50.0, month60: 25.0 }
      }
    }
  };

  var PROCEDURES = [
    { key: "SG", name: "Sleeve gastrectomy", shortName: "SG" },
    { key: "RYGB", name: "Roux-en-Y gastric bypass", shortName: "RYGB" }
  ];

  function asNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return NaN;
  }

  function yes(value) {
    return value === true;
  }

  function calculateMScore(bmi) {
    var parsed = asNumber(bmi);
    if (!Number.isFinite(parsed)) {
      return { complete: false, reason: "BMI is missing." };
    }
    if (parsed < 30) {
      return { complete: false, warning: "MOSI is intended for patients with obesity and bariatric surgery candidates." };
    }
    if (parsed < 35) return { score: 1, label: "M1", bmi: parsed, range: "30.0-34.9" };
    if (parsed < 40) return { score: 2, label: "M2", bmi: parsed, range: "35.0-39.9" };
    if (parsed < 45) return { score: 3, label: "M3", bmi: parsed, range: "40.0-44.9" };
    if (parsed < 50) return { score: 4, label: "M4", bmi: parsed, range: "45.0-49.9" };
    return { score: 5, label: "M5", bmi: parsed, range: "≥50.0" };
  }

  function calculateOScore(input) {
    input = input || {};
    var dysglycemia = yes(input.type2Diabetes) || yes(input.impairedFastingGlucose);
    var components = [];
    if (yes(input.hypertension)) components.push("Hypertension");
    if (dysglycemia) components.push("Dysglycemia");
    if (yes(input.sleepApnea)) components.push("Obstructive sleep apnea");
    if (yes(input.hyperlipidemia)) components.push("Hyperlipidemia");
    return {
      score: components.length,
      label: "O" + components.length,
      dysglycemia: dysglycemia,
      components: components
    };
  }

  function hasMicrovascular(input) {
    input = input || {};
    return yes(input.retinopathy) || yes(input.neuropathy) || yes(input.nephropathy) || yes(input.diabeticVasculopathy);
  }

  function calculateSiLevel(input) {
    input = input || {};
    if (yes(input.dialysis)) {
      return {
        rank: 3,
        label: "Si3",
        subtype: "Stage IV-B",
        reason: "dialysis-dependent renal failure",
        components: ["Dialysis"]
      };
    }
    if (yes(input.transplant)) {
      return {
        rank: 3,
        label: "Si3",
        subtype: "Stage IV-A",
        reason: "solid organ transplant recipient status without dialysis",
        components: ["Solid organ transplant"]
      };
    }

    var si2 = [];
    if (yes(input.ckd)) si2.push("CKD without dialysis");
    if (yes(input.cirrhosis)) si2.push("Cirrhosis");
    if (yes(input.cardiac)) si2.push("Cardiac history / MACE-risk history");
    if (yes(input.stroke)) si2.push("Stroke/TIA");
    if (si2.length) {
      return {
        rank: 2,
        label: "Si2",
        subtype: "",
        reason: "major organ dysfunction",
        components: si2
      };
    }

    var si1 = [];
    if (yes(input.retinopathy)) si1.push("Retinopathy");
    if (yes(input.neuropathy)) si1.push("Neuropathy");
    if (yes(input.nephropathy)) si1.push("Nephropathy");
    if (yes(input.diabeticVasculopathy)) si1.push("Diabetic vasculopathy");
    if (si1.length) {
      return {
        rank: 1,
        label: "Si1",
        subtype: "",
        reason: "diabetic microvascular/end-organ disease",
        components: si1
      };
    }

    return {
      rank: 0,
      label: "Si0",
      subtype: "",
      reason: "no end-organ involvement",
      components: []
    };
  }

  function calculateMosiS(input) {
    input = input || {};
    var m = calculateMScore(input.bmi);
    if (!m.score) {
      return {
        complete: false,
        warning: m.warning || "",
        reason: m.reason || "BMI is below the MOSI input range."
      };
    }

    var o = calculateOScore(input);
    var si = calculateSiLevel(input);
    var stage = "Stage II";
    var explanation = "";

    if (si.rank === 3) {
      stage = "Stage IV";
      explanation = "Stage assigned because Si3 organ failure is present. " + si.subtype + " is a descriptive subgroup label.";
    } else if (si.rank === 2) {
      stage = "Stage III";
      explanation = "Stage assigned because Si2 major organ dysfunction is present.";
    } else if (si.rank === 1 && (m.score >= 4 || o.score >= 3)) {
      stage = "Stage III";
      explanation = "Stage assigned because Si1 is present with M ≥4 or O ≥3.";
    } else if (si.rank === 0 && m.score <= 2 && o.score <= 1) {
      stage = "Stage I";
      explanation = "Stage assigned because Si0 is present with M ≤2 and O ≤1.";
    } else if (si.rank === 1) {
      explanation = "Stage assigned because Si1 is present without M ≥4 or O ≥3.";
    } else {
      explanation = "Stage assigned because the profile does not meet Stage I, Stage III, or Stage IV criteria.";
    }

    return {
      complete: true,
      mScore: m,
      oScore: o,
      siLevel: si,
      stage: stage,
      subtype: si.subtype,
      stageDisplay: si.subtype || stage,
      summary: m.label + "-" + o.label + "-" + si.label,
      explanation: explanation
    };
  }

  function calculateMosiT(input, siLevel) {
    input = input || {};
    siLevel = siLevel || calculateSiLevel(input);
    var microvascular = hasMicrovascular(input);
    var tier = "A";
    var target = TIER_TARGETS.A;
    var reason = "No qualifying metabolic or organ comorbidity is present.";
    var benefit = "Functional improvement, quality of life, and mechanical offloading may be discussed.";

    if (yes(input.sleepApnea) || yes(input.hypertension) || yes(input.hyperlipidemia) || yes(input.gerd) || yes(input.arthropathy) || yes(input.arthroplasty)) {
      tier = "B";
      target = TIER_TARGETS.B;
      reason = "Tier B feature present: OSA, hypertension, hyperlipidemia, GERD, arthropathy, or prior arthroplasty.";
      benefit = "May support discussion of sleep, cardiometabolic, reflux, or joint-related clinical goals.";
    }

    if (yes(input.type2Diabetes) || yes(input.impairedFastingGlucose) || microvascular) {
      tier = "C";
      target = TIER_TARGETS.C;
      reason = "Tier C feature present: type 2 diabetes, impaired fasting glucose, or diabetic microvascular/end-organ disease.";
      benefit = "May support discussion of glycemic and microvascular benefit.";
    }

    if (yes(input.cardiac) || yes(input.stroke) || siLevel.rank >= 2) {
      tier = "D";
      target = TIER_TARGETS.D;
      reason = "Tier D feature present: cardiac history, stroke/TIA, Si2, or Si3 systemic disease.";
      benefit = "May support discussion of deeper sustained TWL in systemic or cardiovascular disease contexts.";
    }

    return {
      tier: tier,
      label: "Tier " + tier,
      target: target,
      targetLabel: "≥" + target + "% TWL",
      reason: reason,
      benefit: benefit
    };
  }

  function normalizeStageForMosiD(stage) {
    if (stage === "Stage IV-A" || stage === "Stage IV-B") return "Stage IV";
    return stage;
  }

  function cloneEstimate(value) {
    return {
      month12: Number.isFinite(value && value.month12) ? value.month12 : null,
      month60: Number.isFinite(value && value.month60) ? value.month60 : null
    };
  }

  function getMosiDEstimates(stage, tier) {
    var stageKey = normalizeStageForMosiD(stage);
    var stageData = MOSID_PROBABILITIES[stageKey] || {};
    var target = TIER_TARGETS[tier] || null;
    var highlightThreshold = THRESHOLDS.indexOf(target) >= 0 ? target : null;

    var procedures = PROCEDURES.map(function (procedure) {
      var data = stageData[procedure.key] || {};
      var estimates = {};
      THRESHOLDS.forEach(function (threshold) {
        estimates[threshold] = cloneEstimate(data[threshold]);
      });
      return {
        key: procedure.key,
        name: procedure.name,
        shortName: procedure.shortName,
        estimates: estimates
      };
    });

    return {
      stageKey: stageKey,
      tier: tier || "",
      targetThreshold: target,
      highlightThreshold: highlightThreshold,
      thresholds: THRESHOLDS.slice(),
      procedures: procedures
    };
  }

  return {
    THRESHOLDS: THRESHOLDS.slice(),
    TIER_TARGETS: Object.assign({}, TIER_TARGETS),
    MOSID_PROBABILITIES: MOSID_PROBABILITIES,
    calculateMScore: calculateMScore,
    calculateOScore: calculateOScore,
    calculateSiLevel: calculateSiLevel,
    calculateMosiS: calculateMosiS,
    calculateMosiT: calculateMosiT,
    getMosiDEstimates: getMosiDEstimates,
    normalizeStageForMosiD: normalizeStageForMosiD
  };
}));
