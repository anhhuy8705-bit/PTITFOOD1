import {
  clearCart,
  formatCurrency,
  getCart,
  getItemFinalPrice,
  getOrders,
  getPcoinOrderReward,
  getPcoinRedemptionLimit,
  getPcoinWallet,
  initializePage,
  awardOrderPcoins,
  redeemPcoins,
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
  const deliveryFee = 10000;
  const discount = 0;
  const maxPcoinUse = getPcoinRedemptionLimit(subtotal + deliveryFee - discount);
  const pcoinInput = document.getElementById("pcoinToUse");
  const requestedPcoins = Math.max(0, Math.floor(Number(pcoinInput?.value) || 0));
  const pcoinUsed = Math.min(requestedPcoins, maxPcoinUse);
  const total = subtotal + deliveryFee - discount - pcoinUsed;

  return { cart, subtotal, deliveryFee, discount, total, pcoinUsed, maxPcoinUse };
}

let paymentSelectionState = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Cash on Delivery";

function updatePaymentOptionStyles() {
  document.querySelectorAll(".payment-option").forEach((label) => {
    const input = label.querySelector('input[name="paymentMethod"]');
    const isSelected = input && input.value === paymentSelectionState && input.checked;

    label.classList.toggle("bg-[#3d261d]", isSelected);
    label.classList.toggle("border-[#d5a968]", isSelected);
    label.classList.toggle("shadow-[0_0_0_1px_rgba(213,169,104,0.15)]", isSelected);

    const text = label.querySelector(".payment-label-text");
    if (text) {
      text.classList.toggle("text-[#f0c777]", isSelected);
      text.classList.toggle("font-black", isSelected);
      text.classList.toggle("font-bold", !isSelected);
      text.classList.toggle("text-[#d5a968]", !isSelected);
    }
  });
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkoutSummary");
  if (!container) return;

  const { cart, subtotal, deliveryFee, discount, total, pcoinUsed, maxPcoinUse } = getCartSummary();
  const wallet = getPcoinWallet();

  if (!cart.length) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p class="text-[#f7e3cc] font-semibold">Giỏ hàng đang trống. Hãy thêm món trước khi thanh toán.</p>
      </div>
    `;
    document.getElementById("summarySubtotal").textContent = formatCurrency(0);
    document.getElementById("summaryDelivery").textContent =
      formatCurrency(deliveryFee);
    document.getElementById("summaryDiscount").textContent =
      formatCurrency(discount);
    document.getElementById("summaryPcoin").textContent = pcoinUsed ? `-${formatCurrency(pcoinUsed)}` : formatCurrency(0);
    document.getElementById("summaryTotal").textContent = formatCurrency(total);
    document.getElementById("pcoinBalanceCheckout").textContent = wallet.balance.toLocaleString("vi-VN");
    document.getElementById("pcoinMaxCheckout").textContent = maxPcoinUse.toLocaleString("vi-VN");
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
              <h4 class="font-extrabold text-[#f9efe5]">${item.name}${selectedOption}</h4>
              <span class="text-sm font-extrabold text-[#f9efe5]">${formatCurrency(itemPrice * item.quantity)}</span>
            </div>
            <p class="mt-1 text-sm font-medium text-[#efcfa5]">Số lượng: ${item.quantity}</p>
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
  document.getElementById("summaryPcoin").textContent = pcoinUsed ? `-${formatCurrency(pcoinUsed)}` : formatCurrency(0);
  document.getElementById("summaryTotal").textContent = formatCurrency(total);
  document.getElementById("pcoinBalanceCheckout").textContent = wallet.balance.toLocaleString("vi-VN");
  document.getElementById("pcoinMaxCheckout").textContent = maxPcoinUse.toLocaleString("vi-VN");
  const orderReward = getPcoinOrderReward();
  document.getElementById("pcoinOrderReward").textContent = `+${orderReward.amount.toLocaleString("vi-VN")} P-Coin`;
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

  const { total, subtotal, pcoinUsed, maxPcoinUse } = getCartSummary();
  const wallet = getPcoinWallet();
  if (pcoinUsed > wallet.balance || pcoinUsed > maxPcoinUse) {
    showToast("Số P-Coin sử dụng vượt quá số dư hoặc giới hạn 20%.", "error");
    return;
  }

  const orderReward = getPcoinOrderReward();
  const referralBonus = wallet.referralBonusPending && getOrders().length === 0 ? 1500 : 0;
  const order = {
    id: `FD-${Date.now().toString().slice(-6)}`,
    fullName,
    phoneNumber,
    address,
    note,
    paymentMethod,
    items: cart,
    subtotal,
    pcoinUsed,
    pcoinEarned: orderReward.amount + referralBonus,
    total,
    createdAt: new Date().toISOString(),
  };

  if (!saveOrder(order)) {
    showToast("Không thể lưu đơn hàng.", "error");
    return;
  }

  if (pcoinUsed && !redeemPcoins(pcoinUsed, order.id)) {
    showToast("Đơn đã lưu nhưng chưa trừ được P-Coin. Vui lòng liên hệ hỗ trợ.", "error");
  }
  const earned = awardOrderPcoins(order);

  clearCart();
  renderCheckoutSummary();

  const modal = document.getElementById("successModal");
  const code = document.getElementById("orderCode");
  if (modal && code) {
    code.textContent = order.id;
    const rewardLine = document.getElementById("pcoinOrderSuccess");
    if (rewardLine) {
      rewardLine.textContent = `+${earned.total.toLocaleString("vi-VN")} P-Coin đã được cộng vào ví.`;
    }
    modal.classList.remove("hidden");
  }

  showToast(`Đặt hàng thành công! +${earned.total.toLocaleString("vi-VN")} P-Coin`, "success");
}

initializePage();
renderCheckoutSummary();
updatePaymentOptionStyles();

document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    const nextValue = event.target.value;
    paymentSelectionState = nextValue;
    updatePaymentOptionStyles();
  });
});

document
  .getElementById("checkoutForm")
  ?.addEventListener("submit", handleCheckoutSubmit);

document.getElementById("pcoinToUse")?.addEventListener("input", (event) => {
  const { subtotal, deliveryFee, discount } = getCartSummary();
  const maxAllowed = getPcoinRedemptionLimit(subtotal + deliveryFee - discount);
  const requested = Math.max(0, Math.floor(Number(event.target.value) || 0));
  event.target.value = String(Math.min(requested, maxAllowed));
  renderCheckoutSummary();
});
document.getElementById("useMaxPcoin")?.addEventListener("click", () => {
  const summary = getCartSummary();
  const input = document.getElementById("pcoinToUse");
  if (input) input.value = String(summary.maxPcoinUse);
  renderCheckoutSummary();
});
