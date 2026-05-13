const assert = require("assert");
const {
  calculateMosiS,
  calculateMosiT,
  getMosiDEstimates
} = require("../src/mosi-core.js");

function calculate(input) {
  const mosiS = calculateMosiS(input);
  assert.strictEqual(mosiS.complete, true);
  const mosiT = calculateMosiT(input, mosiS.siLevel);
  return {
    mosiS: mosiS.summary,
    stage: mosiS.stage,
    stageDisplay: mosiS.stageDisplay,
    tier: mosiT.tier,
    oScore: mosiS.oScore.score
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
  },
  {
    name: "Dialysis plus transplant uses Stage IV-B",
    input: { bmi: 41, dialysis: true, transplant: true },
    expected: { mosiS: "M3-O0-Si3", stageDisplay: "Stage IV-B", tier: "D" }
  },
  {
    name: "GERD alone changes tier but not O score",
    input: { bmi: 34, gerd: true },
    expected: { mosiS: "M1-O0-Si0", stageDisplay: "Stage I", tier: "B", oScore: 0 }
  }
];

for (const example of examples) {
  const actual = calculate(example.input);
  assert.strictEqual(actual.mosiS, example.expected.mosiS, example.name);
  assert.strictEqual(actual.stageDisplay, example.expected.stageDisplay, example.name);
  assert.strictEqual(actual.tier, example.expected.tier, example.name);
  if (Object.prototype.hasOwnProperty.call(example.expected, "oScore")) {
    assert.strictEqual(actual.oScore, example.expected.oScore, example.name);
  }
}

const stageThreeTierC = getMosiDEstimates("Stage III", "C");
assert.strictEqual(stageThreeTierC.highlightThreshold, 25);
assert.strictEqual(stageThreeTierC.procedures[0].estimates[25].month12, 30.5);
assert.strictEqual(stageThreeTierC.procedures[1].estimates[25].month12, 70.8);
assert.strictEqual(stageThreeTierC.procedures[0].estimates[25].month60, null);

const stageFourTierD = getMosiDEstimates("Stage IV-B", "D");
assert.strictEqual(stageFourTierD.stageKey, "Stage IV");
assert.strictEqual(stageFourTierD.highlightThreshold, 30);
assert.strictEqual(stageFourTierD.procedures[1].estimates[30].month60, 58.3);

console.log(`All ${examples.length} MOSI examples passed.`);
