-- SQL Server 2022 - Tạo Database và Bảng cho PhoneStore
-- Chạy script này trước tiên để tạo cấu trúc database

USE master;
GO

-- Tạo database nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PhoneStore')
BEGIN
    CREATE DATABASE PhoneStore;
END
GO

USE PhoneStore;
GO

-- Tạo bảng danh_muc
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'danh_muc')
BEGIN
    CREATE TABLE danh_muc (
        id_danh_muc INT PRIMARY KEY IDENTITY(1,1),
        ten_danh_muc NVARCHAR(100) NOT NULL,
        mo_ta NVARCHAR(500),
        trang_thai_hoat_dong BIT DEFAULT 1,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE()
    );
END
GO

-- Tạo bảng nguoi_dung
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nguoi_dung')
BEGIN
    CREATE TABLE nguoi_dung (
        id_nguoi_dung INT PRIMARY KEY IDENTITY(1,1),
        email NVARCHAR(100) NOT NULL UNIQUE,
        mat_khau_hash NVARCHAR(255) NOT NULL,
        ho_ten NVARCHAR(100),
        so_dien_thoai NVARCHAR(20),
        dia_chi NVARCHAR(255),
        thanh_pho NVARCHAR(50),
        la_nguoi_ban BIT DEFAULT 0,
        trang_thai_hoat_dong BIT DEFAULT 1,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE()
    );
    CREATE INDEX IX_nguoi_dung_email ON nguoi_dung(email);
END
GO

-- Tạo bảng nguoi_ban
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nguoi_ban')
BEGIN
    CREATE TABLE nguoi_ban (
        id_nguoi_ban INT PRIMARY KEY IDENTITY(1,1),
        id_nguoi_dung INT NOT NULL UNIQUE,
        ten_cua_hang NVARCHAR(100) NOT NULL,
        mo_ta_cua_hang NVARCHAR(1000),
        ten_tai_khoan_ngan_hang NVARCHAR(100),
        so_tai_khoan_ngan_hang NVARCHAR(50),
        ten_ngan_hang NVARCHAR(100),
        so_dien_thoai NVARCHAR(20),
        dia_chi NVARCHAR(255),
        thanh_pho NVARCHAR(50),
        da_xac_minh BIT DEFAULT 0,
        tong_doanh_so INT DEFAULT 0,
        danh_gia_trung_binh DECIMAL(3,2) DEFAULT 0,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung) ON DELETE CASCADE
    );
    CREATE INDEX IX_nguoi_ban_id_nguoi_dung ON nguoi_ban(id_nguoi_dung);
END
GO

-- Tạo bảng san_pham
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'san_pham')
BEGIN
    CREATE TABLE san_pham (
        id_san_pham INT PRIMARY KEY IDENTITY(1,1),
        id_nguoi_ban INT NOT NULL,
        id_danh_muc INT,
        ten_san_pham NVARCHAR(200) NOT NULL,
        thuong_hieu NVARCHAR(100),
        mo_ta NVARCHAR(MAX),
        gia_tien DECIMAL(12,2) NOT NULL,
        so_luong_kho INT DEFAULT 0,
        hinh_anh NVARCHAR(500),
        thong_so_ky_thuat NVARCHAR(MAX),
        danh_gia DECIMAL(3,2) DEFAULT 0,
        so_danh_gia INT DEFAULT 0,
        trang_thai_hoat_dong BIT DEFAULT 1,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_nguoi_ban) REFERENCES nguoi_ban(id_nguoi_ban) ON DELETE CASCADE,
        FOREIGN KEY (id_danh_muc) REFERENCES danh_muc(id_danh_muc)
    );
    CREATE INDEX IX_san_pham_id_nguoi_ban ON san_pham(id_nguoi_ban);
    CREATE INDEX IX_san_pham_id_danh_muc ON san_pham(id_danh_muc);
    CREATE INDEX IX_san_pham_thuong_hieu ON san_pham(thuong_hieu);
END
GO

-- Tạo bảng don_hang
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'don_hang')
BEGIN
    CREATE TABLE don_hang (
        id_don_hang INT PRIMARY KEY IDENTITY(1,1),
        id_nguoi_dung INT NOT NULL,
        id_nguoi_ban INT NOT NULL,
        so_don_hang NVARCHAR(50) NOT NULL UNIQUE,
        tong_tien DECIMAL(12,2) NOT NULL,
        chi_phi_van_chuyen DECIMAL(10,2) DEFAULT 0,
        tien_cuoi_cung DECIMAL(12,2) NOT NULL,
        trang_thai NVARCHAR(50) DEFAULT 'Pending',
        trang_thai_thanh_toan NVARCHAR(50) DEFAULT 'Unpaid',
        dia_chi_giao_hang NVARCHAR(500),
        ten_nguoi_nhan NVARCHAR(100),
        so_dien_thoai_nhan NVARCHAR(20),
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung) ON DELETE CASCADE,
        FOREIGN KEY (id_nguoi_ban) REFERENCES nguoi_ban(id_nguoi_ban)
    );
    CREATE INDEX IX_don_hang_id_nguoi_dung ON don_hang(id_nguoi_dung);
    CREATE INDEX IX_don_hang_id_nguoi_ban ON don_hang(id_nguoi_ban);
    CREATE INDEX IX_don_hang_so_don_hang ON don_hang(so_don_hang);
END
GO

-- Tạo bảng chi_tiet_don_hang
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'chi_tiet_don_hang')
BEGIN
    CREATE TABLE chi_tiet_don_hang (
        id_chi_tiet_don_hang INT PRIMARY KEY IDENTITY(1,1),
        id_don_hang INT NOT NULL,
        id_san_pham INT NOT NULL,
        so_luong INT NOT NULL,
        gia_don_vi DECIMAL(12,2) NOT NULL,
        tong_gia DECIMAL(12,2) NOT NULL,
        ngay_tao DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_don_hang) REFERENCES don_hang(id_don_hang) ON DELETE CASCADE,
        FOREIGN KEY (id_san_pham) REFERENCES san_pham(id_san_pham)
    );
    CREATE INDEX IX_chi_tiet_don_hang_id_don_hang ON chi_tiet_don_hang(id_don_hang);
END
GO

-- Tạo bảng gio_hang
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'gio_hang')
BEGIN
    CREATE TABLE gio_hang (
        id_gio INT PRIMARY KEY IDENTITY(1,1),
        id_nguoi_dung INT NOT NULL UNIQUE,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung) ON DELETE CASCADE
    );
    CREATE INDEX IX_gio_hang_id_nguoi_dung ON gio_hang(id_nguoi_dung);
END
GO

-- Tạo bảng chi_tiet_gio
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'chi_tiet_gio')
BEGIN
    CREATE TABLE chi_tiet_gio (
        id_chi_tiet_gio INT PRIMARY KEY IDENTITY(1,1),
        id_gio INT NOT NULL,
        id_san_pham INT NOT NULL,
        so_luong INT NOT NULL,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_gio) REFERENCES gio_hang(id_gio) ON DELETE CASCADE,
        FOREIGN KEY (id_san_pham) REFERENCES san_pham(id_san_pham) ON DELETE CASCADE
    );
    CREATE INDEX IX_chi_tiet_gio_id_gio ON chi_tiet_gio(id_gio);
END
GO

-- Tạo bảng danh_gia
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'danh_gia')
BEGIN
    CREATE TABLE danh_gia (
        id_danh_gia INT PRIMARY KEY IDENTITY(1,1),
        id_san_pham INT NOT NULL,
        id_nguoi_dung INT NOT NULL,
        diem_danh_gia INT NOT NULL,
        binh_luan NVARCHAR(1000),
        la_mua_hang_xac_minh BIT DEFAULT 0,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_san_pham) REFERENCES san_pham(id_san_pham) ON DELETE CASCADE,
        FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung) ON DELETE CASCADE
    );
    CREATE INDEX IX_danh_gia_id_san_pham ON danh_gia(id_san_pham);
    CREATE INDEX IX_danh_gia_id_nguoi_dung ON danh_gia(id_nguoi_dung);
END
GO

PRINT 'Database PhoneStore và tất cả các bảng đã được tạo thành công!';
GO
