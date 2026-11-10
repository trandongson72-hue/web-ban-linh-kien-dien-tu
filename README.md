# TÓM TẮT CÁC THAY ĐỔI

Dự án: TechStore – Website bán linh kiện điện tử  
Ngày sửa: 10/11/2026  
  
> Mỗi phần chính có giải thích: **Trước khi sửa → Sau khi sửa → Tại sao sửa → Ảnh hưởng**.

---

## 1. scripts/common.js

### 1.1. Thêm `profitRate` vào category seed

**Trước:** Category chỉ có `id`, `code`, `name`, `isHidden`. Không có trường `% lợi nhuận` theo loại.

**Sau:** Mỗi category có thêm `profitRate: 30`.

```diff
- { id: "cat-1", code: "ban-phim", name: "Bàn Phím", isHidden: false },
+ { id: "cat-1", code: "ban-phim", name: "Bàn Phím", profitRate: 30, isHidden: false },
```

**Tại sao:** PDF yêu cầu "hiển thị & nhập/sửa % lợi nhuận theo loại sản phẩm". Cần có trường này trên category.

**Ảnh hưởng:** Rubric admin mục 14 (% lợi nhuận theo loại) từ **CHƯA ĐẠT** → **ĐÃ ĐẠT**.

---

### 1.2. Migration điền `profitRate` cho category cũ

**Hàm mới:** `applyCategoryProfitRateDefaults()` (dòng 331–349)

**Tại sao:** Người dùng đã dùng app trước bản cập nhật này có category trong localStorage mà không có trường `profitRate`. Hàm này điền `30%` cho những category thiếu trường, **không ghi đè** % đã có.

**Cách dùng:** Gọi trong `initDataStorage()` sau `applySeedUpdates()`.

---

### 1.3. Hàm `escapeHtml()` ngăn chặn XSS

**Hàm mới:** `escapeHtml(text)` (dòng 478–486)

**Trước:** Các hàm render dùng `innerHTML` trực tiếp với dữ liệu từ localStorage, nguy cơ Stored XSS nếu dữ liệu chứa script độc hại.

**Sau:** Truyền dữ liệu qua `escapeHtml()` trước khi gán vào `innerHTML`.

```diff
- <td>${u.username}</td>
+ <td>${escapeHtml(u.username)}</td>
```

**Áp dụng ở:** `renderAdminUsers`, `renderAdminProducts`, `renderAdminPricing`, `renderAdminOrders`, `renderCart`, `renderInvoice`, `renderOrderHistory`.

---

### 1.4. Hàm `getAvailableStock()` tính tồn kho thực

**Hàm mới:** `getAvailableStock(prodId)`

**Công thức:** Tồn kho = nhập hoàn thành − đơn đã xử lý/giao.

**Tại sao:** Trước đây không có hàm tính tồn kho thực tế, dẫn đến có thể đặt hàng vượt tồn.

**Được dùng ở:** `submitOrder()` trong `shopping.js` để kiểm tra trước khi đặt hàng.

---

### 1.5. Sửa tổng phiếu nhập mẫu sai

**Trước:** `totalAmount: 22390000` (sai, thiếu 9.300.000)

**Sau:** `totalAmount: 31690000` (đúng tổng các dòng hàng)

**Tại sao:** Lỗi nhập tay trong seed, không phải công thức.

---

### 1.6. Sửa 4 giá seed lệch công thức

| Sản phẩm | Trước (sai) | Sau (đúng) | Công thức |
|----------|-------------|------------|-----------|
| `prod-1` (Bàn phím Akko) | 1.150.000 | 1.147.500 | 850.000 × 1,35 |
| `prod-2` (Bàn phím Dareu) | 550.000 | 546.000 | 420.000 × 1,30 |
| `prod-4` (Chuột G102) | 420.000 | 418.500 | 310.000 × 1,35 |
| `prod-8` (USB Kingston) | 120.000 | 119.000 | 85.000 × 1,40 |

**Tại sao:** Giá bán phải khớp `costPrice × (1 + profitRate/100)`.

---

## 2. scripts/admin.js

### 2.1. % Lợi nhuận theo loại sản phẩm (CHÍNH)

**Hàm mới:** `applyCategoryProfitRate(catId)` (dòng 196–226)

**Trước:** Không có nút áp % loại cho sản phẩm.

**Sau:** Nút "Áp % cho SP" trong bảng loại sản phẩm. Khi bấm:
- Hiện confirm hỏi số lượng sản phẩm sẽ bị ảnh hưởng
- Nếu đồng ý, duyệt toàn bộ sản phẩm trong loại, gán `profitRate` mới và tính lại `price = round(costPrice × (1 + rate/100))`

**Tại sao:** PDF yêu cầu áp dụng hàng loạt % loại xuống sản phẩm.

---

### 2.2. Gợi ý % loại khi thêm/sửa sản phẩm

**Hàm mới:** `updateProductCategoryRateHint()` (dòng 430–441)

**Trước:** Modal thêm sản phẩm không hiển thị % của loại đã chọn.

**Sau:** HiệnSmall text dưới select loại: "% lợi nhuận của loại 'Bàn Phím': 30% (sản phẩm mới sẽ dùng % này)".

---

### 2.3. Sản phẩm mới kế thừa % của loại

**Hàm:** `saveProduct()` (dòng 521–534)

**Trước:** Sản phẩm mới luôn `profitRate: 30`, `costPrice = round(price / 1.3)`.

**Sau:** Lấy `categoryRate` của loại đã chọn, gán `profitRate = categoryRate`, suy ngược `costPrice = round(price / (1 + categoryRate/100))`.

**Ví dụ:** Chọn loại "Bàn Phím" (profitRate 35), nhập giá bán 1.000.000 → `costPrice = 740.741`, `profitRate = 35`.

---

### 2.4. Tìm phiếu nhập mở rộng

**Hàm:** `renderImportReceipts()` (dòng 577–633)

**Trước:** Chỉ tìm theo `importId` (mã phiếu).

**Sau:** Tìm theo:
- Mã phiếu (`importId`)
- Ngày nhập (cả `yyyy-mm-dd` và `dd/mm/yyyy`)
- Trạng thái ("bản nháp"/"draft", "đã hoàn thành"/"completed")
- Tên/mã sản phẩm trong phiếu
- Tổng tiền (số thô và chuỗi tiền đã định dạng)

**Tại sao:** Rubric admin mục 10 từ **ĐẠT MỘT PHẦN** → **ĐÃ ĐẠT**.

---

### 2.5. Tra cứu giá bán (CHÍNH)

**Hàm:** `renderAdminPricing()` (dòng 811–870)

**Trước:** Chỉ hiển thị bảng, không tìm, không lọc, không sắp xếp.

**Sau:**
- Ô tìm kiếm theo mã, tên, loại, giá vốn, %, giá bán
- Select lọc theo loại (giữ lựa chọn khi render lại)
- Select sắp xếp theo giá bán / % (tăng/giảm)
- Nút "Xóa lọc"
- Thông báo khi không tìm thấy kết quả

**Tại sao:** Rubric admin mục 15 từ **ĐẠT MỘT PHẦN** → **ĐÃ ĐẠT**.

---

### 2.6. Kiểm tra trùng mã phiếu nhập

**Hàm:** `saveImportWithStatus()` (dòng 725–782)

**Trước:** Nếu trùng `importId`, ghi đè luôn phiếu cũ (kể cả đã hoàn thành).

**Sau:**
- Nếu trùng và phiếu cũ đã hoàn thành → alert, không cho ghi đè
- Nếu trùng và phiếu cũ là nháp → confirm trước khi ghi đè

---

### 2.7. Chặn số lượng âm trong phiếu nhập

**Hàm:** `addItemToImport()` (dòng 655–668)

**Trước:** `parseInt("-5")` là -5 (truthy), số lượng âm vẫn được nhận.

**Sau:** Kiểm tra `Number.isInteger(qty) && qty > 0`, alert nếu sai.

---

### 2.8. Lưu lịch sử thay đổi giá

**Hàm:** `saveProfitRate()` (dòng 904–933)

**Sau:** Khi giá thay đổi, lưu vào `p.priceHistory` mảng chứa `{date, oldPrice, newPrice, profitRate, note}`.

---

### 2.9. Ngăn XSS trong bảng admin

Thêm `escapeHtml()` cho: username, fullName, phone, code, name, category name, orderId, recipientName, phone, status.

---

## 3. scripts/account.js

### 3.1. `saveProfileChanges()` không ghi đè password/isLocked

**Trước:** `users[idx] = user` — ghi đè **toàn bộ object** user. Nếu `sessionStorage` có dữ liệu cũ (isLocked false, password cũ), sẽ ghi đè lên `localStorage` (isLocked true, password mới).

**Ví dụ hậu quả:** Admin khóa tài khoản → khách lưu hồ sơ → tài khoản bị mở khóa lại.

**Sau:** Chỉ cập nhật 3 trường `fullName`, `phone`, `address` của bản ghi đang tồn tại, **không chạm** `password` và `isLocked`.

```diff
- users[idx] = user;
+ users[idx].fullName = fullName;
+ users[idx].phone = phone;
+ users[idx].address = address;
```

**Rubric:** End-user mục 3 từ **ĐẠT MỘT PHẦN** → **ĐÃ ĐẠT**.

---

## 4. scripts/shopping.js

### 4.1. Chặn vào giỏ hàng khi chưa đăng nhập

**Hàm:** `renderCart()` (dòng 6–11)

**Trước:** Mở thẳng `shopping.html#view-cart` vẫn xem được giỏ dù chưa đăng nhập.

**Sau:** Kiểm tra `getCurrentUser()`. Nếu null → hiện thông báo "Bạn cần đăng nhập để xem giỏ hàng."

### 4.2. Chặn xem lịch sử đơn khi chưa đăng nhập

**Hàm:** `renderOrderHistory()` (dòng 180–186)

**Trước:** `if (!user) return;` → bảng trắng, không thông báo.

**Sau:** Hiện thông báo "Bạn cần đăng nhập để xem lịch sử đơn hàng."

---

### 4.3. Kiểm tra tồn kho trước khi đặt hàng

**Hàm:** `submitOrder()` (dòng trước `newOrder`)

**Trước:** Đặt hàng luôn thành công dù không đủ tồn kho.

**Sau:** Duyệt giỏ hàng, gọi `getAvailableStock(item.id)`. Nếu bất kỳ sản phẩm nào không đủ → alert và **huỷ đơn**.

**Ví dụ:** Giỏ có "Bàn phím Akko" (x3) nhưng tồn chỉ còn 2 → alert: "Sản phẩm sau đây không đủ tồn kho: Bàn phím cơ Akko 3084 Silent (còn 2, bạn đặt 3)".

---

### 4.4. Kiểm tra trùng mã đơn hàng

**Hàm:** `submitOrder()` (dòng tạo `newOrder`)

**Trước:** `orderId` random 4 chữ số, có thể trùng.

**Sau:** `while` loop sinh lại mã nếu trùng với đơn đã có.

---

### 4.5. Kiểm tra sở hữu đơn hàng khi xem chi tiết

**Hàm:** `viewClientOrderDetailById(orderId)` (dòng 247–264)

**Trước:** Biết `orderId` là xem được chi tiết đơn của khách khác.

**Sau:**
1. Kiểm tra đăng nhập
2. Tìm đơn theo `orderId`
3. Kiểm tra `order.username !== user.username` → alert "Bạn không có quyền xem chi tiết đơn hàng này."

**Rubric:** End-user mục 12 từ **ĐẠT MỘT PHẦN** (thiếu check sở hữu) → **ĐÃ ĐẠT** (cần xác nhận lại với rubric chi tiết).

---

### 4.6. Ngăn XSS

Thêm `escapeHtml()` vào tên sản phẩm trong giỏ, hóa đơn, lịch sử đơn.

---

## 5. admin.html

### 5.1. Cột % Lợi nhuận trong bảng loại

**Trước:** 5 cột (Mã loại, Tên loại, Số sản phẩm, Trạng thái, Thao tác).

**Sau:** 6 cột (Mã loại, Tên loại, **% Lợi nhuận**, Số sản phẩm, Trạng thái, Thao tác).

### 5.2. Ô nhập % loại trong modal

**Trước:** Modal loại chỉ có Mã loại, Tên loại.

**Sau:** Thêm `#cat-profit-rate-input` (min 0, max 100000, step 0.01).

### 5.3. Gợi ý % loại trong modal sản phẩm

**Trước:** Select loại không có thông tin %.

**Sau:** Thêm `#prod-cat-rate-hint` hiển thị "% lợi nhuận của loại 'X': 30%".

### 5.4. Placeholder tìm phiếu nhập mở rộng

**Trước:** "Tìm theo mã phiếu nhập…"

**Sau:** "Tìm theo mã phiếu, ngày nhập, sản phẩm…"

### 5.5. Bộ lọc giá bán (CHÍNH)

**Trước:** Không có ô tìm, không có lọc, không có sắp xếp.

**Sau:** Thêm `search-pricing-input`, `filter-pricing-category`, `filter-pricing-sort`, nút `resetPricingFilter`.

### 5.6. Sửa header bảng tồn kho

**Trước:** `Tổng Nhập | Tổng Xuất | Tồn Hiện Tại | Tồn Đầu Kỳ` (lệch so với dữ liệu JS render).

**Sau:** `Tồn Đầu Kỳ | Tổng Nhập | Tổng Xuất | Tồn Cuối Kỳ` (khớp với `getInventoryNumbers()`).

---

## 6. shopping.html

### 6.1. Nút in hóa đơn

**Thêm:** `<button onclick="window.print()">In hóa đơn</button>` trên trang đặt hàng thành công.

---

## 8. styles/common.css

### 8.1. Responsive cho mobile

**Thêm:** `@media (max-width: 768px)`
- Sidebar admin ẩn
- Bảng co cự (padding nhỏ hơn)
- Modal rộng 95%
- Nút full width
- Grid layout stacking (1 cột thay vì 2 cột)

---

## FILE ĐÃ THAY ĐỔI (TỔNG HỢP)

| File | Thao tác | Nội dung chính |
|------|----------|----------------|
| `scripts/common.js` | Sửa + thêm | profitRate category, migration, escapeHtml, getAvailableStock, sửa seed (tổng + 4 giá) |
| `scripts/admin.js` | Sửa + thêm | % theo loại, tìm phiếu nhập, tra cứu giá, escapeHtml, kiểm tra trùng mã phiếu, số lượng âm, priceHistory |
| `scripts/account.js` | Sửa | saveProfileChanges chỉ cập nhật 3 trường, không ghi đè password/isLocked |
| `scripts/shopping.js` | Sửa + thêm | kiểm tra tồn kho, kiểm tra trùng orderId, kiểm tra sở hữu đơn hàng, chặn vào giỏ khi chưa đăng nhập, escapeHtml |
| `admin.html` | Sửa | cột % loại, ô nhập % loại, bộ lọc giá bán, header tồn kho, placeholder tìm phiếu |
| `shopping.html` | Sửa | nút in hóa đơn |
| `index.html` | Sửa | xóa duplicate DOCTYPE |
| `account.html` | Sửa | xóa duplicate DOCTYPE |
| `styles/common.css` | Thêm | responsive @media 768px |
| `.gitignore` | Tạo mới | bỏ qua file rác Windows, IDE, node_modules, log, .env |
| `PATCH_SUMMARY.md` | Tạo mới | File này |

---

