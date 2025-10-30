# PhoneHub - Cửa hàng điện thoại chính hãng

Một ứng dụng Next.js full-stack để bán điện thoại chính hãng với đầy đủ chức năng.

## Tính năng

### Frontend
- Trang chủ với hero section và sản phẩm nổi bật
- Danh sách sản phẩm với lọc theo thương hiệu, giá, và sắp xếp
- Chi tiết sản phẩm với thông số kỹ thuật
- Giỏ hàng với quản lý số lượng
- Thanh toán 3 bước (thông tin, vận chuyển, thanh toán)
- Tìm kiếm sản phẩm
- Blog với bài viết chi tiết
- Trang About, Contact, FAQ
- Chính sách bảo hành, trả hàng, vận chuyển

### Backend
- API Routes cho sản phẩm, giỏ hàng, đơn hàng
- API tìm kiếm và lọc sản phẩm
- API liên hệ

### Admin
- Dashboard với thống kê
- Biểu đồ doanh thu
- Danh sách đơn hàng

## Cấu trúc thư mục

```
phone-sales-website/  
├── app/  
│   ├── page.tsx                 # Trang chủ  
│   ├── layout.tsx               # Layout chính  
│   ├── globals.css              # CSS toàn cục  
│   ├── api/  
│   │   ├── products/            # API sản phẩm  
│   │   ├── cart/                # API giỏ hàng  
│   │   ├── orders/              # API đơn hàng  
│   │   ├── contact/             # API liên hệ  
│   │   └── search/              # API tìm kiếm  
│   ├── products/  
│   │   ├── page.tsx             # Danh sách sản phẩm  
│   │   └── [id]/  
│   │       └── page.tsx         # Chi tiết sản phẩm  
│   ├── cart/  
│   │   └── page.tsx             # Giỏ hàng  
│   ├── checkout/  
│   │   └── page.tsx             # Thanh toán  
│   ├── search/  
│   │   └── page.tsx             # Kết quả tìm kiếm  
│   ├── blog/  
│   │   ├── page.tsx             # Danh sách blog  
│   │   └── [id]/  
│   │       └── page.tsx         # Chi tiết blog  
│   ├── about/  
│   │   └── page.tsx             # Về chúng tôi  
│   ├── contact/  
│   │   └── page.tsx             # Liên hệ  
│   ├── faq/  
│   │   └── page.tsx             # FAQ  
│   ├── warranty/  
│   │   └── page.tsx             # Bảo hành  
│   ├── returns/  
│   │   └── page.tsx             # Trả hàng  
│   ├── shipping/  
│   │   └── page.tsx             # Vận chuyển  
│   └── admin/  
│       └── page.tsx             # Admin Dashboard  
├── components/  
│   ├── header.tsx               # Header  
│   ├── footer.tsx               # Footer  
│   ├── hero.tsx                 # Hero section  
│   ├── product-grid.tsx         # Lưới sản phẩm  
│   ├── product-card.tsx         # Thẻ sản phẩm  
│   └── search-bar.tsx           # Thanh tìm kiếm  
├── public/  
│   └── [images]                 # Hình ảnh sản phẩm  
└── package.json  
```

## Công nghệ sử dụng

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Cài đặt

1. Clone repository
2. Cài đặt dependencies: `npm install`
3. Chạy development server: `npm run dev`
4. Mở http://localhost:3000

## Tính năng chính

### Quản lý sản phẩm
- Danh sách sản phẩm với hình ảnh, giá, đánh giá
- Lọc theo thương hiệu, giá
- Sắp xếp theo giá, đánh giá
- Tìm kiếm sản phẩm

### Giỏ hàng
- Thêm/xóa sản phẩm
- Cập nhật số lượng
- Tính tổng tiền

### Thanh toán
- Thông tin khách hàng
- Địa chỉ giao hàng
- Phương thức thanh toán (COD, chuyển khoản)

### Nội dung
- Blog với bài viết chi tiết
- Trang About, Contact, FAQ
- Chính sách bảo hành, trả hàng, vận chuyển

### Admin
- Dashboard với thống kê
- Biểu đồ doanh thu
- Danh sách đơn hàng

## Hỗ trợ

Nếu bạn có bất kỳ câu hỏi hoặc vấn đề, vui lòng liên hệ:
- Email: support@phonehub.vn
- Điện thoại: 1900 1234
- Website: https://phonehub.vn
