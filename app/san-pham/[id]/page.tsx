"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { resolveProductImage } from "@/lib/utils"
import { ShoppingCart, Star, Minus, Plus } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  image: string
  rating: number
  reviews: number
  description: string
  specs: {
    screen: string
    processor: string
    ram: string
    storage: string
    battery: string
  }
  sellerId?: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [myRating, setMyRating] = useState(5)
  const [myComment, setMyComment] = useState("")
  const [shopName, setShopName] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : []
        const found = products.find((p: Product) => p.id === Number(id))
        setProduct(found || null)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!id) return
    fetch(`/api/reviews?productId=${id}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
    
    if (product?.sellerId) {
      fetch(`/api/shop/${product.sellerId}`)
        .then((r) => r.json())
        .then((d) => setShopName(d.shop?.name || null))
        .catch(() => {})
    }
  }, [id, product?.sellerId])

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, quantity }),
      })
      if (response.ok) {
        alert("Đã thêm vào giỏ hàng")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const buyNow = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, quantity: Math.max(1, quantity) }),
      })
      if (response.ok) {
        window.location.href = "/gio-hang"
      }
    } catch (e) {
      console.error(e)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, rating: myRating, comment: myComment }),
      })
      if (res.ok) {
        setMyComment("")
        const d = await fetch(`/api/reviews?productId=${product?.id}`).then((r) => r.json())
        setReviews(d.reviews || [])
      } else {
        alert("Bạn cần đăng nhập để đánh giá")
      }
    } catch {}
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded-lg mb-8" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Sản phẩm không tìm thấy</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img src={resolveProductImage(product.image)} alt={product.name} className="w-full h-auto object-contain max-h-[600px]" />
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}₫</p>
            </div>

            {/* Shop Info */}
            {product.sellerId && shopName && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Cửa hàng:</p>
                <Link href={`/cua-hang/${product.sellerId}`}>
                  <Button variant="outline" className="text-primary hover:underline">
                    {shopName} →
                  </Button>
                </Link>
              </div>
            )}

            {/* Description */}
            <p className="text-foreground mb-6">{product.description}</p>

            {/* Specs */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Thông số kỹ thuật</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Màn hình:</span>
                  <span>{product.specs.screen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processor:</span>
                  <span>{product.specs.processor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM:</span>
                  <span>{product.specs.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bộ nhớ:</span>
                  <span>{product.specs.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pin:</span>
                  <span>{product.specs.battery}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-secondary">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-secondary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button size="lg" onClick={buyNow} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Đánh giá</h3>
            <div className="space-y-4">
              {reviews.length === 0 && <p className="text-muted-foreground">Chưa có đánh giá.</p>}
              {reviews.map((r, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{new Date(r.ngay_tao).toLocaleDateString("vi-VN")}</span>
                    <span className="font-semibold">{r.diem_danh_gia} ⭐</span>
                  </div>
                  <p className="text-sm">{r.binh_luan || ""}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Viết đánh giá của bạn</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-sm mr-2">Số sao:</label>
                <select value={myRating} onChange={(e) => setMyRating(Number(e.target.value))} className="px-3 py-2 rounded-md border border-border bg-background">
                  {[5,4,3,2,1].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)} placeholder="Cảm nhận của bạn..." className="w-full min-h-[120px] px-3 py-2 rounded-md border border-border bg-background" />
              <Button type="submit">Gửi đánh giá</Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}