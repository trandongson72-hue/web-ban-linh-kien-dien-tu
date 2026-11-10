/* ========================================================
   PHẦN DÙNG CHUNG (nạp trước file của từng trang)
   Dữ liệu mẫu, localStorage, định dạng tiền, điều hướng, giỏ hàng,
   modal và bộ gắn sự kiện data-js-action.
   ======================================================== */

/* ========================================================
   1. DATABASE DỮ LIỆU MẪU KHỞI TẠO (MOCK DATABASE LOCALSTORAGE)
   ======================================================== */
const DEFAULT_CATEGORIES = [
  { id: "cat-1", code: "ban-phim", name: "Bàn Phím", profitRate: 30, isHidden: false },
  { id: "cat-2", code: "chuot", name: "Chuột Máy Tính", profitRate: 30, isHidden: false },
  { id: "cat-3", code: "tai-nghe", name: "Tai Nghe", profitRate: 30, isHidden: false },
  { id: "cat-4", code: "phu-kien", name: "Phụ Kiện Khác", profitRate: 30, isHidden: false },
  { id: "cat-5", code: "dien-thoai", name: "Điện Thoại", profitRate: 30, isHidden: false },
  { id: "cat-6", code: "laptop", name: "Laptop", profitRate: 30, isHidden: false }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    code: "KB-AKKO3084",
    categoryId: "cat-1",
    name: "Bàn phím cơ Akko 3084 Silent",
    costPrice: 850000,
    profitRate: 35,
    price: 1147500,
    image: "static/images/keyboard-akko.jpg",
    description: "Bàn phím cơ 84 phím nhỏ gọn, kết nối Type-C, switch Akko chất lượng cao, gõ êm.",
    isHidden: false
  },
  {
    id: "prod-2",
    code: "KB-EK87",
    categoryId: "cat-1",
    name: "Bàn phím Dareu EK87 White",
    costPrice: 420000,
    profitRate: 30,
    price: 546000,
    image: "static/images/keyboard-dareu.jpg",
    description: "Thiết kế Tenkeyless 87 phím, đèn LED Rainbow rực rỡ, switch D-Switch bền bỉ.",
    isHidden: false
  },
  {
    id: "prod-3",
    code: "KB-KEYCHRONK2",
    categoryId: "cat-1",
    name: "Bàn phím cơ không dây Keychron K2",
    costPrice: 1400000,
    profitRate: 35,
    price: 1890000,
    image: "static/images/keyboard-keychron.jpg",
    description: "Hỗ trợ Bluetooth 5.1 và có dây, tương thích hoàn hảo Mac và Windows, pin 4000mAh.",
    isHidden: false
  },
  {
    id: "prod-4",
    code: "MS-G102",
    categoryId: "cat-2",
    name: "Chuột Gaming Logitech G102 Lightsync",
    costPrice: 310000,
    profitRate: 35,
    price: 418500,
    image: "static/images/mouse-logitech-g102.jpg",
    description: "Cảm biến 8000 DPI chuẩn gaming, hệ thống LED RGB Lightsync 16.8 triệu màu.",
    isHidden: false
  },
  {
    id: "prod-5",
    code: "MS-G304",
    categoryId: "cat-2",
    name: "Chuột không dây Logitech G304 Lightspeed",
    costPrice: 620000,
    profitRate: 25,
    price: 775000,
    image: "static/images/mouse-logitech-g304.jpg",
    description: "Công nghệ không dây Lightspeed độ trễ 1ms, cảm biến HERO tiết kiệm pin lên đến 250 giờ.",
    isHidden: false
  },
  {
    id: "prod-6",
    code: "MS-RAZERDA",
    categoryId: "cat-2",
    name: "Chuột Razer DeathAdder Essential",
    costPrice: 350000,
    profitRate: 30,
    price: 455000,
    image: "static/images/mouse-razer-deathadder.jpg",
    description: "Kiểu dáng công thái học huyền thoại, cảm biến quang học 6400 DPI, 5 nút lập trình.",
    isHidden: false
  },
  {
    id: "prod-7",
    code: "HS-EH722",
    categoryId: "cat-3",
    name: "Tai nghe Dareu EH722 7.1",
    costPrice: 400000,
    profitRate: 25,
    price: 500000,
    image: "static/images/headset-dareu.jpg",
    description: "Giả lập âm thanh vòm 7.1 trung thực, đệm tai êm ái, micro khử ồn đàm thoại rõ ràng.",
    isHidden: false
  },
  {
    id: "prod-8",
    code: "PK-USB32G",
    categoryId: "cat-4",
    name: "USB Kingston 32GB DataTraveler",
    costPrice: 85000,
    profitRate: 40,
    price: 119000,
    image: "static/images/usb-kingston.jpg",
    description: "Chuẩn USB 3.2 Gen 1 tốc độ cao, thiết kế nắp xoay kim loại bền đẹp.",
    isHidden: false
  },
  {
    id: "prod-9",
    code: "TN03",
    categoryId: "cat-3",
    name: "Tai nghe Bluetooth chụp tai GoChek SpaceX S-1000",
    costPrice: 453846,
    profitRate: 30,
    price: 590000,
    image: "static/images/TN03.webp",
    description: "Tai nghe chụp tai Bluetooth, đệm tai êm, micro đàm thoại rõ và âm bass mạnh.",
    isHidden: false
  },
  {
    id: "prod-10",
    code: "TN04",
    categoryId: "cat-3",
    name: "Tai nghe UGREEN HiTune Max5c ANC",
    costPrice: 576923,
    profitRate: 30,
    price: 750000,
    image: "static/images/TN04.webp",
    description: "Chống ồn chủ động ANC, Bluetooth 5.3, thời lượng pin lên đến 75 giờ.",
    isHidden: false
  },
  {
    id: "prod-11",
    code: "TN05",
    categoryId: "cat-3",
    name: "Tai nghe Lenovo LP75",
    costPrice: 92308,
    profitRate: 30,
    price: 120000,
    image: "static/images/TN05.webp",
    description: "Tai nghe nhẹ, kết nối Bluetooth ổn định, pin 24 giờ, phù hợp học online và nghe nhạc.",
    isHidden: false
  },
  {
    id: "prod-12",
    code: "DT04",
    categoryId: "cat-5",
    name: "Điện thoại XIAOMI 17",
    costPrice: 5761538,
    profitRate: 30,
    price: 7490000,
    image: "static/images/DT04.webp",
    description: "Màn hình AMOLED 120Hz, camera 50MP, pin 5000mAh và sạc nhanh 67W.",
    isHidden: false
  },
  {
    id: "prod-13",
    code: "DT05",
    categoryId: "cat-5",
    name: "Điện thoại IPhone 13 Mini",
    costPrice: 2300000,
    profitRate: 30,
    price: 2990000,
    image: "static/images/DT05.jpg",
    description: "Thiết kế nhỏ gọn, chip A15, camera kép và hỗ trợ kết nối 5G.",
    isHidden: false
  },
  {
    id: "prod-14",
    code: "DT06",
    categoryId: "cat-5",
    name: "Điện thoại Galaxy S26 Ultra",
    costPrice: 19223077,
    profitRate: 30,
    price: 24990000,
    image: "static/images/DT06.jpg",
    description: "Màn hình lớn 6.9 inch, bút S Pen, camera 200MP và hiệu năng cao cho công việc.",
    isHidden: false
  },
  {
    id: "prod-15",
    code: "LT03",
    categoryId: "cat-6",
    name: "Laptop Gaming ACER NITRO V15",
    costPrice: 21461538,
    profitRate: 30,
    price: 27900000,
    image: "static/images/LT03.webp",
    description: "CPU Intel Core i7, card đồ họa RTX 4060, màn hình 144Hz và hệ thống tản nhiệt tốt.",
    isHidden: false
  },
  {
    id: "prod-16",
    code: "LT04",
    categoryId: "cat-6",
    name: "Laptop Office Slim 14\"",
    costPrice: 8846154,
    profitRate: 30,
    price: 11500000,
    image: "static/images/LT04.webp",
    description: "Mỏng nhẹ 14 inch, chip Intel Core i5, RAM 16GB, phù hợp làm việc văn phòng.",
    isHidden: false
  },
  {
    id: "prod-17",
    code: "LT05",
    categoryId: "cat-6",
    name: "Laptop Air 13\"",
    costPrice: 14538462,
    profitRate: 30,
    price: 18900000,
    image: "static/images/LT05.jpg",
    description: "Màn hình 13 inch, pin 18 giờ, trọng lượng 1.2kg và vỏ kim loại sang trọng.",
    isHidden: false
  },
  {
    id: "prod-18",
    code: "PK03",
    categoryId: "cat-4",
    name: "Pin dự phòng 10000mAh",
    costPrice: 223077,
    profitRate: 30,
    price: 290000,
    image: "static/images/PK03.jpg",
    description: "Dung lượng 10000mAh, sạc nhanh 22.5W, có 2 cổng USB-A và USB-C tiện lợi.",
    isHidden: false
  },
  {
    id: "prod-19",
    code: "PK04",
    categoryId: "cat-2",
    name: "Chuột không dây X11",
    costPrice: 138462,
    profitRate: 30,
    price: 180000,
    image: "static/images/PK04.webp",
    description: "Kết nối 2.4GHz ổn định, thiết kế công thái học, pin dùng đến 12 tháng.",
    isHidden: false
  },
  {
    id: "prod-20",
    code: "PK05",
    categoryId: "cat-1",
    name: "Bàn phím cơ K87",
    costPrice: 500000,
    profitRate: 30,
    price: 650000,
    image: "static/images/PK05.webp",
    description: "Bàn phím cơ 87 phím, switch blue, đèn LED và kết nối USB-C tháo rời.",
    isHidden: false
  }
];

const DEFAULT_USERS = [
  {
    username: "customer1",
    password: "123",
    fullName: "Nguyễn Văn An",
    phone: "0908123456",
    address: "123 Lê Hồng Phong, Quận 5, TP.HCM",
    isLocked: false
  },
  {
    username: "customer2",
    password: "123",
    fullName: "Trần Thị Mai",
    phone: "0912987654",
    address: "45 Nguyễn Trãi, Quận 1, TP.HCM",
    isLocked: false
  }
];

const LEGACY_PRODUCT_IMAGE_PATHS = {
  "static/images/Bàn phím Akko 3084.jpg": "static/images/keyboard-akko.jpg",
  "static/images/Bàn phím Dareu EK87.png": "static/images/keyboard-dareu.jpg",
  "static/images/Bàn phím Keychron K2.webp": "static/images/keyboard-keychron.jpg",
  "static/images/Chuột Logitech G102.jpg": "static/images/mouse-logitech-g102.jpg",
  "static/images/Chuột Logitech G304 Wireless.jpg": "static/images/mouse-logitech-g304.jpg",
  "static/images/Chuột Razer DeathAdder.jpg": "static/images/mouse-razer-deathadder.jpg",
  "static/images/Tai nghe Dareu EH722.jpg": "static/images/headset-dareu.jpg",
  "static/images/USB Kingston 32GB.jpg": "static/images/usb-kingston.jpg"
};

// Phiên bản dữ liệu mẫu. Khi tăng lên, chỉ bổ sung các danh mục / sản phẩm mới
// vào localStorage đang có, không ghi đè hay khôi phục dữ liệu người dùng đã xóa.
const SEED_VERSION = 2;
const SEED_V2_CATEGORY_IDS = ["cat-5", "cat-6"];
const SEED_V2_PRODUCT_IDS = [
  "prod-9", "prod-10", "prod-11", "prod-12",
  "prod-13", "prod-14", "prod-15", "prod-16",
  "prod-17", "prod-18", "prod-19", "prod-20"
];

function applySeedUpdates() {
  const currentVersion = Number(localStorage.getItem("app_seed_version")) || 1;
  if (currentVersion >= SEED_VERSION) return;

  const categories = JSON.parse(localStorage.getItem("app_categories")) || [];
  DEFAULT_CATEGORIES
    .filter(c => SEED_V2_CATEGORY_IDS.includes(c.id))
    .forEach(c => {
      const exists = categories.some(x =>
        x.id === c.id || String(x.code || "").toLowerCase() === c.code.toLowerCase());
      if (!exists) categories.push(c);
    });
  localStorage.setItem("app_categories", JSON.stringify(categories));

  const products = JSON.parse(localStorage.getItem("app_products")) || [];
  DEFAULT_PRODUCTS
    .filter(p => SEED_V2_PRODUCT_IDS.includes(p.id))
    .forEach(p => {
      const exists = products.some(x =>
        x.id === p.id || String(x.code || "").toLowerCase() === p.code.toLowerCase());
      if (!exists) products.push(p);
    });
  localStorage.setItem("app_products", JSON.stringify(products));

  localStorage.setItem("app_seed_version", String(SEED_VERSION));
}

// Bổ sung % lợi nhuận mặc định cho loại sản phẩm cũ (dữ liệu tạo trước bản cập nhật).
// Không ghi đè % đã có để không làm thay đổi giá bán người dùng đã thiết lập.
function applyCategoryProfitRateDefaults() {
  const categories = getCategories();
  let updated = false;

  categories.forEach(category => {
    const rate = Number(category.profitRate);
    const isMissing = category.profitRate === undefined ||
      category.profitRate === null ||
      category.profitRate === "" ||
      !Number.isFinite(rate);
    if (isMissing) {
      category.profitRate = 30;
      updated = true;
    }
  });

  if (updated) setCategories(categories);
}

// Khởi tạo Storage nếu chưa có
function initDataStorage() {
  if (!localStorage.getItem("app_categories")) {
    localStorage.setItem("app_categories", JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem("app_products")) {
    localStorage.setItem("app_products", JSON.stringify(DEFAULT_PRODUCTS));
  }
  const products = JSON.parse(localStorage.getItem("app_products")) || [];
  let productImagesUpdated = false;
  products.forEach(product => {
    const replacement = LEGACY_PRODUCT_IMAGE_PATHS[product.image];
    if (replacement) {
      product.image = replacement;
      productImagesUpdated = true;
    }
  });
  if (productImagesUpdated) {
    localStorage.setItem("app_products", JSON.stringify(products));
  }

  // Bổ sung danh mục / sản phẩm mới cho người đã dùng app trước bản cập nhật này.
  applySeedUpdates();

  // Bổ sung % lợi nhuận cho loại sản phẩm được tạo trước khi có chức năng này.
  // Chỉ điền giá trị thiếu, không ghi đè % người dùng đã nhập.
  applyCategoryProfitRateDefaults();

  if (!localStorage.getItem("app_users")) {
    localStorage.setItem("app_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("app_orders")) {
    // Tạo sẵn 1 đơn mẫu
    const sampleOrder = [{
      orderId: "DH-1001",
      date: new Date().toISOString().split("T")[0],
      username: "customer1",
      recipientName: "Nguyễn Văn An",
      phone: "0908123456",
      address: "123 Lê Hồng Phong, Quận 5, TP.HCM",
      paymentMethod: "COD",
      status: "Mới đặt",
      items: [
        { id: "prod-1", name: "Bàn phím cơ Akko 3084 Silent", price: 1150000, quantity: 1 }
      ],
      total: 1150000
    }];
    localStorage.setItem("app_orders", JSON.stringify(sampleOrder));
  }
  if (!localStorage.getItem("app_imports")) {
    // Tạo sẵn 1 phiếu nhập hàng hoàn thành mẫu
    const sampleImport = [{
      importId: "PN-8801",
      date: new Date().toISOString().split("T")[0],
      status: "completed", // 'draft' hoặc 'completed'
      items: [
        { productId: "prod-1", quantity: 15, costPrice: 850000 },
        { productId: "prod-2", quantity: 20, costPrice: 420000 },
        { productId: "prod-4", quantity: 30, costPrice: 310000 },
        { productId: "prod-5", quantity: 2, costPrice: 620000 } // Tồn ít để test cảnh báo
      ],
      totalAmount: 31690000
    }];
    localStorage.setItem("app_imports", JSON.stringify(sampleImport));
  }
  if (!localStorage.getItem("app_cart")) {
    localStorage.setItem("app_cart", JSON.stringify([]));
  }
}

/* Helper Getters / Setters */
function getCategories() { return JSON.parse(localStorage.getItem("app_categories")) || []; }
function setCategories(data) { localStorage.setItem("app_categories", JSON.stringify(data)); }
function getProducts() { return JSON.parse(localStorage.getItem("app_products")) || []; }
function setProducts(data) { localStorage.setItem("app_products", JSON.stringify(data)); }
function getVisibleProducts() {
  const hiddenCategoryIds = getCategories().filter(c => c.isHidden).map(c => c.id);
  return getProducts().filter(p => !p.isHidden && !hiddenCategoryIds.includes(p.categoryId));
}

// Tính tồn kho có sẵn của một sản phẩm: nhập hoàn thành - đơn đã xử lý/giao
function getAvailableStock(prodId) {
  const imports = getImports().filter(imp => imp.status === 'completed');
  const orders = getOrders().filter(o => o.status === 'Đã xử lý' || o.status === 'Đã giao');

  let stock = 0;
  imports.forEach(imp => {
    imp.items.forEach(it => { if (it.productId === prodId) stock += it.quantity; });
  });
  orders.forEach(order => {
    order.items.forEach(it => { if (it.id === prodId) stock -= it.quantity; });
  });
  return Math.max(0, stock);
}
function getUsers() { return JSON.parse(localStorage.getItem("app_users")) || []; }
function setUsers(data) { localStorage.setItem("app_users", JSON.stringify(data)); }
function getOrders() { return JSON.parse(localStorage.getItem("app_orders")) || []; }
function setOrders(data) { localStorage.setItem("app_orders", JSON.stringify(data)); }
function getImports() { return JSON.parse(localStorage.getItem("app_imports")) || []; }
function setImports(data) { localStorage.setItem("app_imports", JSON.stringify(data)); }
function getCart() { return JSON.parse(localStorage.getItem("app_cart")) || []; }
function setCart(data) { 
  localStorage.setItem("app_cart", JSON.stringify(data)); 
  updateCartBadge();
}
function getCurrentUser() { return JSON.parse(sessionStorage.getItem("current_client_user")); }
function setCurrentUser(user) { 
  if (user) sessionStorage.setItem("current_client_user", JSON.stringify(user));
  else sessionStorage.removeItem("current_client_user");
  renderAuthNav();
}
function isAdminLoggedIn() { return sessionStorage.getItem("admin_logged") === "true"; }

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Chuẩn hóa từ khóa tìm kiếm: bỏ dấu tiếng Việt, đổi "đ" thành "d", chữ thường.
// Dùng chung cho tìm kiếm sản phẩm, phiếu nhập và bảng giá bán ở trang admin.
function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();
}

// Escape HTML để ngăn chặn XSS khi hiển thị dữ liệu người dùng bằng innerHTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(text ?? "")));
  return div.innerHTML;
}

/* ========================================================
   2. ĐIỀU HƯỚNG VIEW (NAVIGATION)
   ======================================================== */
function navigateTo(viewId) {
  const pageByView = {
    "view-home": "index.html",
    "view-product-detail": "index.html",
    "view-cart": "shopping.html",
    "view-checkout": "shopping.html",
    "view-order-success": "shopping.html",
    "view-order-history": "shopping.html",
    "view-profile": "account.html",
    "view-auth": "account.html",
    "view-admin-login": "admin.html",
    "view-admin-dashboard": "admin.html"
  };

  const target = document.getElementById(viewId);
  if (!target) {
    const destination = pageByView[viewId];
    if (destination) {
      window.location.href = `${destination}#${viewId}`;
    }
    return;
  }

  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  if (window.location.hash !== `#${viewId}`) {
    history.replaceState(null, '', `#${viewId}`);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const clientHeader = document.getElementById('client-header');
  if (clientHeader) {
    clientHeader.style.display = (viewId === 'view-admin-dashboard' || viewId === 'view-admin-login') ? 'none' : 'block';
  }

  if (viewId === 'view-home') {
    if (document.getElementById('filter-category')) loadFilterCategories();
    if (document.getElementById('product-container')) renderProducts();
  } else if (viewId === 'view-cart') {
    renderCart();
  } else if (viewId === 'view-order-history') {
    renderOrderHistory();
  } else if (viewId === 'view-profile') {
    loadProfile();
  } else if (viewId === 'view-admin-dashboard') {
    if (!isAdminLoggedIn()) {
      alert("Vui lòng đăng nhập quyền quản trị!");
      navigateTo('view-admin-login');
      return;
    }
    switchAdminTab('users');
  }
}

/* Tìm kiếm nhanh ở thanh header — dùng được ở mọi trang. */
function executeQuickSearch() {
  const searchInput = document.getElementById("top-search-input");
  const val = searchInput ? searchInput.value.trim() : "";
  const keywordInput = document.getElementById("filter-keyword");

  // Nếu đang ở trang khác trang chủ, lưu từ khóa rồi chuyển về trang chủ.
  if (!keywordInput) {
    sessionStorage.setItem("techstore_pending_search", val);
    navigateTo('view-home');
    return;
  }

  keywordInput.value = val;
  navigateTo('view-home');
  // applyAdvancedFilter chỉ được định nghĩa ở index.js (trang chủ).
  if (typeof applyAdvancedFilter === "function") applyAdvancedFilter();
}

/* ========================================================
   GIỎ HÀNG DÙNG CHUNG: THÊM SẢN PHẨM, ĐẾM SỐ LƯỢNG, MỞ GIỎ
   Phần hiển thị / thanh toán nằm ở shopping.js.
   ======================================================== */
function handleCartClick() {
  // YÊU CẦU: Khách hàng phải đăng nhập mới dùng được chức năng giỏ hàng
  if (!getCurrentUser()) {
    alert("Bạn cần ĐĂNG NHẬP để xem và thao tác giỏ hàng!");
    navigateTo('view-auth');
    return;
  }
  navigateTo('view-cart');
}

function addToCart(prodId, quantity = 1) {
  if (!getCurrentUser()) {
    alert("Bạn vui lòng ĐĂNG NHẬP tài khoản trước khi chọn mua sản phẩm!");
    navigateTo('view-auth');
    return;
  }

  const prod = getProducts().find(p => p.id === prodId);
  if (!prod) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === prodId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: quantity
    });
  }
  setCart(cart);
  alert(`Đã thêm ${quantity} x [${prod.name}] vào giỏ hàng!`);
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-counter").innerText = totalCount;
}

/* Thanh điều hướng tài khoản (hiển thị ở header của mọi trang). */

function renderAuthNav() {
  const user = getCurrentUser();
  const div = document.getElementById("auth-links");
  if (user) {
    div.innerHTML = `
      <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-profile"]' data-js-event="click">
        <i class="fa-solid fa-circle-user"></i> Xin chào, <strong>${user.fullName || user.username}</strong>
      </a>
      <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-order-history"]' data-js-event="click">Đơn mua</a>
      <button data-js-action="clientLogout" data-js-args="[]" data-js-event="click"><i class="fa-solid fa-arrow-right-from-bracket"></i> Thoát</button>
    `;
  } else {
    div.innerHTML = `
      <a href="javascript:void(0)" data-js-action="navigateTo" data-js-args='["view-auth"]' data-js-event="click">
        <i class="fa-solid fa-user"></i> Đăng nhập / Đăng ký
      </a>
    `;
  }
}

function clientLogout() {
  setCurrentUser(null);
  alert("Đã đăng xuất tài khoản.");
  navigateTo('view-home');
}

/* ========================================================
   7. MODAL UTILITIES
   ======================================================== */
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

/* ========================================================
   12. EVENT LISTENERS - GẮN SỰ KIỆN TRỰC TIẾP TỪNG PHẦN TỬ
   Các nút/điều khiển dùng data-js-action, data-js-args, data-js-event.
   Mỗi phần tử tự có addEventListener; không dùng event delegation.
   ======================================================== */

function runDataAction(trigger, event) {
  const actionName = trigger.dataset.jsAction;
  let args = [];

  try {
    args = JSON.parse(trigger.dataset.jsArgs || "[]");
  } catch (error) {
    console.error("Không thể đọc tham số của action:", actionName, error);
    return;
  }

  args = args.map(value => {
    if (value === "$value") return trigger.value;
    if (value === "$checked") return trigger.checked;
    if (typeof value === "string" && value.startsWith("$raw:")) {
      console.warn("Tham số action chưa được chuyển đổi:", value);
      return undefined;
    }
    return value;
  });

  const action = window[actionName];
  if (typeof action !== "function") {
    console.warn(`Không tìm thấy hàm xử lý "${actionName}".`);
    return;
  }

  if (event.type === "click" && trigger.matches("a")) {
    event.preventDefault();
  }

  action(...args);

  // Sau khi hàm xử lý cập nhật giao diện bằng innerHTML, gắn listener
  // trực tiếp cho các phần tử mới được tạo. Không dùng event delegation.
  bindDataActionsIn(document);
}

const boundActionElements = new WeakSet();

function bindDataActionElement(element) {
  if (!(element instanceof Element)) return;
  if (!element.matches("[data-js-action]") || boundActionElements.has(element)) return;

  const eventName = element.dataset.jsEvent || "click";
  element.addEventListener(eventName, event => runDataAction(element, event));
  boundActionElements.add(element);
}

function bindDataActionsIn(root) {
  if (!(root instanceof Element || root instanceof Document)) return;

  if (root instanceof Element) bindDataActionElement(root);
  root.querySelectorAll?.("[data-js-action]").forEach(bindDataActionElement);
}

function initializeDataActionListeners() {
  // Gắn addEventListener trực tiếp lên từng phần tử hiện có.
  // Phần tử tạo động sẽ được gắn lại sau mỗi action và sau lần render khởi tạo.
  bindDataActionsIn(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDataActionListeners, { once: true });
} else {
  initializeDataActionListeners();
}

/* ========================================================
   KHỞI TẠO CHUNG
   ======================================================== */

window.addEventListener("load", () => {
  initDataStorage();
  renderAuthNav();
  updateCartBadge();

  // Mở đúng view theo URL hash, hoặc view đầu tiên của từng trang.
  const requestedView = window.location.hash.slice(1);
  const firstView = document.querySelector('.view-section.active') || document.querySelector('.view-section');
  const initialView = document.getElementById(requestedView) ? requestedView : (firstView ? firstView.id : null);
  if (initialView) navigateTo(initialView);

  // Gắn listener cho các nút được tạo trong quá trình render ban đầu.
  bindDataActionsIn(document);
});
