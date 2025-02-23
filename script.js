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
  