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
      const tbody = document.getElementById("admin-category-table-body");
      tbody.innerHTML = "";

      cats.forEach(c => {
        tbody.innerHTML += `
          <tr>
            <td><code>${c.code}</code></td>
            <td><strong>${c.name}</strong></td>
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
      if (cat) {
        cat.isHidden = !cat.isHidden;
        setCategories(cats);
        renderAdminCategories();
      }
    }

    function deleteCategory(id) {
      const cats = getCategories();
      const cat = cats.find(c => c.id === id);
      if (!cat) return;

      // Chặn xóa khi vẫn còn sản phẩm thuộc loại này (kể cả sản phẩm đang ẩn)
      const productCount = getProducts().filter(p => p.categoryId === id).length;
      if (productCount > 0) {
        alert(`Không thể xóa loại "${cat.name}" vì đang có ${productCount} sản phẩm thuộc loại này.\nHãy chuyển sản phẩm sang loại khác hoặc xóa sản phẩm trước.`);
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xóa loại "${cat.name}"?`)) {
        setCategories(cats.filter(c => c.id !== id));
        renderAdminCategories();
      }
    }

    /* 6.3 Admin: Quản lý danh mục sản phẩm */
    function renderAdminProducts() {
      const prods = getProducts();
      const cats = getCategories();
      const tbody = document.getElementById("admin-product-table-body");
      tbody.innerHTML = "";

      prods.forEach(p => {
        const cat = cats.find(c => c.id === p.categoryId);
        tbody.innerHTML += `
          <tr>
            <td><img src="${p.image}" width="40" height="40" style="object-fit: contain; background: #eee; border-radius: 4px;" onerror="this.onerror=null;this.src='static/images/default-product.svg';"></td>
            <td><code>${p.code}</code></td>
            <td><strong>${p.name}</strong></td>
            <td>${cat ? cat.name : 'N/A'}</td>
            <td>${formatVND(p.price)}</td>
            <td>${p.isHidden ? '<span class="badge badge-danger">Đã Ẩn</span>' : '<span class="badge badge-success">Hiển Thị</span>'}</td>
            <td>
              <button class="btn btn-secondary btn-sm" data-js-action="openProductModal" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa</button>
              <button class="btn btn-outline-primary btn-sm" data-js-action="toggleHideProduct" data-js-args='["${p.id}"]' data-js-event="click">${p.isHidden ? 'Hiện' : 'Ẩn'}</button>
              <button class="btn btn-danger btn-sm" data-js-action="deleteProduct" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-trash"></i></button>
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

      let prods = getProducts();
      if (id) {
        const p = prods.find(item => item.id === id);
        if (p) {
          p.code = code;
          p.categoryId = catId;
          p.name = name;
          p.price = price;
          p.image = img;
          p.description = desc;
        }
      } else {
        prods.push({
          id: "prod-" + Date.now(),
          code, categoryId: catId, name,
          costPrice: Math.round(price * 0.7),
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
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        let prods = getProducts().filter(item => item.id !== id);
        setProducts(prods);
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
            p.price = Math.round(p.costPrice * (1 + (p.profitRate || 30) / 100));
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
        tbody.innerHTML += `
          <tr>
            <td><code>${p.code}</code></td>
            <td><strong>${p.name}</strong></td>
            <td>${cat ? cat.name : 'N/A'}</td>
            <td>${formatVND(p.costPrice || 0)}</td>
            <td><strong style="color: var(--primary-color);">${p.profitRate || 30}%</strong></td>
            <td><strong style="color: var(--danger-color);">${formatVND(p.price)}</strong></td>
            <td>
              <button class="btn btn-primary btn-sm" data-js-action="openProfitModal" data-js-args='["${p.id}"]' data-js-event="click"><i class="fa-solid fa-pen"></i> Sửa % Lợi Nhuận</button>
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
      document.getElementById("profit-rate-input").value = p.profitRate || 30;
      openModal("modal-profit");
    }

    function saveProfitRate() {
      const id = document.getElementById("profit-prod-id").value;
      const rate = parseFloat(document.getElementById("profit-rate-input").value) || 0;

      let prods = getProducts();
      const p = prods.find(item => item.id === id);
      if (p) {
        p.profitRate = rate;
        // Tự động tính lại giá bán = giá vốn * (1 + rate / 100)
        p.price = Math.round((p.costPrice || 0) * (1 + rate / 100));
        setProducts(prods);
      }
      closeModal("modal-profit");
      renderAdminPricing();
      alert("Đã cập nhật tỉ lệ lợi nhuận và đồng bộ giá bán thành công!");
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
          <select id="update-order-status-select" class="form-select" style="margin-top: 6px;">
            <option value="Mới đặt" ${order.status === 'Mới đặt' ? 'selected' : ''}>Mới đặt</option>
            <option value="Đã xử lý" ${order.status === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
            <option value="Đã giao" ${order.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
            <option value="Hủy" ${order.status === 'Hủy' ? 'selected' : ''}>Hủy</option>
          </select>
          <button class="btn btn-primary" style="margin-top: 10px;" data-js-action="saveOrderStatus" data-js-args='["${order.orderId}"]' data-js-event="click">Lưu Trạng Thái Mới</button>
        </div>
      `;
      openModal("modal-admin-order-detail");
    }

    function saveOrderStatus(orderId) {
      const newStatus = document.getElementById("update-order-status-select").value;
      let orders = getOrders();
      const o = orders.find(item => item.orderId === orderId);
      if (o) {
        o.status = newStatus;
        setOrders(orders);
        closeModal("modal-admin-order-detail");
        renderAdminOrders();
        alert(`Đơn hàng ${orderId} đã được cập nhật sang trạng thái: "${newStatus}"!`);
      }
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
            <td>${cat ? cat.name : 'N/A'}</td>
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

