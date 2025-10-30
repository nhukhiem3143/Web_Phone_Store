import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeNonQuery, executeQuery } from "@/config/database"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const body = await request.json()
    const { ten_cua_hang, mo_ta_cua_hang, so_dien_thoai, dia_chi, thanh_pho } = body

    // Lấy id_nguoi_ban
    const sellers = await executeQuery<{ id_nguoi_ban: number }>(
      "SELECT id_nguoi_ban FROM nguoi_ban WHERE id_nguoi_dung = @id",
      { id: Number(payload.sub) },
    )
    const seller = sellers[0]
    if (!seller) return NextResponse.json({ error: "not_seller" }, { status: 403 })

    await executeNonQuery(
      `UPDATE nguoi_ban 
       SET ten_cua_hang = @name, mo_ta_cua_hang = @desc, so_dien_thoai = @phone, 
           dia_chi = @addr, thanh_pho = @city
       WHERE id_nguoi_ban = @sid`,
      {
        sid: seller.id_nguoi_ban,
        name: ten_cua_hang || "",
        desc: mo_ta_cua_hang || null,
        phone: so_dien_thoai || null,
        addr: dia_chi || null,
        city: thanh_pho || null,
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating shop:", error)
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}

