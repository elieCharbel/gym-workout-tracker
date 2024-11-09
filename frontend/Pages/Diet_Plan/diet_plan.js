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
    console.log("Fetched weekly meal logs:" + meals);
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
    console.error("Error fetching meals:", error);
    alert("Could not load meals.");
  }
}


async function fetchMealLogsForWeek() {
  try {
    const response = await fetch('http://localhost:5000/api/meal-logs/week', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 403 || response.status === 401) {
      handleTokenExpiration();
      return;
    }
    
    if (!response.ok) throw new Error('Failed to fetch weekly meal logs');
    
    const mealLogs = await response.json();
    
    console.log("Fetched weekly meal logs:", mealLogs); // Debugging log
    renderWeeklyMealPlan(mealLogs);
  } catch (error) {
    console.error('Error:', error);
    alert('Could not load weekly meal logs.');
  }
}


// Helper function to render weekly meal logs on the page
function renderWeeklyMealPlan(mealLogs) {
  const generatedPlanDiv = document.getElementById("generated-plan");
  generatedPlanDiv.innerHTML = "<h3>Meals for the Current Week</h3>";

  mealLogs.forEach((log) => {
    let utcDate = new Date(log.date);
    utcDate.setHours(utcDate.getHours() + 2);

    const formattedDate = utcDate.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Beirut",
    });

    const mealDiv = document.createElement("div");
    mealDiv.classList.add("card", "mb-3");
    mealDiv.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${formattedDate} - ${log.meal_type}</h5>
        <p class="card-text"><strong>Meal:</strong> ${log.meal_name || "N/A"}</p>
        <p class="card-text"><strong>Calories:</strong> ${log.total_calories || "N/A"}</p>
      </div>
    `;
    generatedPlanDiv.appendChild(mealDiv);
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

document.addEventListener('DOMContentLoaded', () => {
  loadDailyProgress(); // Load and display saved progress on page load
  fetchAvailableMeals(); // Load available meals
  fetchMealLogsForWeek(); // Fetch and display weekly meal logs

  // Update dropdown meals based on meal type selection
  document.getElementById("meal-type").addEventListener("change", (event) => {
    const selectedMealType = event.target.value;
    fetchAvailableMeals(selectedMealType); // Filter meals based on type
  });

  // Update meal info display when meal selection changes
  document.getElementById("meal-selection").addEventListener("change", displayMealInfo);
});





// Add a meal to the meal log
async function addMeal(event) {
  event.preventDefault();

  const date = document.getElementById("meal-date").value;
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

  const response = await fetch("http://localhost:5000/api/meal-logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, mealType, mealId, totalCalories, totalProtein, totalCarbs, totalFats, servings }),
  });

  if (response.ok) {
    // Update the progress bars with the new values
    updateNutrientProgress({
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
    });
    // Refresh the weekly meal logs
    fetchMealLogsForDay(); 
  } else {
    alert("Error adding meal log");
  }
}


function updateNutrientProgress(nutrients) {
  let progress = JSON.parse(localStorage.getItem("dailyProgress")) || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  // Add the new nutrients to the existing progress
  progress.calories += nutrients.calories;
  progress.protein += nutrients.protein;
  progress.carbs += nutrients.carbs;
  progress.fats += nutrients.fats;

  const calorieGoal = 2000;
  const proteinGoal = 150;
  const carbsGoal = 250;
  const fatsGoal = 70;

  document.getElementById("calorie-progress").style.width = `${Math.min((progress.calories / calorieGoal) * 100, 100)}%`;
  document.getElementById("calories-consumed").innerText = progress.calories;

  document.getElementById("protein-progress").style.width = `${Math.min((progress.protein / proteinGoal) * 100, 100)}%`;
  document.getElementById("protein-consumed").innerText = progress.protein;

  document.getElementById("carbs-progress").style.width = `${Math.min((progress.carbs / carbsGoal) * 100, 100)}%`;
  document.getElementById("carbs-consumed").innerText = progress.carbs;

  document.getElementById("fats-progress").style.width = `${Math.min((progress.fats / fatsGoal) * 100, 100)}%`;
  document.getElementById("fats-consumed").innerText = progress.fats;

  // Save updated progress to local storage
  localStorage.setItem("dailyProgress", JSON.stringify(progress));
}


function loadDailyProgress() {
  const storedData = JSON.parse(localStorage.getItem("dailyProgress")) || {
    date: new Date().toDateString(),  // Initialize with today’s date
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  // Check if stored date is today’s date
  const today = new Date().toDateString();
  if (storedData.date !== today) {
    // Reset progress if date has changed
    localStorage.setItem("dailyProgress", JSON.stringify({
      date: today,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    }));
    updateProgressBars({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  } else {
    // If date is the same, load the stored progress
    updateProgressBars(storedData);
  }
}

// Handle expired tokens
function handleTokenExpiration() {
  localStorage.removeItem('token');
  window.location.href = '../Login/login.html';
}

function saveDailyProgress(calories, protein, carbs, fats) {
  const today = new Date().toDateString();

  let progress = JSON.parse(localStorage.getItem("dailyProgress")) || {
    date: today,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  // Only update the current day's values
  progress.calories += calories;
  progress.protein += protein;
  progress.carbs += carbs;
  progress.fats += fats;
  progress.date = today;

  // Save updated progress to local storage
  localStorage.setItem("dailyProgress", JSON.stringify(progress));

  // Update the progress bars immediately
  updateProgressBars(progress);
}

function updateProgressBars(progress) {
  const calorieGoal = 2000;
  const proteinGoal = 150;
  const carbsGoal = 250;
  const fatsGoal = 70;

  document.getElementById("calorie-progress").style.width = `${Math.min((progress.calories / calorieGoal) * 100, 100)}%`;
  document.getElementById("calories-consumed").innerText = progress.calories;

  document.getElementById("protein-progress").style.width = `${Math.min((progress.protein / proteinGoal) * 100, 100)}%`;
  document.getElementById("protein-consumed").innerText = progress.protein;

  document.getElementById("carbs-progress").style.width = `${Math.min((progress.carbs / carbsGoal) * 100, 100)}%`;
  document.getElementById("carbs-consumed").innerText = progress.carbs;

  document.getElementById("fats-progress").style.width = `${Math.min((progress.fats / fatsGoal) * 100, 100)}%`;
  document.getElementById("fats-consumed").innerText = progress.fats;
}