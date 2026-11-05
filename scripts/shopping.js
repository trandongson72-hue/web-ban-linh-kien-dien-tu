/* ========================================================
   GIỎ HÀNG & ĐẶT HÀNG (shopping.html)
   Xem giỏ, đổi số lượng, thanh toán, hóa đơn và lịch sử đơn.
   ======================================================== */

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
              <img src="${item.image}" width="45" height="45" style="object-fit: contain; background: #eee; border-radius: 4px;" onerror="this.onerror=null;this.src='static/images/default-product.svg';">
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

function viewClientOrderDetailById(orderId) {
  const order = getOrders().find(item => item.orderId === orderId);
  if (!order) {
    alert("Không tìm thấy thông tin đơn hàng.");
    return;
  }
  viewClientOrderDetail(order);
}

/* ========================================================
   KHỞI TẠO RIÊNG TRANG GIỎ HÀNG
   ======================================================== */

window.addEventListener("load", () => {
  if (document.getElementById('view-cart')?.classList.contains('active')) renderCart();
  if (document.getElementById('view-order-history')?.classList.contains('active')) renderOrderHistory();
});
