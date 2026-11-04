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


