import type React from "react";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/header";
import Breadcrumbs from "@/components/breadcrumbs";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PhoneHub - Cửa hàng điện thoại",
  description: "Mua điện thoại chính hãng với giá tốt nhất",
  generator: "v0.app",
  icons: {
    icon: '/icon.png',  // Thêm favicon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} font-sans antialiased`}>
        <Header />
        <Breadcrumbs />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
