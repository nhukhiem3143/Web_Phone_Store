"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const routeMap: Record<string, string> = {
  "san-pham": "Sản phẩm",
  "gio-hang": "Giỏ hàng",
  "thanh-toan": "Thanh toán",
  "tai-khoan": "Tài khoản",
  "dang-nhap": "Đăng nhập",
  "dang-ky": "Đăng ký",
  "nguoi-ban": "Người bán",
  "bang-dieu-khien": "Bảng điều khiển",
  "them-moi": "Thêm mới",
  "phan-tich": "Phân tích",
  "gioi-thieu": "Giới thiệu",
  "lien-he": "Liên hệ",
  "bao-hanh": "Bảo hành",
  "cau-hoi-thuong-gap": "Câu hỏi thường gặp",
  "tra-hang": "Trả hàng",
  "van-chuyen": "Vận chuyển",
  "blog": "Blog",
  "danh-sach": "Danh sách",
  "chi-tiet": "Chi tiết",
  "tro-thanh-nguoi-ban": "Trở thành người bán",
}

function humanize(segment: string): string {
  if (routeMap[segment]) return routeMap[segment]
  return segment
    .replace(/\[[^\]]+\]/g, (m) => m.replace(/[\[\]]/g, ""))
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const [productName, setProductName] = useState<string | null>(null)
  
  const segments = pathname.split("/").filter(Boolean)
  const isHomePage = pathname === "/"
  
  // Lấy tên sản phẩm nếu đang ở trang chi tiết sản phẩm
  useEffect(() => {
    if (segments[0] === "san-pham" && segments[1] && !isNaN(Number(segments[1]))) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          const product = data.find((p: any) => p.id === Number(segments[1]))
          if (product) setProductName(product.name)
        })
        .catch(() => {})
    }
  }, [segments])

  const items = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    let label = humanize(seg)
    
    // Thay ID bằng tên sản phẩm nếu có
    if (segments[0] === "san-pham" && idx === 1 && productName) {
      label = productName
    }
    
    return { href, label }
  })

  if (isHomePage) return null

  return (
    <div className="w-full border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem key="home">
              <BreadcrumbLink asChild>
                <Link href="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.map((item, i) => (
              <span key={`crumb-${item.href}`} className="inline-flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === items.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}


