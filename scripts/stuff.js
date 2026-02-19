const piSequence = document.getElementById('pi-sequence');
const digitInput = document.getElementById('digit-input');
const digitCounter = document.getElementById('digit-counter');
const feedback = document.getElementById('feedback');
const revealBtn = document.getElementById('reveal-btn');
const restartBtn = document.getElementById('restart-btn');
const showPiBtn = document.getElementById('show-pi-btn');
const piPopup = document.getElementById('pi-popup');
const piPopupContent = document.getElementById('pi-popup-content');
const closePiPopup = document.getElementById('close-pi-popup');
const piDigitsPre = document.getElementById('pi-digits');

let piDigits = "";
let currentIndex = 3;
let runEnded = false;

function updateDisplay() {
    piSequence.textContent = piDigits.slice(0, currentIndex + 1);
    digitCounter.textContent = `Digits Entered: ${currentIndex - 1}`;
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
    restartBtn.style.display = "inline-block";
}

function restart() {
    currentIndex = 3;
    runEnded = false;
    feedback.textContent = "";
    revealBtn.disabled = false;
    restartBtn.style.display = "none";
    updateDisplay();
    resetInput();
}

function handleCorrectInput() {
    digitInput.classList.add("correct");
    setTimeout(() => {
        digitInput.classList.remove("correct");
        currentIndex++;
        updateDisplay();
        if (currentIndex + 1 >= piDigits.length) {
            feedback.textContent = "You've reached the end!";
            endRun();
        } else {
            resetInput();
        }
    }, 300);
}

function handleIncorrectInput() {
    digitInput.classList.add("incorrect");
    setTimeout(() => {
        digitInput.classList.remove("incorrect");
        digitInput.value = "";
        digitInput.focus();
    }, 1000);
}

function setupEventListeners() {
    digitInput.addEventListener('input', () => {
        if (runEnded || digitInput.value.length === 0) return;
        const expected = piDigits[currentIndex + 1];
        const entered = digitInput.value;
        if (entered === expected) {
            handleCorrectInput();
        } else {
            handleIncorrectInput();
        }
    });

    revealBtn.addEventListener('click', () => {
        if (runEnded) return;
        const correctDigit = piDigits[currentIndex + 1];
        digitInput.value = correctDigit;
        digitInput.classList.add("correct");
        endRun();
        setTimeout(() => {
            digitInput.classList.remove("correct");
        }, 700);
    });

    restartBtn.addEventListener('click', restart);

    showPiBtn.addEventListener('click', () => {
        piPopup.style.display = "flex";
        piDigitsPre.textContent = piDigits.slice(0, 1002);
    });

    closePiPopup.addEventListener('click', () => {
        piPopup.style.display = "none";
    });

    piPopup.addEventListener('click', (e) => {
        if (e.target === piPopup) piPopup.style.display = "none";
    });
}

fetch('../static/pi.txt')
    .then(response => response.text())
    .then(text => {
        piDigits = text.trim();
        updateDisplay();
        resetInput();
        restartBtn.style.display = "none";
        setupEventListeners();
    })
    .catch(err => {
        feedback.textContent = "Failed to load pi digits.";
        digitInput.disabled = true;
        revealBtn.disabled = true;
    });