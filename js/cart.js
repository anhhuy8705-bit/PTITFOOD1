import {
  addToCart,
  clearCart,
  formatCurrency,
  getCart,
  getProductById,
  initializePage,
  removeFromCart,
  saveCart,
  showToast,
  updateCartQuantity,
} from "./app.js";

function getCartSubtotal(cart) {
  return cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
}

function renderCart() {
  const cartPage = document.getElementById("cartPage");

  if (!cartPage) return;

  const cart = getCart();

  if (!cart.length) {
    cartPage.innerHTML = `
      <div class="col-span-full rounded-[30px] bg-white p-10 text-center shadow-soft">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">🛒</div>
        <h2 class="mt-6 text-3xl font-bold text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p class="mt-3 text-slate-600">Khám phá các món ăn ngon và thêm vào giỏ hàng.</p>
        <a href="products.html" class="primary-button mt-6 inline-flex">Khám phá món ăn</a>
      </div>
    `;
    return;
  }

  const subtotal = getCartSubtotal(cart);
  const deliveryFee = 15000;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const itemsMarkup = cart
    .map(
      (item) => `
        <article class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <img src="${item.image}" alt="${item.name}" class="h-24 w-full rounded-2xl object-cover sm:w-28" />
          <div class="flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-slate-900">${item.name}</h3>
                <p class="text-sm text-slate-500">${item.restaurant || "Foodie Kitchen"}</p>
              </div>
              <button type="button" class="remove-item text-sm font-medium text-red-500" data-remove-id="${item.id}">Xóa</button>
            </div>
            <div class="mt-4 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
                <button type="button" class="quantity-button" data-quantity-id="${item.id}" data-quantity-action="decrease" aria-label="Giảm số lượng">−</button>
                <span class="min-w-6 text-center text-base font-semibold text-slate-800">${item.quantity}</span>
                <button type="button" class="quantity-button" data-quantity-id="${item.id}" data-quantity-action="increase" aria-label="Tăng số lượng">+</button>
              </div>
              <span class="text-lg font-bold text-slate-900">${formatCurrency(item.price * item.quantity)}</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  cartPage.innerHTML = `
    <div class="space-y-4">
      ${itemsMarkup}
      <div class="flex flex-wrap gap-3 pt-2">
        <a href="products.html" class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Tiếp tục mua sắm</a>
      </div>
    </div>
    <aside class="rounded-[28px] bg-white p-6 shadow-soft">
      <h2 class="text-2xl font-bold text-slate-900">Tóm tắt</h2>
      <div class="mt-5 space-y-4 text-sm text-slate-600">
        <div class="flex items-center justify-between">
          <span>Tạm tính</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Phí giao hàng</span>
          <span>${formatCurrency(deliveryFee)}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Giảm giá</span>
          <span>${formatCurrency(discount)}</span>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
          <span>Tổng cộng</span>
          <span>${formatCurrency(total)}</span>
        </div>
      </div>
      <a href="checkout.html" class="primary-button mt-6 inline-flex w-full justify-center">Tiến hành thanh toán</a>
    </aside>
  `;

  const removeButtons = cartPage.querySelectorAll("[data-remove-id]");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
      renderCart();
    });
  });

  const qtyButtons = cartPage.querySelectorAll("[data-quantity-action]");
  qtyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.quantityId;
      const currentItem = getCart().find((item) => item.id === productId);
      if (!currentItem) return;

      const nextQuantity =
        button.dataset.quantityAction === "increase"
          ? currentItem.quantity + 1
          : currentItem.quantity - 1;
      updateCartQuantity(productId, nextQuantity);
      renderCart();
    });
  });
}

initializePage();
renderCart();
