function toggleMenu() {
  const navLeft = document.querySelector(".nav-left");
  const navRight = document.querySelector(".nav-right");
  const navbar = document.querySelector(".navbar");

  navLeft.classList.toggle("show");
  navRight.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function() {
  const productCards = document.querySelectorAll('.product-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When the element is in view, add the animation class.
        entry.target.classList.add('animate');
      } else {
        // When the element is out of view, remove the animation class.
        entry.target.classList.remove('animate');
      }
    });
  }, { threshold: 0.2 });

  productCards.forEach(card => {
    observer.observe(card);
  });

  // Login functionality
  document.getElementById("login-btn").addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default form submission
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Login successful! Role: " + data.role);
              window.location.href = "index.html"; // Redirect to home page
          } else {
              alert("Login failed: " + data.message);
          }
      })
      .catch(error => console.error("Error:", error));
  });

  // Registration functionality
  document.getElementById("register-btn").addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default form submission
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password, confirmPassword })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Registration successful! Role: " + data.role);
              // Optionally switch to login form or redirect
          } else {
              alert("Registration failed: " + data.message);
          }
      })
      .catch(error => console.error("Error:", error));
  });
});
