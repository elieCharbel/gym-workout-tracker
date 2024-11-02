// script.js

// Total number of lockers
const totalLockers = 50;

// Initialize the lockers with default states (all available)
let lockers = Array.from({ length: totalLockers }, (_, i) => ({
  id: i + 1,
  status: "available"
}));

// Track the currently selected locker
let selectedLockerId = null;
let confirmationModal;  // Store modal instance for later use

// Render lockers in the grid
function renderLockers() {
  const sectionA = document.getElementById("sectionA");
  const sectionB = document.getElementById("sectionB");

  sectionA.innerHTML = "";  // Clear Section A grid
  sectionB.innerHTML = "";  // Clear Section B grid

  lockers.forEach(locker => {
    // Create locker element
    const lockerDiv = document.createElement("div");
    lockerDiv.classList.add("locker", locker.status);
    lockerDiv.setAttribute("data-id", locker.id);

    // Display locker number
    const lockerNumber = document.createElement("span");
    lockerNumber.classList.add("locker-number");
    lockerNumber.innerText = locker.id;
    lockerDiv.appendChild(lockerNumber);

    // Click event to show confirmation modal if available
    lockerDiv.addEventListener("click", () => openConfirmationModal(locker.id));

    // Append to Section A if ID is in the first half, else to Section B
    if (locker.id <= totalLockers / 2) {
      sectionA.appendChild(lockerDiv);
    } else {
      sectionB.appendChild(lockerDiv);
    }
  });
}


// Open the modal to confirm selection
function openConfirmationModal(id) {
  const locker = lockers.find(l => l.id === id);
  if (locker.status !== "available") return;  // Ignore if locker is occupied

  // Update selection: reset any previously selected locker
  lockers = lockers.map(l => ({
    ...l,
    status: l.id === id ? "selected" : l.status === "selected" ? "available" : l.status
  }));

  selectedLockerId = id;  // Track the selected locker ID
  document.getElementById("lockerNumber").innerText = id;  // Display locker number in modal
  
  // Initialize and show the modal if not already done
  confirmationModal = confirmationModal || new bootstrap.Modal(document.getElementById("confirmationModal"));
  confirmationModal.show();

  // Re-render lockers to show the current selection
  renderLockers();
}

// Confirm selection and update locker status
function confirmSelection() {
  if (selectedLockerId !== null) {
    // Update locker status to occupied
    lockers = lockers.map(l => ({
      ...l,
      status: l.id === selectedLockerId ? "occupied" : l.status
    }));

    // Reset selected locker ID
    selectedLockerId = null;

    // Close the modal after confirmation
    confirmationModal.hide();

    // Re-render lockers to reflect the confirmed selection
    renderLockers();
  }
}

// Initial rendering of lockers
document.addEventListener("DOMContentLoaded", renderLockers);
