"use client"

import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { resolveProductImage } from "@/lib/utils"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  image: string
  rating: number
  reviews: number
}

export default function ProductCard({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      if (response.ok) {
        alert("Đã thêm vào giỏ hàng")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
      <Link href={`/san-pham/${product.id}`}>
        <div className="relative h-56 bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden">
          <img
            src={resolveProductImage(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">{product.brand}</p>
        <Link href={`/san-pham/${product.id}`}>
          <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-2 mb-3 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-all ${
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">({product.reviews})</span>
        </div>

        <div className="pt-4 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary leading-none">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding}
              variant="outline"
              className="flex-1 gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm</span>
            </Button>
            <Link href={`/thanh-toan?productId=${product.id}&quantity=1`} className="flex-1">
              <Button
                size="sm"
                className="w-full gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                Mua ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
