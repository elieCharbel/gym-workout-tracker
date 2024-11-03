// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent page reload
  
      // Gather form data
      const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('pwd').value,
      };
  
      try {
        // Send data to the backend
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        // Check if login was successful
        if (response.ok) {
          const data = await response.json();
        //   alert('Login successful!');
          window.location.href = '../main page/main.html'; // Redirect after login
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });
  