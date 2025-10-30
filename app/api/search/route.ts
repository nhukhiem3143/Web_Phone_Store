import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  // Mock search - trong thực tế sẽ tìm kiếm trong database
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      price: 35990000,
      image: "/iphone-15-pro-max.png",
      rating: 5,
      reviews: 128,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      price: 32990000,
      image: "/samsung-galaxy-s24-ultra.png",
      rating: 5,
      reviews: 95,
    },
    // ... more products
  ]

  const results = products.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()),
  )

  return NextResponse.json({ results })
}
