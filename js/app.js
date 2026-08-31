import { products, reviews as seedReviews } from "./db.js";

export const STORAGE_KEYS = {
  cart: "cart",
  reviews: "reviews",
  user: "user",
  orders: "orders",
};

export function safeParse(value, fallback) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch (error) {
    console.warn("Failed to parse localStorage value:", error);
    return fallback;
  }
}

export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.cart)) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(seedReviews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.user)) {
    localStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify({
        name: "PTITFOOD User",
        avatar: "PT",
      }),
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));
  }
}

export function getCart() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.cart), []);
  } catch (error) {
    console.warn("Cart access error:", error);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    updateCartBadge();
    return true;
  } catch (error) {
    console.warn("Cannot save cart:", error);
    showToast("Không thể lưu giỏ hàng.", "error");
    return false;
  }
}

export function getItemFinalPrice(item) {
  if (!item) return 0;

  if (item.selectedOption) {
    const optionPrice = Number(
      item.selectedOption.price ??
        item.options?.find((option) => option.id === item.selectedOption.id)?.price ??
        item.finalPrice ??
        item.price ??
        0,
    );
    return optionPrice || Number(item.finalPrice || item.price || 0);
  }

  return Number(item.finalPrice ?? item.price ?? 0);
}

export function addToCart(product, quantity = 1) {
  if (!product || quantity < 1) {
    showToast("Số lượng sản phẩm không hợp lệ.", "error");
    return;
  }

  const cart = getCart();
  const selectedOption = product.selectedOption
    ? product.options?.find((option) => option.id === product.selectedOption.id) ?? product.selectedOption
    : null;
  const finalPrice = selectedOption
    ? Number(selectedOption.price || 0)
    : Number(product.price || 0);
  const optionKey = selectedOption ? selectedOption.id : "default";

  const existingItem = cart.find((item) => {
    const itemOptionKey = item.selectedOption ? item.selectedOption.id : "default";
    return item.id === product.id && itemOptionKey === optionKey;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.finalPrice = finalPrice;
    existingItem.selectedOption = selectedOption
      ? { ...selectedOption }
      : existingItem.selectedOption;
  } else {
    const cartItem = {
      ...product,
      quantity,
      selectedOption: selectedOption ? { ...selectedOption } : undefined,
      finalPrice,
    };

    cart.push(cartItem);
  }

  saveCart(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`, "success");
}

export function removeFromCart(productId, optionId = "default") {
  const cart = getCart().filter((item) => {
    const itemOptionId = item.selectedOption ? item.selectedOption.id : "default";
    return !(item.id === productId && itemOptionId === optionId);
  });
  saveCart(cart);
}

export function updateCartQuantity(productId, quantity, optionId = "default") {
  if (quantity < 1) {
    removeFromCart(productId, optionId);
    return;
  }

  const cart = getCart();
  const item = cart.find((entry) => {
    const entryOptionId = entry.selectedOption ? entry.selectedOption.id : "default";
    return entry.id === productId && entryOptionId === optionId;
  });

  if (!item) return;

  item.quantity = quantity;
  item.finalPrice = getItemFinalPrice(item);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getReviews() {
  try {
    const value = safeParse(
      localStorage.getItem(STORAGE_KEYS.reviews),
      seedReviews,
    );
    return Array.isArray(value) ? value : [...seedReviews];
  } catch (error) {
    console.warn("Reviews access error:", error);
    return [...seedReviews];
  }
}

export function saveReview(review) {
  try {
    const list = getReviews();
    list.push(review);
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(list));
    return list;
  } catch (error) {
    console.warn("Cannot save review:", error);
    return getReviews();
  }
}

export function getOrders() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.orders), []);
  } catch (error) {
    console.warn("Orders access error:", error);
    return [];
  }
}

export function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.warn("Cannot save order:", error);
    return false;
  }
}

export function getUser() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.user), {
      name: "PTITFOOD User",
      avatar: "PT",
    });
  } catch (error) {
    return { name: "PTITFOOD User", avatar: "PT" };
  }
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) || null;
}

export function formatCurrency(price) {
  const amount = Number(price || 0);
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

export function formatRating(value) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) {
    return "0,0";
  }

  return numeric.toFixed(1).replace(".", ",");
}

export function calculateAverageRating(productId) {
  const productReviews = getReviews().filter(
    (review) => review.productId === productId,
  );

  if (!productReviews.length) {
    return 0;
  }

  const total = productReviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0,
  );
  return Number((total / productReviews.length).toFixed(1));
}

export function updateCartBadge() {
  const count = getCart().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
  const badgeItems = document.querySelectorAll("[data-cart-count]");

  badgeItems.forEach((element) => {
    element.textContent = String(count);
    if (count === 0) {
      element.classList.add("hidden");
    } else {
      element.classList.remove("hidden");
    }
  });
}

export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="toast-icon">${type === "error" ? "!" : "✓"}</span>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

export function initializePage() {
  initializeStorage();
  updateCartBadge();
  setupHeaderNavigation();
  setupHeaderSearch();
}

export function setupHeaderNavigation() {
  const activePath = window.location.pathname.split("/").pop() || "index.html";
  const navMap = {
    "index.html": "home",
    "products.html": "products",
    "cart.html": "cart",
    "checkout.html": "checkout",
  };

  const activeKey = navMap[activePath];

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const isActive = link.dataset.nav === activeKey;
    link.classList.toggle("active", isActive);
  });
}

export function setupHeaderSearch() {
  const form = document.getElementById("headerSearchForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const query = input ? input.value.trim() : "";

    if (!query) {
      window.location.href = "products.html";
      return;
    }

    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
