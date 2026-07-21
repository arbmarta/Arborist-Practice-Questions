// Soil Analysis — Soil Texture Triangle Practice
// Generates 3 random texture-triangle questions and grades the answers.

(function () {
  "use strict";

  // Representative sand/silt/clay percentages for each USDA texture class,
  // chosen to sit clearly inside each region of the triangle (not on a
  // boundary) so grading is unambiguous.
  const texturePool = [
    { sand: 90, silt: 5, clay: 5, texture: "sand" },
    { sand: 80, silt: 10, clay: 10, texture: "loamy sand" },
    { sand: 65, silt: 25, clay: 10, texture: "sandy loam" },
    { sand: 40, silt: 40, clay: 20, texture: "loam" },
    { sand: 20, silt: 65, clay: 15, texture: "silt loam" },
    { sand: 10, silt: 85, clay: 5, texture: "silt" },
    { sand: 60, silt: 15, clay: 25, texture: "sandy clay loam" },
    { sand: 30, silt: 35, clay: 35, texture: "clay loam" },
    { sand: 10, silt: 55, clay: 35, texture: "silty clay loam" },
    { sand: 50, silt: 5, clay: 45, texture: "sandy clay" },
    { sand: 5, silt: 45, clay: 50, texture: "silty clay" },
    { sand: 20, silt: 20, clay: 60, texture: "clay" },
  ];

  const textureOptions = [
    "sand", "loamy sand", "sandy loam", "loam", "silt loam", "silt",
    "sandy clay loam", "clay loam", "silty clay loam", "sandy clay",
    "silty clay", "clay",
  ];

  const QUESTION_COUNT = 3;
  let currentQuestions = [];

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function capitalize(text) {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function pickQuestions() {
    const picks = shuffleArray(texturePool).slice(0, QUESTION_COUNT);
    return picks.map((entry) => {
      const shown = shuffleArray(["sand", "silt", "clay"]).slice(0, 2);
      return { ...entry, shown };
    });
  }

  const textureQuestions = document.getElementById("textureQuestions");

  function optionsMarkup() {
    return textureOptions.map((opt) => `<option value="${opt}">${capitalize(opt)}</option>`).join("");
  }

  function buildTextureQuestions() {
    textureQuestions.innerHTML = "";
    currentQuestions.forEach((q, index) => {
      const div = document.createElement("div");
      div.className = "question";
      const parts = q.shown.map((cat) => `${q[cat]}% ${cat}`);
      div.innerHTML = `
        <label for="textureAnswer${index}">Given ${parts[0]} and ${parts[1]}, what is the soil texture?</label>
        <select id="textureAnswer${index}" class="answer-input" data-index="${index}">
          <option value="">Select a texture</option>
          ${optionsMarkup()}
        </select>
      `;
      textureQuestions.appendChild(div);
    });
  }

  function checkTexture() {
    const feedback = document.getElementById("textureFeedback");
    let correctCount = 0;
    let answeredCount = 0;

    currentQuestions.forEach((q, index) => {
      const select = document.getElementById(`textureAnswer${index}`);
      if (!select) return;
      select.classList.remove("correct", "incorrect");
      if (select.value === "") return;
      answeredCount += 1;
      if (select.value === q.texture) {
        select.classList.add("correct");
        correctCount += 1;
      } else {
        select.classList.add("incorrect");
      }
    });

    if (feedback) {
      feedback.classList.remove("good", "needs-work");
      if (answeredCount === 0) {
        feedback.textContent = "Select an answer for each question, then check again.";
        feedback.classList.add("needs-work");
      } else if (correctCount === currentQuestions.length) {
        feedback.textContent = "All correct! Nicely done.";
        feedback.classList.add("good");
      } else {
        feedback.textContent = `${correctCount} of ${currentQuestions.length} correct. Review the highlighted questions and try again.`;
        feedback.classList.add("needs-work");
      }
    }
  }

  function resetTexture() {
    currentQuestions = pickQuestions();
    buildTextureQuestions();
    const feedback = document.getElementById("textureFeedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("good", "needs-work");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    resetTexture();
    document.getElementById("checkTextureButton").addEventListener("click", checkTexture);
    document.getElementById("resetTextureButton").addEventListener("click", resetTexture);
  });
})();
