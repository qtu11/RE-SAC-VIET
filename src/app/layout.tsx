import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import './vietnam.css'

export const metadata: Metadata = {
  title: 'RE:SẮC STUDIO — Tủ đồ di sản, sắc Việt của tôi',
  description: 'Khám phá áo ngũ thân, áo tứ thân, áo dài và nhật bình. Phối sắc riêng, lưu tủ đồ của bạn và tìm hiểu câu chuyện Việt phục.',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f8f3e9',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>
}
