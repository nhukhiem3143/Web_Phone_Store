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
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")

    let sqlQuery = `
      SELECT TOP 50
        id_san_pham,
        ten_san_pham,
        thuong_hieu,
        gia_tien,
        hinh_anh,
        danh_gia,
        so_danh_gia
      FROM san_pham
      WHERE trang_thai_hoat_dong = 1
    `

    const params: Record<string, any> = {}

    if (query) {
      sqlQuery += ` AND (ten_san_pham LIKE @query OR thuong_hieu LIKE @query OR mo_ta LIKE @query)`
      params.query = `%${query}%`
    }

    if (brand) {
      sqlQuery += ` AND thuong_hieu = @brand`
      params.brand = brand
    }

    if (minPrice) {
      sqlQuery += ` AND gia_tien >= @minPrice`
      params.minPrice = Number(minPrice)
    }

    if (maxPrice) {
      sqlQuery += ` AND gia_tien <= @maxPrice`
      params.maxPrice = Number(maxPrice)
    }

    if (minRating) {
      sqlQuery += ` AND danh_gia >= @minRating`
      params.minRating = Number(minRating)
    }

    sqlQuery += ` ORDER BY ngay_tao DESC`

    const products = await executeQuery<Product>(sqlQuery, params)

    const formattedProducts = products.map((p) => ({
      id: p.id_san_pham,
      name: p.ten_san_pham,
      brand: p.thuong_hieu,
      price: p.gia_tien,
      image: p.hinh_anh,
      rating: p.danh_gia,
      reviews: p.so_danh_gia,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("[v0] Error searching products:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
