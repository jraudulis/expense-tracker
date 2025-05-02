const container = document.getElementById('container');
const startBudgetUi = document.getElementById('starting-budget');
const addBudgetContainer = document.querySelector('.budget');
const remainingBalance = document.getElementById('remaining-balance');
const startBudgetInput = document.getElementById('starting-budget-input');
const addBudgetBtn = document.getElementById('add-budget');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');
const expenseListContainer = document.getElementById('expense-list');

// Global variables
let startingBudget = 0;
let expenses = [];

// Function for number convertion tu currency
function convertToCurrency(number) {
    return number.toLocaleString("en-GB", {style:"currency", currency:"GBP"});
}

// Add budget amount and after UI update hide input field
function addBudget() {
    startingBudget = Number(startBudgetInput.value);

    if( startingBudget <= 0 || isNaN(startingBudget) || startingBudget > 1e9 ) {
        return displayErrorMessage('Please enter budget or realistic budget');
    } else {
        startBudgetUi.textContent = convertToCurrency(startingBudget);
        remainingBalance.textContent = convertToCurrency(startingBudget);
        startBudgetInput.value = '';
        addBudgetContainer.style.display = 'none';
    }
}

// Add expense name and amount and push to array where it's stored
function addExpenses () {
    let expenseName = expenseNameInput.value;
    let expenseAmount = Number(expenseAmountInput.value);


    if ( startingBudget <= 0 || isNaN(startingBudget) ) {
        return displayErrorMessage('Please enter budget first');

    } else if ( expenseName === '' || expenseAmount <= 0 || isNaN(expenseAmount) ) {
        return displayErrorMessage('Please enter expense name and amount');
        
    } else {
        let expenseObj = {
            name: expenseName,
            amount: expenseAmount,
            date: new Date().toLocaleDateString('en-GB')
        }
        expenses.push(expenseObj);

        expenseNameInput.value = '';
        expenseAmountInput.value = '';

        updateExpenseList();
    }
    console.log(expenses);
}

function subtractFromBalance() {

    // Use reduce method to itirate over array and sum all the expeneses and subtract from the balance
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const remainingBalanceValue = startingBudget - totalExpenses;
    // update UI with new balance value
    remainingBalance.textContent = convertToCurrency(remainingBalanceValue);
}

// Add items to list with time stamp and deducdet amount
function updateExpenseList() {
    expenseListContainer.innerHTML = '';
// loop over expense array and extract name and amount values
    expenses.forEach((expense) =>{
        // create dive element which wille be populated with name, timestamp and deducted amount spans
        const div = document.createElement('div');
        div.classList.add('expense-item');
        // Name and timestamp span
        const expenseListName = document.createElement('span');
        expenseListName.classList.add('expense-name');
        expenseListName.appendChild(document.createTextNode(expense.name + ' - ' + expense.date));
        // Deducted amount span with convertToCurrency helper function to change number in to currency
        const expenseListAmount = document.createElement('span');
        expenseListAmount.classList.add('expense-amount');
        expenseListAmount.appendChild(document.createTextNode('- ' + convertToCurrency(expense.amount)));
        // populate both spans to div and the div to container
        div.appendChild(expenseListName);
        div.appendChild(expenseListAmount);
        expenseListContainer.appendChild(div);

    });

    // function call after loop to do the math for remaining balance based on added expense
    subtractFromBalance();
}

// Error message
function displayErrorMessage(error) {
    // Selecgt toast class and if it's already active remove it
    const existingMessage = document.querySelector('.toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    // create div element and add predefined CSS classes with styling
    const div = document.createElement('div');
    div.className = 'toast toast-error';
    const message = document.createTextNode(error);
    div.appendChild(message);
    container.appendChild(div);
    // Set 10ms timer delay for animation it gives time browser to insert content in to DOM otherwise animation might not work properly
    setTimeout(() => div.classList.add('show'), 10);
    // Set 3s timer after which .show class is removed and div will be hidden. And again 300ms delay before element is fully removed from DOM for animation display purposes
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 3000); 
}





addBudgetBtn.addEventListener('click', addBudget);
addExpenseBtn.addEventListener('click', addExpenses);