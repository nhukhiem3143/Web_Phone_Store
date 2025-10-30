import Footer from "@/components/footer"
import { Calendar, User, Share2 } from "lucide-react"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">

      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Nguyễn Văn A
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              28 tháng 1, 2025
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Top 5 điện thoại tốt nhất năm 2025</h1>
          <p className="text-lg text-foreground/70">
            Khám phá những chiếc điện thoại flagship tốt nhất được phát hành trong năm 2025 với hiệu năng vượt trội và
            tính năng đột phá.
          </p>
        </div>

        {/* Featured Image */}
        <div className="h-96 bg-secondary rounded-lg mb-8" />

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <p>
            Năm 2025 đã mang đến những chiếc điện thoại thực sự ấn tượng với công nghệ tiên tiến và thiết kế đẹp mắt.
            Dưới đây là top 5 điện thoại tốt nhất mà chúng tôi khuyên bạn nên xem xét.
          </p>

          <h2>1. iPhone 15 Pro Max</h2>
          <p>
            iPhone 15 Pro Max tiếp tục dẫn đầu với chip A17 Pro mạnh mẽ, camera 48MP chất lượng cao, và thiết kế
            titanium sang trọng. Màn hình Super Retina XDR cung cấp độ sáng và màu sắc tuyệt vời.
          </p>

          <h2>2. Samsung Galaxy S24 Ultra</h2>
          <p>
            Galaxy S24 Ultra là lựa chọn tuyệt vời cho những ai yêu thích Android. Với S Pen tích hợp, camera zoom 10x,
            và hiệu năng Snapdragon 8 Gen 3, đây là một chiếc điện thoại đa năng.
          </p>

          <h2>3. Google Pixel 8 Pro</h2>
          <p>
            Pixel 8 Pro nổi bật với khả năng xử lý ảnh AI tuyệt vời. Magic Eraser, Best Take, và Face Unblur là những
            tính năng độc quyền giúp bạn chụp ảnh tuyệt hơn.
          </p>

          <h2>Kết luận</h2>
          <p>
            Tất cả ba chiếc điện thoại này đều là những lựa chọn tuyệt vời tùy thuộc vào nhu cầu và sở thích của bạn.
            Hãy ghé thăm PhoneHub để tìm hiểu thêm và mua sắm ngay hôm nay!
          </p>
        </div>

        {/* Share */}
        <div className="border-t border-border pt-8 flex items-center gap-4">
          <span className="text-foreground/70">Chia sẻ:</span>
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </article>

      <Footer />
    </main>
  )
}
