// script.js

// Function to dynamically update the year
function updateYear() {
  document.getElementById("currentYear").innerText = new Date().getFullYear();
}

// Function to set the active link in the navbar
function setActiveLink() {
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  let pageId = segments.length === 0 ? "index" : segments.slice(-1)[0];
  pageId = pageId.replace(".html", "");
  $(`a[data-page-id='${pageId}']`).addClass("active");
}

// Initialize the navbar button functionality
function initNavbarButton() {
  const menuButton = document.getElementById("menuButton");
  const closeMenuButton = document.getElementById("closeMenuButton");
  const navMenu = document.getElementById("navMenu");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      navMenu.classList.toggle("hidden");
    });
  }

  if (closeMenuButton && navMenu) {
    closeMenuButton.addEventListener("click", function () {
      navMenu.classList.add("hidden");
    });
  }
}

// Function to update menu visibility based on screen width
function updateMenuVisibility() {
  const navMenu = document.getElementById("navMenu");
  const menuButton = document.getElementById("menuButton");

  if (window.matchMedia("(min-width: 768px)").matches) {
    navMenu.classList.add("hidden");
    menuButton.classList.add("hidden");
  } else {
    navMenu.classList.add("hidden");
    menuButton.classList.remove("hidden");
  }
}

// Load the navbar and footer, then set the active link
function loadNavAndFooter() {
  $("#nav-placeholder").load("/navbar/index.html", function () {
    setActiveLink(); // Set active link after navbar is loaded
    initNavbarButton(); // Initialize navbar button after navbar is loaded
    updateMenuVisibility(); // Update menu visibility based on current screen width
  });

  $("#footer-placeholder").load("/footer/index.html", function () {
    updateYear();
  });
}

// Load the navbar and footer when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  loadNavAndFooter();
  window.addEventListener("resize", updateMenuVisibility);
});
