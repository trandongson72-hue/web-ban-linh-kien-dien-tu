/* ========================================================
   TRANG CHỦ (index.html)
   Lọc, tìm kiếm, phân trang và xem chi tiết sản phẩm.
   ======================================================== */

/* ========================================================
   3. PHÂN HỆ KHÁCH HÀNG: HIỂN THỊ, TÌM KIẾM & PHÂN TRANG
   ======================================================== */
let currentPage = 1;
const itemsPerPage = 4; // Để test phân trang dễ dàng
let filteredProductList = null;

function loadFilterCategories() {
  const cats = getCategories().filter(c => !c.isHidden);
  const filterSelect = document.getElementById("filter-category");
  filterSelect.innerHTML = `<option value="">-- Tất cả phân loại --</option>`;
  cats.forEach(c => {
    filterSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

function applyAdvancedFilter() {
  const keyword = normalizeSearchText(document.getElementById("filter-keyword").value);
  const catId = document.getElementById("filter-category").value;
  const priceRange = document.getElementById("filter-price-range").value;
  const categories = getCategories();
  const prods = getVisibleProducts();

  filteredProductList = prods.filter(p => {
    const category = categories.find(c => c.id === p.categoryId);
    const searchableText = normalizeSearchText([
      p.name,
      p.code,
      p.description,
      category ? category.name : ""
    ].join(" "));
    const matchKeyword = !keyword || searchableText.includes(keyword);
    const matchCat = !catId || String(p.categoryId) === catId;
    const price = Number(p.price);
    let matchPrice = priceRange === "all" || !priceRange;
    if (priceRange === "under-500") matchPrice = Number.isFinite(price) && price < 500000;
    else if (priceRange === "500-1500") matchPrice = Number.isFinite(price) && price >= 500000 && price <= 1500000;
    else if (priceRange === "over-1500") matchPrice = Number.isFinite(price) && price > 1500000;

    return matchKeyword && matchCat && matchPrice;
  });

  currentPage = 1;
  renderProducts();
}

function resetFilter() {
  document.getElementById("filter-keyword").value = "";
  document.getElementById("filter-category").value = "";
  document.getElementById("filter-price-range").value = "all";
  document.getElementById("top-search-input").value = "";
  filteredProductList = getVisibleProducts();
  currentPage = 1;
  renderProducts();
}

function renderProducts() {
  if (filteredProductList === null) {
    filteredProductList = getVisibleProducts();
  }

  const totalItems = filteredProductList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredProductList.slice(startIdx, startIdx + itemsPerPage);

  const container = document.getElementById("product-container");
  container.innerHTML = "";

  if (pageItems.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Không tìm thấy sản phẩm phù hợp.</div>`;
  } else {
    const cats = getCategories();
    pageItems.forEach(prod => {
      const cat = cats.find(c => c.id === prod.categoryId);
      container.innerHTML += `
        <div class="product-card">
          <div class="product-thumb" data-js-action="viewProductDetail" data-js-args='["${prod.id}"]' data-js-event="click" style="cursor: pointer;">
            <img src="${prod.image}" alt="${prod.name}" onerror="this.onerror=null;this.src='static/images/default-product.svg';">
          </div>
          <div class="product-body">
            <span class="product-category">${cat ? cat.name : 'Linh kiện'}</span>
            <div class="product-title" data-js-action="viewProductDetail" data-js-args='["${prod.id}"]' data-js-event="click">${prod.name}</div>
            <div class="product-price">${formatVND(prod.price)}</div>
            <div class="product-actions">
              <button class="btn btn-outline-primary btn-sm" style="flex:1;" data-js-action="viewProductDetail" data-js-args='["${prod.id}"]' data-js-event="click">Chi tiết</button>
              <button class="btn btn-primary btn-sm" style="flex:1;" data-js-action="addToCart" data-js-args='["${prod.id}",1]' data-js-event="click"><i class="fa-solid fa-cart-plus"></i> Mua</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Render Pagination
  const pagination = document.getElementById("product-pagination");
  pagination.innerHTML = "";
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <button class="page-btn ${i === currentPage ? 'active' : ''}" data-js-action="goToPage" data-js-args='[${i}]' data-js-event="click">${i}</button>
      `;
    }
  }

  // Các nút vừa tạo bằng innerHTML (Chi tiết, Mua, số trang...) chưa có sự kiện nên phải gắn lại.
  // Bắt buộc có dòng này vì lúc mở trang renderProducts() chạy 2 lần (navigateTo trong common.js,
  // rồi cái load của file này); lần chạy sau thay mới toàn bộ nút, làm mất sự kiện đã gắn ở lần trước.
  bindDataActionsIn(document);
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function viewProductDetail(prodId) {
  const prod = getProducts().find(p => p.id === prodId);
  if (!prod) return;
  const cat = getCategories().find(c => c.id === prod.categoryId);
  // Không cho xem sản phẩm đã ẩn hoặc thuộc loại đang ẩn
  if (prod.isHidden || (cat && cat.isHidden)) {
    alert("Sản phẩm này hiện không khả dụng.");
    return;
  }

  const detailContainer = document.getElementById("detail-container");
  detailContainer.innerHTML = `
    <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 6px;">
      <img src="${prod.image}" alt="${prod.name}" style="max-width: 100%; max-height: 350px; object-fit: contain;" onerror="this.onerror=null;this.src='static/images/default-product.svg';">
    </div>
    <div>
      <span class="badge badge-info">${cat ? cat.name : 'Linh kiện'}</span>
      <h2 style="margin: 10px 0;">${prod.name}</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Mã sản phẩm: <strong>${prod.code}</strong></p>
      <h3 style="color: var(--danger-color); font-size: 24px; margin-bottom: 16px;">${formatVND(prod.price)}</h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 6px;">Mô tả sản phẩm:</h4>
        <p style="line-height: 1.6; color: #4b5563;">${prod.description}</p>
      </div>

      <div style="display: flex; gap: 12px; align-items: center; margin-top: 24px;">
        <div style="display: flex; align-items: center;">
          <button class="btn btn-secondary btn-sm" data-js-action="changeDetailQty" data-js-args="[-1]" data-js-event="click">-</button>
          <input type="number" id="detail-qty" value="1" min="1" style="width: 50px; text-align: center; height: 32px; border: 1px solid var(--gray-border); margin: 0 4px;">
          <button class="btn btn-secondary btn-sm" data-js-action="changeDetailQty" data-js-args="[1]" data-js-event="click">+</button>
        </div>
        <button class="btn btn-primary" data-js-action="addFromDetail" data-js-args='["${prod.id}"]' data-js-event="click"><i class="fa-solid fa-cart-plus"></i> Thêm Vào Giỏ Hàng</button>
      </div>
    </div>
  `;
  navigateTo('view-product-detail');
}

function changeDetailQty(amount) {
  const input = document.getElementById("detail-qty");
  let val = parseInt(input.value) || 1;
  val += amount;
  if (val < 1) val = 1;
  input.value = val;
}

function addFromDetail(prodId) {
  const qty = parseInt(document.getElementById("detail-qty").value) || 1;
  addToCart(prodId, qty);
}

/* ========================================================
   KHỞI TẠO RIÊNG TRANG CHỦ
   ======================================================== */

window.addEventListener("load", () => {
  if (document.getElementById('filter-category')) loadFilterCategories();

  if (document.getElementById('product-container')) {
    renderProducts();

    // Từ khóa được lưu lại khi khách tìm kiếm từ trang khác rồi quay về trang chủ.
    const pendingSearch = sessionStorage.getItem("techstore_pending_search");
    if (pendingSearch !== null) {
      sessionStorage.removeItem("techstore_pending_search");
      const keywordInput = document.getElementById("filter-keyword");
      if (keywordInput) keywordInput.value = pendingSearch;
      applyAdvancedFilter();
    }
  }
});
