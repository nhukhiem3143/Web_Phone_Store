import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyJwt } from "@/lib/auth"
import { executeNonQuery, executeQuery } from "@/config/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function BecomeSellerPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
  const payload = token ? verifyJwt(token) : null
  if (!payload) redirect("/dang-nhap")

  const users = await executeQuery<{ id_nguoi_dung: number; la_nguoi_ban: boolean }>(
    "SELECT id_nguoi_dung, la_nguoi_ban FROM nguoi_dung WHERE id_nguoi_dung = @id",
    { id: Number(payload.sub) },
  )
  const user = users[0]
  if (!user) redirect("/dang-nhap")

  if (user.la_nguoi_ban) redirect("/nguoi-ban/bang-dieu-khien")

  async function createSeller() {
    "use server"
    const id = Number(payload!.sub)
    await executeNonQuery(
      `UPDATE nguoi_dung SET la_nguoi_ban = 1 WHERE id_nguoi_dung = @id;
       INSERT INTO nguoi_ban (id_nguoi_dung, ten_cua_hang, mo_ta_cua_hang, da_xac_minh)
       VALUES (@id, N'Cửa hàng của tôi', N'Chưa cập nhật', 0);`,
      { id },
    )
    redirect("/nguoi-ban/bang-dieu-khien")
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Đăng Ký Làm Người Bán Hàng</CardTitle>
            <CardDescription>Tạo cửa hàng để bắt đầu bán sản phẩm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createSeller}>
              <Button type="submit" className="w-full">Tạo cửa hàng</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
