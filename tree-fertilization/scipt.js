// Tree Fertilization — Fertilizer Analysis Practice
// Generates the practice table, grades answers, and runs the "bags needed" challenge.

(function () {
  "use strict";

  // ---- Data -----------------------------------------------------------

  // Each row: bag weight (kg), guaranteed analysis N-P-K (as printed on the label)
  const practiceData = [
    { bag: 20, n: 10, p: 6, k: 3 },
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

  const round1 = (num) => Math.round(num * 10) / 10;

  function nutrientKg(bagWeight, percent) {
    return round1((bagWeight * percent) / 100);
  }

  // ---- Build practice table -------------------------------------------

  const practiceRows = document.getElementById("practiceRows");
  const scoreTotal = document.getElementById("scoreTotal");

  function buildPracticeTable() {
    practiceRows.innerHTML = "";
    practiceData.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.bag} kg</td>
        <td>${row.n}–${row.p}–${row.k}</td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Kilograms of nitrogen for row ${index + 1}" data-row="${index}" data-field="n"></td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Kilograms of available phosphate for row ${index + 1}" data-row="${index}" data-field="p"></td>
        <td><input class="answer-input" type="number" step="0.1" inputmode="decimal"
             aria-label="Kilograms of soluble potash for row ${index + 1}" data-row="${index}" data-field="k"></td>
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
        const expected = nutrientKg(row.bag, row[field]);
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

  function toggleHint() {
    const hint = document.getElementById("hint");
    if (!hint) return;
    hint.hidden = !hint.hidden;
    if (!hint.hidden) {
      hint.textContent =
        "Nutrient mass (kg) = bag mass (kg) \u00d7 nutrient percentage \u00f7 100. " +
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

  // ---- Wire up events ---------------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    buildPracticeTable();
    buildBagQuestions();

    document.getElementById("checkButton").addEventListener("click", checkPractice);
    document.getElementById("resetButton").addEventListener("click", resetPractice);
    document.getElementById("hintButton").addEventListener("click", toggleHint);

    document.getElementById("checkBagsButton").addEventListener("click", checkBags);
    document.getElementById("resetBagsButton").addEventListener("click", resetBags);
  });
})();
