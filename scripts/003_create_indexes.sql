-- SQL Server 2022 - Tạo thêm các indexes để tối ưu hiệu suất
USE PhoneStore;
GO

-- Indexes cho tìm kiếm sản phẩm
CREATE INDEX IX_Products_ProductName ON Products(ProductName);
CREATE INDEX IX_Products_Price ON Products(Price);
CREATE INDEX IX_Products_Rating ON Products(Rating DESC);
GO

-- Indexes cho Orders
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_PaymentStatus ON Orders(PaymentStatus);
CREATE INDEX IX_Orders_CreatedAt ON Orders(CreatedAt DESC);
GO

-- Indexes cho Reviews
CREATE INDEX IX_Reviews_Rating ON Reviews(Rating DESC);
GO

-- Full-text search index cho Products (tùy chọn)
-- CREATE FULLTEXT CATALOG ft_catalog AS DEFAULT;
-- CREATE FULLTEXT INDEX ON Products(ProductName, Description) KEY INDEX PK_Products;
GO

PRINT 'Các indexes đã được tạo thành công!';
GO
