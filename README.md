# TechStore — Website bán linh kiện điện tử

Đồ án môn Lập trình web. Toàn bộ là HTML/CSS/JavaScript thuần, **không cần build, không cần backend** — dữ liệu lưu trong `localStorage` của trình duyệt.

## Cách chạy

1. Mở `index.html` trực tiếp bằng Chrome/Firefox, hoặc
2. Dùng Live Server (VS Code) trỏ vào thư mục gốc.

Tài khoản admin mặc định: **admin / 123** (đăng nhập ở trang chủ → menu tài khoản → Quản trị).

## Cấu trúc hiện tại

```
.
├── index.html                Trang chủ: danh sách + lọc sản phẩm
├── shopping.html             Giỏ hàng, thanh toán, lịch sử đơn
├── account.html              Hồ sơ khách hàng
├── admin.html                Khu quản trị (7 tab, SPA trong 1 trang)
├── scripts/
│   └── app.js                Toàn bộ logic dùng chung
├── styles/
│   ├── common.css            Biến màu, layout, nút, form, bảng, modal
│   ├── index.css             CSS riêng trang chủ
│   ├── shopping.css          CSS riêng giỏ hàng
│   ├── account.css           CSS riêng tài khoản
│   └── admin.css             CSS riêng trang quản trị
└── static/images/            Ảnh sản phẩm + default-product.svg
```

---

# Nhật ký thay đổi

## 1. Mốc so sánh (baseline)

Mọi số liệu dưới đây được tính so với **main branch**:


Cách kiểm chứng: mọi file **không** nằm trong bảng dưới đây có MD5 trùng khớp tuyệt đối với bản gốc (danh sách MD5 ở mục 9).

## 2. Tổng hợp

| File | Hành động | Trước | Sau |
|---|---|---:|---:|
| `admin.css` (thư mục gốc) | **Xoá** | 4.884 B | — |
| `admin-import-pricing.html` | **Xoá** | 13.896 B | — |
| `admin.js` | **Xoá** | 6.653 B | — |
| `web hoan chinh.html` | **Xoá** | 109.411 B | — |
| `styles/admin.css` | Dọn dẹp | 5.666 B / 315 dòng | 3.039 B / 173 dòng |
| `scripts/app.js` | Sửa 2 lỗi | 70.587 B / 1.724 dòng | 72.259 B / 1.749 dòng |
| `README.md` | Viết lại | 27 B | file này |

**Tổng kết: xoá 134.844 B file chết, CSS gọn đi 2.627 B, JS thêm 1.672 B → giảm ròng 135.799 B (~132,6 KB).**

---

## 3. Xoá `admin.css` (thư mục gốc)

**Lý do:** file CSS chết — không được nạp ở bất kỳ trang nào và nhắm vào bộ class không còn tồn tại.

**Bằng chứng:**

- `grep 'admin.css'` trong toàn bộ `.html`/`.js`: chỉ có `admin.html` và `admin-import-pricing.html`, cả hai đều trỏ `styles/admin.css`.
- File này style `.khung`, `.menu`, `.hop`, `.tab`, `.loc`, `.canh`, `.ok` → **0 file HTML** trong project dùng những class này.

**Ảnh hưởng:** không ảnh hưởng gì cả. Đây là bộ CSS của một trang admin cũ đã bị thay thế.

## 4. Xoá `admin-import-pricing.html`

**Lý do:** trang trùng lặp và mồ côi.

- Chỉ chứa 2 tab `import` + `pricing`, là **tập con 1:1** của `admin.html` (đã đối chiếu: 15 id trùng khớp, cột bảng giống hệt, `modal-import` giống tuyệt đối, `modal-profit` cùng id/handler, dùng chung `scripts/app.js`).
- **0 link** trỏ tới file này trong toàn project (grep `import-pricing` → không có kết quả).
- Còn là **lỗ hổng**: `admin.html` yêu cầu đăng nhập (`app.js` → `isAdminLoggedIn()`), còn trang này mở URL là vào thẳng, **không kiểm tra quyền**.

**Ảnh hưởng:** không mất chức năng. Tab Nhập hàng và Giá bán vẫn dùng được trong `admin.html`, và giờ đi qua bước đăng nhập.

## 5. Xoá `admin.js`

**Lý do:** file JS chết, không thể chạy trong project hiện tại.

- Không được nạp ở HTML nào.
- Cần 19 id (`d-tu`, `d-den`, `d-tt`, `k-ngay`, `k-loai`, `k-nguong`, `n-sp`, `n-tu`, `n-den`, `modal`, `m-tt`…) — **không id nào tồn tại** trong các HTML còn lại.
- Dùng class `.tab`, `.menu button`, `.modal.mo`, `.canh` — đúng bộ class của `admin.css` vừa xoá ở mục 3.
- 12 hàm, **0 hàm trùng tên** với `app.js`; dữ liệu hard-code (8 sản phẩm, 8 đơn mẫu), khác hoàn toàn model dữ liệu thật.

**Ảnh hưởng:** không. Chức năng tương ứng đã có trong `app.js` (xem mục 7.1–7.2 để biết 2 điểm hay của file này đã được chuyển sang).

## 6. `styles/admin.css` — dọn dẹp

| Chỉ số | Trước | Sau |
|---|---:|---:|
| Dung lượng | 5.666 B | 3.039 B (−46%) |
| Số dòng | 315 | 173 |
| Khối rule | 43 | 28 |
| Dòng khai báo | 157 | 84 |

**Đã xoá 15 khối rule (thuộc 12 nhóm selector)** — toàn bộ là style trang bán hàng bị copy nhầm sang, không trang admin nào dùng:

```
.filter-panel        .product-grid        .product-card        .product-card:hover
.product-thumb       .product-thumb img   .product-body        .product-category
.product-title       .product-title:hover .product-price       .product-actions
.pagination-bar      .page-btn            .page-btn.active     .cart-summary
```

**Đã xoá 11 comment mục rỗng** (không có rule nào bên dưới): Header & Navigation, Container layout, Views, Search & Filter section, Product Grid, Pagination, Modal / Popups, Tables, Badges, Cart layout, Footer.

**Giữ nguyên:** `.admin-wrapper`, `.admin-sidebar`, `.admin-menu`, `.admin-menu li a(:hover/.active)`, `.admin-content` và cả 33 class `.admin-style-*`.

**Kiểm chứng:** đối chiếu toàn bộ class trong 2 trang admin với `common.css` + `admin.css` → không thiếu class nào, **trừ `.admin-sub-section`**. Class này chỉ là móc JS (`app.js:897` dùng `querySelectorAll` để ẩn/hiện tab), không cần CSS; trạng thái ẩn do `.u-style-0463bfe3` trong `common.css` đảm nhiệm. Thêm rule cho nó sẽ làm hỏng tab mặc định.

## 7. `scripts/app.js` — sửa 2 lỗi nghiệp vụ

### 7.1. Khoá trạng thái đơn đã kết thúc

**Vấn đề:** báo cáo tồn kho chỉ trừ kho với đơn `Đã xử lý` và `Đã giao` (`getInventoryNumbers`). Nhưng form chi tiết đơn cho phép đổi trạng thái tự do, nên có thể biến đơn `Đã giao` về `Mới đặt` (kho bị cộng lại sai) hoặc "hồi sinh" đơn `Hủy`.

**Sửa 1 — khoá UI trong `openAdminOrderDetail()`:**

```diff
       const content = document.getElementById("admin-order-detail-content");
+
+      // Đơn đã kết thúc (Đã giao / Hủy) thì không cho đổi trạng thái nữa.
+      // Lý do: báo cáo tồn kho chỉ trừ kho với đơn "Đã xử lý" và "Đã giao",
+      // nên sửa lại trạng thái của đơn đã giao/hủy sẽ làm số liệu tồn kho sai lệch.
+      const isLocked = order.status === 'Đã giao' || order.status === 'Hủy';
+
       let itemsHtml = order.items.map(it => `
```

```diff
-          <select id="update-order-status-select" class="form-select" style="margin-top: 6px;">
+          <select id="update-order-status-select" class="form-select" style="margin-top: 6px;" ${isLocked ? 'disabled' : ''}>
...
-          <button ... data-js-event="click">Lưu Trạng Thái Mới</button>
+          <button ... data-js-event="click" ${isLocked ? 'disabled' : ''}>Lưu Trạng Thái Mới</button>
+          ${isLocked
+            ? '<p style="margin-top: 8px; font-size: 13px; color: var(--text-muted);"><i class="fa-solid fa-lock"></i> Đơn đã kết thúc, không thể đổi tình trạng.</p>'
+            : ''}
```

**Sửa 2 — chốt chặn trong `saveOrderStatus()`** (phòng khi nút bị bật lại bằng DevTools):

```diff
       const o = orders.find(item => item.orderId === orderId);
-      if (o) {
-        o.status = newStatus;
-        setOrders(orders);
-        closeModal("modal-admin-order-detail");
-        renderAdminOrders();
-        alert(`Đơn hàng ${orderId} đã được cập nhật sang trạng thái: "${newStatus}"!`);
-      }
+      if (!o) return;
+
+      // Chốt chặn thứ 2 (phòng khi nút bị bật lại bằng console/DevTools):
+      // đơn đã giao hoặc đã huỷ là trạng thái cuối, không cho sửa nữa.
+      if (o.status === 'Đã giao' || o.status === 'Hủy') {
+        alert(`Đơn hàng ${orderId} đã kết thúc (${o.status}), không thể đổi trạng thái.`);
+        closeModal("modal-admin-order-detail");
+        return;
+      }
+
+      o.status = newStatus;
+      setOrders(orders);
+      closeModal("modal-admin-order-detail");
+      renderAdminOrders();
+      alert(`Đơn hàng ${orderId} đã được cập nhật sang trạng thái: "${newStatus}"!`);
```

### 7.2. Chặn khoảng ngày ngược ở báo cáo Nhập - Xuất - Tồn

**Vấn đề:** `renderNxtReport()` không kiểm tra `từ ngày ≤ đến ngày`. Nếu chọn ngược, `getInventoryNumbers()` coi mọi bản ghi là "trước kỳ" → tồn đầu kỳ bằng toàn bộ lịch sử, nhập/xuất trong kỳ bằng 0, ra số liệu vô nghĩa mà không cảnh báo.

**Sửa trong `renderNxtReport()`:**

```diff
       const fromDate = document.getElementById("nxt-date-from").value;
       const toDate = document.getElementById("nxt-date-to").value;
+
+      // Chặn khoảng thời gian ngược: nếu "từ ngày" > "đến ngày" thì tồn đầu kỳ
+      // sẽ bị tính bằng toàn bộ lịch sử và nhập/xuất trong kỳ bằng 0 (số liệu vô nghĩa).
+      if (fromDate && toDate && fromDate > toDate) {
+        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--danger-color);"><i class="fa-solid fa-triangle-exclamation"></i> Khoảng thời gian không hợp lệ: "Từ ngày" phải nhỏ hơn hoặc bằng "Đến ngày".</td></tr>`;
+        return;
+      }
+
       const numbers = getInventoryNumbers(prod.id, fromDate, toDate);
```

### 7.3. Kiểm thử

`node --check scripts/app.js` → hợp lệ.

Đã chạy 7 test với DOM stub (Node `vm`), tất cả **PASS**:

| # | Trường hợp | Kỳ vọng | Kết quả |
|---|---|---|---|
| T1 | Mở đơn `Đã giao` | select + nút bị `disabled`, có dòng "không thể đổi tình trạng" | PASS |
| T2 | Mở đơn `Hủy` | bị khoá | PASS |
| T3 | Mở đơn `Mới đặt` | vẫn sửa được | PASS |
| T4 | NXT: từ 30/12 → đến 01/01 | báo "Khoảng thời gian không hợp lệ", không render số | PASS |
| T5 | NXT: từ 01/01 → đến 31/12 | render bình thường | PASS |
| T6 | Gọi thẳng `saveOrderStatus` trên đơn đã giao | bị chặn, dữ liệu không đổi | PASS |
| T7 | Gọi `saveOrderStatus` trên đơn chưa kết thúc | đổi được | PASS |

Kiểm thử thủ công trên trình duyệt: `admin.html` → đăng nhập `admin/123` → tab **Đơn đặt hàng** → mở một đơn `Đã giao` → thấy form bị khoá; tab **Tồn kho** → chọn khoảng ngày ngược → bấm "Thống kê" → thấy dòng cảnh báo đỏ.

## 8. Xoá `web hoan chinh.html`

**Lý do:** bản one-file trùng lặp, cũ hơn và không được link tới.

**Bằng chứng:**

- Kích thước 109.411 B / 2.710 dòng — gộp toàn bộ HTML + 1 thẻ `<style>` + 1 thẻ `<script>` vào một tài liệu.
- Chứa 86 hàm, **tất cả đều đã có** trong `scripts/app.js`. Ngược lại `app.js` có thêm 6 hàm mà file này **thiếu**: `bindDataActionElement`, `bindDataActionsIn`, `initializeDataActionListeners`, `runDataAction`, `removeDraftImportItem`, `viewClientOrderDetailById` → chứng tỏ bản one-file là bản cũ hơn.
- Không có `href`/`src` nào trỏ tới (grep `web hoan chinh` chỉ ra kết quả trong chính README này).
- Vẫn chứa CSS admin cũ (các selector đã dọn ở mục 6) và bản `app.js` trước 2 fix ở mục 7 — sửa file tách rời **không** cập nhật nó.

**Ảnh hưởng:** không. Mọi chức năng đều nằm ở bộ file tách rời (`index.html`, `shopping.html`, `account.html`, `admin.html` + `styles/*` + `scripts/app.js`). Nếu cần lại bản one-file để nộp, có thể tạo lại từ các file này.

## 9. Các file không thay đổi

Giữ nguyên byte-for-byte so với bản gốc:

| File | Dung lượng | MD5 (12 ký tự đầu) |
|---|---:|---|
| `account.html` | 6.766 | `3BF0EE07AADD` |
| `admin.html` | 44.721 | `0B25F1657076` |
| `index.html` | 4.908 | `D597710B4122` |
| `shopping.html` | 13.221 | `8D1EA2466553` |
| `README.txt` | 382 | `63AE7D29AC93` |
| `styles/common.css` | 6.619 | `56FE823362FC` |
| `styles/index.css` | 3.882 | `4C1601FB370C` |
| `styles/shopping.css` | 5.354 | `E7AB6C822EA0` |
| `styles/account.css` | 4.254 | `5E6ABCCBF4AC` |
| `static/images/*` (10 file) | — | không đổi |

Ghi chú nhanh về vai trò từng file (nội dung không sửa):

- `admin.html` — khung 7 tab quản trị: khách hàng, loại SP, sản phẩm, nhập hàng, giá bán, đơn hàng, tồn kho + 5 modal. Chỉ là markup; logic nằm trong `app.js`.
- `scripts/app.js` — 92 hàm: dữ liệu mẫu, giỏ hàng, đặt hàng, đăng nhập, và toàn bộ render/CRUD của admin.
- `styles/common.css` — nguồn của các biến `--primary-color`, `--gray-border`, `--sidebar-width`… mà `admin.css` dùng lại.
- `styles/index.css`, `shopping.css`, `account.css` — CSS riêng từng trang, không liên quan admin.
