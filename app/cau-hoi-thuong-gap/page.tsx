"use client"

import { useState } from "react"
import Footer from "@/components/footer"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "Tất cả sản phẩm có phải hàng chính hãng không?",
      answer:
        "Có, 100% sản phẩm của chúng tôi đều là hàng chính hãng từ các nhà phân phối ủy quyền. Chúng tôi cam kết hoàn tiền nếu phát hiện hàng giả.",
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer:
        "Giao hàng miễn phí trong vòng 1-3 ngày tại Hà Nội, 2-5 ngày tại các tỉnh thành khác. Bạn có thể chọn giao hàng nhanh với phí thêm.",
    },
    {
      question: "Có thể trả hàng trong bao lâu?",
      answer: "Bạn có thể trả hàng trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn, chưa sử dụng.",
    },
    {
      question: "Bảo hành sản phẩm như thế nào?",
      answer:
        "Tất cả sản phẩm đều được bảo hành theo quy định của nhà sản xuất. Chúng tôi hỗ trợ xử lý bảo hành miễn phí.",
    },
    {
      question: "Có hỗ trợ thanh toán trả góp không?",
      answer: "Có, chúng tôi hỗ trợ thanh toán trả góp 0% lãi suất qua các ngân hàng và công ty tài chính hàng đầu.",
    },
    {
      question: "Làm sao để theo dõi đơn hàng?",
      answer:
        "Sau khi đặt hàng, bạn sẽ nhận được email xác nhận với mã đơn hàng. Bạn có thể theo dõi đơn hàng trên website hoặc liên hệ với chúng tôi.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
            {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Câu hỏi thường gặp</h1>
          <p className="text-lg text-primary-foreground/90">Tìm câu trả lời cho những câu hỏi của bạn</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition"
              >
                <h3 className="font-semibold text-left">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-border bg-secondary/30">
                  <p className="text-foreground/80">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
