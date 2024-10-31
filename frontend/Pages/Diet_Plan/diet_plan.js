// Temporary meal plan data in memory, shared from meal_plan.js
const mealPlan = [
    { name: 'Breakfast', items: ['Oatmeal', 'Banana'], calories: 300 },
    { name: 'Lunch', items: ['Chicken Salad'], calories: 500 },
    { name: 'Dinner', items: ['Grilled Salmon', 'Veggies'], calories: 600 }
  ];
  
  // Caloric goal for the day
  const caloricGoal = 2000;
  
  // Function to render the daily diet plan and progress
  function renderDietPlan() {
    const mealPlanDiv = document.getElementById('meal-plan');
    mealPlanDiv.innerHTML = ''; // Clear any existing meals
  
    // Display each meal in the plan
    mealPlan.forEach(meal => {
      const mealDiv = document.createElement('div');
      mealDiv.classList.add('col-md-4', 'mb-3');
      mealDiv.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${meal.name}</h5>
            <ul class="list-unstyled">
              ${meal.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p class="card-text"><strong>Calories:</strong> ${meal.calories}</p>
          </div>
        </div>
      `;
      mealPlanDiv.appendChild(mealDiv);
    });
  
    // Calculate total calories consumed and update the calorie progress
    const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0);
    document.getElementById('calories-consumed').innerText = totalCalories;
    document.getElementById('calorie-goal').innerText = caloricGoal;
  
    // Update the progress bar
    const calorieProgress = Math.min((totalCalories / caloricGoal) * 100, 100);
    const progressBar = document.getElementById('calorie-progress');
    progressBar.style.width = `${calorieProgress}%`;
    progressBar.setAttribute('aria-valuenow', calorieProgress);
  }
  
  // Initialize the diet plan rendering
  document.addEventListener('DOMContentLoaded', renderDietPlan);
  