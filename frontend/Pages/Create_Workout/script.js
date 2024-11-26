document.getElementById('setupPlan').addEventListener('click', function () {
    const daysInput = document.getElementById('days');
    const days = parseInt(daysInput.value, 10);
    const workoutPlanContainer = document.getElementById('workoutPlan');
    const viewWorkoutLink = document.getElementById('viewWorkout');

    // Reset the workout plan and hide the "View Workout" button
    workoutPlanContainer.innerHTML = '';
    viewWorkoutLink.style.display = "none";

    // Validate the number of days
    if (isNaN(days) || days < 1 || days > 7) {
        alert('Please enter a valid number of days between 1 and 7.');
        return;
    }

    // Show the "View Workout" button after validation
    viewWorkoutLink.style.display = "block";

    // Generate workout plans for the specified number of days but only show Day 1 initially
    for (let i = 1; i <= days; i++) {
        const card = document.createElement('div');
        card.className = `card mb-3 day-card`;
        card.style.display = i === 1 ? 'block' : 'none'; // Show only Day 1 initially

        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <input type="text" class="form-control w-75" value="Day ${i}" />
                <button class="btn btn-sm btn-danger remove-day">Remove</button>
            </div>
            <div class="card-body">
                <div class="exercises sortable"></div>
                <button type="button" class="btn btn-secondary w-100 add-exercise">➕ Add Exercise</button>
            </div>
        `;
        workoutPlanContainer.appendChild(card);

        // Add drag-and-drop functionality for exercises
        new Sortable(card.querySelector('.sortable'), {
            animation: 150,
            ghostClass: 'sortable-ghost',
            group: 'shared',
        });

        // Add exercise logic
        const addExerciseBtn = card.querySelector('.add-exercise');
        addExerciseBtn.addEventListener('click', function () {
            const exercisesDiv = card.querySelector('.exercises');
            const exerciseRow = document.createElement('div');
            exerciseRow.className = 'exercise-row d-flex align-items-center mb-2';

            exerciseRow.innerHTML = `
                <input type="text" class="form-control me-2" placeholder="Exercise name">
                <div class="d-flex align-items-center me-2">
                    <label class="me-1">Sets</label>
                    <button class="btn btn-sm btn-outline-secondary decrement">–</button>
                    <input type="number" class="form-control text-center mx-1" value="1" min="1">
                    <button class="btn btn-sm btn-outline-secondary increment">+</button>
                </div>
                <div class="d-flex align-items-center me-2">
                    <label class="me-1">Reps</label>
                    <button class="btn btn-sm btn-outline-secondary decrement">–</button>
                    <input type="number" class="form-control text-center mx-1" value="1" min="1">
                    <button class="btn btn-sm btn-outline-secondary increment">+</button>
                </div>
                <button class="btn btn-sm btn-danger remove-exercise">❌</button>
            `;
            exercisesDiv.appendChild(exerciseRow);

            // Increment and decrement logic
            exerciseRow.querySelectorAll('.increment').forEach(btn => {
                btn.addEventListener('click', function () {
                    const input = this.previousElementSibling;
                    input.value = parseInt(input.value) + 1;
                });
            });

            exerciseRow.querySelectorAll('.decrement').forEach(btn => {
                btn.addEventListener('click', function () {
                    const input = this.nextElementSibling;
                    if (parseInt(input.value) > 1) input.value -= 1;
                });
            });

            // Remove exercise logic
            exerciseRow.querySelector('.remove-exercise').addEventListener('click', function () {
                exerciseRow.remove();
            });
        });

        // Remove day logic
        card.querySelector('.remove-day').addEventListener('click', function () {
            card.remove();
        });
    }

    // Add button to reveal additional days
    const revealDaysButton = document.createElement('button');
    revealDaysButton.textContent = "Reveal Next Day";
    revealDaysButton.className = "btn btn-success mt-4 w-100";
    workoutPlanContainer.appendChild(revealDaysButton);

    let currentDay = 1;
    revealDaysButton.addEventListener('click', function () {
        currentDay++;
        const nextCard = workoutPlanContainer.querySelector(`.day-card:nth-child(${currentDay})`);
        if (nextCard) {
            nextCard.style.display = 'block'; // Show the next day
        }

        // Hide the button if all days are displayed
        if (currentDay === days) {
            revealDaysButton.style.display = 'none';
        }
    });
});
