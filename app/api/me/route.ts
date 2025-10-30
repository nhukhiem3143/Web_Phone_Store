import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAuthCookieName, verifyJwt } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(getAuthCookieName())?.value
  if (!token) return NextResponse.json({ user: null }, { status: 200 })
  const payload = verifyJwt(token)
  if (!payload) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user: payload }, { status: 200 })
}


