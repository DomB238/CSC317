const display = document.getElementById("display");

let current = "0";
let previous = null;
let operator = null;
let shouldReset = false;
let memory = 0;

function updateDisplay() {
  display.textContent = current;
  updateMemoryIndicator();
}

function handleNumber(num) {
  if (shouldReset) {
    current = num === "." ? "0." : num;
    shouldReset = false;
  } else if (num === "." && current.includes(".")) {
    return;
  } else if (current === "0" && num !== ".") {
    current = num;
  } else {
    current += num;
  }
}

function handleOperator(op) {
  if (operator && previous !== null && !shouldReset) {
    calculate();
  }
  operator = op;
  previous = current;
  shouldReset = true;
}

function calculate() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;

  switch (operator) {
    case "add":
      current = (prev + curr).toString();
      break;
    case "subtract":
      current = (prev - curr).toString();
      break;
    case "multiply":
      current = (prev * curr).toString();
      break;
    case "divide":
      current = curr === 0 ? "Error" : (prev / curr).toString();
      break;
  }

  operator = null;
  previous = null;
  shouldReset = true;
}

function handleSpecial(action) {
  switch (action) {
    case "clear":
      current = "0";
      previous = null;
      operator = null;
      break;
    case "sign":
      current = (parseFloat(current) * -1).toString();
      break;
    case "percent":
      current = (parseFloat(current) / 100).toString();
      break;
    case "equals":
      calculate();
      break;
  }
}

// Memory Indicator
document.querySelectorAll(".memory").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.memory;
    const currValue = parseFloat(current);

    switch (action) {
      case "mc":
        memory = 0;
        break;
      case "mr":
        current = memory.toString();
        shouldReset = true;
        break;
      case "mplus":
        if (!isNaN(currValue)) memory += currValue;
        break;
      case "mminus":
        if (!isNaN(currValue)) memory -= currValue;
        break;
    }

    updateDisplay();
  });
});

// Button handling
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const action = button.dataset.action;

    if (number !== undefined) {
      handleNumber(number);
    } else if (action) {
      if (["add", "subtract", "multiply", "divide"].includes(action)) {
        handleOperator(action);
      } else {
        handleSpecial(action);
      }
    }

    updateDisplay();
  });
});

// Bonus: Keyboard support
document.addEventListener("keydown", e => {
  const key = e.key;
  const operators = { "+": "add", "-": "subtract", "*": "multiply", "/": "divide" };

  if (!isNaN(key)) handleNumber(key);
  else if (key === ".") handleNumber(".");
  else if (operators[key]) handleOperator(operators[key]);
  else if (key === "Enter" || key === "=") handleSpecial("equals");
  else if (key === "Backspace" || key === "Escape") handleSpecial("clear");

  updateDisplay();
});

// Theme Toggle
const toggle = document.getElementById("theme-toggle-checkbox");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("calcTheme", document.body.classList.contains("light") ? "light" : "dark");
  });

  window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("calcTheme");
    if (savedTheme === "light") {
      document.body.classList.add("light");
      toggle.checked = true;
    }
  });
}