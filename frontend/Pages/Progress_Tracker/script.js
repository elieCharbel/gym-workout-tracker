// script.js

// Initialize flatpickr for single date selection
document.addEventListener('DOMContentLoaded', () => {
    flatpickr("#datePicker", {
      mode: "single",
      dateFormat: "Y-m-d",
      onChange: (_, dateStr) => {
        setSelectedDate(dateStr);
        showProgressForm();
      }
    });
  });
  
  // Function to set the selected date and display it on the form
  function setSelectedDate(date) {
    document.getElementById("selectedDate").textContent = date;
  }
  
  // Function to display the progress form and reset fields
  function showProgressForm() {
    document.getElementById("progressForm").style.display = "block"; // Show form
    document.getElementById("progressChartContainer").style.display = "none"; // Hide chart initially
  
    // Reset form fields
    document.getElementById("weight").value = '';
    document.getElementById("bodyFat").value = '';
    document.getElementById("bmi").value = '';
    document.getElementById("muscleMass").value = '';
  }
  
  // Handle displaying the progress chart
  function handleSaveProgress() {
    const data = {
      weight: document.getElementById("weight").value,
      bodyFat: document.getElementById("bodyFat").value,
      bmi: document.getElementById("bmi").value,
      muscleMass: document.getElementById("muscleMass").value,
    };
  
    if (validateData(data)) {
      alert("Progress displayed temporarily!");
      updateChart(data);
      document.getElementById("progressChartContainer").style.display = "block"; // Show chart after saving
    }
  }
  
  // Validate user input
  function validateData(data) {
    if (!data.weight || !data.bodyFat || !data.bmi || !data.muscleMass) {
      alert("Please fill in all fields.");
      return false;
    }
    return true;
  }
  
  // Update the chart with current progress data
  function updateChart(data) {
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
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  