// Temporary in-memory storage for progress data
let progressData = {};

// Initialize flatpickr on the date picker in index.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('datePicker')) {
    flatpickr("#datePicker", {
      mode: "single",
      dateFormat: "Y-m-d",
      onChange: (_, dateStr) => {
        progressData.selectedDate = dateStr;
      }
    });
  }
});

// Function to navigate to data entry page with selected date
function goToDataEntry() {
  if (!progressData.selectedDate) {
    alert("Please select a date first.");
    return;
  }
  sessionStorage.setItem("selectedDate", progressData.selectedDate);
  window.location.href = 'data_entry_page.html';
}

// Function to load selected date on data-entry.html
if (document.getElementById('selectedDate')) {
  document.getElementById('selectedDate').textContent = sessionStorage.getItem("selectedDate");
}

// Function to save data and navigate to review.html
function saveAndGoToReview() {
  const selectedDate = sessionStorage.getItem("selectedDate");
  
  const weight = parseFloat(document.getElementById("weight").value);
  const bodyFat = parseFloat(document.getElementById("bodyFat").value);
  const bmi = parseFloat(document.getElementById("bmi").value);
  const muscleMass = parseFloat(document.getElementById("muscleMass").value);

  // Check if any value is negative
  if (weight < 0 || bodyFat < 0 || bmi < 0 || muscleMass < 0) {
    alert("Values cannot be negative. Please enter valid data.");
    return;
  }

  const data = { weight, bodyFat, bmi, muscleMass };
  progressData[selectedDate] = data;
  sessionStorage.setItem("progressData", JSON.stringify(progressData));
  window.location.href = 'review.html';
}

// Function to load data and display on review.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reviewDate')) {
    const selectedDate = sessionStorage.getItem("selectedDate");
    document.getElementById("reviewDate").textContent = selectedDate;

    progressData = JSON.parse(sessionStorage.getItem("progressData")) || {};
    const currentData = progressData[selectedDate];

    if (currentData) {
      // Display chart
      displayChart(currentData);

      // Display comparison table
      populateComparisonTable();
    }
  }
});

// Function to display a chart for the selected date's data
function displayChart(data) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Weight', 'Body Fat', 'BMI', 'Muscle Mass'],
      datasets: [{
        label: 'Progress Metrics',
        data: [data.weight, data.bodyFat, data.bmi, data.muscleMass],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Function to populate the comparison table
function populateComparisonTable() {
  const tableBody = document.getElementById("comparisonTable");
  tableBody.innerHTML = '';

  Object.keys(progressData).forEach(date => {
    const entry = progressData[date];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${entry.weight}</td>
      <td>${entry.bodyFat}</td>
      <td>${entry.bmi}</td>
      <td>${entry.muscleMass}</td>
    `;
    tableBody.appendChild(row);
  });
}
