"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Calendar, DollarSign, CheckCircle2, Truck } from "lucide-react"
import { resolveProductImage } from "@/lib/utils"

interface Order {
  id_don_hang: number
  so_don_hang: string
  tong_tien: number
  tien_cuoi_cung: number
  trang_thai: string
  trang_thai_thanh_toan: string
  ngay_tao: string
  dia_chi_giao_hang: string
  items?: OrderItem[]
}

interface OrderItem {
  id_chi_tiet_don_hang: number
  ten_san_pham: string
  so_luong: number
  gia_don_vi: number
  tong_gia: number
  hinh_anh: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Confirmed":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận"
      case "Confirmed":
        return "Đã xác nhận"
      case "Shipped":
        return "Đã gửi hàng"
      case "Delivered":
        return "Đã giao"
      case "Cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
              <Link href="/san-pham">
                <Button>Tiếp tục mua sắm</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id_don_hang}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Đơn hàng #{order.so_don_hang}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.ngay_tao).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {order.tien_cuoi_cung.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.trang_thai)}`}
                    >
                      {getStatusText(order.trang_thai)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Trạng thái đơn hàng chi tiết */}
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Trạng thái đơn hàng</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {order.trang_thai === "Pending" ? (
                            <Package className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          <span className={order.trang_thai === "Pending" ? "" : "line-through text-muted-foreground"}>
                            Chờ người bán xác nhận
                          </span>
                          {order.trang_thai !== "Pending" && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                        </div>
                        {order.trang_thai !== "Pending" && (
                          <div className="flex items-center gap-2">
                            {order.trang_thai === "Confirmed" ? (
                              <Package className="w-5 h-5 text-blue-600" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            )}
                            <span className={["Shipped", "Delivered"].includes(order.trang_thai) ? "line-through text-muted-foreground" : ""}>
                              Người bán đã xác nhận đơn hàng
                            </span>
                            {["Shipped", "Delivered"].includes(order.trang_thai) && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                            )}
                          </div>
                        )}
                        {["Shipped", "Delivered"].includes(order.trang_thai) && (
                          <div className="flex items-center gap-2">
                            {order.trang_thai === "Shipped" ? (
                              <Truck className="w-5 h-5 text-purple-600" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            )}
                            <span className={order.trang_thai === "Delivered" ? "line-through text-muted-foreground" : ""}>
                              Người bán đã gửi hàng
                            </span>
                            {order.trang_thai === "Delivered" && (
                              <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                            )}
                          </div>
                        )}
                        {order.trang_thai === "Delivered" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Đơn hàng đã được giao thành công</span>
                            <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thanh toán */}
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Trạng thái thanh toán</h4>
                      <div className="flex items-center gap-2">
                        {order.trang_thai_thanh_toan === "Paid" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="font-medium">
                          {order.trang_thai_thanh_toan === "Paid" ? "Đã thanh toán thành công" : "Chưa thanh toán"}
                        </span>
                        {order.trang_thai_thanh_toan === "Paid" && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    </div>

                    {/* Sản phẩm */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Sản phẩm trong đơn hàng</h4>
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
                    )}

                    {/* Địa chỉ */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Địa chỉ giao hàng:</p>
                      <p className="text-sm">{order.dia_chi_giao_hang}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

