import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeNonQuery, executeQuery } from "@/config/database"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const orderId = Number(id)
    const body = await request.json()
    const { action } = body as { action: string }

    // Kiểm tra đơn hàng thuộc về người bán này
    const orderCheck = await executeQuery<{ id_nguoi_ban: number; trang_thai: string }>(
      "SELECT id_nguoi_ban, trang_thai FROM don_hang WHERE id_don_hang = @oid",
      { oid: orderId },
    )
    const order = orderCheck[0]
    if (!order || order.id_nguoi_ban !== seller.id_nguoi_ban) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }

    let newStatus = order.trang_thai
    let newPaymentStatus = ""

    switch (action) {
      case "confirm":
        // Xác nhận đơn hàng
        if (order.trang_thai === "Pending") {
          newStatus = "Confirmed"
        }
        break
      case "ship":
        // Xác nhận gửi hàng
        if (order.trang_thai === "Confirmed") {
          newStatus = "Shipped"
        }
        break
      case "complete_payment":
        // Xác nhận thanh toán thành công
        newPaymentStatus = "Paid"
        break
      case "deliver":
        // Xác nhận đã giao
        if (order.trang_thai === "Shipped") {
          newStatus = "Delivered"
        }
        break
      default:
        return NextResponse.json({ error: "invalid_action" }, { status: 400 })
    }

    let updateQuery = `UPDATE don_hang SET `
    const updateParams: Record<string, any> = { oid: orderId }
    const updates: string[] = []

    if (newStatus !== order.trang_thai) {
      updates.push("trang_thai = @status")
      updateParams.status = newStatus
    }

    if (newPaymentStatus) {
      updates.push("trang_thai_thanh_toan = @payStatus")
      updateParams.payStatus = newPaymentStatus
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "no_change" }, { status: 400 })
    }

    updates.push("ngay_cap_nhat = GETDATE()")
    updateQuery += updates.join(", ") + " WHERE id_don_hang = @oid"

    await executeNonQuery(updateQuery, updateParams)

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}

