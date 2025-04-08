// dashboard.js - Main dashboard functionality

// Demo data for contracts
const demoContracts = [
    {
        id: 'CTR-2023-001',
        title: 'Service Agreement with XYZ Corp',
        status: 'For Approval',
        expiryDate: '2025-06-30',
        value: 25000,
        parties: 'XYZ Corp',
        owner: 'El sidof',
        creationDate: '2023-07-01',
        lastUpdated: '2023-07-15'
    },
    {
        id: 'CTR-2023-002',
        title: 'Software License Agreement',
        status: 'Sent',
        expiryDate: '2025-12-31',
        value: 5000,
        parties: 'ABC Software Inc.',
        owner: 'El Jidof',
        creationDate: '2023-08-15',
        lastUpdated: '2023-08-20'
    },
    {
        id: 'CTR-2023-003',
        title: 'Consulting Service Contract',
        status: 'Viewed',
        expiryDate: '2025-10-15',
        value: 12000,
        parties: 'ConsultPro LLC',
        owner: 'John Smith',
        creationDate: '2023-06-01',
        lastUpdated: '2023-06-10'
    },
    {
        id: 'CTR-2023-004',
        title: 'Office Lease Agreement',
        status: 'Completed',
        expiryDate: '2026-05-31',
        value: 36000,
        parties: 'Property Management Inc.',
        owner: 'Sarah Johnson',
        creationDate: '2023-06-01',
        lastUpdated: '2023-06-05'
    },
    {
        id: 'CTR-2023-005',
        title: 'Marketing Services Agreement',
        status: 'Expired',
        expiryDate: '2024-01-31',
        value: 8500,
        parties: 'MarketBoost Agency',
        owner: 'Jane Doe',
        creationDate: '2023-02-01',
        lastUpdated: '2023-02-10'
    },
    {
        id: 'CTR-2023-006',
        title: 'Equipment Purchase Agreement',
        status: 'Waiting for Payment',
        value: 22500,
        expiryDate: '2025-09-15',
        parties: 'Industrial Supplies Co.',
        owner: 'Robert Brown',
        creationDate: '2023-09-01',
        lastUpdated: '2023-09-05'
    },
    {
        id: 'CTR-2023-007',
        title: 'Non-Disclosure Agreement',
        status: 'Declined',
        expiryDate: '2025-08-31',
        value: 0,
        parties: 'Innovative Solutions LLC',
        owner: 'Sarah Johnson',
        creationDate: '2023-08-15',
        lastUpdated: '2023-08-25'
    }
];

// Save demo data to localStorage if not already present
if (!localStorage.getItem('contracts')) {
    localStorage.setItem('contracts', JSON.stringify(demoContracts));
}

// Function to get all contracts from localStorage
function getContracts() {
    const contractsData = localStorage.getItem('contracts');
    return contractsData ? JSON.parse(contractsData) : [];
}

// Function to calculate contract counts
function updateContractCounts() {
    const contracts = getContracts();
    const counts = {
        'For Approval': 0,
        'Sent': 0,
        'Viewed': 0,
        'Completed': 0,
        'Expired': 0,
        'Waiting for Payment': 0,
        'Declined': 0
    };
    
    // Count contracts by status
    contracts.forEach(contract => {
        if (counts.hasOwnProperty(contract.status)) {
            counts[contract.status]++;
        }
    });
    
    // Update the DOM with counts
    document.getElementById('approvalCount').textContent = counts['For Approval'];
    document.getElementById('sentCount').textContent = counts['Sent'];
    document.getElementById('viewedCount').textContent = counts['Viewed'];
    document.getElementById('completedCount').textContent = counts['Completed'];
    document.getElementById('expiredCount').textContent = counts['Expired'];
    document.getElementById('waitingCount').textContent = counts['Waiting for Payment'];
    document.getElementById('declinedCount').textContent = counts['Declined'];
}

// Function to populate recent contracts table
function populateContractsTable() {
    const contracts = getContracts();
    const tableBody = document.querySelector('#contractsTable tbody');
    const emptyState = document.getElementById('emptyState');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (contracts.length === 0) {
        // Show empty state if no contracts
        emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Sort contracts by last updated date (most recent first)
    const sortedContracts = [...contracts].sort((a, b) => {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });
    
    // Display only the 5 most recent contracts
    const recentContracts = sortedContracts.slice(0, 5);
    
    // Create table rows
    recentContracts.forEach(contract => {
        const row = document.createElement('tr');
        
        // Format expiry date
        const expiryDate = new Date(contract.expiryDate);
        const formattedDate = expiryDate.toLocaleDateString();
        
        // Format value as currency
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(contract.value);
        
        // Create status badge class based on status
        const statusClass = contract.status.toLowerCase().replace(/\s+/g, '-');
        
        row.innerHTML = `
            <td><a href="contract-details.html?id=${contract.id}" class="contract-link">${contract.title}</a></td>
            <td><span class="badge status-${statusClass}">${contract.status}</span></td>
            <td>${formattedDate}</td>
            <td>${formattedValue}</td>
            <td>${contract.parties}</td>
            <td>${contract.owner}</td>
            <td>
                <div class="actions">
                    <a href="contract-details.html?id=${contract.id}" class="btn-icon" title="View Details">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn-icon edit-contract" data-id="${contract.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-contract" data-id="${contract.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    attachActionEventListeners();
}

// Function to attach event listeners to table action buttons
function attachActionEventListeners() {
    // Delete buttons
    document.querySelectorAll('.delete-contract').forEach(button => {
        button.addEventListener('click', function() {
            const contractId = this.getAttribute('data-id');
            openDeleteModal(contractId);
        });
    });
    
    // Edit buttons (redirects to contract details with edit mode)
    document.querySelectorAll('.edit-contract').forEach(button => {
        button.addEventListener('click', function() {
            const contractId = this.getAttribute('data-id');
            window.location.href = `contract-details.html?id=${contractId}&edit=true`;
        });
    });
}

// Function to open delete confirmation modal
function openDeleteModal(contractId) {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    
    // Set the contract ID to delete
    document.getElementById('confirmDelete').setAttribute('data-id', contractId);
}

// Function to delete a contract
function deleteContract(contractId) {
    let contracts = getContracts();
    contracts = contracts.filter(contract => contract.id !== contractId);
    localStorage.setItem('contracts', JSON.stringify(contracts));
    
    // Update UI
    updateContractCounts();
    populateContractsTable();
    
    // Close modal
    document.getElementById('deleteModal').style.display = 'none';
}

// Function to handle search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchContracts');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#contractsTable tbody tr');
        
        rows.forEach(row => {
            const title = row.cells[0].textContent.toLowerCase();
            const status = row.cells[1].textContent.toLowerCase();
            const parties = row.cells[4].textContent.toLowerCase();
            const owner = row.cells[5].textContent.toLowerCase();
            
            // Show/hide row based on search term
            if (
                title.includes(searchTerm) || 
                status.includes(searchTerm) || 
                parties.includes(searchTerm) || 
                owner.includes(searchTerm)
            ) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Function to handle time filter buttons
function setupTimeFilters() {
    const filterButtons = document.querySelectorAll('.time-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter data based on selected period
            const period = this.getAttribute('data-period');
            filterContractsByPeriod(period);
        });
    });
}

// Function to filter contracts by time period
function filterContractsByPeriod(period) {
    // In a real application, this would filter data by date
    // For this example, we'll just update UI to simulate filtering
    
    // Update contract counts as if they were filtered
    const periodMultiplier = {
        'day': 0.2,  // 20% of weekly values for daily
        'week': 1,   // Base values for weekly
        'month': 3,  // 3x weekly values for monthly
        'quarter': 8 // 8x weekly values for quarterly
    };
    
    // Get all contracts
    const contracts = getContracts();
    const filteredContracts = filterContractsByDate(contracts, period);
    
    // Update the counts based on filtered contracts
    updateFilteredCounts(filteredContracts);
    
    // Also update the table to reflect the time period
    updateTableForTimePeriod(filteredContracts);
}

// Function to filter contracts by date period
function filterContractsByDate(contracts, period) {
    const now = new Date();
    let startDate;
    
    // Set start date based on period
    switch (period) {
        case 'day':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1);
            break;
        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 3);
            break;
        default:
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7); // Default to 1 week
    }
    
    // Filter contracts by last updated date
    return contracts.filter(contract => {
        const updatedDate = new Date(contract.lastUpdated);
        return updatedDate >= startDate;
    });
}

// Function to update counts based on filtered contracts
function updateFilteredCounts(filteredContracts) {
    const counts = {
        'For Approval': 0,
        'Sent': 0,
        'Viewed': 0,
        'Completed': 0,
        'Expired': 0,
        'Waiting for Payment': 0,
        'Declined': 0
    };
    
    // Count contracts by status
    filteredContracts.forEach(contract => {
        if (counts.hasOwnProperty(contract.status)) {
            counts[contract.status]++;
        }
    });
    
    // Update the DOM with counts
    document.getElementById('approvalCount').textContent = counts['For Approval'];
    document.getElementById('sentCount').textContent = counts['Sent'];
    document.getElementById('viewedCount').textContent = counts['Viewed'];
    document.getElementById('completedCount').textContent = counts['Completed'];
    document.getElementById('expiredCount').textContent = counts['Expired'];
    document.getElementById('waitingCount').textContent = counts['Waiting for Payment'];
    document.getElementById('declinedCount').textContent = counts['Declined'];
}

// Function to update table based on filtered contracts
function updateTableForTimePeriod(filteredContracts) {
    const tableBody = document.querySelector('#contractsTable tbody');
    const emptyState = document.getElementById('emptyState');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (filteredContracts.length === 0) {
        // Show empty state if no contracts
        emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state
    emptyState.style.display = 'none';
    
    // Sort contracts by last updated date (most recent first)
    const sortedContracts = [...filteredContracts].sort((a, b) => {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    });
    
    // Display only the 5 most recent contracts
    const recentContracts = sortedContracts.slice(0, 5);
    
    // Create table rows
    recentContracts.forEach(contract => {
        const row = document.createElement('tr');
        
        // Format expiry date
        const expiryDate = new Date(contract.expiryDate);
        const formattedDate = expiryDate.toLocaleDateString();
        
        // Format value as currency
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(contract.value);
        
        // Create status badge class based on status
        const statusClass = contract.status.toLowerCase().replace(/\s+/g, '-');
        
        row.innerHTML = `
            <td><a href="contract-details.html?id=${contract.id}" class="contract-link">${contract.title}</a></td>
            <td><span class="badge status-${statusClass}">${contract.status}</span></td>
            <td>${formattedDate}</td>
            <td>${formattedValue}</td>
            <td>${contract.parties}</td>
            <td>${contract.owner}</td>
            <td>
                <div class="actions">
                    <a href="contract-details.html?id=${contract.id}" class="btn-icon" title="View Details">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn-icon edit-contract" data-id="${contract.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-contract" data-id="${contract.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    attachActionEventListeners();
}

// Set up modal events
function setupModalEvents() {
    // Close modals when clicking the X button or Cancel
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.style.display = 'none');
        });
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Confirm delete action
    document.getElementById('confirmDelete').addEventListener('click', function() {
        const contractId = this.getAttribute('data-id');
        deleteContract(contractId);
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI
    updateContractCounts();
    populateContractsTable();
    setupSearch();
    setupTimeFilters();
    setupModalEvents();
    
    // Set initial time filter to 1 week (default active)
    filterContractsByPeriod('week');
});