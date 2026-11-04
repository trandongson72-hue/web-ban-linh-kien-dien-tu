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

