const token = localStorage.getItem("token");

async function saveAndGoToReview() {
  const progressDate = document.getElementById("progressDate").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const bodyFatPercentage = parseFloat(document.getElementById("bodyFatPercentage").value);
  const bmi = parseFloat(document.getElementById("bmi").value);
  const muscleMass = parseFloat(document.getElementById("muscleMass").value);

  if (!progressDate || isNaN(weight) || isNaN(bodyFatPercentage) || isNaN(bmi) || isNaN(muscleMass)) {
    alert("All fields are required and must be valid.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: progressDate, // Use the date from the input
        weight,
        bodyFatPercentage,
        bmi,
        muscleMass,
      }),
    });

    if (response.status === 401 || response.status === 403) {
      handleTokenExpiration();
      return;
    }

    if (!response.ok) throw new Error("Failed to save progress");

    window.location.href = "review.html";
  } catch (error) {
    console.error("Error saving progress:", error);
    alert("Could not save progress. Please try again.");
  }
}

