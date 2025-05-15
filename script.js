const container = document.getElementById('container');
const startBudgetUi = document.getElementById('starting-budget');
const addBudgetContainer = document.querySelector('.budget');
const balanceContainer = document.querySelector('.balance-container');
const remainingBalance = document.getElementById('remaining-balance');
const budgetBar = document.getElementById('budget-bar');
const budgetBarContainer = document.querySelector('.budget-bar-container');
const startBudgetInput = document.getElementById('starting-budget-input');
const addBudgetBtn = document.getElementById('add-budget');
const resetBtn = document.getElementById('reset');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');
const expenseListContainer = document.getElementById('expense-list');

// Global variables
let startingBudget = 0;
let balance
let expenses = [];
let hasWarnedOverHalf = false;
let hasWarnedNegative = false;

// Function for number convertion tu currency
function convertToCurrency(number) {
    return number.toLocaleString("en-GB", {style:"currency", currency:"GBP"});
}

function createTotalSpentDiv() {

    const totalElement = document.querySelector('.total');

    if ( !totalElement ) {
        const div = document.createElement('div');
    div.classList.add('expense-item');

    const title = document.createElement('span');
    title.classList.add('total-name');
    title.appendChild(document.createTextNode('Total Spent'));

    let total = document.createElement('span');
    total.classList.add('total');
    total.appendChild(document.createTextNode(convertToCurrency(0)));

    div.appendChild(title);
    div.appendChild(total);
    expenseListContainer.appendChild(div);

    }
}

function calculateTotalSpent(amount) {
    const totalSpent = document.querySelector('.total');
    totalSpent.textContent = convertToCurrency(amount);
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
        
    } else if ( balance <= 0) {
       let confirmation = confirm('You are away to overspend your budget and have negative balance');
       if ( confirmation === false) {
          return;
       }
    }
      else {
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
}

function updateBudgetBar(balance){
    
    const budgetBarPercentage = ( balance / startingBudget) * 100;
    budgetBar.style.width = `${budgetBarPercentage}%`

    if ( budgetBarPercentage <= 0 ) {
        budgetBar.style.width = '100%';
        budgetBar.style.backgroundColor = '#EF4444';
        return;
    } else if ( budgetBarPercentage < 30 ) {
        budgetBar.style.backgroundColor = '#EF4444';
    } else if ( budgetBarPercentage < 50 ) {
        budgetBar.style.backgroundColor = '#FACC15'
    } else {
        budgetBar.style.backgroundColor = '#22C55E'
    }

}

function subtractFromBalance() {

    // Use reduce method to itirate over array and sum all the expeneses and subtract from the balance
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const remainingBalanceValue = startingBudget - totalExpenses;
    calculateTotalSpent(totalExpenses);
    balance = remainingBalanceValue;

    if ( remainingBalanceValue < 0 && !hasWarnedNegative ) {
        displayErrorMessage('You have overspent your budget');
        hasWarnedNegative = true;
    } else if (  totalExpenses > startingBudget / 2 && !hasWarnedOverHalf  ) {
        displayErrorMessage('You have spent half of your budget');
        hasWarnedOverHalf = true;
    }
    // update UI with new balance value
    remainingBalance.textContent = convertToCurrency(remainingBalanceValue);
    updateBudgetBar(remainingBalanceValue);
}

// Add items to list with time stamp and deducdet amount
function updateExpenseList() {
    expenseListContainer.innerHTML = '';

    createTotalSpentDiv();
// loop over expense array in reversed order to display newest item at top of the list and extract name and amount values
    expenses.slice().reverse().forEach((expense) =>{
        // create dive element which will be populated with name, timestamp and deducted amount spans
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

function resetApp(){
    startingBudget = 0;
    startBudgetUi.textContent = convertToCurrency(0);
    remainingBalance.textContent = convertToCurrency(0);

    expenses.length = 0;
    expenseListContainer.innerHTML = '';
    budgetBar.style.width = '0%';
    budgetBar.style.backgroundColor = '';
    addBudgetContainer.style.display = 'flex';
    hasWarnedOverHalf = false;
    hasWarnedNegative = false;
}



addBudgetBtn.addEventListener('click', addBudget);
addExpenseBtn.addEventListener('click', addExpenses);
resetBtn.addEventListener('click', resetApp);