// inputs
const billInput = document.getElementById("bill");
const customTipInput = document.getElementById("custom-tip");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll("[data-tip]");

// outputs
const tipPerPersonEl = document.getElementById("tip-per-person");
const totalPerPersonEl = document.getElementById("total-per-person");

// reset
const resetButton = document.getElementById("reset");

// state
let selectedTip = null;

// tip button selection
tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tipButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedTip = parseFloat(button.dataset.tip);
    customTipInput.value = "";
    calculate();
  });
});

// custom tip input
customTipInput.addEventListener("input", () => {
  customTipInput.value = customTipInput.value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1");
  selectedTip = parseFloat(customTipInput.value) || null;
  tipButtons.forEach((button) => button.classList.remove("active"));
  calculate();
});

// bill input
billInput.addEventListener("input", () => {
  billInput.value = billInput.value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1")
    .replace(/^0+(?=\d)/, "");
  calculate();
});

billInput.addEventListener("blur", () => {
  if (billInput.value) {
    billInput.value = parseFloat(billInput.value).toFixed(2);
  }
});

// people input
peopleInput.addEventListener("input", () => {
  peopleInput.value = peopleInput.value
    .replace(/[^0-9]/g, "")
    .replace(/^0+(?=\d)/, "");
  calculate();
});

// reset
resetButton.addEventListener("click", reset);

function calculate() {
  const bill = Number(billInput.value);
  const people = Number(peopleInput.value);

  // clear error state on every calculation attempt
  peopleInput.closest(".input-group")?.classList.remove("error");

  // guard clause - only calculate when all three fields are filled
  if (
    !Number.isFinite(bill) ||
    bill <= 0 ||
    !selectedTip ||
    !Number.isFinite(people) ||
    people <= 0
  ) {
    if (Number.isFinite(people) && people <= 0 && peopleInput.value !== "") {
      peopleInput.closest(".input-group")?.classList.add("error");
    }
    tipPerPersonEl.textContent = "$0.00";
    totalPerPersonEl.textContent = "$0.00";
    return;
  }

  // calculate
  const tipAmount = (bill * (selectedTip / 100)) / people;
  const totalAmount = bill / people + tipAmount;

  // update display
  tipPerPersonEl.textContent = `$${tipAmount.toFixed(2)}`;
  totalPerPersonEl.textContent = `$${totalAmount.toFixed(2)}`;
  resetButton.classList.add("active");
}

function reset() {
  billInput.value = "";
  customTipInput.value = "";
  peopleInput.value = "";
  selectedTip = null;
  tipButtons.forEach((button) => button.classList.remove("active"));
  peopleInput.closest(".input-group")?.classList.remove("error");
  resetButton.classList.remove("active");
  tipPerPersonEl.textContent = "$0.00";
  totalPerPersonEl.textContent = "$0.00";
}
