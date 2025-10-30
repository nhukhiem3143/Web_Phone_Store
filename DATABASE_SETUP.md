# Hướng Dẫn Cấu Hình SQL Server 2022

## 1. Cài Đặt SQL Server 2022

### Trên Windows:
- Tải SQL Server 2022 từ: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Chọn "Express" hoặc "Developer" edition
- Cài đặt với các tùy chọn mặc định
- Ghi nhớ username (mặc định: `sa`) và password

### Trên macOS/Linux:
\`\`\`bash
# Sử dụng Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123" \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest
\`\`\`

## 2. Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục gốc dự án:

\`\`\`env
SQL_SERVER_HOST=localhost
SQL_SERVER_PORT=1433
SQL_SERVER_DATABASE=PhoneStore
SQL_SERVER_USER=sa
SQL_SERVER_PASSWORD=YourPassword123
\`\`\`

## 3. Tạo Database và Bảng

### Cách 1: Sử dụng SQL Server Management Studio (SSMS)

1. Mở SSMS
2. Kết nối đến SQL Server (Server name: `localhost` hoặc `localhost\SQLEXPRESS`)
3. Mở file `scripts/001_create_tables.sql`
4. Chạy script (F5)
5. Mở file `scripts/002_insert_sample_data.sql`
6. Chạy script để thêm dữ liệu mẫu

### Cách 2: Sử dụng Command Line

\`\`\`bash
# Kết nối đến SQL Server
sqlcmd -S localhost -U sa -P YourPassword123

# Chạy script
sqlcmd -S localhost -U sa -P YourPassword123 -i scripts/001_create_tables.sql
sqlcmd -S localhost -U sa -P YourPassword123 -i scripts/002_insert_sample_data.sql
\`\`\`

## 4. Cấu Trúc Database

### Bảng chính:
- **Users** - Thông tin người dùng
- **Sellers** - Thông tin người bán hàng
- **Products** - Sản phẩm (có cột Image để lưu đường dẫn ảnh)
- **Categories** - Danh mục sản phẩm
- **Orders** - Đơn hàng
- **OrderItems** - Chi tiết đơn hàng
- **Cart** - Giỏ hàng
- **CartItems** - Chi tiết giỏ hàng
- **Reviews** - Đánh giá sản phẩm

### Cột Image trong Products:
\`\`\`sql
Image NVARCHAR(500) -- Lưu đường dẫn ảnh (ví dụ: /images/iphone-15.png)
\`\`\`

## 5. Chạy Ứng Dụng

\`\`\`bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Truy cập http://localhost:3000
\`\`\`

## 6. Dữ Liệu Mẫu

Dữ liệu mẫu bao gồm:
- 5 người dùng (2 người bán, 3 khách hàng)
- 2 cửa hàng
- 10 sản phẩm
- 6 đánh giá
- 3 đơn hàng

## 7. Troubleshooting

### Lỗi kết nối:
- Kiểm tra SQL Server đang chạy
- Kiểm tra environment variables
- Kiểm tra firewall cho port 1433

### Lỗi authentication:
- Kiểm tra username/password
- Kiểm tra SQL Server authentication mode

### Lỗi driver:
\`\`\`bash
npm install mssql
\`\`\`

## 8. Tài Liệu Tham Khảo

- SQL Server 2022: https://learn.microsoft.com/en-us/sql/sql-server/
- mssql npm package: https://github.com/tediousjs/node-mssql
