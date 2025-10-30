"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" })
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchUser()
    // Refresh mỗi 2 giây để cập nhật trạng thái đăng nhập
    const interval = setInterval(fetchUser, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch {}
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">PhoneHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/san-pham" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              Sản phẩm
            </Link>
            <Link href="/gioi-thieu" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              Về chúng tôi
            </Link>
            <Link href="/lien-he" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link href="/gio-hang">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ hàng</span>
              </Button>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/tai-khoan">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Tài khoản</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent text-red-500 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/dang-nhap">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/dang-ky">
                      <Button size="sm">Đăng ký</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-2">
            <Link href="/san-pham" className="px-4 py-2 hover:bg-secondary rounded">
              Sản phẩm
            </Link>
            <Link href="/gioi-thieu" className="px-4 py-2 hover:bg-secondary rounded">
              Về chúng tôi
            </Link>
            <Link href="/lien-he" className="px-4 py-2 hover:bg-secondary rounded">
              Liên hệ
            </Link>
            <Link href="/cau-hoi-thuong-gap" className="px-4 py-2 hover:bg-secondary rounded">
              FAQ
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/tai-khoan" className="px-4 py-2 hover:bg-secondary rounded">
                      Tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-secondary rounded text-left text-red-500"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/dang-nhap" className="px-4 py-2 hover:bg-secondary rounded">
                      Đăng nhập
                    </Link>
                    <Link href="/dang-ky" className="px-4 py-2 hover:bg-secondary rounded">
                      Đăng ký
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
