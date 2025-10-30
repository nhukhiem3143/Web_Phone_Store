import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-card to-secondary/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">PhoneHub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Cửa hàng điện thoại chính hãng uy tín hàng đầu Việt Nam</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-5 text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/san-pham" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/blog/danh-sach" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/cau-hoi-thuong-gap" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-base mb-5 text-foreground">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/lien-he" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/van-chuyen" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/tra-hang" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Trả hàng
                </Link>
              </li>
              <li>
                <Link href="/bao-hanh" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-5 text-foreground">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground font-medium">1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground font-medium">nhukhiem24@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground font-medium leading-relaxed">Tích Lương , Thái Nguyên</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">© 2025 PhoneHub. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
