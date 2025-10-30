import Footer from "@/components/footer"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function WarrantyPage() {
  return (
    <main className="min-h-screen bg-background">
            <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Chính sách bảo hành</h1>
          <p className="text-lg text-primary-foreground/90">Bảo vệ toàn diện cho sản phẩm của bạn</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Warranty Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Bảo hành chính hãng</h3>
            </div>
            <p className="text-foreground/70 mb-4">
              Tất cả sản phẩm được bảo hành theo quy định của nhà sản xuất, thường từ 12-24 tháng.
            </p>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>✓ Bảo hành lỗi kỹ thuật</li>
              <li>✓ Bảo hành pin</li>
              <li>✓ Bảo hành màn hình</li>
              <li>✓ Hỗ trợ miễn phí</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Bảo hành mở rộng</h3>
            </div>
            <p className="text-foreground/70 mb-4">Nâng cấp bảo hành của bạn với các gói bảo hành mở rộng toàn diện.</p>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>✓ Bảo hành 36 tháng</li>
              <li>✓ Bảo hành tai nạn</li>
              <li>✓ Bảo hành nước</li>
              <li>✓ Thay thế miễn phí</li>
            </ul>
          </div>
        </div>

        {/* What's Covered */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Bảo hành bao gồm</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            {[
              "Lỗi kỹ thuật và hỏng hóc do nhà sản xuất",
              "Lỗi pin và sạc",
              "Lỗi màn hình và cảm ứng",
              "Lỗi camera và loa",
              "Lỗi phần mềm",
              "Thay thế miễn phí nếu không thể sửa chữa",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's Not Covered */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Bảo hành không bao gồm</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            {[
              "Hư hỏng do rơi, va đập hoặc tai nạn",
              "Hư hỏng do nước (trừ khi có bảo hành nước)",
              "Hư hỏng do sử dụng không đúng cách",
              "Hư hỏng do sửa chữa bởi bên thứ ba",
              "Mất mát hoặc trộm cắp",
              "Hư hỏng do lỗi người dùng",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
