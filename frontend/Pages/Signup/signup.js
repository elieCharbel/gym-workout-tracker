// public/js/signup.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent page reload
  
      // Collect form data
      const formData = {
        firstName: document.getElementById('Fname').value,
        lastName: document.getElementById('Lname').value,
        gender: document.getElementById('Gender').value,
        age: document.getElementById('age').value,
        phone: document.getElementById('Phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('pwd').value,
      };
  
      try {
        // Send data to the backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        // Handle success or failure
        if (response.ok) {
        //   alert('Registration successful!');
          window.location.href = '../Login/login.html'; // Redirect to login page
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });
  