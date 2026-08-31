import {
  clearCart,
  formatCurrency,
  getCart,
  getItemFinalPrice,
  getOrders,
  initializePage,
  saveOrder,
  showToast,
} from "./app.js";

function getCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => {
      const itemPrice = getItemFinalPrice(item);
      return sum + Number(itemPrice) * Number(item.quantity || 0);
    },
    0,
  );
  const deliveryFee = 15000;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  return { cart, subtotal, deliveryFee, discount, total };
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkoutSummary");
  if (!container) return;

  const { cart, subtotal, deliveryFee, discount, total } = getCartSummary();

  if (!cart.length) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p class="text-slate-500">Giỏ hàng đang trống. Hãy thêm món trước khi thanh toán.</p>
      </div>
    `;
    document.getElementById("summarySubtotal").textContent = formatCurrency(0);
    document.getElementById("summaryDelivery").textContent =
      formatCurrency(deliveryFee);
    document.getElementById("summaryDiscount").textContent =
      formatCurrency(discount);
    document.getElementById("summaryTotal").textContent = formatCurrency(total);
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => {
        const itemPrice = getItemFinalPrice(item);
        const selectedOption = item.selectedOption ? ` - ${item.selectedOption.name || item.selectedOption.id}` : '';
        return `
        <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <img src="${item.image}" alt="${item.name}" class="h-16 w-16 rounded-xl object-cover" />
          <div class="flex-1">
            <div class="flex items-center justify-between gap-3">
              <h4 class="font-medium text-slate-800">${item.name}${selectedOption}</h4>
              <span class="text-sm font-semibold text-slate-900">${formatCurrency(itemPrice * item.quantity)}</span>
            </div>
            <p class="mt-1 text-sm text-slate-500">Số lượng: ${item.quantity}</p>
          </div>
        </div>
      `;
      },
    )
    .join("");

  document.getElementById("summarySubtotal").textContent =
    formatCurrency(subtotal);
  document.getElementById("summaryDelivery").textContent =
    formatCurrency(deliveryFee);
  document.getElementById("summaryDiscount").textContent =
    formatCurrency(discount);
  document.getElementById("summaryTotal").textContent = formatCurrency(total);
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod =
    document.querySelector('input[name="paymentMethod"]:checked')?.value ||
    "Cash on Delivery";
  const note = document.getElementById("note").value.trim();

  if (!fullName || !phoneNumber || !address) {
    showToast("Vui lòng nhập đầy đủ thông tin giao hàng.", "error");
    return;
  }

  const cart = getCart();

  if (!cart.length) {
    showToast("Giỏ hàng đang trống.", "error");
    return;
  }

  const { total } = getCartSummary();
  const order = {
    id: `FD-${Date.now().toString().slice(-6)}`,
    fullName,
    phoneNumber,
    address,
    note,
    paymentMethod,
    items: cart,
    total,
    createdAt: new Date().toISOString(),
  };

  if (!saveOrder(order)) {
    showToast("Không thể lưu đơn hàng.", "error");
    return;
  }

  clearCart();
  renderCheckoutSummary();

  const modal = document.getElementById("successModal");
  const code = document.getElementById("orderCode");
  if (modal && code) {
    code.textContent = order.id;
    modal.classList.remove("hidden");
  }

  showToast("Đặt hàng thành công!", "success");
}

initializePage();
renderCheckoutSummary();

document
  .getElementById("checkoutForm")
  ?.addEventListener("submit", handleCheckoutSubmit);
