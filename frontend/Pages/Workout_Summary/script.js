document.addEventListener('DOMContentLoaded', () => {
    const workoutContainer = document.getElementById('workoutContainer');
    const addDayBtn = document.getElementById('addDayBtn');

    // Add a new exercise row
    workoutContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-exercise')) {
            const dayBody = e.target.closest('.day-section').querySelector('.day-body');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td>
                    <button class="btn btn-danger btn-sm delete-row">Delete</button>
                </td>
            `;
            dayBody.appendChild(newRow);
        }
    });

    // Delete an exercise row
    workoutContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-row')) {
            e.target.closest('tr').remove();
        }
    });

    // Add a new day
    addDayBtn.addEventListener('click', () => {
        const dayCount = workoutContainer.querySelectorAll('.day-section').length + 1;
        const newDay = document.createElement('div');
        newDay.classList.add('day-section', 'mb-4');
        newDay.innerHTML = `
            <h3>Day ${dayCount}</h3>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Sets</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="day-body">
                    <tr>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-row">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button class="btn btn-primary btn-sm add-exercise">Add Exercise</button>
        `;
        workoutContainer.appendChild(newDay);
    });
});
