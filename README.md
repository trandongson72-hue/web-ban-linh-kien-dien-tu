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
│   ├── common.js             Dữ liệu mẫu, localStorage, điều hướng, giỏ hàng, modal, sự kiện
│   ├── index.js              Logic riêng trang chủ: lọc, tìm kiếm, phân trang
│   ├── shopping.js           Logic riêng giỏ hàng, thanh toán, lịch sử đơn
│   ├── account.js            Logic riêng đăng nhập, đăng ký, hồ sơ
│   └── admin.js              Logic riêng khu quản trị (7 tab)
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

- `admin.html` — khung 7 tab quản trị: khách hàng, loại SP, sản phẩm, nhập hàng, giá bán, đơn hàng, tồn kho + 5 modal. Chỉ là markup; logic nằm trong `scripts/common.js` + `scripts/admin.js`.
- `scripts/` — đã tách thành `common.js`, `index.js`, `shopping.js`, `account.js`, `admin.js` (xem mục 11).
- `styles/common.css` — nguồn của các biến `--primary-color`, `--gray-border`, `--sidebar-width`… mà `admin.css` dùng lại.
- `styles/index.css`, `shopping.css`, `account.css` — CSS riêng từng trang, không liên quan admin.

## 10. Siết quản lý loại sản phẩm & danh mục sản phẩm

Các điểm từng làm 2 mục "Quản lý loại sản phẩm" (0,5đ) và "Quản lý danh mục sản phẩm" (0,75đ) dễ bị trừ điểm:

- **Trùng mã:** mã loại / mã sản phẩm trùng nhau (không phân biệt hoa thường) bị chặn; sửa mà giữ nguyên mã của chính nó vẫn lưu được.
- **Loại không hợp lệ:** không tạo được sản phẩm khi chưa có loại, hoặc khi `categoryId` không tồn tại.
- **Trạng thái sai:** sản phẩm thuộc loại đang ẩn ghi "Ẩn theo loại" (trước ghi "Hiển Thị"); ẩn loại có sản phẩm thì hỏi lại kèm số lượng sản phẩm bị ảnh hưởng.
- **Giá vốn lệch:** tạo sản phẩm tính `costPrice = giá bán / 1.3` (trước là `× 0.7`); sửa giá bán thì suy ngược `profitRate` để giá vốn, % lợi nhuận và giá bán khớp nhau. Chỗ hiển thị `%` dùng `??` thay `||` để mức 0% không bị đổi thành 30%.
- **Quản lý giá:** modal sửa giá bán hoặc % lợi nhuận; sửa ô nào thì ô còn lại tự cập nhật theo giá vốn (`% = (giá bán / giá vốn - 1) × 100`, `giá bán = giá vốn × (1 + % / 100)`). Lưu xong bảng quản lý giá cập nhật ngay; sửa giá ở modal sản phẩm cũng đồng bộ % sang tab này.
- **Xoá an toàn:** xoá sản phẩm đã có trong đơn hàng / phiếu nhập bị chặn và hướng dẫn dùng "Ẩn"; hộp thoại xoá nêu tên sản phẩm.
- **Xoá loại:** mở hộp thoại cảnh báo số sản phẩm đang có, với các nút **Hủy** / **Ẩn loại** / **Vẫn xóa loại** / **Xóa loại + sản phẩm**. **Ẩn loại** giữ nguyên sản phẩm (bấm "Hiện" để khôi phục); **Vẫn xóa loại** thì các sản phẩm trong loại bị ẩn và bỏ loại. **Xóa loại + sản phẩm** xoá vĩnh viễn cả loại lẫn sản phẩm bên trong, nhưng bị chặn nếu sản phẩm đã phát sinh đơn hàng / phiếu nhập (để không mất số liệu tồn kho) và hướng dẫn dùng **Vẫn xóa loại**. Đơn hàng / phiếu nhập cũ giữ nguyên ảnh chụp sản phẩm nên vẫn hoạt động bình thường. Loại đã ẩn sẵn thì không hiện nút **Ẩn loại**; loại rỗng thì không hiện nút **Xóa loại + sản phẩm**.
- **Bảng biểu:** thêm cột "Số sản phẩm" ở bảng loại, thông báo khi bảng trống, nút xoá sản phẩm có chữ "Xóa".

Đã kiểm chứng bằng bộ test cục bộ (102 case cho phần này + 7 case cũ) và mô phỏng nạp cả 4 trang.

## 11. Tách `scripts/app.js` theo trang

`scripts/app.js` cũ (1.835 dòng) được tách thành 5 file; mỗi trang chỉ nạp `common.js` + file của mình:

| File | Nội dung | Dòng |
|---|---|---:|
| `scripts/common.js` | Dữ liệu mẫu, localStorage, định dạng tiền, điều hướng, giỏ hàng, modal, bộ gắn sự kiện `data-js-action` | 675 |
| `scripts/index.js` | Lọc, tìm kiếm, phân trang, xem chi tiết sản phẩm | 200 |
| `scripts/shopping.js` | Giỏ hàng, thanh toán, hoá đơn, lịch sử đơn | 236 |
| `scripts/account.js` | Đăng nhập, đăng ký, hồ sơ khách hàng | 113 |
| `scripts/admin.js` | 7 tab quản trị | 967 |

Thứ tự nạp trong 4 file HTML:

```html
<script src="scripts/common.js"></script>
<script src="scripts/index.js"></script>
<!-- shopping.html: shopping.js · account.html: account.js · admin.html: admin.js -->
```

`window.onload = ...` được thay bằng `window.addEventListener("load", ...)` ở từng file, vì nhiều file cùng gán `window.onload` sẽ ghi đè lẫn nhau. Toàn bộ hàm của bản cũ được giữ nguyên, không hàm nào bị mất hoặc khai báo trùng giữa các file.

## 12. Bổ sung hàng hóa từ nhánh `main`

Danh mục mẫu tăng từ 8 lên **20 sản phẩm**, 4 lên **6 loại**:

- Lấy 12 ảnh mới từ `origin/main`: `TN03`–`TN05` (tai nghe), `DT04`–`DT06` (điện thoại), `LT03`–`LT05` (laptop), `PK03`–`PK05` (phụ kiện), giữ nguyên tên file.
- Thêm 2 loại: **Điện Thoại** (`cat-5`) và **Laptop** (`cat-6`).
- Thêm 12 sản phẩm mẫu `prod-9` … `prod-20`; tên và giá lấy từ danh sách sản phẩm trong `admin.js` gốc của nhánh `main`. Giá vốn suy ra bằng `giá bán / 1.3`, % lợi nhuận 30% để khớp công thức hiện tại.
- Phân loại lại theo đúng kiểu hàng: tai nghe → `cat-3`, điện thoại → `cat-5`, laptop → `cat-6`, pin dự phòng → `cat-4`, chuột không dây → `cat-2`, bàn phím cơ → `cat-1`.
- Không chép các file prototype ở gốc `main` (`admin.css`, `admin.js`, `admin-import-pricing.html`, `web hoan chinh.html`) vì trùng chức năng với app hiện tại.

Để người đã dùng app không phải xóa `localStorage`, `initDataStorage()` gọi thêm `applySeedUpdates()`:

- `app_seed_version = 2` đánh dấu đã bổ sung.
- Lần đầu mở bản mới, chỉ thêm các loại / sản phẩm mới vào dữ liệu đang có.
- Không ghi đè sản phẩm đã sửa và không khôi phục mục người dùng đã xóa.
- Kiểm tra dữ liệu mẫu: đủ 20 sản phẩm, 6 loại, không trùng `id`/`code`, tất cả ảnh tồn tại và giá quy đổi lệch không quá 1 đồng.
