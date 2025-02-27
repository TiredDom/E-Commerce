document.addEventListener("DOMContentLoaded", function() {
    const sidebarLinks = document.querySelectorAll(".admin-sidebar a");
    const contentSections = document.querySelectorAll(".content-section");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = this.getAttribute("data-target");
        sidebarLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
        contentSections.forEach(section => {
          section.classList.remove("active");
          if (section.id === target) {
            section.classList.add("active");
          }
        });
      });
    });
    document.getElementById("logout-admin").addEventListener("click", function(e) {
      e.preventDefault();
      localStorage.removeItem("userEmail");
      window.location.href = "login.html";
    });
    let imageData = "";
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("product-image-file");
    dropZone.addEventListener("click", () => {
      fileInput.click();
    });
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("hover");
    });
    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.classList.remove("hover");
    });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("hover");
      if(e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    });
    fileInput.addEventListener("change", (e) => {
      if(e.target.files.length) {
        const file = e.target.files[0];
        handleFile(file);
      }
    });
    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageData = e.target.result;
        dropZone.innerHTML = `<img src="${imageData}" alt="Preview" style="max-width:100%; max-height:100px;" />`;
      }
      reader.readAsDataURL(file);
    }
    document.getElementById("add-product-form").addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("product-title").value;
      const price = document.getElementById("product-price").value;
      if (!imageData) {
        alert("Please select an image.");
        return;
      }
      const newProduct = { title: title, price: price, image: imageData };
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
      alert("Product added successfully!");
      loadInventory();
      this.reset();
      dropZone.innerHTML = "Drag & Drop image here or click to select";
      imageData = "";
    });
    function loadInventory() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const inventoryList = document.getElementById("inventory-list");
        if (!inventoryList) return;
        inventoryList.innerHTML = "";
        products.forEach((product, index) => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <div class="product-image-placeholder">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
              <h3 class="product-title">${product.title}</h3>
              <div class="product-footer">
                <span class="product-price">₱${product.price}</span>
                <div class="product-buttons">
                  <button class="change-name-btn" data-index="${index}">Change Name</button>
                  <button class="change-price-btn" data-index="${index}">Change Price</button>
                  <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
              </div>
            </div>
          `;
          inventoryList.appendChild(card);
        });
        
        // Attach event listeners for editing buttons:
        document.querySelectorAll(".change-name-btn").forEach(button => {
          button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            let products = JSON.parse(localStorage.getItem("products")) || [];
            let newName = prompt("Enter new product name:", products[index].title);
            if (newName) {
              products[index].title = newName;
              localStorage.setItem("products", JSON.stringify(products));
              loadInventory();
            }
          });
        });
        
        document.querySelectorAll(".change-price-btn").forEach(button => {
          button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            let products = JSON.parse(localStorage.getItem("products")) || [];
            let newPrice = prompt("Enter new product price:", products[index].price);
            if (newPrice) {
              products[index].price = newPrice;
              localStorage.setItem("products", JSON.stringify(products));
              loadInventory();
            }
          });
        });
        
        document.querySelectorAll(".remove-btn").forEach(button => {
          button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            let products = JSON.parse(localStorage.getItem("products")) || [];
            if (confirm("Are you sure you want to remove this product?")) {
              products.splice(index, 1);
              localStorage.setItem("products", JSON.stringify(products));
              loadInventory();
            }
          });
        });
      }
    loadInventory();
  });
  