// Personal Finance Manager - JavaScript Application

class FinanceApp {
    setupMobileMenu() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
    
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }
    
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        }
    }

    constructor() {
        this.currentPage = 'dashboard';
        this.editingTransaction = null;
        this.deleteTransactionId = null;
        this.charts = {};
        
        // Initialize data structures
        this.data = {
            transactions: [],
            budgets: {},
            settings: {
                darkMode: false
            }
        };
        
        // Sample data for demo
        this.sampleData = {
            transactions: [
                {
                    id: 1,
                    date: "2024-01-15",
                    amount: 5000,
                    category: "Salary",
                    type: "income",
                    notes: "Monthly salary"
                },
                {
                    id: 2,
                    date: "2024-01-16",
                    amount: 1200,
                    category: "Bills",
                    type: "expense",
                    notes: "Rent payment"
                },
                {
                    id: 3,
                    date: "2024-01-17",
                    amount: 150,
                    category: "Food",
                    type: "expense",
                    notes: "Groceries"
                },
                {
                    id: 4,
                    date: "2024-01-18",
                    amount: 80,
                    category: "Transport",
                    type: "expense",
                    notes: "Gas fill-up"
                },
                {
                    id: 5,
                    date: "2024-01-20",
                    amount: 200,
                    category: "Entertainment",
                    type: "expense",
                    notes: "Movie and dinner"
                }
            ],
            budgets: {
                Food: 500,
                Transport: 200,
                Entertainment: 300,
                Shopping: 400,
                Bills: 1500,
                Utilities: 200,
                Healthcare: 150,
                Other: 100
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupTheme();
        this.renderCurrentPage();
        this.updateDashboard();
        this.setDefaultDate();
    }
    
    loadData() {
        try {
            const savedData = localStorage.getItem('financeManagerData');
            if (savedData) {
                this.data = JSON.parse(savedData);
            } else {
                // Load sample data on first run
                this.data.transactions = this.sampleData.transactions;
                this.data.budgets = this.sampleData.budgets;
                this.saveData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to sample data
            this.data.transactions = this.sampleData.transactions;
            this.data.budgets = this.sampleData.budgets;
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('financeManagerData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
        
        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }
        
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSidebar();
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // Transaction form
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                this.handleTransactionSubmit(e);
            });
        }
        
        // Budget form
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                this.handleBudgetSubmit(e);
            });
        }
        
        // Cancel edit button
        const cancelEdit = document.getElementById('cancel-edit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', (e) => {
                e.preventDefault();
                this.cancelEdit();
            });
        }
        
        // Filters
        const filterCategory = document.getElementById('filter-category');
        if (filterCategory) {
            filterCategory.addEventListener('change', () => {
                this.renderTransactionsList();
            });
        }
        
        const filterType = document.getElementById('filter-type');
        if (filterType) {
            filterType.addEventListener('change', () => {
                this.renderTransactionsList();
            });
        }
        
        // CSV Export/Import
        const exportBtn = document.getElementById('export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToCSV();
            });
        }
        
        const importBtn = document.getElementById('import-csv');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('csv-file-input').click();
            });
        }
        
        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                this.importFromCSV(e);
            });
        }
        
        // Delete modal
        const cancelDelete = document.getElementById('cancel-delete');
        if (cancelDelete) {
            cancelDelete.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideDeleteModal();
            });
        }
        
        const confirmDelete = document.getElementById('confirm-delete');
        if (confirmDelete) {
            confirmDelete.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmDelete();
            });
        }
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('financeManagerTheme');
        if (savedTheme) {
            this.data.settings.darkMode = savedTheme === 'dark';
        } else {
            // Check system preference
            this.data.settings.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.applyTheme();
    }
    
    toggleTheme() {
        this.data.settings.darkMode = !this.data.settings.darkMode;
        this.applyTheme();
        this.saveData();
        localStorage.setItem('financeManagerTheme', this.data.settings.darkMode ? 'dark' : 'light');
        
        // Update charts after theme change
        setTimeout(() => {
            this.updateCharts();
        }, 100);
    }
    
    applyTheme() {
        const html = document.documentElement;
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        if (this.data.settings.darkMode) {
            html.setAttribute('data-color-scheme', 'dark');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
        } else {
            html.setAttribute('data-color-scheme', 'light');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
        }
    }
    
    navigateToPage(page) {
        if (!page) return;
        
        this.currentPage = page;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${page}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        this.renderCurrentPage();
        this.closeSidebar();
    }
    
    renderCurrentPage() {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show current page
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            currentPageElement.classList.remove('hidden');
        }
        
        // Render page-specific content
        switch (this.currentPage) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'transactions':
                this.renderTransactionsList();
                break;
            case 'budgets':
                this.renderBudgets();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar && overlay) {
            if (sidebar.classList.contains('open')) {
                this.closeSidebar();
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('show');
            }
        }
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
    
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            dateInput.value = today;
        }
    }
    
    handleTransactionSubmit(e) {
        e.preventDefault();
        
        const date = document.getElementById('transaction-date').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const category = document.getElementById('transaction-category').value;
        const typeInput = document.querySelector('input[name="transaction-type"]:checked');
        const type = typeInput ? typeInput.value : null;
        const notes = document.getElementById('transaction-notes').value;
        
        if (!date || !amount || !category || !type) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const transaction = {
            id: this.editingTransaction ? this.editingTransaction.id : Date.now(),
            date,
            amount,
            category,
            type,
            notes
        };
        
        if (this.editingTransaction) {
            // Update existing transaction
            const index = this.data.transactions.findIndex(t => t.id === this.editingTransaction.id);
            if (index !== -1) {
                this.data.transactions[index] = transaction;
            }
            this.cancelEdit();
        } else {
            // Add new transaction
            this.data.transactions.push(transaction);
        }
        
        this.saveData();
        this.updateDashboard();
        this.renderTransactionsList();
        this.renderBudgets();
        
        // Reset form
        if (!this.editingTransaction) {
            e.target.reset();
            this.setDefaultDate();
            const expenseRadio = document.querySelector('input[name="transaction-type"][value="expense"]');
            if (expenseRadio) {
                expenseRadio.checked = true;
            }
        }
    }
    
    handleBudgetSubmit(e) {
        e.preventDefault();
        
        const category = document.getElementById('budget-category').value;
        const amount = parseFloat(document.getElementById('budget-amount').value);
        
        if (!category || !amount) {
            alert('Please fill in all required fields.');
            return;
        }
        
        this.data.budgets[category] = amount;
        this.saveData();
        this.renderBudgets();
        
        // Reset form
        e.target.reset();
    }
    
    editTransaction(id) {
        const transaction = this.data.transactions.find(t => t.id === id);
        if (!transaction) return;
        
        this.editingTransaction = transaction;
        
        // Fill form with transaction data
        document.getElementById('transaction-date').value = transaction.date;
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-category').value = transaction.category;
        
        const typeRadio = document.querySelector(`input[name="transaction-type"][value="${transaction.type}"]`);
        if (typeRadio) {
            typeRadio.checked = true;
        }
        
        document.getElementById('transaction-notes').value = transaction.notes || '';
        
        // Update form UI
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('submit-btn');
        const cancelBtn = document.getElementById('cancel-edit');
        
        if (formTitle) formTitle.textContent = 'Edit Transaction';
        if (submitBtn) submitBtn.textContent = 'Update Transaction';
        if (cancelBtn) cancelBtn.style.display = 'block';
        
        // Navigate to transactions page if not already there
        if (this.currentPage !== 'transactions') {
            this.navigateToPage('transactions');
        }
        
        // Scroll to form
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    cancelEdit() {
        this.editingTransaction = null;
        
        // Reset form UI
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('submit-btn');
        const cancelBtn = document.getElementById('cancel-edit');
        
        if (formTitle) formTitle.textContent = 'Add Transaction';
        if (submitBtn) submitBtn.textContent = 'Add Transaction';
        if (cancelBtn) cancelBtn.style.display = 'none';
        
        // Reset form
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.reset();
            this.setDefaultDate();
            const expenseRadio = document.querySelector('input[name="transaction-type"][value="expense"]');
            if (expenseRadio) {
                expenseRadio.checked = true;
            }
        }
    }
    
    deleteTransaction(id) {
        this.deleteTransactionId = id;
        this.showDeleteModal();
    }
    
    showDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.deleteTransactionId = null;
    }
    
    confirmDelete() {
        if (this.deleteTransactionId) {
            this.data.transactions = this.data.transactions.filter(t => t.id !== this.deleteTransactionId);
            this.saveData();
            this.updateDashboard();
            this.renderTransactionsList();
            this.renderBudgets();
            this.hideDeleteModal();
        }
    }
    
    updateDashboard() {
        const totalIncome = this.data.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.data.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netBalance = totalIncome - totalExpenses;
        const transactionCount = this.data.transactions.length;
        
        const totalIncomeEl = document.getElementById('total-income');
        const totalExpensesEl = document.getElementById('total-expenses');
        const netBalanceEl = document.getElementById('net-balance');
        const transactionCountEl = document.getElementById('transaction-count');
        
        if (totalIncomeEl) totalIncomeEl.textContent = `₹${totalIncome.toLocaleString()}`;
        if (totalExpensesEl) totalExpensesEl.textContent = `₹${totalExpenses.toLocaleString()}`;
        if (netBalanceEl) netBalanceEl.textContent = `₹${netBalance.toLocaleString()}`;
        if (transactionCountEl) transactionCountEl.textContent = transactionCount.toString();
        
        this.renderDashboardCharts();
        this.renderRecentTransactions();
    }
    
    renderDashboardCharts() {
        this.renderCashflowChart('cashflow-chart');
        this.renderExpensePieChart('expense-pie-chart');
    }
    
    updateCharts() {
        // Destroy all existing charts
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                delete this.charts[key];
            }
        });
        
        // Re-render based on current page
        if (this.currentPage === 'dashboard') {
            this.renderDashboardCharts();
        } else if (this.currentPage === 'analytics') {
            this.renderAnalytics();
        }
    }
    
    renderCashflowChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        // Get monthly data
        const monthlyData = this.getMonthlyData();
        const months = Object.keys(monthlyData).sort();
        
        const incomeData = months.map(month => monthlyData[month].income);
        const expenseData = months.map(month => monthlyData[month].expenses);
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months.map(month => {
                    const date = new Date(month + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }),
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderExpensePieChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        // Get expense data by category
        const expensesByCategory = {};
        this.data.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });
        
        const categories = Object.keys(expensesByCategory);
        const amounts = Object.values(expensesByCategory);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
        
        if (categories.length === 0) {
            // Show empty chart message
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No expense data available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors.slice(0, categories.length),
                    borderWidth: 2,
                    borderColor: this.data.settings.darkMode ? '#1f2121' : '#fcfcf9'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    getMonthlyData() {
        const monthlyData = {};
        
        this.data.transactions.forEach(transaction => {
            const month = transaction.date.substring(0, 7); // YYYY-MM
            
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'income') {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expenses += transaction.amount;
            }
        });
        
        return monthlyData;
    }
    
    renderRecentTransactions() {
        const recentTransactions = this.data.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const container = document.getElementById('recent-transactions');
        if (!container) return;
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state">No transactions yet. Add your first transaction to get started!</div>';
            return;
        }
        
        container.innerHTML = recentTransactions.map(transaction => `
            <div class="recent-transaction">
                <div class="recent-transaction__info">
                    <div class="flex justify-between items-center">
                        <div class="recent-transaction__category">${transaction.category}</div>
                        <div class="recent-transaction__amount ${transaction.type === 'income' ? 'amount-income' : 'amount-expense'}">
                            ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
                        </div>
                    </div>
                    <div class="recent-transaction__notes">${transaction.notes || 'No notes'}</div>
                    <div class="recent-transaction__date">${new Date(transaction.date).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }
    
    renderTransactionsList() {
        const categoryFilter = document.getElementById('filter-category');
        const typeFilter = document.getElementById('filter-type');
        
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const typeValue = typeFilter ? typeFilter.value : '';
        
        let filteredTransactions = this.data.transactions;
        
        if (categoryValue) {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryValue);
        }
        
        if (typeValue) {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeValue);
        }
        
        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const tbody = document.getElementById('transactions-table');
        if (!tbody) return;
        
        if (filteredTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-text-secondary">No transactions found</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredTransactions.map(transaction => `
            <tr>
                <td class="py-3 px-2">${new Date(transaction.date).toLocaleDateString()}</td>
                <td class="py-3 px-2">
                    <span class="status-badge status-badge--${transaction.type}">${transaction.category}</span>
                </td>
                <td class="py-3 px-2">
                    <span class="${transaction.type === 'income' ? 'amount-income' : 'amount-expense'}">
                        ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
                    </span>
                </td>
                <td class="py-3 px-2">${transaction.notes || 'No notes'}</td>
                <td class="py-3 px-2">
                    <button class="action-btn action-btn--edit" onclick="app.editTransaction(${transaction.id})">
                        Edit
                    </button>
                    <button class="action-btn action-btn--delete" onclick="app.deleteTransaction(${transaction.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    renderBudgets() {
        const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
        
        // Calculate current month spending by category
        const monthlySpending = {};
        this.data.transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
            .forEach(t => {
                monthlySpending[t.category] = (monthlySpending[t.category] || 0) + t.amount;
            });
        
        const container = document.getElementById('budget-progress');
        if (!container) return;
        
        const budgetCategories = Object.keys(this.data.budgets);
        
        if (budgetCategories.length === 0) {
            container.innerHTML = '<div class="empty-state">No budgets set. Set your first budget to start tracking!</div>';
            return;
        }
        
        container.innerHTML = budgetCategories.map(category => {
            const budget = this.data.budgets[category];
            const spent = monthlySpending[category] || 0;
            const percentage = Math.min((spent / budget) * 100, 100);
            const isOverBudget = spent > budget;
            const remaining = budget - spent;
            
            return `
                <div class="budget-item">
                    <div class="budget-item__header">
                        <div class="budget-item__title">${category}</div>
                        <div class="budget-item__amount ${isOverBudget ? 'budget-warning' : ''}">
                            ₹${spent.toLocaleString()} / ₹${budget.toLocaleString()}
                            ${isOverBudget ? ' (Over budget!)' : ''}
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar__fill ${isOverBudget ? 'progress-bar__fill--danger' : percentage > 80 ? 'progress-bar__fill--warning' : ''}" 
                             style="width: ${percentage}%"></div>
                    </div>
                    <div class="text-xs text-text-secondary mt-2">
                        ${isOverBudget ? 
                            `₹${Math.abs(remaining).toLocaleString()} over budget` : 
                            `₹${remaining.toLocaleString()} remaining`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderAnalytics() {
        this.renderExpensePieChart('analytics-expense-chart');
        this.renderCashflowChart('analytics-trend-chart');
    }
    
    exportToCSV() {
        if (this.data.transactions.length === 0) {
            alert('No transactions to export.');
            return;
        }
        
        const headers = ['Date', 'Category', 'Amount', 'Type', 'Notes'];
        const csvData = [
            headers,
            ...this.data.transactions.map(t => [
                t.date,
                t.category,
                t.amount,
                t.type,
                t.notes || ''
            ])
        ];
        
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    importFromCSV(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    alert('Error parsing CSV file. Please check the format.');
                    console.error('CSV parse errors:', results.errors);
                    return;
                }
                
                let importCount = 0;
                
                results.data.forEach((row, index) => {
                    if (row.Date && row.Category && row.Amount && row.Type) {
                        const transaction = {
                            id: Date.now() + importCount,
                            date: row.Date,
                            amount: parseFloat(row.Amount),
                            category: row.Category,
                            type: row.Type.toLowerCase(),
                            notes: row.Notes || ''
                        };
                        
                        // Validate transaction
                        if (transaction.amount > 0 && ['income', 'expense'].includes(transaction.type)) {
                            this.data.transactions.push(transaction);
                            importCount++;
                        }
                    }
                });
                
                if (importCount > 0) {
                    this.saveData();
                    this.updateDashboard();
                    this.renderTransactionsList();
                    this.renderBudgets();
                    alert(`Successfully imported ${importCount} transactions.`);
                } else {
                    alert('No valid transactions found in the CSV file.');
                }
                
                // Clear file input
                event.target.value = '';
            },
            error: (error) => {
                console.error('CSV parse error:', error);
                alert('Error reading CSV file.');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinanceApp();
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.app && window.app.charts) {
        Object.values(window.app.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }
});
