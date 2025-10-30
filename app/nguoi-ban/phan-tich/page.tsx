import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/auth"
import { executeQuery } from "@/config/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
  const payload = token ? verifyJwt(token) : null
  if (!payload) redirect("/dang-nhap")

  const sellers = await executeQuery<{ id_nguoi_ban: number }>(
    "SELECT id_nguoi_ban FROM nguoi_ban WHERE id_nguoi_dung = @id",
    { id: Number(payload.sub) },
  )
  const seller = sellers[0]
  if (!seller) redirect("/tai-khoan/tro-thanh-nguoi-ban")

  const orders = await executeQuery<{ created_at: Date; tien_cuoi_cung: number; trang_thai: string }>(
    `SELECT ngay_tao as created_at, tien_cuoi_cung as tien_cuoi_cung, trang_thai as trang_thai
     FROM don_hang WHERE id_nguoi_ban = @id ORDER BY ngay_tao ASC`,
    { id: seller.id_nguoi_ban },
  )

  const products = await executeQuery<{ id_san_pham: number; ten_san_pham: string; so_danh_gia: number; danh_gia: number }>(
    `SELECT id_san_pham, ten_san_pham, so_danh_gia, danh_gia FROM san_pham WHERE id_nguoi_ban = @id`,
    { id: seller.id_nguoi_ban },
  )

  // Calculate revenue by month
  const revenueByMonth =
    orders?.reduce(
      (acc, order) => {
        const month = new Date(order.created_at).toLocaleDateString("vi-VN", { month: "short", year: "numeric" })
        const existing = acc.find((item) => item.month === month)
        if (existing) {
          existing.revenue += order.tien_cuoi_cung
        } else {
          acc.push({ month, revenue: order.tien_cuoi_cung })
        }
        return acc
      },
      [] as Array<{ month: string; revenue: number }>,
    ) || []

  // Calculate orders by status
  const ordersByStatus = [
    {
      name: "Hoàn Thành",
      value: orders?.filter((o) => o.trang_thai === "Delivered").length || 0,
    },
    {
      name: "Chờ Xử Lý",
      value: orders?.filter((o) => o.trang_thai === "Pending").length || 0,
    },
    {
      name: "Hủy",
      value: orders?.filter((o) => o.trang_thai === "Cancelled").length || 0,
    },
  ]

  // Calculate top products
  const topProducts =
    products
      ?.sort((a, b) => (b.so_danh_gia || 0) - (a.so_danh_gia || 0))
      .slice(0, 5)
      .map((p) => ({
        name: p.ten_san_pham.substring(0, 15),
        reviews: p.so_danh_gia || 0,
        rating: p.danh_gia || 0,
      })) || []

  const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

  const totalRevenue = orders?.reduce((sum, order) => sum + order.tien_cuoi_cung, 0) || 0
  const totalOrders = orders?.length || 0
  const totalProducts = products?.length || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phân Tích Doanh Số</h1>
          <p className="text-muted-foreground">Xem thống kê chi tiết về cửa hàng của bạn</p>
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
              <CardTitle className="text-sm font-medium">Trung Bình Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOrderValue.toLocaleString()} ₫</div>
              <p className="text-xs text-muted-foreground">Giá trị trung bình</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Đơn hàng</p>
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
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
            <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Tháng</CardTitle>
                <CardDescription>Biểu đồ doanh thu hàng tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="Doanh Thu" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trạng Thái Đơn Hàng</CardTitle>
                  <CardDescription>Phân bố đơn hàng theo trạng thái</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống Kê Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ordersByStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{status.name}</span>
                      </div>
                      <span className="font-semibold">{status.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Sản Phẩm</CardTitle>
                <CardDescription>Sản phẩm có nhiều đánh giá nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reviews" fill="#8b5cf6" name="Số Đánh Giá" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
