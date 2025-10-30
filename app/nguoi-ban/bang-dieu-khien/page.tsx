import { redirect } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { executeQuery } from "@/config/database"
import { verifyJwt } from "@/lib/auth"

export default async function SellerDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
  const payload = token ? verifyJwt(token) : null
  if (!payload) {
    redirect("/dang-nhap")
  }

  // Lấy thông tin người dùng từ bảng nguoi_dung
  const users = await executeQuery<{
    id_nguoi_dung: number
    email: string
    ho_ten: string | null
    so_dien_thoai: string | null
    dia_chi: string | null
    thanh_pho: string | null
    la_nguoi_ban: boolean
  }>(
    `SELECT id_nguoi_dung, email, ho_ten, so_dien_thoai, dia_chi, thanh_pho, la_nguoi_ban
     FROM nguoi_dung WHERE id_nguoi_dung = @id`,
    { id: Number(payload.sub) },
  )

  const user = users[0]
  if (!user) redirect("/dang-nhap")
  if (!user.la_nguoi_ban) redirect("/tai-khoan/tro-thanh-nguoi-ban")

  // Lấy thông tin người bán từ bảng nguoi_ban
  const sellers = await executeQuery<{
    id_nguoi_ban: number
    ten_cua_hang: string
    mo_ta_cua_hang: string | null
    so_dien_thoai: string | null
    dia_chi: string | null
    thanh_pho: string | null
    da_xac_minh: boolean
    tong_doanh_so: number
    danh_gia_trung_binh: number
  }>(
    `SELECT id_nguoi_ban, ten_cua_hang, mo_ta_cua_hang, so_dien_thoai, dia_chi, thanh_pho, da_xac_minh,
            tong_doanh_so, danh_gia_trung_binh
     FROM nguoi_ban WHERE id_nguoi_dung = @id`,
    { id: user.id_nguoi_dung },
  )

  const seller = sellers[0]
  if (!seller) redirect("/tai-khoan/tro-thanh-nguoi-ban")

  // Lấy sản phẩm của người bán
  const products = await executeQuery<{
    id_san_pham: number
    ten_san_pham: string
    gia_tien: number
    so_luong_kho: number
    danh_gia: number
  }>(
    `SELECT id_san_pham, ten_san_pham, gia_tien, so_luong_kho, danh_gia
     FROM san_pham WHERE id_nguoi_ban = @id AND trang_thai_hoat_dong = 1`,
    { id: seller.id_nguoi_ban },
  )

  // Các thống kê tối thiểu (placeholder, vì chưa có bảng đơn hàng/sản phẩm theo chuẩn mới)
  const totalRevenue = seller.tong_doanh_so || 0
  const totalOrders = 0
  const totalProducts = products.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bảng Điều Khiển Người Bán</h1>
            <p className="text-muted-foreground">Quản lý cửa hàng và sản phẩm của bạn</p>
          </div>
          <div className="flex gap-2">
            <Link href="/nguoi-ban/san-pham/them-moi">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Sản Phẩm
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₫</div>
              <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Sản Phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Sản phẩm đang bán</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Đánh Giá</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seller.danh_gia_trung_binh ?? 0} ⭐</div>
              <p className="text-xs text-muted-foreground">Đánh giá trung bình</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="shop">Cửa Hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quản Lý Đơn Hàng</h2>
              <Link href="/nguoi-ban/don-hang">
                <Button variant="outline">Xem tất cả đơn hàng</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Quản lý và duyệt đơn hàng của khách hàng tại đây
                </p>
                <Link href="/nguoi-ban/don-hang">
                  <Button>Quản lý đơn hàng</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quản Lý Sản Phẩm</h2>
              <Link href="/nguoi-ban/san-pham/them-moi">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </Link>
            </div>
            {products.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">Bạn chưa có sản phẩm nào</p>
                  <Link href="/nguoi-ban/san-pham/them-moi">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm Sản Phẩm Đầu Tiên
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên Sản Phẩm</TableHead>
                          <TableHead>Giá</TableHead>
                          <TableHead>Kho</TableHead>
                          <TableHead>Đánh Giá</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id_san_pham}>
                            <TableCell className="font-medium">{product.ten_san_pham}</TableCell>
                            <TableCell>{product.gia_tien.toLocaleString("vi-VN")} ₫</TableCell>
                            <TableCell>{product.so_luong_kho}</TableCell>
                            <TableCell>{product.danh_gia} ⭐</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>


          <TabsContent value="shop" className="space-y-4">
            <h2 className="text-xl font-semibold">Thông Tin Cửa Hàng</h2>

            <Card>
              <CardHeader>
                <CardTitle>Chi Tiết Cửa Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tên Cửa Hàng</p>
                  <p className="font-semibold">{seller.ten_cua_hang}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mô Tả</p>
                  <p className="font-semibold">{seller.mo_ta_cua_hang || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa Chỉ</p>
                  <p className="font-semibold">
                    {seller.dia_chi || "Chưa cập nhật"}, {seller.thanh_pho || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
                  <p className="font-semibold">{seller.so_dien_thoai || "Chưa cập nhật"}</p>
                </div>
                <Link href="/nguoi-ban/cai-dat">
                  <Button variant="outline" className="w-full">
                    Chỉnh Sửa Thông Tin Cửa Hàng
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
