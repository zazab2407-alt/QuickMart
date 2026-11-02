// 1. Objects & Classes
class Product {
  constructor(id, name, price, category, stock, emoji) {
    this.id       = id;
    this.name     = name;
    this.price    = Number(price);
    this.category = category;
    this.stock    = Number(stock);
    this.emoji    = emoji || "📦";
  }
}

class Order {
  constructor(id, items, total, date) {
    this.id    = id;
    this.items = items;
    this.total = total;
    this.date  = date;
  }
}


let products = []; 
let cart     = []; 
let orders   = []; 


// localStorage 
function saveData() {
  localStorage.setItem("sm_products", JSON.stringify(products)); 
  localStorage.setItem("sm_cart",     JSON.stringify(cart));     
  localStorage.setItem("sm_orders",   JSON.stringify(orders));  
}


const defaultProducts = [
  new Product("p1",  "Fresh Milk",     1.50, "Dairy",  80,  "🥛"), // REQUIREMENT 1: new Product()
  new Product("p2",  "Cheddar Cheese", 3.20, "Dairy",  40,  "🧀"), // REQUIREMENT 1: new Product()
  new Product("p3",  "Greek Yogurt",   2.00, "Dairy",  55,  "🍶"), // REQUIREMENT 1: new Product()
  new Product("p4",  "Red Apples",     0.99, "Fruits", 120, "🍎"), // REQUIREMENT 1: new Product()
  new Product("p5",  "Bananas",        0.75, "Fruits", 90,  "🍌"), // REQUIREMENT 1: new Product()
  new Product("p6",  "Strawberries",   2.50, "Fruits", 60,  "🍓"), // REQUIREMENT 1: new Product()
  new Product("p7",  "Oranges",        1.20, "Fruits", 70,  "🍊"), // REQUIREMENT 1: new Product()
  new Product("p8",  "White Bread",    1.80, "Bakery", 50,  "🍞"), // REQUIREMENT 1: new Product()
  new Product("p9",  "Croissant",      0.90, "Bakery", 35,  "🥐"), // REQUIREMENT 1: new Product()
  new Product("p10", "Bagel",          1.10, "Bakery", 45,  "🥯"), // REQUIREMENT 1: new Product()
  new Product("p11", "Coca Cola 1L",   1.50, "Drinks", 100, "🥤"), // REQUIREMENT 1: new Product()
  new Product("p12", "Orange Juice",   2.20, "Drinks", 65,  "🍹"), // REQUIREMENT 1: new Product()
  new Product("p13", "Water Bottle",   0.50, "Drinks", 200, "💧"), // REQUIREMENT 1: new Product()
  new Product("p14", "Potato Chips",   1.30, "Snacks", 80,  "🍿"), // REQUIREMENT 1: new Product()
  new Product("p15", "Chocolate Bar",  0.80, "Snacks", 110, "🍫"), // REQUIREMENT 1: new Product()
];


// ---- REQUIREMENT 6: localStorage — تحميل البيانات ----
// REQUIREMENT 9: try/catch — لو البيانات المحفوظة اتخربت متوقفش
function loadData() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem("sm_products")); 
    const savedCart     = JSON.parse(localStorage.getItem("sm_cart"));     
    const savedOrders   = JSON.parse(localStorage.getItem("sm_orders"));  

    // REQUIREMENT 8: Conditional — لو مفيش بيانات محفوظة حمّل الافتراضية
    if (savedProducts && savedProducts.length > 0) {
      products = savedProducts; 
    } else {
      products = defaultProducts; 
      saveData(); 
    }

    if (savedCart)   cart   = savedCart;   
    if (savedOrders) orders = savedOrders; 

  } catch (error) {
    console.error("Error loading data:", error);
    products = defaultProducts;
    cart = [];
    orders = [];
  }
}


// Cookies End After 1 year
function setCookie(name, value) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}


function getCookie(name) {
  const cookies = document.cookie.split("; "); 
  for (let c of cookies) {
    const parts = c.split("=");
    if (parts[0] === name) return parts[1]; 
  }
  return null;
}

function applyTheme() {
  const theme = getCookie("sm_theme") || "light"; 
  if (theme === "dark") {
    document.body.classList.add("dark");                               
    document.getElementById("themeBtn").textContent = "☀️ Light Mode"; 
  } else {
    document.body.classList.remove("dark");                             
    document.getElementById("themeBtn").textContent = "🌙 Dark Mode";  
  }
}

function applyUsername() {
  const name = getCookie("sm_username") || "Guest";                  
  document.getElementById("userBadge").textContent    = "👤 " + name; 
  document.getElementById("usernameInput").value = name !== "Guest" ? name : "";
}


// Functions 

function generateId() {
  return Date.now().toString();
}

// REQUIREMENT 5: arrow function — بتعرض رسالة وبتختفي بعد 2.5 ثانية
// REQUIREMENT 10: Dynamic UI — user feedback فوري
const showToast = (message, type = "") => {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className   = "toast " + type; 
  setTimeout(() => { toast.className = "toast hidden"; }, 2500);
};

const getCartTotal = () => {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0); 
};


const getCartItemCount = () => {
  return cart.reduce((count, item) => count + item.qty, 0); 
};

function updateCartBadge() {
  const count = getCartItemCount();
  document.getElementById("cartCount").textContent = "🛒 Cart: " + count + " items"; 
}


function showError(elementId, message) {
  const el = document.getElementById(elementId); 
  el.textContent = message;
  el.classList.remove("hidden"); 
}

const hideError = (elementId) => {
  document.getElementById(elementId).classList.add("hidden");
};


//  Validation ----
function validateProduct(name, price, category, stock) {
  if (!name.trim())           return "Product name is required.";          
  if (name.trim().length < 2) return "Name must be at least 2 characters."; 
  if (!price || price <= 0)   return "Price must be greater than 0.";      
  if (!category)              return "Please select a category.";          
  if (!stock || stock < 1)    return "Stock must be at least 1.";           
  return null; 
}



function renderProducts(list = products) {
  const container = document.getElementById("productsList"); 
  const countEl   = document.getElementById("productCount"); 

  countEl.textContent = list.length + " products found"; 
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-msg">No products found.</p>'; 
    return;
  }

 
  container.innerHTML = list.map(product => {
    const outOfStock = product.stock === 0;
    const cardClass  = outOfStock ? "product-card out-of-stock" : "product-card";
    const btnText    = outOfStock ? "Out of Stock" : "Add to Cart 🛒";
    return `
      <div class="${cardClass}">
        <div class="emoji">${product.emoji}</div>
        <div class="name">${product.name}</div>
        <div class="price">$${product.price.toFixed(2)}</div>
        <div class="category">${product.category}</div>
        <div class="stock">Stock: ${product.stock}</div>
        <button class="btn-small add-btn" onclick="addToCart('${product.id}')" ${outOfStock ? "disabled" : ""}>${btnText}</button>
      </div>
    `;
  }).join(""); 
}


function renderCart() {
  const container = document.getElementById("cartItems");   
  const summaryEl = document.getElementById("cartSummary"); 

  if (cart.length === 0) { 
    container.innerHTML = '<p class="empty-msg">Your cart is empty. Add some products!</p>'; 
    summaryEl.classList.add("hidden"); 
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span style="font-size:1.5rem">${item.emoji}</span>
      <span class="ci-name">${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', +1)">+</button>
      </div>
      <span class="ci-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="btn-small btn-red" onclick="removeFromCart('${item.id}')">🗑️</button>
    </div>
  `).join(""); 

  summaryEl.classList.remove("hidden");                                                     
  document.getElementById("totalItems").textContent = getCartItemCount();                     
  document.getElementById("totalPrice").textContent = "$" + getCartTotal().toFixed(2);       
}

function renderOrders() {
  const container = document.getElementById("ordersList"); 
  const countEl   = document.getElementById("orderCount"); 

  countEl.textContent = orders.length + " orders";

  if (orders.length === 0) { 
    container.innerHTML = '<p class="empty-msg">No orders yet. Go shopping!</p>'; 
    return;
  }

  container.innerHTML = orders.slice().reverse().map(order => {
    const itemsList = order.items.map(i => `${i.emoji} ${i.name} x${i.qty}`).join(", "); 
    return `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">${order.date}</span>
          <span class="order-total">Total: $${order.total.toFixed(2)}</span>
        </div>
        <div class="order-items">${itemsList}</div>
      </div>
    `;
  }).join(""); 
}

function renderAdminProducts() {
  const container = document.getElementById("adminProductsList"); 

  if (products.length === 0) { 
    container.innerHTML = '<p class="empty-msg">No products added yet.</p>'; 
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="cart-item">
      <span>${p.emoji} <strong>${p.name}</strong></span>
      <span style="color:var(--accent)">$${p.price.toFixed(2)}</span>
      <span style="color:var(--text2)">${p.category}</span>
      <span style="color:var(--text2)">Stock: ${p.stock}</span>
      <button class="btn-small btn-red" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
    </div>
  `).join(""); 
}

function addProduct() {
  try {
    const name     = document.getElementById("prodName").value;
    const price    = document.getElementById("prodPrice").value;
    const category = document.getElementById("prodCategory").value;
    const stock    = document.getElementById("prodStock").value;
    const emoji    = document.getElementById("prodEmoji").value || "📦";

    const error = validateProduct(name, price, category, stock); 
    if (error) {
      showError("adminError", "⚠️ " + error); 
      return;
    }
    hideError("adminError");

    const newProduct = new Product(generateId(), name.trim(), price, category, stock, emoji); 
    products.push(newProduct); 
    saveData();               

    renderProducts();      
    renderAdminProducts(); 

    showToast("✅ " + newProduct.name + " added!", "green"); 

    document.getElementById("prodName").value     = "";
    document.getElementById("prodPrice").value    = "";
    document.getElementById("prodCategory").value = "";
    document.getElementById("prodStock").value    = "";
    document.getElementById("prodEmoji").value    = "";

  } catch (error) {
    console.error("addProduct error:", error);          
    showToast("❌ Something went wrong!", "red");      
  }
}

function deleteProduct(id) {
  try {
    const product = products.find(p => p.id === id); 
    if (!product) throw new Error("Product not found"); 

    products = products.filter(p => p.id !== id); 
    saveData();

    renderProducts();     
    renderAdminProducts(); 

    showToast("🗑️ " + product.name + " deleted.", "red"); 

  } catch (error) {
    console.error("deleteProduct error:", error);
    showToast("❌ Could not delete product.", "red");
  }
}

function addToCart(productId) {
  try {
    const product = products.find(p => p.id === productId); 
    if (!product) throw new Error("Product not found");     

    if (product.stock === 0) {
      showToast("❌ Out of stock!", "red");
      return;
    }

    const existingItem = cart.find(item => item.id === productId); 

    if (existingItem) {
      existingItem.qty++; 
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 }); 
    }

    product.stock--;  
    saveData();       

    renderProducts();  
    renderCart();      
    updateCartBadge(); 

    showToast("✅ " + product.name + " added to cart!", "green"); 

  } catch (error) {
    console.error("addToCart error:", error); 
    showToast("❌ Could not add to cart.", "red");
  }
}


function changeQty(itemId, change) {
  const item    = cart.find(i => i.id === itemId);     
  const product = products.find(p => p.id === itemId); 
  if (!item || !product) return;

  if (change === +1) {
    if (product.stock === 0) {
      showToast("❌ No more stock!", "red");
      return;
    }
    item.qty++;
    product.stock--;
  } else if (change === -1) {
    item.qty--;
    product.stock++;
    if (item.qty === 0) {
      cart = cart.filter(i => i.id !== itemId); // REQUIREMENT 2: filter() — شيله من الكارت
    }
  }

  saveData();        
  renderProducts();  
  renderCart();      
  updateCartBadge(); 
}


function removeFromCart(itemId) {
  const item    = cart.find(i => i.id === itemId);     // REQUIREMENT 2: find()
  const product = products.find(p => p.id === itemId); // REQUIREMENT 2: find()
  if (!item) return;

  if (product) product.stock += item.qty; // رجّع الستوك
  cart = cart.filter(i => i.id !== itemId); // REQUIREMENT 2: filter()

  saveData();       
  renderProducts();  
  renderCart();      
  updateCartBadge(); 

  showToast("🗑️ Item removed.", "red"); 
}


function checkout() {
  try {
    if (cart.length === 0) { 
      showToast("⚠️ Your cart is empty!", "red"); // REQUIREMENT 10: user feedback
      return;
    }

    const total = getCartTotal();
    const date  = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    const newOrder = new Order(generateId(), [...cart], total, date); // REQUIREMENT 1: new Order()
    orders.push(newOrder); // REQUIREMENT 2: push()
    cart = [];

    saveData();        
    renderCart();      
    renderOrders();    
    updateCartBadge(); 

    showToast("🎉 Order placed successfully!", "green"); 

  } catch (error) {
    console.error("checkout error:", error); 
    showToast("❌ Checkout failed.", "red");
  }
}

function clearCart() {
  if (cart.length === 0) { showToast("Cart is already empty!", "red"); return; } // REQUIREMENT 8: Validation
  if (!confirm("Clear all items from cart?")) return;

  cart.forEach(item => { // REQUIREMENT 2: forEach()
    const product = products.find(p => p.id === item.id); // REQUIREMENT 2: find()
    if (product) product.stock += item.qty;
  });

  cart = [];
  saveData();       
  renderProducts();  
  renderCart();     
  updateCartBadge(); 

  showToast("🗑️ Cart cleared.", "red"); 
}


function saveUsername() {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) { showToast("⚠️ Please enter your name.", "red"); return; } // REQUIREMENT 8: Validation

  setCookie("sm_username", name); 
  applyUsername();               

  const msg = document.getElementById("settingsMsg");
  msg.textContent = "✅ Name saved!";
  msg.classList.remove("hidden");                                   
  setTimeout(() => msg.classList.add("hidden"), 3000);             

  showToast("✅ Name saved!", "green"); // REQUIREMENT 10: user feedback
}

function clearAllData() {
  if (!confirm("Delete ALL data?")) return;

  products = []; cart = []; orders = [];

  localStorage.removeItem("sm_products"); 
  localStorage.removeItem("sm_cart");     
  localStorage.removeItem("sm_orders");   

  renderProducts();      
  renderCart();          
  renderOrders();        
  renderAdminProducts(); 
  updateCartBadge();     
  showToast("🗑️ All data cleared.", "red"); 
}


// Event Listeners ----

document.addEventListener("DOMContentLoaded", () => { 

  loadData();       
  applyTheme(); 
  applyUsername();  

  renderProducts();     
  renderCart();          
  renderOrders();        
  renderAdminProducts();
  updateCartBadge();    

  //  click event — التنقل بين التابات
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => { 
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active")); 
      document.querySelectorAll(".tab").forEach(t => { t.classList.remove("active"); t.classList.add("hidden"); });
      btn.classList.add("active"); 
      const tab = document.getElementById("tab-" + btn.dataset.tab);
      if (tab) { tab.classList.remove("hidden"); tab.classList.add("active"); } 
    });
  });

  document.getElementById("themeBtn").addEventListener("click", () => { 
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    document.body.classList.toggle("dark");                 
    setCookie("sm_theme", newTheme);                         
    document.getElementById("themeBtn").textContent = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"; 
    showToast(newTheme === "dark" ? "🌙 Dark mode on" : "☀️ Light mode on"); 
  });

  document.getElementById("addProductBtn").addEventListener("click", addProduct);  
  document.getElementById("checkoutBtn").addEventListener("click", checkout);      
  document.getElementById("clearCartBtn").addEventListener("click", clearCart);    
  document.getElementById("saveNameBtn").addEventListener("click", saveUsername);  
  document.getElementById("clearAllBtn").addEventListener("click", clearAllData);  

  
  document.getElementById("searchInput").addEventListener("input", filterProducts); 

  document.getElementById("categoryFilter").addEventListener("change", filterProducts); 

  document.getElementById("usernameInput").addEventListener("keydown", (e) => { 
    if (e.key === "Enter") saveUsername(); 
  });

  document.addEventListener("keydown", (e) => { 
    if (e.key === "Escape") console.log("Escape pressed");
  });

  function filterProducts() {
    const searchText = document.getElementById("searchInput").value.toLowerCase().trim();
    const category   = document.getElementById("categoryFilter").value;

    const filtered = products.filter(p => { 
      const matchSearch   = p.name.toLowerCase().includes(searchText); 
      const matchCategory = category ? p.category === category : true; 
      return matchSearch && matchCategory;
    });

    renderProducts(filtered); 
  }

});