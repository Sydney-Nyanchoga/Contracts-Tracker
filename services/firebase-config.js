// Initialize Firebase
// Place this code in main.js or a separate firebase-config.js file
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxEyY33ubLsIwrJIeDdim01T-_lxW-n2I",
    authDomain: "contracts-management-d9ebf.firebaseapp.com",
    databaseURL: "https://contracts-management-d9ebf-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "contracts-management-d9ebf",
    storageBucket: "contracts-management-d9ebf.firebasestorage.app",
    messagingSenderId: "512501422982",
    appId: "1:512501422982:web:7b61420bb65c155d4faa07",
    measurementId: "G-HD4K3Q2MBC"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // ------- CONTRACTS.HTML - Create New Contract -------
  // Add this to contract-details.js
  
  document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const contractForm = document.querySelector('.contract-form');
    const saveAsDraftBtn = document.querySelector('.btn-outline');
    const sendForApprovalBtn = document.querySelector('.btn-primary');
    
    // Save as Draft function
    saveAsDraftBtn.addEventListener('click', function() {
      saveContract('Draft');
    });
    
    // Send for Approval function
    sendForApprovalBtn.addEventListener('click', function() {
      saveContract('Pending Approval');
    });
    
    function saveContract(status) {
      // Get form values
      const contractTitle = document.getElementById('contract-title').value;
      const contractType = document.getElementById('contract-type').value;
      const effectiveDate = document.getElementById('effective-date').value;
      const expirationDate = document.getElementById('expiration-date').value;
      const companyName = document.getElementById('company-name').value;
      const clientName = document.getElementById('client-name').value;
      const clientAddress = document.getElementById('client-address').value;
      const clientContact = document.getElementById('client-contact').value;
      const notes = document.getElementById('contract-notes').value;
      
      // Get approvals
      const legalApproval = document.getElementById('legal-approval').checked;
      const financeApproval = document.getElementById('finance-approval').checked;
      const managementApproval = document.getElementById('management-approval').checked;
      const techApproval = document.getElementById('tech-approval').checked;
      
      // Calculate days remaining
      const today = new Date();
      const expiry = new Date(expirationDate);
      const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      
      // Create contract object
      const contractData = {
        title: contractTitle,
        type: contractType,
        effectiveDate: effectiveDate,
        expirationDate: expirationDate,
        company: companyName,
        client: clientName,
        clientAddress: clientAddress,
        clientContact: clientContact,
        notes: notes,
        approvals: {
          legal: legalApproval,
          finance: financeApproval,
          management: managementApproval,
          technical: techApproval
        },
        status: status,
        daysRemaining: daysRemaining,
        value: 0, // You may want to add a value field to your form
        owner: "Current User", // This should be dynamic based on logged-in user
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      // Validate required fields
      if (!contractTitle || !contractType || !expirationDate || !clientName) {
        alert("Please fill in all required fields.");
        return;
      }
      
      // Save to Firebase
      db.collection("contracts").add(contractData)
        .then((docRef) => {
          console.log("Contract saved with ID: ", docRef.id);
          alert("Contract saved successfully!");
          
          // Redirect to status page or dashboard
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error adding contract: ", error);
          alert("Error saving contract. Please try again.");
        });
    }
  });
  
  // ------- STATUS-CONTRACTS.HTML - Display Contracts -------
  // Add this to status-contracts.js
  
  document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to determine which status to filter by
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('status') || "all";
    
    // Set page titles based on status
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const statusTableTitle = document.getElementById('statusTableTitle');
    
    if (statusFilter !== "all") {
      statusTitle.textContent = `${statusFilter} Contracts`;
      statusDescription.textContent = `Viewing all contracts with ${statusFilter} status`;
      statusTableTitle.textContent = `${statusFilter} Contracts`;
    }
    
    // Load contracts from Firebase
    loadContracts(statusFilter);
    
    // Setup search functionality
    const searchInput = document.getElementById('searchStatusContracts');
    searchInput.addEventListener('input', function() {
      loadContracts(statusFilter, this.value);
    });
    
    // Function to load and display contracts
    function loadContracts(status, searchTerm = '') {
      const contractsTable = document.getElementById('statusContractsTable').getElementsByTagName('tbody')[0];
      const emptyState = document.getElementById('emptyStatusState');
      const emptyText = document.getElementById('emptyStatusText');
      
      // Create query
      let query = db.collection("contracts");
      
      // Apply status filter if not "all"
      if (status !== "all") {
        query = query.where("status", "==", status);
      }
      
      // Order by creation date (newest first)
      query = query.orderBy("createdAt", "desc");
      
      query.get().then((querySnapshot) => {
        // Clear existing table rows
        contractsTable.innerHTML = '';
        
        // If no contracts found
        if (querySnapshot.empty) {
          contractsTable.parentElement.parentElement.style.display = 'none';
          emptyState.style.display = 'flex';
          emptyText.textContent = status !== "all" ? 
            `No contracts with ${status} status` : 
            "No contracts found";
          return;
        }
        
        // Display contracts
        let hasContracts = false;
        querySnapshot.forEach((doc) => {
          const contract = doc.data();
          const contractId = doc.id;
          
          // Apply search filter if provided
          if (searchTerm && !contract.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
              !contract.client.toLowerCase().includes(searchTerm.toLowerCase())) {
            return;
          }
          
          hasContracts = true;
          
          // Create table row
          const row = document.createElement('tr');
          
          // Format date
          const expiryDate = contract.expirationDate ? new Date(contract.expirationDate).toLocaleDateString() : 'N/A';
          
          // Format status class
          let statusClass = '';
          switch(contract.status) {
            case 'Active': statusClass = 'status-active'; break;
            case 'Expired': statusClass = 'status-expired'; break;
            case 'Draft': statusClass = 'status-draft'; break;
            case 'Pending Approval': statusClass = 'status-pending'; break;
            default: statusClass = ''; break;
          }
          
          // Set days remaining color
          let daysRemainingClass = '';
          if (contract.daysRemaining < 0) {
            daysRemainingClass = 'text-danger';
          } else if (contract.daysRemaining < 30) {
            daysRemainingClass = 'text-warning';
          } else {
            daysRemainingClass = 'text-success';
          }
          
          // Create row HTML
          row.innerHTML = `
            <td><a href="contract-details.html?id=${contractId}" class="contract-link">${contract.title}</a></td>
            <td>${expiryDate}</td>
            <td>${contract.value ? '$' + contract.value.toLocaleString() : 'N/A'}</td>
            <td>${contract.client}</td>
            <td>${contract.owner}</td>
            <td class="${daysRemainingClass}">${contract.daysRemaining} days</td>
            <td>
              <div class="action-buttons">
                <a href="contract-details.html?id=${contractId}" class="btn-icon" title="View">
                  <i class="fas fa-eye"></i>
                </a>
                <a href="edit-contract.html?id=${contractId}" class="btn-icon" title="Edit">
                  <i class="fas fa-edit"></i>
                </a>
                <button class="btn-icon delete-contract" data-id="${contractId}" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          `;
          
          contractsTable.appendChild(row);
        });
        
        if (!hasContracts) {
          contractsTable.parentElement.parentElement.style.display = 'none';
          emptyState.style.display = 'flex';
          emptyText.textContent = searchTerm ? 
            `No contracts matching "${searchTerm}"` : 
            (status !== "all" ? `No contracts with ${status} status` : "No contracts found");
        } else {
          contractsTable.parentElement.parentElement.style.display = 'block';
          emptyState.style.display = 'none';
          
          // Add event listeners to delete buttons
          document.querySelectorAll('.delete-contract').forEach(button => {
            button.addEventListener('click', function() {
              const contractId = this.getAttribute('data-id');
              showDeleteModal(contractId);
            });
          });
        }
      }).catch((error) => {
        console.error("Error getting contracts: ", error);
        alert("Error loading contracts. Please try again.");
      });
    }
    
    // Delete Contract functionality
    function showDeleteModal(contractId) {
      const modal = document.getElementById('deleteModal');
      const confirmBtn = document.getElementById('confirmDelete');
      const closeButtons = modal.querySelectorAll('.close-modal');
      
      // Show modal
      modal.style.display = 'block';
      
      // Setup confirm delete action
      confirmBtn.onclick = function() {
        deleteContract(contractId);
        modal.style.display = 'none';
      };
      
      // Setup close modal actions
      closeButtons.forEach(button => {
        button.onclick = function() {
          modal.style.display = 'none';
        };
      });
      
      // Close when clicking outside
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    }
    
    function deleteContract(contractId) {
      db.collection("contracts").doc(contractId).delete()
        .then(() => {
          console.log("Contract successfully deleted!");
          // Reload contracts to update the view
          loadContracts(statusFilter, document.getElementById('searchStatusContracts').value);
        })
        .catch((error) => {
          console.error("Error removing contract: ", error);
          alert("Error deleting contract. Please try again.");
        });
    }
  });