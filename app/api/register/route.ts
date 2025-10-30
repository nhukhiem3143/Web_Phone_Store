import { NextResponse } from "next/server"
import { executeNonQuery, executeQuery } from "@/config/database"
import { hashPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ message: "Thiếu email hoặc mật khẩu" }, { status: 400 })
    }

    const existing = await executeQuery<{ count: number }>(
      "SELECT COUNT(1) as count FROM nguoi_dung WHERE email = @email",
      { email },
    )
    if (existing[0]?.count > 0) {
      return NextResponse.json({ message: "Email đã tồn tại" }, { status: 409 })
    }

    const hash = await hashPassword(password)
    await executeNonQuery(
      `INSERT INTO nguoi_dung (email, mat_khau_hash, ho_ten, la_nguoi_ban, trang_thai_hoat_dong)
       VALUES (@email, @hash, @fullName, 0, 1)`,
      { email, hash, fullName: fullName || null },
    )

    return NextResponse.json({ message: "Đăng ký thành công" }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 })
  }
}


