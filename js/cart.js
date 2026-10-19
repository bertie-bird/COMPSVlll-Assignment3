(() => {
  "use strict";

  const itemsContainer = document.querySelector("#cart-items");
  const emptyState = document.querySelector("#empty-cart");
  const clearButton = document.querySelector("#clear-cart");
  const checkoutButton = document.querySelector("#checkout");
  const checkoutMessage = document.querySelector("#checkout-message");

  function makeCartRow(cartItem, product) {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.append(window.StoreUI.createProductImage(product, "cart-product-image"));
    const details = document.createElement("div");
    details.className = "cart-item-details";
    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.className = "cart-unit-price";
    price.textContent = `${window.StoreUI.formatPrice(product.price)} each`;
    const controls = document.createElement("div");
    controls.className = "quantity-control";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    decrease.disabled = cartItem.quantity === 1;
    decrease.addEventListener("click", () => changeQuantity(product.id, -1));
    const quantity = document.createElement("span");
    quantity.textContent = String(cartItem.quantity);
    quantity.setAttribute("aria-live", "polite");
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${product.name} quantity`);
    increase.disabled = cartItem.quantity === 99;
    increase.addEventListener("click", () => changeQuantity(product.id, 1));
    controls.append(decrease, quantity, increase);
    details.append(category, name, price, controls);
    const end = document.createElement("div");
    end.className = "cart-item-end";
    const subtotal = document.createElement("strong");
    subtotal.textContent = window.StoreUI.formatPrice(product.price * cartItem.quantity);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
    remove.addEventListener("click", () => removeItem(product.id));
    end.append(subtotal, remove);
    row.append(details, end);
    return row;
  }

  function renderCart() {
    const cart = window.StoreStorage.getCart();
    const rows = cart.map((item) => {
      const product = window.StoreProducts.find((entry) => entry.id === item.id);
      return product ? makeCartRow(item, product) : null;
    }).filter(Boolean);
    itemsContainer.replaceChildren(...rows);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => {
      const product = window.StoreProducts.find((entry) => entry.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    document.querySelector("#cart-heading-count").textContent = itemCount ? `(${itemCount})` : "";
    document.querySelector("#summary-item-count").textContent = `(${itemCount})`;
    document.querySelector("#subtotal").textContent = window.StoreUI.formatPrice(total);
    document.querySelector("#cart-total").textContent = window.StoreUI.formatPrice(total);
    const isEmpty = rows.length === 0;
    emptyState.classList.toggle("hidden", !isEmpty);
    clearButton.classList.toggle("hidden", isEmpty);
    checkoutButton.disabled = isEmpty;
    window.StoreUI.updateCartCounts();
  }

  function updateCart(cart, errorMessage) {
    if (!window.StoreStorage.saveCart(cart)) {
      checkoutMessage.textContent = errorMessage;
      return;
    }
    checkoutMessage.textContent = "";
    renderCart();
  }

  function changeQuantity(id, amount) {
    const cart = window.StoreStorage.getCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(99, item.quantity + amount));
    updateCart(cart, "Your cart couldn't be updated. Check your browser storage settings.");
  }

  function removeItem(id) {
    updateCart(window.StoreStorage.getCart().filter((item) => item.id !== id), "Your cart couldn't be updated. Check your browser storage settings.");
  }

  clearButton.addEventListener("click", () => {
    if (!window.confirm("Clear all the lovely things from your cart?")) return;
    updateCart([], "Your cart couldn't be cleared. Check your browser storage settings.");
  });

  checkoutButton.addEventListener("click", () => {
    checkoutMessage.textContent = "Thanks for stopping by! Checkout is a demo, so no order or payment was made.";
  });

  renderCart();
})();
