import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(_request: NextRequest) {
  // No-op middleware now that Supabase Auth is removed
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
