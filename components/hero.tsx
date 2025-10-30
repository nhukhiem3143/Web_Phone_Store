import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/95 to-accent/20 py-24 md:py-32 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          Điện thoại chính hãng
          <br />
          <span className="text-accent-foreground">Giá tốt nhất</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Khám phá bộ sưu tập điện thoại mới nhất từ các thương hiệu hàng đầu thế giới với chất lượng tốt nhất
        </p>
        <Link href="/san-pham">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-base font-semibold px-8 py-6 rounded-xl">
            Mua ngay
          </Button>
        </Link>
      </div>
    </section>
  )
}
