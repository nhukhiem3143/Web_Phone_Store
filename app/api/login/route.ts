import { NextResponse } from "next/server"
import { executeQuery } from "@/config/database"
import { signJwt, getAuthCookieName } from "@/lib/auth"
import { verifyPassword } from "@/lib/password"

type UserRow = {
  id_nguoi_dung: number
  email: string
  mat_khau_hash: string
  ho_ten: string | null
  la_nguoi_ban: boolean
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ message: "Thiếu email hoặc mật khẩu" }, { status: 400 })
    }

    const users = await executeQuery<UserRow>(
      `SELECT id_nguoi_dung, email, mat_khau_hash, ho_ten, la_nguoi_ban
       FROM nguoi_dung WHERE email = @email AND trang_thai_hoat_dong = 1`,
      { email },
    )

    const user = users[0]
    if (!user) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.mat_khau_hash)

    if (!valid) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng" }, { status: 401 })
    }

    const token = signJwt({
      sub: String(user.id_nguoi_dung),
      email: user.email,
      ho_ten: user.ho_ten,
      la_nguoi_ban: !!user.la_nguoi_ban,
    })

    const res = NextResponse.json({ message: "Đăng nhập thành công" })
    const cookieName = getAuthCookieName()
    res.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 })
  }
}


