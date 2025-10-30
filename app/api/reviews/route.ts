import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeQuery, executeNonQuery } from "@/config/database"
import { verifyJwt } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = Number(searchParams.get("productId"))
  if (!productId) return NextResponse.json({ reviews: [] })
  const rows = await executeQuery<{
    id_danh_gia: number
    id_nguoi_dung: number
    diem_danh_gia: number
    binh_luan: string | null
    ngay_tao: Date
  }>(
    `SELECT id_danh_gia, id_nguoi_dung, diem_danh_gia, binh_luan, ngay_tao
     FROM danh_gia WHERE id_san_pham = @id ORDER BY ngay_tao DESC`,
    { id: productId },
  )
  return NextResponse.json({ reviews: rows })
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const body = await request.json()
    const { productId, rating, comment } = body as { productId: number; rating: number; comment?: string }
    if (!productId || !rating) return NextResponse.json({ error: "invalid" }, { status: 400 })

    await executeNonQuery(
      `INSERT INTO danh_gia (id_san_pham, id_nguoi_dung, diem_danh_gia, binh_luan, la_mua_hang_xac_minh)
       VALUES (@pid, @uid, @rating, @comment, 0)`,
      { pid: Number(productId), uid: Number(payload.sub), rating: Number(rating), comment: comment || null },
    )

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "server" }, { status: 500 })
  }
}


