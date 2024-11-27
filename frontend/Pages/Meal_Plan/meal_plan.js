const token = localStorage.getItem("token");

// Function to fetch and display the current meal plan
async function fetchCurrentMealPlan() {
  try {
    const response = await fetch("http://localhost:5000/api/meal-plans/current", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const plan = await response.json();
      document.getElementById("plan-details").innerText = `
        Plan Name: ${plan.plan_name}
        | Calories: ${plan.calories_per_day} kcal
        | Protein: ${plan.protein_grams} g
        | Carbs: ${plan.carbs_grams} g
        | Fats: ${plan.fat_grams} g
      `;
    } else {
      document.getElementById("plan-details").innerText = "No active meal plan";
    }
  } catch (error) {
    console.error("Error fetching current meal plan:", error);
  }
}

// Function to create a new meal plan
async function createMealPlan(event) {
  event.preventDefault();

  const planName = document.getElementById('plan-name').value;
  const dailyCalories = parseInt(document.getElementById('daily-calories').value);
  const dailyProtein = parseInt(document.getElementById('daily-protein').value);
  const dailyCarbs = parseInt(document.getElementById('daily-carbs').value);
  const dailyFats = parseInt(document.getElementById('daily-fats').value);

  try {
    const response = await fetch("http://localhost:5000/api/meal-plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planName, dailyCalories, dailyProtein, dailyCarbs, dailyFats }),
    });

    if (response.ok) {
      await fetchCurrentMealPlan(); // Refresh the displayed meal plan
      alert("Meal Plan Created Successfully!");
    } else {
      throw new Error("Failed to create meal plan");
    }
  } catch (error) {
    console.error("Error creating meal plan:", error);
  }
}

// Function to end the current meal plan
async function endMealPlan() {
  try {
    const response = await fetch("http://localhost:5000/api/meal-plans/end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      document.getElementById("plan-details").innerText = "Meal Plan Ended";
      alert("Meal Plan Ended Successfully!");
    } else {
      throw new Error("Failed to end meal plan");
    }
  } catch (error) {
    console.error("Error ending meal plan:", error);
  }
}

document.getElementById("meal-plan-form").addEventListener("submit", createMealPlan);
document.getElementById("end-plan").addEventListener("click", endMealPlan);

// Fetch and display the current meal plan on page load
document.addEventListener("DOMContentLoaded", fetchCurrentMealPlan);
