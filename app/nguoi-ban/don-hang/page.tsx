"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Package, Truck, DollarSign, Calendar, User, Phone, MapPin } from "lucide-react"
import { resolveProductImage } from "@/lib/utils"

interface OrderItem {
  id_chi_tiet_don_hang: number
  ten_san_pham: string
  so_luong: number
  gia_don_vi: number
  tong_gia: number
  hinh_anh: string
}

interface Order {
  id_don_hang: number
  so_don_hang: string
  tong_tien: number
  tien_cuoi_cung: number
  trang_thai: string
  trang_thai_thanh_toan: string
  ngay_tao: string
  dia_chi_giao_hang: string
  ten_nguoi_nhan: string
  so_dien_thoai_nhan: string
  ten_nguoi_mua: string | null
  email_nguoi_mua: string
  items: OrderItem[]
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/seller/orders", { cache: "no-store" })
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          setError("Bạn cần đăng nhập để xem đơn hàng")
        } else if (res.status === 403) {
          setError("Bạn chưa phải là người bán. Vui lòng đăng ký làm người bán trước.")
        } else {
          setError(data.error || "Không thể tải đơn hàng")
        }
        setOrders([])
        return
      }
      
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Có lỗi xảy ra khi tải đơn hàng")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleAction = async (orderId: number, action: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        await fetchOrders()
      } else {
        alert("Không thể cập nhật đơn hàng")
      }
    } catch (error) {
      alert("Có lỗi xảy ra")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Package }
      case "Confirmed":
        return { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 }
      case "Shipped":
        return { text: "Đã gửi hàng", color: "bg-purple-100 text-purple-800", icon: Truck }
      case "Delivered":
        return { text: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle2 }
      case "Cancelled":
        return { text: "Đã hủy", color: "bg-red-100 text-red-800", icon: Package }
      default:
        return { text: status, color: "bg-gray-100 text-gray-800", icon: Package }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>
          <div className="animate-pulse">
            <div className="h-64 bg-secondary rounded-lg" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <Button onClick={fetchOrders} variant="outline" disabled={loading}>
            Làm mới
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {orders.length === 0 && !error ? (
          <Card>
            <CardHeader>
              <CardTitle>Chưa có đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Hiện tại bạn chưa có đơn hàng nào. Đơn hàng của khách hàng sẽ hiển thị ở đây.
              </p>
              <p className="text-sm text-muted-foreground">
                Khi có đơn hàng mới, bạn có thể:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left max-w-md mx-auto">
                <li>• Xác nhận đơn hàng</li>
                <li>• Xác nhận gửi hàng</li>
                <li>• Xác nhận thanh toán</li>
                <li>• Xác nhận đã giao hàng</li>
              </ul>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.trang_thai)
              const StatusIcon = statusInfo.icon
              
              return (
                <Card key={order.id_don_hang}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">Đơn hàng #{order.so_don_hang}</CardTitle>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.text}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.ngay_tao).toLocaleString("vi-VN")}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            {order.tien_cuoi_cung.toLocaleString("vi-VN")}₫
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant={order.trang_thai_thanh_toan === "Paid" ? "default" : "secondary"}>
                              {order.trang_thai_thanh_toan === "Paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Thông tin người mua */}
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Thông tin người mua
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tên:</span>{" "}
                          <span className="font-medium">{order.ten_nguoi_nhan}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{order.so_dien_thoai_nhan}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-full">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{order.dia_chi_giao_hang}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sản phẩm */}
                    <div>
                      <h3 className="font-semibold mb-3">Sản phẩm</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id_chi_tiet_don_hang} className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg">
                            <img
                              src={resolveProductImage(item.hinh_anh)}
                              alt={item.ten_san_pham}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.ten_san_pham}</p>
                              <p className="text-sm text-muted-foreground">
                                Số lượng: {item.so_luong} × {item.gia_don_vi.toLocaleString("vi-VN")}₫
                              </p>
                            </div>
                            <p className="font-bold text-primary">
                              {item.tong_gia.toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {order.trang_thai === "Pending" && (
                        <Button
                          onClick={() => handleAction(order.id_don_hang, "confirm")}
                          disabled={updating === order.id_don_hang}
                          className="gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Xác nhận đơn hàng
                        </Button>
                      )}
                      {order.trang_thai === "Confirmed" && (
                        <Button
                          onClick={() => handleAction(order.id_don_hang, "ship")}
                          disabled={updating === order.id_don_hang}
                          variant="outline"
                          className="gap-2"
                        >
                          <Truck className="w-4 h-4" />
                          Xác nhận gửi hàng
                        </Button>
                      )}
                      {order.trang_thai === "Shipped" && (
                        <Button
                          onClick={() => handleAction(order.id_don_hang, "deliver")}
                          disabled={updating === order.id_don_hang}
                          variant="outline"
                          className="gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Xác nhận đã giao
                        </Button>
                      )}
                      {order.trang_thai_thanh_toan === "Unpaid" && (
                        <Button
                          onClick={() => handleAction(order.id_don_hang, "complete_payment")}
                          disabled={updating === order.id_don_hang}
                          variant="default"
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="w-4 h-4" />
                          Xác nhận thanh toán
                        </Button>
                      )}
                      {updating === order.id_don_hang && (
                        <span className="text-sm text-muted-foreground flex items-center">Đang xử lý...</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

