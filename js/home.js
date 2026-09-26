import { products } from "./db.js";
import {
  addToCart,
  formatCurrency,
  formatRating,
  initializePage,
  getProductById,
} from "./app.js";

const featuredProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 6);

const accentPalette = {
  Cơm: { accent: "#f59e0b", soft: "rgba(245, 158, 11, 0.12)" },
  "Phở/Bún": { accent: "#fb7185", soft: "rgba(251, 113, 133, 0.12)" },
  "Mì/miến": { accent: "#f97316", soft: "rgba(249, 115, 22, 0.12)" },
  "Bánh mì": { accent: "#34d399", soft: "rgba(52, 211, 153, 0.12)" },
  Gà: { accent: "#f59e0b", soft: "rgba(245, 158, 11, 0.12)" },
  "Đồ uống": { accent: "#38bdf8", soft: "rgba(56, 189, 248, 0.12)" },
  "Ăn vặt": { accent: "#a78bfa", soft: "rgba(167, 139, 250, 0.12)" },
  "Món đặc biệt": { accent: "#f43f5e", soft: "rgba(244, 63, 94, 0.12)" },
};

function renderFeaturedProducts(selectedCategory = "Tất cả") {
  const grid = document.getElementById("featuredProducts");

  if (!grid) return;

  const filteredProducts =
    selectedCategory === "Tất cả"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.category === selectedCategory,
        );

  grid.innerHTML = filteredProducts
    .map((product) => {
      const accent = accentPalette[product.category] || accentPalette["Cơm"];
      return `
        <article class="food-card group" style="--card-accent: ${accent.accent}; --card-accent-soft: ${accent.soft};">
          <div class="food-card-media">
            <a href="product-detail.html?id=${product.id}" class="food-card-image-link">
              <img src="${product.image}" alt="${product.name}" class="food-card-image" loading="lazy" />
            </a>
            <span class="card-accent-tag">${product.category}</span>
            <button type="button" class="food-card-favorite" data-favorite="${product.id}" aria-label="Thêm ${product.name} vào yêu thích">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 26.6 5.74 8.71c-.784.57-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L1.81 1.909c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69L7.88 2.927z" />
                </svg>
            </button>
          </div>
          <div class="food-card-content">
            <div class="food-card-rating">
              <span class="food-card-rating-score"><span aria-hidden="true">★</span> ${formatRating(product.rating)}</span>
              <span class="food-card-review-count">${product.reviewCount} đánh giá</span>
            </div>
            <a href="product-detail.html?id=${product.id}" class="food-card-details">
              <span class="food-card-restaurant-label">Quán ăn</span>
              <h3 class="food-card-title">${product.name}</h3>
              <span class="food-card-address">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 8.2c0 4.2-6 9.3-6 9.3S4 12.4 4 8.2a6 6 0 1 1 12 0Z"/><circle cx="10" cy="8" r="2"/></svg>
                <span>${product.restaurant}</span>
              </span>
            </a>
            <div class="food-card-bottom">
              <div class="food-card-price">${formatCurrency(product.price)}</div>
              <span class="food-card-delivery" aria-label="Thời gian chuẩn bị ${product.preparationTime} phút">
                <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 1.5"/></svg>
                <span>${product.preparationTime} phút</span>
              </div>
            </div>
            <button type="button" class="primary-button food-card-order" data-add-to-cart="${product.id}">Đặt món</button>
          </div>
        </article>
      `;
    })
    .join("");

  const buttons = grid.querySelectorAll("[data-add-to-cart]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = getProductById(button.dataset.addToCart);
      if (!product) return;
      addToCart(product, 1);
    });
  });
}

function setupHomeInteractions() {
  renderFeaturedProducts();
  setupHeroPointerIcons();
}

function setupHeroPointerIcons() {
  const hero = document.querySelector("[data-hero-interactions]");
  const floatLayer = hero?.querySelector(".home-hero-floats");

  if (!hero || !floatLayer || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const prompts = [
    {
      label: "Đặt món",
      icon: '<path d="M3 3h2l.4 2.1M7 15h8l2-8H5.3M7 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>',
    },
    {
      label: "Xem thực đơn",
      icon: '<path d="M4 3.5h12A1.5 1.5 0 0 1 17.5 5v13l-7.5-3-7.5 3V5A1.5 1.5 0 0 1 4 3.5Z"/><path d="M7 7h6M7 10h6"/>',
    },
  ];
  let lastPop = 0;
  let promptIndex = 0;

  hero.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastPop < 180) return;
    lastPop = now;

    const bounds = hero.getBoundingClientRect();
    const prompt = prompts[promptIndex % prompts.length];
    promptIndex += 1;

    const pop = document.createElement("span");
    pop.className = "hero-pointer-pop";
    pop.style.left = `${event.clientX - bounds.left}px`;
    pop.style.top = `${event.clientY - bounds.top}px`;
    pop.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${prompt.icon}</svg><span>${prompt.label}</span>`;
    floatLayer.append(pop);
    pop.addEventListener("animationend", () => pop.remove(), { once: true });
  });
}

initializePage();
setupHomeInteractions();
