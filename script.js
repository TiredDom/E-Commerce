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
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }, { threshold: 0.2 });
  productCards.forEach(card => {
    observer.observe(card);
  });

  function loadProductsFromStorage() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productGrid = document.querySelector(".product-grid");
    if (!productGrid) return;
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-placeholder">
          <img src="${product.image}" alt="${product.title}" />
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-footer">
            <span class="product-price">₱${product.price}</span>
            <div class="product-buttons">
              <button class="add-to-cart-btn">Add to Cart</button>
              <button class="buy-btn">Buy</button>
            </div>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
      observer.observe(card); // Observe the new card for animation
    });
  }
  loadProductsFromStorage();
  
  var userEmail = localStorage.getItem("userEmail");
  var userIcon = document.getElementById("user-icon");
  var dropdown = document.getElementById("user-dropdown");
  if (userEmail && userIcon && dropdown) {
    userIcon.removeAttribute("href");
    document.getElementById("user-email").textContent = userEmail;
    userIcon.addEventListener("click", function(e) {
      e.preventDefault();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
  } else if (userIcon) {
    userIcon.setAttribute("href", "login.html");
  }
  var logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      localStorage.removeItem("userEmail");
      dropdown.style.display = "none";
      window.location.href = "index.html";
    });
  }
  document.getElementById("login-btn").addEventListener("click", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("userEmail", email);
        alert("Login successful! Role: " + data.role);
        if (data.role === "ADMIN") {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        alert("Login failed: " + data.message);
      }
    })
    .catch(error => console.error("Error:", error));
  });
  document.getElementById("register-btn").addEventListener("click", function(event) {
    event.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;
    fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("check").checked = false;
      } else {
        alert("Registration failed: " + data.message);
      }
    })
    .catch(error => console.error("Error:", error));
  });
});
