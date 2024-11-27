const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/api/progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      handleTokenExpiration(); // Handle token expiration
      return;
    }

    if (!response.ok) throw new Error("Failed to fetch progress data");

    const progressData = await response.json();
    renderProgressData(progressData);
  } catch (error) {
    console.error("Error fetching progress:", error);
    alert("Could not load progress data.");
  }
});

// Format date to "27 Nov 2024" format
function formatDate(dateString) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
}

function renderProgressData(data) {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const labels = data.map((entry) => formatDate(entry.date));
  const weight = data.map((entry) => entry.weight);
  const bodyFatPercentage = data.map((entry) => entry.bodyFatPercentage);
  const bmi = data.map((entry) => entry.bmi);
  const muscleMass = data.map((entry) => entry.muscleMass);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Weight (kg)", data: weight, borderColor: "#4e73df" }, // Blue
        { label: "Body Fat (%)", data: bodyFatPercentage, borderColor: "#1cc88a" }, // Green
        { label: "BMI", data: bmi, borderColor: "#A52A2A" }, // Brown for BMI
        { label: "Muscle Mass (kg)", data: muscleMass, borderColor: "#f6c23e" }, // Yellow
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { beginAtZero: true },
      },
    },
  });

  const tableBody = document.getElementById("comparisonTable");
  tableBody.innerHTML = "";
  data.forEach((entry) => {
    const row = `
      <tr>
        <td>${formatDate(entry.date)}</td>
        <td>${entry.weight}</td>
        <td>${entry.bodyFatPercentage}</td>
        <td>${entry.bmi}</td>
        <td>${entry.muscleMass}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}
