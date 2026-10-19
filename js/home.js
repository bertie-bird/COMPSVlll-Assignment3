(() => {
  "use strict";

  const grid = document.querySelector("#product-grid");
  const searchInput = document.querySelector("#product-search");
  const categorySelect = document.querySelector("#category-filter");
  const sortSelect = document.querySelector("#price-sort");
  const noResults = document.querySelector("#no-results");
  const resultsCount = document.querySelector("#results-count");
  const toast = document.querySelector("#toast");
  let toastTimer;

  [...new Set(window.StoreProducts.map((product) => product.category))].sort().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });

  function makeProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.append(window.StoreUI.createProductImage(product));
    const details = document.createElement("div");
    details.className = "product-details";
    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    const bottom = document.createElement("div");
    bottom.className = "product-bottom";
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = window.StoreUI.formatPrice(product.price);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "add-button";
    add.textContent = "Add to cart";
    add.setAttribute("aria-label", `Add ${product.name} to cart`);
    add.addEventListener("click", () => addToCart(product));
    bottom.append(price, add);
    details.append(category, name, description, bottom);
    card.append(details);
    return card;
  }

  function renderProducts() {
    const term = searchInput.value.trim().toLocaleLowerCase();
    const category = categorySelect.value;
    const products = window.StoreProducts.filter((product) => {
      const matchesTerm = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase().includes(term);
      return matchesTerm && (category === "all" || product.category === category);
    });
    if (sortSelect.value === "low-high") products.sort((a, b) => a.price - b.price);
    if (sortSelect.value === "high-low") products.sort((a, b) => b.price - a.price);
    grid.replaceChildren(...products.map(makeProductCard));
    noResults.classList.toggle("hidden", products.length !== 0);
    resultsCount.textContent = `${products.length} ${products.length === 1 ? "find" : "finds"} in the collection`;
  }

  function showToast(message, error = false) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle("toast-error", error);
    toast.classList.add("toast-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("toast-visible"), 2800);
  }

  function addToCart(product) {
    const cart = window.StoreStorage.getCart();
    const item = cart.find((entry) => entry.id === product.id);
    if (item) {
      if (item.quantity >= 99) {
        showToast("That's the maximum quantity for one item.", true);
        return;
      }
      item.quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }
    if (!window.StoreStorage.saveCart(cart)) {
      showToast("We couldn't save your cart. Check your browser storage settings.", true);
      return;
    }
    window.StoreUI.updateCartCounts();
    showToast(`${product.name} added to your cart.`);
  }

  document.querySelector("#clear-filters").addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "featured";
    renderProducts();
    searchInput.focus();
  });
  searchInput.addEventListener("input", renderProducts);
  categorySelect.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  renderProducts();
})();
