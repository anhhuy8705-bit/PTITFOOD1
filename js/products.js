import { categories, products } from "./db.js";
import {
  addToCart,
  formatCurrency,
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

function buildProductCard(product) {
  return `
    <article class="food-card group">
      <a href="product-detail.html?id=${product.id}" class="block">
        <div class="relative overflow-hidden rounded-2xl">
          <img src="${product.image}" alt="${product.name}" class="h-52 w-full object-cover transition duration-300 group-hover:scale-105" />
          <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">${product.category}</span>
        </div>
      </a>
      <div class="space-y-3 p-4">
        <a href="product-detail.html?id=${product.id}" class="block">
          <p class="text-sm text-slate-500">${product.restaurant}</p>
          <h3 class="mt-1 text-xl font-semibold text-slate-800">${product.name}</h3>
        </a>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="text-yellow-400">★</span>
          <span class="font-medium text-slate-700">${product.rating}</span>
          <span>(${product.reviewCount})</span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="text-xl font-bold text-slate-900">${formatCurrency(product.price)}</span>
          <span class="text-sm text-slate-500">${product.preparationTime} mins</span>
        </div>
        <button type="button" class="primary-button mt-2 w-full" data-add-to-cart="${product.id}">Add to Cart</button>
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
