const assert = require("assert");

function calculateMosi(input) {
  if (!Number.isFinite(input.bmi) || input.bmi < 30) {
    return { complete: false };
  }

  const M = input.bmi < 35 ? 1 : input.bmi < 40 ? 2 : input.bmi < 45 ? 3 : input.bmi < 50 ? 4 : 5;
  const dysglycemia = Boolean(input.type2Diabetes || input.impairedFastingGlucose);
  const O = Number(Boolean(input.hypertension)) + Number(dysglycemia) + Number(Boolean(input.sleepApnea)) + Number(Boolean(input.hyperlipidemia));
  const microvascular = Boolean(input.retinopathy || input.neuropathy || input.nephropathy || input.diabeticVasculopathy);

  let siRank = 0;
  let subtype = "";

  if (input.dialysis) {
    siRank = 3;
    subtype = "Stage IV-B";
  } else if (input.transplant) {
    siRank = 3;
    subtype = "Stage IV-A";
  } else if (input.ckd || input.cirrhosis || input.cardiac || input.stroke) {
    siRank = 2;
  } else if (microvascular) {
    siRank = 1;
  }

  let stage = "Stage II";
  if (siRank === 3) {
    stage = "Stage IV";
  } else if (siRank === 2) {
    stage = "Stage III";
  } else if (siRank === 1 && (M >= 4 || O >= 3)) {
    stage = "Stage III";
  } else if (siRank === 0 && M <= 2 && O <= 1) {
    stage = "Stage I";
  }

  let tier = "A";
  if (input.sleepApnea || input.hypertension || input.hyperlipidemia || input.gerd || input.arthropathy || input.arthroplasty) tier = "B";
  if (input.type2Diabetes || input.impairedFastingGlucose || microvascular) tier = "C";
  if (input.cardiac || input.stroke || siRank >= 2) tier = "D";

  return {
    complete: true,
    mosiS: `M${M}-O${O}-Si${siRank}`,
    stage,
    subtype,
    stageDisplay: subtype || stage,
    tier
  };
}

const examples = [
  {
    name: "BMI 34 with no O/Si comorbidities",
    input: { bmi: 34 },
    expected: { mosiS: "M1-O0-Si0", stageDisplay: "Stage I", tier: "A" }
  },
  {
    name: "BMI 42 with hypertension only",
    input: { bmi: 42, hypertension: true },
    expected: { mosiS: "M3-O1-Si0", stageDisplay: "Stage II", tier: "B" }
  },
  {
    name: "BMI 48 with diabetes, neuropathy, OSA, and hypertension",
    input: { bmi: 48, type2Diabetes: true, neuropathy: true, sleepApnea: true, hypertension: true },
    expected: { mosiS: "M4-O3-Si1", stageDisplay: "Stage III", tier: "C" }
  },
  {
    name: "BMI 38 with CKD without dialysis",
    input: { bmi: 38, ckd: true },
    expected: { mosiS: "M2-O0-Si2", stageDisplay: "Stage III", tier: "D" }
  },
  {
    name: "BMI 41 with transplant without dialysis",
    input: { bmi: 41, transplant: true },
    expected: { mosiS: "M3-O0-Si3", stageDisplay: "Stage IV-A", tier: "D" }
  },
  {
    name: "BMI 41 with dialysis",
    input: { bmi: 41, dialysis: true },
    expected: { mosiS: "M3-O0-Si3", stageDisplay: "Stage IV-B", tier: "D" }
  }
];

for (const example of examples) {
  const actual = calculateMosi(example.input);
  assert.strictEqual(actual.mosiS, example.expected.mosiS, example.name);
  assert.strictEqual(actual.stageDisplay, example.expected.stageDisplay, example.name);
  assert.strictEqual(actual.tier, example.expected.tier, example.name);
}

console.log(`All ${examples.length} MOSI examples passed.`);
