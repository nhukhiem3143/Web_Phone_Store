import { NextResponse } from "next/server"
import { getAuthCookieName } from "@/lib/auth"

export async function POST() {
  const res = NextResponse.json({ message: "Đã đăng xuất" })
  res.cookies.set(getAuthCookieName(), "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 })
  return res
}


