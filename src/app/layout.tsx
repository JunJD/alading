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
  title: "AI 模拟面试",
  description: "使用 AI 技术提升面试技巧",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${alibabaPuHuiTi.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
