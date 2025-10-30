import { NextResponse } from "next/server"
import { executeQuery } from "@/config/database"

interface Product {
  id_san_pham: number
  ten_san_pham: string
  thuong_hieu: string
  gia_tien: number
  hinh_anh: string
  danh_gia: number
  so_danh_gia: number
  mo_ta: string
  thong_so_ky_thuat: string
  id_nguoi_ban: number
}

export async function GET() {
  try {
    const query = `
      SELECT TOP 20
        id_san_pham,
        ten_san_pham,
        thuong_hieu,
        gia_tien,
        hinh_anh,
        danh_gia,
        so_danh_gia,
        mo_ta,
        thong_so_ky_thuat,
        id_nguoi_ban
      FROM san_pham
      WHERE trang_thai_hoat_dong = 1
      ORDER BY ngay_tao ASC -- Lấy 77 sản phẩm hoạt động cũ nhất
      -- ORDER BY ngay_tao DESC -- Lấy 77 sản phẩm hoạt động mới nhất
    `

    const products = await executeQuery<Product>(query)

    const formattedProducts = products.map((p) => ({
      id: p.id_san_pham,
      name: p.ten_san_pham,
      brand: p.thuong_hieu,
      price: p.gia_tien,
      image: p.hinh_anh,
      rating: p.danh_gia,
      reviews: p.so_danh_gia,
      description: p.mo_ta,
      specs: p.thong_so_ky_thuat ? JSON.parse(p.thong_so_ky_thuat) : {},
      sellerId: p.id_nguoi_ban,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const query = `
      INSERT INTO san_pham (
        id_nguoi_ban, id_danh_muc, ten_san_pham, thuong_hieu, mo_ta,
        gia_tien, so_luong_kho, hinh_anh, thong_so_ky_thuat, danh_gia
      )
      VALUES (
        @id_nguoi_ban, @id_danh_muc, @ten_san_pham, @thuong_hieu, @mo_ta,
        @gia_tien, @so_luong_kho, @hinh_anh, @thong_so_ky_thuat, @danh_gia
      )
    `

    const params = {
      id_nguoi_ban: body.sellerId,
      id_danh_muc: body.categoryId,
      ten_san_pham: body.productName,
      thuong_hieu: body.brand,
      mo_ta: body.description,
      gia_tien: body.price,
      so_luong_kho: body.stock,
      hinh_anh: body.image,
      thong_so_ky_thuat: JSON.stringify(body.specs),
      danh_gia: 0,
    }

    await executeQuery(query, params)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
