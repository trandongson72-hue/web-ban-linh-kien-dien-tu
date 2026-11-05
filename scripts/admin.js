/* ========================================================
   QUẢN TRỊ VIÊN (admin.html)
   Khách hàng, loại sản phẩm, sản phẩm, nhập hàng, giá bán,
   đơn hàng và báo cáo Nhập - Xuất - Tồn.
   ======================================================== */

/* ========================================================
   6. PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN DASHBOARD SYSTEM)
   ======================================================== */
function executeAdminLogin() {
  const u = document.getElementById("admin-user-input").value.trim();
  const p = document.getElementById("admin-pass-input").value.trim();

  // Đăng nhập riêng cho Admin (yêu cầu đề bài)
  if (u === "admin" && p === "123") {
    sessionStorage.setItem("admin_logged", "true");
    alert("Đăng nhập Admin thành công!");
    navigateTo('view-admin-dashboard');
  } else {
    alert("Tài khoản quản trị không chính xác! (Mặc định: admin / 123)");
  }
}

function adminLogout() {
  sessionStorage.removeItem("admin_logged");
  alert("Đã thoát phiên quản trị.");
  navigateTo('view-home');
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-sub-section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));

  const sec = document.getElementById(`admin-sec-${tabName}`);
  const menu = document.getElementById(`menu-${tabName}`);
  if (sec) sec.style.display = 'block';
  if (menu) menu.classList.add('active');

  if (tabName === 'users') renderAdminUsers();
  else if (tabName === 'categories') renderAdminCategories();
  else if (tabName === 'products') renderAdminProducts();
  else if (tabName === 'import') renderImportReceipts();
  else if (tabName === 'pricing') renderAdminPricing();
  else if (tabName === 'orders') renderAdminOrders();
  else if (tabName === 'inventory') {
    loadInventoryFilterCats();
    renderInventoryReport();
    renderNxtReport();
  }
}

/* 6.1 Admin: Quản lý người dùng */
function renderAdminUsers() {
  const users = getUsers();
  const tbody = document.getElementById("admin-user-table-body");
  tbody.innerHTML = "";

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${u.username}</strong></td>
        <td>${u.fullName || '--'}</td>
        <td>${u.phone || '--'}</td>
        <td>
          ${u.isLocked 
            ? '<span class="badge badge-danger">Đang Khóa</span>' 
            : '<span class="badge badge-success">Hoạt động</span>'}
        </td>
        <td>
          <button class="btn btn-warning btn-sm" data-js-action="resetUserPassword" data-js-args='["${u.username}"]' data-js-event="click"><i class="fa-solid fa-key"></i> Reset Pass</button>
          <button class="btn ${u.isLocked ? 'btn-success' : 'btn-danger'} btn-sm" data-js-action="toggleLockUser" data-js-args='["${u.username}"]' data-js-event="click">
            <i class="fa-solid ${u.isLocked ? 'fa-lock-open' : 'fa-lock'}"></i> ${u.isLocked ? 'Mở Khóa' : 'Khóa'}
          </button>
        </td>
      </tr>
    `;
  });
}

function resetUserPassword(username) {
  if (confirm(`Bạn có chắc muốn đặt lại mật khẩu của [${username}] về mặc định "123"?`)) {
    let users = getUsers();
    const target = users.find(u => u.username === username);
    if (target) {
      target.password = "123";
      setUsers(users);
      alert(`Mật khẩu của tài khoản [${username}] đã được reset thành "123"!`);
    }
  }
}

function toggleLockUser(username) {
  let users = getUsers();
  const target = users.find(u => u.username === username);
  if (target) {
    target.isLocked = !target.isLocked;
    setUsers(users);
    renderAdminUsers();
  }
}

/* 6.2 Admin: Quản lý loại sản phẩm */
function renderAdminCategories() {
  const cats = getCategories();
  const allProducts = getProducts();
  const tbody = document.getElementById("admin-category-table-body");
  tbody.innerHTML = "";

  if (cats.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">Chưa có loại sản phẩm nào. Bấm "Thêm Loại" để tạo mới.</td></tr>`;
    return;
  }

  cats.forEach(c => {
    const productCount = allProducts.filter(p => p.categoryId === c.id).length;
    const countCell = productCount > 0
      ? `<span class="badge badge-info">${productCount}</span>`
      : `<span style="color: var(--text-muted);">0</span>`;

    tbody.innerHTML += `
      <tr>
        <td><code>${c.code}</code></td>
        <td><strong>${c.name}</strong></td>
        <td>${countCell}</td>
        <td>${c.isHidden ? '<span class="badge badge-danger">Đã Ẩn</span>' : '<span class="badge badge-success">Hiển Thị</span>'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" data-js-action="openCategoryModal" data-js-args='["${c.id}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa</button>
          <button class="btn btn-outline-primary btn-sm" data-js-action="toggleHideCategory" data-js-args='["${c.id}"]' data-js-event="click">
            ${c.isHidden ? 'Hiện' : 'Ẩn'}
          </button>
          <button class="btn btn-danger btn-sm" data-js-action="deleteCategory" data-js-args='["${c.id}"]' data-js-event="click"><i class="fa-solid fa-trash"></i> Xóa</button>
        </td>
      </tr>
    `;
  });
}

function openCategoryModal(catId = null) {
  document.getElementById("cat-id-edit").value = catId || "";
  if (catId) {
    const cat = getCategories().find(c => c.id === catId);
    document.getElementById("cat-modal-title").innerText = "Sửa Loại Sản Phẩm";
    document.getElementById("cat-code-input").value = cat.code;
    document.getElementById("cat-name-input").value = cat.name;
  } else {
    document.getElementById("cat-modal-title").innerText = "Thêm Loại Sản Phẩm Mới";
    document.getElementById("cat-code-input").value = "";
    document.getElementById("cat-name-input").value = "";
  }
  openModal("modal-category");
}

function saveCategory() {
  const id = document.getElementById("cat-id-edit").value;
  const code = document.getElementById("cat-code-input").value.trim();
  const name = document.getElementById("cat-name-input").value.trim();

  if (!code || !name) {
    alert("Vui lòng nhập đầy đủ mã và tên loại!");
    return;
  }

  let cats = getCategories();
  const duplicated = cats.some(c => (c.code || "").toLowerCase() === code.toLowerCase() && c.id !== id);
  if (duplicated) {
    alert(`Mã loại "${code}" đã được dùng cho một loại khác.\nVui lòng chọn mã khác.`);
    return;
  }

  if (id) {
    const cat = cats.find(c => c.id === id);
    if (cat) { cat.code = code; cat.name = name; }
  } else {
    cats.push({ id: "cat-" + Date.now(), code, name, isHidden: false });
  }
  setCategories(cats);
  closeModal("modal-category");
  renderAdminCategories();
}

function toggleHideCategory(id) {
  let cats = getCategories();
  const cat = cats.find(c => c.id === id);
  if (!cat) return;

  // Ẩn loại cũng làm toàn bộ sản phẩm bên trong biến mất khỏi cửa hàng
  // (xem getVisibleProducts), nên phải nói rõ trước khi ẩn.
  if (!cat.isHidden) {
    const productCount = getProducts().filter(p => p.categoryId === id).length;
    if (productCount > 0) {
      const ok = confirm(
        `Ẩn loại "${cat.name}"?\n\n` +
        `${productCount} sản phẩm thuộc loại này cũng sẽ không hiển thị trên cửa hàng.\n` +
        `Dữ liệu vẫn giữ nguyên — bấm "Hiện" để hiển thị lại.`
      );
      if (!ok) return;
    }
  }

  cat.isHidden = !cat.isHidden;
  setCategories(cats);
  renderAdminCategories();
  renderAdminProducts();
}

let pendingDeleteCategoryId = null;

// Mở hộp thoại xóa loại. Loại còn sản phẩm sẽ có thêm nút "Ẩn loại";
// loại rỗng thì chỉ còn "Xóa loại" và "Hủy".
function deleteCategory(id) {
  const cat = getCategories().find(c => c.id === id);
  if (!cat) return;

  const productCount = getProducts().filter(p => p.categoryId === id).length;
  pendingDeleteCategoryId = id;

  document.getElementById("delete-cat-warning").innerHTML = productCount > 0
    ? `Loại <strong>${cat.name}</strong> đang có <strong>${productCount}</strong> sản phẩm.<br><br>` +
      `<strong>Ẩn loại:</strong> sản phẩm vẫn còn, chỉ không hiển thị trên cửa hàng và có thể bấm "Hiện" để khôi phục.<br>` +
      `<strong>Vẫn xóa loại:</strong> ${productCount} sản phẩm sẽ bị ẩn và không còn thuộc loại nào.<br>` +
      `<strong>Xóa loại + sản phẩm:</strong> xóa vĩnh viễn cả loại và ${productCount} sản phẩm bên trong (chỉ khi sản phẩm chưa phát sinh đơn hàng / phiếu nhập).<br><br>` +
      `Các đơn hàng đã đặt vẫn giữ nguyên sản phẩm và hoạt động bình thường.`
    : `Loại <strong>${cat.name}</strong> chưa có sản phẩm nào.<br><br>Bạn có chắc chắn muốn xóa loại này?`;

  // Loại đã ẩn sẵn thì nút "Ẩn loại" không còn ý nghĩa.
  const hideBtn = document.getElementById("btn-hide-category");
  if (hideBtn) hideBtn.style.display = (productCount > 0 && !cat.isHidden) ? "" : "none";

  // Không có sản phẩm thì không cần nút "Xóa loại + sản phẩm".
  const delProdBtn = document.getElementById("btn-delete-category-products");
  if (delProdBtn) delProdBtn.style.display = productCount > 0 ? "" : "none";

  const confirmBtn = document.getElementById("btn-confirm-delete-category");
  if (confirmBtn) confirmBtn.textContent = productCount > 0 ? "Vẫn xóa loại" : "Xóa loại";

  openModal("modal-delete-category");
}

function hideCategoryInstead() {
  const cats = getCategories();
  const cat = cats.find(c => c.id === pendingDeleteCategoryId);
  closeModal("modal-delete-category");
  pendingDeleteCategoryId = null;
  if (!cat) return;

  cat.isHidden = true;
  setCategories(cats);
  renderAdminCategories();
  renderAdminProducts();
  alert(`Đã ẩn loại "${cat.name}". Bấm "Hiện" để hiển thị lại.`);
}

function confirmDeleteCategory() {
  const id = pendingDeleteCategoryId;
  const cats = getCategories();
  const cat = cats.find(c => c.id === id);
  closeModal("modal-delete-category");
  pendingDeleteCategoryId = null;
  if (!cat) return;

  // Xóa loại. Sản phẩm bên trong bị ẩn và bỏ liên kết loại để không còn
  // trỏ tới một categoryId không tồn tại.
  const products = getProducts();
  let affected = 0;
  products.forEach(p => {
    if (p.categoryId === id) {
      p.categoryId = "";
      p.isHidden = true;
      affected++;
    }
  });

  setCategories(cats.filter(c => c.id !== id));
  if (affected > 0) setProducts(products);

  renderAdminCategories();
  renderAdminProducts();

  alert(affected > 0
    ? `Đã xóa loại "${cat.name}". ${affected} sản phẩm đã được ẩn và bỏ loại.`
    : `Đã xóa loại "${cat.name}".`);
}

// Xóa vĩnh viễn loại và toàn bộ sản phẩm bên trong.
// Chỉ cho phép khi các sản phẩm chưa phát sinh đơn hàng / phiếu nhập, để báo cáo
// tồn kho không bị mất số liệu. Trường hợp đã phát sinh giao dịch thì hướng dẫn
// dùng "Vẫn xóa loại" (ẩn sản phẩm, giữ lịch sử).
function deleteCategoryWithProducts() {
  const id = pendingDeleteCategoryId;
  const cats = getCategories();
  const cat = cats.find(c => c.id === id);
  if (!cat) return;

  const products = getProducts();
  const inCategory = products.filter(p => p.categoryId === id);
  if (inCategory.length === 0) return;

  const orders = getOrders();
  const imports = getImports();
  const inOrders = p => orders.filter(o => (o.items || []).some(it => it.id === p.id)).length;
  const inImports = p => imports.filter(imp => (imp.items || []).some(it => it.productId === p.id)).length;

  const blocked = inCategory
    .map(p => ({ product: p, orders: inOrders(p), imports: inImports(p) }))
    .filter(x => x.orders > 0 || x.imports > 0);

  if (blocked.length > 0) {
    const lines = blocked.slice(0, 5).map(x => {
      const refs = [];
      if (x.orders > 0) refs.push(`${x.orders} đơn hàng`);
      if (x.imports > 0) refs.push(`${x.imports} phiếu nhập`);
      return `- ${x.product.name}: ${refs.join(", ")}`;
    }).join("\n");
    const more = blocked.length > 5 ? `\n... và ${blocked.length - 5} sản phẩm khác` : "";

    alert(
      `Không thể xóa sạch loại "${cat.name}" vì ${blocked.length} sản phẩm đã phát sinh giao dịch:\n` +
      `${lines}${more}\n\n` +
      `Bấm "Vẫn xóa loại" để ẩn các sản phẩm này và giữ nguyên lịch sử đơn hàng / phiếu nhập.`
    );
    return;
  }

  if (!confirm(
    `Xóa vĩnh viễn loại "${cat.name}" và ${inCategory.length} sản phẩm bên trong?\n\n` +
    `Thao tác này không thể hoàn tác.`
  )) return;

  closeModal("modal-delete-category");
  pendingDeleteCategoryId = null;

  setCategories(cats.filter(c => c.id !== id));
  setProducts(products.filter(p => p.categoryId !== id));

  renderAdminCategories();
  renderAdminProducts();

  alert(`Đã xóa loại "${cat.name}" và ${inCategory.length} sản phẩm.`);
}

/* 6.3 Admin: Quản lý danh mục sản phẩm */
function renderAdminProducts() {
  const prods = getProducts();
  const cats = getCategories();
  const tbody = document.getElementById("admin-product-table-body");
  tbody.innerHTML = "";

  if (prods.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">Chưa có sản phẩm nào. Bấm "Thêm Sản Phẩm Mới" để tạo mới.</td></tr>`;
    return;
  }

  prods.forEach(p => {
    const cat = cats.find(c => c.id === p.categoryId);

    // Sản phẩm có thể bị ẩn trực tiếp, hoặc ẩn gián tiếp vì loại của nó đang ẩn.
    // Phải hiển thị đúng cả hai trường hợp, tránh báo "Hiển Thị" sai sự thật.
    let statusBadge = '<span class="badge badge-success">Hiển Thị</span>';
    if (p.isHidden) {
      statusBadge = '<span class="badge badge-danger">Đã Ẩn</span>';
    } else if (cat && cat.isHidden) {
      statusBadge = '<span class="badge badge-warning" title="Loại sản phẩm đang ẩn nên sản phẩm cũng không hiển thị trên cửa hàng">Ẩn theo loại</span>';
    }

    tbody.innerHTML += `
      <tr>
        <td><img src="${p.image}" width="40" height="40" style="object-fit: contain; background: #eee; border-radius: 4px;" onerror="this.onerror=null;this.src='static/images/default-product.svg';"></td>
        <td><code>${p.code}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${cat ? cat.name : 'Chưa phân loại'}</td>
        <td>${formatVND(p.price)}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-secondary btn-sm" data-js-action="openProductModal" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa</button>
          <button class="btn btn-outline-primary btn-sm" data-js-action="toggleHideProduct" data-js-args='["${p.id}"]' data-js-event="click">${p.isHidden ? 'Hiện' : 'Ẩn'}</button>
          <button class="btn btn-danger btn-sm" data-js-action="deleteProduct" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-trash"></i> Xóa</button>
        </td>
      </tr>
    `;
  });
}

function openProductModal(prodId = null) {
  const cats = getCategories();
  const select = document.getElementById("prod-cat-select");
  select.innerHTML = "";
  cats.forEach(c => select.innerHTML += `<option value="${c.id}">${c.name}</option>`);

  document.getElementById("prod-id-edit").value = prodId || "";

  // YÊU CẦU: Hiển thị đúng thông tin trước khi sửa
  if (prodId) {
    const prod = getProducts().find(p => p.id === prodId);
    document.getElementById("prod-modal-title").innerText = "Sửa Thông Tin Sản Phẩm";
    document.getElementById("prod-code-input").value = prod.code;
    document.getElementById("prod-cat-select").value = prod.categoryId;
    document.getElementById("prod-name-input").value = prod.name;
    document.getElementById("prod-price-input").value = prod.price;
    document.getElementById("prod-img-input").value = prod.image;
    document.getElementById("prod-desc-input").value = prod.description;
  } else {
    document.getElementById("prod-modal-title").innerText = "Thêm Sản Phẩm Mới";
    document.getElementById("prod-code-input").value = "";
    document.getElementById("prod-name-input").value = "";
    document.getElementById("prod-price-input").value = "";
    document.getElementById("prod-img-input").value = "";
    document.getElementById("prod-desc-input").value = "";
  }
  openModal("modal-product");
}

function saveProduct() {
  const id = document.getElementById("prod-id-edit").value;
  const code = document.getElementById("prod-code-input").value.trim();
  const catId = document.getElementById("prod-cat-select").value;
  const name = document.getElementById("prod-name-input").value.trim();
  const price = parseFloat(document.getElementById("prod-price-input").value) || 0;
  const img = document.getElementById("prod-img-input").value.trim() || 'static/images/default-product.svg';
  const desc = document.getElementById("prod-desc-input").value.trim();

  if (!code || !name || price <= 0) {
    alert("Vui lòng điền đủ thông tin hợp lệ!");
    return;
  }

  if (!catId) {
    alert(getCategories().length === 0
      ? "Chưa có loại sản phẩm nào. Hãy tạo loại sản phẩm trước khi thêm sản phẩm."
      : "Vui lòng chọn loại sản phẩm cho sản phẩm này.");
    return;
  }
  if (!getCategories().some(c => c.id === catId)) {
    alert("Loại sản phẩm đã chọn không tồn tại. Vui lòng chọn lại.");
    return;
  }

  let prods = getProducts();
  const duplicated = prods.some(p => (p.code || "").toLowerCase() === code.toLowerCase() && p.id !== id);
  if (duplicated) {
    alert(`Mã sản phẩm "${code}" đã được dùng cho sản phẩm khác.\nVui lòng chọn mã khác.`);
    return;
  }

  if (id) {
    const p = prods.find(item => item.id === id);
    if (p) {
      p.code = code;
      p.categoryId = catId;
      p.name = name;
      p.price = price;
      // Tab "Quản lý giá bán" tính giá bán = giá vốn × (1 + %lợi nhuận).
      // Giá vốn do phiếu nhập quyết định nên không sửa ở đây; thay vào đó suy ngược
      // %lợi nhuận từ giá bán vừa nhập để 3 con số không mâu thuẫn nhau.
      if (p.costPrice > 0) {
        p.profitRate = Number(((price / p.costPrice - 1) * 100).toFixed(4)); // 4 chữ số để giá bán tính lại từ % không lệch vài chục đồng
      }
      p.image = img;
      p.description = desc;
    }
  } else {
    prods.push({
      id: "prod-" + Date.now(),
      code, categoryId: catId, name,
      // Giá vốn suy ra từ giá bán theo đúng công thức dùng ở tab "Quản lý giá bán":
      // price = costPrice * (1 + profitRate / 100), với profitRate mặc định 30%.
      costPrice: Math.round(price / 1.3),
      profitRate: 30,
      price, image: img, description: desc,
      isHidden: false
    });
  }
  setProducts(prods);
  closeModal("modal-product");
  renderAdminProducts();
}

function toggleHideProduct(id) {
  let prods = getProducts();
  const p = prods.find(item => item.id === id);
  if (p) {
    p.isHidden = !p.isHidden;
    setProducts(prods);
    renderAdminProducts();
  }
}

function deleteProduct(id) {
  const prods = getProducts();
  const p = prods.find(item => item.id === id);
  if (!p) return;

  // Sản phẩm đã phát sinh giao dịch thì không được xóa: nếu xóa, báo cáo tồn kho
  // (mục 8) sẽ mất số liệu nhập/xuất của sản phẩm đó. Đơn hàng lưu sản phẩm ở it.id,
  // phiếu nhập lưu ở it.productId. Muốn ngừng bán thì dùng nút "Ẩn".
  const orderCount = getOrders().filter(o => (o.items || []).some(it => it.id === id)).length;
  const importCount = getImports().filter(imp => (imp.items || []).some(it => it.productId === id)).length;
  if (orderCount > 0 || importCount > 0) {
    alert(`Không thể xóa sản phẩm "${p.name}" vì đã phát sinh giao dịch:\n` +
      `- ${orderCount} đơn hàng\n- ${importCount} phiếu nhập\n\n` +
      `Hãy bấm "Ẩn" để ngừng bán nhưng vẫn giữ lịch sử và số liệu tồn kho.`);
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}"?`)) {
    setProducts(prods.filter(item => item.id !== id));
    renderAdminProducts();
  }
}

/* 6.4 Admin: Quản lý nhập hàng */
let currentDraftImportItems = [];

function renderImportReceipts() {
  const search = document.getElementById("search-import-input").value.toLowerCase().trim();
  const imports = getImports().filter(imp => imp.importId.toLowerCase().includes(search));
  const tbody = document.getElementById("admin-import-table-body");
  tbody.innerHTML = "";

  imports.forEach(imp => {
    const isDraft = imp.status === 'draft';
    tbody.innerHTML += `
      <tr>
        <td><strong>${imp.importId}</strong></td>
        <td>${imp.date}</td>
        <td><strong>${formatVND(imp.totalAmount)}</strong></td>
        <td>
          ${isDraft 
            ? '<span class="badge badge-warning">Bản Nháp (Có thể sửa)</span>' 
            : '<span class="badge badge-success">Đã Hoàn Thành</span>'}
        </td>
        <td>
          ${isDraft 
            ? `<button class="btn btn-primary btn-sm" data-js-action="editImport" data-js-args='["${imp.importId}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa / Hoàn thành</button>` 
            : `<button class="btn btn-secondary btn-sm" data-js-action="viewCompletedImport" data-js-args='["${imp.importId}"]' data-js-event="click">Xem chi tiết</button>`}
        </td>
      </tr>
    `;
  });
}

function openCreateImportModal() {
  document.getElementById("import-id-edit").value = "";
  document.getElementById("import-code-input").value = "PN-" + Math.floor(1000 + Math.random() * 9000);
  document.getElementById("import-date-input").value = new Date().toISOString().split("T")[0];
  currentDraftImportItems = [];

  populateImportProductSelect();
  renderDraftImportItemsTable();
  openModal("modal-import");
}

function populateImportProductSelect() {
  const select = document.getElementById("import-add-prod-select");
  select.innerHTML = "";
  getProducts().forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.name} (${p.code})</option>`;
  });
}

function addItemToImport() {
  const prodId = document.getElementById("import-add-prod-select").value;
  const qty = parseInt(document.getElementById("import-add-qty").value) || 1;
  const cost = parseFloat(document.getElementById("import-add-cost").value) || 0;

  if (cost <= 0) {
    alert("Vui lòng nhập giá nhập lớn hơn 0!");
    return;
  }

  const prod = getProducts().find(p => p.id === prodId);
  const existing = currentDraftImportItems.find(it => it.productId === prodId);
  if (existing) {
    existing.quantity += qty;
    existing.costPrice = cost;
  } else {
    currentDraftImportItems.push({
      productId: prodId,
      productName: prod ? prod.name : '',
      quantity: qty,
      costPrice: cost
    });
  }
  renderDraftImportItemsTable();
}

function renderDraftImportItemsTable() {
  const tbody = document.getElementById("import-items-tbody");
  tbody.innerHTML = "";
  currentDraftImportItems.forEach((it, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${it.productName || it.productId}</td>
        <td>${it.quantity}</td>
        <td>${formatVND(it.costPrice)}</td>
        <td>${formatVND(it.quantity * it.costPrice)}</td>
        <td><button class="btn btn-danger btn-sm" data-js-action="removeDraftImportItem" data-js-args="[${idx}]" data-js-event="click">×</button></td>
      </tr>
    `;
  });
}

function editImport(impId) {
  const imp = getImports().find(i => i.importId === impId);
  if (!imp) return;
  if (imp.status === 'completed') {
    alert("Phiếu nhập đã hoàn thành, không thể sửa!");
    return;
  }

  document.getElementById("import-id-edit").value = imp.importId;
  document.getElementById("import-code-input").value = imp.importId;
  document.getElementById("import-date-input").value = imp.date;
  currentDraftImportItems = [...imp.items];
  populateImportProductSelect();
  renderDraftImportItemsTable();
  openModal("modal-import");
}

function saveDraftImport() {
  saveImportWithStatus('draft');
}

function completeImport() {
  // YÊU CẦU: Chỉ có thể sửa trước khi bấm hoàn thành
  if (confirm("Khi hoàn thành, giá vốn và kho sẽ được cập nhật và KHÔNG thể sửa đổi phiếu này nữa. Bạn chắc chắn chứ?")) {
    saveImportWithStatus('completed');
  }
}

function saveImportWithStatus(status) {
  if (currentDraftImportItems.length === 0) {
    alert("Phiếu nhập phải có ít nhất 1 sản phẩm!");
    return;
  }

  const impId = document.getElementById("import-code-input").value;
  const date = document.getElementById("import-date-input").value;
  const total = currentDraftImportItems.reduce((sum, it) => sum + (it.quantity * it.costPrice), 0);

  let imports = getImports();
  const existingIdx = imports.findIndex(i => i.importId === impId);

  const importData = {
    importId: impId,
    date: date,
    status: status,
    items: currentDraftImportItems,
    totalAmount: total
  };

  if (existingIdx !== -1) imports[existingIdx] = importData;
  else imports.unshift(importData);

  setImports(imports);

  // Nếu hoàn thành, cập nhật luôn giá vốn và tự tính lại giá bán cho sản phẩm
  if (status === 'completed') {
    let prods = getProducts();
    currentDraftImportItems.forEach(it => {
      const p = prods.find(item => item.id === it.productId);
      if (p) {
        p.costPrice = it.costPrice;
        // Tự tính giá bán = costPrice * (1 + profitRate / 100)
        p.price = Math.round(p.costPrice * (1 + (p.profitRate ?? 30) / 100));
      }
    });
    setProducts(prods);
  }

  closeModal("modal-import");
  renderImportReceipts();
  alert(`Đã lưu phiếu nhập với trạng thái: ${status === 'completed' ? 'ĐÃ HOÀN THÀNH' : 'BẢN NHÁP'}!`);
}

function viewCompletedImport(impId) {
  const imp = getImports().find(i => i.importId === impId);
  if (!imp) return;
  let text = `Mã phiếu: ${imp.importId}\nNgày: ${imp.date}\nTổng tiền: ${formatVND(imp.totalAmount)}\n\nChi tiết:\n`;
  imp.items.forEach(it => {
    text += `- SL: ${it.quantity} x ${formatVND(it.costPrice)}\n`;
  });
  alert(text);
}

/* 6.5 Admin: Quản lý giá bán & % lợi nhuận */
function renderAdminPricing() {
  const prods = getProducts();
  const cats = getCategories();
  const tbody = document.getElementById("admin-pricing-table-body");
  tbody.innerHTML = "";

  prods.forEach(p => {
    const cat = cats.find(c => c.id === p.categoryId);
    const rateText = Number(Number(p.profitRate ?? 30).toFixed(2)).toLocaleString("vi-VN");
    tbody.innerHTML += `
      <tr>
        <td><code>${p.code}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${cat ? cat.name : 'Chưa phân loại'}</td>
        <td>${formatVND(p.costPrice || 0)}</td>
        <td><strong style="color: var(--primary-color);">${rateText}%</strong></td>
        <td><strong style="color: var(--danger-color);">${formatVND(p.price)}</strong></td>
        <td>
          <button class="btn btn-primary btn-sm" data-js-action="openProfitModal" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa Giá &amp; %</button>
        </td>
      </tr>
    `;
  });
}

function openProfitModal(prodId) {
  const p = getProducts().find(item => item.id === prodId);
  if (!p) return;
  document.getElementById("profit-prod-id").value = p.id;
  document.getElementById("profit-prod-name").value = p.name;
  document.getElementById("profit-cost-value").value = p.costPrice || 0;
  document.getElementById("profit-cost-display").value = formatVND(p.costPrice || 0);
  document.getElementById("profit-price-input").value = p.price || 0;
  document.getElementById("profit-rate-input").value = p.profitRate ?? 30;
  openModal("modal-profit");
}

// Đổi giá bán -> tính lại % lợi nhuận theo giá vốn.
function syncProfitFromPrice() {
  const cost = parseFloat(document.getElementById("profit-cost-value").value) || 0;
  const price = parseFloat(document.getElementById("profit-price-input").value) || 0;
  if (cost <= 0 || price <= 0) return;
  document.getElementById("profit-rate-input").value =
    Number(((price / cost - 1) * 100).toFixed(4));
}

// Đổi % lợi nhuận -> tính lại giá bán theo giá vốn.
function syncPriceFromProfit() {
  const cost = parseFloat(document.getElementById("profit-cost-value").value) || 0;
  const rate = parseFloat(document.getElementById("profit-rate-input").value) || 0;
  if (cost <= 0) return;
  document.getElementById("profit-price-input").value =
    Math.round(cost * (1 + rate / 100));
}

function saveProfitRate() {
  const id = document.getElementById("profit-prod-id").value;
  const cost = parseFloat(document.getElementById("profit-cost-value").value) || 0;
  const price = parseFloat(document.getElementById("profit-price-input").value) || 0;
  const rate = parseFloat(document.getElementById("profit-rate-input").value) || 0;

  if (price <= 0) {
    alert("Giá bán phải lớn hơn 0.");
    return;
  }

  let prods = getProducts();
  const p = prods.find(item => item.id === id);
  if (p) {
    p.price = Math.round(price);
    // Giá bán là số người dùng nhập, % lợi nhuận suy ra từ giá vốn để hai ô luôn khớp.
    p.profitRate = cost > 0
      ? Number(((p.price / cost - 1) * 100).toFixed(4))
      : rate;
    setProducts(prods);
  }
  closeModal("modal-profit");
  renderAdminPricing();
  alert("Đã cập nhật giá bán và % lợi nhuận thành công!");
}

/* 6.6 Admin: Quản lý đơn đặt hàng */
function renderAdminOrders() {
  const fromDate = document.getElementById("filter-order-from").value;
  const toDate = document.getElementById("filter-order-to").value;
  const statusFilter = document.getElementById("filter-order-status").value;

  let orders = getOrders();

  if (fromDate) orders = orders.filter(o => o.date >= fromDate);
  if (toDate) orders = orders.filter(o => o.date <= toDate);
  if (statusFilter !== 'all') orders = orders.filter(o => o.status === statusFilter);

  const tbody = document.getElementById("admin-order-table-body");
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">Không có đơn hàng nào thỏa điều kiện lọc.</td></tr>`;
    return;
  }

  orders.forEach(o => {
    let statusBadge = "badge-info";
    if (o.status === "Đã xử lý") statusBadge = "badge-warning";
    else if (o.status === "Đã giao") statusBadge = "badge-success";
    else if (o.status === "Hủy") statusBadge = "badge-danger";

    tbody.innerHTML += `
      <tr>
        <td><strong>${o.orderId}</strong></td>
        <td>${o.date}</td>
        <td>${o.recipientName} (${o.phone})</td>
        <td><strong>${formatVND(o.total)}</strong></td>
        <td><span class="badge ${statusBadge}">${o.status}</span></td>
        <td>
          <button class="btn btn-outline-primary btn-sm" data-js-action="openAdminOrderDetail" data-js-args='["${o.orderId}"]' data-js-event="click"><i class="fa-solid fa-eye"></i> Xem & Xử lý</button>
        </td>
      </tr>
    `;
  });
}

function openAdminOrderDetail(orderId) {
  const order = getOrders().find(o => o.orderId === orderId);
  if (!order) return;

  const content = document.getElementById("admin-order-detail-content");

  // Đơn đã kết thúc (Đã giao / Hủy) thì không cho đổi trạng thái nữa.
  // Lý do: báo cáo tồn kho chỉ trừ kho với đơn "Đã xử lý" và "Đã giao",
  // nên sửa lại trạng thái của đơn đã giao/hủy sẽ làm số liệu tồn kho sai lệch.
  const isLocked = order.status === 'Đã giao' || order.status === 'Hủy';

  let itemsHtml = order.items.map(it => `
    <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
      <span>${it.name} (x${it.quantity})</span>
      <span>${formatVND(it.price * it.quantity)}</span>
    </div>
  `).join('');

  content.innerHTML = `
    <p><strong>Mã đơn:</strong> ${order.orderId} | <strong>Ngày đặt:</strong> ${order.date}</p>
    <p><strong>Người nhận:</strong> ${order.recipientName} - ${order.phone}</p>
    <p><strong>Địa chỉ giao:</strong> ${order.address}</p>
    <p><strong>Phương thức:</strong> ${order.paymentMethod}</p>
    <hr style="border:0; border-top: 1px solid var(--gray-border); margin: 10px 0;">
    <h5 style="margin-bottom: 6px;">Chi tiết sản phẩm:</h5>
    ${itemsHtml}
    <h4 style="color: var(--danger-color); margin-top: 10px;">Tổng tiền: ${formatVND(order.total)}</h4>
    <hr style="border:0; border-top: 1px solid var(--gray-border); margin: 14px 0;">
    
    <!-- YÊU CẦU: Cập nhật 4 trạng thái: mới đặt, đã xử lý, đã giao, hủy -->
    <div class="form-group">
      <label style="font-weight: 600;">Cập nhật tình trạng đơn hàng:</label>
      <select id="update-order-status-select" class="form-select" style="margin-top: 6px;" ${isLocked ? 'disabled' : ''}>
        <option value="Mới đặt" ${order.status === 'Mới đặt' ? 'selected' : ''}>Mới đặt</option>
        <option value="Đã xử lý" ${order.status === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
        <option value="Đã giao" ${order.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
        <option value="Hủy" ${order.status === 'Hủy' ? 'selected' : ''}>Hủy</option>
      </select>
      <button class="btn btn-primary" style="margin-top: 10px;" data-js-action="saveOrderStatus" data-js-args='["${order.orderId}"]' data-js-event="click" ${isLocked ? 'disabled' : ''}>Lưu Trạng Thái Mới</button>
      ${isLocked
        ? '<p style="margin-top: 8px; font-size: 13px; color: var(--text-muted);"><i class="fa-solid fa-lock"></i> Đơn đã kết thúc, không thể đổi tình trạng.</p>'
        : ''}
    </div>
  `;
  openModal("modal-admin-order-detail");
}

function saveOrderStatus(orderId) {
  const newStatus = document.getElementById("update-order-status-select").value;
  let orders = getOrders();
  const o = orders.find(item => item.orderId === orderId);
  if (!o) return;

  // Chốt chặn thứ 2 (phòng khi nút bị bật lại bằng console/DevTools):
  // đơn đã giao hoặc đã huỷ là trạng thái cuối, không cho sửa nữa.
  if (o.status === 'Đã giao' || o.status === 'Hủy') {
    alert(`Đơn hàng ${orderId} đã kết thúc (${o.status}), không thể đổi trạng thái.`);
    closeModal("modal-admin-order-detail");
    return;
  }

  o.status = newStatus;
  setOrders(orders);
  closeModal("modal-admin-order-detail");
  renderAdminOrders();
  alert(`Đơn hàng ${orderId} đã được cập nhật sang trạng thái: "${newStatus}"!`);
}

/* 6.7 Admin: Quản lý tồn kho & Báo cáo Nhập - Xuất - Tồn */
function loadInventoryFilterCats() {
  const select = document.getElementById("inv-filter-cat");
  select.innerHTML = `<option value="all">-- Tất cả loại linh kiện --</option>`;
  getCategories().forEach(c => select.innerHTML += `<option value="${c.id}">${c.name}</option>`);

  const nxtSelect = document.getElementById("nxt-product");
  if (nxtSelect) {
    nxtSelect.innerHTML = "";
    getProducts().forEach(p => nxtSelect.innerHTML += `<option value="${p.id}">${p.code} - ${p.name}</option>`);
  }
}

function getInventoryNumbers(prodId, fromDate, toDate) {
  const imports = getImports().filter(imp => imp.status === 'completed');
  const orders = getOrders().filter(o => o.status === 'Đã xử lý' || o.status === 'Đã giao');
  const inRange = date => (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
  const beforeRange = date => Boolean(fromDate) && date < fromDate;

  let opening = 0;
  let periodImport = 0;
  let periodExport = 0;

  imports.forEach(imp => {
    imp.items.forEach(it => {
      if (it.productId !== prodId) return;
      if (beforeRange(imp.date)) opening += it.quantity;
      if (inRange(imp.date)) periodImport += it.quantity;
    });
  });

  orders.forEach(order => {
    order.items.forEach(it => {
      if (it.id !== prodId) return;
      if (beforeRange(order.date)) opening -= it.quantity;
      if (inRange(order.date)) periodExport += it.quantity;
    });
  });

  return {
    opening,
    periodImport,
    periodExport,
    closing: opening + periodImport - periodExport
  };
}

function renderInventoryReport() {
  const catFilter = document.getElementById("inv-filter-cat").value;
  const fromDate = document.getElementById("inv-date-from").value;
  const toDate = document.getElementById("inv-date-to").value;
  const thresholdInput = document.getElementById("inv-low-threshold");
  const threshold = Number(thresholdInput && thresholdInput.value !== "" ? thresholdInput.value : 5);

  let prods = getProducts();
  if (catFilter !== 'all') prods = prods.filter(p => p.categoryId === catFilter);

  const cats = getCategories();
  const tbody = document.getElementById("inventory-table-body");
  tbody.innerHTML = "";

  prods.forEach(p => {
    const cat = cats.find(c => c.id === p.categoryId);
    const numbers = getInventoryNumbers(p.id, fromDate, toDate);
    const isLowStock = numbers.closing <= threshold;

    tbody.innerHTML += `
      <tr>
        <td><code>${p.code}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${cat ? cat.name : 'Chưa phân loại'}</td>
        <td><span class="badge badge-info">${numbers.opening}</span></td>
        <td><span class="badge badge-info">${numbers.periodImport}</span></td>
        <td><span class="badge badge-warning">${numbers.periodExport}</span></td>
        <td><strong style="font-size: 15px;">${numbers.closing}</strong></td>
        <td>
          ${isLowStock
            ? '<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Sắp hết hàng!</span>'
            : '<span class="badge badge-success">Đủ hàng</span>'}
        </td>
      </tr>
    `;
  });
}

function renderNxtReport() {
  const select = document.getElementById("nxt-product");
  const tbody = document.getElementById("nxt-table-body");
  if (!select || !tbody) return;

  const prod = getProducts().find(p => p.id === select.value);
  if (!prod) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">Chưa có sản phẩm để thống kê.</td></tr>`;
    return;
  }

  const fromDate = document.getElementById("nxt-date-from").value;
  const toDate = document.getElementById("nxt-date-to").value;

  // Chặn khoảng thời gian ngược: nếu "từ ngày" > "đến ngày" thì tồn đầu kỳ
  // sẽ bị tính bằng toàn bộ lịch sử và nhập/xuất trong kỳ bằng 0 (số liệu vô nghĩa).
  if (fromDate && toDate && fromDate > toDate) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--danger-color);"><i class="fa-solid fa-triangle-exclamation"></i> Khoảng thời gian không hợp lệ: "Từ ngày" phải nhỏ hơn hoặc bằng "Đến ngày".</td></tr>`;
    return;
  }

  const numbers = getInventoryNumbers(prod.id, fromDate, toDate);

  tbody.innerHTML = `
    <tr>
      <td><strong>${prod.name}</strong><br><small style="color: var(--text-muted);">${prod.code}</small></td>
      <td>${numbers.opening}</td>
      <td>${numbers.periodImport}</td>
      <td>${numbers.periodExport}</td>
      <td><strong>${numbers.closing}</strong></td>
    </tr>
  `;
}

function removeDraftImportItem(index) {
  currentDraftImportItems.splice(Number(index), 1);
  renderDraftImportItemsTable();
}
