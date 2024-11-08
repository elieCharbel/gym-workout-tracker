/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts





// Check if user is logged in by verifying the token presence and validity
async function checkLogin() {
    console.log("checkLogin function called"); // Confirm function is called

    const token = localStorage.getItem('token');
    console.log("Token:", token); // Check if token exists

    if (!token) {
        console.log("No token found, redirecting to login page");
        alert("You are not logged in. Please log in first.");
        window.location.href = '../Login/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        console.log("Response status:", response.status); // Log response status

        if (response.status === 401) {
            console.log("Invalid token, redirecting to login page");
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem('token');
            window.location.href = '../Login/login.html';
        } else {
            console.log("Token valid, user logged in");
        }
    } catch (error) {
        console.error("Error during login verification:", error);
        alert("An error occurred. Please log in again.");
        localStorage.removeItem('token');
        window.location.href = '../Login/login.html';
    }
}

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

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
