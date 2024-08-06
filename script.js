document.addEventListener('DOMContentLoaded', () => {
    const expenseTypeElement = document.querySelector('.tracking-text');
    const descriptionInput = document.querySelector('.input-expense-description');
    const valueInput = document.querySelector('.input-expense-value');
    const submitButton = document.querySelector('.btn-submit-expense');
    const expenseList = document.querySelector('.expense-list');
    let currentType = 'Savings';

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            currentType = item.innerText;
            expenseTypeElement.innerText = `Tracking ${currentType}`;
        });
    });

    submitButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const value = parseFloat(valueInput.value.trim());

        if (description && !isNaN(value) && value > 0) {
            addExpenseItem(description, value, currentType);
            descriptionInput.value = '';
            valueInput.value = '';
        } else {
            alert('Please enter a valid description and value.');
        }
    });

    function addExpenseItem(description, value, type) {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-row', 'clearfix', 'bottom-border');
        
        const descDiv = document.createElement('div');
        descDiv.classList.add('float-left');
        descDiv.innerText = `${type}: ${description}`;

        const valueDiv = document.createElement('div');
        valueDiv.classList.add('float-right');
        valueDiv.innerHTML = `&#36;${value.toFixed(2)}`;

        expenseItem.appendChild(descDiv);
        expenseItem.appendChild(valueDiv);
        expenseList.appendChild(expenseItem);
        
    }
});

