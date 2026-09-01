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
      <a href="product-detail.html?id=${product.id}" class="block">
        <div class="relative overflow-hidden rounded-[1.5rem] bg-[#1e1715] shadow-[0_10px_18px_rgba(120,70,43,0.12)]">
          <img src="${product.image}" alt="${product.name}" class="h-48 w-full rounded-[1.5rem] object-cover object-center scale-[1.08] transition duration-300 active:scale-[1.12] active:rotate-[-0.5deg] sm:h-52" />
          <span class="card-accent-tag absolute left-4 top-4">${product.category}</span>
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
