/* ========================================================
       1. DATABASE DỮ LIỆU MẪU KHỞI TẠO (MOCK DATABASE LOCALSTORAGE)
       ======================================================== */
    const DEFAULT_CATEGORIES = [
      { id: "cat-1", code: "ban-phim", name: "Bàn Phím", isHidden: false },
      { id: "cat-2", code: "chuot", name: "Chuột Máy Tính", isHidden: false },
      { id: "cat-3", code: "tai-nghe", name: "Tai Nghe", isHidden: false },
      { id: "cat-4", code: "phu-kien", name: "Phụ Kiện Khác", isHidden: false }
    ];

    const DEFAULT_PRODUCTS = [
      {
        id: "prod-1",
        code: "KB-AKKO3084",
        categoryId: "cat-1",
        name: "Bàn phím cơ Akko 3084 Silent",
        costPrice: 850000,
        profitRate: 35,
        price: 1150000,
        image: "static/images/Bàn phím Akko 3084.jpg",
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
        price: 550000,
        image: "static/images/Bàn phím Dareu EK87.png",
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
        image: "static/images/Bàn phím Keychron K2.webp",
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
        price: 420000,
        image: "static/images/Chuột Logitech G102.jpg",
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
        image: "static/images/Chuột Logitech G304 Wireless.jpg",
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
        image: "static/images/Chuột Razer DeathAdder.jpg",
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
        image: "static/images/Tai nghe Dareu EH722.jpg",
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
        price: 120000,
        image: "static/images/USB Kingston 32GB.jpg",
        description: "Chuẩn USB 3.2 Gen 1 tốc độ cao, thiết kế nắp xoay kim loại bền đẹp.",
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

    // Khởi tạo Storage nếu chưa có
    function initDataStorage() {
      if (!localStorage.getItem("app_categories")) {
        localStorage.setItem("app_categories", JSON.stringify(DEFAULT_CATEGORIES));
      }
      if (!localStorage.getItem("app_products")) {
        localStorage.setItem("app_products", JSON.stringify(DEFAULT_PRODUCTS));
      }
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
          totalAmount: 22390000
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

    /* ========================================================
       3. PHÂN HỆ KHÁCH HÀNG: HIỂN THỊ, TÌM KIẾM & PHÂN TRANG
       ======================================================== */
    let currentPage = 1;
    const itemsPerPage = 4; // Để test phân trang dễ dàng
    let filteredProductList = [];

    function loadFilterCategories() {
      const cats = getCategories().filter(c => !c.isHidden);
      const filterSelect = document.getElementById("filter-category");
      filterSelect.innerHTML = `<option value="">-- Tất cả phân loại --</option>`;
      cats.forEach(c => {
        filterSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      });
    }

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
      applyAdvancedFilter();
    }

    function applyAdvancedFilter() {
      const keyword = document.getElementById("filter-keyword").value.toLowerCase().trim();
      const catId = document.getElementById("filter-category").value;
      const priceRange = document.getElementById("filter-price-range").value;

      const prods = getProducts().filter(p => !p.isHidden);

      filteredProductList = prods.filter(p => {
        const matchName = p.name.toLowerCase().includes(keyword);
        const matchCat = catId ? p.categoryId === catId : true;
        let matchPrice = true;
        if (priceRange === 'under-500') matchPrice = p.price < 500000;
        else if (priceRange === '500-1500') matchPrice = p.price >= 500000 && p.price <= 1500000;
        else if (priceRange === 'over-1500') matchPrice = p.price > 1500000;

        return matchName && matchCat && matchPrice;
      });

      currentPage = 1;
      renderProducts();
    }

    function resetFilter() {
      document.getElementById("filter-keyword").value = "";
      document.getElementById("filter-category").value = "";
      document.getElementById("filter-price-range").value = "all";
      document.getElementById("top-search-input").value = "";
      filteredProductList = getProducts().filter(p => !p.isHidden);
      currentPage = 1;
      renderProducts();
    }

    function renderProducts() {
      if (!filteredProductList || filteredProductList.length === 0) {
        filteredProductList = getProducts().filter(p => !p.isHidden);
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
                <img src="${prod.image}" alt="${prod.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/200x150?text=Linh+Kien';">
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

      const detailContainer = document.getElementById("detail-container");
      detailContainer.innerHTML = `
        <div style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 6px;">
          <img src="${prod.image}" alt="${prod.name}" style="max-width: 100%; max-height: 350px; object-fit: contain;" onerror="this.onerror=null;this.src='https://via.placeholder.com/350x250?text=Linh+Kien';">
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
       4. PHÂN HỆ KHÁCH HÀNG: GIỎ HÀNG & ĐẶT HÀNG (CHECKOUT)
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

    function renderCart() {
      const cart = getCart();
      const tbody = document.getElementById("cart-table-body");
      tbody.innerHTML = "";

      let total = 0;
      if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 30px; color: var(--text-muted);">Giỏ hàng của bạn đang trống.</td></tr>`;
      } else {
        cart.forEach((item, index) => {
          const subtotal = item.price * item.quantity;
          total += subtotal;
          tbody.innerHTML += `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${item.image}" width="45" height="45" style="object-fit: contain; background: #eee; border-radius: 4px;" onerror="this.onerror=null;this.src='https://via.placeholder.com/45';">
                  <strong>${item.name}</strong>
                </div>
              </td>
              <td>${formatVND(item.price)}</td>
              <td>
                <button class="btn btn-secondary btn-sm" data-js-action="modifyCartQty" data-js-args="[${index},-1]" data-js-event="click">-</button>
                <span style="display: inline-block; width: 30px; text-align: center;">${item.quantity}</span>
                <button class="btn btn-secondary btn-sm" data-js-action="modifyCartQty" data-js-args="[${index},1]" data-js-event="click">+</button>
              </td>
              <td><strong>${formatVND(subtotal)}</strong></td>
              <td>
                <button class="btn btn-danger btn-sm" data-js-action="removeFromCart" data-js-args="[${index}]" data-js-event="click"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `;
        });
      }
      document.getElementById("cart-total-price").innerText = formatVND(total);
    }

    function modifyCartQty(index, change) {
      let cart = getCart();
      if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
        setCart(cart);
        renderCart();
      }
    }

    function removeFromCart(index) {
      let cart = getCart();
      cart.splice(index, 1);
      setCart(cart);
      renderCart();
    }

    function navigateToCheckout() {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
      }
      const user = getCurrentUser();
      if (!user) {
        alert("Vui lòng đăng nhập!");
        navigateTo('view-auth');
        return;
      }

      // Điền sẵn thông tin từ tài khoản
      document.getElementById("checkout-name").value = user.fullName || "";
      document.getElementById("checkout-phone").value = user.phone || "";
      document.getElementById("checkout-address").value = user.address || "";

      // Render tóm tắt
      let total = 0;
      const summaryDiv = document.getElementById("checkout-items-summary");
      summaryDiv.innerHTML = "";
      cart.forEach(item => {
        const sub = item.price * item.quantity;
        total += sub;
        summaryDiv.innerHTML += `
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span>${item.name} x <strong>${item.quantity}</strong></span>
            <span>${formatVND(sub)}</span>
          </div>
        `;
      });
      document.getElementById("checkout-total-val").innerText = formatVND(total);

      navigateTo('view-checkout');
    }

    function toggleAddressInput(source) {
      const user = getCurrentUser();
      const addrInput = document.getElementById("checkout-address");
      if (source === 'profile') {
        addrInput.value = user.address || "";
        addrInput.readOnly = true;
      } else {
        addrInput.value = "";
        addrInput.readOnly = false;
        addrInput.placeholder = "Nhập số nhà, tên đường, phường/xã, quận/huyện...";
        addrInput.focus();
      }
    }

    function submitOrder() {
      const user = getCurrentUser();
      const name = document.getElementById("checkout-name").value.trim();
      const phone = document.getElementById("checkout-phone").value.trim();
      const address = document.getElementById("checkout-address").value.trim();
      const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

      if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ nhận hàng!");
        return;
      }

      const cart = getCart();
      let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const newOrder = {
        orderId: "DH-" + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split("T")[0],
        username: user.username,
        recipientName: name,
        phone: phone,
        address: address,
        paymentMethod: paymentMethod,
        status: "Mới đặt",
        items: [...cart],
        total: total
      };

      const orders = getOrders();
      orders.unshift(newOrder);
      setOrders(orders);

      // Xóa giỏ hàng
      setCart([]);

      // Hiển thị hóa đơn xem lại đơn hàng vừa đặt (Yêu cầu đề bài)
      renderInvoice(newOrder);
      navigateTo('view-order-success');
    }

    function renderInvoice(order) {
      const div = document.getElementById("invoice-details");
      let itemsHtml = order.items.map(it => `
        <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;">
          <span>${it.name} (x${it.quantity})</span>
          <span>${formatVND(it.price * it.quantity)}</span>
        </div>
      `).join('');

      let paymentText = "Thanh toán khi nhận hàng (COD)";
      if (order.paymentMethod === 'BANK') paymentText = "Chuyển khoản ngân hàng";
      else if (order.paymentMethod === 'ONLINE') paymentText = "Thanh toán trực tuyến MoMo/VNPAY";

      div.innerHTML = `
        <p><strong>Mã đơn hàng:</strong> ${order.orderId}</p>
        <p><strong>Ngày đặt hàng:</strong> ${order.date}</p>
        <p><strong>Khách hàng:</strong> ${order.recipientName} - ${order.phone}</p>
        <p><strong>Địa chỉ nhận hàng:</strong> ${order.address}</p>
        <p><strong>Hình thức thanh toán:</strong> ${paymentText}</p>
        <hr style="border:0; border-top: 1px dashed var(--gray-border); margin: 10px 0;">
        <h5 style="margin-bottom: 6px;">Danh sách sản phẩm:</h5>
        ${itemsHtml}
        <hr style="border:0; border-top: 1px solid var(--gray-border); margin: 10px 0;">
        <h4 style="color: var(--danger-color); text-align: right;">Tổng thanh toán: ${formatVND(order.total)}</h4>
      `;
    }

    function renderOrderHistory() {
      const user = getCurrentUser();
      if (!user) return;

      const orders = getOrders().filter(o => o.username === user.username);
      const tbody = document.getElementById("order-history-tbody");
      tbody.innerHTML = "";

      if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">Bạn chưa có đơn đặt hàng nào.</td></tr>`;
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
            <td>${o.recipientName}</td>
            <td><strong>${formatVND(o.total)}</strong></td>
            <td>${o.paymentMethod}</td>
            <td><span class="badge ${statusBadge}">${o.status}</span></td>
            <td>
              <button class="btn btn-outline-primary btn-sm" data-js-action="viewClientOrderDetailById" data-js-args='["${o.orderId}"]' data-js-event="click">Xem</button>
            </td>
          </tr>
        `;
      });
    }

    function viewClientOrderDetail(order) {
      renderInvoice(order);
      navigateTo('view-order-success');
    }

    /* ========================================================
       5. PHÂN HỆ KHÁCH HÀNG: ĐĂNG NHẬP, ĐĂNG KÝ, PROFILE
       ======================================================== */
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

    function switchAuthTab(tab) {
      const loginBtn = document.getElementById("tab-btn-login");
      const regBtn = document.getElementById("tab-btn-register");
      const loginBlock = document.getElementById("form-login-block");
      const regBlock = document.getElementById("form-register-block");

      if (tab === 'login') {
        loginBtn.classList.add("active");
        regBtn.classList.remove("active");
        loginBlock.style.display = "block";
        regBlock.style.display = "none";
      } else {
        regBtn.classList.add("active");
        loginBtn.classList.remove("active");
        regBlock.style.display = "block";
        loginBlock.style.display = "none";
      }
    }

    function executeClientLogin() {
      const u = document.getElementById("auth-login-user").value.trim();
      const p = document.getElementById("auth-login-pass").value.trim();

      const users = getUsers();
      const found = users.find(x => x.username === u && x.password === p);

      if (!found) {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
        return;
      }
      if (found.isLocked) {
        alert("Tài khoản của bạn đã bị KHÓA bởi ban quản trị!");
        return;
      }

      setCurrentUser(found);
      alert("Đăng nhập thành công!");
      navigateTo('view-home');
    }

    function executeClientRegister() {
      const u = document.getElementById("auth-reg-user").value.trim();
      const p = document.getElementById("auth-reg-pass").value.trim();
      const name = document.getElementById("auth-reg-name").value.trim();
      const phone = document.getElementById("auth-reg-phone").value.trim();
      const address = document.getElementById("auth-reg-address").value.trim();

      if (!u || !p || !name) {
        alert("Vui lòng điền tài khoản, mật khẩu và họ tên!");
        return;
      }

      const users = getUsers();
      if (users.some(x => x.username === u)) {
        alert("Tên tài khoản này đã được sử dụng!");
        return;
      }

      const newUser = {
        username: u,
        password: p,
        fullName: name,
        phone: phone,
        address: address,
        isLocked: false
      };
      users.push(newUser);
      setUsers(users);

      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      switchAuthTab('login');
      document.getElementById("auth-login-user").value = u;
    }

    function clientLogout() {
      setCurrentUser(null);
      alert("Đã đăng xuất tài khoản.");
      navigateTo('view-home');
    }

    function loadProfile() {
      const user = getCurrentUser();
      if (!user) return;
      document.getElementById("prof-username").value = user.username;
      document.getElementById("prof-fullname").value = user.fullName || "";
      document.getElementById("prof-phone").value = user.phone || "";
      document.getElementById("prof-address").value = user.address || "";
    }

    function saveProfileChanges() {
      const user = getCurrentUser();
      if (!user) return;

      user.fullName = document.getElementById("prof-fullname").value.trim();
      user.phone = document.getElementById("prof-phone").value.trim();
      user.address = document.getElementById("prof-address").value.trim();

      let users = getUsers();
      const idx = users.findIndex(u => u.username === user.username);
      if (idx !== -1) {
        users[idx] = user;
        setUsers(users);
      }
      setCurrentUser(user);
      alert("Cập nhật thông tin cá nhân thành công!");
    }


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
      if (confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
        let cats = getCategories().filter(c => c.id !== id);
        setCategories(cats);
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
            <td><img src="${p.image}" width="40" height="40" style="object-fit: contain; background: #eee; border-radius: 4px;" onerror="this.onerror=null;this.src='https://via.placeholder.com/40';"></td>
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
      const img = document.getElementById("prod-img-input").value.trim() || 'static/images/default.jpg';
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
    }

    function renderInventoryReport() {
      const catFilter = document.getElementById("inv-filter-cat").value;
      const fromDate = document.getElementById("inv-date-from").value;
      const toDate = document.getElementById("inv-date-to").value;

      let prods = getProducts();
      if (catFilter !== 'all') prods = prods.filter(p => p.categoryId === catFilter);

      let imports = getImports().filter(imp => imp.status === 'completed');
      let orders = getOrders().filter(o => o.status !== 'Hủy');

      if (fromDate) {
        imports = imports.filter(i => i.date >= fromDate);
        orders = orders.filter(o => o.date >= fromDate);
      }
      if (toDate) {
        imports = imports.filter(i => i.date <= toDate);
        orders = orders.filter(o => o.date <= toDate);
      }

      const cats = getCategories();
      const tbody = document.getElementById("inventory-table-body");
      tbody.innerHTML = "";

      prods.forEach(p => {
        const cat = cats.find(c => c.id === p.categoryId);

        // Tính tổng nhập
        let totalImport = 0;
        imports.forEach(imp => {
          imp.items.forEach(it => {
            if (it.productId === p.id) totalImport += it.quantity;
          });
        });

        // Tính tổng xuất
        let totalExport = 0;
        orders.forEach(ord => {
          ord.items.forEach(it => {
            if (it.id === p.id) totalExport += it.quantity;
          });
        });

        const currentStock = totalImport - totalExport;
        // YÊU CẦU: Cảnh báo sắp hết hàng (khi tồn kho < 5 cái)
        const isLowStock = currentStock <= 3;

        tbody.innerHTML += `
          <tr>
            <td><code>${p.code}</code></td>
            <td><strong>${p.name}</strong></td>
            <td>${cat ? cat.name : 'N/A'}</td>
            <td><span class="badge badge-info">${totalImport}</span></td>
            <td><span class="badge badge-warning">${totalExport}</span></td>
            <td><strong style="font-size: 15px;">${currentStock}</strong></td>
            <td>
              ${isLowStock 
                ? '<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Sắp hết hàng!</span>' 
                : '<span class="badge badge-success">Đủ hàng</span>'}
            </td>
          </tr>
        `;
      });
    }

    /* ========================================================
       7. MODAL UTILITIES & APP START
       ======================================================== */
    function openModal(id) { document.getElementById(id).classList.add("active"); }
    function closeModal(id) { document.getElementById(id).classList.remove("active"); }

    window.onload = function() {
      initDataStorage();
      renderAuthNav();
      updateCartBadge();

      // Mở đúng view theo URL hash, hoặc view đầu tiên của từng trang.
      const requestedView = window.location.hash.slice(1);
      const firstView = document.querySelector('.view-section.active') || document.querySelector('.view-section');
      const initialView = document.getElementById(requestedView) ? requestedView : (firstView ? firstView.id : null);
      if (initialView) navigateTo(initialView);

      // Chỉ khởi tạo thành phần có trên trang hiện tại.
      if (document.getElementById('filter-category')) loadFilterCategories();
      if (document.getElementById('product-container')) {
        renderProducts();
        const pendingSearch = sessionStorage.getItem("techstore_pending_search");
        if (pendingSearch !== null) {
          sessionStorage.removeItem("techstore_pending_search");
          const keywordInput = document.getElementById("filter-keyword");
          if (keywordInput) keywordInput.value = pendingSearch;
          applyAdvancedFilter();
        }
      }
      if (document.getElementById('view-cart')?.classList.contains('active')) renderCart();
      if (document.getElementById('view-order-history')?.classList.contains('active')) renderOrderHistory();
      if (document.getElementById('view-profile')?.classList.contains('active')) loadProfile();

      // Gắn listener cho các nút được tạo trong quá trình render ban đầu.
      bindDataActionsIn(document);
    };


/* ========================================================
   12. EVENT LISTENERS - GẮN SỰ KIỆN TRỰC TIẾP TỪNG PHẦN TỬ
   Các nút/điều khiển dùng data-js-action, data-js-args, data-js-event.
   Mỗi phần tử tự có addEventListener; không dùng event delegation.
   ======================================================== */
function viewClientOrderDetailById(orderId) {
  const order = getOrders().find(item => item.orderId === orderId);
  if (!order) {
    alert("Không tìm thấy thông tin đơn hàng.");
    return;
  }
  viewClientOrderDetail(order);
}

function removeDraftImportItem(index) {
  currentDraftImportItems.splice(Number(index), 1);
  renderDraftImportItemsTable();
}

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
