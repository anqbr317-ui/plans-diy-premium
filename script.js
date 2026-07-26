const cart = JSON.parse(localStorage.getItem("bricolageCart") || "[]");

const cartPanel = document.querySelector("#cartPanel");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const openCartButton = document.querySelector("#openCart");
const closeCartButton = document.querySelector("#closeCart");
const clearCartButton = document.querySelector("#clearCart");
const checkoutButton = document.querySelector("#checkoutButton");
const menuButton = document.querySelector("#menuButton");
const navLinks = document.querySelector("#navLinks");

function saveCart() {
  localStorage.setItem("bricolageCart", JSON.stringify(cart));
}

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <span>${formatPrice(item.price)} × ${item.quantity}</span>
      </div>

      <div class="cart-item-actions">
        <button class="quantity-button" onclick="changeQuantity(${index}, -1)">−</button>
        <strong>${item.quantity}</strong>
        <button class="quantity-button" onclick="changeQuantity(${index}, 1)">+</button>
        <button class="remove-item" onclick="removeItem(${index})">✕</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));
  });
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;

    document.querySelectorAll(".product-card").forEach(card => {
      const visible = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("hidden", !visible);
    });
  });
});

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

clearCartButton.addEventListener("click", () => {
  cart.splice(0, cart.length);
  saveCart();
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  const lines = cart.map(item =>
    `- ${item.name} × ${item.quantity} : ${formatPrice(item.price * item.quantity)}`
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subject = encodeURIComponent("Commande Plans Bricolage Premium");
  const body = encodeURIComponent(
`Bonjour,

Je souhaite commander les plans suivants :

${lines.join("\n")}

Total : ${formatPrice(total)}

Mon nom :
Mon adresse e-mail :
Mon message :

Merci.`
  );

  window.location.href =
    `mailto:anqbr317@gmail.com?subject=${subject}&body=${body}`;
});

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

renderCart();
