import Footer from "@/components/footer"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Về PhoneHub</h1>
          <p className="text-lg text-primary-foreground/90">Cửa hàng điện thoại chính hãng uy tín hàng đầu Việt Nam</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            PhoneHub được thành lập vào năm 2020 với mục tiêu mang đến cho khách hàng Việt Nam những chiếc điện thoại
            chính hãng với giá tốt nhất. Chúng tôi tin rằng công nghệ tốt không phải là xa xỉ mà là quyền của mọi người.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Với hơn 5 năm kinh nghiệm, chúng tôi đã phục vụ hơn 100,000 khách hàng hài lòng trên toàn quốc.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Chính hãng 100%",
                description: "Tất cả sản phẩm đều là hàng chính hãng từ các nhà phân phối ủy quyền",
              },
              {
                title: "Giá tốt nhất",
                description: "Cam kết giá cạnh tranh nhất trên thị trường với chất lượng tốt nhất",
              },
              {
                title: "Dịch vụ tuyệt vời",
                description: "Hỗ trợ khách hàng 24/7 với đội ngũ chuyên nghiệp và tận tâm",
              },
            ].map((value, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                </div>
                <p className="text-foreground/70">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Con số ấn tượng</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: "100K+", label: "Khách hàng hài lòng" },
              { number: "500+", label: "Sản phẩm" },
              { number: "50+", label: "Thương hiệu" },
              { number: "24/7", label: "Hỗ trợ khách hàng" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
