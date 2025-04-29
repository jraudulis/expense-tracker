const startBudgetUi = document.getElementById('starting-budget');
const remainingBalance = document.getElementById('remaining-balance');
const startBudgetInput = document.getElementById('starting-budget-input');
const addBudgetBtn = document.getElementById('add-budget');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');
const expenseListContainer = document.getElementById('expense-list');

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
            name: expenseName,
            amount: expenseAmount
        }

        expenses.push(expenseObj);
    }
    updateExpenseList();

    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

function updateExpenseList() {
    expenseListContainer.innerHTML = '';

    expenses.forEach((expense) =>{

        const div = document.createElement('div');
        div.classList.add('expense-item');

        const expenseListName = document.createElement('span');
        expenseListName.classList.add('expense-name');
        expenseListName.appendChild(document.createTextNode(expense.name));

        const expenseListAmount = document.createElement('span');
        expenseListAmount.classList.add('expense-amount');
        expenseListAmount.appendChild(document.createTextNode('- ' + convertToCurrency(expense.amount)));

        div.appendChild(expenseListName);
        div.appendChild(expenseListAmount);

        expenseListContainer.appendChild(div);

    })
}






addBudgetBtn.addEventListener('click', addBudget);
addExpenseBtn.addEventListener('click', addExpenses);