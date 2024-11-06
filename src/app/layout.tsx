import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const alibabaPuHuiTi = localFont({
  src: [
    {
      path: './fonts/AlibabaPuHuiTi-3-55-RegularL3.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/AlibabaPuHuiTi-3-65-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/AlibabaPuHuiTi-3-85-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-alibaba-puhui',
  preload: true,
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: true,
  display: 'swap',
  fallback: ['monospace']
});

export const metadata: Metadata = {
  title: "AI 模拟面试 - 提升面试技巧",
  description: "使用 AI 技术提升面试技巧，准备更充分的面试体验。",
  keywords: "AI, 模拟面试, 面试技巧, 人工智能, 职业发展",
  authors: [{ name: "开发者丁俊杰" }],
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="keywords" content="AI, 模拟面试, 面试技巧, 人工智能, 职业发展" />
        <meta name="author" content="开发者丁俊杰" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AI 模拟面试 - 提升面试技巧",
              "url": "https://www.alading.dingjunjie.com",
              "logo": "/vercel.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+86 131 5662 6720",
                "contactType": "Customer Service"
              }
            }
          `}
        </script>
      </head>
      <body
        className={`${alibabaPuHuiTi.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
