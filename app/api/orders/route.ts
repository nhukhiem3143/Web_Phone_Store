import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery } from "@/config/database"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ orders: [] })

    const query = `
      SELECT 
        id_don_hang,
        so_don_hang,
        tong_tien,
        tien_cuoi_cung,
        trang_thai,
        trang_thai_thanh_toan,
        ngay_tao,
        dia_chi_giao_hang
      FROM don_hang
      WHERE id_nguoi_dung = @uid
      ORDER BY ngay_tao DESC
    `

    const orders = await executeQuery<{
      id_don_hang: number
      so_don_hang: string
      tong_tien: number
      tien_cuoi_cung: number
      trang_thai: string
      trang_thai_thanh_toan: string
      ngay_tao: Date
      dia_chi_giao_hang: string
    }>(query, { uid: Number(payload.sub) })

    // Lấy chi tiết từng đơn hàng
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsQuery = `
          SELECT 
            ctdh.id_chi_tiet_don_hang,
            ctdh.so_luong,
            ctdh.gia_don_vi,
            ctdh.tong_gia,
            sp.ten_san_pham,
            sp.hinh_anh
          FROM chi_tiet_don_hang ctdh
          JOIN san_pham sp ON sp.id_san_pham = ctdh.id_san_pham
          WHERE ctdh.id_don_hang = @orderId
        `
        const items = await executeQuery<{
          id_chi_tiet_don_hang: number
          so_luong: number
          gia_don_vi: number
          tong_gia: number
          ten_san_pham: string
          hinh_anh: string
        }>(itemsQuery, { orderId: order.id_don_hang })

        return {
          ...order,
          items: items.map((item) => ({
            id_chi_tiet_don_hang: item.id_chi_tiet_don_hang,
            ten_san_pham: item.ten_san_pham,
            so_luong: item.so_luong,
            gia_don_vi: item.gia_don_vi,
            tong_gia: item.tong_gia,
            hinh_anh: item.hinh_anh,
          })),
        }
      }),
    )

    return NextResponse.json({
      orders: ordersWithItems.map((o) => ({
        id_don_hang: o.id_don_hang,
        so_don_hang: o.so_don_hang,
        tong_tien: o.tong_tien,
        tien_cuoi_cung: o.tien_cuoi_cung,
        trang_thai: o.trang_thai,
        trang_thai_thanh_toan: o.trang_thai_thanh_toan,
        ngay_tao: o.ngay_tao.toISOString(),
        dia_chi_giao_hang: o.dia_chi_giao_hang,
        items: o.items,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ orders: [] })
  }
}
