"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 1250,
    totalRevenue: 5000000000,
    totalCustomers: 3500,
    totalProducts: 500,
  })

  const chartData = [
    { month: "Jan", orders: 120, revenue: 400000000 },
    { month: "Feb", orders: 150, revenue: 500000000 },
    { month: "Mar", orders: 180, revenue: 600000000 },
    { month: "Apr", orders: 200, revenue: 700000000 },
    { month: "May", orders: 220, revenue: 800000000 },
    { month: "Jun", orders: 250, revenue: 900000000 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: ShoppingCart,
              label: "Tổng đơn hàng",
              value: stats.totalOrders.toLocaleString("vi-VN"),
              color: "text-blue-500",
            },
            {
              icon: DollarSign,
              label: "Tổng doanh thu",
              value: `${(stats.totalRevenue / 1000000000).toFixed(1)}B₫`,
              color: "text-green-500",
            },
            {
              icon: Users,
              label: "Tổng khách hàng",
              value: stats.totalCustomers.toLocaleString("vi-VN"),
              color: "text-purple-500",
            },
            {
              icon: TrendingUp,
              label: "Tổng sản phẩm",
              value: stats.totalProducts.toLocaleString("vi-VN"),
              color: "text-orange-500",
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Doanh thu theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8b5cf6" name="Đơn hàng" />
              <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Mã đơn</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Tổng tiền</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "ORD001",
                    customer: "Nguyễn Văn A",
                    total: "35,990,000₫",
                    status: "Đã giao",
                    date: "2025-01-28",
                  },
                  {
                    id: "ORD002",
                    customer: "Trần Thị B",
                    total: "32,990,000₫",
                    status: "Đang giao",
                    date: "2025-01-27",
                  },
                  {
                    id: "ORD003",
                    customer: "Lê Văn C",
                    total: "24,990,000₫",
                    status: "Chờ xác nhận",
                    date: "2025-01-26",
                  },
                  { id: "ORD004", customer: "Phạm Thị D", total: "18,990,000₫", status: "Đã giao", date: "2025-01-25" },
                  {
                    id: "ORD005",
                    customer: "Hoàng Văn E",
                    total: "16,990,000₫",
                    status: "Đang giao",
                    date: "2025-01-24",
                  },
                ].map((order, i) => (
                  <tr key={i} className="border-b border-border hover:bg-secondary">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.total}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Đã giao"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Đang giao"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
