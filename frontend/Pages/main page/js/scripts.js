/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts





// Check if user is logged in by verifying the token presence and validity
// Check login status by making a backend request
async function checkLogin() {
    const token = localStorage.getItem('token');
    console.log("Token found in localStorage:", token); // Debugging

    // If no token is found, redirect to login
    if (!token) {
        console.log("No token found, redirecting to login.");
        window.location.href = '../Login/login.html';
        return;
    }

    try {
        // Make a request to /api/verify to validate the token and check user existence
        const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        // If the token is expired, invalid, or the user doesn't exist, redirect to login
        if (response.status === 403 || response.status === 401) {
            console.log("Token expired, invalid, or user does not exist. Redirecting to login.");
            localStorage.removeItem('token'); // Clear the invalid token
            window.location.href = '../Login/login.html'; // Redirect to login
            return;
        } 

        if (!response.ok) {
            throw new Error('Failed to verify token and user');
        }

        // If the token and user are valid, allow the user to stay on the page
        console.log("Token and user are valid, user is logged in.");

    } catch (error) {
        console.error('Error during login check:', error);

        // Only redirect on specific authorization errors
        localStorage.removeItem('token');
        window.location.href = '../Login/login.html';
    }
}
  
  // Call checkLogin on page load
  document.addEventListener('DOMContentLoaded', checkLogin);
  




        
window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };


    document.addEventListener('DOMContentLoaded', function () {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.getElementById('navbarResponsive');
      
        // Listen for toggler button click
        navbarToggler.addEventListener('click', function () {
          // Toggle the aria-expanded attribute
          const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
          navbarToggler.setAttribute('aria-expanded', !isExpanded);
      
          // Toggle the collapse class
          navbarCollapse.classList.toggle('show');
        });
      });
      
    
    
    

});
