"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const quantity = searchParams.get("quantity")
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  
  useEffect(() => {
    if (productId && quantity) {
      // Thêm sản phẩm vào giỏ hàng trước khi thanh toán
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: Number(productId), quantity: Number(quantity) }),
      }).catch(() => {})
    }
  }, [productId, quantity])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOrderPlaced(true)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground mb-8">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm.</p>
          <Button onClick={() => (window.location.href = "/")}>Quay lại trang chủ</Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        {/* Steps */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full ${s <= step ? "bg-primary" : "bg-secondary"}`} />
              <p className="text-sm mt-2 text-center">
                {s === 1 ? "Thông tin" : s === 2 ? "Vận chuyển" : "Thanh toán"}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                name="city"
                placeholder="Thành phố"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                name="district"
                placeholder="Quận/Huyện"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                name="ward"
                placeholder="Phường/Xã"
                value={formData.ward}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === "bank"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Quay lại
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} className="ml-auto">
                Tiếp tục
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Đặt hàng
              </Button>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </main>
  )
}
