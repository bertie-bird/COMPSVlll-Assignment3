(() => {
  "use strict";

  function getCartQuantity() {
    return window.StoreStorage.getCart().reduce((total, item) => total + item.quantity, 0);
  }

  function updateCartCounts() {
    const count = getCartQuantity();
    document.querySelectorAll("[data-cart-count]").forEach((element) => {
      element.textContent = String(count);
      element.setAttribute("aria-label", `${count} ${count === 1 ? "item" : "items"} in cart`);
    });
  }

  function formatPrice(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }

  function createProductImage(product, className) {
    const wrapper = document.createElement("div");
    wrapper.className = `product-image ${className || ""}`.trim();
    wrapper.dataset.category = product.category;
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.textContent = product.category;
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.imageAlt;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      wrapper.classList.add("image-unavailable");
    }, { once: true });
    wrapper.append(fallback, image);
    return wrapper;
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
  updateCartCounts();
  window.StoreUI = { formatPrice, createProductImage, updateCartCounts };
})();
