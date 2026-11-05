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
├── admin.html                Khu quản trị (7 tab, 6 modal, SPA trong 1 trang)
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
├── static/images/            20 ảnh sản phẩm + default-product.svg
└── README.md                 Tài liệu này
```

---

# Nhật ký thay đổi

## 1. Siết quản lý loại sản phẩm & danh mục sản phẩm

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

## 2. Tách `scripts/app.js` theo trang

`scripts/app.js` cũ (1.749 dòng) được tách thành 5 file; mỗi trang chỉ nạp `common.js` + file của mình:

| File | Nội dung | Dòng |
|---|---|---:|
| `scripts/common.js` | Dữ liệu mẫu, localStorage, định dạng tiền, điều hướng, giỏ hàng, modal, bộ gắn sự kiện `data-js-action` | 675 |
| `scripts/index.js` | Lọc, tìm kiếm, phân trang, xem chi tiết sản phẩm | 200 |
| `scripts/shopping.js` | Giỏ hàng, thanh toán, hoá đơn, lịch sử đơn | 236 |
| `scripts/account.js` | Đăng nhập, đăng ký, hồ sơ khách hàng | 113 |
| `scripts/admin.js` | 7 tab quản trị | 998 |

`scripts/app.js` gốc được xoá sau khi tách. Thứ tự nạp trong 4 file HTML:

```html
<script src="scripts/common.js"></script>
<script src="scripts/index.js"></script>
<!-- shopping.html: shopping.js · account.html: account.js · admin.html: admin.js -->
```

`window.onload = ...` được thay bằng `window.addEventListener("load", ...)` ở từng file, vì nhiều file cùng gán `window.onload` sẽ ghi đè lẫn nhau. Toàn bộ hàm của bản cũ được giữ nguyên, không hàm nào bị mất hoặc khai báo trùng giữa các file.

## 3. Bổ sung hàng hóa từ nhánh `main`

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
- Kiểm tra dữ liệu mẫu: đủ 20 sản phẩm, 6 loại, không trùng `id`/`code`, tất cả ảnh tồn tại. 12 sản phẩm mới có giá bán lệch không quá 1 đồng so với `giá vốn × (1 + % lợi nhuận / 100)` do làm tròn; 8 sản phẩm cũ giữ nguyên giá và % gốc từ nhánh `main`.
