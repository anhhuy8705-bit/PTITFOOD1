import { categories, products } from "./db.js";
import {
  addToCart,
  formatCurrency,
  formatRating,
  getProductById,
  initializePage,
  showToast,
} from "./app.js";

const productGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

function getFilteredProducts() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || "Tất cả";
  const currentSort = sortSelect?.value || "popular";

  let filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.restaurant.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "Tất cả" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  switch (currentSort) {
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      break;
    default:
      filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return filtered;
}

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

function buildProductCard(product) {
  const accent = accentPalette[product.category] || accentPalette["Cơm"];

  return `
    <article class="food-card group" style="--card-accent: ${accent.accent}; --card-accent-soft: ${accent.soft};">
      <div class="food-card-media">
        <a href="product-detail.html?id=${product.id}" class="food-card-image-link">
          <img src="${product.image}" alt="${product.name}" class="food-card-image" loading="lazy" />
        </a>
        <span class="card-accent-tag">${product.category}</span>
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
}

function renderProducts() {
  if (!productGrid) return;

  const filtered = getFilteredProducts();

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <h3 class="text-xl font-semibold text-slate-800">Không tìm thấy món ăn nào</h3>
        <p class="mt-2 text-slate-500">Hãy thử từ khóa hoặc bộ lọc khác.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(buildProductCard).join("");

  productGrid.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = getProductById(button.dataset.addToCart);
      if (!product) {
        showToast("Sản phẩm không tồn tại.", "error");
        return;
      }

      addToCart(product, 1);
    });
  });
}

function setupProductsPage() {
  if (categoryFilter) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search") || "";
    if (searchQuery) {
      searchInput.value = searchQuery;
    }
  }

  searchInput?.addEventListener("input", renderProducts);
  categoryFilter?.addEventListener("change", renderProducts);
  sortSelect?.addEventListener("change", renderProducts);
  renderProducts();
}

initializePage();
setupProductsPage();
