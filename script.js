let displayElement = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function appendCharacter(character) {
    if (shouldResetDisplay) {
        currentInput = character;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && character !== '.') {
            currentInput = character;
        } else {
            currentInput += character;
        }
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function setOperator(op) {
    if (operator !== null) {
        calculateResult();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculateResult() {
    if (operator === null || shouldResetDisplay) {
        return;
    }
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Division by zero is not allowed');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function updateDisplay() {
    displayElement.textContent = currentInput;
}
