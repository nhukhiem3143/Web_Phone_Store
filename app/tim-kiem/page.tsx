"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  image: string
  rating: number
  reviews: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000])
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (query && products.length > 0) {
      let filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()),
      )

      if (selectedBrand) {
        filtered = filtered.filter((p) => p.brand === selectedBrand)
      }

      filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

      if (sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price)
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating)
      }

      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [query, products, selectedBrand, priceRange, sortBy])

  const brands = [...new Set(products.map((p) => p.brand))]

  return (
    <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Kết quả tìm kiếm</h1>
        <p className="text-muted-foreground mb-8">
          Tìm thấy {filteredProducts.length} kết quả cho "{query}"
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4">Bộ lọc</h3>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm">Thương hiệu</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={selectedBrand === ""}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Tất cả</span>
                  </label>
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm">Giá</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Từ: {priceRange[0].toLocaleString("vi-VN")}₫
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="1000000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Đến: {priceRange[1].toLocaleString("vi-VN")}₫
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="1000000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium mb-3 text-sm">Sắp xếp</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp đến cao</option>
                  <option value="price-high">Giá: Cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary rounded-lg h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm text-muted-foreground">
                  Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
