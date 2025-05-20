// Initialize Firebase (ensure firebase-config.js is included before this script)
const db = firebase.firestore();
const storage = firebase.storage();

// Preview the contract before submission
function previewContract() {
  const previewModal = document.getElementById('previewModal');
  const previewDetails = document.getElementById('previewDetails');

  const title = document.getElementById('contractTitle').value;
  const startDate = document.getElementById('startDate').value;
  const duration = document.getElementById('duration').value;
  const endDate = document.getElementById('endDate').value;
  const contractType = document.getElementById('contractType').value;
  const clientContact = document.getElementById('clientContact').value;
  const clientEmail = document.getElementById('clientEmail').value;
  const companyName = document.getElementById('companyName').value;

  const files = document.getElementById('fileInput').files;
  let fileListHTML = "<p><strong>Attached Files:</strong></p><ul>";
  for (let i = 0; i < files.length; i++) {
    fileListHTML += `<li>${files[i].name}</li>`;
  }
  fileListHTML += "</ul>";

  previewDetails.innerHTML = `
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Start Date:</strong> ${startDate}</p>
    <p><strong>Duration:</strong> ${duration} months</p>
    <p><strong>Expiry Date:</strong> ${endDate}</p>
    <p><strong>Contract Type:</strong> ${contractType}</p>
    <hr>
    <p><strong>Client Contact:</strong> ${clientContact}</p>
    <p><strong>Client Email:</strong> ${clientEmail}</p>
    <hr>
    <p><strong>Company Name:</strong> ${companyName}</p>
    <hr>
    ${fileListHTML}
  `;

  previewModal.style.display = 'flex';
}

function closePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

// Drag & Drop file upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = "#e2e6ea";
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.backgroundColor = "#f8f9fa";
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = "#f8f9fa";
  fileInput.files = e.dataTransfer.files;
});

// Handle form submission
const contractForm = document.getElementById('contractForm');
contractForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('contractTitle').value;
  const startDate = document.getElementById('startDate').value;
  const duration = document.getElementById('duration').value;
  const endDate = document.getElementById('endDate').value;
  const contractType = document.getElementById('contractType').value;
  const clientContact = document.getElementById('clientContact').value;
  const clientEmail = document.getElementById('clientEmail').value;
  const companyName = document.getElementById('companyName').value;
  const files = document.getElementById('fileInput').files;

  const contractData = {
    title,
    startDate,
    duration,
    endDate,
    contractType,
    clientContact,
    clientEmail,
    companyName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    // Save contract data to Firestore
    const docRef = await db.collection('contracts').add(contractData);

    // Upload files to Storage
    if (files.length > 0) {
      for (let file of files) {
        const storageRef = storage.ref(`contracts/${docRef.id}/${file.name}`);
        await storageRef.put(file);
      }
    }

    alert('Contract successfully added!');
    contractForm.reset();
    closePreview();
  } catch (error) {
    console.error("Error saving contract:", error);
    alert('Failed to add contract.');
  }
});
