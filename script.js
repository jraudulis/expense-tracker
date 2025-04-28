const startBudgetUi = document.getElementById('starting-budget');
const remainingBalance = document.getElementById('remaining-balance');
const startBudgetInput = document.getElementById('starting-budget-input');
const addBudgetBtn = document.getElementById('add-budget');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');

let startingBudget = 0;
let expenses = [];

function convertToCurrency(number) {
    return number.toLocaleString("en-GB", {style:"currency", currency:"GBP"});
}

function addBudget() {
    startingBudget = Number(startBudgetInput.value);

    if( startingBudget <= 0 || isNaN(startingBudget) ) {
        alert('Please enter your starting budget');
    } else {
        startBudgetUi.textContent = convertToCurrency(startingBudget);
        remainingBalance.textContent = convertToCurrency(startingBudget);
    }

    startBudgetInput.value = '';
    
}

function addExpenses () {
    let expenseName = expenseNameInput.value;
    let expenseAmount = Number(expenseAmountInput.value);

    if( expenseName === '' || expenseAmount <= 0 || isNaN(expenseAmount) ) {
        alert('Enter expense name and valid ammount');
    } else {
        let expenseObj = {
            name: `${expenseName}`,
            amount: `${expenseAmount}`
        }

        expenses.push(expenseObj);
    }
    updateExpenseList();

    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

function updateExpenseList() {
    expenses.forEach((expense) =>{
        console.log(expense.name, expense.amount);
    })
}






addBudgetBtn.addEventListener('click', addBudget);
addExpenseBtn.addEventListener('click', addExpenses);