document.addEventListener("DOMContentLoaded", function () {
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
  
  dropZone.addEventListener("click", () => fileInput.click());
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
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageData = e.target.result;
      dropZone.innerHTML = `<img src="${imageData}" alt="Preview" style="max-width:100%; max-height:100px;" />`;
    };
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
    
    const productData = { title, price: parseFloat(price), image: imageData };
    fetch("http://localhost:8080/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(() => {
      alert("Product added successfully!");
      loadProducts();
      this.reset();
      dropZone.innerHTML = "Drag & Drop image here or click to select";
      imageData = "";
    })
    .catch(error => console.error("Error adding product:", error));
  });
  
  function loadProducts() {
    fetch("http://localhost:8080/api/products")
      .then(response => response.json())
      .then(products => {
        const inventoryList = document.getElementById("inventory-list");
        if (!inventoryList) return;
        inventoryList.innerHTML = "";
        products.forEach(product => {
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
                  <button class="edit-btn" data-id="${product.id}">Edit</button>
                  <button class="delete-btn" data-id="${product.id}">Delete</button>
                </div>
              </div>
            </div>
          `;
          inventoryList.appendChild(card);
        });
        
        document.querySelectorAll(".edit-btn").forEach(button => {
          button.addEventListener("click", editProduct);
        });
        document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", deleteProduct);
        });
      })
      .catch(error => console.error("Error loading products:", error));
  }

  function editProduct(event) {
    const productId = event.target.getAttribute("data-id");
    
    fetch(`http://localhost:8080/api/products/${productId}`)
      .then(response => response.json())
      .then(product => {
        const newTitle = prompt("Enter new product name:", product.title);
        const newPrice = prompt("Enter new product price:", product.price);
        
        if (newTitle && newPrice) {
          const updatedProduct = { 
            title: newTitle, 
            price: parseFloat(newPrice), 
            image: product.image 
          };
          
          fetch(`http://localhost:8080/api/products/update/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
          })
            .then(response => response.json())
            .then(() => {
              alert("Product updated successfully!");
              loadProducts();
            })
            .catch(error => console.error("Error updating product:", error));
        }
      })
      .catch(error => console.error("Error fetching product:", error));
  }
  
  
  function deleteProduct(event) {
    const productId = event.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8080/api/products/delete/${productId}`, {
        method: "DELETE"
      })
      .then(() => {
        alert("Product deleted successfully!");
        loadProducts();
      })
      .catch(error => console.error("Error deleting product:", error));
    }
  }
  
  loadProducts();
});

