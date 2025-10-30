USE PhoneStore;
GO

-- Xóa dữ liệu cũ (nếu cần)
-- DELETE FROM chi_tiet_gio;
-- DELETE FROM gio_hang;
-- DELETE FROM chi_tiet_don_hang;
-- DELETE FROM don_hang;
-- DELETE FROM danh_gia;
-- DELETE FROM san_pham;
-- DELETE FROM nguoi_ban;
-- DELETE FROM nguoi_dung;
-- DELETE FROM danh_muc;
-- GO

-- Thêm danh mục
INSERT INTO danh_muc (ten_danh_muc, mo_ta) VALUES
(N'Điện thoại cao cấp', N'Các điện thoại flagship cao cấp'),
(N'Điện thoại tầm trung', N'Các điện thoại tầm trung giá tốt'),
(N'Điện thoại phổ thông', N'Các điện thoại phổ thông giá rẻ'),
(N'Phụ kiện', N'Phụ kiện điện thoại');
GO

-- Thêm người dùng mẫu
INSERT INTO nguoi_dung (email, mat_khau_hash, ho_ten, so_dien_thoai, dia_chi, thanh_pho, la_nguoi_ban, trang_thai_hoat_dong) VALUES
(N'admin@phonehub.com', N'$2b$10$hashed_password_here', N'Admin PhoneHub', N'0901234567', N'123 Nguyễn Huệ', N'Hồ Chí Minh', 1, 1),
(N'seller1@phonehub.com', N'$2b$10$hashed_password_here', N'Cửa hàng Apple', N'0912345678', N'456 Lê Lợi', N'Hà Nội', 1, 1),
(N'seller2@phonehub.com', N'$2b$10$hashed_password_here', N'Cửa hàng Samsung', N'0923456789', N'789 Trần Hưng Đạo', N'Đà Nẵng', 1, 1),
(N'customer1@phonehub.com', N'$2b$10$hashed_password_here', N'Nguyễn Văn A', N'0934567890', N'321 Phạm Ngũ Lão', N'Hồ Chí Minh', 0, 1),
(N'customer2@phonehub.com', N'$2b$10$hashed_password_here', N'Trần Thị B', N'0945678901', N'654 Ngô Quyền', N'Hà Nội', 0, 1);
GO

-- Thêm thông tin người bán
INSERT INTO nguoi_ban (id_nguoi_dung, ten_cua_hang, mo_ta_cua_hang, ten_tai_khoan_ngan_hang, so_tai_khoan_ngan_hang, ten_ngan_hang, so_dien_thoai, dia_chi, thanh_pho, da_xac_minh) VALUES
(2, N'Apple Store Vietnam', N'Cửa hàng chính thức bán iPhone, iPad, Mac', N'Apple Vietnam', N'1234567890', N'Vietcombank', N'0912345678', N'456 Lê Lợi', N'Hà Nội', 1),
(3, N'Samsung Store Vietnam', N'Cửa hàng chính thức bán Samsung Galaxy', N'Samsung Vietnam', N'0987654321', N'Techcombank', N'0923456789', N'789 Trần Hưng Đạo', N'Đà Nẵng', 1);
GO

-- Thêm sản phẩm mẫu
INSERT INTO san_pham (id_nguoi_ban, id_danh_muc, ten_san_pham, thuong_hieu, mo_ta, gia_tien, so_luong_kho, hinh_anh, thong_so_ky_thuat, danh_gia, so_danh_gia) VALUES
(1, 1, N'iPhone 15 Pro Max', N'Apple', N'Điện thoại flagship của Apple với camera 48MP', 35990000, 50, N'/images/iphone-15-pro-max.png', N'{"screen":"6.7 inch OLED","processor":"A17 Pro","ram":"8GB","storage":"256GB","battery":"4685mAh"}', 5, 128),
(1, 1, N'iPhone 15 Pro', N'Apple', N'iPhone 15 Pro với chip A17 Pro', 31990000, 45, N'/images/iphone-15-pro.png', N'{"screen":"6.1 inch OLED","processor":"A17 Pro","ram":"8GB","storage":"256GB","battery":"3274mAh"}', 5, 95),
(1, 2, N'iPhone 15', N'Apple', N'iPhone 15 với chip A16 Bionic', 24990000, 60, N'/images/iphone-15.png', N'{"screen":"6.1 inch LCD","processor":"A16 Bionic","ram":"6GB","storage":"128GB","battery":"3349mAh"}', 4, 67),
(2, 1, N'Samsung Galaxy S24 Ultra', N'Samsung', N'Flagship Samsung với S Pen tích hợp', 32990000, 40, N'/images/samsung-s24-ultra.png', N'{"screen":"6.8 inch AMOLED","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"5000mAh"}', 5, 95),
(2, 1, N'Samsung Galaxy S24+', N'Samsung', N'Samsung Galaxy S24+ với màn hình 6.7 inch', 28990000, 55, N'/images/samsung-s24-plus.png', N'{"screen":"6.7 inch AMOLED","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"4900mAh"}', 4, 78),
(2, 2, N'Samsung Galaxy A54', N'Samsung', N'Samsung Galaxy A54 tầm trung', 12990000, 80, N'/images/samsung-a54.png', N'{"screen":"6.4 inch AMOLED","processor":"Exynos 1280","ram":"6GB","storage":"128GB","battery":"5000mAh"}', 4, 156),
(1, 1, N'Google Pixel 8 Pro', N'Google', N'Điện thoại với AI camera tốt nhất', 24990000, 35, N'/images/google-pixel-8-pro.png', N'{"screen":"6.7 inch OLED","processor":"Tensor G3","ram":"12GB","storage":"256GB","battery":"5050mAh"}', 4, 67),
(2, 2, N'Xiaomi 14 Ultra', N'Xiaomi', N'Điện thoại cao cấp với camera Leica', 18990000, 70, N'/images/xiaomi-14-ultra.png', N'{"screen":"6.73 inch AMOLED","processor":"Snapdragon 8 Gen 3","ram":"16GB","storage":"512GB","battery":"5300mAh"}', 4, 156),
(1, 3, N'OnePlus 12', N'OnePlus', N'Điện thoại nhanh với sạc nhanh 100W', 16990000, 90, N'/images/oneplus-12.png', N'{"screen":"6.82 inch AMOLED","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB","battery":"5400mAh"}', 4, 89),
(2, 2, N'Vivo X100 Pro', N'Vivo', N'Điện thoại với chip Dimensity 9300', 19990000, 65, N'/images/vivo-x100-pro.jpg', N'{"screen":"6.78 inch AMOLED","processor":"Dimensity 9300","ram":"12GB","storage":"512GB","battery":"5500mAh"}', 4, 72);
GO

-- Thêm đánh giá mẫu
INSERT INTO danh_gia (id_san_pham, id_nguoi_dung, diem_danh_gia, binh_luan, la_mua_hang_xac_minh) VALUES
(1, 4, 5, N'Sản phẩm tuyệt vời, giao hàng nhanh', 1),
(1, 5, 5, N'Chất lượng tốt, đúng như mô tả', 1),
(2, 4, 4, N'Tốt nhưng hơi đắt', 1),
(3, 5, 4, N'Giá tốt, hiệu năng ổn', 1),
(4, 4, 5, N'Tuyệt vời, camera rất tốt', 1),
(5, 5, 4, N'Tốt, pin kéo dài', 1);
GO

-- Thêm giỏ hàng mẫu
INSERT INTO gio_hang (id_nguoi_dung) VALUES
(4),
(5);
GO

-- Thêm sản phẩm vào giỏ hàng
INSERT INTO chi_tiet_gio (id_gio, id_san_pham, so_luong) VALUES
(1, 1, 1),
(1, 3, 2),
(2, 4, 1);
GO

-- Thêm đơn hàng mẫu
INSERT INTO don_hang (id_nguoi_dung, id_nguoi_ban, so_don_hang, tong_tien, chi_phi_van_chuyen, tien_cuoi_cung, trang_thai, trang_thai_thanh_toan, dia_chi_giao_hang, ten_nguoi_nhan, so_dien_thoai_nhan) VALUES
(4, 1, N'ORD-2024-001', 35990000, 30000, 36020000, N'Delivered', N'Paid', N'321 Phạm Ngũ Lão, Hồ Chí Minh', N'Nguyễn Văn A', N'0934567890'),
(5, 2, N'ORD-2024-002', 32990000, 30000, 33020000, N'Shipped', N'Paid', N'654 Ngô Quyền, Hà Nội', N'Trần Thị B', N'0945678901'),
(4, 2, N'ORD-2024-003', 12990000, 20000, 13010000, N'Pending', N'Unpaid', N'321 Phạm Ngũ Lão, Hồ Chí Minh', N'Nguyễn Văn A', N'0934567890');
GO

-- Thêm chi tiết đơn hàng
INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, gia_don_vi, tong_gia) VALUES
(1, 1, 1, 35990000, 35990000),
(2, 4, 1, 32990000, 32990000),
(3, 6, 1, 12990000, 12990000);
GO

PRINT 'Dữ liệu mẫu đã được thêm thành công!';
GO
