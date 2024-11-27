const token = localStorage.getItem("token");

// Fetch available meals based on selected meal type
async function fetchAvailableMeals(mealType = "") {
  try {
    console.log(`Fetching meals for type: ${mealType}`); // Debug to check meal type

    const response = await fetch(`http://localhost:5000/api/meals?mealType=${mealType}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403 || response.status === 401) {
      handleTokenExpiration();
      return;
    }

    if (!response.ok) throw new Error("Failed to fetch meals");

    const meals = await response.json();
    const mealSelection = document.getElementById("meal-selection");

    // Clear existing meal options
    mealSelection.innerHTML = "";

    // Check if meals array is empty and handle accordingly
    if (meals.length === 0) {
      mealSelection.innerHTML = "<option disabled>No meals available</option>";
      return;
    }

    // Populate dropdown with filtered meal options
    meals.forEach((meal) => {
      const option = document.createElement("option");
      option.value = meal.meal_id;
      option.textContent = meal.meal_name;
      option.setAttribute("data-calories", meal.calories);
      option.setAttribute("data-protein", meal.protein_grams);
      option.setAttribute("data-carbs", meal.carbs_grams);
      option.setAttribute("data-fats", meal.fat_grams);
      mealSelection.appendChild(option);
    });

    // Display default nutrient values of the first meal in the dropdown
    displayDefaultMealNutrients();

  } catch (error) {
    // console.error("Error fetching meals:", error);
    // alert("Could not load meals.");
  }
}


// Fetch meal logs for the current day
async function fetchMealLogsForDay() {
  try {
    const response = await fetch("http://localhost:5000/api/meal-logs/day", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch daily meal logs");

    const mealLogs = await response.json();
    console.log('Fetched Daily Meal Logs:', mealLogs); // Debugging
    renderDailyMealPlan(mealLogs);
  } catch (error) {
    console.error("Error:", error);
    alert("Could not load daily meal logs.");
  }
}

async function fetchMealPlanGoals() {
  try {
    const response = await fetch("http://localhost:5000/api/meal-plans/goals", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch meal plan goals");

    const goals = await response.json();

    // Display the goals in the nutrient progress section
    document.getElementById("calorie-goal").innerText = `${goals.calories_per_day}`;
    document.getElementById("protein-goal").innerText = `${goals.protein_grams}`;
    document.getElementById("carbs-goal").innerText = `${goals.carbs_grams}`;
    document.getElementById("fats-goal").innerText = `${goals.fat_grams}`;
  } catch (error) {
    console.error("Error fetching meal plan goals:", error);
  }
}

function renderDailyMealPlan(mealLogs) {
  const container = document.getElementById("generated-plan");
  container.innerHTML = ""; // Clear previous content

  mealLogs.forEach((log) => {
    const lebanonTime = new Date(log.date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Beirut",
    });

    const mealCard = document.createElement("div");
    mealCard.className = "card mb-3 p-3 shadow-sm";
    mealCard.innerHTML = `
      <h4>${lebanonTime} - ${log.meal_type}</h4>
      <h5>${log.meal_name}</h5>
      <p><strong>Calories:</strong> ${log.total_calories} kcal
      <strong>Protein:</strong> ${log.total_protein} g
      <strong>Carbs:</strong> ${log.total_carbs} g
      <strong>Fats:</strong> ${log.total_fat} g</p>
       <button class="btn btn-danger btn-sm" onclick="deleteMealLog(${log.meal_log_id}, '${log.date}', ${log.total_calories}, ${log.total_protein}, ${log.total_carbs}, ${log.total_fat})">Delete</button>`;

    container.appendChild(mealCard);
  });
}


// Display the nutrient info for the selected meal
function displayMealInfo() {
  const mealSelect = document.getElementById("meal-selection");
  const selectedOption = mealSelect.options[mealSelect.selectedIndex];

  document.getElementById("meal-calories").innerText = selectedOption.getAttribute("data-calories") || 0;
  document.getElementById("meal-protein").innerText = selectedOption.getAttribute("data-protein") || 0;
  document.getElementById("meal-carbs").innerText = selectedOption.getAttribute("data-carbs") || 0;
  document.getElementById("meal-fats").innerText = selectedOption.getAttribute("data-fats") || 0;
}

// Display default nutrients for the first meal in the dropdown on load
function displayDefaultMealNutrients() {
  displayMealInfo();
}

// Event listener for form submission
document.getElementById('meal-plan-form').addEventListener('submit', addMeal);

async function fetchDailyNutrientProgress() {
  try {
    const response = await fetch("http://localhost:5000/api/daily-progress", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch daily nutrient progress");

    const progress = await response.json();

    document.getElementById("calories-consumed").innerText = progress.calories || 0;
    document.getElementById("protein-consumed").innerText = progress.protein || 0;
    document.getElementById("carbs-consumed").innerText = progress.carbs || 0;
    document.getElementById("fats-consumed").innerText = progress.fat || 0;

    updateProgressBars(progress);
  } catch (error) {
    console.error("Error fetching daily nutrient progress:", error);
  }
}



async function updateDailyNutrientProgress(date, calories, protein, carbs, fats) {
  try {
    const response = await fetch("http://localhost:5000/api/daily-progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date, calories, protein, carbs, fats }),
    });

    if (!response.ok) throw new Error("Failed to update daily nutrient progress");
  } catch (error) {
    console.error("Error updating daily nutrient progress:", error);
  }
}



// Add a meal to the meal log
async function addMeal(event) {
  event.preventDefault();

  const date = document.getElementById("meal-date").value;
  const time = document.getElementById("meal-time").value;
  const datetime = `${date}T${time}:00`; // Combine date and time into ISO format

  const mealType = document.getElementById("meal-type").value;
  const mealSelect = document.getElementById("meal-selection");
  const mealId = mealSelect.value;

  const caloriesPerServing = parseFloat(mealSelect.options[mealSelect.selectedIndex].getAttribute("data-calories"));
  const proteinPerServing = parseFloat(mealSelect.options[mealSelect.selectedIndex].getAttribute("data-protein"));
  const carbsPerServing = parseFloat(mealSelect.options[mealSelect.selectedIndex].getAttribute("data-carbs"));
  const fatsPerServing = parseFloat(mealSelect.options[mealSelect.selectedIndex].getAttribute("data-fats"));

  const servings = parseFloat(document.getElementById("servings").value);

  const totalCalories = caloriesPerServing * servings;
  const totalProtein = proteinPerServing * servings;
  const totalCarbs = carbsPerServing * servings;
  const totalFats = fatsPerServing * servings;

  try {
    const response = await fetch("http://localhost:5000/api/meal-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        datetime, // Use the combined datetime
        mealType,
        mealId,
        servings,
      }),
    });

    if (response.ok) {
      await updateDailyNutrientProgress(date, totalCalories, totalProtein, totalCarbs, totalFats);
      fetchMealLogsForDay(); // Refresh meal logs
      fetchDailyNutrientProgress(); // Refresh progress display
    } else {
      alert("Error adding meal log");
    }
  } catch (error) {
    console.error("Error adding meal:", error);
    alert("Error adding meal.");
  }
}


async function updateProgressAfterMealLog() {
  await fetchDailyNutrientProgress(); // Update progress from the backend
  fetchMealLogsForDay();              // Refresh meal logs
}


// Handle expired tokens
function handleTokenExpiration() {
  localStorage.removeItem('token');
  window.location.href = '../Login/login.html';
}



function updateProgressBars(progress) {
  const calorieGoal = parseFloat(document.getElementById("calorie-goal").innerText) || 1;
  const proteinGoal = parseFloat(document.getElementById("protein-goal").innerText) || 1;
  const carbsGoal = parseFloat(document.getElementById("carbs-goal").innerText) || 1;
  const fatsGoal = parseFloat(document.getElementById("fats-goal").innerText) || 1;

  document.getElementById("calorie-progress").style.width = `${(progress.calories / calorieGoal) * 100}%`;
  document.getElementById("protein-progress").style.width = `${(progress.protein / proteinGoal) * 100}%`;
  document.getElementById("carbs-progress").style.width = `${(progress.carbs / carbsGoal) * 100}%`;
  document.getElementById("fats-progress").style.width = `${(progress.fat / fatsGoal) * 100}%`;
}





async function deleteMealLog(mealLogId, dateTime, calories, protein, carbs, fats) {
  if (!confirm('Are you sure you want to delete this meal log?')) return;

  try {
    // Format the date to match the database format: YYYY-MM-DD 00:00:00
    const formattedDate = new Date(dateTime).toISOString().split('T')[0] + ' 00:00:00';

    // Delete the meal log from the database
    const response = await fetch(`http://localhost:5000/api/meal-logs/${mealLogId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete meal log');

    console.log('Meal log deleted successfully.');

    // Deduct the nutrients from the daily progress in the database
    const deductResponse = await fetch('http://localhost:5000/api/daily-progress/deduct', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        date: formattedDate, // Pass the formatted date
        calories,
        protein,
        carbs,
        fats,
      }),
    });

    if (!deductResponse.ok) throw new Error('Failed to update daily progress after deletion');

    console.log('Daily progress updated successfully.');

    // Refresh the frontend to reflect changes
    fetchMealLogsForDay(); // Refresh meal logs
    fetchDailyNutrientProgress(); // Refresh progress display
  } catch (error) {
    console.error('Error deleting meal log:', error);
    alert('Could not delete meal log.');
  }
}

document.addEventListener('DOMContentLoaded',  () => {
  fetchMealPlanGoals();         // Fetch goals
  fetchDailyNutrientProgress(); // Fetch daily progress
  fetchMealLogsForDay();        // Fetch meals for the day
  fetchAvailableMeals();        // Fetch available meals
  

  document.getElementById("meal-type").addEventListener("change", (event) => {
      fetchAvailableMeals(event.target.value); // Fetch meals based on type
  });

  document.getElementById("meal-selection").addEventListener("change", displayMealInfo);
});