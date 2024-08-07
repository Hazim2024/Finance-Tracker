document.addEventListener('DOMContentLoaded', () => {
    const expenseTypeElement = document.querySelector('.tracking-text');
    const descriptionInput = document.querySelector('.input-expense-description');
    const valueInput = document.querySelector('.input-expense-value');
    const submitButton = document.querySelector('.btn-submit-expense');
    const expenseList = document.querySelector('.expense-list');
    const budgetElement = document.querySelector('#month-budget');
    let currentType = 'Savings';
    let totalBudget = 0;

    // Initialize categories for the pie chart
    const categories = {
        Savings: 0,
        Expense: 0,
        Investment: 0
    };

    // Function to update the displayed budget
    function updateBudgetDisplay() {
        budgetElement.innerHTML = `&#36;${totalBudget.toFixed(2)}`;
    }

    // Initialize the pie chart
    const ctx = document.getElementById('expense-chart').getContext('2d');
    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Savings', 'Expense', 'Investment'],
            datasets: [{
                data: [categories.Savings, categories.Expense, categories.Investment],
                backgroundColor: ['#4CAF50', '#FF5733', '#FFC300']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Function to update the pie chart
    function updatePieChart() {
        pieChart.data.datasets[0].data = [
            categories.Savings,
            categories.Expense,
            categories.Investment
        ];
        pieChart.update();
    }

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

            // Update total budget
            if (currentType === 'Expense') {
                totalBudget -= value;
                categories.Expense += value;
            } else if (currentType === 'Savings') {
                totalBudget += value;
                categories.Savings += value;
            } else if (currentType === 'Investment') {
                totalBudget += value;
                categories.Investment += value;
            }

            updateBudgetDisplay();
            updatePieChart(); // Update the pie chart with the new values
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
