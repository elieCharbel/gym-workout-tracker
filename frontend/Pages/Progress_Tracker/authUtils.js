function handleTokenExpiration() {
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "login.html"; // Adjust the path if needed
  }
  