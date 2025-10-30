"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ShopSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    ten_cua_hang: "",
    mo_ta_cua_hang: "",
    so_dien_thoai: "",
    dia_chi: "",
    thanh_pho: "",
  })

  useEffect(() => {
    fetch("/api/seller/me")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.seller) {
          const shopRes = await fetch(`/api/shop/${data.seller.id}`)
          const shopData = await shopRes.json()
          if (shopData.shop) {
            setFormData({
              ten_cua_hang: shopData.shop.name || "",
              mo_ta_cua_hang: shopData.shop.description || "",
              so_dien_thoai: shopData.shop.phone || "",
              dia_chi: shopData.shop.address || "",
              thanh_pho: shopData.shop.city || "",
            })
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/seller/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert("Đã cập nhật thông tin cửa hàng")
        router.push("/nguoi-ban/bang-dieu-khien")
      } else {
        alert("Có lỗi xảy ra")
      }
    } catch (error) {
      alert("Có lỗi xảy ra")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded-lg" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin cửa hàng</CardTitle>
            <CardDescription>Cập nhật thông tin cửa hàng của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tên cửa hàng *</label>
                <Input
                  value={formData.ten_cua_hang}
                  onChange={(e) => setFormData({ ...formData, ten_cua_hang: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mô tả cửa hàng</label>
                <Textarea
                  value={formData.mo_ta_cua_hang}
                  onChange={(e) => setFormData({ ...formData, mo_ta_cua_hang: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Số điện thoại</label>
                <Input
                  value={formData.so_dien_thoai}
                  onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Địa chỉ</label>
                <Input
                  value={formData.dia_chi}
                  onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Thành phố</label>
                <Input
                  value={formData.thanh_pho}
                  onChange={(e) => setFormData({ ...formData, thanh_pho: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

