import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery, executeNonQuery } from "@/config/database"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Settings } from "lucide-react"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
  const payload = token ? verifyJwt(token) : null
  if (!payload) {
    redirect("/dang-nhap")
  }
  const users = await executeQuery<{
    id_nguoi_dung: number
    email: string
    ho_ten: string | null
    so_dien_thoai: string | null
    dia_chi: string | null
    thanh_pho: string | null
    la_nguoi_ban: boolean
  }>(
    "SELECT id_nguoi_dung, email, ho_ten, so_dien_thoai, dia_chi, thanh_pho, la_nguoi_ban FROM nguoi_dung WHERE id_nguoi_dung = @id",
    { id: Number(payload.sub) },
  )
  const u = users[0]!
  const profile = { full_name: u.ho_ten, email: u.email, phone: u.so_dien_thoai, address: u.dia_chi, city: u.thanh_pho }
  const seller = u.la_nguoi_ban ? { shop_name: "Cửa hàng của tôi", total_sales: 0, average_rating: 0 } : null

  async function updateProfile(formData: FormData) {
    "use server"
    const fullName = String(formData.get("fullName") || "")
    const phone = String(formData.get("phone") || "")
    const address = String(formData.get("address") || "")
    const city = String(formData.get("city") || "")
    await executeNonQuery(
      `UPDATE nguoi_dung SET ho_ten = @fullName, so_dien_thoai = @phone, dia_chi = @address, thanh_pho = @city WHERE id_nguoi_dung = @id`,
      { id: Number(payload!.sub), fullName, phone, address, city },
    )
    redirect("/tai-khoan")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bảng Điều Khiển</h1>
          <p className="text-muted-foreground">Chào mừng, {profile?.full_name || "Khách"}!</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="seller">Trở Thành Người Bán</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Tổng Chi Tiêu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 ₫</div>
                  <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Trạng Thái</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seller ? "Người Bán" : "Khách Hàng"}</div>
                  <p className="text-xs text-muted-foreground">Loại tài khoản</p>
                </CardContent>
              </Card>
            </div>

            {seller && (
              <Card>
                <CardHeader>
                  <CardTitle>Cửa Hàng Của Bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên Cửa Hàng</p>
                    <p className="font-semibold">{seller.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng Doanh Số</p>
                    <p className="font-semibold">{seller.total_sales} sản phẩm đã bán</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đánh Giá Trung Bình</p>
                    <p className="font-semibold">{seller.average_rating} ⭐</p>
                  </div>
                  <Link href="/nguoi-ban/bang-dieu-khien">
                    <Button className="w-full">Quản Lý Cửa Hàng</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="text-center py-8">
              <Link href="/don-hang">
                <Button>Xem tất cả đơn hàng</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
                <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={updateProfile} className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{profile?.email}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Họ và Tên</p>
                      <input name="fullName" defaultValue={profile?.full_name || ""} className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                      <input name="phone" defaultValue={profile?.phone || ""} className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                    <input name="address" defaultValue={profile?.address || ""} className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Thành phố</p>
                    <input name="city" defaultValue={profile?.city || ""} className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                  </div>
                  <Button type="submit" variant="outline" className="bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seller" className="space-y-4">
            {seller ? (
              <Card>
                <CardHeader>
                  <CardTitle>Bạn Đã Là Người Bán</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Bạn đã đăng ký thành công như một người bán hàng. Hãy truy cập bảng điều khiển người bán để quản lý
                    sản phẩm và xem thống kê.
                  </p>
                  <Link href="/nguoi-ban/bang-dieu-khien">
                    <Button>
                      <Store className="w-4 h-4 mr-2" />
                      Bảng Điều Khiển Người Bán
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Trở Thành Người Bán Hàng</CardTitle>
                  <CardDescription>Bắt đầu bán sản phẩm của bạn trên nền tảng của chúng tôi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Đăng ký làm người bán hàng để có thể tạo cửa hàng của riêng bạn, quản lý sản phẩm, và theo dõi doanh
                    số bán hàng.
                  </p>
                  <Link href="/tai-khoan/tro-thanh-nguoi-ban">
                    <Button className="w-full">
                      <Store className="w-4 h-4 mr-2" />
                      Đăng Ký Làm Người Bán
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
