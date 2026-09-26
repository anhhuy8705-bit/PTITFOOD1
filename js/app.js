import { products, reviews as seedReviews } from "./db.js";

export const STORAGE_KEYS = {
  cart: "cart",
  reviews: "reviews",
  user: "user",
  orders: "orders",
  pcoinWallet: "pcoinWallet",
};

const PCOIN_EXPIRY_DAYS = 60;
const PCOIN_REVIEW_FIRST_PHOTO = 1000;
const PCOIN_REVIEW_PHOTO = 300;
const PCOIN_REFERRAL = 1500;

export function safeParse(value, fallback) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch (error) {
    console.warn("Failed to parse localStorage value:", error);
    return fallback;x
  }
}

export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.cart)) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(seedReviews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.user)) {
    localStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify({
        name: "PTITFOOD User",
        avatar: "PT",
      }),
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.pcoinWallet)) {
    localStorage.setItem(
      STORAGE_KEYS.pcoinWallet,
      JSON.stringify(createPcoinWallet()),
    );
  }
}

function createPcoinWallet() {
  const now = new Date();
  const year = now.getFullYear();
  const resetDate = new Date(year, 4, 31);
  return {
    balance: 0,
    lastActivityAt: null,
    annualResetYear: now >= resetDate ? year : year - 1,
    referralCode: `PTIT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    referredBy: null,
    referralBonusPending: false,
    firstPhotoReviewAwarded: false,
    transactions: [],
  };
}

function maintainPcoinWallet(wallet, now = new Date()) {
  let changed = false;
  const year = now.getFullYear();
  const resetDate = new Date(year, 4, 31);

  if (wallet.annualResetYear < year && now >= resetDate) {
    if (wallet.balance > 0) {
      wallet.transactions.unshift({
        id: `pc-${Date.now()}-reset`,
        type: "reset",
        amount: -wallet.balance,
        label: "Reset P-Coin toàn trường ngày 31/05",
        createdAt: now.toISOString(),
      });
      wallet.balance = 0;
    }
    wallet.annualResetYear = year;
    wallet.lastActivityAt = null;
    changed = true;
  }

  if (wallet.lastActivityAt) {
    const inactiveDays = (now.getTime() - new Date(wallet.lastActivityAt).getTime()) / 86400000;
    if (inactiveDays >= PCOIN_EXPIRY_DAYS) {
      if (wallet.balance > 0) {
        wallet.transactions.unshift({
          id: `pc-${Date.now()}-expiry`,
          type: "reset",
          amount: -wallet.balance,
          label: "Điểm hết hạn sau 60 ngày không hoạt động",
          createdAt: now.toISOString(),
        });
        wallet.balance = 0;
      }
      wallet.lastActivityAt = null;
      changed = true;
    }
  }

  wallet.transactions = Array.isArray(wallet.transactions)
    ? wallet.transactions.slice(0, 100)
    : [];
  return changed;
}

export function getPcoinWallet() {
  let wallet;
  try {
    wallet = safeParse(localStorage.getItem(STORAGE_KEYS.pcoinWallet), null);
  } catch (error) {
    wallet = null;
  }

  if (!wallet || typeof wallet !== "object") {
    wallet = createPcoinWallet();
  }

  wallet.balance = Math.max(0, Math.floor(Number(wallet.balance) || 0));
  wallet.annualResetYear = Number(wallet.annualResetYear) || new Date().getFullYear();
  wallet.referralCode ||= createPcoinWallet().referralCode;
  wallet.transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];
  if (maintainPcoinWallet(wallet)) {
    try {
      localStorage.setItem(STORAGE_KEYS.pcoinWallet, JSON.stringify(wallet));
    } catch (error) {
      console.warn("Cannot update P-Coin expiry:", error);
    }
  }
  return wallet;
}

function savePcoinWallet(wallet) {
  try {
    localStorage.setItem(STORAGE_KEYS.pcoinWallet, JSON.stringify(wallet));
    updatePcoinBadge(wallet.balance);
    return true;
  } catch (error) {
    console.warn("Cannot save P-Coin wallet:", error);
    return false;
  }
}

function addPcoinTransaction(wallet, amount, type, label, referenceId = "") {
  wallet.balance = Math.max(0, wallet.balance + amount);
  wallet.lastActivityAt = new Date().toISOString();
  wallet.transactions.unshift({
    id: `pc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    amount,
    label,
    referenceId,
    createdAt: wallet.lastActivityAt,
  });
  wallet.transactions = wallet.transactions.slice(0, 100);
}

export function getPcoinOrderReward(orderAlreadySaved = false) {
  const now = new Date();
  const thisMonthOrders = getOrders().filter((order) => {
    const date = new Date(order.createdAt);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;
  const orderCountAfterThisOrder = thisMonthOrders + (orderAlreadySaved ? 0 : 1);
  if (orderCountAfterThisOrder > 20) return { amount: 600, tier: "Thủ Khoa" };
  if (orderCountAfterThisOrder >= 15) return { amount: 400, tier: "Học Bá" };
  return { amount: 200, tier: "Tân Sinh Viên" };
}

export function getPcoinRedemptionLimit(subtotal) {
  return Math.max(0, Math.min(getPcoinWallet().balance, Math.floor(Number(subtotal || 0) * 0.2)));
}

export function redeemPcoins(amount, referenceId = "") {
  const wallet = getPcoinWallet();
  const points = Math.floor(Number(amount) || 0);
  if (points <= 0 || points > wallet.balance) return false;
  addPcoinTransaction(wallet, -points, "redeem", "Dùng P-Coin thanh toán đơn hàng", referenceId);
  return savePcoinWallet(wallet);
}

export function awardOrderPcoins(order) {
  const wallet = getPcoinWallet();
  const reward = getPcoinOrderReward(true);
  addPcoinTransaction(wallet, reward.amount, "order", `Hoàn điểm đơn hàng · Hạng ${reward.tier}`, order.id);

  let referralBonus = 0;
  if (wallet.referralBonusPending && getOrders().length === 1) {
    referralBonus = PCOIN_REFERRAL;
    addPcoinTransaction(wallet, referralBonus, "referral", "Thưởng mã giới thiệu ở đơn đầu tiên", order.id);
    wallet.referralBonusPending = false;
  }

  savePcoinWallet(wallet);
  return { orderReward: reward.amount, referralBonus, total: reward.amount + referralBonus, tier: reward.tier };
}

export function awardPhotoReviewPcoins(review) {
  const wallet = getPcoinWallet();
  if (!getOrders().length) return { amount: 0, reason: "Đánh giá có ảnh chỉ được thưởng sau đơn hàng đầu tiên." };

  let amount;
  let type;
  let label;
  if (!wallet.firstPhotoReviewAwarded) {
    amount = PCOIN_REVIEW_FIRST_PHOTO;
    type = "review-first-photo";
    label = "Thưởng đánh giá ảnh sau đơn đầu tiên";
    wallet.firstPhotoReviewAwarded = true;
  } else {
    const weekAgo = Date.now() - 7 * 86400000;
    const weeklyReviews = wallet.transactions.filter(
      (transaction) => transaction.type === "review-photo" && new Date(transaction.createdAt).getTime() >= weekAgo,
    ).length;
    if (weeklyReviews >= 2) return { amount: 0, reason: "Bạn đã nhận tối đa 2 thưởng đánh giá ảnh trong 7 ngày." };
    amount = PCOIN_REVIEW_PHOTO;
    type = "review-photo";
    label = "Thưởng đánh giá ảnh món ăn";
  }

  addPcoinTransaction(wallet, amount, type, label, review.id);
  if (!savePcoinWallet(wallet)) return { amount: 0, reason: "Chưa lưu được ví P-Coin." };
  return { amount, reason: "" };
}

export function claimReferralCode(code) {
  const wallet = getPcoinWallet();
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (getOrders().length || wallet.referredBy || wallet.referralBonusPending) {
    return { ok: false, message: "Mã giới thiệu chỉ áp dụng trước đơn hàng đầu tiên." };
  }
  if (!/^PTIT-[A-Z0-9]{6}$/.test(normalizedCode)) {
    return { ok: false, message: "Mã mời chưa đúng định dạng PTIT-XXXXXX." };
  }
  if (normalizedCode === wallet.referralCode) {
    return { ok: false, message: "Bạn không thể sử dụng mã giới thiệu của chính mình." };
  }
  wallet.referredBy = normalizedCode;
  wallet.referralBonusPending = true;
  if (!savePcoinWallet(wallet)) return { ok: false, message: "Chưa lưu được mã giới thiệu." };
  return { ok: true, message: "Đã ghi nhận mã mời. Bạn nhận 1.500 P-Coin sau đơn đầu tiên." };
}

function updatePcoinBadge(balance = getPcoinWallet().balance) {
  document.querySelectorAll("[data-pcoin-balance]").forEach((element) => {
    element.textContent = Number(balance).toLocaleString("vi-VN");
  });
}

function renderPcoinPanel() {
  const panel = document.getElementById("pcoinPanel");
  if (!panel) return;
  const wallet = getPcoinWallet();
  const recentTransactions = wallet.transactions.slice(0, 3);
  panel.querySelector("[data-pcoin-panel-balance]").textContent = wallet.balance.toLocaleString("vi-VN");
  panel.querySelector("[data-pcoin-referral-code]").textContent = wallet.referralCode;
  panel.querySelector("[data-pcoin-referral-status]").textContent = wallet.referralBonusPending
    ? "Mã đã ghi nhận · thưởng 1.500 điểm sau đơn đầu tiên"
    : wallet.referredBy
      ? `Đã dùng mã ${wallet.referredBy}`
      : "Mời bạn mới · thưởng 1.500 điểm sau đơn đầu tiên của bạn";
  const ledger = panel.querySelector("[data-pcoin-ledger]");
  ledger.innerHTML = recentTransactions.length
    ? recentTransactions.map((transaction) => `<li><span>${transaction.label}</span><strong class="${transaction.amount < 0 ? "is-debit" : ""}">${transaction.amount > 0 ? "+" : ""}${transaction.amount.toLocaleString("vi-VN")}</strong></li>`).join("")
    : "<li><span>Chưa có giao dịch P-Coin</span><strong>0</strong></li>";
  updatePcoinBadge(wallet.balance);
}

function setupPcoinWallet() {
  if (document.getElementById("pcoinWalletWidget")) {
    renderPcoinPanel();
    return;
  }

  const cartLink = document.querySelector('header a[href="cart.html"]:not(.nav-link)');
  if (!cartLink) return;

  const wrapper = document.createElement("div");
  wrapper.id = "pcoinWalletWidget";
  wrapper.className = "pcoin-wallet-widget";
  wrapper.innerHTML = `
    <button type="button" class="pcoin-wallet-trigger" aria-expanded="false" aria-controls="pcoinPanel">
      <span class="pcoin-wallet-symbol" aria-hidden="true">P</span><span><strong data-pcoin-balance>0</strong><small>P-Coin</small></span>
    </button>
    <section class="pcoin-wallet-panel" id="pcoinPanel" aria-label="Ví P-Coin" hidden>
      <div class="pcoin-panel-heading"><div><span>VÍ THÀNH VIÊN</span><h2>Điểm của bạn</h2></div><button type="button" class="pcoin-panel-close" aria-label="Đóng ví">×</button></div>
      <div class="pcoin-balance-card"><strong data-pcoin-panel-balance>0</strong><span>P-Coin · 1 điểm = 1 VNĐ</span></div>
      <div class="pcoin-referral-block"><div><span>MÃ MỜI CỦA BẠN</span><strong data-pcoin-referral-code></strong></div><button type="button" data-copy-referral>Sao chép</button><p>Nhập mã bạn bè trước đơn đầu để nhận 1.500 P-Coin.</p></div>
      <form class="pcoin-referral-form"><label for="pcoinReferralInput">Bạn có mã mời?</label><div><input id="pcoinReferralInput" maxlength="11" placeholder="PTIT-XXXXXX" autocomplete="off"><button type="submit">Áp dụng</button></div><small data-pcoin-referral-status></small></form>
      <div class="pcoin-rules"><strong>Quy tắc sử dụng</strong><p>Dùng tối đa 20% tổng giá trị đơn mới.</p><p>Điểm hết hạn sau 60 ngày không có giao dịch.</p><p>Toàn bộ điểm reset ngày 31/05 hằng năm.</p><a href="index.html#student-perks">Xem cách tích điểm →</a></div>
      <ul class="pcoin-ledger" data-pcoin-ledger aria-label="Giao dịch gần đây"></ul>
      <p class="pcoin-demo-note">Ví lưu trên trình duyệt này; đồng bộ người mời cần kết nối máy chủ.</p>
    </section>
  `;
  cartLink.insertAdjacentElement("afterend", wrapper);
  document.body.append(wrapper.querySelector(".pcoin-wallet-panel"));

  const trigger = wrapper.querySelector(".pcoin-wallet-trigger");
  const panel = document.getElementById("pcoinPanel");
  const closePanel = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };
  trigger.addEventListener("click", () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
    if (opening) renderPcoinPanel();
  });
  panel.querySelector(".pcoin-panel-close").addEventListener("click", closePanel);
  panel.querySelector("[data-copy-referral]").addEventListener("click", async (event) => {
    const code = getPcoinWallet().referralCode;
    try {
      await navigator.clipboard.writeText(code);
      event.currentTarget.textContent = "Đã sao chép";
    } catch (error) {
      const input = document.createElement("textarea");
      input.value = code;
      input.style.position = "fixed";
      document.body.append(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      event.currentTarget.textContent = "Đã sao chép";
    }
    setTimeout(() => { event.currentTarget.textContent = "Sao chép"; }, 1800);
  });
  panel.querySelector(".pcoin-referral-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = panel.querySelector("#pcoinReferralInput");
    const result = claimReferralCode(input.value);
    const status = panel.querySelector("[data-pcoin-referral-status]");
    status.textContent = result.message;
    status.classList.toggle("is-error", !result.ok);
    if (result.ok) {
      input.value = "";
      renderPcoinPanel();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePanel();
  });
  renderPcoinPanel();
}

export function getCart() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.cart), []);
  } catch (error) {
    console.warn("Cart access error:", error);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    updateCartBadge();
    return true;
  } catch (error) {
    console.warn("Cannot save cart:", error);
    showToast("Không thể lưu giỏ hàng.", "error");
    return false;
  }
}

export function getItemFinalPrice(item) {
  if (!item) return 0;

  if (item.selectedOption) {
    const optionPrice = Number(
      item.selectedOption.price ??
        item.options?.find((option) => option.id === item.selectedOption.id)?.price ??
        item.finalPrice ??
        item.price ??
        0,
    );
    return optionPrice || Number(item.finalPrice || item.price || 0);
  }

  return Number(item.finalPrice ?? item.price ?? 0);
}

export function addToCart(product, quantity = 1) {
  if (!product || quantity < 1) {
    showToast("Số lượng sản phẩm không hợp lệ.", "error");
    return;
  }

  const cart = getCart();
  const selectedOption = product.selectedOption
    ? product.options?.find((option) => option.id === product.selectedOption.id) ?? product.selectedOption
    : null;
  const finalPrice = selectedOption
    ? Number(selectedOption.price || 0)
    : Number(product.price || 0);
  const optionKey = selectedOption ? selectedOption.id : "default";

  const existingItem = cart.find((item) => {
    const itemOptionKey = item.selectedOption ? item.selectedOption.id : "default";
    return item.id === product.id && itemOptionKey === optionKey;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.finalPrice = finalPrice;
    existingItem.selectedOption = selectedOption
      ? { ...selectedOption }
      : existingItem.selectedOption;
  } else {
    const cartItem = {
      ...product,
      quantity,
      selectedOption: selectedOption ? { ...selectedOption } : undefined,
      finalPrice,
    };

    cart.push(cartItem);
  }

  saveCart(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng`, "success");
}

export function removeFromCart(productId, optionId = "default") {
  const cart = getCart().filter((item) => {
    const itemOptionId = item.selectedOption ? item.selectedOption.id : "default";
    return !(item.id === productId && itemOptionId === optionId);
  });
  saveCart(cart);
}

export function updateCartQuantity(productId, quantity, optionId = "default") {
  if (quantity < 1) {
    removeFromCart(productId, optionId);
    return;
  }

  const cart = getCart();
  const item = cart.find((entry) => {
    const entryOptionId = entry.selectedOption ? entry.selectedOption.id : "default";
    return entry.id === productId && entryOptionId === optionId;
  });

  if (!item) return;

  item.quantity = quantity;
  item.finalPrice = getItemFinalPrice(item);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getReviews() {
  try {
    const value = safeParse(
      localStorage.getItem(STORAGE_KEYS.reviews),
      seedReviews,
    );
    return Array.isArray(value) ? value : [...seedReviews];
  } catch (error) {
    console.warn("Reviews access error:", error);
    return [...seedReviews];
  }
}

export function saveReview(review) {
  try {
    const list = getReviews();
    list.push(review);
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(list));
    return list;
  } catch (error) {
    console.warn("Cannot save review:", error);
    return getReviews();
  }
}

export function getOrders() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.orders), []);
  } catch (error) {
    console.warn("Orders access error:", error);
    return [];
  }
}

export function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.warn("Cannot save order:", error);
    return false;
  }
}

export function getUser() {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEYS.user), {
      name: "PTITFOOD User",
      avatar: "PT",
    });
  } catch (error) {
    return { name: "PTITFOOD User", avatar: "PT" };
  }
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) || null;
}

export function formatCurrency(price) {
  const amount = Number(price || 0);
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

export function formatRating(value) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) {
    return "0,0";
  }

  return numeric.toFixed(1).replace(".", ",");
}

export function calculateAverageRating(productId) {
  const productReviews = getReviews().filter(
    (review) => review.productId === productId,
  );

  if (!productReviews.length) {
    return 0;
  }

  const total = productReviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0,
  );
  return Number((total / productReviews.length).toFixed(1));
}

export function updateCartBadge() {
  const count = getCart().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
  const badgeItems = document.querySelectorAll("[data-cart-count]");

  badgeItems.forEach((element) => {
    element.textContent = String(count);
    if (count === 0) {
      element.classList.add("hidden");
    } else {
      element.classList.remove("hidden");
    }
  });
}

export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="toast-icon">${type === "error" ? "!" : "✓"}</span>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

export function initializePage() {
  initializeStorage();
  updateCartBadge();
  setupHeaderNavigation();
  setupHeaderSearch();
  setupPcoinWallet();
  setupSupportChatbot();
}

function setupSupportChatbot() {
  if (document.getElementById("supportChatbot")) return;

  const widget = document.createElement("aside");
  widget.id = "supportChatbot";
  widget.className = "support-chatbot";
  widget.innerHTML = `
    <section class="support-chat-panel" id="supportChatPanel" aria-label="Chat hỗ trợ PTITFOOD" hidden>
      <header class="support-chat-header">
        <span class="support-avatar support-avatar-small" aria-hidden="true">
          <svg viewBox="0 0 64 64"><path class="robot-antenna" d="M32 8V4"/><circle class="robot-antenna-tip" cx="32" cy="3" r="2.5"/><rect class="robot-ear" x="6" y="32" width="10" height="13" rx="3"/><rect class="robot-ear" x="48" y="32" width="10" height="13" rx="3"/><rect class="robot-head" x="14" y="21" width="36" height="35" rx="7"/><path class="robot-helmet" d="M10 24c0-12 9-20 22-20s22 8 22 20H10z"/><path class="robot-visor" d="M7 23h50c-2 4-10 6-25 6S9 27 7 23z"/><text class="robot-helmet-label" x="32" y="19" text-anchor="middle">PTIT</text><rect class="robot-faceplate" x="20" y="32" width="24" height="18" rx="4"/><circle class="robot-eye" cx="27" cy="39" r="2"/><circle class="robot-eye" cx="37" cy="39" r="2"/><path class="robot-mouth" d="M28 45h8"/></svg>
        </span>
        <span class="support-chat-title"><strong>PTITFOOD hỗ trợ</strong><small>Trợ lý trực tuyến</small></span>
        <button type="button" class="support-chat-close" aria-label="Đóng khung chat">×</button>
      </header>
      <div class="support-chat-messages" aria-live="polite" aria-relevant="additions">
        <div class="support-chat-message support-chat-bot">Chào bạn! Mình có thể giúp gì cho bạn hôm nay?</div>
      </div>
      <div class="support-chat-quick-replies" aria-label="Câu hỏi nhanh">
        <button type="button">Cách đặt món</button>
        <button type="button">Theo dõi đơn</button>
        <button type="button">P-Coin & Fast-Track</button>
      </div>
      <form class="support-chat-form">
        <label class="support-chat-sr-only" for="supportChatInput">Nhập câu hỏi</label>
        <input id="supportChatInput" type="text" placeholder="Nhập câu hỏi của bạn..." autocomplete="off" />
        <button type="submit" aria-label="Gửi tin nhắn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Z"/><path d="M10.3 13.7 21 3"/></svg>
        </button>
      </form>
    </section>
    <div class="support-chat-launcher-wrap">
      <span class="support-chat-greeting">Cần hỗ trợ?</span>
      <button type="button" class="support-chat-launcher" aria-label="Mở chatbot hỗ trợ" aria-expanded="false" aria-controls="supportChatPanel">
        <span class="support-avatar" aria-hidden="true">
          <svg viewBox="0 0 64 64"><path class="robot-antenna" d="M32 8V4"/><circle class="robot-antenna-tip" cx="32" cy="3" r="2.5"/><rect class="robot-ear" x="6" y="32" width="10" height="13" rx="3"/><rect class="robot-ear" x="48" y="32" width="10" height="13" rx="3"/><rect class="robot-head" x="14" y="21" width="36" height="35" rx="7"/><path class="robot-helmet" d="M10 24c0-12 9-20 22-20s22 8 22 20H10z"/><path class="robot-visor" d="M7 23h50c-2 4-10 6-25 6S9 27 7 23z"/><text class="robot-helmet-label" x="32" y="19" text-anchor="middle">PTIT</text><rect class="robot-faceplate" x="20" y="32" width="24" height="18" rx="4"/><circle class="robot-eye" cx="27" cy="39" r="2"/><circle class="robot-eye" cx="37" cy="39" r="2"/><path class="robot-mouth" d="M28 45h8"/></svg>
        </span>
        <span class="support-chat-online-dot" aria-hidden="true"></span>
      </button>
    </div>
  `;
  document.body.append(widget);

  const panel = widget.querySelector(".support-chat-panel");
  const launcher = widget.querySelector(".support-chat-launcher");
  const input = widget.querySelector(".support-chat-form input");
  const messages = widget.querySelector(".support-chat-messages");

  const replies = [
    { match: /đặt|mua|menu|thực đơn|món/i, text: "Bạn vào mục Thực đơn, chọn món yêu thích rồi nhấn Đặt món. Món sẽ được thêm vào giỏ để bạn kiểm tra và thanh toán." },
    { match: /theo dõi|trạng thái|đơn hàng|giao hàng/i, text: "Bạn có thể xem thông tin đơn trong mục Giỏ hàng hoặc kiểm tra xác nhận đơn hàng sau khi đặt thành công nhé." },
    { match: /coin|fast.track|ưu tiên|hạng|hoàn|điểm/i, text: "PTITFOOD có các hạng Tân Sinh Viên, Học Bá và Thủ Khoa. Tích đủ 4.500 P-Coin có thể đổi 1 thẻ Fast-Track; xem chi tiết tại mục Đặc quyền sinh viên trên trang chủ." },
    { match: /thanh toán|tiền|mã giảm|sinh nhật|khuyến mãi/i, text: "Bạn kiểm tra phương thức thanh toán và ưu đãi hiện có ở bước Thanh toán trước khi xác nhận đơn nhé." },
  ];

  const appendMessage = (text, sender) => {
    const message = document.createElement("div");
    message.className = `support-chat-message support-chat-${sender}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const sendMessage = (text) => {
    const question = text.trim();
    if (!question) return;
    appendMessage(question, "user");
    const answer = replies.find((item) => item.match.test(question))?.text
      || "Mình đã ghi nhận câu hỏi. Bạn có thể hỏi về cách đặt món, theo dõi đơn, thanh toán hoặc P-Coin và Fast-Track nhé.";
    window.setTimeout(() => appendMessage(answer, "bot"), 450);
  };

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
  };

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  widget.querySelector(".support-chat-close").addEventListener("click", () => setOpen(false));
  widget.querySelector(".support-chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
    input.value = "";
    input.focus();
  });
  widget.querySelectorAll(".support-chat-quick-replies button").forEach((button) => {
    button.addEventListener("click", () => sendMessage(button.textContent));
  });
}

export function setupHeaderNavigation() {
  const activePath = window.location.pathname.split("/").pop() || "index.html";
  const navMap = {
    "index.html": "home",
    "products.html": "products",
    "cart.html": "cart",
    "checkout.html": "checkout",
  };

  const activeKey = navMap[activePath];

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const isActive = link.dataset.nav === activeKey;
    link.classList.toggle("active", isActive);
  });
}

export function setupHeaderSearch() {
  const form = document.getElementById("headerSearchForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const query = input ? input.value.trim() : "";

    if (!query) {
      window.location.href = "products.html";
      return;
    }

    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
