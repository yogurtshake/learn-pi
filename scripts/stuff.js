const piSequence = document.getElementById("pi-sequence");
const digitInput = document.getElementById("digit-input");
const digitCounter = document.getElementById("digit-counter");
const feedback = document.getElementById("feedback");
const revealBtn = document.getElementById("reveal-btn");
const restartBtn = document.getElementById("restart-btn");
const showPiBtn = document.getElementById("show-pi-btn");
const piPopup = document.getElementById("pi-popup");
const piPopupContent = document.getElementById("pi-popup-content");
const closePiPopup = document.getElementById("close-pi-popup");
const showInfoBtn = document.getElementById("show-info-btn");
const infoPopup = document.getElementById("info-popup");
const closeInfoPopup = document.getElementById("close-info-popup");
const piDigitsPre = document.getElementById("pi-digits");
const toggleAnimationsSwitch = document.getElementById(
  "toggle-animations-switch",
);
const switchLabelText = document.getElementById("switch-label-text");

let piDigits = "";
let currentIndex = 3;
let runEnded = false;
let animationsEnabled = true;

function updateDisplay() {
  const lineLength = 12; // or whatever fits your design
  let display = piDigits.slice(0, currentIndex + 1);

  // Build lines, starting with "3.14"
  let lines = [];
  let firstLine = display.slice(0, 4); // "3.14"
  let rest = display.slice(4);

  // Fill the first line up to lineLength
  let firstLineRest = rest.slice(0, lineLength - firstLine.length);
  lines.push(firstLine + firstLineRest);

  // Remaining digits
  rest = rest.slice(lineLength - firstLine.length);

  // Fill subsequent lines
  while (rest.length > 0) {
    lines.push(rest.slice(0, lineLength));
    rest = rest.slice(lineLength);
  }

  // If the last line is full, add an empty line for the input box
  if (lines[lines.length - 1].length === lineLength) {
    lines.push("");
  }

  // Build HTML for lines, input box at the end of the last line
  let html = "";
  for (let i = 0; i < lines.length; i++) {
    html += `<div class="pi-line">${lines[i]}`;
    if (i === lines.length - 1) {
      html += `<span id="input-holder"></span>`;
    }
    html += `</div>`;
  }
  piSequence.innerHTML = html;
  digitCounter.textContent = `Digits: ${currentIndex - 1}`;

  // Move the input box into the correct place
  const inputHolder = document.getElementById("input-holder");
  if (inputHolder) {
    inputHolder.appendChild(digitInput);
  }
}

function resetInput() {
  digitInput.value = "";
  digitInput.classList.remove("correct", "incorrect");
  digitInput.disabled = false;
  digitInput.focus();
}

function endRun() {
  runEnded = true;
  digitInput.disabled = true;
  revealBtn.disabled = true;
  revealBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
}

function restart() {
  currentIndex = 3;
  runEnded = false;
  feedback.textContent = "";
  revealBtn.disabled = false;
  revealBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  updateDisplay();
  resetInput();
}

function handleCorrectInput() {
  digitInput.classList.add("correct");

  if (animationsEnabled) {
    setTimeout(() => {
      digitInput.classList.remove("correct");
      currentIndex++;
      updateDisplay();

      if (currentIndex + 1 >= piDigits.length) {
        feedback.textContent =
          "You've reached one thousand digits. Get a life.";
        endRun();
      } else {
        resetInput();
      }
    }, 300);
  } else {
    digitInput.classList.remove("correct");
    currentIndex++;
    updateDisplay();

    if (currentIndex + 1 >= piDigits.length) {
      feedback.textContent = "You've reached one thousand digits. Get a life.";
      endRun();
    } else {
      resetInput();
    }
  }
}

function handleIncorrectInput() {
  digitInput.classList.add("incorrect");

  if (animationsEnabled) {
    setTimeout(() => {
      digitInput.classList.remove("incorrect");
      digitInput.value = "";
      digitInput.focus();
    }, 1000);
  } else {
    digitInput.classList.remove("incorrect");
    digitInput.value = "";
    digitInput.focus();
  }
}

function setupEventListeners() {
  digitInput.addEventListener("input", () => {
    if (runEnded || digitInput.value.length === 0) return;

    if (!/^\d$/.test(digitInput.value)) {
      digitInput.value = "";
      return;
    }

    const expected = piDigits[currentIndex + 1];
    const entered = digitInput.value;

    if (entered === expected) {
      handleCorrectInput();
    } else {
      handleIncorrectInput();
    }
  });

  revealBtn.addEventListener("click", () => {
    if (runEnded) return;

    const correctDigit = piDigits[currentIndex + 1];
    digitInput.value = correctDigit;

    digitInput.classList.add("correct");
    endRun();

    if (animationsEnabled) {
      setTimeout(() => {
        digitInput.classList.remove("correct");
      }, 700);
    } else {
      digitInput.classList.remove("correct");
    }
  });

  restartBtn.addEventListener("click", restart);

  showPiBtn.addEventListener("click", () => {
    piPopup.style.display = "flex";
    piDigitsPre.textContent = piDigits.slice(0, 1002);
  });

  closePiPopup.addEventListener("click", () => {
    piPopup.style.display = "none";
  });

  piPopup.addEventListener("click", (e) => {
    if (e.target === piPopup) piPopup.style.display = "none";
  });

  showInfoBtn.addEventListener("click", () => {
    infoPopup.style.display = "flex";
  });

  closeInfoPopup.addEventListener("click", () => {
    infoPopup.style.display = "none";
  });

  infoPopup.addEventListener("click", (e) => {
    if (e.target === infoPopup) infoPopup.style.display = "none";
  });

  toggleAnimationsSwitch.addEventListener("change", () => {
    animationsEnabled = toggleAnimationsSwitch.checked;
  });
}

fetch("../static/pi.txt")
  .then((response) => response.text())
  .then((text) => {
    piDigits = text.trim();
    updateDisplay();
    resetInput();
    restartBtn.style.display = "none";
    setupEventListeners();
  })
  .catch((err) => {
    feedback.textContent = "Failed to load pi digits.";
    digitInput.disabled = true;
    revealBtn.disabled = true;
  });
