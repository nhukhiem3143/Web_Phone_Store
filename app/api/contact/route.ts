import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  // Lưu tin nhắn vào database hoặc gửi email
  console.log("Contact form submission:", body)

  return NextResponse.json({
    success: true,
    message: "Tin nhắn đã được gửi thành công",
  })
}
