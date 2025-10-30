import Footer from "@/components/footer"
import { Truck, Clock, MapPin } from "lucide-react"

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background">
            <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Chính sách vận chuyển</h1>
          <p className="text-lg text-primary-foreground/90">Giao hàng nhanh chóng và an toàn</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Truck,
              title: "Giao hàng tiêu chuẩn",
              time: "2-5 ngày",
              price: "Miễn phí",
              desc: "Giao hàng tiêu chuẩn cho toàn quốc",
            },
            {
              icon: Clock,
              title: "Giao hàng nhanh",
              time: "1-2 ngày",
              price: "50,000₫",
              desc: "Giao hàng nhanh cho Hà Nội và TP.HCM",
            },
            {
              icon: MapPin,
              title: "Nhận tại cửa hàng",
              time: "Cùng ngày",
              price: "Miễn phí",
              desc: "Nhận hàng tại cửa hàng PhoneHub",
            },
          ].map((option, i) => {
            const Icon = option.icon
            return (
              <div key={i} className="bg-card border border-border rounded-lg p-6 text-center">
                <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-foreground/70 text-sm mb-4">{option.desc}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Thời gian</p>
                  <p className="font-semibold mb-3">{option.time}</p>
                  <p className="text-primary font-bold">{option.price}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Shipping Info */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Thông tin vận chuyển</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Phí vận chuyển</h3>
              <p className="text-foreground/70">
                Giao hàng miễn phí cho đơn hàng từ 1,000,000₫. Các đơn hàng nhỏ hơn sẽ tính phí vận chuyển 30,000₫.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Theo dõi đơn hàng</h3>
              <p className="text-foreground/70">
                Bạn sẽ nhận được email xác nhận với mã theo dõi. Bạn có thể theo dõi đơn hàng trên website hoặc ứng dụng
                của nhà vận chuyển.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bảo hiểm vận chuyển</h3>
              <p className="text-foreground/70">
                Tất cả sản phẩm được bảo hiểm trong quá trình vận chuyển. Nếu sản phẩm bị hư hỏng, chúng tôi sẽ thay thế
                miễn phí.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
