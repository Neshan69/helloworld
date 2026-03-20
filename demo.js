// smoke test
console.log("demo.js loaded");

// Small site JS:
// - Remove preloader if present
// - Chat widget: sends user messages to POST /api/chat and displays replies

function removePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.style.transition = "opacity 0.5s";
  preloader.style.opacity = "0";
  setTimeout(() => preloader.remove(), 500);
}

window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3000);

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

document.addEventListener("DOMContentLoaded", initChatWidget);

/*
// Small site JS:
// - Remove preloader if present
// - Chat widget: sends user messages to POST /api/chat and displays replies

function removePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.style.transition = "opacity 0.5s";
  preloader.style.opacity = "0";
  setTimeout(() => preloader.remove(), 500);
}

window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3000);

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

  // Welcome message
  if (messagesEl.children.length === 0) {
    addMessage("Hi! Ask me about the menu, prices, or contact info.", "bot");
  }

  // Start closed by default
  setOpen(false);
}

document.addEventListener("DOMContentLoaded", initChatWidget);

// Small site JS:
// - Remove preloader if present
// - Chat widget: sends user messages to POST /api/chat and displays replies

function removePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  // Graceful fade-out
  preloader.style.transition = "opacity 0.5s";
  preloader.style.opacity = "0";
  setTimeout(() => preloader.remove(), 500);
}

window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3000);

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
    div.className = role === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-bot";
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = widget.getAttribute("data-open") === "true";
    widget.setAttribute("data-open", isOpen ? "false" : "true");
    widget.style.display = isOpen ? "none" : "flex";

    // Focus input when opened
    if (!isOpen) setTimeout(() => input.focus(), 50);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      widget.setAttribute("data-open", "false");
      widget.style.display = "none";
      toggleBtn.focus();
    });
  }

  async function send() {
    const message = (input.value || "").trim();
    if (!message) return;

    input.value = "";
    addMessage(message, "user");

    addMessage("Typing...", "bot");
    const typingEl = messagesEl.lastElementChild;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (typingEl) typingEl.remove();
      addMessage(data.reply || "Sorry, I couldn't respond right now.", "bot");
    } catch (err) {
      if (typingEl) typingEl.remove();
      addMessage("Network error. Try again in a moment.", "bot");
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  // Welcome message (shown only once)
  if (messagesEl.children.length === 0) {
    addMessage("Hi! Ask me about the menu, prices, or contact info.", "bot");
  }

  // Start closed by default
  widget.style.display = "none";
  widget.setAttribute("data-open", "false");
}

document.addEventListener("DOMContentLoaded", initChatWidget);


// ---- Resolve duplicate declarations, ensure preloader removes even if 'load' never fires (failsafe) ----

const btn      = document.getElementById('btn');
const mylist   = document.getElementById('mylist');
let   count    = mylist.children.length;

// Graph elements may not exist, so optional chaining
const countBar = document.getElementById('count-bar');
const barCount = document.getElementById('bar-count');

// Preloader removal: try on window 'load', but also use a failsafe to always remove after 3s.
function removePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.transition = 'opacity 0.8s';
    preloader.style.opacity = '0'; // Start fade-out
    setTimeout(() => {
      preloader.remove();
    }, 500); // Wait for fade
  }
}

window.addEventListener('load', removePreloader);
// Failsafe: forcibly remove preloader after 3s if 'load' did not fire (e.g. JS error or slow assets).
setTimeout(removePreloader, 3000);

btn.addEventListener('click', () => {
  count++;
  const li       = document.createElement('li');
  li.textContent = `Item ${count}`;
  mylist.appendChild(li);
});

function updateBar() {
  const n = mylist.children.length;
  // scale: 24px + (n-1)*12px (min height 24)
  let newH = 24 + (n-1) * 12;
  if (newH > 80) newH = 80; // cap at 80px for visual
  if (countBar) countBar.style.height = newH + 'px';
  if (barCount) barCount.textContent  = n;
}
// On item add, update visuals!
btn.addEventListener('click', updateBar);

// For direct DOM manipulation (in case initial items changed)
new MutationObserver(updateBar).observe(mylist, { childList: true });
const res = await fetch("/api/profile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, phone, password })
});
const result = await res.json();
document.getElementById("success-message").style.display = "block";
document.getElementById("error-message").style.display = "none";
*/