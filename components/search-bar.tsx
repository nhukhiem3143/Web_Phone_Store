"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  brand: string
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data)
      })
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query, allProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query)}`)
      setQuery("")
      setIsOpen(false)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (productName: string) => {
    router.push(`/tim-kiem?q=${encodeURIComponent(productName)}`)
    setQuery("")
    setIsOpen(false)
    setSuggestions([])
  }

  return (
    <div className="relative flex-1 max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm điện thoại..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background pl-10"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setSuggestions([])
            }}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product.name)}
              className="w-full text-left px-4 py-2 hover:bg-secondary transition border-b border-border last:border-b-0"
            >
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
