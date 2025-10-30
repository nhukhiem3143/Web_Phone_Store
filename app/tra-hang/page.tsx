import Footer from "@/components/footer"
import { CheckCircle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background">
            <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Chính sách trả hàng</h1>
          <p className="text-lg text-primary-foreground/90">Trả hàng dễ dàng và nhanh chóng</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Return Policy */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Điều kiện trả hàng</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Thời gian trả hàng</h3>
                <p className="text-foreground/70">Bạn có 30 ngày kể từ ngày nhận hàng để trả hàng</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Điều kiện sản phẩm</h3>
                <p className="text-foreground/70">Sản phẩm phải còn nguyên vẹn, chưa sử dụng hoặc sử dụng tối thiểu</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hộp và phụ kiện</h3>
                <p className="text-foreground/70">Hộp, sạc, cáp và tất cả phụ kiện phải đầy đủ</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hoàn tiền</h3>
                <p className="text-foreground/70">Hoàn tiền 100% trong vòng 5-7 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Cách trả hàng</h2>
          <div className="space-y-4">
            {[
              {
                step: "Liên hệ với chúng tôi",
                desc: "Gọi 1900 1234 hoặc email support@phonehub.vn để yêu cầu trả hàng",
              },
              {
                step: "Chuẩn bị sản phẩm",
                desc: "Đóng gói sản phẩm cùng với hộp, sạc và tất cả phụ kiện",
              },
              {
                step: "Gửi trả hàng",
                desc: "Chúng tôi sẽ cung cấp nhãn vận chuyển miễn phí cho bạn",
              },
              {
                step: "Xác nhận và hoàn tiền",
                desc: "Sau khi nhận được hàng, chúng tôi sẽ xác nhận và hoàn tiền cho bạn",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{item.step}</h3>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
