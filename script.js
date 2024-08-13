document.addEventListener('DOMContentLoaded', () => {
    // Elements for expense tracking
    const expenseTypeElement = document.querySelector('.tracking-text');
    const descriptionInput = document.querySelector('.input-expense-description');
    const valueInput = document.querySelector('.input-expense-value');
    const dateInput = document.querySelector('.input-expense-date'); // Date input element
    const submitButton = document.querySelector('.btn-submit-expense');
    const expenseList = document.querySelector('.expense-list');
    const budgetElement = document.querySelector('#month-budget');
    const downloadButton = document.querySelector('#download-button');

    // Elements for login and registration forms
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const iconClose = document.querySelector('.icon-close');
    const aboutLink = document.getElementById('about-link');
    const contactLink = document.getElementById('contact-link');

    const loginForm = document.querySelector('.login-form'); // Assuming login form is defined with this class
    const registerForm = document.querySelector('.register-form'); // Assuming register form is defined with this class

    // User accounts object
    const userAccounts = {};

    // Initialize current type and total budget
    let currentType = 'Savings';
    let totalBudget = 0;

    // Initialize categories for the pie chart
    const categories = {
        Savings: 0,
        Expense: 0,
        Investment: 0
    };

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

    // Set default date to today's date
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Array to store expense items
    const expenses = [];

    // Function to update the displayed budget
    function updateBudgetDisplay() {
        budgetElement.innerHTML = `&#36;${totalBudget.toFixed(2)}`;
    }

    // Function to update the pie chart
    function updatePieChart() {
        pieChart.data.datasets[0].data = [
            categories.Savings,
            categories.Expense,
            categories.Investment
        ];
        pieChart.update();
    }

    // Function to update the download button visibility
    function updateDownloadButtonVisibility() {
        downloadButton.style.display = expenses.length > 0 ? 'block' : 'none';
    }

    // Function to handle user registration
    function registerUser(username, password) {
        if (userAccounts[username]) {
            alert('Username already exists. Please choose another.');
        } else {
            userAccounts[username] = { password, items: [] };
            alert('Registration successful. Please login.');
            loginLink.click(); // Switch to login form
        }
    }

    // Function to handle user login
    function loginUser(username, password) {
        const user = userAccounts[username];
        if (user && user.password === password) {
            alert('Login successful!');
            wrapper.classList.remove('active-popup');
            loadUserItems(username);
        } else {
            alert('Invalid username or password.');
        }
    }

    // Load user items
    function loadUserItems(username) {
        const user = userAccounts[username];
        if (user) {
            expenseList.innerHTML = ''; // Clear current list
            user.items.forEach(item => {
                addExpenseItem(item.description, item.value, item.type, item.date);
            });
            updateDownloadButtonVisibility(); // Update the download button visibility
        }
    }

    // Function to add an expense item to the list and array
    function addExpenseItem(description, value, type, date) {
        const expenseItem = {
            type,
            description,
            value,
            date
        };

        // Add to expenses array
        expenses.push(expenseItem);

        // Create DOM elements for display
        const expenseRow = document.createElement('div');
        expenseRow.classList.add('expense-row', 'clearfix', 'bottom-border');

        const descDiv = document.createElement('div');
        descDiv.classList.add('float-left');
        descDiv.innerText = `${type}: ${description}`;

        const valueDiv = document.createElement('div');
        valueDiv.classList.add('float-right');
        valueDiv.innerHTML = `&#36;${value.toFixed(2)}`;

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('float-left');
        dateDiv.innerText = `Date: ${date}`;

        // Create trash icon
        const trashIcon = document.createElement('span');
        trashIcon.classList.add('icon-trash');
        trashIcon.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';

        // Create edit icon
        const editIcon = document.createElement('span');
        editIcon.classList.add('icon-edit');
        editIcon.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>';

        // Add event listener to trash icon
        trashIcon.addEventListener('click', () => {
            // Remove item from the list and array
            const index = expenses.indexOf(expenseItem);
            if (index > -1) {
                expenses.splice(index, 1);
            }
            expenseRow.remove();

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
            updatePieChart();
            updateDownloadButtonVisibility();
        });

        // Add event listener to edit icon
        editIcon.addEventListener('click', () => {
            // Open a prompt or modal to edit the item
            const newDescription = prompt('Enter new description:', description);
            const newValue = parseFloat(prompt('Enter new value:', value));
            const newDate = prompt('Enter new date (YYYY-MM-DD):', date);

            if (newDescription && !isNaN(newValue) && newValue > 0 && newDate) {
                // Update item
                descDiv.innerText = `${type}: ${newDescription}`;
                valueDiv.innerHTML = `&#36;${newValue.toFixed(2)}`;
                dateDiv.innerText = `Date: ${newDate}`; // Update date

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
                alert('Please enter valid description, value, and date.');
            }
        });

        // Append elements
        expenseRow.appendChild(descDiv);
        expenseRow.appendChild(valueDiv);
        expenseRow.appendChild(dateDiv);
        expenseRow.appendChild(editIcon); // Append edit icon
        expenseRow.appendChild(trashIcon); // Append trash icon
        expenseList.appendChild(expenseRow);

        updateDownloadButtonVisibility();
    }

    // Function to download data as Excel
    function downloadExcel() {
        const data = expenses.map(item => [item.type, item.description, item.value, item.date]);
        const ws = XLSX.utils.aoa_to_sheet([['Type', 'Description', 'Value', 'Date'], ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
        XLSX.writeFile(wb, 'expenses.xlsx');
    }

    // Handle button clicks for expense type
    document.querySelectorAll('.type-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            currentType = button.innerText;
            expenseTypeElement.innerText = `Tracking ${currentType}`;
        });
    });

    // Handle expense submission
    submitButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const value = parseFloat(valueInput.value.trim());
        const date = dateInput.value; // Get the date

        if (description && !isNaN(value) && value > 0 && date) {
            addExpenseItem(description, value, currentType, date);
            descriptionInput.value = '';
            valueInput.value = '';
            dateInput.value = today; // Reset to default date

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

            // Show download button if not already visible
            updateDownloadButtonVisibility();
        } else {
            alert('Please enter a valid description, value, and date.');
        }
    });

    // Show registration form when "About" link is clicked
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        wrapper.classList.add('active-popup');
        wrapper.classList.add('active'); // Show registration form
        loginForm.style.transform = 'translateX(-400px)';
        registerForm.style.transform = 'translateX(0)';
    });

    // Show login form when "Contact" link is clicked
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active'); // Ensure registration is not shown
        loginForm.style.transform = 'translateX(0)';
        registerForm.style.transform = 'translateX(400px)';
    });

    // Close the form when the close button is clicked
    iconClose.addEventListener('click', function() {
        wrapper.classList.remove('active-popup');
    });

    // Switch to registration form from login
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        wrapper.classList.add('active');
        loginForm.style.transform = 'translateX(-400px)';
        registerForm.style.transform = 'translateX(0)';
    });

    // Switch to login form from registration
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        wrapper.classList.remove('active');
        loginForm.style.transform = 'translateX(0)';
        registerForm.style.transform = 'translateX(400px)';
    });

    // Handle download button click
    downloadButton.addEventListener('click', downloadExcel);
});
