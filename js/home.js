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
  "Bánh mì": { accent: "#34d399", soft: "rgba(52, 211, 153, 0.12)" },
  Gà: { accent: "#f97316", soft: "rgba(249, 115, 22, 0.12)" },
  "Đồ uống": { accent: "#38bdf8", soft: "rgba(56, 189, 248, 0.12)" },
  "Ăn vặt": { accent: "#a78bfa", soft: "rgba(167, 139, 250, 0.12)" },
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
          <a href="product-detail.html?id=${product.id}" class="block">
            <div class="relative overflow-hidden rounded-[1.5rem] bg-[#1e1715] shadow-[0_10px_18px_rgba(120,70,43,0.12)]">
              <img src="${product.image}" alt="${product.name}" class="h-48 w-full rounded-[1.5rem] object-cover object-center scale-[1.08] transition duration-300 active:scale-[1.12] active:rotate-[-0.5deg] sm:h-52" />
              <span class="card-accent-tag absolute left-4 top-4">${product.category}</span>
              <button type="button" class="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition hover:scale-105" data-favorite="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 26.6 5.74 8.71c-.784.57-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L1.81 1.909c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69L7.88 2.927z" />
                </svg>
              </button>
            </div>
          </a>
          <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-2 text-sm" style="color: #d99b79;">
              <span class="inline-flex items-center gap-1 text-yellow-400">
                <span>★</span>
                <span class="font-semibold" style="color: #f8d78d;">${formatRating(product.rating)}</span>
              </span>
              <span>(${product.reviewCount} đánh giá)</span>
            </div>
            <a href="product-detail.html?id=${product.id}" class="block">
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Restaurant</p>
              <h3 class="mt-1 text-lg font-bold" style="color: #ffefe2;">${product.name}</h3>
              <p class="mt-1 text-sm" style="color: #d7aa88;">📍 ${product.restaurant}</p>
            </a>
            <div class="card-extra-info">
              <div class="text-lg font-black" style="color: #fff;">${formatCurrency(product.price)}</div>
              <div class="card-time-box">
                <div class="text-[10px] font-bold uppercase tracking-[0.16em]">Giao</div>
                <div class="mt-1 text-base font-black">${product.preparationTime} phút</div>
              </div>
            </div>
            <button type="button" class="primary-button mt-1 w-full" data-add-to-cart="${product.id}">Đặt món</button>
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
}

initializePage();
setupHomeInteractions();
