// Disorders and Diagnostics — Key Term Definitions and Diagnostic Steps
// Three definition-matching quizzes (dropdown select, same pattern as the
// other lessons) plus a drag-and-reorder activity for the diagnosis steps.

(function () {
  "use strict";

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ---- Term pools ---------------------------------------------------------

  const healthConcepts = [
    { term: "Disorder", definition: "An abnormal condition impairing plant function(s)." },
    { term: "Biotic", definition: "Living agents, such as fungi, bacteria, viruses, parasitic plants, and pests." },
    { term: "Abiotic", definition: "Non-infectious, non-living agents." },
    { term: "Acute", definition: "Occurs suddenly and causes almost immediate damage (ex: lightning, untimely frost)." },
    { term: "Chronic", definition: "Occurs over long periods with a slow onset (ex: poor drainage, soil compaction)." },
    { term: "Vitality", definition: "A plant's ability to overcome stress and thrive." },
    { term: "Vigor", definition: "A plant's genetic capacity to resist stress." },
    { term: "Physical Defense", definition: "Altered foliage, thorns, or spines that deter damage." },
    { term: "Allelochemicals", definition: "Toxic or deterring compounds produced by a plant." },
    { term: "Key Stressors", definition: "Frequently encountered pests, disorders, and site conditions." },
    { term: "Key Plants", definition: "Species with a high incidence of pest problems." },
    { term: "Key Plants (alt.)", definition: "A plant with significant value to the client." },
  ];

  const diagnosticTerms = [
    { term: "Signs", definition: "Direct indications of the causal agent; can be diagnostic (ex: galleries, conks)." },
    { term: "Symptoms", definition: "Effects of the causal agent; often not diagnostic on their own (ex: wilting, necrosis)." },
    { term: "Brown Roots", definition: "Indicate dry soil conditions or toxic chemicals." },
    { term: "Black Roots", definition: "Indicate anaerobic conditions, disease, or pathogens." },
  ];

  const phcControl = [
    { term: "Prevention", definition: "The preferred method, focused on promoting plant health before problems start." },
    { term: "Suppression", definition: "Reducing the pest population to a tolerable level." },
    { term: "Eradication", definition: "Total removal of a pest from an area." },
    { term: "Introduction", definition: "Releasing non-native predators, parasites, or pathogens to control exotic pests." },
    { term: "Conservation", definition: "Retaining existing predators of pests." },
    { term: "Augmentation", definition: "Rearing and releasing predators of pests." },
  ];

  // ---- Generic definition-matching section --------------------------------
  // pool: [{term, definition}]; questionCount: how many to show per round
  // (use pool.length to show every term every round).
  function initDefinitionSection(pool, questionCount, ids) {
    const listEl = document.getElementById(ids.list);
    const feedbackEl = document.getElementById(ids.feedback);
    let currentQuestions = [];

    const sortedTerms = pool.map((p) => p.term).slice().sort((a, b) => a.localeCompare(b));

    function optionsMarkup() {
      return sortedTerms.map((t) => `<option value="${t}">${t}</option>`).join("");
    }

    function pickQuestions() {
      return shuffleArray(pool).slice(0, questionCount);
    }

    function build() {
      listEl.innerHTML = "";
      currentQuestions.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
          <label for="${ids.prefix}Answer${index}">${q.definition}</label>
          <select id="${ids.prefix}Answer${index}" class="answer-input" data-index="${index}">
            <option value="">Select a term</option>
            ${optionsMarkup()}
          </select>
        `;
        listEl.appendChild(div);
      });
    }

    function check() {
      let correctCount = 0;
      let answeredCount = 0;
      currentQuestions.forEach((q, index) => {
        const select = document.getElementById(`${ids.prefix}Answer${index}`);
        if (!select) return;
        select.classList.remove("correct", "incorrect");
        if (select.value === "") return;
        answeredCount += 1;
        if (select.value === q.term) {
          select.classList.add("correct");
          correctCount += 1;
        } else {
          select.classList.add("incorrect");
        }
      });

      feedbackEl.classList.remove("good", "needs-work");
      if (answeredCount === 0) {
        feedbackEl.textContent = "Select an answer for each question, then check again.";
        feedbackEl.classList.add("needs-work");
      } else if (correctCount === currentQuestions.length) {
        feedbackEl.textContent = "All correct! Nicely done.";
        feedbackEl.classList.add("good");
      } else {
        feedbackEl.textContent = `${correctCount} of ${currentQuestions.length} correct. Review the highlighted questions and try again.`;
        feedbackEl.classList.add("needs-work");
      }
    }

    function reset() {
      currentQuestions = pickQuestions();
      build();
      feedbackEl.textContent = "";
      feedbackEl.classList.remove("good", "needs-work");
    }

    document.getElementById(ids.checkButton).addEventListener("click", check);
    document.getElementById(ids.resetButton).addEventListener("click", reset);
    reset();
  }

  // ---- Diagnostic steps: drag-and-drop reorder -----------------------------

  const diagnosisSteps = [
    { id: "identify", text: "Accurately identify the plant" },
    { id: "pattern", text: "Look for a pattern of abnormality" },
    { id: "site", text: "Carefully examine the site" },
    { id: "foliage", text: "Note the colour, size, and thickness of foliage" },
    { id: "trunk", text: "Check the trunk and branches" },
    { id: "roots", text: "Examine the roots and root collar" },
  ];

  function initStepsActivity() {
    const listEl = document.getElementById("stepsList");
    const feedbackEl = document.getElementById("stepsFeedback");
    const correctOrder = diagnosisSteps.map((s) => s.id);

    function currentOrder() {
      return [...listEl.children].map((li) => li.dataset.id);
    }

    function renumber() {
      const items = [...listEl.children];
      items.forEach((li, index) => {
        li.querySelector(".step-number").textContent = String(index + 1);
        li.querySelector(".step-up").disabled = index === 0;
        li.querySelector(".step-down").disabled = index === items.length - 1;
      });
    }

    function clearFeedbackStyles() {
      [...listEl.children].forEach((li) => li.classList.remove("correct", "incorrect"));
      feedbackEl.textContent = "";
      feedbackEl.classList.remove("good", "needs-work");
    }

    function render(order) {
      listEl.innerHTML = "";
      order.forEach((id) => {
        const step = diagnosisSteps.find((s) => s.id === id);
        const li = document.createElement("li");
        li.className = "step-item";
        li.dataset.id = id;
        li.draggable = true;
        li.innerHTML = `
          <span class="step-handle" aria-hidden="true">&#8942;&#8942;</span>
          <span class="step-number">1</span>
          <span class="step-text">${step.text}</span>
          <span class="step-move">
            <button type="button" class="step-up" aria-label="Move &quot;${step.text}&quot; earlier">&#9650;</button>
            <button type="button" class="step-down" aria-label="Move &quot;${step.text}&quot; later">&#9660;</button>
          </span>
        `;
        listEl.appendChild(li);
      });
      renumber();
    }

    function shuffledStart() {
      let order;
      do {
        order = shuffleArray(correctOrder);
      } while (order.join() === correctOrder.join());
      return order;
    }

    // ---- Native drag-and-drop (mouse / trackpad) ----
    function getDragAfterElement(y) {
      const items = [...listEl.querySelectorAll(".step-item:not(.dragging)")];
      return items.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
          }
          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY, element: null }
      ).element;
    }

    listEl.addEventListener("dragstart", (e) => {
      const li = e.target.closest(".step-item");
      if (!li) return;
      li.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });

    listEl.addEventListener("dragend", (e) => {
      const li = e.target.closest(".step-item");
      if (li) li.classList.remove("dragging");
      renumber();
      clearFeedbackStyles();
    });

    listEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = listEl.querySelector(".dragging");
      if (!dragging) return;
      const afterElement = getDragAfterElement(e.clientY);
      if (afterElement == null) {
        listEl.appendChild(dragging);
      } else {
        listEl.insertBefore(dragging, afterElement);
      }
    });

    // ---- Up/down buttons (touch, keyboard, and screen readers) ----
    listEl.addEventListener("click", (e) => {
      const li = e.target.closest(".step-item");
      if (!li) return;
      if (e.target.classList.contains("step-up") && li.previousElementSibling) {
        listEl.insertBefore(li, li.previousElementSibling);
        renumber();
        clearFeedbackStyles();
      } else if (e.target.classList.contains("step-down") && li.nextElementSibling) {
        listEl.insertBefore(li.nextElementSibling, li);
        renumber();
        clearFeedbackStyles();
      }
    });

    function check() {
      const order = currentOrder();
      let correctCount = 0;
      [...listEl.children].forEach((li, index) => {
        li.classList.remove("correct", "incorrect");
        if (order[index] === correctOrder[index]) {
          li.classList.add("correct");
          correctCount += 1;
        } else {
          li.classList.add("incorrect");
        }
      });

      feedbackEl.classList.remove("good", "needs-work");
      if (correctCount === correctOrder.length) {
        feedbackEl.textContent = "All correct! That's the right diagnostic sequence.";
        feedbackEl.classList.add("good");
      } else {
        feedbackEl.textContent = `${correctCount} of ${correctOrder.length} steps in the correct position. Review the highlighted steps and try again.`;
        feedbackEl.classList.add("needs-work");
      }
    }

    function reveal() {
      render(correctOrder);
      clearFeedbackStyles();
    }

    function reset() {
      render(shuffledStart());
      clearFeedbackStyles();
    }

    document.getElementById("checkStepsButton").addEventListener("click", check);
    document.getElementById("revealStepsButton").addEventListener("click", reveal);
    document.getElementById("resetStepsButton").addEventListener("click", reset);

    reset();
  }

  // ---- Wire everything up --------------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    initDefinitionSection(healthConcepts, 6, {
      prefix: "health",
      list: "healthQuestions",
      checkButton: "checkHealthButton",
      resetButton: "resetHealthButton",
      feedback: "healthFeedback",
    });

    initDefinitionSection(diagnosticTerms, diagnosticTerms.length, {
      prefix: "diagnostic",
      list: "diagnosticQuestions",
      checkButton: "checkDiagnosticButton",
      resetButton: "resetDiagnosticButton",
      feedback: "diagnosticFeedback",
    });

    initDefinitionSection(phcControl, phcControl.length, {
      prefix: "phc",
      list: "phcQuestions",
      checkButton: "checkPhcButton",
      resetButton: "resetPhcButton",
      feedback: "phcFeedback",
    });

    initStepsActivity();
  });
})();
