import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery } from "@/config/database"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    if (!payload) return NextResponse.json({ seller: null }, { status: 200 })
    const rows = await executeQuery<{ id_nguoi_ban: number }>(
      "SELECT id_nguoi_ban FROM nguoi_ban WHERE id_nguoi_dung = @id",
      { id: Number(payload.sub) },
    )
    const seller = rows[0] ? { id: rows[0].id_nguoi_ban } : null
    return NextResponse.json({ seller }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ seller: null }, { status: 200 })
  }
}


