import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery, executeNonQuery } from "@/config/database"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { fullName, phone, address, city, paymentMethod } = await request.json()

    // Lấy giỏ hàng hiện tại
    const cartRows = await executeQuery<{
      id_chi_tiet_gio: number
      id_san_pham: number
      so_luong: number
      gia_tien: number
      id_nguoi_ban: number
    }>(
      `SELECT ci.id_chi_tiet_gio, ci.id_san_pham, ci.so_luong, p.gia_tien, p.id_nguoi_ban
       FROM chi_tiet_gio ci
       JOIN gio_hang g ON g.id_gio = ci.id_gio
       JOIN san_pham p ON p.id_san_pham = ci.id_san_pham
       WHERE g.id_nguoi_dung = @uid`,
      { uid: Number(payload.sub) },
    )

    if (cartRows.length === 0) return NextResponse.json({ error: "empty_cart" }, { status: 400 })

    const idNguoiBan = cartRows[0].id_nguoi_ban
    const tongTien = cartRows.reduce((s, r) => s + r.gia_tien * r.so_luong, 0)
    const vanChuyen = 30000
    const cuoiCung = tongTien + vanChuyen
    const soDonHang = `ORD-${Date.now()}`

    const insertOrder = `
      INSERT INTO don_hang (
        id_nguoi_dung, id_nguoi_ban, so_don_hang, tong_tien, chi_phi_van_chuyen,
        tien_cuoi_cung, trang_thai, trang_thai_thanh_toan, dia_chi_giao_hang, ten_nguoi_nhan, so_dien_thoai_nhan
      ) VALUES (
        @uid, @sid, @code, @tong, @ship, @final, 'Pending', @pay, @addr, @name, @phone
      )
      SELECT SCOPE_IDENTITY() as id_don_hang
    `

    const orderRows = await executeQuery<{ id_don_hang: number }>(insertOrder, {
      uid: Number(payload.sub),
      sid: idNguoiBan,
      code: soDonHang,
      tong: tongTien,
      ship: vanChuyen,
      final: cuoiCung,
      pay: paymentMethod === 'cod' ? 'Unpaid' : 'Paid',
      addr: address + ", " + city,
      name: fullName,
      phone,
    })
    const idDonHang = orderRows[0].id_don_hang

    for (const item of cartRows) {
      await executeNonQuery(
        `INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, gia_don_vi, tong_gia)
         VALUES (@order, @product, @qty, @price, @total)`,
        { order: idDonHang, product: item.id_san_pham, qty: item.so_luong, price: item.gia_tien, total: item.gia_tien * item.so_luong },
      )
    }

    // Xóa giỏ hàng sau khi đặt đơn
    await executeNonQuery(
      `DELETE ci FROM chi_tiet_gio ci JOIN gio_hang g ON g.id_gio = ci.id_gio WHERE g.id_nguoi_dung = @uid`,
      { uid: Number(payload.sub) },
    )

    return NextResponse.json({ success: true, orderId: idDonHang })
  } catch (e) {
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}


