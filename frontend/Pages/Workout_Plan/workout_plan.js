window.onload = function() {
    const experienceDropdown = document.getElementById('experience-level');
    const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
    
    // Populate dropdown with experience levels
    experienceLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        experienceDropdown.appendChild(option);
    });
    
    // Show modal
    document.getElementById('modal').classList.add('active');
};

// Function to close modal and show selected experience level
function closeModal() {
    const selectedLevel = document.getElementById('experience-level').value;
    alert(`Hello, ${selectedLevel}`);
    document.getElementById('modal').classList.remove('active');
}
