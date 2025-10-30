-- Script để cập nhật đường dẫn ảnh trong bảng san_pham
-- Trong Next.js, file trong thư mục public được serve từ root /
-- Nên trong DB chỉ cần lưu đường dẫn bắt đầu từ / (không có prefix /public)

USE PhoneStore;
GO

-- Cập nhật đường dẫn ảnh cho các sản phẩm
-- Format: /tên-file.png (bắt đầu bằng dấu /, không có /public)

UPDATE san_pham SET hinh_anh = '/iphone-15-pro-max.png' WHERE id_san_pham = 1;
UPDATE san_pham SET hinh_anh = '/iphone-15-pro-max.png' WHERE id_san_pham = 2; -- iPhone 15 Pro (dùng ảnh Pro Max tạm)
UPDATE san_pham SET hinh_anh = '/iphone-15-pro-max.png' WHERE id_san_pham = 3; -- iPhone 15 (dùng ảnh Pro Max tạm)
UPDATE san_pham SET hinh_anh = '/samsung-galaxy-s24-ultra.png' WHERE id_san_pham = 4;
UPDATE san_pham SET hinh_anh = '/samsung-galaxy-s24-ultra.png' WHERE id_san_pham = 5; -- S24+ (dùng ảnh Ultra tạm)
UPDATE san_pham SET hinh_anh = '/placeholder.jpg' WHERE id_san_pham = 6; -- Samsung A54 (chưa có ảnh)
UPDATE san_pham SET hinh_anh = '/google-pixel-8-pro.png' WHERE id_san_pham = 7;
UPDATE san_pham SET hinh_anh = '/xiaomi-14-ultra.png' WHERE id_san_pham = 8;
UPDATE san_pham SET hinh_anh = '/oneplus-12-product-shot.png' WHERE id_san_pham = 9;
UPDATE san_pham SET hinh_anh = '/vivo-x100-pro.jpg' WHERE id_san_pham = 10;

GO

PRINT 'Đã cập nhật đường dẫn ảnh cho tất cả sản phẩm!';
PRINT 'Lưu ý: File ảnh phải được đặt trong thư mục public/ của dự án Next.js';
PRINT 'Format đường dẫn trong DB: /tên-file.extension (bắt đầu bằng /, không có /public)';
GO

