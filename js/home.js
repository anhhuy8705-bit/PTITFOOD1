import { categories, products } from "./db.js";
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

function renderCategoryTabs() {
  const tabContainer = document.getElementById("categoryTabs");

  if (!tabContainer) return;

  tabContainer.innerHTML = categories
    .map((category, index) => {
      const isActive = index === 0;
      return `
        <button
          type="button"
          class="category-tab ${isActive ? "active" : ""}"
          data-category="${category}"
        >
          ${category}
        </button>
      `;
    })
    .join("");

  tabContainer.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      tabContainer
        .querySelectorAll(".category-tab")
        .forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const selectedCategory = tab.dataset.category;
      renderFeaturedProducts(selectedCategory);
    });
  });
}

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
    .map(
      (product) => `
        <article class="food-card group">
          <a href="product-detail.html?id=${product.id}" class="block">
            <div class="relative overflow-hidden rounded-2xl">
              <img src="${product.image}" alt="${product.name}" class="h-52 w-full object-cover transition duration-300 group-hover:scale-105" />
              <button type="button" class="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition hover:scale-105" data-favorite="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 26.6 5.74 8.71c-.784.57-1.839-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L1.81 1.909c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69L7.88 2.927z" />
                </svg>
              </button>
            </div>
          </a>
          <div class="space-y-3 p-4">
            <div class="flex items-start justify-between gap-3">
              <a href="product-detail.html?id=${product.id}" class="block flex-1">
                <h3 class="text-lg font-semibold" style="color: #c47d5a;">${product.name}</h3>
                <p class="text-sm" style="color: #d99b79;">${product.restaurant}</p>
              </a>
              <span class="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium" style="color: #a84515;">${product.category}</span>
            </div>
            <div class="flex items-center gap-2 text-sm" style="color: #d99b79;">
              <span class="text-yellow-400">★</span>
              <span class="font-medium" style="color: #c47d5a;">${formatRating(product.rating)}</span>
              <span>(${product.reviewCount} reviews)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold" style="color: #ffffff;">${formatCurrency(product.price)}</span>
              <button type="button" class="primary-button" data-add-to-cart="${product.id}">+</button>
            </div>
          </div>
        </article>
      `,
    )
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
  renderCategoryTabs();
  renderFeaturedProducts();
}

initializePage();
setupHomeInteractions();
