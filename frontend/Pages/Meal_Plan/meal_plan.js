let mealPlan = [];  // Temporary storage for the meal plan in memory
let shoppingList = new Set();

// Function to add a meal to the meal plan
function addMeal() {
  const mealName = document.getElementById('meal-name').value;
  const mealItems = document.getElementById('meal-items').value.split(',').map(item => item.trim());
  const mealCalories = parseInt(document.getElementById('meal-calories').value);

  // Create meal object
  const meal = { name: mealName, items: mealItems, calories: mealCalories };
  mealPlan.push(meal);  // Add meal to the plan

  mealItems.forEach(item => shoppingList.add(item));  // Update shopping list

  // Render the meal plan
  renderMealPlan();
}

// Function to delete a meal from the meal plan
function deleteMeal(index) {
  mealPlan.splice(index, 1);  // Remove the meal from the array
  renderMealPlan();           // Re-render the meal plan
}

// Render the meal plan on the page
function renderMealPlan() {
  const generatedPlanDiv = document.getElementById('generated-plan');
  generatedPlanDiv.innerHTML = '<h3>Meals for Today</h3>';

  mealPlan.forEach((meal, index) => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('card', 'mb-3');
    mealDiv.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${meal.name}</h5>
        <ul class="list-unstyled">
          ${meal.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p class="card-text"><strong>Calories:</strong> ${meal.calories}</p>
        <button class="btn btn-danger" onclick="deleteMeal(${index})">Delete</button>
      </div>
    `;
    generatedPlanDiv.appendChild(mealDiv);
  });
}
