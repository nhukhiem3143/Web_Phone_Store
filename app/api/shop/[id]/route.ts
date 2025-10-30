import { NextResponse } from "next/server"
import { executeQuery } from "@/config/database"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    
    const shopQuery = `
      SELECT 
        nb.id_nguoi_ban,
        nb.ten_cua_hang,
        nb.mo_ta_cua_hang,
        nb.so_dien_thoai,
        nb.dia_chi,
        nb.thanh_pho,
        nb.da_xac_minh,
        nb.danh_gia_trung_binh,
        COUNT(sp.id_san_pham) as so_san_pham
      FROM nguoi_ban nb
      LEFT JOIN san_pham sp ON sp.id_nguoi_ban = nb.id_nguoi_ban AND sp.trang_thai_hoat_dong = 1
      WHERE nb.id_nguoi_ban = @id
      GROUP BY nb.id_nguoi_ban, nb.ten_cua_hang, nb.mo_ta_cua_hang, nb.so_dien_thoai, 
               nb.dia_chi, nb.thanh_pho, nb.da_xac_minh, nb.danh_gia_trung_binh
    `
    
    const shop = await executeQuery<{
      id_nguoi_ban: number
      ten_cua_hang: string
      mo_ta_cua_hang: string | null
      so_dien_thoai: string | null
      dia_chi: string | null
      thanh_pho: string | null
      da_xac_minh: boolean
      danh_gia_trung_binh: number
      so_san_pham: number
    }>(shopQuery, { id })
    
    if (!shop[0]) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 })
    }
    
    const productsQuery = `
      SELECT 
        id_san_pham,
        ten_san_pham,
        thuong_hieu,
        gia_tien,
        hinh_anh,
        danh_gia,
        so_danh_gia
      FROM san_pham
      WHERE id_nguoi_ban = @id AND trang_thai_hoat_dong = 1
      ORDER BY ngay_tao DESC
    `
    
    const products = await executeQuery<{
      id_san_pham: number
      ten_san_pham: string
      thuong_hieu: string
      gia_tien: number
      hinh_anh: string
      danh_gia: number
      so_danh_gia: number
    }>(productsQuery, { id })
    
    return NextResponse.json({
      shop: {
        id: shop[0].id_nguoi_ban,
        name: shop[0].ten_cua_hang,
        description: shop[0].mo_ta_cua_hang,
        phone: shop[0].so_dien_thoai,
        address: shop[0].dia_chi,
        city: shop[0].thanh_pho,
        verified: shop[0].da_xac_minh,
        rating: shop[0].danh_gia_trung_binh,
        productCount: shop[0].so_san_pham,
      },
      products: products.map((p) => ({
        id: p.id_san_pham,
        name: p.ten_san_pham,
        brand: p.thuong_hieu,
        price: p.gia_tien,
        image: p.hinh_anh,
        rating: p.danh_gia,
        reviews: p.so_danh_gia,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching shop:", error)
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 })
  }
}

