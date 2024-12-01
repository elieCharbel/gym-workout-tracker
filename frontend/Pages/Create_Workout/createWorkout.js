document.addEventListener('DOMContentLoaded', () => {
    const setupPlanButton = document.getElementById('setupPlan');
    const savePlanButton = document.getElementById('viewWorkout');
    const workoutPlanContainer = document.getElementById('workoutPlan');
  
    setupPlanButton.addEventListener('click', () => {
      const planName = document.getElementById('planName').value;
      const goal = document.getElementById('goal').value;
      const durationWeeks = parseInt(document.getElementById('durationWeeks').value, 10);
      const numberOfDays = parseInt(document.getElementById('days').value, 10);
  
      if (!planName || !goal || !durationWeeks || !numberOfDays) {
        alert('Please fill in all the required fields.');
        return;
      }
  
      if (numberOfDays < 1 || numberOfDays > 7) {
        alert('Number of days must be between 1 and 7.');
        return;
      }
  
      // Clear previous plan setup
      workoutPlanContainer.innerHTML = '';
  
      // Generate cards for each day
      for (let i = 1; i <= numberOfDays; i++) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('card', 'mb-3');
        dayCard.innerHTML = `
          <div class="card-header">
            <h5 class="mb-0">Day ${i}</h5>
          </div>
          <div class="card-body">
            <button type="button" class="btn btn-secondary add-exercise">Add Exercise</button>
            <div class="exercises-list mt-3"></div>
          </div>
        `;
        workoutPlanContainer.appendChild(dayCard);
      }
  
      savePlanButton.style.display = 'block';
    });
  
    workoutPlanContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-exercise')) {
          const exerciseDropdown = `
            <select class="form-select" required>
              ${await fetchExercises()}
            </select>
          `;
      
          const exerciseRow = document.createElement('div');
          exerciseRow.classList.add('exercise-row', 'd-flex', 'align-items-center', 'mt-2');
          exerciseRow.innerHTML = `
            ${exerciseDropdown}
            <div class="mx-2">
              <label class="form-label mb-0">Sets</label>
              <input type="number" placeholder="3" min="1" class="form-control" style="width: 60px;" />
            </div>
            <div class="mx-2">
              <label class="form-label mb-0">Reps</label>
              <input type="number" placeholder="10" min="1" class="form-control" style="width: 60px;" />
            </div>
            <button class="btn btn-danger remove-exercise ms-2">Remove</button>
          `;
      
          e.target.nextElementSibling.appendChild(exerciseRow);
        }
      
        if (e.target.classList.contains('remove-exercise')) {
          e.target.parentElement.remove();
        }
      });
  
    async function fetchExercises() {
      try {
        const response = await fetch('http://localhost:5000/api/workout-plans/exercises', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
  
        if (!response.ok) throw new Error('Failed to fetch exercises.');
  
        const exercises = await response.json();
    return exercises.map(
      (exercise) =>
        `<option value="${exercise.exercise_id}">${exercise.name} (${exercise.muscle_group})</option>`
    ).join('');
      } catch (error) {
        console.error('Error fetching exercises:', error);
        return '<option>Error loading exercises</option>';
      }
    }
  });
  
 
  function validateWorkoutPlan() {
    const days = document.querySelectorAll('.day');
    for (let day of days) {
      const exercises = day.querySelectorAll('.exercise-row');
      if (exercises.length === 0) {
        alert(`Please add at least one exercise for Day ${day.getAttribute('data-day')}`);
        return false;
      }
    }
    return true;
  }
  
  
  document.getElementById('submit-plan').addEventListener('click', async () => {
    // Validate inputs
    if (!validateWorkoutPlan()) return;
  
    const days = document.querySelectorAll('.card');
    const planData = {
      planName: document.getElementById('planName').value,
      goal: document.getElementById('goal').value,
      durationWeeks: document.getElementById('durationWeeks').value,
      days: [],
    };
  
    days.forEach((day, index) => {
      const exercises = [];
      const exerciseRows = day.querySelectorAll('.exercise-row');
      exerciseRows.forEach((row) => {
        const exerciseId = row.querySelector('select').value;
        const sets = row.querySelector('input[placeholder="3"]').value;
        const reps = row.querySelector('input[placeholder="10"]').value;
        exercises.push({ exerciseId, sets, reps });
      });
  
      planData.days.push({
        dayNo: index + 1,
        exercises,
      });
    });
  
    try {
      const response = await fetch('http://localhost:5000/api/workout-plans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(planData),
      });
  
      if (response.ok) {
        alert('Workout Plan Created Successfully!');
        document.getElementById('submit-plan').disabled = true;

        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting workout plan:', error);
      alert('Failed to submit workout plan.');
    }
  });
  