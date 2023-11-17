// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Function to dynamically update the year
  function updateYear() {
    document.getElementById("currentYear").innerText = new Date().getFullYear();
  }

  // Call the updateYear function when the DOM is loaded
  updateYear();
});

// Navbar and Footer
// Function to load the navigation bar and footer
function setActiveLink() {
  // Get the current path
  const path = window.location.pathname;
  // Extract the last directory name from the path
  const pageId = path.split("/").filter(Boolean).slice(-1)[0];

  // Set the active class on the current navigation link
  $(`a[data-page-id=${pageId}]`).addClass("active");
}

// Load the navbar and footer, then set the active link
function loadNavAndFooter() {
  $("#nav-placeholder").load("/navbar/index.html", function () {
    setActiveLink(); // Set active link after navbar is loaded
  });
  $("#footer-placeholder").load("/footer/index.html");
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", loadNavAndFooter);
