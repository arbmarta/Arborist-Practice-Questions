// Tree Fertilization — Fertilizer Analysis Practice
// Generates the practice table, grades answers, and runs the "bags needed" challenge.

(function () {
  "use strict";

  // ---- Data -----------------------------------------------------------

  // Each row: bag weight (kg), guaranteed analysis N-P-K (as printed on the label)
  // Note: the 20 kg 10-6-3 bag is intentionally left out here since it's shown
  // pre-filled as the example row at the top of the table.
  const practiceData = [
    { bag: 25, n: 16, p: 4, k: 8 },
    { bag: 50, n: 20, p: 0, k: 10 },
    { bag: 20, n: 12, p: 12, k: 12 },
    { bag: 30, n: 8, p: 2, k: 6 },
  ];

  // Each question: total actual N (kg) needed, bag weight (kg), N% on that bag's label
  const bagData = [
    { needKg: 5, bagWeight: 20, nPercent: 10 },
    { needKg: 8, bagWeight: 25, nPercent: 16 },
    { needKg: 12, bagWeight: 50, nPercent: 20 },
  ];

  // Fixed reference row shown pre-filled at the top of the practice table
  const exampleRowData = { bag: 20, n: 10, p: 6, k: 3 };

  const KG_PER_LB = 0.45359237;
  let practiceUnit = "kg"; // "kg" or "lb"

  const round1 = (num) => Math.round(num * 10) / 10;

  function weightInPracticeUnit(kgWeight) {
    return practiceUnit === "kg" ? kgWeight : round1(kgWeight / KG_PER_LB);
  }

  function nutrientAmountInPracticeUnit(kgWeight, percent) {
    return round1((weightInPracticeUnit(kgWeight) * percent) / 100);
  }

  // ---- Build practice table -------------------------------------------

  const practiceRows = document.getElementById("practiceRows");
  const scoreTotal = document.getElementById("scoreTotal");

  function renderExampleRow() {
    const weightCell = document.getElementById("exampleWeightCell");
    const analysisCell = document.getElementById("exampleAnalysisCell");
    const nCell = document.getElementById("exampleNCell");
    const pCell = document.getElementById("examplePCell");
    const kCell = document.getElementById("exampleKCell");
    if (weightCell) weightCell.textContent = `${weightInPracticeUnit(exampleRowData.bag)} ${practiceUnit}`;
    if (analysisCell) analysisCell.textContent = `${exampleRowData.n}\u2013${exampleRowData.p}\u2013${exampleRowData.k}`;
    if (nCell) nCell.textContent = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.n);
    if (pCell) pCell.textContent = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.p);
    if (kCell) kCell.textContent = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.k);
  }

  function renderWorkedExample() {
    const w = weightInPracticeUnit(exampleRowData.bag);
    const nAmount = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.n);
    const pAmount = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.p);
    const kAmount = nutrientAmountInPracticeUnit(exampleRowData.bag, exampleRowData.k);

    const intro = document.getElementById("workedExampleIntro");
    if (intro) {
      intro.textContent = `A ${w} ${practiceUnit} bag of ${exampleRowData.n}\u2013${exampleRowData.p}\u2013${exampleRowData.k} fertilizer contains:`;
    }
    const nLine = document.getElementById("workedExampleN");
    if (nLine) nLine.innerHTML = `Nitrogen: ${w} \u00d7 ${exampleRowData.n} \u00f7 100 = <strong>${nAmount} ${practiceUnit}</strong>`;
    const pLine = document.getElementById("workedExampleP");
    if (pLine) pLine.innerHTML = `Available phosphate: ${w} \u00d7 ${exampleRowData.p} \u00f7 100 = <strong>${pAmount} ${practiceUnit}</strong>`;
    const kLine = document.getElementById("workedExampleK");
    if (kLine) kLine.innerHTML = `Soluble potash: ${w} \u00d7 ${exampleRowData.k} \u00f7 100 = <strong>${kAmount} ${practiceUnit}</strong>`;
  }

  function buildPracticeTable() {
    const colWeightHeader = document.getElementById("colWeightHeader");
    const colNHeader = document.getElementById("colNHeader");
    const colPHeader = document.getElementById("colPHeader");
    const colKHeader = document.getElementById("colKHeader");
    if (colWeightHeader) colWeightHeader.textContent = `Bag weight (${practiceUnit})`;
    if (colNHeader) colNHeader.textContent = `${practiceUnit} of N`;
    if (colPHeader) colPHeader.textContent = `${practiceUnit} of available phosphate`;
    if (colKHeader) colKHeader.textContent = `${practiceUnit} of soluble potash`;

    practiceRows.innerHTML = "";
    practiceData.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${weightInPracticeUnit(row.bag)} ${practiceUnit}</td>
        <td>${row.n}–${row.p}–${row.k}</td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Amount of nitrogen in ${practiceUnit} for row ${index + 1}" data-row="${index}" data-field="n"></td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Amount of available phosphate in ${practiceUnit} for row ${index + 1}" data-row="${index}" data-field="p"></td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Amount of soluble potash in ${practiceUnit} for row ${index + 1}" data-row="${index}" data-field="k"></td>
      `;
      practiceRows.appendChild(tr);
    });
    if (scoreTotal) scoreTotal.textContent = practiceData.length * 3;
  }

  function checkPractice() {
    const scoreValue = document.getElementById("scoreValue");
    const feedback = document.getElementById("feedback");
    let correctCount = 0;
    let answeredCount = 0;

    practiceData.forEach((row, index) => {
      ["n", "p", "k"].forEach((field) => {
        const input = practiceRows.querySelector(
          `input[data-row="${index}"][data-field="${field}"]`
        );
        if (!input) return;
        const expected = nutrientAmountInPracticeUnit(row.bag, row[field]);
        const raw = input.value.trim();
        input.classList.remove("correct", "incorrect");

        if (raw === "") return;
        answeredCount += 1;
        const given = parseFloat(raw);
        if (!isNaN(given) && Math.abs(given - expected) < 0.05) {
          input.classList.add("correct");
          correctCount += 1;
        } else {
          input.classList.add("incorrect");
        }
      });
    });

    if (scoreValue) scoreValue.textContent = correctCount;

    if (feedback) {
      feedback.classList.remove("good", "needs-work");
      const total = practiceData.length * 3;
      if (answeredCount === 0) {
        feedback.textContent = "Enter an answer in each box, then check again.";
        feedback.classList.add("needs-work");
      } else if (correctCount === total) {
        feedback.textContent = "All correct! Nicely done.";
        feedback.classList.add("good");
      } else {
        feedback.textContent = `${correctCount} of ${total} correct so far. Review the highlighted boxes and try again.`;
        feedback.classList.add("needs-work");
      }
    }
  }

  function resetPractice() {
    buildPracticeTable();
    renderExampleRow();
    renderWorkedExample();
    const scoreValue = document.getElementById("scoreValue");
    const feedback = document.getElementById("feedback");
    const hint = document.getElementById("hint");
    if (scoreValue) scoreValue.textContent = "0";
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("good", "needs-work");
    }
    if (hint) hint.hidden = true;
  }

  function setPracticeUnit(nextUnit) {
    practiceUnit = nextUnit;
    const toggle = document.getElementById("practiceUnitToggle");
    if (toggle) toggle.setAttribute("aria-checked", practiceUnit === "kg" ? "true" : "false");
    const kgLabel = document.getElementById("practiceUnitLabelKg");
    const lbLabel = document.getElementById("practiceUnitLabelLb");
    if (kgLabel) kgLabel.classList.toggle("active", practiceUnit === "kg");
    if (lbLabel) lbLabel.classList.toggle("active", practiceUnit === "lb");
    const hintText = document.getElementById("practiceUnitHint");
    if (hintText) {
      hintText.textContent = `Enter answers in ${practiceUnit === "kg" ? "kilograms" : "pounds"}. Decimals are allowed.`;
    }
    buildPracticeTable();
    renderExampleRow();
    renderWorkedExample();
    const scoreValue = document.getElementById("scoreValue");
    const feedback = document.getElementById("feedback");
    if (scoreValue) scoreValue.textContent = "0";
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("good", "needs-work");
    }
  }

  function togglePracticeUnit() {
    setPracticeUnit(practiceUnit === "kg" ? "lb" : "kg");
  }

  function toggleHint() {
    const hint = document.getElementById("hint");
    if (!hint) return;
    hint.hidden = !hint.hidden;
    if (!hint.hidden) {
      hint.textContent =
        `Nutrient mass (${practiceUnit}) = bag mass (${practiceUnit}) \u00d7 nutrient percentage \u00f7 100. ` +
        "The three numbers on a fertilizer label are always listed as % nitrogen \u2013 % available phosphate \u2013 % soluble potash.";
    }
  }

  // ---- Build "how many bags" challenge ---------------------------------

  const bagQuestions = document.getElementById("bagQuestions");

  function buildBagQuestions() {
    bagQuestions.innerHTML = "";
    bagData.forEach((q, index) => {
      const div = document.createElement("div");
      div.className = "question";
      div.innerHTML = `
        <label for="bagAnswer${index}">
          A tree needs ${q.needKg} kg of actual nitrogen. Fertilizer comes in ${q.bagWeight} kg bags
          labeled ${q.nPercent}\u2013?\u2013?. How many bags should be purchased?
        </label>
        <div class="input-row">
          <input class="bag-answer" id="bagAnswer${index}" type="number" step="1" inputmode="numeric"
                 aria-label="Number of bags for question ${index + 1}" data-index="${index}">
          <span>bag(s)</span>
        </div>
      `;
      bagQuestions.appendChild(div);
    });
  }

  function checkBags() {
    const bagFeedback = document.getElementById("bagFeedback");
    let correctCount = 0;
    let answeredCount = 0;

    bagData.forEach((q, index) => {
      const input = document.getElementById(`bagAnswer${index}`);
      if (!input) return;
      const kgPerBag = (q.bagWeight * q.nPercent) / 100;
      const expected = Math.ceil(q.needKg / kgPerBag);
      const raw = input.value.trim();
      input.classList.remove("correct", "incorrect");

      if (raw === "") return;
      answeredCount += 1;
      const given = parseInt(raw, 10);
      if (given === expected) {
        input.classList.add("correct");
        correctCount += 1;
      } else {
        input.classList.add("incorrect");
      }
    });

    if (bagFeedback) {
      bagFeedback.classList.remove("good", "needs-work");
      if (answeredCount === 0) {
        bagFeedback.textContent = "Enter your answer for each scenario, then check again.";
        bagFeedback.classList.add("needs-work");
      } else if (correctCount === bagData.length) {
        bagFeedback.textContent = "All correct! Remember to round up to a whole bag.";
        bagFeedback.classList.add("good");
      } else {
        bagFeedback.textContent = `${correctCount} of ${bagData.length} correct. Check whether you rounded up to the next whole bag.`;
        bagFeedback.classList.add("needs-work");
      }
    }
  }

  function resetBags() {
    buildBagQuestions();
    const bagFeedback = document.getElementById("bagFeedback");
    if (bagFeedback) {
      bagFeedback.textContent = "";
      bagFeedback.classList.remove("good", "needs-work");
    }
  }

  // ---- Read-the-label quiz (rotating bag images, kg/lb toggle) ----------

  // Filenames encode guaranteed analysis as N-P-K; all bags are 50 lb net weight
  const bagFiles = ["20-17-8.png", "30-12-10.png", "25-8-6.png"];
  const BAG_WEIGHT_LB = 50;

  const nutrientNames = { n: "nitrogen", p: "available phosphate", k: "soluble potash" };
  const nutrientKeys = ["n", "p", "k"];

  let unit = "lb"; // "lb" or "kg"
  let quizState = null; // { file, values: {n,p,k}, q1Key, q2Key, q3Key }

  function parseBagFile(file) {
    const [n, p, k] = file.replace(".png", "").split("-").map(Number);
    return { n, p, k };
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function bagWeightInUnit() {
    return unit === "lb" ? BAG_WEIGHT_LB : round1(BAG_WEIGHT_LB * KG_PER_LB);
  }

  function amountFor(key) {
    return round1((bagWeightInUnit() * quizState.values[key]) / 100);
  }

  function buildQuizState() {
    const file = pickRandom(bagFiles);
    const values = parseBagFile(file);
    const q1Key = pickRandom(nutrientKeys);
    const q2Key = pickRandom(nutrientKeys);
    const remaining = nutrientKeys.filter((k) => k !== q2Key);
    const q3Key = pickRandom(remaining);
    return { file, values, q1Key, q2Key, q3Key };
  }

  function renderQuiz() {
    const bagImage = document.getElementById("bagImage");
    if (bagImage) {
      bagImage.src = quizState.file;
      bagImage.alt = `Fertilizer bag labeled ${quizState.values.n}-${quizState.values.p}-${quizState.values.k}, net weight ${BAG_WEIGHT_LB} lb`;
    }

    const q1Label = document.getElementById("q1Label");
    if (q1Label) q1Label.textContent = `What percentage of the guaranteed analysis is ${nutrientNames[quizState.q1Key]}?`;

    const q2Label = document.getElementById("q2Label");
    if (q2Label) q2Label.textContent = `How many ${unit} of ${nutrientNames[quizState.q2Key]} are in this bag?`;

    const q3Label = document.getElementById("q3Label");
    if (q3Label) q3Label.textContent = `How many ${unit} of ${nutrientNames[quizState.q3Key]} are in this bag?`;

    const q1Suffix = document.getElementById("q1Suffix");
    if (q1Suffix) q1Suffix.textContent = "%";
    const q2Suffix = document.getElementById("q2Suffix");
    if (q2Suffix) q2Suffix.textContent = unit;
    const q3Suffix = document.getElementById("q3Suffix");
    if (q3Suffix) q3Suffix.textContent = unit;

    ["q1Answer", "q2Answer", "q3Answer"].forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = "";
        input.classList.remove("correct", "incorrect");
      }
    });
    const labelFeedback = document.getElementById("labelFeedback");
    if (labelFeedback) {
      labelFeedback.textContent = "";
      labelFeedback.classList.remove("good", "needs-work");
    }
  }

  function newLabelQuiz() {
    quizState = buildQuizState();
    renderQuiz();
  }

  function setUnit(nextUnit) {
    unit = nextUnit;
    const unitToggle = document.getElementById("unitToggle");
    if (unitToggle) unitToggle.setAttribute("aria-checked", unit === "kg" ? "true" : "false");
    const lbLabel = document.getElementById("unitLabelLb");
    const kgLabel = document.getElementById("unitLabelKg");
    if (lbLabel) lbLabel.classList.toggle("active", unit === "lb");
    if (kgLabel) kgLabel.classList.toggle("active", unit === "kg");
    renderQuiz();
  }

  function toggleUnit() {
    setUnit(unit === "lb" ? "kg" : "lb");
  }

  function checkLabel() {
    if (!quizState) return;
    const labelFeedback = document.getElementById("labelFeedback");
    const checks = [
      { id: "q1Answer", expected: quizState.values[quizState.q1Key], tolerance: 0 },
      { id: "q2Answer", expected: amountFor(quizState.q2Key), tolerance: 0.05 },
      { id: "q3Answer", expected: amountFor(quizState.q3Key), tolerance: 0.05 },
    ];
    let correctCount = 0;
    let answeredCount = 0;

    checks.forEach(({ id, expected, tolerance }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const raw = input.value.trim();
      input.classList.remove("correct", "incorrect");
      if (raw === "") return;
      answeredCount += 1;
      const given = parseFloat(raw);
      if (!isNaN(given) && Math.abs(given - expected) <= tolerance + 0.001) {
        input.classList.add("correct");
        correctCount += 1;
      } else {
        input.classList.add("incorrect");
      }
    });

    if (labelFeedback) {
      labelFeedback.classList.remove("good", "needs-work");
      if (answeredCount === 0) {
        labelFeedback.textContent = "Enter a value for each question, then check again.";
        labelFeedback.classList.add("needs-work");
      } else if (correctCount === checks.length) {
        labelFeedback.textContent = "All correct! That's how the label reads.";
        labelFeedback.classList.add("good");
      } else {
        labelFeedback.textContent = `${correctCount} of ${checks.length} correct. Check the highlighted boxes against the label.`;
        labelFeedback.classList.add("needs-work");
      }
    }
  }

  // ---- Wire up events ---------------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    setPracticeUnit(practiceUnit);
    buildBagQuestions();
    newLabelQuiz();
    setUnit(unit);

    document.getElementById("checkButton").addEventListener("click", checkPractice);
    document.getElementById("resetButton").addEventListener("click", resetPractice);
    document.getElementById("hintButton").addEventListener("click", toggleHint);
    document.getElementById("practiceUnitToggle").addEventListener("click", togglePracticeUnit);

    document.getElementById("checkBagsButton").addEventListener("click", checkBags);
    document.getElementById("resetBagsButton").addEventListener("click", resetBags);

    document.getElementById("checkLabelButton").addEventListener("click", checkLabel);
    document.getElementById("resetLabelButton").addEventListener("click", newLabelQuiz);
    document.getElementById("unitToggle").addEventListener("click", toggleUnit);
  });
})();
