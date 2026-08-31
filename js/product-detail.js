import { products, reviews as seedReviews } from "./db.js";
import {
  addToCart,
  calculateAverageRating,
  formatCurrency,
  formatRating,
  getProductById,
  getReviews,
  initializePage,
  saveReview,
  showToast,
} from "./app.js";

function getProductIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function createStarRating(rating) {
  return Array.from({ length: 5 }, (_, index) => {
    const active = index < Math.round(rating);
    return `<span class="${active ? "text-yellow-400" : "text-slate-300"}">★</span>`;
  }).join("");
}

function renderReviews(productId) {
  const reviewList = document.getElementById("reviewList");
  const reviews = getReviews().filter(
    (review) => review.productId === productId,
  );

  if (!reviewList) return;

  if (!reviews.length) {
    reviewList.innerHTML = `
      <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p class="text-slate-500">Chưa có đánh giá nào cho món này.</p>
      </div>
    `;
    return;
  }

  reviewList.innerHTML = reviews
    .map(
      (review) => `
        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
              ${review.userName.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-3">
                <h4 class="font-semibold text-slate-800">${review.userName}</h4>
                <span class="text-sm text-slate-400">${review.date}</span>
              </div>
              <div class="mt-2 text-yellow-400">${createStarRating(review.rating)}</div>
              <p class="mt-3 text-sm leading-6 text-slate-600">${review.comment}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderProductDetail() {
  const container = document.getElementById("productDetailContainer");
  const productId = getProductIdFromQuery();

  if (!container) return;

  if (!productId) {
    container.innerHTML = `
      <div class="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 class="text-3xl font-bold text-slate-900">Không tìm thấy món ăn</h1>
        <p class="mt-3 text-slate-500">URL không chứa mã sản phẩm hợp lệ.</p>
        <a href="products.html" class="primary-button mt-6 inline-flex">Quay lại thực đơn</a>
      </div>
    `;
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 class="text-3xl font-bold text-slate-900">Không tìm thấy món ăn</h1>
        <p class="mt-3 text-slate-500">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <a href="products.html" class="primary-button mt-6 inline-flex">Quay lại thực đơn</a>
      </div>
    `;
    return;
  }

  const reviewCount = getReviews().filter(
    (review) => review.productId === product.id,
  ).length;
  const averageRating = calculateAverageRating(product.id);
  const productRating = averageRating || product.rating;

  product.rating = productRating;
  product.reviewCount = reviewCount;

  container.innerHTML = `
    <div class="grid gap-8 lg:grid-cols-2">
      <div class="overflow-hidden rounded-[30px] bg-white p-3 shadow-sm">
        <img src="${product.image}" alt="${product.name}" class="h-[440px] w-full rounded-[24px] object-cover" />
      </div>
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">${product.category}</span>
        </div>
        <div>
          <h1 class="text-3xl font-bold" style="color: #5c2005;">${product.name}</h1>
          <p class="mt-2 text-lg" style="color: #8c3d10;">${product.restaurant}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 text-yellow-400 text-lg">${createStarRating(productRating)}</div>
          <span class="text-sm font-medium" style="color: #5c2005;">${formatRating(productRating)}</span>
          <span class="text-sm" style="color: #8c3d10;">(${reviewCount} reviews)</span>
        </div>
        <div id="detailPrice" class="text-3xl font-bold" style="color: #5c2005;">${formatCurrency(product.options?.[0]?.price ?? product.price)}</div>
        <p class="text-base leading-7" style="color: #8c3d10;">${product.description}</p>
        <div class="flex flex-wrap gap-4 text-sm" style="color: #8c3d10;">
          <span class="rounded-full bg-slate-100 px-3 py-2">⏱ ${product.preparationTime} phút</span>
          <span class="rounded-full bg-slate-100 px-3 py-2">📍 ${product.restaurant}</span>
        </div>
        ${product.options && product.options.length > 0 ? `
        <div class="space-y-3">
          <label class="block font-semibold" style="color: #5c2005;">Lựa chọn:</label>
          <div class="flex flex-wrap gap-2">
            ${product.options.map((option, idx) => {
              const priceLabel = option.price > 0 ? `(${formatCurrency(option.price)})` : '(Không phụ thu)';
              return `
              <label class="flex items-center gap-2 cursor-pointer rounded-full border-2 px-4 py-2 transition" style="border-color: ${idx === 0 ? '#c2571a' : '#d99a74'}; background-color: ${idx === 0 ? '#fae5d8' : 'transparent'};">
                <input type="radio" name="product-option" value="${option.id}" data-option-price="${option.price}" data-option-name="${option.name}" ${idx === 0 ? 'checked' : ''} class="product-option-input" />
                <span style="color: #7d3715;">${option.name} ${priceLabel}</span>
              </label>
            `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2">
            <button type="button" class="quantity-button" data-quantity-action="decrease" aria-label="Giảm số lượng">−</button>
            <span id="detailQuantity" class="min-w-6 text-center text-lg font-semibold text-slate-800">1</span>
            <button type="button" class="quantity-button" data-quantity-action="increase" aria-label="Tăng số lượng">+</button>
          </div>
          <button type="button" id="detailAddToCart" class="primary-button flex-1">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  `;

  const detailQuantity = document.getElementById("detailQuantity");
  const detailPrice = document.getElementById("detailPrice");
  let quantity = 1;
  let selectedOption = null;

  const getSelectedOption = () => {
    const checkedInput = document.querySelector(".product-option-input:checked");
    if (!checkedInput) return null;

    return {
      id: checkedInput.value,
      name: checkedInput.dataset.optionName || checkedInput.value,
      price: Number(checkedInput.dataset.optionPrice || 0),
    };
  };

  const updateDisplayedPrice = () => {
    const currentOption = getSelectedOption();
    const priceToDisplay = currentOption ? currentOption.price : Number(product.price || 0);
    if (detailPrice) {
      detailPrice.textContent = formatCurrency(priceToDisplay);
    }
  };

  document.querySelectorAll("[data-quantity-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.quantityAction;
      quantity =
        action === "increase" ? quantity + 1 : Math.max(1, quantity - 1);
      detailQuantity.textContent = String(quantity);
    });
  });

  document.querySelectorAll(".product-option-input").forEach((input) => {
    input.addEventListener("change", () => {
      selectedOption = getSelectedOption();
      updateDisplayedPrice();
    });
  });

  selectedOption = getSelectedOption();
  updateDisplayedPrice();

  document.getElementById("detailAddToCart")?.addEventListener("click", () => {
    const cartItem = { ...product, quantity };
    const currentOption = getSelectedOption();
    if (currentOption) {
      cartItem.selectedOption = currentOption;
      cartItem.finalPrice = currentOption.price;
    } else {
      cartItem.finalPrice = product.price;
    }
    addToCart(cartItem, quantity);
  });

  renderReviews(product.id);
  setupReviewForm(product.id);
}

function setupReviewForm(productId) {
  const form = document.getElementById("reviewForm");
  const stars = document.querySelectorAll("[data-rating-star]");
  const hiddenRating = document.getElementById("reviewRating");

  if (!form || !hiddenRating) return;

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.ratingStar);
      hiddenRating.value = String(value);
      stars.forEach((item) =>
        item.classList.toggle(
          "active",
          Number(item.dataset.ratingStar) <= value,
        ),
      );
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const comment = document.getElementById("reviewComment")?.value.trim();
    const rating = Number(hiddenRating.value);

    if (!rating || rating < 1 || rating > 5) {
      showToast("Vui lòng chọn số sao hợp lệ.", "error");
      return;
    }

    if (!comment || comment.length < 10) {
      showToast("Nội dung đánh giá phải có ít nhất 10 ký tự.", "error");
      return;
    }

    const newReview = {
      id: `r-${Date.now()}`,
      productId,
      userName: "Bạn",
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    };

    saveReview(newReview);
    form.reset();
    hiddenRating.value = "";
    stars.forEach((star) => star.classList.remove("active"));
    renderReviews(productId);
    renderProductDetail();
    showToast("Cảm ơn bạn đã đánh giá món ăn.", "success");
  });
}

initializePage();
renderProductDetail();
