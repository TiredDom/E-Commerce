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
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-btn").addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:8080/api/auth/login", { // Adjust the endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Login successful!");
                window.location.href = "index.html"; // Redirect to home page
            } else {
                alert("Invalid email or password.");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
