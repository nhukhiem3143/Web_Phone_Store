import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery } from "@/config/database"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    // Lấy id_nguoi_ban
    const sellers = await executeQuery<{ id_nguoi_ban: number }>(
      "SELECT id_nguoi_ban FROM nguoi_ban WHERE id_nguoi_dung = @id",
      { id: Number(payload.sub) },
    )
    const seller = sellers[0]
    if (!seller) return NextResponse.json({ error: "not_seller" }, { status: 403 })

    const query = `
      SELECT 
        dh.id_don_hang,
        dh.so_don_hang,
        dh.tong_tien,
        dh.tien_cuoi_cung,
        dh.trang_thai,
        dh.trang_thai_thanh_toan,
        dh.ngay_tao,
        dh.dia_chi_giao_hang,
        dh.ten_nguoi_nhan,
        dh.so_dien_thoai_nhan,
        nd.ho_ten as ten_nguoi_mua,
        nd.email as email_nguoi_mua
      FROM don_hang dh
      JOIN nguoi_dung nd ON nd.id_nguoi_dung = dh.id_nguoi_dung
      WHERE dh.id_nguoi_ban = @sid
      ORDER BY dh.ngay_tao DESC
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
      ten_nguoi_nhan: string
      so_dien_thoai_nhan: string
      ten_nguoi_mua: string | null
      email_nguoi_mua: string
    }>(query, { sid: seller.id_nguoi_ban })

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
        ten_nguoi_nhan: o.ten_nguoi_nhan,
        so_dien_thoai_nhan: o.so_dien_thoai_nhan,
        ten_nguoi_mua: o.ten_nguoi_mua,
        email_nguoi_mua: o.email_nguoi_mua,
        items: o.items,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching seller orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders", orders: [] }, { status: 500 })
  }
}

