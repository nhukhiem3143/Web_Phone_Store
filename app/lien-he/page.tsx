"use client"

import type React from "react"

import { useState } from "react"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
            {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-primary-foreground/90">Chúng tôi sẵn sàng giúp bạn 24/7</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Thông tin liên hệ</h2>

            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: "Điện thoại",
                  content: "không nhớ",
                  subtext: "Thứ 2 - Chủ nhật, 8:00 - 22:00",
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: "nhukhiem24@gmail.com",
                  subtext: "Phản hồi trong 24 giờ",
                },
                {
                  icon: MapPin,
                  title: "Địa chỉ",
                  content: "123 Đường ABC, Hà Nội",
                  subtext: "Mở cửa: 8:00 - 22:00 hàng ngày",
                },
                {
                  icon: Clock,
                  title: "Giờ làm việc",
                  content: "Thứ 2 - Chủ nhật",
                  subtext: "8:00 - 22:00",
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-foreground">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.subtext}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Gửi tin nhắn cho chúng tôi</h2>

            {submitted && (
              <div className="mb-4 p-4 bg-accent/10 border border-accent rounded-lg text-accent">
                Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                name="subject"
                placeholder="Chủ đề"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <textarea
                name="message"
                placeholder="Nội dung tin nhắn"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background resize-none"
              />
              <Button type="submit" className="w-full">
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
