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
        price: 550000,
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
        price: 420000,
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
        price: 120000,
        image: "static/images/usb-kingston.jpg",
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
    function getVisibleProducts() {
      const hiddenCategoryIds = getCategories().filter(c => c.isHidden).map(c => c.id);
      return getProducts().filter(p => !p.isHidden && !hiddenCategoryIds.includes(p.categoryId));
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

