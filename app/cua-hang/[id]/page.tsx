"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react"

interface Shop {
  id: number
  name: string
  description: string | null
  phone: string | null
  address: string | null
  city: string | null
  verified: boolean
  rating: number
  productCount: number
}

interface Product {
  id: number
  name: string
  brand: string
  price: number
  image: string
  rating: number
  reviews: number
}

export default function ShopPage() {
  const params = useParams()
  const id = params.id as string
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/shop/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data.shop)
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-secondary rounded-lg mb-8" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!shop) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cửa hàng không tìm thấy</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{shop.name}</CardTitle>
              {shop.verified && (
                <CheckCircle2 className="w-5 h-5 text-primary" title="Đã xác minh" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {shop.description && (
              <p className="text-muted-foreground">{shop.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="font-medium">{shop.rating || 0} ⭐</span>
              <span className="text-sm text-muted-foreground">({shop.productCount} sản phẩm)</span>
            </div>
            {shop.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{shop.address}, {shop.city}</span>
              </div>
            )}
            {shop.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{shop.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm của cửa hàng</h2>
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Cửa hàng chưa có sản phẩm</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

