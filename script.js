document.addEventListener('DOMContentLoaded', () => {
    const expenseTypeElement = document.querySelector('.tracking-text');
    const descriptionInput = document.querySelector('.input-expense-description');
    const valueInput = document.querySelector('.input-expense-value');
    const submitButton = document.querySelector('.btn-submit-expense');
    const expenseList = document.querySelector('.expense-list');
    const budgetElement = document.querySelector('#month-budget');

    const wrapper=document.querySelector('.wrapper');
    const loginLink=document.querySelector('.login-link');
    const registerLink=document.querySelector('.register-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    

    registerLink.addEventListener('click',()=>{
        wrapper.classList.add('active');
    });
    loginLink.addEventListener('click',()=>{
        wrapper.classList.remove('active');
    });
    btnPopup.addEventListener('click',()=>{
        wrapper.classList.add('active-popup');
    });
    iconClose.addEventListener('click',()=>{
        wrapper.classList.remove('active-popup');
    });

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
    function addExpenseItem(description, value, type) {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-row', 'clearfix', 'bottom-border');
        
        const descDiv = document.createElement('div');
        descDiv.classList.add('float-left');
        descDiv.innerText = `${type}: ${description}`;
    
        const valueDiv = document.createElement('div');
        valueDiv.classList.add('float-right');
        valueDiv.innerHTML = `&#36;${value.toFixed(2)}`;
    
        // Create trash icon
        const trashIcon = document.createElement('span');
        trashIcon.classList.add('icon-trash');
        trashIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'; // Trash icon
    
        // Add event listener to trash icon
        trashIcon.addEventListener('click', () => {
            // Remove item from the list
            expenseItem.remove();
    
            // Update the budget and chart
            if (type === 'Expense') {
                totalBudget += value;
                categories.Expense -= value;
            } else if (type === 'Savings') {
                totalBudget -= value;
                categories.Savings -= value;
            } else if (type === 'Investment') {
                totalBudget -= value;
                categories.Investment -= value;
            }
    
            updateBudgetDisplay();
            updatePieChart(); // Update the pie chart with the new values
        });
    
        expenseItem.appendChild(descDiv);
        expenseItem.appendChild(valueDiv);
        expenseItem.appendChild(trashIcon); // Append trash icon
        expenseList.appendChild(expenseItem);
    }
    
    function addExpenseItem(description, value, type) {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-row', 'clearfix', 'bottom-border');
        
        const descDiv = document.createElement('div');
        descDiv.classList.add('float-left');
        descDiv.innerText = `${type}: ${description}`;
    
        const valueDiv = document.createElement('div');
        valueDiv.classList.add('float-right');
        valueDiv.innerHTML = `&#36;${value.toFixed(2)}`;
    
        // Create trash icon
        const trashIcon = document.createElement('span');
        trashIcon.classList.add('icon-trash');
        trashIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'; // Trash icon
    
        // Create edit icon
        const editIcon = document.createElement('span');
        editIcon.classList.add('icon-edit');
        editIcon.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>'; // Edit icon
    
        // Add event listener to trash icon
        trashIcon.addEventListener('click', () => {
            // Remove item from the list
            expenseItem.remove();
    
            // Update the budget and chart
            if (type === 'Expense') {
                totalBudget += value;
                categories.Expense -= value;
            } else if (type === 'Savings') {
                totalBudget -= value;
                categories.Savings -= value;
            } else if (type === 'Investment') {
                totalBudget -= value;
                categories.Investment -= value;
            }
    
            updateBudgetDisplay();
            updatePieChart(); // Update the pie chart with the new values
        });
    
        // Add event listener to edit icon
        editIcon.addEventListener('click', () => {
            // Open a prompt or modal to edit the item
            const newDescription = prompt('Enter new description:', description);
            const newValue = parseFloat(prompt('Enter new value:', value));
    
            if (newDescription && !isNaN(newValue) && newValue > 0) {
                // Update item
                descDiv.innerText = `${type}: ${newDescription}`;
                valueDiv.innerHTML = `&#36;${newValue.toFixed(2)}`;
    
                // Update the budget and chart
                if (type === 'Expense') {
                    totalBudget += value - newValue;
                    categories.Expense += newValue - value;
                } else if (type === 'Savings') {
                    totalBudget += newValue - value;
                    categories.Savings += newValue - value;
                } else if (type === 'Investment') {
                    totalBudget += newValue - value;
                    categories.Investment += newValue - value;
                }
    
                // Update the item type if changed
                if (confirm('Do you want to change the type?')) {
                    const newType = prompt('Enter new type (Savings, Expense, Investment):', type);
    
                    if (newType && ['Savings', 'Expense', 'Investment'].includes(newType)) {
                        if (type === 'Expense') {
                            categories.Expense -= value;
                        } else if (type === 'Savings') {
                            categories.Savings -= value;
                        } else if (type === 'Investment') {
                            categories.Investment -= value;
                        }
    
                        if (newType === 'Expense') {
                            categories.Expense += newValue;
                        } else if (newType === 'Savings') {
                            categories.Savings += newValue;
                        } else if (newType === 'Investment') {
                            categories.Investment += newValue;
                        }
    
                        descDiv.innerText = `${newType}: ${newDescription}`;
                        type = newType; // Update type
                    }
                }
    
                updateBudgetDisplay();
                updatePieChart(); // Update the pie chart with the new values
            } else {
                alert('Please enter valid description and value.');
            }
        });
    
        expenseItem.appendChild(descDiv);
        expenseItem.appendChild(valueDiv);
        expenseItem.appendChild(editIcon); // Append edit icon
        expenseItem.appendChild(trashIcon); // Append trash icon
        expenseList.appendChild(expenseItem);
    }
    
});
