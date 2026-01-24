import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared'
import { Header, Footer } from '@/components/layout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wedsatcoming.com'),
  title: {
    default: '水土曜來了',
    template: '%s | 水土曜來了',
  },
  description:
    '在日語當中，水曜日和土曜日分別代表星期三和星期六的意思，另外也分別代表水星和土星之意，在占星學當中水星象徵個人的心智活動及邏輯思維，土星則有隱含著困難、壓力、磨練等等的意思，而這個技術部落格呼應的就是邏輯思考。',
  keywords: [
    '前端開發',
    'React',
    'Gatsby',
    'JavaScript',
    'TypeScript',
    'Vue',
    'CSS',
    'SCSS',
    '技術部落格',
    '程式設計',
    'Web 開發',
    '水土曜來了',
  ],
  authors: [{ name: 'DannyChen' }],
  creator: 'DannyChen',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://wedsatcoming.com',
    siteName: '水土曜來了',
    title: '水土曜來了',
    description: '水土曜來了技術部落格',
    images: [
      {
        url: '/images/myBlogIcon.png',
        width: 512,
        height: 512,
        alt: '水土曜來了',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '水土曜來了',
    description: '水土曜來了技術部落格',
    images: ['/images/myBlogIcon.png'],
  },
  icons: {
    icon: '/images/myBlogIcon.png',
    apple: '/images/myBlogIcon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
