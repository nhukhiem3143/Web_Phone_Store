import Footer from "@/components/footer"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      id: 1,
      title: "Top 5 điện thoại tốt nhất năm 2025",
      excerpt: "Khám phá những chiếc điện thoại flagship tốt nhất được phát hành trong năm 2025...",
      author: "Nguyễn Văn A",
      date: "2025-01-28",
      category: "Đánh giá",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Cách chọn điện thoại phù hợp với nhu cầu của bạn",
      excerpt: "Hướng dẫn chi tiết giúp bạn chọn được chiếc điện thoại phù hợp nhất...",
      author: "Trần Thị B",
      date: "2025-01-25",
      category: "Hướng dẫn",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Mẹo bảo vệ pin điện thoại của bạn",
      excerpt: "Những mẹo hữu ích để kéo dài tuổi thọ pin của điện thoại...",
      author: "Lê Văn C",
      date: "2025-01-22",
      category: "Mẹo & Thủ thuật",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      title: "So sánh camera: iPhone vs Samsung vs Google Pixel",
      excerpt: "Phân tích chi tiết khả năng chụp ảnh của ba flagship hàng đầu...",
      author: "Phạm Thị D",
      date: "2025-01-20",
      category: "So sánh",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      title: "Xu hướng công nghệ điện thoại trong năm 2025",
      excerpt: "Những công nghệ mới sẽ thay đổi cách chúng ta sử dụng điện thoại...",
      author: "Hoàng Văn E",
      date: "2025-01-18",
      category: "Tin tức",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      title: "Hướng dẫn sử dụng AI trên điện thoại hiện đại",
      excerpt: "Tìm hiểu cách tận dụng tối đa các tính năng AI trên điện thoại của bạn...",
      author: "Nguyễn Văn F",
      date: "2025-01-15",
      category: "Hướng dẫn",
      image: "/placeholder.svg",
    },
  ]

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Blog PhoneHub</h1>
          <p className="text-lg text-primary-foreground/90">Những bài viết hữu ích về công nghệ điện thoại</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="mb-16 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-auto bg-secondary" />
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  Đánh giá
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{posts[0].title}</h2>
              <p className="text-foreground/70 mb-4">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {posts[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(posts[0].date).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <Link
                href={`/blog/${posts[0].id}`}
                className="mt-4 inline-flex items-center gap-2 text-primary hover:gap-3 transition"
              >
                Đọc tiếp <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                <div className="h-40 bg-secondary" />
                <div className="p-4 flex-1 flex flex-col">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded w-fit mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
