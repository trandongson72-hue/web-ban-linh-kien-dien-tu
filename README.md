# Web bán linh kiện điện tử

## Các trang chính

- `index.html`: trang chủ
- `shopping.html`: mua sắm
- `account.html`: tài khoản
- `admin.html`: quản trị

## Tài nguyên

- `styles/common.css`: kiểu dùng chung
- `styles/`: kiểu riêng cho từng trang
- `scripts/src/`: mã JavaScript được tách theo chức năng
- `scripts/app.js`: file JavaScript hoàn chỉnh được các trang sử dụng
- `scripts/build.js`: ghép các file nguồn thành `scripts/app.js`
- `static/images/`: hình ảnh sản phẩm

Sau khi chỉnh sửa JavaScript nguồn, chạy `node scripts/build.js` để tạo lại file dùng trên các trang.
Các chức năng nhập hàng, quản lý giá, đơn hàng và tồn kho nằm trong module quản trị hiện tại; không nạp lại `admin.js` cũ vì file đó dùng giao diện và dữ liệu mẫu khác.