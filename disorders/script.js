// Disorders and Diagnostics — Key Term Matching and Diagnostic Steps
// Two drag-and-match activities (word bank of term chips, dropped or tapped
// onto their matching definition) plus a drag-and-reorder activity for the
// diagnosis steps.

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
    { term: "Key Stressors", definition: "Frequently encountered pests, disorders, and site conditions." },
    { term: "Key Plants", definition: "Species with a high incidence of pest problems." },
    { term: "Signs", definition: "Direct indications of the causal agent; can be diagnostic (ex: galleries, conks)." },
    { term: "Symptoms", definition: "Effects of the causal agent; often not diagnostic on their own (ex: wilting, necrosis)." },
  ];

  const phcControl = [
    { term: "Prevention", definition: "The preferred method, focused on promoting plant health before problems start." },
    { term: "Suppression", definition: "Reducing the pest population to a tolerable level." },
    { term: "Eradication", definition: "Total removal of a pest from an area." },
    { term: "Introduction", definition: "Releasing non-native predators, parasites, or pathogens to control exotic pests." },
    { term: "Conservation", definition: "Retaining existing predators of pests." },
    { term: "Augmentation", definition: "Rearing and releasing predators of pests." },
  ];

  // ---- Generic drag/tap term-matching section ------------------------------
  // pool: [{term, definition}]; questionCount: how many to show per round.
  function initMatchingSection(pool, questionCount, ids) {
    const wrapperEl = document.getElementById(ids.wrapper);
    const bankEl = document.getElementById(ids.bank);
    const listEl = document.getElementById(ids.list);
    const feedbackEl = document.getElementById(ids.feedback);

    let currentItems = [];
    let selectedChip = null;
    let draggedChip = null;

    function pickItems() {
      return shuffleArray(pool).slice(0, questionCount);
    }

    function updateSlotFocusability(slot) {
      slot.tabIndex = slot.querySelector(".term-chip") ? -1 : 0;
    }

    function moveChip(chip, destination) {
      const oldSlot = chip.parentElement && chip.parentElement.classList.contains("match-slot")
        ? chip.parentElement
        : null;
      if (oldSlot) {
        oldSlot.classList.remove("correct", "incorrect");
      }

      if (destination.classList.contains("match-slot")) {
        const existing = destination.querySelector(".term-chip");
        if (existing && existing !== chip) {
          bankEl.appendChild(existing);
          existing.classList.remove("selected");
          existing.setAttribute("aria-pressed", "false");
        }
        destination.classList.remove("correct", "incorrect");
      }

      destination.appendChild(chip);
      chip.classList.remove("selected", "dragging");
      chip.setAttribute("aria-pressed", "false");
      if (selectedChip === chip) selectedChip = null;

      if (oldSlot) updateSlotFocusability(oldSlot);
      if (destination.classList.contains("match-slot")) updateSlotFocusability(destination);
    }

    function render() {
      bankEl.innerHTML = "";
      shuffleArray(currentItems).forEach((item) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "term-chip";
        chip.draggable = true;
        chip.dataset.term = item.term;
        chip.textContent = item.term;
        chip.setAttribute("aria-pressed", "false");
        bankEl.appendChild(chip);
      });

      listEl.innerHTML = "";
      currentItems.forEach((item) => {
        const row = document.createElement("div");
        row.className = "match-item";

        const def = document.createElement("p");
        def.className = "match-definition";
        def.textContent = item.definition;

        const slot = document.createElement("div");
        slot.className = "match-slot";
        slot.dataset.correctTerm = item.term;
        slot.tabIndex = 0;
        slot.setAttribute("role", "button");
        slot.setAttribute("aria-label", `Answer slot for: ${item.definition}`);

        row.appendChild(def);
        row.appendChild(slot);
        listEl.appendChild(row);
      });
    }

    function check() {
      const slots = [...listEl.querySelectorAll(".match-slot")];
      let correctCount = 0;
      let filledCount = 0;

      slots.forEach((slot) => {
        slot.classList.remove("correct", "incorrect");
        const chip = slot.querySelector(".term-chip");
        if (!chip) return;
        filledCount += 1;
        if (chip.dataset.term === slot.dataset.correctTerm) {
          slot.classList.add("correct");
          correctCount += 1;
        } else {
          slot.classList.add("incorrect");
        }
      });

      feedbackEl.classList.remove("good", "needs-work");
      if (filledCount === 0) {
        feedbackEl.textContent = "Place a term in each slot, then check again.";
        feedbackEl.classList.add("needs-work");
      } else if (correctCount === slots.length) {
        feedbackEl.textContent = "All correct! Nicely done.";
        feedbackEl.classList.add("good");
      } else {
        feedbackEl.textContent = `${correctCount} of ${slots.length} correct. Review the highlighted definitions and try again.`;
        feedbackEl.classList.add("needs-work");
      }
    }

    function reset() {
      currentItems = pickItems();
      selectedChip = null;
      draggedChip = null;
      render();
      feedbackEl.textContent = "";
      feedbackEl.classList.remove("good", "needs-work");
    }

    // ---- Tap-to-place (mouse click, touch tap, and keyboard Enter/Space via button semantics) ----
    wrapperEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".term-chip");
      if (chip) {
        const inSlot = chip.parentElement && chip.parentElement.classList.contains("match-slot");
        if (inSlot) {
          moveChip(chip, bankEl);
          return;
        }
        if (selectedChip === chip) {
          chip.classList.remove("selected");
          chip.setAttribute("aria-pressed", "false");
          selectedChip = null;
        } else {
          if (selectedChip) {
            selectedChip.classList.remove("selected");
            selectedChip.setAttribute("aria-pressed", "false");
          }
          selectedChip = chip;
          chip.classList.add("selected");
          chip.setAttribute("aria-pressed", "true");
        }
        return;
      }

      const slot = e.target.closest(".match-slot");
      if (slot && selectedChip) {
        moveChip(selectedChip, slot);
      }
    });

    // Slots are plain divs (a chip <button> can't legally nest inside another
    // button), so Enter/Space needs to be wired up manually.
    wrapperEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const slot = e.target.closest(".match-slot");
      if (!slot || e.target !== slot) return;
      e.preventDefault();
      if (selectedChip) moveChip(selectedChip, slot);
    });

    // ---- Native drag-and-drop (mouse / trackpad) ----
    wrapperEl.addEventListener("dragstart", (e) => {
      const chip = e.target.closest(".term-chip");
      if (!chip) return;
      draggedChip = chip;
      chip.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", chip.dataset.term);
    });

    wrapperEl.addEventListener("dragend", (e) => {
      const chip = e.target.closest(".term-chip");
      if (chip) chip.classList.remove("dragging");
      listEl.querySelectorAll(".match-slot.drag-over").forEach((s) => s.classList.remove("drag-over"));
      draggedChip = null;
    });

    wrapperEl.addEventListener("dragover", (e) => {
      const slot = e.target.closest(".match-slot");
      const bank = e.target.closest(".term-bank");
      if (slot || bank) e.preventDefault();
      if (slot) slot.classList.add("drag-over");
    });

    wrapperEl.addEventListener("dragleave", (e) => {
      const slot = e.target.closest(".match-slot");
      if (slot) slot.classList.remove("drag-over");
    });

    wrapperEl.addEventListener("drop", (e) => {
      const slot = e.target.closest(".match-slot");
      const bank = e.target.closest(".term-bank");
      if (slot && draggedChip) {
        e.preventDefault();
        slot.classList.remove("drag-over");
        moveChip(draggedChip, slot);
      } else if (bank && draggedChip) {
        e.preventDefault();
        moveChip(draggedChip, bankEl);
      }
    });

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
    initMatchingSection(healthConcepts, 8, {
      wrapper: "termsMatch",
      bank: "termsBank",
      list: "termsList",
      checkButton: "checkTermsButton",
      resetButton: "resetTermsButton",
      feedback: "termsFeedback",
    });

    initMatchingSection(phcControl, phcControl.length, {
      wrapper: "phcMatch",
      bank: "phcBank",
      list: "phcList",
      checkButton: "checkPhcButton",
      resetButton: "resetPhcButton",
      feedback: "phcFeedback",
    });

    initStepsActivity();
  });
})();
