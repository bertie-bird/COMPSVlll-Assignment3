(() => {
  "use strict";

  const CART_KEY = "still-grove-cart";
  const PROFILE_KEY = "still-grove-profile";
  const productIds = new Set(window.StoreProducts.map((product) => product.id));
  const defaultProfile = {
    firstName: "Jamie",
    lastName: "Taylor",
    email: "jamie.taylor@example.com",
    address: "24 Willow Lane",
    city: "Portland",
    postalCode: "97205"
  };

  function read(key, fallback, isValid) {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return fallback;
      const value = JSON.parse(stored);
      if (isValid(value)) return value;
      console.warn(`Ignoring invalid ${key} data in localStorage.`);
    } catch (error) {
      console.warn(`Unable to read ${key} from localStorage.`, error);
    }
    return fallback;
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key} to localStorage.`, error);
      return false;
    }
  }

  function isValidCart(value) {
    return Array.isArray(value) && value.every((item) =>
      item && typeof item.id === "string" && productIds.has(item.id) &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99
    );
  }

  function isValidProfile(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value) &&
      Object.keys(defaultProfile).every((key) => typeof value[key] === "string");
  }

  function getCart() {
    return read(CART_KEY, [], isValidCart);
  }

  function saveCart(cart) {
    return write(CART_KEY, cart);
  }

  function getProfile() {
    return read(PROFILE_KEY, { ...defaultProfile }, isValidProfile);
  }

  function saveProfile(profile) {
    return write(PROFILE_KEY, profile);
  }

  window.StoreStorage = { getCart, saveCart, getProfile, saveProfile };
})();
