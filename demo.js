// demo.js - Main JavaScript for DoM Cafe
console.log("demo.js loaded");

// ========== EmailJS Configuration ==========
const EMAILJS_CONFIG = {
  publicKey: "YrtUKQg5exSUDZAZF",
  serviceId: "service_6z6jvpd",
  orderTemplateId: "__ejs-test-mail-service__",
  adminNotificationTemplateId: "__ejs-test-mail-service__"
};

// Initialize EmailJS
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log("EmailJS initialized");
  }
})();

// ========== Cart System ==========
let cart = JSON.parse(localStorage.getItem('dom_cart')) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('dom_cart', JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(itemName, price) {
  const existingItem = cart.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: itemName, price: price, quantity: 1 });
  }
  saveCart();
  alert(`${itemName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  saveCart();
  renderCart();
}

// Update item quantity
function updateQuantity(itemName, change) {
  const item = cart.find(item => item.name === itemName);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(itemName);
    } else {
      saveCart();
      renderCart();
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Render cart (for cart modal/page)
function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  
  if (!cartItemsEl) return;
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
    if (cartTotalEl) cartTotalEl.textContent = 'NPR 0';
    return;
  }
  
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">NPR ${item.price} x ${item.quantity}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.name}', 1)">+</button>
          <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.name}')">×</button>
        </div>
      </div>
    `;
  });
  
  cartItemsEl.innerHTML = html;
  if (cartTotalEl) cartTotalEl.textContent = `NPR ${getCartTotal()}`;
}

// ========== Order System ==========
let orders = JSON.parse(localStorage.getItem('dom_orders')) || [];

// Place order and send email
async function placeOrder(customerInfo) {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return false;
  }
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: customerInfo,
    items: [...cart],
    total: getCartTotal(),
    status: 'pending'
  };
  
  orders.push(order);
  localStorage.setItem('dom_orders', JSON.stringify(orders));
  
  // Send email notification
  await sendOrderEmail(order);
  
  // Clear cart
  cart = [];
  saveCart();
  
  return order.id;
}

// Send order confirmation email via EmailJS
async function sendOrderEmail(order) {
  try {
    const templateParams = {
      order_id: order.id,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      order_date: new Date(order.date).toLocaleString(),
      order_items: order.items.map(item => `${item.name} x${item.quantity} - NPR ${item.price * item.quantity}`).join('\n'),
      order_total: order.total,
      to_email: order.customer.email
    };
    
    // Send to customer
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.orderTemplateId,
      templateParams
    );
    
    console.log('Order email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// ========== Authentication System ==========
// Demo users - in production, use a proper backend
const users = {
  'admin@dom.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'user@dom.com': { password: 'user123', role: 'user', name: 'Regular User' }
};

let currentUser = JSON.parse(sessionStorage.getItem('dom_current_user')) || null;

// Login function
function login(email, password, callback) {
  const user = users[email];
  
  if (user && user.password === password) {
    currentUser = { email, role: user.role, name: user.name };
    sessionStorage.setItem('dom_current_user', JSON.stringify(currentUser));
    if (callback) callback(true);
    return true;
  }
  
  if (callback) callback(false);
  return false;
}

// Logout function
function logout() {
  currentUser = null;
  sessionStorage.removeItem('dom_current_user');
  window.location.href = 'index.html';
}

// Check if user is admin
function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

// Check if user is logged in
function isLoggedIn() {
  return currentUser !== null;
}

// Get user role
function getUserRole() {
  return currentUser ? currentUser.role : null;
}

// ========== Preloader ==========
function removePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.style.transition = "opacity 0.5s";
  preloader.style.opacity = "0";
  setTimeout(() => preloader.remove(), 500);
}

window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3000);

// ========== Chat Widget ==========
function initChatWidget() {
  const toggleBtn = document.getElementById("chat-toggle");
  const widget = document.getElementById("chat-widget");
  const closeBtn = document.getElementById("chat-close");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const messagesEl = document.getElementById("chat-messages");

  if (!toggleBtn || !widget || !input || !sendBtn || !messagesEl) return;

  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className =
      role === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-bot";
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setOpen(isOpen) {
    widget.setAttribute("data-open", isOpen ? "true" : "false");
    widget.style.display = isOpen ? "flex" : "none";
    if (!isOpen) return;
    setTimeout(() => input.focus(), 50);
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = widget.getAttribute("data-open") === "true";
    setOpen(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => setOpen(false));
  }

  async function send() {
    const message = (input.value || "").trim();
    if (!message) return;

    input.value = "";
    addMessage(message, "user");

    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg chat-msg-bot";
    typingEl.textContent = "Typing...";
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      typingEl.remove();
      addMessage(data.reply || "Sorry, I couldn't respond right now.", "bot");
    } catch (err) {
      typingEl.remove();
      addMessage("Network error. Try again in a moment.", "bot");
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  if (messagesEl.children.length === 0) {
    addMessage(
      "Hi! Ask me about the menu, prices, or contact info.",
      "bot"
    );
  }

  setOpen(false);
}

document.addEventListener("DOMContentLoaded", function() {
  initChatWidget();
  updateCartCount();
  
  // Show/hide admin link based on login status
  const adminLink = document.getElementById('admin-link');
  if (adminLink) {
    adminLink.style.display = isAdmin() ? 'block' : 'none';
  }
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartTotal = getCartTotal;
window.placeOrder = placeOrder;
window.login = login;
window.logout = logout;
window.isAdmin = isAdmin;
window.isLoggedIn = isLoggedIn;
window.getUserRole = getUserRole;
window.renderCart = renderCart;

/* ---- End of demo.js ---- */
