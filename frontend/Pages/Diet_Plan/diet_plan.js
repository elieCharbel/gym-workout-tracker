const mealPlan = [
  { name: 'Breakfast', items: ['Oatmeal', 'Banana'], calories: 300 },
  { name: 'Lunch', items: ['Chicken Salad'], calories: 500 },
  { name: 'Dinner', items: ['Grilled Salmon', 'Veggies'], calories: 600 }
];

const caloricGoal = 2000;
let totalCalories = 0;  // Start calories at 0

function renderDietPlan() {
  const mealPlanDiv = document.getElementById('meal-plan');
  mealPlanDiv.innerHTML = ''; // Clear any existing meals

  // Create tab structure
  const tabsHTML = `
    <ul class="nav nav-tabs" id="meal-tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="breakfast-tab" data-bs-toggle="tab" data-bs-target="#breakfast" type="button" role="tab">Breakfast</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="lunch-tab" data-bs-toggle="tab" data-bs-target="#lunch" type="button" role="tab">Lunch</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="dinner-tab" data-bs-toggle="tab" data-bs-target="#dinner" type="button" role="tab">Dinner</button>
      </li>
    </ul>
    <div class="tab-content" id="meal-tabs-content">
      <div class="tab-pane fade show active" id="breakfast" role="tabpanel"></div>
      <div class="tab-pane fade" id="lunch" role="tabpanel"></div>
      <div class="tab-pane fade" id="dinner" role="tabpanel"></div>
    </div>
  `;

  mealPlanDiv.innerHTML = tabsHTML;

  // Reference each tab's content div
  const breakfastDiv = document.getElementById('breakfast');
  const lunchDiv = document.getElementById('lunch');
  const dinnerDiv = document.getElementById('dinner');

  // Display each meal in the appropriate tab
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
        <button class="btn btn-success" onclick="markMealAsDone(${index})">Done</button>
      </div>
    `;

    if (meal.name === 'Breakfast') {
      breakfastDiv.appendChild(mealDiv);
    } else if (meal.name === 'Lunch') {
      lunchDiv.appendChild(mealDiv);
    } else if (meal.name === 'Dinner') {
      dinnerDiv.appendChild(mealDiv);
    }
  });

  document.getElementById('calorie-goal').innerText = caloricGoal;
}

function markMealAsDone(index) {
  totalCalories += mealPlan[index].calories;
  document.getElementById('calories-consumed').innerText = totalCalories;

  const calorieProgress = Math.min((totalCalories / caloricGoal) * 100, 100);
  const progressBar = document.getElementById('calorie-progress');
  progressBar.style.width = `${calorieProgress}%`;
  progressBar.setAttribute('aria-valuenow', calorieProgress);

  // Disable the "Done" button after it is clicked
  const doneButton = document.querySelectorAll(`#${mealPlan[index].name.toLowerCase()} .btn-success`)[0];
  if (doneButton) doneButton.disabled = true;
}

// Initialize the diet plan rendering
document.addEventListener('DOMContentLoaded', renderDietPlan);
