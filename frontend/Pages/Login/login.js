// login.js

// Function to log in the user
async function loginUser(email, password) {
  try {
      // Send data to the backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
      });

      // Check if login was successful
      if (response.ok) {
          const data = await response.json();
          const token = data.token; // Get the token from the response

          // Store the token in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('profileSetupComplete', data.profileSetupComplete);
          // Redirect to the main page
          window.location.href = '../main page/main.html';
      } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent page reload

      // Gather form data
      const email = document.getElementById('email').value;
      const password = document.getElementById('pwd').value;

      // Call loginUser with the form data
      loginUser(email, password);
  });
});
