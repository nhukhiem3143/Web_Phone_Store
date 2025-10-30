"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2 } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch cart items
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        const fetchedItems = data.items || []
        setItems(fetchedItems)
        // Không tự động chọn tất cả
        setSelectedItems(new Set())
        setLoading(false)
      })
  }, [])
  
  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }
  
  const selectedTotal = items
    .filter((item) => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleRemove = async (id: number) => {
    try {
      await fetch(`/api/cart?id=${id}`, { method: "DELETE" })
      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Giỏ hàng của bạn trống</p>
            <Link href="/san-pham">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5"
                    />
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-primary font-bold">{item.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">Số lượng: {item.quantity}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đã chọn: {selectedItems.size} sản phẩm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span>{selectedTotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vận chuyển:</span>
                    <span>30.000₫</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{(selectedTotal + 30000).toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
                <Link href="/thanh-toan" className="w-full">
                  <Button className="w-full" disabled={selectedItems.size === 0}>
                    Thanh toán ({selectedItems.size})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
